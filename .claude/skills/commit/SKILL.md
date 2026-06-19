---
description: How to write git commits in this repo that auto-close their GitHub task — a conventional-commits header with the closing keyword appended to the end of the subject line. Use when committing work that resolves a task or issue.
---

# Commit

## One commit per task; closing keyword at the end of the header

A commit that completes a GitHub task ends its **subject line** (the header — the
first line) with the closing keyword and the task number:

```
<type>(<scope>): <summary> - close #<tasknumber>
```

Example:

```
feat(schema): extract contact validation into shared @soroush.tech/schema - close #155
```

- One task → one commit. Commit tasks separately, in dependency order.
- The keyword goes at the **end of the header**, never in a footer line.
- `close` / `closes` / `closed` all work — keep `#<number>` immediately after.
- Several tasks in one commit: `... - close #155, close #156`.

## Don't close issues by hand

The keyword auto-closes the task when the branch merges to `main`. Leave the
issue open; never close it manually.

## Mechanics

- Pass multi-line messages via a file (`git commit -F <file>`).
- The pre-commit hook runs lint-staged + the full test suite on every commit.
