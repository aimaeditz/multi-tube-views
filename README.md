# Multi Tube Views (MTV) 📺

> A clean, responsive, multi-platform public media viewing workspace.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Static%20HTML%20%2B%20JS-blue.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-success.svg)]()

**Live:** [https://multitubeviews.com](https://multitubeviews.com)  
**Brand:** AiMAEditz  
**Repository:** [aimaeditz/multi-tube-views](https://github.com/aimaeditz/multi-tube-views)

---

## Overview

**Multi Tube Views (MTV)** is a public media workspace for creators, researchers, and everyday users.

- **20 platform workspaces** — dedicated tools for major video, live, short-form, social, audio, and creative platforms  
- **Single + batch URL input** — paste one link or many at once  
- **Platform-specific validation** — regex and format checks per platform  
- **Embed generation** — clean players where embedding is allowed  
- **Official view links** — honest fallback when a platform blocks iframes  
- **Layouts** — 1–4 columns, aspect ratios, audio controls  
- **AI Prompts & Tools** — curated image prompts and external generator tools  
- **Light / dark mode**, responsive design, accessibility-friendly UI  

No login, no tracking cookies, no backend required for core features.

---

## Features

### Media Platform Workspaces
Isolated multi-player pages with:
- URL validation  
- Embed or official gateway button  
- Column and aspect-ratio controls  
- Muted-by-default multi-player behavior (browser autoplay rules)  

### AI Prompts & Tools
Browse curated image prompts and explore free external AI image generator tools.  
This is a **static** directory (HTML + JSON/JS). It does **not** require an AI server.

### Static & private by design
- Runs on **GitHub Pages** (or any static host)  
- Relative asset paths  
- No required API keys for the media workspace  
- No artificial views, bots, or metric inflation  

---

## Live site

Open: [https://multitubeviews.com](https://multitubeviews.com)

Main entry points:
- Home — overview + platform categories  
- Platforms — full directory of 20 tools  
- AI Prompts & Tools — curated prompts and tool directory  
- About / Contact / Settings / Legal pages  

---

## Local use

This project is primarily **static HTML, CSS, and JavaScript**.

1. Clone the repo:
   ```bash
   git clone https://github.com/aimaeditz/multi-tube-views.git
   cd multi-tube-views
   ```
2. Open `index.html` in a browser, **or** serve the folder with any static server:
   ```bash
   npx serve .
   ```
3. No Node backend is required for the public media workspace or the prompt library.

---

## Deploy (GitHub Pages)

1. Push to the `main` branch  
2. Enable **GitHub Pages** from the repository settings  
3. Custom domain: `multitubeviews.com` (see `CNAME`)  
4. Site is static — no server process to run  

Also works on Cloudflare Pages, Netlify, or any static host.

---

## Project structure (simplified)

```text
multi-tube-views/
├── index.html              # Homepage
├── platforms.html          # Platform directory
├── platforms/              # 20 platform workspace pages
├── ai-prompt.html          # AI Prompts & Tools (static)
├── about.html, settings.html, ...
├── assets/
│   ├── css/                # Styles
│   ├── js/                 # Platform engine, theme, navigation, etc.
│   ├── icons/
│   └── data/               # Static data (e.g. prompts JSON)
├── sw.js                   # Service worker (static assets)
├── manifest.json
├── robots.txt
├── sitemap.xml
├── CNAME                   # multitubeviews.com
└── README.md
```

---

## What this project is NOT

- It does **not** generate fake views, watch time, or bot traffic  
- It does **not** bypass platform security or private content  
- It is **not** affiliated with YouTube, Vimeo, Twitch, Spotify, or any listed platform  
- It does **not** require a Node/Express AI server for normal use  

---

## FAQ (short)

**Why do some platforms show “Official View Link” instead of an embed?**  
Some platforms block general iframe embedding (CSP / policy). MTV validates the URL and offers a direct official link instead of a broken player.

**Why are players muted by default?**  
Browsers restrict autoplay with sound. Users can unmute individual players.

**Does MTV need an API key?**  
No, not for platform workspaces or the static prompt library.

---

## License & Attribution

Distributed under the **MIT License**.

Multi Tube Views is an independent educational and productivity project.  
Trademarks and media copyrights belong to their respective owners.
