---
title: Publishing this site
description: GitHub Pages, Actions, base URL, and alternatives.
---

## Platform choice (free)

| Option | Fits this project? |
|--------|---------------------|
| **GitHub Pages** | Strong default — free on public repos, versioned beside your Markdown, CDN-backed. Works with Actions on every push to `main`. |
| Cloudflare Pages / Netlify | Also free tiers and Git-triggered builds; adds another dashboard. Prefer if you already use them. |
| Read the Docs | Great for Sphinx/MkDocs; less natural for VitePress. |

Recommendation: **[GitHub Pages](https://pages.github.com/)** + **[VitePress](https://vitepress.dev/)** + **GitHub Actions**. The workflow file belongs at `.github/workflows/publish-documentation.yml` on your **repository root** (sibling of the `docs/` folder), not inside `docs/`.

VitePress gives you a TOC, local full-text search, dark mode, responsive layout, and side navigation without rewriting your existing `.md` files.

## Prerequisites

1. Push this workspace (or `/docs` as part of a repo) so the layout is:

```text
<repo-root>/
  docs/
    .vitepress/
    index.md
    tanstack-start-*.md
    package.json
    ...
  .github/workflows/publish-documentation.yml
```

2. In GitHub: **Settings → Pages → Build and deployment**, set **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**.

3. Grant Actions permission to deploy: **Settings → Actions → General → Workflow permissions** → allow read/write (default for `peaceiris/actions-gh-pages`).

## Local preview

```bash
cd docs
npm install
npm run dev
```

Open the URL VitePress prints (usually `http://localhost:5173` plus your `base`).

## Base URL (`VITEPRESS_BASE`)

VitePress needs a correct **base** path so assets resolve on GitHub Pages:

| Site type | Example URL | `VITEPRESS_BASE` |
|-----------|-------------|------------------|
| Project site | `https://user.github.io/my-repo/` | `/my-repo/` |
| User/org site | `https://user.github.io/` (repo `user.github.io`) | `/` |

The included workflow sets `VITEPRESS_BASE=/${repo_name}/` from `GITHUB_REPOSITORY`. For a **user pages** repo, remove that step and set `VITEPRESS_BASE` to `/` (or leave unset and use `base: '/'` in config).

## Custom domain

Add a `CNAME` file in `docs/public/CNAME` (VitePress copies `public/` to dist). Point DNS per [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Alternative: MkDocs Material

If you prefer Python tooling, MkDocs Material is equally suitable for Markdown-only docs and publishes to gh-pages similarly. This folder is wired for VitePress intentionally (Node-only CI, aligns with TanStack tooling).
