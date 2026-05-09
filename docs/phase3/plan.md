# Phase 3 Implementation Plan

Ranked by real-user impact. Catalog IDs refer to the Phase 3 prompt.

| Rank | Catalog item | Enhancement                                                    | Outcome                                                   |
| ---: | -----------: | -------------------------------------------------------------- | --------------------------------------------------------- |
|    1 |        8, 38 | Restore last active document on reload.                        | Users resume work without finding a local save manually.  |
|    2 |       11, 41 | Add `.vectorforge.json` project export/import.                 | Full state can move between browsers/devices.             |
|    3 |         1, 4 | Multi-file import for SVG and raster palette images.           | Real files can be loaded in batches with partial success. |
|    4 |         1, 6 | Drag/drop SVG, project files, and raster images.               | Users can load data naturally.                            |
|    5 |     1, 6, 10 | Paste SVG text/HTML and raster clipboard images.               | Clipboard workflows work without file dialogs.            |
|    6 |            2 | Format detection by file content and extension.                | One import path routes SVG/image/project correctly.       |
|    7 |           10 | Copy SVG to clipboard.                                         | Output can move into other tools.                         |
|    8 |           12 | Shareable hash URL for small documents.                        | Small documents can be shared without a backend.          |
|    9 |           13 | Print/PDF command and print CSS.                               | Users can print the artboard predictably.                 |
|   10 |       18, 40 | Settings/reset panel.                                          | Every persisted setting has a real control.               |
|   11 |           39 | Versioned persistence migrations.                              | Future data changes do not silently lose work.            |
|   12 |           31 | Canonical boundary error handling.                             | Import/export/storage failures are consistent.            |
|   13 |       20, 21 | Extract export/download logic.                                 | Remove duplicate filename/download code.                  |
|   14 |       20, 23 | Shared project-state schema.                                   | Producer/consumer validate the same shape.                |
|   15 |       24, 25 | Split `EditorApp` responsibilities.                            | Keep UI orchestration thinner.                            |
|   16 |           28 | Remove or use dead exports.                                    | Eliminate dormant API surface.                            |
|   17 |           32 | Make rename and preferences consistent with state conventions. | Undo/persistence behavior is predictable.                 |
|   18 |       33, 44 | Add minimal in-app shortcut/help text.                         | Claimed shortcuts are discoverable.                       |
|   19 |       42, 45 | README verified checklist and limitations.                     | Docs match shipped behavior.                              |
|   20 |       46, 47 | Stranger test and top-3 fixes.                                 | Real workflow is exercised and documented.                |
|   21 |            9 | SVG export/import round-trip test.                             | Export is verified, not just clickable.                   |
|   22 |       36, 37 | Validate pasted/imported project boundaries.                   | External JSON cannot corrupt state.                       |
|   23 |           40 | Clear local saves/history/settings.                            | Users can start fresh without devtools.                   |
|   24 |            7 | Treat demo and user data equally.                              | Demo is one entry point, not the product path.            |

## Phase 3 Commit Strategy

1. ADR batch for completeness policies.
2. Project state, settings, and persistence.
3. Import router with file/drag/paste/clipboard.
4. Output completeness: state, copy, share, print.
5. Codebase consolidation and docs alignment.
6. Stranger test, version bump, release.
