# GitHub Actions workflows

This directory holds the CI/CD pipeline for the `soroush.tech` monorepo. There is
**one** CI workflow for the whole workspace and **three** deployment workflows (one a
scaffold) that are gated on CI success — deploys never run off a raw `push`.

| File                                       | Name                              | Trigger                                                      |
| ------------------------------------------ | --------------------------------- | ------------------------------------------------------------ |
| [`ci.yml`](./ci.yml)                       | `Continuous Integration`          | `push` to `main`, every `pull_request`                       |
| [`cd-web.yml`](./cd-web.yml)               | Pages deploy                      | `workflow_run` of CI (success, `main`) + `workflow_dispatch` |
| [`cd-worker-api.yml`](./cd-worker-api.yml) | Cloudflare Worker deploy          | `workflow_run` of CI (success, `main`) + `workflow_dispatch` |
| [`cd-packages.yml`](./cd-packages.yml)     | Publish Packages (npm) — scaffold | `workflow_run` of CI (success, `main`) + `workflow_dispatch` |

**Per-workflow deep dives** (every step + caching):
[`ci.md`](./ci.md) · [`cd-web.md`](./cd-web.md) · [`cd-worker-api.md`](./cd-worker-api.md) · [`cd-packages.md`](./cd-packages.md)

## How the pieces fit together

