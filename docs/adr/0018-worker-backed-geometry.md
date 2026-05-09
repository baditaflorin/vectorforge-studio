# 0018 - Worker-Backed Geometry Stats

## Status

Accepted

## Context

The editor now exposes document complexity metrics such as element count, node
count, and approximate path length. Those calculations are cheap for small
documents but can grow with imported SVG complexity.

## Decision

Run geometry analysis through a dedicated Web Worker wrapped with Comlink. The
main React tree sends the current vector document to the worker and renders the
latest returned summary in the status bar.

## Consequences

- The UI stays responsive as document complexity grows.
- The worker is emitted as a separate lazy browser module by Vite.
- Geometry functions stay pure and unit-testable outside the worker boundary.

## Alternatives Considered

- Compute geometry directly in React render: rejected because expensive SVGs
  could make controls feel sticky.
- Runtime backend geometry service: rejected by Mode A.
