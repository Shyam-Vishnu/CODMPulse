# Mobile FPS Community Pulse — v6 (Public-safe, hardcoded proxies, AI chat)

This package is ready for **public hosting**. No API keys are exposed client‑side.

## What’s inside
- **Hardcoded proxies** → `config.js` points to your Cloudflare Worker at:
  - Reddit: `https://spring-bonus-310e.shyamvishnu19.workers.dev/reddit/search`
  - Twitter: `https://spring-bonus-310e.shyamvishnu19.workers.dev/twitter/search`
  - Threads: `https://spring-bonus-310e.shyamvishnu19.workers.dev/threads/search` (optional, returns empty by default)
  - Chat: `https://spring-bonus-310e.shyamvishnu19.workers.dev/chat` (server calls OpenAI)
- **No sample data** → Endpoints return *real data only*. If a platform isn’t configured, it returns **empty** instead of fake posts.
- **AI Chat widget** → Uses your Worker’s `/chat` endpoint. Set secret `OPENAI_API_KEY` on Cloudflare.

## Deploy site (GitHub Pages / Netlify)
Just upload the **unzipped** folder contents as-is. The site immediately talks to your Worker.

## Cloudflare Worker setup
Go to Workers & Pages → your worker → **Quick Edit** → paste `api/worker.js` → **Save & Deploy**.

### Required secrets (Workers → Settings → Variables → **Add** → **Text**)
- `OPENAI_API_KEY` → your OpenAI key (for the chat)
- `TWITTER_BEARER` → your Twitter v2 bearer token (for real Twitter data)
- (optional) `THREADS_COOKIE` → if you later implement Threads scraping

> With `TWITTER_BEARER` set, the site will show **real Twitter posts**. Without it, the Twitter column will stay empty (no samples).

## How the chat works
- Front-end POSTs to `/chat` with `{ "question": "..." }`.
- Worker calls OpenAI with your server-side key and returns `{ "answer": "..." }`.
- The key is **never exposed** to the browser.

## Notes
- Reddit uses official JSON and a read-only mirror fallback to avoid CORS.
- If rate-limited, results may be short; the UI will still render gracefully.
- You can safely customize source lists in `config.js` per game.