CI runs on every push/PR. On a successful `main` run it uploads a single
[`changes.json`](./ci.md#changesjson) artifact; the three CD workflows then start via
`workflow_run`, download it, and each applies its **own condition** to decide whether
to deploy/publish.

```mermaid
flowchart LR
    push["push to main"] --> ci["CI — Continuous Integration"]
    pr["pull_request"] --> ci
    ci -->|"uploads artifact"| art[("changes.json<br/>apps · worker · packages<br/>workflows · root")]
    ci -->|"workflow_run: completed + success on main"| cdweb["CD — Pages"]
    ci -->|"workflow_run: completed + success on main"| cdworker["CD — Worker API"]
    ci -->|"workflow_run: completed + success on main"| cdpkg["CD — Packages (scaffold)"]
    art -.->|"download-artifact"| cdweb
    art -.->|"download-artifact"| cdworker
    art -.->|"download-artifact"| cdpkg
    cdweb --> pages["GitHub Pages"]
    cdworker --> cf["Cloudflare Worker"]
    cdpkg --> npm["npm registry"]
```

Why an artifact? A `workflow_run` event carries no diff base of its own, so the CD
workflows can't compute what changed. CI already computed it against
`github.event.before..after`, records the answer in `changes.json`, and hands it off
through the artifact. Each CD reads the file and applies its own condition (e.g. web
deploys on `apps`/`packages`/`root`); the policy lives in CD, the facts in CI. If the
artifact is missing (e.g. a manual `workflow_dispatch`), CD falls back to deploying.

## `ci.yml` — Continuous Integration

A single `prepare` job detects everything once and exposes it as outputs; the heavy
jobs fan out from it and are **gated by change detection** so a package-only PR never
spins up the tri-OS web suite. `ci-ok` is the one stable status check used for branch
protection — it tolerates change-gated jobs being skipped and fails only if a needed
job actually failed or was cancelled.

```mermaid
flowchart TD
    prepare["prepare<br/>• node version (.nvmrc)<br/>• package manager<br/>• playwright version<br/>• changed entities → changes.json<br/>• upload changes.json"]
    lint["lint<br/>lint + typecheck (recursive)"]
    packages["packages (matrix)<br/>if has_packages == true"]
    worker["worker<br/>if worker == true"]
    web["web (tri-OS)<br/>if web == true"]
    ciok["ci-ok<br/>branch-protection gate<br/>(if: always)"]

    prepare --> lint
    lint --> packages
    lint --> worker
    lint --> web
    packages --> ciok
    worker --> ciok
    web --> ciok
    lint --> ciok
    prepare --> ciok
```

### `prepare` outputs

Detect once, reuse via `needs.prepare.outputs.*` — node version is always read from
`.nvmrc`, never hard-coded.

| Output                              | Source                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `node_version`                      | `.nvmrc`                                                                                        |
| `manager` / `command` / `runner`    | presence of `pnpm-lock.yaml` / `yarn.lock` / etc.                                               |
| `playwright_version`                | `@playwright/test` version in `apps/web/package.json` (used in the Playwright binary cache key) |
| `web` / `worker`                    | derived booleans for the CI jobs (own area, a bundled dep, or infra changed)                    |
| `has_packages` / `changed_packages` | the CI `packages` matrix (changed packages, or all on an infra change)                          |

CI also writes the [`changes.json`](./ci.md#changesjson) artifact the CD side reads.

### Change detection

A per-entity `dorny/paths-filter` config is generated from the workspace: one key per
app, worker, package, and workflow file, plus `root` (top-level files only). The
matched keys become the `changes.json` lists. Dependency and infra policy is **not**
baked into the filters — it lives in each consumer's condition (CI gating in
`prepare`, deploy/publish gating in each CD workflow).

```mermaid
flowchart LR
    subgraph filters["paths-filter (per entity)"]
        appf["app__&lt;name&gt;:<br/>apps/&lt;name&gt;/**"]
        workerf["worker__&lt;name&gt;:<br/>workers/&lt;name&gt;/**"]
        pkgf["pkg__&lt;name&gt;:<br/>packages/&lt;name&gt;/**"]
        wff["wf__&lt;name&gt;:<br/>.github/workflows/&lt;name&gt;.yml"]
        rootf["root:<br/>top-level files"]
    end
    filters --> cj[("changes.json")]
```

### The `web` job (tri-OS)

Runs on `ubuntu-latest`, `windows-latest`, `macOS-latest`. The unit `test` runs on
every OS; coverage tiers and Storybook/Chromatic run only on ubuntu; the E2E browsers
are split across OSes so each engine runs on its native platform (macOS is ~10× the
cost — used only for WebKit).

| Step                       | ubuntu | windows | macOS |
| -------------------------- | :----: | :-----: | :---: |
| Build (`SKIP_PRERENDER`)   |   ✅   |         |       |
| Tests                      |   ✅   |   ✅    |  ✅   |
| Unit coverage → Codecov    |   ✅   |         |       |
| Browser coverage → Codecov |   ✅   |         |       |
| Chromatic + Storybook cov. |   ✅   |         |       |
| E2E Chromium               |   ✅   |         |       |
| E2E Firefox                |        |   ✅    |       |
| E2E WebKit                 |        |         |  ✅   |

The Playwright browser binaries are cached by `runner.os` + Playwright version, with a
fixed `PLAYWRIGHT_BROWSERS_PATH` so one cache path/key works across all three OSes.

### Coverage → Codecov

Each workspace emits its own `coverage/lcov.info` and uploads under its own **flag**;
Codecov merges uploads by commit SHA. 100% coverage is enforced inside each
`vitest.config` — Codecov is for reporting, not the gate.

| Flag                 | Source                              |
| -------------------- | ----------------------------------- |
| `<pkg>` (per matrix) | `packages/<pkg>/coverage/lcov.info` |
| `api`                | `workers/api/coverage/lcov.info`    |
| `unit`               | web unit (jsdom)                    |
| `browser`            | web browser-mode unit               |
| `storybook`          | Storybook test runner               |
| `e2e`                | web Playwright (`coverage/e2e`)     |

## `cd-web.yml` — GitHub Pages deploy

```mermaid
flowchart TD
    trig["workflow_run success<br/>or workflow_dispatch"] --> changes["changes<br/>download changes.json →<br/>web = apps∋web ∥ packages≠[] ∥ root"]
    changes -->|"web == true"| build["build<br/>vite build → upload-pages-artifact"]
    changes -->|"web == false"| skip["(skipped)"]
    build --> deploy["deploy<br/>actions/deploy-pages"]
    deploy --> pages["GitHub Pages"]
```

`concurrency: pages` with `cancel-in-progress: false` so deploys queue rather than
abort each other. Build env (Vite vars, GitHub key, Turnstile sitekey) is injected
from repo secrets/vars; `APP_ENV=production`.

## `cd-worker-api.yml` — Cloudflare Worker deploy

```mermaid
flowchart TD
    trig["workflow_run success<br/>or workflow_dispatch"] --> changes["changes<br/>download changes.json →<br/>worker = worker∋api ∥ packages∋schema ∥ root"]
    changes -->|"worker == true"| deploy["deploy<br/>config:gen → wrangler deploy"]
    changes -->|"worker == false"| skip["(skipped)"]
    deploy --> cf["Cloudflare Worker"]
```

`config:gen` renders `wrangler.json` from repo `vars` (worker name, D1, R2, honeypot);
`wrangler deploy` authenticates with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`.

## `cd-packages.yml` — npm publish (scaffold)

```mermaid
flowchart TD
    trig["workflow_run success<br/>or workflow_dispatch"] --> changes["changes<br/>download changes.json →<br/>names = root ? all : packages"]
    changes -->|"has_packages == true"| publish["publish (matrix per package)<br/>TODO: dry-run stub"]
    changes -->|"has_packages == false"| skip["(skipped)"]
    publish --> npm["npm registry"]
```

**Scaffold** — the publish step is a dry-run TODO; real publishing is deferred (see
[cd-packages.md](./cd-packages.md#going-live)). The trigger gating, changed-packages
matrix, and npm auth setup are already in place.

## Conventions (see the `ci-cd` skill)

- Detect node/package-manager once in `prepare`; reuse via outputs.
- Gate heavy jobs on `dorny/paths-filter` change detection; wire dependency edges by hand.
- `timeout-minutes` on every job; `fail-fast: false` on matrices.
- `cancel-in-progress: true` on CI; **`false`** on the deploy workflows.
- Secrets → `secrets`; non-sensitive config (URLs/IDs/names) → `vars`.
- ubuntu-only except the browser/E2E suite (tri-OS).
