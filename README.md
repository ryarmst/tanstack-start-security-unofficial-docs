This directory is **Markdown source plus a VitePress site** used to publish human-friendly documentation.

## Commands

| Command | Meaning |
|---------|---------|
| `npm install` | Install dependencies (once, or after `package.json` changes) |
| `npm run dev` | Local preview with hot reload |
| `npm run build` | Static output to `.vitepress/dist/` |
| `npm run preview` | Serve the production build locally |

After you push `main`, `.github/workflows/publish-documentation.yml` runs and publishes `.vitepress/dist` to the `gh-pages` branch.
