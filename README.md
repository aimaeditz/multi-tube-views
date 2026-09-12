# Multi Tube Views (MTV) 📺

> A clean, responsive, multi-platform public media workspace with free AI
> creator tools and 100% client-side browser utilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Static%20HTML%20%2B%20JS-blue.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-Vercel-black.svg)]()

**Live:** [https://multitubeviews.com](https://multitubeviews.com)
**Brand:** AiMAEditz
**Repository:** [aimaeditz/multi-tube-views](https://github.com/aimaeditz/multi-tube-views)

---

## Overview

**Multi Tube Views (MTV)** is a free, all-in-one media and creator
workspace for creators, researchers, and everyday users.

- **40 platform workspaces** — dedicated multi-player tools for major
  video, live, short-form, social, and audio platforms
- **20 free AI Creator Tools** — SEO titles, hashtags, keywords, meta
  descriptions, scripts, bios, content calendars, translation, and more
- **15 in-browser Media Converter Tools** — video/audio conversion,
  trimming, speed change, voice-to-text, text-to-speech, QR generation,
  PDF↔image, image cropping, and more — 100% client-side, no uploads
- **36 Browser Utilities across 6 categories** — text, developer,
  web/SEO, image/graphics, file/data, and everyday utilities — 100%
  client-side, zero uploads
- **AI Prompts & Tools** — a curated, live-synced AI image prompt library
  plus a directory of free external AI image generators
- **Single + batch URL input**, platform-specific validation, embed
  generation with official-link fallback, 1–4 column layouts, light/dark
  mode, responsive and accessible UI

No login required anywhere on the site.

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

### Media Converter Tools
15 tools for converting, trimming, and editing video/audio directly in
the browser — no file ever leaves the user's device.

### Browser Utilities
36 zero-upload utilities (text, developer, SEO, image/color, file/data,
and everyday tools), each with its own dedicated page — pure browser APIs,
no server involved.

### AI Prompts & Tools
A curated image-prompt library that syncs live from a Blogger source,
plus quick links to free external AI image generators.

### Private by design
- No login, no tracking beyond standard analytics
- Converter Tools and Browser Utilities never upload files anywhere —
  all processing happens locally in the browser
- No artificial views, bots, or metric inflation on any platform workspace

---

## Live site

Open: [https://multitubeviews.com](https://multitubeviews.com)

Main entry points:
- **Home** — overview of all 5 sections
- **AI Prompt** — prompt library + AI image tool directory
- **Creator Tools** — 20 AI-powered creator utilities
- **Converter Tools** — 15 in-browser media converters
- **Browser Utilities** — 36 in-browser developer/text/SEO/image/file utilities
- **Platforms** — full directory of 40 platform workspaces
- About / Settings / Legal pages

---

## Tech stack

- **Frontend:** static multi-page site — HTML, CSS, vanilla JavaScript,
  bundled with **Vite**
- **Backend:** two small Vercel serverless functions:
  - `api/ai-proxy.js` — powers the 20 Creator Tools, routing requests
    across multiple free AI providers and API keys in parallel
  - `api/prompt-feed.js` — fetches the AI Prompt Library's Blogger source
    server-side (avoids browser CORS issues)
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
3. To run the Creator Tools' AI backend locally, use the Vercel CLI
   (`vercel dev`) with your own API keys set as local environment
   variables (see `api/ai-proxy.js` for the expected variable names per
   provider).

---

## Deploy

The live site deploys via **Vercel**, connected directly to this
repository's `main` branch — every push triggers an automatic redeploy.
API keys for the Creator Tools' AI backend are stored only in Vercel's
Project → Environment Variables, never in this repository.

---

## Project structure (simplified)

```text
multi-tube-views/
├── index.html                    # Homepage
├── ai-prompt.html                 # AI Prompts & Tools (live-synced library)
├── creator-tools.html             # 20 AI Creator Tools
├── media-converter-tools.html     # 15 client-side media converters
├── browser-utilities.html         # Browser Utilities landing page
├── browser-utilities/             # 36 individual utility tool pages
├── platforms.html                 # Platform directory
├── platforms/                     # 40 platform workspace pages
├── about.html, settings.html, credits.html,
│   disclaimer.html, privacy.html, terms.html
├── api/
│   ├── ai-proxy.js                # Multi-provider AI backend (Creator Tools only)
│   └── prompt-feed.js             # Server-side Blogger feed fetcher
├── assets/
│   ├── css/                       # Styles
│   ├── js/                        # Core engine, theme, navigation, mtv-ai-core.js, etc.
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
No — as a visitor, nothing requires a key. Only the Creator Tools' AI
backend (server-side, invisible to visitors) uses API keys, which are
configured once in Vercel by the site owner.

---

## License & Attribution

Distributed under the **MIT License**.

Multi Tube Views is an independent project. Trademarks and media
copyrights belong to their respective owners.
