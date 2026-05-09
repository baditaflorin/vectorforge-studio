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

## After Phase 3

| Output pathway                 | Status after Phase 3 | Evidence                                                                                    |
| ------------------------------ | -------------------: | ------------------------------------------------------------------------------------------- |
| SVG download                   |                Green | Toolbar export uses shared filename/download utilities.                                     |
| PNG download                   |                Green | Canvas-backed PNG exporter returns typed failures instead of silent generic errors.         |
| IndexedDB save                 |                Green | Save and autosave persist the active document and refresh the local save list.              |
| Downloadable native state file |                Green | Project panel exports versioned `.vectorforge.json` with document, palette, and settings.   |
| Native state file import       |                Green | Import router restores native project files from picker, drop, paste, and share URLs.       |
| Copy SVG to clipboard          |                Green | Project panel copies exported SVG with visible success/error feedback.                      |
| Copy share URL                 |                Green | Project panel copies hash-encoded project URLs and blocks oversized payloads with a notice. |
| Print/PDF                      |                Green | Project panel invokes print and print CSS strips editing chrome.                            |
| Screenshot export              |                Green | PNG export is documented as artboard image export, not full UI screenshot capture.          |
| JSON export                    |                Green | Native project JSON is schema-versioned and round-trip tested.                              |
| Code export                    |                 Gray | Out of scope.                                                                               |
| Embed code                     |                 Gray | Out of scope.                                                                               |
| API/curl output                |                 Gray | Mode A has no API.                                                                          |

After counts: Green 10, Yellow 0, Red 0, Gray 3.
