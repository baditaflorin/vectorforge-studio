# 0061 - Input Pathway Coverage Policy

## Status

Accepted

## Context

Real users expect to drag, paste, select, and reopen their own files.

## Decision

Use one import router for all browser input channels. It classifies inputs as:

- VectorForge project JSON.
- SVG text/file.
- Raster palette image.
- Unsupported or out-of-scope input.

Supported channels are picker, multi-file picker, drag/drop, paste, clipboard
read, share-hash import, and last-session restore. URL import and folder import
are out of scope for Mode A because arbitrary URLs hit CORS and folders are not
needed for v1 workflows.

## Consequences

Every input path shares validation, error messages, and partial-success
reporting.

## Alternatives Considered

- Keep separate SVG and image handlers: rejected because behavior diverged.
