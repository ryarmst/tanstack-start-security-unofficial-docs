This directory is **Markdown source plus a VitePress site** used to publish human-friendly documentation.

## Commands

| Command | Meaning |
|---------|---------|
| `npm install` | Install dependencies (once, or after `package.json` changes) |
| `npm run dev` | Local preview with hot reload |
| `npm run build` | Static output to `.vitepress/dist/` |
| `npm run preview` | Serve the production build locally |

GitHub pushes that touch `docs/**` trigger `.github/workflows/publish-documentation.yml` at the repo root (see **`publishing.md`** on this site or in the repo for Pages settings and base URL quirks).
