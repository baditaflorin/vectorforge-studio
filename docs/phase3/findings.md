# Phase 3 Findings Synthesis

## Top 5 Usability Gaps

1. Users cannot import real data via drag/drop or paste; only toolbar pickers work.
2. Users cannot export/import a complete native project state including palette/settings.
3. Reload does not resume the last active document automatically.
4. Clipboard/share workflows are absent, making it hard to move SVGs between tools.
5. Settings do not exist, so zoom/preferences do not persist and no clear-state operation is visible.

## Top 5 Half-Baked Features

| Feature            | Decision | Rationale                                                   |
| ------------------ | -------- | ----------------------------------------------------------- |
| Autosave           | Finish   | Save exists but restore is incomplete.                      |
| Keyboard shortcuts | Finish   | Implemented but undiscoverable.                             |
| Local saves        | Finish   | Needs clear/delete/reset and project-state symmetry.        |
| Import             | Finish   | Single file works; real users drag/drop/paste/multi-select. |
| Export             | Finish   | SVG/PNG exist; state/share/copy are missing.                |

## Top 5 Codebase Pain Points

1. `EditorApp.tsx` is a god module.
2. Import routing is split by UI control rather than file/content type.
3. Export/download logic is embedded in React component code.
4. No versioned project-state schema.
5. Rename/settings changes are not consistently undoable/persisted.

## Top 5 Documentation/Reality Mismatches

1. "Local-first Illustrator alternative" is too broad without limitations.
2. Keyboard shortcuts are claimed but not discoverable in-app.
3. SVG import/export is claimed but round-trip behavior is not tested.
4. Offline-friendly is true at shell level but not documented as a browser-cache best effort.
5. Local saves are claimed but reload restore is incomplete.

## Fully Usable Definition

A stranger should be able to:

1. Open the app, import their own SVG by picker, drag/drop, paste, or project file, and see editable artwork.
2. Make vector edits, arrange layers, change style, and see those changes survive reload.
3. Export SVG, PNG, and a native project file, and import that project file later with palette/settings intact.
4. Copy SVG or a share link to move work into another tool or browser session.
5. Clear/reset local state without opening devtools.

## Phase 3 Success Metrics

- Input audit after counts: all required rows Green; out-of-scope rows have ADR coverage.
- Output audit after counts: all required rows Green; out-of-scope rows have ADR coverage.
- At least 20 catalog items implemented or explicitly resolved.
- Real-user Playwright path imports user data, edits it, saves/restores, exports/copies/shares.
- Codebase audit after: zero core DRY findings, zero TODO/FIXME/XXX/HACK, zero `any`/`@ts-ignore`.

## Out Of Scope

- No runtime backend or auth.
- No new vector engine, boolean path engine, or WASM geometry engine.
- No visual polish beyond controls needed for usability.
- No arbitrary URL import because Mode A cannot bypass CORS.
