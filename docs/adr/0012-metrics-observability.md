# 0012 - Metrics And Observability

## Status

Accepted

## Context

Mode A has no server-side metrics. Analytics would add privacy and consent
questions.

## Decision

Ship v1 with no analytics. The app shows local runtime health indicators:
storage availability, WebGPU availability, service worker status, and current
document complexity.

## Consequences

- No tracking scripts are loaded.
- `docs/privacy.md` documents the no-analytics posture.
- Product decisions rely on direct feedback and issue reports.

## Alternatives Considered

- Plausible analytics: deferred until there is a clear need and consent copy.
- Prometheus metrics: rejected because there is no backend.
