---
description: GitHub Actions CI/CD conventions for this repo — the unified ci.yml (prepare → changes-gated lint/web/packages/worker jobs), per-workspace Codecov flags/components, pnpm --filter test:coverage, and workflow_run-gated cd-web/cd-worker-api deploys. Use when adding, editing, or debugging any workflow under .github/workflows/.
paths: .github/workflows/**
---

# CI/CD (GitHub Actions)

## Workflow files

| File                | Name                     | Trigger                                                         |
| ------------------- | ------------------------ | --------------------------------------------------------------- |
| `ci.yml`            | `Continuous Integration` | `push` to `main`, all `pull_request`                            |
| `cd-web.yml`        | Pages deploy             | `workflow_run` of `Continuous Integration` (success) + dispatch |
| `cd-worker-api.yml` | Cloudflare Worker deploy | `workflow_run` of `Continuous Integration` (success) + dispatch |

One CI workflow for the whole monorepo. CD is separate and **gated on CI success** — never deploy on a raw `push`.

## CI is one workflow with per-area jobs

`prepare` → fan out to `lint`, `web`, `packages`, `worker`. Heavy jobs are gated by change detection so a package-only PR never runs the tri-OS web suite.

```yaml
jobs:
  prepare:          # detect node/pkg-manager/runner + changed areas → outputs
  lint:             # pnpm -r lint + typecheck, once, ubuntu
  web:      if: needs.prepare.outputs.web == 'true'       # tri-OS, coverage tiers
  packages: if: needs.prepare.outputs.packages == 'true'  # matrix per package
  worker:   if: needs.prepare.outputs.worker == 'true'    # ubuntu
```

## Detect once in `prepare`, reuse via outputs

Don't re-detect node version / package manager in every job. Detect in `prepare`, expose as job outputs, consume with `needs.prepare.outputs.*`.

```yaml
# ✓ reuse
- uses: actions/setup-node@v5
  with: { node-version: ${{ needs.prepare.outputs.node_version }}, cache: ${{ needs.prepare.outputs.manager }} }
- run: ${{ needs.prepare.outputs.runner }} --filter @soroush/api test:coverage
```

Node version is always read from `.nvmrc`. Never hard-code it.

## Change detection (dorny/paths-filter)

No Nx/Turbo — wire dependency edges **manually**. A package consumed by another area must appear in that area's filter.

```yaml
worker: # worker imports @soroush.tech/schema
  - 'workers/api/**'
  - 'packages/schema/**'
web: # web consumes shared packages
  - 'apps/web/**'
  - 'packages/**'
```

Include `pnpm-lock.yaml`, `.nvmrc`, and `.github/workflows/ci.yml` in every filter so infra changes run everything.

## Coverage → Codecov (per workspace)

Each workspace emits its own `coverage/lcov.info` and uploads under its **own flag**; Codecov merges uploads by commit SHA.

- Every vitest config must set `reporter: ['text', 'lcov']` (default omits lcov).
- One `codecov/codecov-action@v5` upload per workspace: `files: <ws>/coverage/lcov.info`, `flags: <name>`.
- Register each area as a component in `.codecov.yml` (mirrors the `Theme` component) for per-area PR numbers.
- Packages run as a matrix; each row uploads its own flag:

```yaml
matrix:
  include:
    - { dir: schema, filter: '@soroush.tech/schema', flag: schema }
```

100% coverage is enforced inside each `vitest.config` (`thresholds: { 100: true }`); Codecov is for reporting, not the gate.

## Lint & typecheck once, recursively

Run at root in a single ubuntu job — not per package. `pnpm -r` skips workspaces without the script.

```yaml
- run: pnpm run lint # = pnpm -r lint
- run: pnpm run typecheck # = pnpm -r typecheck
```

## Deploy gating

CD triggers off CI completion and guards on success:

```yaml
on:
  workflow_run: { workflows: ['Continuous Integration'], types: [completed], branches: [main] }
  workflow_dispatch:
jobs:
  deploy:
    if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success' }}
```

## Cost & speed defaults

- **OS:** ubuntu only, except the web/browser suite which is tri-OS (macOS is ~10× cost — browser/e2e only).
- **Concurrency:** cancel superseded runs — `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`.
- **Timeouts:** set `timeout-minutes` on every job.
- **Matrices:** `fail-fast: false` so one package failure doesn't cancel the others.
- **Cache:** `setup-node` with `cache: pnpm` for deps; cache Playwright binaries by `runner.os` + Playwright version.
- **Secrets vs vars:** tokens/keys → `secrets`; non-sensitive config (URLs, IDs, names) → `vars`. Prefer cloud OIDC over long-lived tokens where the provider supports it.

If the task names a workflow file, read it and apply these rules. Otherwise apply to the workflow being discussed.
