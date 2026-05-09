# Phase 3 Input Pathway Audit

Status key: Green = works end-to-end on real user data. Yellow = partially works or needs clearer UX. Red = claimed/expected but not usable. Gray = intentionally out of scope unless later ADR changes it.

| Input pathway                    | Status before Phase 3 | Evidence                                                                       | Phase 3 decision                                                |
| -------------------------------- | --------------------: | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| SVG file upload                  |                 Green | Toolbar import accepts `.svg` and parses path/rect/ellipse/circle.             | Keep and test round-trip.                                       |
| Raster image upload for palette  |                 Green | Toolbar image action accepts PNG/JPEG/WebP and lazy-loads ColorThief.          | Keep and test UI affordance.                                    |
| Demo/sample document             |                 Green | Header Demo creates a known vector document.                                   | Keep, but make it equal to real inputs.                         |
| Autosaved local document restore |                Yellow | Documents autosave and list exists, but last-session restore is not automatic. | Finish.                                                         |
| Last session deep restore        |                   Red | Reload starts default document instead of last edited document.                | Finish.                                                         |
| Drag/drop SVG                    |                   Red | No drop zone or `dragover/drop` handlers.                                      | Finish.                                                         |
| Drag/drop raster palette image   |                   Red | No drop handlers.                                                              | Finish.                                                         |
| Paste SVG text                   |                   Red | No paste handler.                                                              | Finish.                                                         |
| Paste inline SVG/HTML            |                   Red | No paste handler.                                                              | Finish SVG extraction from pasted HTML/text.                    |
| Paste raster image               |                   Red | No clipboard image handler.                                                    | Finish.                                                         |
| Clipboard read button            |                   Red | No permission-aware read action.                                               | Finish with fallback notice.                                    |
| Multi-file input                 |                   Red | File inputs read one file only.                                                | Finish batch SVG/palette handling with partial-success notices. |
| Format detection                 |                Yellow | Input path is based on which button opened the picker.                         | Add file sniffing and route SVG/raster/state.                   |
| Mobile picker                    |                Yellow | File inputs use accept filters, but no explicit camera/share UX.               | Keep browser-native picker; document limitation.                |
| URL import                       |                  Gray | Browser CORS blocks arbitrary SVG/image URLs.                                  | Out of scope for Mode A; document paste/file alternative.       |
| Folder import                    |                  Gray | Not needed for v1 vector editor.                                               | Out of scope.                                                   |
| State file import                |                   Red | No downloadable/reloadable native project file.                                | Finish `.vectorforge.json`.                                     |
| Hash/deep-link import            |                   Red | No state encoded in URL.                                                       | Finish for small documents.                                     |

Before counts: Green 3, Yellow 3, Red 10, Gray 2.
