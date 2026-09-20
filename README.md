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
- **70 free Creator Tools** — SEO titles, hashtags, keywords, meta
  descriptions, scripts, bios, content calendars, translation, and more
- **73 in-browser Media Converter Tools** — video/audio conversion,
  trimming, speed change, voice-to-text, text-to-speech, QR generation,
  PDF manipulation, image editing, and more — 100% client-side, no uploads
- **111 browser utilities across 15 categories** — text, developer,
  web/SEO, image/graphics, file/data, and everyday utilities — 100%
  client-side, zero uploads
- **211 AI Tools across 6 categories** — Video & Scripting, Social & Growth,
  Copywriting & Sales, Creative & Narrative, SEO & Discovery, and Technical & Code
- **AI Prompts & Tools** — a curated, live-synced AI image prompt library
  plus a directory of free external AI image generators
- **Single + batch URL input**, platform-specific validation, embed
  generation with official-link fallback, 1–4 column layouts, light/dark
  mode, responsive and accessible UI

No login, no sign-up, and no account is required anywhere on the site.

---

## Features

### Media Platform Workspaces
Isolated multi-player pages per platform with URL validation, embed or
official gateway button, column and aspect-ratio controls, and
muted-by-default multi-player behavior (per browser autoplay rules).

### Creator Tools
70 free tools covering the full content-creation workflow: titles,
keywords, hashtags, descriptions, scripts, hooks, bios, calendars,
translation, grammar polish, and more — powered by **MTV AI**, the
site's own in-house AI system.

### AI Tools
A separate directory of 211 dedicated generative tools spanning voice
synthesis, video scripting, social growth, copywriting, creative
writing, SEO, and technical/code use cases — also powered by **MTV AI**.

### Media Converter Tools
73 tools for converting, trimming, and editing video, audio, images, and
PDF documents directly in the browser — no file ever leaves the user's
device.

### Browser Utilities
111 zero-upload utilities (text, developer, SEO, image/color, file/data,
and everyday tools), each with its own dedicated page — pure browser
APIs, no server involved.

### AI Prompts & Tools
A curated image-prompt library that syncs live from an external source,
plus quick links to free external AI image generators.

### Private by design
- No login, no accounts, no unnecessary tracking
- Converter Tools and Browser Utilities never upload files anywhere —
  all processing happens locally in the browser
- No artificial views, bots, or metric inflation on any platform
  workspace
- Internal implementation details of MTV AI are not published

---

## Live site

Open: [https://multitubeviews.com](https://multitubeviews.com)

Main entry points:
- **Home** — overview of all sections
- **AI Prompt** — prompt library + AI image tool directory
- **AI Tools** — 211 AI-powered generative tools
- **Creator Tools** — 70 AI-powered creator utilities
- **Converter Tools** — 73 in-browser media converters
- **Browser Utilities** — 111 in-browser developer/text/SEO/image/file
  utilities
- **Platforms** — full directory of 40 platform workspaces
- About / Settings / Legal pages

---

## Tech stack

- **Frontend:** static multi-page site — HTML, CSS, vanilla JavaScript,
  bundled with **Vite**
- **AI features:** powered by **MTV AI**, a private in-house system
  (implementation details not published)
- **Hosting:** **Vercel**, with a custom domain
- **Media Converter Tools & Browser Utilities:** 100% client-side —
  standard browser APIs and libraries, zero server calls, zero file
  uploads

---

## Local use

This project's frontend is static HTML/CSS/JS.

1. Clone the repo:
   ```bash
   git clone https://github.com/aimaeditz/multi-tube-views.git
   cd multi-tube-views
   ```
2. To preview the static pages (Platforms, Converter Tools, and Browser
   Utilities all work with no backend):
   ```bash
   npx serve .
   ```
3. Creator Tools and AI Tools require the MTV AI backend, which is not
   part of this public setup.

---

## Deploy

The live site deploys via **Vercel**, connected directly to this
repository's `main` branch — every push triggers an automatic redeploy.

---

## Project structure (simplified)

```text
multi-tube-views/
├── index.html                    # Homepage
├── ai-prompt.html                 # AI Prompts & Tools (live-synced library)
├── ai-tools.html                  # 211 AI Tools Suite
├── ai-voice-generator.html        # AI Voice Generator (TTS)
├── creator-tools.html             # 70 Creator Tools
├── media-converter-tools.html     # 73 client-side media converters
├── browser-utilities.html         # Browser Utilities landing page
├── browser-utilities/             # 111 individual utility tool pages
├── platforms.html                 # Platform directory
├── platforms/                     # 40 platform workspace pages
├── about.html, settings.html, credits.html,
│   disclaimer.html, privacy.html, terms.html
├── assets/
│   ├── css/                       # Styles
│   ├── js/                        # Core engine, theme, navigation, etc.
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
Browsers restrict autoplay with sound; users can unmute individual
players.

**Does MTV need an API key to use?**
No. Nothing on the visitor-facing site requires a key or account.

---

## License & Attribution

Distributed under the **MIT License**.

Multi Tube Views is an independent project. Trademarks and media
copyrights belong to their respective owners.
