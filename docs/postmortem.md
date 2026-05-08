# Postmortem

Status: draft until v0.1.0 is tagged.

## What was built

VectorForge Studio v0.1.0 delivers a static, local-first vector editor on
GitHub Pages.

## Was Mode A correct?

Yes for v1. The first release does not require secrets, auth, shared state,
or a runtime database.

## What worked

- GitHub Pages could host the app directly from `docs/`.
- SVG-first editing avoided a server-rendering dependency.
- IndexedDB was enough for local document persistence.

## What did not work

- Full lyon-rs, skia-WASM, and libigl integration is deferred behind engine
  adapter boundaries.

## What surprised us

- GitHub Pages static hosting constraints make COOP/COEP-dependent WASM a
  deliberate later decision rather than an automatic v1 choice.

## Accepted tech debt

- The first vector engine is TypeScript and browser SVG based.
- Advanced boolean path operations are deferred.

## Next improvements

1. Add a real WASM path operation adapter.
2. Add pressure-sensitive pencil smoothing.
3. Add symbol libraries and reusable components.

## Time spent vs estimate

The initial v0.1.0 implementation was completed inside one bootstrap session.
