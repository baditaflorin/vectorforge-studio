# Phase 3 Postmortem

Date: 2026-05-09.

Release: v0.3.0.

## Audit Grids

| Audit          | Before green/yellow/red/gray | After green/yellow/red/gray |
| -------------- | ---------------------------: | --------------------------: |
| Inputs         |                     3/3/10/2 |                    16/0/0/2 |
| Outputs        |                      3/1/6/3 |                    10/0/0/3 |
| Controls       |                     16/9/0/0 |                    27/0/0/0 |
| Feature claims |                     11/4/0/0 |                    15/0/0/0 |

## Half-Baked Feature Triage

| Feature            | Outcome  | Rationale                                                                  |
| ------------------ | -------- | -------------------------------------------------------------------------- |
| Autosave           | Finished | Last-session restore now uses the saved document id.                       |
| Keyboard shortcuts | Finished | Workflow help exposes the shipped shortcuts.                               |
| Local saves        | Finished | Load/delete/save remain, and clear-all/fresh document are explicit.        |
| Import             | Finished | Picker, multi-file, drag/drop, paste, clipboard read, project import.      |
| Export             | Finished | SVG, PNG, native project file, copy SVG, share URL, and print are present. |

## Codebase Health Metrics

| Metric               | Before | After | Notes                                                                 |
| -------------------- | -----: | ----: | --------------------------------------------------------------------- |
| Core DRY findings    |      4 |     0 | Import/export/project/settings/session/result modules own boundaries. |
| SOLID findings       |      3 |     1 | `EditorApp.tsx` remains a large orchestration root.                   |
| Dead-code findings   |      2 |     0 | Dead SVG demo export removed; loadDocument is used.                   |
| TODO/FIXME/XXX/HACK  |      0 |     0 | Source/test search is clean.                                          |
| `any` / `@ts-ignore` |      0 |     0 | Source/test search is clean.                                          |
| Real-user path tests |      1 |     5 | Unit boundary tests plus Playwright real SVG import/restore.          |

## Stranger Test

The private-browser stranger path found three issues: file import silently failed because the live `FileList` was cleared too early, the project export label was vague, and the smoke wrapper was brittle on a busy machine. All three were fixed before release. The final smoke path imports a real SVG, saves it, reloads, and restores it.

## Documentation Alignment

README claims were converted into a verified checklist. The limitations section now states no backend/auth/sync, no arbitrary URL import, no full Illustrator compatibility, share URL size limits, and the best-effort nature of the PWA cache.

## Surprises

The biggest surprise was how small the most damaging bug was: clearing the file input before freezing the `FileList` made real user import appear wired while doing nothing. The other surprise was operational: a fixed smoke-test port is fragile when several local Codex workspaces run at once.

## Still-Open Completeness Gaps

1. `EditorApp.tsx` should be split into hooks for history, keyboard shortcuts, project state, and import orchestration.
2. Clipboard image paste should get a dedicated browser-matrix note because support varies.
3. Project-file migrations currently cover schema v1 only; the next schema change needs a real migration test.
4. Share URLs are intentionally small-document only; larger share workflows need a non-secret static artifact path or explicit out-of-scope note in-app.
5. The app is usable for SVG basics, but not yet for Illustrator-grade boolean/pathfinder/typography workflows.

## Honest Take

Could a stranger now use this app for their own real work end-to-end with zero help? Yes for the v1 scope: import an SVG, edit paths/shapes/styles/layers, save locally, reload, export SVG/PNG/project JSON, copy SVG, and share small projects. Still no for professional Illustrator replacement expectations: no advanced typography, pathfinder, symbol libraries, or large-document collaboration. Phase 3 made the shipped scope real; it did not make the product magically as deep as Illustrator.
