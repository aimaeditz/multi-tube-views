# Multi Tube Views (MTV) 📺

> **A clean, responsive, multi-platform public media viewing workspace with a provider-agnostic multi-AI gateway.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Multi-AI Gateway](https://img.shields.io/badge/AI-Multi--Provider%20Fallback-purple.svg)]()
[![Full-Stack Node.js](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-green.svg)]()

---

## 🌟 Overview

**Multi Tube Views (MTV)** is a comprehensive web application designed for content creators, researchers, media analysts, and digital marketers:
1. **Multi-Platform Viewing Workspace:** Monitor multiple public media streams side-by-side across 20+ video, live-stream, and audio services.
2. **Multi-AI Gateway:** Communicates with multiple legitimate AI providers (Google Gemini, OpenAI, xAI Grok, DeepSeek, Anthropic Claude, Mistral AI, OpenRouter) with intelligent fallback routing and side-by-side response comparison.

---

## 🔒 Security & Multi-Provider Architecture

- **Zero Client-Side API Keys:** All API keys are kept strictly server-side in Node.js environment variables.
- **Provider-Agnostic Routing & Fallback:** If a primary provider experiences downtime or rate limits, the `AIOrchestrator` automatically falls back to secondary configured providers (e.g. Gemini → OpenAI → Grok → DeepSeek → Claude → Mistral → OpenRouter).
- **Built-In Rate Limiting:** Protects backend endpoints using a sliding window rate limiter (configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`).
- **Strictly Grounded Outputs:** Zero clickbait or fabricated metrics; falls back gracefully to deterministic analysis if all AI providers are unavailable.

---

## 🚀 Environment Setup & Configuration

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and set your preferred provider API keys:
```env
# Primary AI Providers (Configure any or all)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
GROK_API_KEY=your_grok_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
CLAUDE_API_KEY=your_claude_api_key
MISTRAL_API_KEY=your_mistral_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Gateway Configuration
DEFAULT_AI_PROVIDER=auto
MAX_FALLBACK_ATTEMPTS=3
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

---

## 🛠️ API Endpoints

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/ai` | `POST` | Universal multi-provider AI gateway router |
| `/api/ai/health` | `GET` | Monitoring & active provider status health check |
| `/api/ai/providers` | `GET` | Discovery endpoint listing configured AI providers |
| `/api/ai/compare` | `POST` | Compare Mode: Query multiple providers in parallel |
| `/api/analyze-video` | `POST` | Public video metadata audit & multi-AI packaging score |

---

## 📁 Architecture Directory Structure

```text
multi-tube-views/
├── server.ts                   # Express server entry point & API routes
├── server/
│   └── ai/
│   │   ├── types.ts            # AI Request/Response & Provider Interface definitions
```
└── assets/
    ├── css/                    # Modular styling & design system
    └── js/                     # Client-side engines & UI controllers
```

---

## 📄 License & Attribution

Distributed under the MIT License. Trademarks and brand logos belong to their respective platforms.
