# 0060 - Completeness Audit Findings And Phase 3 Success Metrics

## Status

Accepted

## Context

Phase 3 audits found that VectorForge Studio had a convincing demo and core
editor, but strangers would hit walls when loading real data, preserving full
project state, sharing work, clearing state, and discovering shortcuts.

## Decision

Phase 3 success is defined by:

- Required input rows Green: file picker, multi-file, drag/drop, paste,
  clipboard image/text, project file, autosave restore, and hash share import.
- Required output rows Green: SVG, PNG, native project JSON, copy SVG, copy
  share URL, print, save/reset.
- README claims each have either a test or a documented limitation.
- Codebase audit after Phase 3 reports zero core DRY findings and zero
  TODO/FIXME/XXX/HACK.
- Stranger test completes import, edit, persist, export, copy/share, and reset.

## Consequences

This ADR makes completeness measurable. UI polish and vector-engine changes
remain out of scope.

## Alternatives Considered

- Treat v0.2.0 as complete: rejected because input/output pathways were too
  narrow for real users.
