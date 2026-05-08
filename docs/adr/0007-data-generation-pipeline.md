# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

This ADR is mandatory in the bootstrap checklist for Mode B. VectorForge Studio
uses Mode A.

## Decision

No data-generation pipeline is implemented in v1.

## Consequences

- `make data` is omitted.
- There are no generated Parquet, SQLite, or JSON data artifacts.
- If shared demo assets or public datasets become part of the product, this ADR
  must be replaced before implementation.

## Alternatives Considered

- Add an empty data pipeline: rejected because it would create maintenance
  surface without v1 value.
