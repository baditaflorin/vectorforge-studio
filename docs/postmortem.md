# Postmortem

## What was built

VectorForge Studio v0.2.0 is a static, local-first vector editor published at:

https://baditaflorin.github.io/vectorforge-studio/

The app includes an SVG artboard, select/node/pen/rectangle/ellipse tools,
Bezier handles, add/delete node controls, open/closed path toggling, layer
ordering, SVG import/export, PNG export, IndexedDB local saves, lazy ColorThief
palette extraction, worker-backed geometry stats, keyboard shortcuts, PWA
files, public GitHub metadata, visible version/commit, and prominent GitHub
star and PayPal support links.

## Was Mode A correct?

Yes. The chosen Mode A GitHub Pages deployment was correct in hindsight. v1 did
not need auth, shared documents, secrets, server-side mutations, or a runtime
database. Browser SVG APIs, TypeScript, IndexedDB, public GitHub API calls, and
static assets covered the release.

## What worked

- GitHub Pages from `main` branch `/docs` produced a working public URL.
- The editor smoke path runs against both local static preview and the live URL.
- IndexedDB is enough for local document persistence.
- Lazy palette extraction kept the initial JS payload around 100KB gzip.
- Worker-backed geometry kept document metrics out of the React render path.
- Showing commit through the public GitHub API avoids unstable asset hashes.

## What did not work

- Embedding the git hash directly in the JS bundle made build output change
  after each commit. The fix was to use a stable fallback and fetch the live
  commit at runtime from the public GitHub API.
- Full lyon-rs, skia-WASM, and libigl integration is still deferred behind the
  documented engine boundary.

## What surprised us

GitHub Pages static hosting is friendly for the editor shell, but COOP/COEP
headers are still a serious consideration for future WASM modules that require
`SharedArrayBuffer`.

## Accepted tech debt

- The first vector engine is TypeScript plus browser SVG APIs.
- Boolean operations, pressure smoothing, symbol libraries, and robust arbitrary
  SVG path coverage are not complete v1 features.
- The local hook set is intentionally plain shell instead of a hook framework.

## Next improvements

1. Add a real WASM path-operation adapter.
2. Add boolean path operations and path simplification.
3. Add richer document templates, symbol libraries, and export presets.

## Time spent vs estimate

The initial implementation was completed inside one bootstrap session. The
largest unplanned item was stabilizing Pages build metadata after the first
pre-push run exposed changing asset hashes.
