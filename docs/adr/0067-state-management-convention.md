# 0067 - State Management Convention

## Status

Accepted

## Context

Some document edits were committed into undo history while others directly set
state.

## Decision

- Document mutations use `commitDocument` unless they are transient previews.
- UI settings use persisted local settings and are not part of document undo.
- Imported project files replace document, palette, and settings together.
- History lives in editor state and is reset on project load/reset.

## Consequences

Undo behavior is predictable and settings survive reload independently.

## Alternatives Considered

- Put settings inside document undo history: rejected because zoom/preferences
  are not artwork edits.
