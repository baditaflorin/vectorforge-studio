.PHONY: help install-hooks hooks-pre-commit hooks-commit-msg hooks-pre-push dev build test test-integration smoke lint fmt pages-preview release clean

help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'

install-hooks: ## Wire local git hooks.
	git config core.hooksPath .githooks

hooks-pre-commit: ## Run the pre-commit hook manually.
	.githooks/pre-commit

hooks-commit-msg: ## Run the commit-msg hook manually with MSG=.git/COMMIT_EDITMSG.
	.githooks/commit-msg $${MSG:-.git/COMMIT_EDITMSG}

hooks-pre-push: ## Run the pre-push hook manually.
	.githooks/pre-push

dev: ## Run the frontend dev server.
	npm run dev

build: ## Build the GitHub Pages site into docs/.
	npm run build

test: ## Run unit tests.
	npm run test

test-integration: ## Run integration tests.
	npm run test

smoke: ## Run the static-site smoke test.
	./scripts/smoke.sh

lint: ## Run linters and type checks.
	npm run lint
	npm run fmt:check
	npx tsc -b --pretty false

fmt: ## Format source files.
	npm run fmt

pages-preview: ## Serve docs/ the way GitHub Pages will.
	npm run pages-preview

release: ## Tag a local release.
	./scripts/release.sh

clean: ## Remove generated and temporary local outputs.
	rm -rf coverage tmp
