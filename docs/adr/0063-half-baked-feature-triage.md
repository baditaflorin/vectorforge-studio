# 0063 - Half-Baked Feature Triage Decisions

## Status

Accepted

## Context

Phase 3 identified features that existed but were not complete enough for
strangers.

## Decision

| Feature            | Decision  | Rationale                                        |
| ------------------ | --------- | ------------------------------------------------ |
| Autosave           | Finish    | Last-session restore completes save semantics.   |
| Import             | Finish    | Picker-only import is insufficient.              |
| Export             | Finish    | Native state, copy, share, and print are needed. |
| Keyboard shortcuts | Finish    | Claimed feature must be discoverable.            |
| Local saves        | Finish    | Add clear/reset and project-file symmetry.       |
| URL import         | Hide/omit | CORS makes it unreliable in Mode A.              |
| Folder import      | Omit      | Not needed for a single-document editor.         |
| API output         | Omit      | No runtime API exists.                           |

## Consequences

The UI will contain only controls that perform real work.

## Alternatives Considered

- Keep URL import as a text box with best effort fetch: rejected as confusing.
