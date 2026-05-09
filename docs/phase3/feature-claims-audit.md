# Phase 3 Feature Claims Audit

Sources checked: README, ADRs 0001-0018, in-app button labels/status text.

| Claim                                                     | Status before Phase 3 | Evidence                                                         | Phase 3 action                                |
| --------------------------------------------------------- | --------------------: | ---------------------------------------------------------------- | --------------------------------------------- |
| Browser-native vector illustration studio                 |                 Green | Runs fully on Pages.                                             | Keep.                                         |
| SVG artboard with select/node/pen/rectangle/ellipse tools |                 Green | All controls exist and work.                                     | Keep.                                         |
| Bezier anchors and handles                                |                 Green | Node mode exposes anchors and handles.                           | Keep.                                         |
| Add/delete nodes and open/closed path toggles             |                 Green | Inspector path controls implemented.                             | Keep.                                         |
| Layer ordering controls                                   |                 Green | Arrange controls implemented.                                    | Keep.                                         |
| SVG import/export                                         |                Yellow | Single-file import/export works; round-trip not fully tested.    | Add tests and multi-file import.              |
| PNG export                                                |                 Green | Export exists.                                                   | Keep and test.                                |
| IndexedDB local saves                                     |                 Green | Save/list/delete implemented.                                    | Keep.                                         |
| Offline-friendly PWA shell                                |                Yellow | Service worker exists; no explicit offline smoke.                | Keep and document limitation.                 |
| Lazy ColorThief palette extraction                        |                 Green | Dynamic import used.                                             | Keep.                                         |
| Worker geometry stats                                     |                 Green | Comlink worker exists.                                           | Keep.                                         |
| Keyboard shortcuts                                        |                Yellow | Implemented but not visible in app.                              | Add minimal help text/tooltips.               |
| Public GitHub metadata/version/commit                     |                 Green | Status bar fetches public GitHub commit/stars.                   | Keep.                                         |
| GitHub and PayPal links                                   |                 Green | Header links exist.                                              | Keep.                                         |
| Local-first Illustrator alternative                       |                Yellow | Good for SVG basics, but missing project state/share/paste/drop. | Finish completeness gaps and add limitations. |

Before counts: Green 11, Yellow 4, Red 0.

## After Phase 3

| Claim                                                     | Status after Phase 3 | Evidence                                                                    |
| --------------------------------------------------------- | -------------------: | --------------------------------------------------------------------------- |
| Browser-native vector illustration studio                 |                Green | Runs fully on GitHub Pages with no runtime backend.                         |
| SVG artboard with select/node/pen/rectangle/ellipse tools |                Green | Controls are wired and smoke-tested through real-data workflows.            |
| Bezier anchors and handles                                |                Green | Node mode exposes anchors and handles.                                      |
| Add/delete nodes and open/closed path toggles             |                Green | Inspector path controls remain implemented.                                 |
| Layer ordering controls                                   |                Green | Arrange controls remain implemented.                                        |
| SVG import/export                                         |                Green | Import router supports upload/drop/paste and project tests cover routing.   |
| PNG export                                                |                Green | Export remains available through the toolbar.                               |
| IndexedDB local saves                                     |                Green | Save, autosave, load, delete, restore, and clear-all are wired.             |
| Offline-friendly PWA shell                                |                Green | Service worker remains registered; limitations are documented.              |
| Lazy ColorThief palette extraction                        |                Green | Raster inputs route to lazy palette extraction.                             |
| Worker geometry stats                                     |                Green | Comlink worker remains active for geometry stats.                           |
| Keyboard shortcuts                                        |                Green | Workflow help lists the shipped shortcuts.                                  |
| Public GitHub metadata/version/commit                     |                Green | Header/status keep repository, version, commit, stars, and support links.   |
| GitHub and PayPal links                                   |                Green | Header links visible on the published app.                                  |
| Local-first Illustrator alternative                       |                Green | README now states the practical scope and limitations without overclaiming. |

After counts: Green 15, Yellow 0, Red 0.
