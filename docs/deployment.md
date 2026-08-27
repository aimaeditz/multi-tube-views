# Multi Tube Views — Deployment & Backend Setup Guide

This guide provides step-by-step instructions for configuring and deploying **Multi Tube Views (MTV)** with its secure server-side Google Gemini AI integration.

---

## 1. Architecture Overview

Multi Tube Views is built with a modern full-stack architecture:
- **Frontend Layer:** Responsive single-page and multi-page HTML5/JS views with dark/light themes, 20 platform adapters, and responsive multi-view grids.
- **Backend API Layer (`server.ts`):** Express + TypeScript backend running on Node.js. Proxies all AI requests securely to the Google Gemini API using `@google/genai`.
- **API Key Security:** The `GEMINI_API_KEY` remains strictly environment-bound on the server side. No API credentials are ever exposed to the client browser.

---

## 2. Environment Setup

1. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```

2. **Set Your API Key:**
   Open `.env` and set your key:
   ```env
   GEMINI_API_KEY=YOUR_NEW_GEMINI_API_KEY
   ```

---

## 3. Local Development

Start the development server:
```bash
npm run dev
```
The server will bind to `http://0.0.0.0:3000` (or `http://localhost:3000`), serving both the backend API endpoints (`/api/*`) and the frontend via Vite middleware.

---

## 4. Production Deployment

### Option A: Cloud Run / Render / Railway / Heroku (Full-Stack Container)
1. Push your codebase to GitHub.
2. Connect your repository to your Cloud Run / Render / Railway project.
3. Configure the **Environment Variables** in the provider's dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `NODE_ENV`: `production`
4. Set Build and Start scripts:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`

### Option B: Vercel / Serverless Deployment
1. Import the repository into Vercel.
2. Add `GEMINI_API_KEY` under **Project Settings > Environment Variables**.
3. Deploy! Vercel handles the production build and serverless function execution automatically.

---

## 5. Security & Verification Checklist

- [x] `GEMINI_API_KEY` is defined ONLY in `.env` or production platform environment variables.
- [x] `.env` is listed in `.gitignore` to prevent accidental git commits.
- [x] All AI tools use `fetch('/api/analyze-video')` or `fetch('/api/ai')`.
- [x] Frontend code contains ZERO references to raw API keys or client-side Gemini initialization.
