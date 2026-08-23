# Multi Tube Views (MTV) 📺

> **A clean, responsive, multi-platform public media viewing workspace with dedicated adapters for 20+ video, live-stream, and audio services.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-success.svg)](https://pages.github.com/)
[![Pure Static](https://img.shields.io/badge/Architecture-Pure%20Static%20HTML%2FCSS%2FJS-brightgreen.svg)]()

---

## 🌟 Overview

**Multi Tube Views** is a specialized frontend productivity tool designed to help creators, researchers, media analysts, esports enthusiasts, and educators view and monitor multiple public media streams side-by-side in custom responsive grid layouts.

### Key Architectural Principles
- **Dedicated Platform Tools:** Each of the 20 platforms has its own distinct static HTML page with customized regex validators, sample loaders, and layout preferences.
- **Pure Client-Side / Zero Backend:** 100% static architecture suitable for instant deployment on GitHub Pages, Cloudflare Pages, Vercel, or Netlify.
- **Honest Embed Support:** Respects platform Content Security Policies (CSP). Features official iframe embeds where supported (YouTube, Vimeo, Twitch, Spotify, SoundCloud, Dailymotion, etc.) and clean official-view gateways for platforms that restrict cross-origin embedding (Instagram, TikTok, X, etc.).
- **Strictly Ethical:** **No view botting, no fake engagement, no hidden frames, and no artificial autoplay loops.**
- **Apple-Inspired Design:** Clean typography, generous spacing, high-contrast dark/light mode themes, and silky-smooth micro-interactions.

---

## 📁 Directory Structure

```text
multi-tube-views/
├── .nojekyll                   # Prevents Jekyll processing on GitHub Pages
├── index.html                  # Homepage with Platform Directory & Search
├── about.html                  # About MTV and architecture principles
├── articles.html               # Technical guides & articles
├── privacy.html                # Privacy policy & data disclosures
├── disclaimer.html             # Legal and trademark disclaimers
├── terms.html                  # Terms of service
├── contact.html                # Community & contribution info
├── credits.html                # Open-source attributions
├── settings.html               # Global display & theme preferences
├── docs/
│   └── deployment.md           # GitHub Pages deployment instructions
├── platforms/                  # 20 Dedicated Platform Workspaces
│   ├── youtube.html
│   ├── vimeo.html
│   ├── dailymotion.html
│   ├── twitch.html
│   ├── kick.html
│   ├── facebook.html
│   ├── instagram.html
│   ├── tiktok.html
│   ├── x.html
│   ├── linkedin.html
│   ├── reddit.html
│   ├── pinterest.html
│   ├── bilibili.html
│   ├── rumble.html
│   ├── odysee.html
│   ├── soundcloud.html
│   ├── spotify.html
│   ├── snapchat.html
│   ├── threads.html
│   └── telegram.html
└── assets/
    ├── css/
    │   ├── style.css           # Global tokens & base typography
    │   ├── components.css      # Reusable UI component library
    │   └── responsive.css      # Mobile, tablet, & ultra-wide rules
    ├── js/
    │   ├── storage.js          # LocalStorage preference manager
    │   ├── theme.js            # Light/Dark/System theme engine
    │   ├── validators.js       # URL parsers & regex validators
    │   ├── platform-engine.js  # 20 Platform adapter configurations
    │   ├── navigation.js       # Search bar & mobile menu controller
    │   └── app.js              # Multi-player workspace controller
    └── icons/
        └── favicon.svg         # SVG vector brand icon
```

---

## 🚀 Quick Start (Local Development)

Because Multi Tube Views is a static web application, you can run it with any local static HTTP server:

```bash
# Option 1: Using Python 3
python3 -m http.server 3000

# Option 2: Using npx serve
npx serve -l 3000 .

# Option 3: Using Vite
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🌐 Supported Platforms (20 Adapters)

| Platform | Type | Embed Method | Features |
| :--- | :--- | :--- | :--- |
| **YouTube** | Video / Shorts / Live | Privacy NoCookie Iframe | Video IDs, Shorts, Playlists, Live |
| **Vimeo** | Video / Film | Vimeo Player API | DNT mode, High Definition |
| **Dailymotion** | Video | Dailymotion Embed | Auto-muted playback |
| **Twitch** | Live / VOD / Clip | Parent Handshake Embed | Dynamic parent hostname resolution |
| **Kick** | Live / Replay | Kick Player Embed | Channel broadcasts |
| **Spotify** | Music / Podcast | Spotify Generator Embed | Tracks, Albums, Playlists |
| **SoundCloud** | Audio / DJ Sets | SoundCloud Widget | Visual player mode |
| **Bilibili** | Video / Anime | Bilibili Player | High-speed player stream |
| **Rumble** | Video / Podcast | Rumble Embed | Broadcast replays |
| **Odysee** | Video / LBRY | Odysee Embed | Decentralized video streaming |
| **Facebook** | Watch / Video | Meta Player Plugin | Public video feeds |
| **Telegram** | Post / Clip | Telegram Post Widget | Public channel streams |
| **Instagram** | Reels / Posts | Official View Gateway | Direct verified link |
| **TikTok** | Shorts / Clips | Official View Gateway | Direct verified link |
| **X (Twitter)** | Posts / Spaces | Official View Gateway | Direct verified link |
| **LinkedIn** | Video / Learning | Official View Gateway | Direct verified link |
| **Reddit** | Discussion / Video | Official View Gateway | Direct verified link |
| **Pinterest** | Video Pins | Official View Gateway | Direct verified link |
| **Snapchat** | Spotlight | Official View Gateway | Direct verified link |
| **Threads** | Posts / Clips | Official View Gateway | Direct verified link |

---

## 🛠️ GitHub Pages Deployment

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Select `Deploy from a branch` -> `main` branch -> `/ (root)`.
4. Your workspace is immediately live! See [docs/deployment.md](docs/deployment.md) for custom domains and advanced configurations.

---

## 📄 License & Attribution

Distributed under the MIT License. See [credits.html](credits.html) for open-source acknowledgments. Trademarks belong to their respective owners.
