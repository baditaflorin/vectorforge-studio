# Contributing

Thanks for helping make VectorForge Studio better.

## Local setup

```sh
npm install
make install-hooks
make dev
```

## Commit style

Use Conventional Commits:

- `feat:` for user-facing functionality
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for tests
- `chore:` for maintenance
- `ops:` for release/deployment work

## Pull request expectations

- Run `make lint`, `make test`, and `make build`.
- Keep changes scoped.
- Do not commit secrets, `.env` files, private keys, or generated credentials.
