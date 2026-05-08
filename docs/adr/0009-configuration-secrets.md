# 0009 - Configuration And Secrets Management

## Status

Accepted

## Context

Mode A must not contain secrets in the frontend or repository. Configuration is
limited to public build metadata and URLs.

## Decision

Use Vite build-time constants for public metadata only. Commit `.env.example`
with placeholders. Ignore `.env*` except `.env.example`. Run gitleaks from the
local pre-commit hook when installed.

## Consequences

- The frontend never receives API keys or tokens.
- GitHub repository and PayPal URLs are public constants.
- Any future secret-requiring feature must move out of Mode A or use a
  user-supplied key flow documented in a new ADR.

## Alternatives Considered

- Encrypted secrets in frontend assets: rejected because obfuscation is not
  security.
- Runtime secret proxy: rejected by ADR 0001.
