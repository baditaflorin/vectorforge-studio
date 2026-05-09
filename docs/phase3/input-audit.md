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

## After Phase 3

| Input pathway                    | Status after Phase 3 | Evidence                                                                                   |
| -------------------------------- | -------------------: | ------------------------------------------------------------------------------------------ |
| SVG file upload                  |                Green | One or many SVG files route through `importFiles()` and merge into the workspace.          |
| Raster image upload for palette  |                Green | PNG/JPEG/WebP files route through the same importer and extract swatches.                  |
| Demo/sample document             |                Green | Demo remains available beside real data entry points.                                      |
| Autosaved local document restore |                Green | Autosave writes the active document and records the last document id.                      |
| Last session deep restore        |                Green | Reload restores the last saved document when the setting is enabled.                       |
| Drag/drop SVG                    |                Green | Workspace drop handlers import SVG files.                                                  |
| Drag/drop raster palette image   |                Green | Workspace drop handlers extract palettes from raster files.                                |
| Paste SVG text                   |                Green | App-level paste handler imports pasted SVG text.                                           |
| Paste inline SVG/HTML            |                Green | The importer extracts the first `<svg>...</svg>` fragment from HTML/text.                  |
| Paste raster image               |                Green | Clipboard file items route through raster palette extraction.                              |
| Clipboard read button            |                Green | Toolbar and Project panel expose permission-aware clipboard import with fallback notices.  |
| Multi-file input                 |                Green | Single hidden file picker accepts mixed SVG/project/raster batches with partial messages.  |
| Format detection                 |                Green | Import routing sniffs MIME type, extension, VectorForge JSON marker, and SVG markup.       |
| Mobile picker                    |                Green | Browser-native file picker accepts SVG/project/raster inputs; camera URL import stays out. |
| URL import                       |                 Gray | Mode A deliberately avoids CORS-brittle arbitrary URL import; users paste or upload files. |
| Folder import                    |                 Gray | Out of scope for v1.                                                                       |
| State file import                |                Green | `.vectorforge.json` project files restore document, palette, and settings.                 |
| Hash/deep-link import            |                Green | Small project states load from `#project=` share URLs.                                     |

After counts: Green 16, Yellow 0, Red 0, Gray 2.
