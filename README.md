# Multi Tube Views (MTV) 📺

> A clean, responsive, multi-platform public media workspace with free AI
> creator tools, a dedicated AI generative tools suite, and 100%
> client-side browser utilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Static%20HTML%20%2B%20JS-blue.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-Vercel-black.svg)]()

**Live:** [https://multitubeviews.com](https://multitubeviews.com)
**Brand:** AiMAEditz
**Repository:** [aimaeditz/multi-tube-views](https://github.com/aimaeditz/multi-tube-views)

---

## Overview

**Multi Tube Views (MTV)** is a free, all-in-one media and creator
workspace for creators, researchers, and everyday users — **229 tools**
across five systems, plus 40+ platform workspaces.

- **40+ platform workspaces** — dedicated multi-player tools for major
  video, live, short-form, social, and audio platforms
- **20 free AI Creator Tools** — SEO titles, hashtags, keywords, meta
  descriptions, scripts, bios, content calendars, translation, and more
- **60 AI Tools** — a separate dedicated AI generative suite across 6
  categories: Video & Scripting, Social & Growth, Copywriting & Sales,
  Creative & Narrative, SEO & Discovery, and Technical & Code
- **60 in-browser Media Converter Tools** — video/audio conversion,
  trimming, speed change, voice-to-text, text-to-speech, QR generation,
  PDF manipulation, image editing, and more — 100% client-side, no uploads
- **89 browser utilities across 15 categories** — text, developer,
  web/SEO, image/graphics, file/data, and everyday utilities — 100%
  client-side, zero uploads
- **AI Prompts & Tools** — a curated, live-synced AI image prompt library
  plus a directory of free external AI image generators
- **Single + batch URL input**, platform-specific validation, embed
  generation with official-link fallback, 1–4 column layouts, light/dark
  mode, responsive and accessible UI

No login, no sign-up, and no account system required anywhere on the site.

---

## Features

### Media Platform Workspaces
Isolated multi-player pages per platform with URL validation, embed or
official gateway button, column and aspect-ratio controls, and
muted-by-default multi-player behavior (per browser autoplay rules).

### Creator Tools (AI-powered)
20 free tools covering the full content-creation workflow: titles,
keywords, hashtags, descriptions, scripts, hooks, bios, calendars,
translation, grammar polish, and more. Powered by a server-side proxy
(`api/ai-proxy.js`) that routes each request across multiple free AI
providers for speed and reliability — no AI provider or model is ever
named on the site itself.

### AI Tools
60 dedicated generative AI tools organized into 6 categories (10 tools
each): Video & Scripting, Social & Growth, Copywriting & Sales, Creative
& Narrative, SEO & Discovery, and Technical & Code. A separate system
from Creator Tools, sharing the same multi-provider AI backend and
"MTV AI" branding — no vendor/model names exposed on the live site.

### Media Converter Tools
60 tools for converting, trimming, and editing video, audio, images, and
PDF documents directly in the browser — no file ever leaves the user's
device. Split across Image (19), Video (15), Audio (15), and PDF/Document
(11) categories.

### Browser Utilities
89 zero-upload utilities across 15 categories (text, developer, SEO,
image/color, file/data, and everyday tools), each with its own dedicated
page — pure browser APIs, no server involved.

### AI Prompts & Tools
A curated image-prompt library that syncs live from a Blogger source,
plus quick links to free external AI image generators.

### Private by design
- No login, no sign-up, no accounts, no tracking beyond standard analytics
- Converter Tools and Browser Utilities never upload files anywhere —
  all processing happens locally in the browser
- No artificial views, bots, or metric inflation on any platform workspace

---

## Live site

Open: [https://multitubeviews.com](https://multitubeviews.com)

Main entry points:
- **Home** — overview of all sections
- **AI Prompt** — prompt library + AI image tool directory
- **AI Tools** — 60 dedicated AI generative tools across 6 categories
- **Creator Tools** — 20 AI-powered creator utilities
- **Converter Tools** — 60 in-browser media converters
- **Browser Utilities** — 89 in-browser developer/text/SEO/image/file utilities
- **Platforms** — full directory of 40+ platform workspaces
- About / Settings / Legal pages

---

## Tech stack

- **Frontend:** static multi-page site — HTML, CSS, vanilla JavaScript,
  bundled with **Vite**
- **Backend:** two small Vercel serverless functions:
  - `api/ai-proxy.js` — powers the 20 Creator Tools **and** the 60 AI
    Tools, routing requests across multiple free AI providers and API
    keys in parallel (fastest response wins)
  - `api/prompt-feed.js` — fetches the AI Prompt Library's Blogger source
    server-side (avoids browser CORS issues)
- **AI providers:** Google Gemini, Groq, OpenRouter, DeepSeek, llm7.io,
  Cerebras, Mistral AI — keys stored only in Vercel Environment Variables,
  never in the repository
- **Hosting:** **Vercel** (with a custom domain via Hostinger)
- **Media Converter Tools & Browser Utilities:** 100% client-side —
  Canvas API, Web Crypto API, File/URL/DOM APIs, native
  SpeechRecognition/SpeechSynthesis, and CDN libraries (pdf.js, jsPDF,
  qrcodejs) where needed — zero server calls

---

## Local use

This project's frontend is static HTML/CSS/JS; the two AI-related
endpoints are Vercel serverless functions.

1. Clone the repo:
   ```bash
   git clone https://github.com/aimaeditz/multi-tube-views.git
   cd multi-tube-views
   ```
2. To preview the static pages only (Platforms, Converter Tools, Browser
   Utilities all work with no backend):
   ```bash
   npx serve .
   ```
3. To run the Creator Tools / AI Tools backend locally, use the Vercel
   CLI (`vercel dev`) with your own API keys set as local environment
   variables (see `api/ai-proxy.js` for the expected variable names per
   provider).

---

## Deploy

The live site deploys via **Vercel**, connected directly to this
repository's `main` branch — every push triggers an automatic redeploy
(typically live within 2–3 minutes). API keys for the AI backend are
stored only in Vercel's Project → Environment Variables, never in this
repository.

---

## Project structure (simplified)

```text
multi-tube-views/
├── index.html                    # Homepage
├── ai-prompt.html                 # AI Prompts & Tools (live-synced library)
├── ai-tools.html                  # 60 AI Tools directory (6 categories)
├── creator-tools.html             # 20 AI Creator Tools
├── media-converter-tools.html     # 60 client-side media converters
├── browser-utilities.html         # Browser Utilities landing page
├── browser-utilities/             # 89 individual utility tool pages
├── platforms.html                 # Platform directory
├── platforms/                     # 40+ platform workspace pages
├── about.html, settings.html, credits.html,
│   disclaimer.html, privacy.html, terms.html, articles.html
├── api/
│   ├── ai-proxy.js                # Multi-provider AI backend (Creator Tools + AI Tools)
│   └── prompt-feed.js             # Server-side Blogger feed fetcher
├── assets/
│   ├── css/                       # Styles
│   ├── js/                        # Core engine, theme, navigation, mtv-ai-core.js, etc.
│   ├── data/
│   │   ├── ai-tools-data.js       # 60 AI Tools data (6 categories)
│   │   └── media-tools-data.js    # 60 Media Converter Tools data
│   ├── icons/                     # Favicons, icons
│   └── images/                    # Social share preview images
├── sitemap.xml
├── robots.txt
├── ads.txt
└── README.md
```

---

## What this project is NOT

- It does **not** generate fake views, watch time, or bot traffic
- It does **not** bypass platform security or private content
- It is **not** affiliated with YouTube, Vimeo, Twitch, Spotify, or any
  listed platform
- It does **not** have login, sign-up, or account features
- Converter Tools and Browser Utilities do **not** upload any file to a
  server — all processing is local to the browser

---

## FAQ (short)

**Why do some platforms show "Official View Link" instead of an embed?**
Some platforms block general iframe embedding (CSP/policy). MTV validates
the URL and offers a direct official link instead of a broken player.

**Why are players muted by default?**
Browsers restrict autoplay with sound; users can unmute individual players.

**Does MTV need an API key to use?**
No — as a visitor, nothing requires a key. Only the AI backend
(server-side, invisible to visitors) uses API keys, which are configured
once in Vercel by the site owner.

**Do I need an account?**
No — MTV has no login, sign-up, or account system. Every tool is
directly usable.

---

## License & Attribution

Distributed under the **MIT License**.

Multi Tube Views is an independent project. Trademarks and media
copyrights belong to their respective owners.
