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

Recommendation: **[GitHub Pages](https://pages.github.com/)** + **[VitePress](https://vitepress.dev/)** + **GitHub Actions**. Include **one** `.github/workflows/publish-documentation.yml` layout that matches how you organize git.

### Option A — `git init` inside this folder (recommended for a docs-only repo)

The Git repository root is the VitePress project (this directory on disk):

```text
<repo-root>/
  .github/workflows/publish-documentation.yml
  .vitepress/
  guide/
  index.md
  package.json
  package-lock.json
  ...
```

The workflow in this repo uses `npm ci` at the root and publishes `.vitepress/dist`.

### Option B — Monorepo (`docs/` is a subdirectory)

Git root sits **above** the VitePress project:

```text
<repo-root>/
  docs/
    .vitepress/
    ...
  .github/workflows/publish-documentation.yml
```

Configure the workflow with `working-directory: docs`, `cache-dependency-path: docs/package-lock.json`, and `publish_dir: docs/.vitepress/dist`.

VitePress gives you a TOC, local full-text search, dark mode, responsive layout, and side navigation without rewriting your existing `.md` files.

## Prerequisites

1. Push the repo with the workflow and site files matching **Option A** or **Option B** above.

2. In GitHub: **Settings → Pages → Build and deployment**, set **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**.

3. Grant Actions permission to deploy: **Settings → Actions → General → Workflow permissions** → allow read/write (default for `peaceiris/actions-gh-pages`).

## Local preview

From this project root (same folder as `package.json`):

```bash
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

Add a `CNAME` file in `public/CNAME` at this project root (VitePress copies `public/` to dist). Point DNS per [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Alternative: MkDocs Material

If you prefer Python tooling, MkDocs Material is equally suitable for Markdown-only docs and publishes to gh-pages similarly. This folder is wired for VitePress intentionally (Node-only CI, aligns with TanStack tooling).
