# Multi Tube Views — GitHub Pages Deployment Guide

This guide provides instructions for deploying **Multi Tube Views** (`multi-tube-views`) to GitHub Pages or any static web host.

---

## 1. Static Architecture Overview

Multi Tube Views is built entirely as a pure static frontend workspace:
- **Zero Backend Dependencies:** No Node.js runtime or database required in production.
- **Pure Client-Side Routing:** Every tool is its own static HTML document (`index.html`, `platforms/youtube.html`, etc.) which guarantees direct bookmarking and refresh persistence.
- **LocalStorage Preferences:** User themes and grid settings stay entirely in the user's browser.

---

## 2. GitHub Pages Deployment Steps

### Method A: Deploying Directly from Root Branch (`main` / `master`)

1. **Initialize Git & Commit Files:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Multi Tube Views production release"
   ```

2. **Push to GitHub Repository:**
   ```bash
   git remote add origin https://github.com/<your-username>/multi-tube-views.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Select `main` branch and `/ (root)` folder.
   - Click **Save**.

4. **Verify Deployment:**
   - Your site will be live at `https://<your-username>.github.io/multi-tube-views/`.
   - Ensure the `.nojekyll` file remains at the project root to prevent Jekyll from skipping asset directories.

---

## 3. Custom Domain Configuration (Optional)

If using a custom domain (e.g., `views.yourdomain.com`):

1. Create a `CNAME` file at the repository root containing your domain:
   ```text
   views.yourdomain.com
   ```
2. In your DNS provider (Cloudflare, Namecheap, Google Domains, etc.), create a `CNAME` record pointing `views` to `<your-username>.github.io`.
3. In GitHub Repository **Settings** > **Pages**, enter your custom domain and check **Enforce HTTPS**.

---

## 4. Platform Adapter Maintenance & CSP Notes

- **Origin Handshakes:** Twitch embeds dynamically inject the current `window.location.hostname` into the `parent` parameter. When deploying to a custom domain, Twitch embeds will adapt automatically.
- **No-Cookie Endpoints:** YouTube uses `https://www.youtube-nocookie.com/embed/` for privacy and compliance.
- **DNT Privacy:** Vimeo embeds include the `dnt=1` parameter by default.
