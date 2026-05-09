# 0071 - Stranger Test Findings And Response

## Status

Accepted

## Context

The stranger test is the Phase 3 exit gate.

## Decision

Run a private-window workflow with real SVG input:

1. Import real SVG.
2. Edit artwork.
3. Save and reload.
4. Export SVG/PNG/project.
5. Copy SVG/share URL.
6. Reset local state.

Top findings must be recorded in `docs/phase3/stranger-test.md`; the top three
must be fixed or explicitly documented as out of scope before release.

## Consequences

The final postmortem must answer honestly where zero-help usability still
fails.

## Alternatives Considered

- Treat Playwright smoke as the stranger test: rejected because smoke tests do
  not capture confusion or UX dead ends.
