# Multi Tube Views (MTV) 📺

> A clean, responsive, multi-platform public media viewing workspace with a provider-agnostic Universal AI Gateway.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Multi-AI Gateway](https://img.shields.io/badge/AI-Multi--Provider%20Fallback-purple.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-green.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Static%20%2B%20GitHub%20Pages-blue.svg)]()

**Live:** [https://multitubeviews.com](https://multitubeviews.com)  
**Brand:** AiMAEditz  
**Repository:** [aimaeditz/multi-tube-views](https://github.com/aimaeditz/multi-tube-views)

---

## Overview

**Multi Tube Views (MTV)** is a public media workspace for content creators and researchers:

1. **Multi-Platform Viewing Workspace** — View and organize public media from 20+ platforms side-by-side (video, live, short-form, audio, creative communities). Platform-specific validation, embed generation, batch URLs, layouts, and audio controls.
2. **Universal AI Gateway** — Server-side multi-provider AI layer for creator tools (SEO titles, keywords, hashtags, meta descriptions, topics, YouTube SEO packages, grammar polish, translation). Provider-agnostic routing with automatic fallback.

The website is designed so **core media tools keep working even if the AI backend is offline**.

---

## Architecture (Important)

```
Static Frontend (GitHub Pages / multitubeviews.com)
        │
        │  HTTPS  (via assets/js/mtv-ai-sdk.js)
        ▼
Deployed Node.js Backend (Express + TypeScript)
        │
        ▼
Universal AI Gateway (Orchestrator)
        │
        ├── Tool Registry
        ├── Capability Resolver
        ├── Provider / Model Registry
        ├── Provider Adapters
        ├── Fallback Engine
        └── Response Validation + Normalization
        │
        ▼
AI Providers (Gemini, OpenAI, Grok, DeepSeek, Claude, Mistral, OpenRouter, optional Puter)
        │
        ▼
Normalized JSON → AI Tools UI
```

**Reality check:**
- **GitHub Pages hosts only the static frontend.** It cannot run Node.js / Express.
- The AI backend must be deployed separately (Cloud Run, Railway, Render, Fly.io, etc.).
- All secret API keys stay **server-side only**. Never use `VITE_` for API keys.

---

## Security

- Zero client-side API keys
- Secrets only in server environment variables
- Rate limiting on AI endpoints
- Input sanitization and payload limits
- Sanitized error messages (no stack traces / secrets to users)
- CORS restricted to required origins in production
- Existing privacy model preserved (no unnecessary tracking)

---

## AI Tools (Current)

| Tool | Purpose |
|------|---------|
| YouTube SEO Full Package | Titles, description, keywords, tags |
| SEO Title Generator | High-CTR, non-clickbait titles |
| Keyword Research | Seed keywords, long-tail, intent |
| Hashtag Generator | Platform-aware hashtags |
| Meta Description Generator | Search-snippet meta descriptions |
| Topic Generator | Content topic ideas |
| Grammar & Text Improver | Polish and correct copy |
| AI Translator | Localized translation |

Future tools should register metadata (toolId, capability, input/output schema, prompt profile) and go through the same Gateway — no new provider integration required.

---

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/ai` | `POST` | Universal AI gateway (tools / capabilities / prompts) |
| `/api/ai/health` | `GET` | Backend + gateway + provider status |
| `/api/ai/providers` | `GET` | Configured / available providers |
| `/api/ai/compare` | `POST` | Parallel multi-provider comparison |
| `/api/ai/tools` | `GET` | Registered tools (when enabled) |
| `/api/ai/capabilities` | `GET` | Capability registry (when enabled) |
| `/api/ai/models` | `GET` | Model registry (when enabled) |

All successful AI responses use `Content-Type: application/json` and a normalized shape (`success`, `requestId`, `toolId`, `provider`, `model`, `data` / `text`, `fallbackUsed`, `error`, etc.).

---

## Local Development

### Requirements
- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/aimaeditz/multi-tube-views.git
cd multi-tube-views
npm install
cp .env.example .env
```

Edit `.env` and add at least one provider key (e.g. Gemini):

```env
# Server-side only — NEVER prefix with VITE_
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=
ANTHROPIC_API_KEY=
MISTRAL_API_KEY=
OPENROUTER_API_KEY=

# Gateway
DEFAULT_AI_PROVIDER=auto
MAX_FALLBACK_ATTEMPTS=3
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
APP_URL=http://localhost:3000

# Optional: only if you need to point the client at a specific backend during build
# VITE_API_BASE_URL=
```

### Run

```bash
npm run dev          # starts Express + Vite on port 3000
```

Open `http://localhost:3000`.

### Other scripts

```bash
npm run lint         # TypeScript check
npm run test:ai      # AI infrastructure tests
npm run build        # production frontend + backend bundle
npm start            # run production server (dist/server.cjs)
```

---

## Production Deployment

### Frontend (static)
- Deploy the static site to **GitHub Pages** (or Cloudflare Pages / similar).
- Domain: `multitubeviews.com` (CNAME already present).
- Relative asset paths are used so static hosting works without a backend.

### Backend (required for AI Tools)
1. Build: `npm run build`
2. Deploy `dist/server.cjs` (and required assets) to a Node-compatible host:
   - Google Cloud Run
   - Railway
   - Render
   - Fly.io
   - Any Node 18+ host with env vars
3. Set server environment variables (same keys as `.env`, never commit real values).
4. Ensure production CORS allows `https://multitubeviews.com`.
5. Point the frontend AI client (`assets/js/mtv-ai-sdk.js`) at the **live backend URL** so requests return JSON, not HTML.

**Critical:** If the frontend calls a dead or HTML-only URL, the browser will show errors like `Unexpected token '<'`. The backend must be live and every AI route must return valid JSON.

### Health check
After deploy, verify:

```bash
curl -s https://YOUR-BACKEND-URL/api/ai/health
```

Expect JSON with backend/gateway/provider status (no secrets).

---

## Project Structure (simplified)

```text
multi-tube-views/
├── server.ts                 # Express entry + API routes
├── server/
│   ├── ai/
│   │   ├── adapters/         # Gemini, OpenAI, Grok, DeepSeek, Claude, Mistral, OpenRouter, Puter
│   │   ├── tools/            # Tool registry
│   │   ├── prompts/          # Prompt builder + profiles
│   │   ├── validation/       # Input/output validation
│   │   ├── orchestrator.ts   # Gateway + fallback
│   │   ├── registry.ts       # Provider config
│   │   ├── capabilities.ts
│   │   ├── models.ts
│   │   ├── rate-limiter.ts
│   │   ├── observability.ts
│   │   └── types.ts
│   ├── copy-static.ts
│   └── sync-prompts.ts
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── mtv-ai-sdk.js     # Frontend Universal AI client
│   │   ├── ai-tools.js       # AI Tools workspace UI
│   │   ├── platform-engine.js
│   │   └── ...
│   └── data/
├── platforms/                # Platform workspaces
├── tests/
├── index.html, ai-tools.html, settings.html, ...
├── package.json
├── .env.example
└── README.md
```

---

## Adding a New AI Tool (Future)

1. Register the tool in the server tool registry (toolId, capability, inputSchema, outputSchema, promptProfile, preferred providers/models, fallback policy).
2. Add UI in the AI Tools workspace (or a new page) that calls `mtvAI.generate({ toolId, input, provider })`.
3. Do **not** call provider SDKs directly from the frontend.

The Gateway handles routing, fallback, validation, and normalized JSON.

---

## Adding a Provider or Model

1. Implement / update a provider adapter under `server/ai/adapters/`.
2. Register it in `server/ai/registry.ts` and models in `server/ai/models.ts`.
3. Set the corresponding env key on the server.
4. No changes required in individual tool UIs.

---

## Troubleshooting

| Problem | Likely cause | What to check |
|--------|--------------|---------------|
| `Unexpected token '<'` | Frontend received HTML instead of JSON | Backend URL, deploy status, `/api/ai/health`, Content-Type |
| AI Tools always fail | Backend offline or no provider keys | Env vars on the **server**, health endpoint |
| CORS errors | Origin not allowed | Production CORS for `https://multitubeviews.com` |
| Works in AI Studio only | Studio runtime ≠ production | Real backend deploy + frontend pointing at it |
| Keys visible in browser | Accidentally used `VITE_` for secrets | Remove any client-side keys; secrets only in server env |

---

## License & Attribution

Distributed under the **MIT License**.

Multi Tube Views is an independent educational and productivity project.  
It is **not** affiliated with YouTube, Vimeo, Twitch, Spotify, or any listed platform.  
All trademarks and media copyrights belong to their respective owners.

---

## Notes

- AI providers and model IDs change over time. The registry is designed so models can be updated without rewriting the whole app.
- Puter (if used) is optional and must never be a hard dependency.
- Core platform viewing features must remain usable even when AI is unavailable.
