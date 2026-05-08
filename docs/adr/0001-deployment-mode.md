# 0001 - Deployment Mode

## Status

Accepted

## Context

VectorForge Studio is a browser-native vector editor. The v1 scope requires
SVG creation, Bezier editing, local persistence, SVG import/export, palette
extraction, offline use, and visibility of project metadata. It does not
require account auth, shared collaboration, server-side secrets, cross-device
sync, or a runtime database.

## Decision

Use Mode A: Pure GitHub Pages.

The app is served as static assets from:

https://baditaflorin.github.io/vectorforge-studio/

The repository is:

https://github.com/baditaflorin/vectorforge-studio

All computation runs in the browser through TypeScript, browser SVG APIs,
Web Workers where useful, IndexedDB/localStorage, lazy-loaded palette tooling,
and progressive WebGPU feature detection. Backend, Docker, nginx, Go runtime
services, server-side metrics, and runtime secrets are out of scope for v1.

## Consequences

- No runtime API, runtime database, or server deployment is needed.
- User documents stay local unless the user imports or exports files manually.
- GitHub Pages is the only production hosting surface.
- Features requiring secrets or shared state are deferred.
- Pages limitations apply: no custom response headers, no `_redirects`, and
  service worker scope must match `/vectorforge-studio/`.

## Alternatives Considered

- Mode B with prebuilt data: rejected because v1 has no shared data pipeline.
- Mode C with Docker backend: rejected because auth, secrets, and mutations are
  not v1 requirements.
