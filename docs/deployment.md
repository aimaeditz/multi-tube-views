# Multi Tube Views — Architecture & Platform Reference Guide

This document provides a technical reference for the architecture, security practices, and browser standards implemented across **Multi Tube Views (MTV)**.

---

## 1. System Architecture

Multi Tube Views is built with a client-first, privacy-respecting architecture:

- **Frontend Views:** Responsive HTML5/JS views with light/dark theme engines, 20 platform player adapters, an AI Prompt Library, and Creator Tools shortcuts.
- **Client-Side Engine:** All URL parsing, platform regex validation, grid state generation, and local preferences management run entirely in the browser.
- **No Backend Database or User Tracking:** The site requires no backend user accounts or external database logging. Submitted URLs and viewing preferences remain strictly on the user's local device.

---

## 2. Local State Management

Multi Tube Views uses browser `localStorage` to retain non-sensitive user display preferences across sessions:

| Storage Key | Type | Description |
|-------------|------|-------------|
| `mtv_theme` | String (`light`, `dark`, `system`) | Saved theme mode preference |
| `mtv_density` | String (`comfortable`, `compact`) | Saved interface layout density |
| `mtv_motion` | String (`normal`, `reduced`) | Accessibility reduced motion setting |
| `mtv_layout_cols` | String (`auto`, `1`, `2`, `3`, `4`) | Preferred multi-stream grid column layout |
| `mtv_aspect_ratio` | String (`auto`, `16-9`, `9-16`, `4-3`, `1-1`) | Preferred player aspect ratio |

---

## 3. Media Embedding & Security Compliance

### Cross-Origin Security
- **Official Embeds:** Platform adapters for YouTube, Vimeo, Twitch, Spotify, Dailymotion, Kick, Bilibili, Telegram, SoundCloud, and Rumble utilize official provider iframe embed endpoints.
- **Restricted Platforms:** Platforms enforcing `X-Frame-Options: SAMEORIGIN` or CSP `frame-ancestors 'self'` (e.g., Instagram, TikTok, Threads, X, LinkedIn, Reddit, Pinterest, Snapchat, Odysee) are rendered as verified "Official Platform View" gateway cards with direct links.

### Browser Autoplay & Audio Management
- Players initialize in muted mode by default to comply with browser Media Engagement Index (MEI) requirements.
- Users can selectively unmute individual streams via embedded controls.

---

## 4. Privacy & Safety Summary

- Zero client-side API secret keys exposed in code.
- Zero server-side tracking or persistent user history logs.
- Full WCAG AA color contrast compliance in light and dark modes.
- Full responsive adaptation across mobile, tablet, and desktop viewports.
