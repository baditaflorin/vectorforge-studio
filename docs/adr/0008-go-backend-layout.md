# 0008 - Go Backend Layout

## Status

Accepted

## Context

The bootstrap checklist requires Go layout decisions for Mode B or Mode C.
VectorForge Studio uses Mode A.

## Decision

Do not create a Go backend or Go data-generator layout in v1.

## Consequences

- `cmd/`, `internal/`, `pkg/`, `api/`, and runtime server files are absent.
- Docker and nginx are absent.
- If v2 requires sync, collaboration, or secret-bearing APIs, add a new ADR
  before introducing Go service code.

## Alternatives Considered

- Scaffold unused Go folders: rejected because empty backend structure implies
  a deployment surface that does not exist.
