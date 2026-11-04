# Portfolio frontend

React 18 + Vite + Tailwind + Framer Motion. A **static web app**: everything important is
bundled at build time (`src/data/*`), and a small read-only backend adds live data.

```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api to the Render backend)
npm run build      # vite build + creates dist/404.html (SPA fallback)
npm run preview    # serve the production build locally (same /api proxy)
```

## Where things live

| Path | What |
|---|---|
| `src/data/` | Static content: profile, projects, experience, certifications, skills, plus `feeds.config.js` and the generated `feeds.snapshot.json` |
| `src/media/` | Drop-in images for projects, experience, gallery and business work (see its README) |
| `scripts/fetch-feeds.mjs` | Build-time sync of Medium, DEV, AWS Builder and YouTube into the snapshot |
| `src/hooks/useFeeds.js` | Static-first articles/videos, refreshed live in the browser |
| `src/components/chaos/` | **Chaos Monkey**, the signature interaction |
| `src/lib/sfx.js` | Synthesised UI sounds (Web Audio, no audio files, off by default) |
| `src/services/api.js` | Read-only client for the backend (`/api/*`) |
| `src/hooks/useBackend.js` | Static-first loading: render bundled data, upgrade when the backend answers |
| `src/components/shell/` | CloudShell, a terminal easter egg (backtick or the navbar button) |
| `src/components/ui/BootLoader.jsx` | Entry gate, deploy counter and curtain reveal |
| `src/components/sections/Architecture.jsx` | "Under the hood" diagram + live backend status |

## Editing content

Change a file in `src/data/`, commit, push. Amplify rebuilds and redeploys automatically.

- **Articles and videos** need no editing at all: `npm run feeds` (also part of `npm run build`) pulls Medium, DEV and YouTube. For AWS Builder Center, paste the article links into `awsBuilder.articleUrls` in `src/data/feeds.config.js`.
- **Images:** copy them into `src/media/<folder>/`, named after the project/experience id.

## Backend

`/api/*` is proxied to `https://portfolio-6gcd.onrender.com` (Amplify rewrite in production,
Vite proxy locally), so the browser never makes a cross-origin call. Override with
`BACKEND_ORIGIN=https://… npm run dev` or `VITE_API_URL` (a `.env` file works too; it is git-ignored). With nothing set, the app calls a same-origin `/api` and `/yt`, which Vite proxies in dev and an Amplify rewrite proxies in production, so no CORS settings are needed.
