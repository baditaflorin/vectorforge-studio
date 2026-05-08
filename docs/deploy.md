# Deployment

Live site:

https://baditaflorin.github.io/vectorforge-studio/

Repository:

https://github.com/baditaflorin/vectorforge-studio

## Publish

```sh
make build
git add docs package.json package-lock.json
git commit -m "ops: publish pages build"
git push origin main
```

GitHub Pages is configured for `main` branch `/docs`.

## Rollback

Revert the commit that changed `docs/`:

```sh
git revert <commit>
git push origin main
```

## Custom domain

No custom domain is configured in v1. To add one later:

1. Add `docs/CNAME` containing the domain.
2. Configure the domain DNS as GitHub Pages requires.
3. Update ADR 0010 and this document before publishing.

GitHub Pages docs:

https://docs.github.com/en/pages
