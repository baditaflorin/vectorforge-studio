# 0013 - Testing Strategy

## Status

Accepted

## Context

The editor has pure vector logic, browser integration, and smoke-critical user
flows.

## Decision

Use:

- Vitest for vector model, SVG IO, storage helpers, and React components.
- Playwright for one headless happy-path editor smoke test.
- `scripts/smoke.sh` to build, serve `docs/`, and run Playwright.
- `make test`, `make lint`, `make build`, and `make smoke` as local gates.

## Consequences

- Pure logic is fast to test.
- The Pages build is verified before push.
- No GitHub Actions are used.

## Alternatives Considered

- Browser-only manual testing: rejected because path editing regressions are
  easy to miss.
- GitHub Actions: rejected by project constraints.
