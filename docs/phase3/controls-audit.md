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
