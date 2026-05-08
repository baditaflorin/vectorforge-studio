# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project explicitly avoids GitHub Actions. Local hooks must catch formatting,
typing, tests, build, smoke, commit-message, and secret-scan failures.

## Decision

Use plain `.githooks/` scripts wired by:

```sh
make install-hooks
```

Hooks:

- `pre-commit`: lint, format check, TypeScript build, and gitleaks if installed.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: test, build, and smoke.
- `post-merge` and `post-checkout`: npm install when lockfile changes.

## Consequences

- Contributors do not need a hook framework dependency.
- Missing optional tools such as gitleaks produce a warning unless installed.
- Local checks are documented and manually runnable through Makefile targets.

## Alternatives Considered

- lefthook: rejected because plain hooks are enough for a small Mode A app.
