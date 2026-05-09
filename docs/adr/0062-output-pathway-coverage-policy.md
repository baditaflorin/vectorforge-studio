# 0062 - Output Pathway Coverage Policy

## Status

Accepted

## Context

Users need to take work out of the app and reopen it later.

## Decision

Phase 3 supports:

- SVG download and copy-to-clipboard.
- PNG artboard export.
- Native `.vectorforge.json` project export/import.
- Hash share URLs for small projects.
- Print/PDF through browser print.

API/curl, embed code, and server-backed short links are out of scope because
the app remains Mode A.

## Consequences

Project files become the complete persistence contract; SVG remains the
interoperability contract.

## Alternatives Considered

- Treat SVG as the only save format: rejected because palette/settings/history
  cannot round-trip through SVG.
