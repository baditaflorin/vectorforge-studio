# Phase 3 Stranger Test

Date: 2026-05-09.

Mode: me-as-stranger in a fresh browser context with local storage and IndexedDB cleared. I used a hand-written SVG containing a rectangle and Bezier path rather than the demo document.

## User Story Tested

1. Open the published-style Pages build.
2. Import my own SVG file through the file picker.
3. Confirm the imported shapes are editable.
4. Save locally and reload.
5. Confirm the last session restores.
6. Export/copy/share paths are visible without reading source code.

## Findings

| Finding                                                                                     | Severity | Response                                                                              |
| ------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------------------------- |
| File import silently did nothing in the smoke path.                                         |     High | Fixed `handleImportInput()` by copying the live `FileList` before clearing the input. |
| Output button label `Project` was too vague for a first-time user.                          |   Medium | Renamed the control to `Export project`.                                              |
| The local smoke wrapper used a fixed port and `serve`, making verification brittle locally. |   Medium | Replaced it with a project-local static server that chooses a free port.              |

## Result

After the fixes, the stranger path passes in Playwright: import a real SVG, save, reload, and restore the imported document. A real human could still want richer onboarding, but the end-to-end work loop no longer depends on the curated demo or devtools.
