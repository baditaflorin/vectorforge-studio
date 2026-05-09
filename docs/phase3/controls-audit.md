# Phase 3 Controls Audit

Status key: Green = label matches real end-to-end behavior. Yellow = works but incomplete/confusing. Red = handler missing or not enough for real use.

| Control                    | Status before Phase 3 | Notes                                                                                  | Phase 3 decision                        |
| -------------------------- | --------------------: | -------------------------------------------------------------------------------------- | --------------------------------------- |
| New                        |                Yellow | Creates new document but does not clear local last-session state.                      | Finish with explicit reset semantics.   |
| Demo                       |                 Green | Loads demo document.                                                                   | Keep.                                   |
| Star on GitHub             |                 Green | Opens repository.                                                                      | Keep.                                   |
| PayPal                     |                 Green | Opens PayPal.                                                                          | Keep.                                   |
| Select and move            |                 Green | Selects and drags elements.                                                            | Keep.                                   |
| Edit nodes and handles     |                 Green | Shows anchors/handles for selected path.                                               | Keep.                                   |
| Pen path                   |                Yellow | Creates paths, but no visible finish/cancel hint except double-click/Escape.           | Add help text and tests.                |
| Rectangle                  |                 Green | Draws rectangles.                                                                      | Keep.                                   |
| Ellipse                    |                 Green | Draws ellipses.                                                                        | Keep.                                   |
| Undo/Redo                  |                Yellow | Works for committed changes, but buttons can lag because refs do not trigger rerender. | Finish with stateful history.           |
| Save                       |                 Green | Saves current document locally.                                                        | Keep and verify.                        |
| Export SVG                 |                 Green | Downloads SVG.                                                                         | Keep and round-trip test.               |
| Export PNG                 |                 Green | Downloads PNG.                                                                         | Keep.                                   |
| Import SVG                 |                Yellow | Works for single SVG only.                                                             | Finish multi-file/format detection.     |
| Extract palette from image |                Yellow | Works for single raster only.                                                          | Finish multi-file/paste/drop.           |
| Delete selected            |                 Green | Deletes selected element or selected node via keyboard.                                | Keep.                                   |
| Selection name             |                Yellow | Renames but does not push undo history.                                                | Finish with consistent commit behavior. |
| Fill/stroke/stroke/opacity |                 Green | Updates selected element style.                                                        | Keep.                                   |
| Duplicate                  |                 Green | Duplicates selected element.                                                           | Keep.                                   |
| Arrange controls           |                 Green | Reorders selected layer.                                                               | Keep and test.                          |
| Path Add/Delete/Open/Close |                 Green | Works for paths.                                                                       | Keep and test.                          |
| Zoom controls              |                Yellow | Works but does not persist.                                                            | Persist setting.                        |
| Palette swatches           |                 Green | Apply fill color.                                                                      | Keep.                                   |
| Local save load/delete     |                Yellow | Works, but no clear all/reset.                                                         | Finish clear/reset.                     |
| Layers                     |                 Green | Selects elements.                                                                      | Keep.                                   |

Before counts: Green 16, Yellow 9, Red 0.

## After Phase 3

| Control                    | Status after Phase 3 | Evidence                                                                        |
| -------------------------- | -------------------: | ------------------------------------------------------------------------------- |
| New                        |                Green | Creates a fresh local document and the Project panel offers a full local reset. |
| Demo                       |                Green | Loads the demo document.                                                        |
| Star on GitHub             |                Green | Opens the repository URL.                                                       |
| PayPal                     |                Green | Opens the PayPal support URL.                                                   |
| Select and move            |                Green | Selects and drags elements.                                                     |
| Edit nodes and handles     |                Green | Node mode exposes anchors and handles.                                          |
| Pen path                   |                Green | Workflow help documents finish/cancel behavior and shortcuts.                   |
| Rectangle                  |                Green | Draws rectangles.                                                               |
| Ellipse                    |                Green | Draws ellipses.                                                                 |
| Undo/Redo                  |                Green | History changes now trigger toolbar rerendering.                                |
| Save                       |                Green | Saves current document locally and records it as the last session.              |
| Export SVG                 |                Green | Downloads SVG.                                                                  |
| Export PNG                 |                Green | Downloads PNG.                                                                  |
| Import files               |                Green | Accepts SVG, raster images, project JSON, and multi-file batches.               |
| Read clipboard             |                Green | Reads SVG/HTML/text/image clipboard items when browser permission allows.       |
| Delete selected            |                Green | Deletes selected element or selected node via keyboard.                         |
| Selection name             |                Green | Rename goes through commit history and is undoable.                             |
| Fill/stroke/stroke/opacity |                Green | Updates selected element style.                                                 |
| Duplicate                  |                Green | Duplicates selected element.                                                    |
| Arrange controls           |                Green | Reorders selected layer.                                                        |
| Path Add/Delete/Open/Close |                Green | Works for paths.                                                                |
| Zoom controls              |                Green | Zoom persists through settings/project export.                                  |
| Palette swatches           |                Green | Apply fill color.                                                               |
| Local save load/delete     |                Green | Load/delete plus clear-all reset are wired and visible.                         |
| Settings checkboxes        |                Green | Autosave, last-session restore, and workflow help toggles persist.              |
| Project export/copy/share  |                Green | Project panel exposes full-state export, SVG copy, share URL, and print.        |
| Layers                     |                Green | Selects elements.                                                               |

After counts: Green 27, Yellow 0, Red 0.
