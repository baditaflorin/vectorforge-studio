# Phase 3 Codebase Health Audit

Measurement date: 2026-05-09.

## DRY Violations

| Finding                                                                 | Files                                                      | Status before Phase 3 | Decision                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------: | ------------------------------- |
| Slug/filename generation duplicated for SVG and PNG exports.            | `src/features/editor/EditorApp.tsx` around export handlers |                   Red | Extract exporter utilities.     |
| Download helpers and PNG rendering live inside app component.           | `EditorApp.tsx` bottom helpers                             |                Yellow | Move to export module.          |
| File import routing split by two file inputs.                           | `EditorApp.tsx` SVG and palette handlers                   |                Yellow | Create canonical import router. |
| Storage schema and document schema separate from project-state concept. | `storage/documents.ts`, `vector/model.ts`                  |                Yellow | Add canonical project schema.   |

## SOLID Violations

| Finding                                                                                                                 | Evidence                                        | Decision                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `EditorApp.tsx` owns UI orchestration, import/export, storage, keyboard shortcuts, history, notices, and project state. | >400 lines and many reasons to change.          | Extract history/settings/import/export project modules where useful. |
| Error handling is local `catch` blocks with inconsistent messages.                                                      | Import/save/export catch sites.                 | Add a canonical result/notice convention for boundary operations.    |
| Persistence has no migration boundary.                                                                                  | DB version is 1 and saves raw `VectorDocument`. | Add versioned project schema/migration policy.                       |

## Dead Code

| Finding                                          | Status                                                 |
| ------------------------------------------------ | ------------------------------------------------------ |
| `demoSvgText()` is exported but not referenced.  | Remove or use in tests.                                |
| `loadDocument()` is exported but not used by UI. | Keep if project import/load uses it, otherwise remove. |

## TODO / FIXME / XXX / HACK

`rg` found zero project TODO/FIXME/XXX/HACK occurrences in `src`, `docs`, and tests. Matches in generated assets/manifests for the word `any` are not type-safety findings.

## Type Safety Holes

| Finding                                                                                                  | Evidence            | Decision                                                 |
| -------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------- |
| Boundary data validated for vector documents but not native project files because they do not exist yet. | No project schema.  | Add zod schema and tests.                                |
| DOM `as Element` cast in canvas event handler.                                                           | `EditorCanvas.tsx`. | Accept as narrowed DOM boundary; keep local and minimal. |
| `Image.decode()`/canvas export errors are swallowed into generic notice.                                 | `EditorApp.tsx`.    | Move into exporter that returns typed errors.            |

## Inconsistent Patterns

- `EditorApp.tsx` uses direct state changes for rename but commit-based changes for style. Rename is not undoable.
- Imports are selected by UI button, not by content detection.
- Local saves persist documents, while palette/zoom/settings do not persist.

## Test Coverage Holes

- No tests for native project state export/import.
- No tests for drag/drop or paste real-user input.
- No tests for local settings persistence.
- No tests for README claim "keyboard shortcuts."
- Smoke test uses default document, not imported user data.

## Before Metrics

- DRY findings: 4
- SOLID findings: 3
- Dead-code findings: 2
- TODO/FIXME/XXX/HACK: 0
- `any` / `@ts-ignore`: 0 in source
- Real-user path smoke tests: 1

## After Phase 3 Measurement

Measurement date: 2026-05-09 after implementation.

| Area                 | Before | After | Evidence                                                                   |
| -------------------- | -----: | ----: | -------------------------------------------------------------------------- |
| DRY findings         |      4 |     0 | Export, import, settings, session, project schema, and result modules.     |
| SOLID findings       |      3 |     1 | Boundary work moved out of `EditorApp`; the app component is still large.  |
| Dead-code findings   |      2 |     0 | `demoSvgText()` removed; `loadDocument()` now powers last-session restore. |
| TODO/FIXME/XXX/HACK  |      0 |     0 | `rg` found no source/test occurrences.                                     |
| `any` / `@ts-ignore` |      0 |     0 | `rg` found no source/test occurrences.                                     |
| Real-user path tests |      1 |     5 | Unit coverage for import/export/project/settings plus Playwright import.   |

Remaining accepted SOLID debt: `EditorApp.tsx` is still the orchestration root. It now delegates boundary parsing, export, project-file, storage-session, and settings work, but a later phase should split keyboard/history orchestration into hooks once behavior has settled.
