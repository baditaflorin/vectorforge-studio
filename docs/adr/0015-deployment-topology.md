# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode A deploys only static files.

## Decision

Deploy through GitHub Pages from `main` branch `/docs`.

There is no `deploy/` directory, Docker Compose stack, nginx config,
Prometheus, TLS certificate management, or server runbook in v1.

## Consequences

- Deployment is a git push plus Pages rebuild.
- Rollback is a git revert.
- All operational docs for v1 live in `docs/deploy.md`.

## Alternatives Considered

- Docker backend: rejected by ADR 0001.
- Separate CDN: rejected because GitHub Pages is sufficient for v1.
