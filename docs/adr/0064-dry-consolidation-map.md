# 0064 - DRY Consolidation Map

## Status

Accepted

## Context

Audit found repeated filename, download, import routing, and schema logic.

## Decision

Consolidate into:

- `features/project/projectFile.ts` for native project schema and migration.
- `features/import/importRouter.ts` for file/text/clipboard routing.
- `features/export/exporters.ts` for SVG/PNG/project/share/copy/print.
- `features/settings/settings.ts` for persisted settings.
- `shared/result.ts` for boundary result handling.

## Consequences

Editor UI imports application-level helpers instead of carrying boundary logic
inline.

## Alternatives Considered

- Leave `EditorApp` as the only orchestration point: rejected because it had
  too many reasons to change.
