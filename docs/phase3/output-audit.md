# Phase 3 Output Pathway Audit

Status key: Green = works end-to-end. Yellow = partial. Red = missing but needed. Gray = intentionally out of scope.

| Output pathway                 | Status before Phase 3 | Evidence                                                  | Phase 3 decision                                          |
| ------------------------------ | --------------------: | --------------------------------------------------------- | --------------------------------------------------------- |
| SVG download                   |                 Green | Toolbar export emits SVG text file.                       | Keep and round-trip test.                                 |
| PNG download                   |                 Green | Toolbar export renders SVG into canvas and downloads PNG. | Keep and smoke test availability.                         |
| IndexedDB save                 |                 Green | Save and autosave write `VectorDocument` to IndexedDB.    | Keep; add last-session restore/reset.                     |
| Downloadable native state file |                   Red | No project export with full app state/palette/settings.   | Finish `.vectorforge.json`.                               |
| Native state file import       |                   Red | No project import path.                                   | Finish.                                                   |
| Copy SVG to clipboard          |                   Red | No copy action.                                           | Finish.                                                   |
| Copy share URL                 |                   Red | No hash-encoded state/share action.                       | Finish with size guard.                                   |
| Print/PDF                      |                   Red | No print stylesheet/control.                              | Finish print command and print CSS.                       |
| Screenshot export              |                Yellow | PNG approximates screenshot but only artboard.            | Treat PNG as artboard image export; no chrome screenshot. |
| JSON export                    |                   Red | Native state JSON missing.                                | Finish as versioned project file.                         |
| Code export                    |                  Gray | Not relevant for vector editor v1.                        | Out of scope.                                             |
| Embed code                     |                  Gray | Not needed for local-first editor v1.                     | Out of scope.                                             |
| API/curl output                |                  Gray | Mode A has no API.                                        | Out of scope.                                             |

Before counts: Green 3, Yellow 1, Red 6, Gray 3.
