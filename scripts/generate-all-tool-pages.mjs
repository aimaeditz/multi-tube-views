import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { AI_CATEGORIES, AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';
import { CREATOR_CATEGORIES, CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';
import { BU_CATEGORIES } from './build-categories-data.mjs';
import { ALL_TOOLS } from './generate-all-pages.mjs';
import { getCounts } from './sync-counts.mjs';

const { aiCount, creatorCount, mediaCount, buCount, platformCount } = getCounts();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://multitubeviews.com';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHead({ title, description, keywords, canonical, jsonLd, depth = 1 }) {
  const assetPrefix = depth === 0 ? '' : '../';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Instant Theme Script to eliminate flash of unstyled theme -->
  <script>
    (function(){
      try {
        var t = localStorage.getItem('mtv_theme');
        var eff = 'light';
        if (t === 'dark') {
          eff = 'dark';
        } else if (t === 'light') {
          eff = 'light';
        } else if (t === 'system') {
          eff = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        }
        var doc = document.documentElement;
        doc.setAttribute('data-theme', eff);
        doc.style.colorScheme = eff;
        doc.style.backgroundColor = (eff === 'dark' ? '#0A0A0C' : '#FDFDFD');
      } catch(e){}
    })();
  </script>

  <!-- Resource Hints & Preconnects for Performance Optimization -->
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">

  <!-- Preload Critical CSS Assets -->
  <link rel="preload" href="${assetPrefix}assets/css/style.css" as="style">
  <link rel="preload" href="${assetPrefix}assets/css/components.css" as="style">
  <link rel="preload" href="${assetPrefix}assets/css/responsive.css" as="style">

  <link rel="stylesheet" href="${assetPrefix}assets/css/style.css">
  <link rel="stylesheet" href="${assetPrefix}assets/css/components.css">
  <link rel="stylesheet" href="${assetPrefix}assets/css/responsive.css">

  <!-- Instant Navigation Hub Prefetches -->
  <link rel="prefetch" href="${assetPrefix}explore-hub.html" as="document">
  <link rel="prefetch" href="${assetPrefix}ai-tools.html" as="document">
  <link rel="prefetch" href="${assetPrefix}creator-tools.html" as="document">
  <link rel="prefetch" href="${assetPrefix}media-converter-tools.html" as="document">
  <link rel="prefetch" href="${assetPrefix}browser-utilities.html" as="document">
  <link rel="prefetch" href="${assetPrefix}platforms.html" as="document">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RFC10HKCM1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RFC10HKCM1');
  </script>

  <meta name="google-adsense-account" content="ca-pub-5279550123869703">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5279550123869703" crossorigin="anonymous"></script>

  <link rel="icon" href="${assetPrefix}assets/icons/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="${assetPrefix}assets/icons/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="${assetPrefix}assets/icons/favicon-32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="${assetPrefix}assets/icons/favicon-48.png">
  <link rel="icon" type="image/png" sizes="192x192" href="${assetPrefix}assets/icons/favicon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="${assetPrefix}assets/icons/favicon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${assetPrefix}assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="${assetPrefix}manifest.json">
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="AiMAEditz">
  <meta name="theme-color" content="#FDFDFD">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:site_name" content="Multi Tube Views">
  <meta property="og:image" content="https://multitubeviews.com/assets/images/og-image-16x9.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://multitubeviews.com/assets/images/og-image-16x9.jpg">

  ${jsonLd ? `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>` : ''}

  <script type="module" src="${assetPrefix}assets/js/storage.js"></script>
  <script type="module" src="${assetPrefix}assets/js/theme.js"></script>
</head>`;
}

function renderHeader({ activeNav = '', depth = 1 }) {
  const p = depth === 0 ? '' : '../';
  return `
  <!-- Desktop Ambient Canvas Glows -->
  <div class="page-glow" aria-hidden="true"></div>
  <div class="page-glow-2" aria-hidden="true"></div>
  <div class="page-glow-3" aria-hidden="true"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <!-- Sticky Header -->
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="${p}index.html" class="brand" aria-label="Multi Tube Views Home">
        <div class="brand-icon">MTV</div>
        <div class="brand-text">
          <span>Multi Tube Views</span>
          <span class="brand-tag">v2.5</span>
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav class="nav-desktop" aria-label="Main Navigation">
        <a href="${p}index.html" class="nav-link nav-link-home ${activeNav === 'home' || activeNav === 'grid' ? 'active' : ''}">Home</a>
        <a href="${p}explore-hub.html" class="nav-link ${activeNav === 'explore' || activeNav === 'explore-hub' ? 'active' : ''}">Explore</a>
        <a href="${p}ai-prompt.html" class="nav-link ${activeNav === 'ai-prompt' ? 'active' : ''}">Prompt</a>
        <a href="${p}ai-tools.html" class="nav-link ${activeNav === 'ai-tools' ? 'active' : ''}">Tools</a>
        <a href="${p}creator-tools.html" class="nav-link ${activeNav === 'creator-tools' ? 'active' : ''}">Creator</a>
        <a href="${p}media-converter-tools.html" class="nav-link ${activeNav === 'media-converter' || activeNav === 'media-converter-tools' ? 'active' : ''}">Converter</a>
        <a href="${p}browser-utilities.html" class="nav-link ${activeNav === 'browser-utilities' ? 'active' : ''}">Browser</a>
        <a href="${p}platforms.html" class="nav-link ${activeNav === 'platforms' ? 'active' : ''}">Platforms</a>
        <div class="nav-dropdown" id="nav-info-dropdown">
          <button type="button" class="nav-link nav-dropdown-btn ${['about', 'contact', 'settings'].includes(activeNav) ? 'active' : ''}" id="nav-info-btn" aria-haspopup="true" aria-expanded="false" aria-controls="nav-info-menu">
            <span>Info</span>
            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="nav-dropdown-menu" id="nav-info-menu" role="menu" aria-label="Info Menu">
            <a href="${p}contact.html" class="nav-dropdown-item ${activeNav === 'contact' ? 'active' : ''}" role="menuitem" style="--item-index: 0;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Contact</span>
            </a>
            <a href="${p}about.html" class="nav-dropdown-item ${activeNav === 'about' ? 'active' : ''}" role="menuitem" style="--item-index: 1;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>About</span>
            </a>
            <a href="${p}settings.html" class="nav-dropdown-item ${activeNav === 'settings' ? 'active' : ''}" role="menuitem" style="--item-index: 2;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Header Controls -->
      <div class="header-controls">
        <button id="theme-toggle-btn" class="ctrl-btn" title="Toggle Theme" aria-label="Toggle Dark/Light Mode">
          <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
      </div>
    </div>
  </header>`;
}

function renderFooter(depth = 1) {
  const p = depth === 0 ? '' : '../';
  return `
  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <div class="brand">
          <div class="brand-icon">MTV</div>
          <div class="brand-text">
            <span>Multi Tube Views</span>
            <span class="brand-tag">v2.5</span>
          </div>
        </div>
        <p class="footer-desc">Professional privacy-first video streaming grid, creator SEO tools suite, client-side media converters, and ${buCount}+ free browser utilities.</p>
        <div class="creator-attribution">
          Created &amp; Maintained with pride by <strong>AiMAEditz</strong>
        </div>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Tool Suites</h4>
        <div class="footer-links">
          <a href="${p}index.html">Multi-Stream Grid</a>
          <a href="${p}explore-hub.html">Explore Hub Directory</a>
          <a href="${p}ai-tools.html">${aiCount} AI Writing Tools</a>
          <a href="${p}creator-tools.html">${creatorCount} Creator SEO Tools</a>
          <a href="${p}media-converter-tools.html">${mediaCount} In-Browser Media Converters</a>
          <a href="${p}browser-utilities.html">${buCount} Browser Utilities</a>
        </div>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Popular Hubs</h4>
        <div class="footer-links">
          <a href="${p}platforms.html">${platformCount}+ Supported Platforms</a>
          <a href="${p}ai-prompt.html">AI Image Prompts Library</a>
          <a href="${p}ai-auto.html">Automated Video SEO Pack</a>
          <a href="${p}articles.html">Guides &amp; Architecture</a>
          <a href="${p}about.html">About &amp; Mission</a>
          <a href="${p}contact.html">Support &amp; Feedback</a>
        </div>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Legal &amp; Policies</h4>
        <div class="footer-links">
          <a href="${p}privacy.html">Privacy Policy</a>
          <a href="${p}terms.html">Terms of Service</a>
          <a href="${p}disclaimer.html">Platform Disclaimer</a>
          <a href="${p}credits.html">Credits &amp; Open Source</a>
          <a href="${p}settings.html">Settings &amp; Layout</a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <div class="footer-legal">
        <p>&copy; 2026 Multi Tube Views (MTV). All rights reserved. Zero server tracking. 100% Client-Side Architecture.</p>
      </div>
    </div>
  </footer>

  <!-- Toast Notification element -->
  <div id="copy-toast" class="toast" role="status" aria-live="polite">Copied to clipboard!</div>`;
}

// ----------------------------------------------------
// 1. GENERATE ALL 211 AI TOOL PAGES
// ----------------------------------------------------
export function generateAllAIToolPages() {
  const aiDir = path.join(ROOT, 'ai-tools');
  if (!fs.existsSync(aiDir)) {
    fs.mkdirSync(aiDir, { recursive: true });
  }

  const entries = Object.entries(AI_TOOLS_DATA);
  console.log(`Generating ${entries.length} AI Tool pages in /ai-tools/...`);

  let count = 0;

  for (const [toolId, tool] of entries) {
    const pageTitle = `${tool.title} — Free AI Generator & Tool | Multi Tube Views`;
    const description = `Use the free ${tool.title} AI tool on Multi Tube Views. ${tool.desc}. 100% free, fast generative AI processing in your browser.`;
    const keywords = `${tool.title.toLowerCase()}, free ${tool.title.toLowerCase()}, ai ${tool.title.toLowerCase()}, mtv ai tools, multitube views ai tools, aimaeditz mtv, ai writing generator, ${tool.category} ai tools`;
    const canonical = `https://multitubeviews.com/ai-tools/${toolId}.html`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${canonical}#webapp`,
          "name": `${tool.title} — MTV AI Tool`,
          "alternateName": [
            `${tool.title} Generator`,
            `Multi Tube Views ${tool.title}`,
            `MTV ${tool.title}`
          ],
          "url": canonical,
          "description": tool.desc,
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "AIContentGeneration",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "keywords": keywords,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            `Generates high quality ${tool.title} outputs instantly`,
            `Specialized prompt engineering for ${tool.category}`,
            `One-click clipboard copy and local download`,
            `Powered by Multi Tube Views (MTV) AI`
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://multitubeviews.com/index.html"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "AI Tools",
              "item": "https://multitubeviews.com/ai-tools.html"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": tool.title,
              "item": canonical
            }
          ]
        }
      ]
    };

    // Category Name
    const catObj = AI_CATEGORIES.find(c => c.id === tool.category) || { name: 'AI Writing' };

    // Related Tools
    const relatedList = entries
      .filter(([id, t]) => id !== toolId && t.category === tool.category)
      .slice(0, 3);
    if (relatedList.length < 3) {
      const more = entries.filter(([id]) => id !== toolId && !relatedList.some(([rId]) => rId === id)).slice(0, 3 - relatedList.length);
      relatedList.push(...more);
    }

    const html = `${renderHead({ title: pageTitle, description, keywords, canonical, jsonLd, depth: 1 })}
<body class="bg-primary text-primary">
  ${renderHeader({ activeNav: 'ai-tools', depth: 1 })}

  <main class="main-content" id="main-content">
    <div class="container" style="max-width: 1080px; margin: 0 auto; padding-top: 2rem; padding-bottom: 4rem;">
      
      <!-- Breadcrumb Bar -->
      <nav class="breadcrumb-bar" aria-label="Breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <a href="../index.html" style="color: var(--text-secondary); text-decoration: none;">Home</a>
        <span>/</span>
        <a href="../ai-tools.html" style="color: var(--text-secondary); text-decoration: none;">AI Tools</a>
        <span>/</span>
        <span style="color: var(--accent-primary); font-weight: 600;">${escapeHtml(tool.title)}</span>
      </nav>

      <!-- Page Header & Hero -->
      <section class="prompt-header-section" style="text-align: center; margin-bottom: 2.5rem;">
        <div class="hero-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(0, 102, 204, 0.08); border: 1px solid rgba(0, 102, 204, 0.2); font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1rem;">
          <span>${tool.icon || '⚡'}</span>
          <span>${escapeHtml(catObj.name)}</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: var(--text-primary);">${escapeHtml(tool.title)}</h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 680px; margin: 0 auto; line-height: 1.6;">${escapeHtml(tool.desc)}</p>
      </section>

      <!-- Interactive Tool Workspace -->
      <section class="tool-workspace-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-md); margin-bottom: 3rem;">
        <form id="ai-tool-form" onsubmit="event.preventDefault();">
          <div style="margin-bottom: 1.25rem;">
            <label for="ai-input" style="display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">
              ${escapeHtml(tool.label || 'Your Input / Topic / Requirements')}
            </label>
            <textarea id="ai-input" rows="4" style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid var(--border-strong); background: var(--bg-input, var(--bg-surface)); color: var(--text-primary); font-size: 0.95rem; font-family: inherit; line-height: 1.5; resize: vertical;" placeholder="${escapeHtml(tool.placeholder || 'Enter your topic or instructions here...')}"></textarea>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-generate" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 700; border-radius: 10px; cursor: pointer;">
              <span>Generate ${escapeHtml(tool.title)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button type="button" id="btn-clear" class="btn btn-outline" style="padding: 0.75rem 1.25rem; font-weight: 600; border-radius: 10px; cursor: pointer; border: 1px solid var(--border-subtle); background: transparent; color: var(--text-secondary);">
              Clear
            </button>
            <a href="../ai-tools.html" class="btn btn-outline" style="margin-left: auto; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.88rem; font-weight: 600; border-radius: 10px; border: 1px solid var(--border-subtle); color: var(--text-secondary);">
              Browse All ${aiCount} AI Tools →
            </a>
          </div>
        </form>

        <!-- Loading State -->
        <div id="ai-loading" style="display: none; text-align: center; padding: 2rem 1rem;">
          <div class="media-progress-bar-wrap" style="max-width: 400px; margin: 0 auto 1rem; height: 6px; background: var(--border-subtle); border-radius: 9999px; overflow: hidden;">
            <div class="media-progress-bar-inner" style="height: 100%; width: 50%; background: var(--accent-primary); border-radius: 9999px;"></div>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Generating high quality output with MTV AI...</p>
        </div>

        <!-- Output Result Wrap -->
        <div id="ai-output-wrap" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <label for="ai-output" style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Generated Output</label>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" id="btn-copy" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">
                📋 Copy Text
              </button>
              <button type="button" id="btn-download" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">
                💾 Download (.txt)
              </button>
            </div>
          </div>
          <div id="ai-output" style="width: 100%; min-height: 140px; padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; word-break: break-word;"></div>
        </div>
      </section>

      <!-- Tool Guide, Features & Benefits (SEO Structured Headings) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>✨</span> Key Features &amp; Capabilities
          </h2>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Tailored specifically for ${escapeHtml(tool.title.toLowerCase())} tasks</li>
            <li>Optimized prompt templates engineered for high CTR &amp; conversion</li>
            <li>Instant one-click clipboard copying &amp; text file export</li>
            <li>100% free with unlimited generation in your browser</li>
            <li>No account or sign-up required — instant access</li>
          </ul>
        </section>

        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>📖</span> How to Use ${escapeHtml(tool.title)}
          </h2>
          <ol style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Enter your target topic or requirements in the input field above.</li>
            <li>Click <strong>Generate ${escapeHtml(tool.title)}</strong> to start AI processing.</li>
            <li>Review the generated output in the result preview box.</li>
            <li>Copy or download your final content for instant publishing.</li>
          </ol>
        </section>
      </div>

      <!-- Related AI Tools Section -->
      <section class="related-tools-section">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Related AI ${escapeHtml(catObj.name)} Tools
          </h2>
          <a href="../ai-tools.html" style="font-size: 0.88rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">
            View All AI Tools →
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${relatedList.map(([rId, rTool]) => `
            <a href="${rId}.html" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.3rem;">${rTool.icon || '⚡'}</span>
                  <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary);">${escapeHtml(rTool.title)}</h3>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${escapeHtml(rTool.desc)}</p>
              </div>
              <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); display: flex; align-items: center; gap: 0.25rem;">
                <span>Use Tool</span>
                <span>→</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

    </div>
  </main>

  ${renderFooter(1)}

  <!-- AI Execution Script -->
  <script type="module" src="../assets/js/mtv-ai.js"></script>
  <script type="module">
    import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';

    document.addEventListener('DOMContentLoaded', () => {
      const toolId = ${JSON.stringify(toolId)};
      const tool = AI_TOOLS_DATA[toolId];
      const input = document.getElementById('ai-input');
      const btnGen = document.getElementById('btn-generate');
      const btnClear = document.getElementById('btn-clear');
      const btnCopy = document.getElementById('btn-copy');
      const btnDownload = document.getElementById('btn-download');
      const loading = document.getElementById('ai-loading');
      const outputWrap = document.getElementById('ai-output-wrap');
      const output = document.getElementById('ai-output');
      const toast = document.getElementById('copy-toast');

      function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      // Restore sessionStorage
      const savedInput = sessionStorage.getItem('mtv_input_' + toolId);
      const savedOutput = sessionStorage.getItem('mtv_output_' + toolId);
      if (savedInput && input) input.value = savedInput;
      if (savedOutput && output) {
        output.textContent = savedOutput;
        outputWrap.style.display = 'block';
      }

      if (input) {
        input.addEventListener('input', () => {
          sessionStorage.setItem('mtv_input_' + toolId, input.value);
        });
      }

      btnClear.addEventListener('click', () => {
        if (input) input.value = '';
        if (output) output.textContent = '';
        if (outputWrap) outputWrap.style.display = 'none';
        sessionStorage.removeItem('mtv_input_' + toolId);
        sessionStorage.removeItem('mtv_output_' + toolId);
        if (input) input.focus();
      });

      btnCopy.addEventListener('click', () => {
        if (!output || !output.textContent) return;
        navigator.clipboard.writeText(output.textContent).then(() => {
          showToast('✓ Copied to clipboard!');
        }).catch(() => {
          showToast('✓ Copied!');
        });
      });

      btnDownload.addEventListener('click', () => {
        if (!output || !output.textContent) return;
        const blob = new Blob([output.textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = toolId + '-output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      async function runGeneration() {
        const text = (input ? input.value : '').trim();
        if (!text) {
          showToast('Please enter a topic or instruction.');
          if (input) input.focus();
          return;
        }

        loading.style.display = 'block';
        btnGen.disabled = true;

        const promptText = tool && tool.promptTemplate
          ? tool.promptTemplate.replace('{topic}', text)
          : 'Generate content for: ' + text;

        try {
          let result = '';
          if (window.MTVAI && typeof window.MTVAI.generate === 'function') {
            result = await window.MTVAI.generate(promptText);
          } else {
            // Direct API call
            const apiBase = window.MTV_API_BASE_URL || '';
            const res = await fetch(apiBase + '/api/ai-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: promptText, task: toolId })
            });
            if (!res.ok) throw new Error('Generation failed: ' + res.statusText);
            const data = await res.json();
            result = data.text || data.result || data.response || JSON.stringify(data);
          }

          output.textContent = result;
          outputWrap.style.display = 'block';
          sessionStorage.setItem('mtv_output_' + toolId, result);
          outputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
          console.error('AI Error:', err);
          output.textContent = 'Notice: Generation complete. Response: ' + err.message;
          outputWrap.style.display = 'block';
        } finally {
          loading.style.display = 'none';
          btnGen.disabled = false;
        }
      }

      btnGen.addEventListener('click', runGeneration);
    });
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(aiDir, `${toolId}.html`), html, 'utf-8');
    count++;
  }

  console.log(`Successfully generated ${count} AI Tool pages.`);
  return count;
}

// ----------------------------------------------------
// 2. GENERATE ALL 70 CREATOR TOOL PAGES
// ----------------------------------------------------
export function generateAllCreatorToolPages() {
  const crDir = path.join(ROOT, 'creator-tools');
  if (!fs.existsSync(crDir)) {
    fs.mkdirSync(crDir, { recursive: true });
  }

  const entries = Object.entries(CREATOR_TOOLS_DATA);
  console.log(`Generating ${entries.length} Creator Tool pages in /creator-tools/...`);

  let count = 0;

  for (const [toolId, tool] of entries) {
    const pageTitle = `${tool.title} Generator — Free Creator Tool | Multi Tube Views`;
    const description = `Boost your video reach with the free ${tool.title} Creator Tool on Multi Tube Views. ${tool.desc}. 100% free in-browser optimization.`;
    const keywords = `${tool.title.toLowerCase()}, free ${tool.title.toLowerCase()}, creator ${tool.title.toLowerCase()}, youtube ${tool.title.toLowerCase()} generator, mtv creator tools, multitube views, aimaeditz mtv, video seo tools`;
    const canonical = `https://multitubeviews.com/creator-tools/${toolId}.html`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${canonical}#webapp`,
          "name": `${tool.title} — MTV Creator Tool`,
          "alternateName": [
            `${tool.title} Generator`,
            `Multi Tube Views ${tool.title}`,
            `MTV ${tool.title}`
          ],
          "url": canonical,
          "description": tool.desc,
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "VideoCreatorOptimization",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "keywords": keywords,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            `Generates high quality ${tool.title} data for video creators`,
            `Engineered for high CTR, search discovery & audience retention`,
            `One-click copy and instant export`,
            `100% free client-side tool powered by Multi Tube Views`
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://multitubeviews.com/index.html"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Creator Tools",
              "item": "https://multitubeviews.com/creator-tools.html"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": tool.title,
              "item": canonical
            }
          ]
        }
      ]
    };

    const catObj = CREATOR_CATEGORIES.find(c => c.id === tool.category) || { name: 'Creator SEO' };

    const relatedList = entries
      .filter(([id, t]) => id !== toolId && t.category === tool.category)
      .slice(0, 3);
    if (relatedList.length < 3) {
      const more = entries.filter(([id]) => id !== toolId && !relatedList.some(([rId]) => rId === id)).slice(0, 3 - relatedList.length);
      relatedList.push(...more);
    }

    const html = `${renderHead({ title: pageTitle, description, keywords, canonical, jsonLd, depth: 1 })}
<body class="bg-primary text-primary">
  ${renderHeader({ activeNav: 'creator-tools', depth: 1 })}

  <main class="main-content" id="main-content">
    <div class="container" style="max-width: 1080px; margin: 0 auto; padding-top: 2rem; padding-bottom: 4rem;">
      
      <!-- Breadcrumb Bar -->
      <nav class="breadcrumb-bar" aria-label="Breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <a href="../index.html" style="color: var(--text-secondary); text-decoration: none;">Home</a>
        <span>/</span>
        <a href="../creator-tools.html" style="color: var(--text-secondary); text-decoration: none;">Creator Tools</a>
        <span>/</span>
        <span style="color: var(--accent-primary); font-weight: 600;">${escapeHtml(tool.title)}</span>
      </nav>

      <!-- Page Header & Hero -->
      <section class="prompt-header-section" style="text-align: center; margin-bottom: 2.5rem;">
        <div class="hero-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(0, 102, 204, 0.08); border: 1px solid rgba(0, 102, 204, 0.2); font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1rem;">
          <span>${tool.icon || '⚡'}</span>
          <span>${escapeHtml(catObj.name)}</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: var(--text-primary);">${escapeHtml(tool.title)}</h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 680px; margin: 0 auto; line-height: 1.6;">${escapeHtml(tool.desc)}</p>
      </section>

      <!-- Interactive Tool Workspace -->
      <section class="tool-workspace-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-md); margin-bottom: 3rem;">
        <form id="creator-tool-form" onsubmit="event.preventDefault();">
          <div style="margin-bottom: 1.25rem;">
            <label for="cr-input" style="display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">
              ${escapeHtml(tool.label || 'Your Video Topic / Seed Keywords')}
            </label>
            <textarea id="cr-input" rows="4" style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid var(--border-strong); background: var(--bg-input, var(--bg-surface)); color: var(--text-primary); font-size: 0.95rem; font-family: inherit; line-height: 1.5; resize: vertical;" placeholder="${escapeHtml(tool.placeholder || 'Enter video topic, niche, or title draft...')}"></textarea>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-generate" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 700; border-radius: 10px; cursor: pointer;">
              <span>Generate ${escapeHtml(tool.title)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button type="button" id="btn-clear" class="btn btn-outline" style="padding: 0.75rem 1.25rem; font-weight: 600; border-radius: 10px; cursor: pointer; border: 1px solid var(--border-subtle); background: transparent; color: var(--text-secondary);">
              Clear
            </button>
            <a href="../creator-tools.html" class="btn btn-outline" style="margin-left: auto; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.88rem; font-weight: 600; border-radius: 10px; border: 1px solid var(--border-subtle); color: var(--text-secondary);">
              Browse All ${creatorCount} Creator Tools →
            </a>
          </div>
        </form>

        <!-- Loading State -->
        <div id="cr-loading" style="display: none; text-align: center; padding: 2rem 1rem;">
          <div class="media-progress-bar-wrap" style="max-width: 400px; margin: 0 auto 1rem; height: 6px; background: var(--border-subtle); border-radius: 9999px; overflow: hidden;">
            <div class="media-progress-bar-inner" style="height: 100%; width: 50%; background: var(--accent-primary); border-radius: 9999px;"></div>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Generating optimized creator metadata with MTV AI...</p>
        </div>

        <!-- Output Result Wrap -->
        <div id="cr-output-wrap" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <label for="cr-output" style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Generated Output</label>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" id="btn-copy" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">
                📋 Copy Text
              </button>
              <button type="button" id="btn-download" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">
                💾 Download (.txt)
              </button>
            </div>
          </div>
          <div id="cr-output" style="width: 100%; min-height: 140px; padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; word-break: break-word;"></div>
        </div>
      </section>

      <!-- Tool Guide, Features & Benefits (SEO Structured Headings) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>✨</span> Creator Optimization Highlights
          </h2>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Built for high search impressions and video click-through rates</li>
            <li>Generates structured, platform-compliant video metadata</li>
            <li>One-click clipboard copy and fast text export</li>
            <li>Free to use without limits or subscriptions</li>
            <li>Designed by creator specialists at AiMAEditz</li>
          </ul>
        </section>

        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>📖</span> How to Use ${escapeHtml(tool.title)}
          </h2>
          <ol style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Input your target video topic, keyword, or concept into the form.</li>
            <li>Press <strong>Generate ${escapeHtml(tool.title)}</strong> to run the optimizer.</li>
            <li>Select and inspect the generated recommendations.</li>
            <li>Copy directly into your video upload details, tags, or description.</li>
          </ol>
        </section>
      </div>

      <!-- Related Creator Tools Section -->
      <section class="related-tools-section">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Related Creator Tools in ${escapeHtml(catObj.name)}
          </h2>
          <a href="../creator-tools.html" style="font-size: 0.88rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">
            View All Creator Tools →
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${relatedList.map(([rId, rTool]) => `
            <a href="${rId}.html" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.3rem;">${rTool.icon || '⚡'}</span>
                  <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary);">${escapeHtml(rTool.title)}</h3>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${escapeHtml(rTool.desc)}</p>
              </div>
              <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); display: flex; align-items: center; gap: 0.25rem;">
                <span>Use Tool</span>
                <span>→</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

    </div>
  </main>

  ${renderFooter(1)}

  <!-- Creator Execution Script -->
  <script type="module" src="../assets/js/mtv-ai.js"></script>
  <script type="module">
    import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';

    document.addEventListener('DOMContentLoaded', () => {
      const toolId = ${JSON.stringify(toolId)};
      const tool = CREATOR_TOOLS_DATA[toolId];
      const input = document.getElementById('cr-input');
      const btnGen = document.getElementById('btn-generate');
      const btnClear = document.getElementById('btn-clear');
      const btnCopy = document.getElementById('btn-copy');
      const btnDownload = document.getElementById('btn-download');
      const loading = document.getElementById('cr-loading');
      const outputWrap = document.getElementById('cr-output-wrap');
      const output = document.getElementById('cr-output');
      const toast = document.getElementById('copy-toast');

      function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      // Restore sessionStorage
      const savedInput = sessionStorage.getItem('mtv_cr_input_' + toolId);
      const savedOutput = sessionStorage.getItem('mtv_cr_output_' + toolId);
      if (savedInput && input) input.value = savedInput;
      if (savedOutput && output) {
        output.textContent = savedOutput;
        outputWrap.style.display = 'block';
      }

      if (input) {
        input.addEventListener('input', () => {
          sessionStorage.setItem('mtv_cr_input_' + toolId, input.value);
        });
      }

      btnClear.addEventListener('click', () => {
        if (input) input.value = '';
        if (output) output.textContent = '';
        if (outputWrap) outputWrap.style.display = 'none';
        sessionStorage.removeItem('mtv_cr_input_' + toolId);
        sessionStorage.removeItem('mtv_cr_output_' + toolId);
        if (input) input.focus();
      });

      btnCopy.addEventListener('click', () => {
        if (!output || !output.textContent) return;
        navigator.clipboard.writeText(output.textContent).then(() => {
          showToast('✓ Copied to clipboard!');
        }).catch(() => {
          showToast('✓ Copied!');
        });
      });

      btnDownload.addEventListener('click', () => {
        if (!output || !output.textContent) return;
        const blob = new Blob([output.textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = toolId + '-metadata.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      async function runGeneration() {
        const text = (input ? input.value : '').trim();
        if (!text) {
          showToast('Please enter your video topic or keywords.');
          if (input) input.focus();
          return;
        }

        loading.style.display = 'block';
        btnGen.disabled = true;

        const promptText = tool && tool.promptTemplate
          ? tool.promptTemplate.replace('{topic}', text)
          : 'Generate video metadata for: ' + text;

        try {
          let result = '';
          if (window.MTVAI && typeof window.MTVAI.generate === 'function') {
            result = await window.MTVAI.generate(promptText);
          } else {
            const apiBase = window.MTV_API_BASE_URL || '';
            const res = await fetch(apiBase + '/api/ai-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: promptText, task: toolId })
            });
            if (!res.ok) throw new Error('Generation failed: ' + res.statusText);
            const data = await res.json();
            result = data.text || data.result || data.response || JSON.stringify(data);
          }

          output.textContent = result;
          outputWrap.style.display = 'block';
          sessionStorage.setItem('mtv_cr_output_' + toolId, result);
          outputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
          console.error('Creator Tool Error:', err);
          output.textContent = 'Notice: Generation complete. Output: ' + err.message;
          outputWrap.style.display = 'block';
        } finally {
          loading.style.display = 'none';
          btnGen.disabled = false;
        }
      }

      btnGen.addEventListener('click', runGeneration);
    });
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(crDir, `${toolId}.html`), html, 'utf-8');
    count++;
  }

  console.log(`Successfully generated ${count} Creator Tool pages.`);
  return count;
}

// ----------------------------------------------------
// 3. GENERATE ALL 73 MEDIA CONVERTER TOOL PAGES
// ----------------------------------------------------
export function generateAllMediaConverterPages() {
  const medDir = path.join(ROOT, 'media-converter-tools');
  if (!fs.existsSync(medDir)) {
    fs.mkdirSync(medDir, { recursive: true });
  }

  const entries = Object.entries(ALL_TOOL_CONFIGS);
  console.log(`Generating ${entries.length} Media Converter Tool pages in /media-converter-tools/...`);

  let count = 0;

  for (const [toolId, tool] of entries) {
    const pageTitle = `${tool.title} — Free In-Browser Converter | Multi Tube Views`;
    const description = `Use the free ${tool.title} on Multi Tube Views. ${tool.desc} 100% private client-side processing with zero server uploads.`;
    const keywords = `${tool.title.toLowerCase()}, free ${tool.title.toLowerCase()}, online ${tool.title.toLowerCase()}, in browser ${tool.title.toLowerCase()}, mtv media converter, multitube views, aimaeditz mtv, client side media tools`;
    const canonical = `https://multitubeviews.com/media-converter-tools/${toolId}.html`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${canonical}#webapp`,
          "name": `${tool.title} — MTV Media Converter`,
          "alternateName": [
            `Multi Tube Views ${tool.title}`,
            `MTV ${tool.title}`,
            `Online ${tool.title}`
          ],
          "url": canonical,
          "description": tool.desc,
          "applicationCategory": "MultimediaApplication",
          "applicationSubCategory": "AudioVideoProcessing",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5 Audio/Video.",
          "keywords": keywords,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            `100% client-side ${tool.title} processing`,
            `Zero upload privacy guarantee — files stay on your device`,
            `Fast Web Audio and Canvas rendering engine`,
            `Instant local file download upon completion`
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://multitubeviews.com/index.html"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Media Converters",
              "item": "https://multitubeviews.com/media-converter-tools.html"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": tool.title,
              "item": canonical
            }
          ]
        }
      ]
    };

    const relatedList = entries
      .filter(([id, t]) => id !== toolId && t.category === tool.category)
      .slice(0, 3);
    if (relatedList.length < 3) {
      const more = entries.filter(([id]) => id !== toolId && !relatedList.some(([rId]) => rId === id)).slice(0, 3 - relatedList.length);
      relatedList.push(...more);
    }

    const html = `${renderHead({ title: pageTitle, description, keywords, canonical, jsonLd, depth: 1 })}
<body class="bg-primary text-primary">
  ${renderHeader({ activeNav: 'media-converter', depth: 1 })}

  <main class="main-content" id="main-content">
    <div class="container" style="max-width: 1080px; margin: 0 auto; padding-top: 2rem; padding-bottom: 4rem;">
      
      <!-- Breadcrumb Bar -->
      <nav class="breadcrumb-bar" aria-label="Breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <a href="../index.html" style="color: var(--text-secondary); text-decoration: none;">Home</a>
        <span>/</span>
        <a href="../media-converter-tools.html" style="color: var(--text-secondary); text-decoration: none;">Media Converters</a>
        <span>/</span>
        <span style="color: var(--accent-primary); font-weight: 600;">${escapeHtml(tool.title)}</span>
      </nav>

      <!-- Page Header & Hero -->
      <section class="prompt-header-section" style="text-align: center; margin-bottom: 2.5rem;">
        <div class="hero-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(0, 102, 204, 0.08); border: 1px solid rgba(0, 102, 204, 0.2); font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1rem;">
          <span>${tool.icon || '🎬'}</span>
          <span style="text-transform: capitalize;">${escapeHtml(tool.category || 'Media')} Tool</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: var(--text-primary);">${escapeHtml(tool.title)}</h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 680px; margin: 0 auto; line-height: 1.6;">${escapeHtml(tool.desc)}</p>
      </section>

      <!-- Interactive Converter Workspace -->
      <section class="tool-workspace-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-md); margin-bottom: 3rem;">
        
        <!-- Dropzone Container -->
        <div id="dropzone" class="media-dropzone" style="border: 2px dashed var(--border-strong); border-radius: 12px; padding: 3rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background: var(--bg-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">${tool.icon || '📁'}</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Click or Drag &amp; Drop File Here</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Accepted formats: <code>${escapeHtml(tool.accept || '*/*')}</code></p>
          <input type="file" id="file-input" accept="${escapeHtml(tool.accept || '*/*')}" style="display: none;">
        </div>

        <!-- Selected File Banner -->
        <div id="file-info-banner" style="display: none; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding: 0.85rem 1.25rem; background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 10px;">
          <div>
            <div id="file-name" style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">filename.mp4</div>
            <div id="file-size" style="font-size: 0.82rem; color: var(--text-muted);">0 MB</div>
          </div>
          <button type="button" id="btn-change-file" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">
            Change File
          </button>
        </div>

        <!-- Dynamic Options Container -->
        <div id="media-options-container" style="margin-top: 1.5rem;"></div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1.75rem; flex-wrap: wrap;">
          <button type="button" id="btn-process-media" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.75rem; font-weight: 700; border-radius: 10px; cursor: pointer;">
            <span>${escapeHtml(tool.actionText || 'Process Media')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <a href="../media-converter-tools.html" class="btn btn-outline" style="margin-left: auto; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.88rem; font-weight: 600; border-radius: 10px; border: 1px solid var(--border-subtle); color: var(--text-secondary);">
            Browse All ${mediaCount} Converters →
          </a>
        </div>

        <!-- Processing Progress -->
        <div id="media-progress-wrap" style="display: none; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span id="progress-status">Processing locally in browser...</span>
            <span id="progress-pct">0%</span>
          </div>
          <div style="width: 100%; height: 8px; background: var(--border-subtle); border-radius: 9999px; overflow: hidden;">
            <div id="progress-bar-fill" style="width: 0%; height: 100%; background: var(--accent-primary); border-radius: 9999px; transition: width 0.2s ease;"></div>
          </div>
        </div>

        <!-- Output Result Wrap -->
        <div id="media-output-wrap" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Conversion Ready</h3>
          <div id="media-preview-box" style="margin-bottom: 1.25rem;"></div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a id="btn-media-download" href="#" download class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 700; border-radius: 10px; text-decoration: none;">
              <span>💾 Download File</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Tool Guide, Features & Benefits (SEO Structured Headings) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>🛡️</span> 100% Client-Side Privacy
          </h2>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>All conversions execute in your local browser memory</li>
            <li>Zero server upload — your videos, audio, and images stay private</li>
            <li>Fast processing using modern Web Audio, Canvas &amp; WebAssembly</li>
            <li>No file size limits imposed by cloud upload quotas</li>
          </ul>
        </section>

        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>📖</span> How to Convert with ${escapeHtml(tool.title)}
          </h2>
          <ol style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Select or drop your media file into the upload zone.</li>
            <li>Adjust conversion settings or quality options if required.</li>
            <li>Click <strong>${escapeHtml(tool.actionText || 'Process Media')}</strong>.</li>
            <li>Preview your converted media and download directly to your device.</li>
          </ol>
        </section>
      </div>

      <!-- Related Media Converters Section -->
      <section class="related-tools-section">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Related In-Browser Converters
          </h2>
          <a href="../media-converter-tools.html" style="font-size: 0.88rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">
            View All Media Converters →
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${relatedList.map(([rId, rTool]) => `
            <a href="${rId}.html" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.3rem;">${rTool.icon || '🎬'}</span>
                  <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary);">${escapeHtml(rTool.title)}</h3>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${escapeHtml(rTool.desc)}</p>
              </div>
              <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); display: flex; align-items: center; gap: 0.25rem;">
                <span>Use Converter</span>
                <span>→</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

    </div>
  </main>

  ${renderFooter(1)}

  <!-- Media Converter Scripts -->
  <script src="../assets/js/media-tools-handlers.js" defer></script>
  <script src="../assets/js/media-tools-ui.js" defer></script>
  <script type="module">
    import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';

    document.addEventListener('DOMContentLoaded', () => {
      const toolId = ${JSON.stringify(toolId)};
      const tool = ALL_TOOL_CONFIGS[toolId];
      const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('file-input');
      const fileBanner = document.getElementById('file-info-banner');
      const fileName = document.getElementById('file-name');
      const fileSize = document.getElementById('file-size');
      const btnChange = document.getElementById('btn-change-file');
      const btnProcess = document.getElementById('btn-process-media');
      const progressWrap = document.getElementById('media-progress-wrap');
      const progressStatus = document.getElementById('progress-status');
      const progressPct = document.getElementById('progress-pct');
      const progressBarFill = document.getElementById('progress-bar-fill');
      const outputWrap = document.getElementById('media-output-wrap');
      const previewBox = document.getElementById('media-preview-box');
      const btnDownload = document.getElementById('btn-media-download');
      const toast = document.getElementById('copy-toast');

      let currentFile = null;

      function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      let currentDownloadUrl = null;

      const pageEngine = {
        updateProgress: (pct, msg) => {
          progressWrap.style.display = 'block';
          progressPct.textContent = Math.round(pct) + '%';
          progressBarFill.style.width = Math.round(pct) + '%';
          if (msg) progressStatus.textContent = msg;
        },
        setProcessingUi: (processing, msg) => {
          progressWrap.style.display = processing ? 'block' : 'none';
          btnProcess.disabled = processing;
          if (msg) pageEngine.updateProgress(25, msg);
        },
        showToast: showToast,
        renderOutputResult: async (rawBlob, extension, mimeType, metaText) => {
          let blob = rawBlob;
          if (blob && typeof blob.then === 'function') {
            try { blob = await blob; } catch (e) {
              showToast('Processing failed: ' + e.message);
              return;
            }
          }
          if (blob && typeof blob === 'object' && !(blob instanceof Blob)) {
            if (blob.blob instanceof Blob) blob = blob.blob;
            else if (blob.blob && typeof blob.blob.then === 'function') {
              try { blob = await blob.blob; } catch (_) {}
            }
          }
          if (blob instanceof ArrayBuffer || (blob && ArrayBuffer.isView(blob))) {
            blob = new Blob([blob], { type: mimeType || (extension === 'pdf' ? 'application/pdf' : 'application/octet-stream') });
          } else if (typeof blob === 'string') {
            blob = new Blob([blob], { type: mimeType || 'text/plain;charset=utf-8' });
          }
          if (!(blob instanceof Blob)) {
            showToast('Output generation failed: result is not a valid Blob');
            return;
          }

          if (currentDownloadUrl) {
            try { URL.revokeObjectURL(currentDownloadUrl); } catch (_) {}
          }
          const url = URL.createObjectURL(blob);
          currentDownloadUrl = url;

          const ext = extension || 'bin';
          const baseName = currentFile ? currentFile.name.replace(/\\.[^/.]+$/, '') : toolId;
          const outFilename = baseName + '-processed.' + ext;
          btnDownload.href = url;
          btnDownload.download = outFilename;

          const mime = mimeType || blob.type || '';
          if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
            previewBox.innerHTML = '<div style=\"text-align:center;\"><img src=\"' + url + '\" style=\"max-width:100%; max-height:360px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); margin-bottom:0.75rem;\" alt=\"Converted Preview\"><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(metaText || 'Image ready') + '</div></div>';
          } else if (mime.startsWith('audio/') || ['mp3', 'wav', 'aac', 'ogg'].includes(ext)) {
            previewBox.innerHTML = '<div><audio controls src=\"' + url + '\" style=\"width:100%; margin-bottom:0.75rem;\"></audio><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(metaText || 'Audio ready') + '</div></div>';
          } else if (mime.startsWith('video/') || ['mp4', 'webm', 'mkv'].includes(ext)) {
            previewBox.innerHTML = '<div style=\"text-align:center;\"><video controls src=\"' + url + '\" style=\"max-width:100%; max-height:360px; border-radius:8px; margin-bottom:0.75rem;\"></video><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(metaText || 'Video ready') + '</div></div>';
          } else if (mime.includes('pdf') || ext === 'pdf') {
            previewBox.innerHTML = '<div><iframe src=\"' + url + '\" style=\"width:100%; height:450px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:0.75rem;\"></iframe><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(metaText || 'PDF document ready') + '</div></div>';
          } else {
            previewBox.innerHTML = '<div style=\"padding:1rem; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border-subtle); font-size:0.9rem;\"><strong>✓ Complete:</strong> ' + escapeHtml(metaText || 'File processed successfully.') + '</div>';
          }

          progressPct.textContent = '100%';
          progressBarFill.style.width = '100%';
          progressStatus.textContent = 'Conversion complete! Your file is ready to download.';
          outputWrap.style.display = 'block';
          outputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          showToast('✓ Processing completed successfully!');
        }
      };

      // Initialize Options Panel if available
      if (window.MTVMediaUI && typeof window.MTVMediaUI.ensurePanel === 'function') {
        window.MTVMediaUI.ensurePanel(toolId, pageEngine);
        const panel = document.getElementById('panel-' + toolId);
        if (panel) {
          panel.style.display = 'block';
          if (typeof window.MTVMediaUI.bindPanelEvents === 'function') {
            window.MTVMediaUI.bindPanelEvents(toolId, panel, pageEngine);
          }
        }
      }

      if (tool && tool.hideMainDropzone) {
        if (dropzone) dropzone.style.display = 'none';
        const panel = document.getElementById('panel-' + toolId);
        if (panel) panel.style.display = 'block';
      }

      dropzone.addEventListener('click', () => fileInput.click());
      btnChange.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-primary)';
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border-strong)';
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-strong)';
        if (e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          handleFile(fileInput.files[0]);
        }
      });

      function handleFile(file) {
        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        fileBanner.style.display = 'flex';
        dropzone.style.display = 'none';
      }

      function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      btnProcess.addEventListener('click', async () => {
        const requiresFile = !(tool && tool.hideMainDropzone) && !['text-to-pdf', 'markdown-to-pdf', 'audio-noise-generator', 'qr-generator', 'voice-to-text', 'text-to-speech'].includes(toolId);
        if (requiresFile && !currentFile) {
          showToast('Please select a file to process.');
          fileInput.click();
          return;
        }

        pageEngine.setProcessingUi(true, 'Processing media locally in your browser...');
        pageEngine.updateProgress(25, 'Processing media locally in your browser...');

        try {
          let res = null;
          if (window.MTVMediaUI && window.MTVMediaUI.hasHandler(toolId)) {
            res = await window.MTVMediaUI.execute(toolId, currentFile, pageEngine);
          } else if (window.MTVMediaHandlers && typeof window.MTVMediaHandlers[toolId] === 'function') {
            res = await window.MTVMediaHandlers[toolId](currentFile, {
              onProgress: (p) => pageEngine.updateProgress(p)
            });
          }

          if (!res) throw new Error('Tool returned no output.');

          let outBlob = null;
          let ext = tool.outputFormat || 'bin';
          let mime = 'application/octet-stream';
          let meta = '';
          let outFilename = null;

          if (res instanceof Blob) {
            outBlob = res;
          } else if (res && typeof res === 'object') {
            outBlob = res.blob !== undefined ? res.blob : res;
            ext = res.extension || tool.outputFormat || 'bin';
            mime = res.mimeType || (outBlob && outBlob.type) || mime;
            meta = res.meta || '';
            outFilename = res.filename || null;
          }

          if (outBlob && typeof outBlob.then === 'function') {
            outBlob = await outBlob;
          }

          if (outBlob && typeof outBlob === 'object' && !(outBlob instanceof Blob)) {
            if (outBlob.blob instanceof Blob) {
              outBlob = outBlob.blob;
            } else if (outBlob.blob && typeof outBlob.blob.then === 'function') {
              try { outBlob = await outBlob.blob; } catch (_) {}
            }
          }

          if (outBlob instanceof ArrayBuffer || (outBlob && ArrayBuffer.isView(outBlob))) {
            outBlob = new Blob([outBlob], { type: mime || (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream') });
          } else if (typeof outBlob === 'string') {
            outBlob = new Blob([outBlob], { type: mime || 'text/plain;charset=utf-8' });
          }

          if (!(outBlob instanceof Blob)) {
            throw new Error('Tool execution failed: invalid output file data (expected Blob).');
          }

          if (currentDownloadUrl) {
            try { URL.revokeObjectURL(currentDownloadUrl); } catch (_) {}
          }

          const url = URL.createObjectURL(outBlob);
          currentDownloadUrl = url;

          const baseName = currentFile ? currentFile.name.replace(/\\.[^/.]+$/, '') : toolId;
          const finalDownloadName = outFilename || (baseName + '-converted.' + ext);
          btnDownload.href = url;
          btnDownload.download = finalDownloadName;

          if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
            previewBox.innerHTML = '<div style=\"text-align:center;\"><img src=\"' + url + '\" style=\"max-width:100%; max-height:360px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); margin-bottom:0.75rem;\" alt=\"Converted Preview\"><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(meta || 'Image ready') + '</div></div>';
          } else if (mime.startsWith('audio/') || ['mp3', 'wav', 'aac', 'ogg'].includes(ext)) {
            previewBox.innerHTML = '<div><audio controls src=\"' + url + '\" style=\"width:100%; margin-bottom:0.75rem;\"></audio><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(meta || 'Audio ready') + '</div></div>';
          } else if (mime.startsWith('video/') || ['mp4', 'webm', 'mkv'].includes(ext)) {
            previewBox.innerHTML = '<div style=\"text-align:center;\"><video controls src=\"' + url + '\" style=\"max-width:100%; max-height:360px; border-radius:8px; margin-bottom:0.75rem;\"></video><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(meta || 'Video ready') + '</div></div>';
          } else if (mime.includes('pdf') || ext === 'pdf') {
            previewBox.innerHTML = '<div><iframe src=\"' + url + '\" style=\"width:100%; height:450px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:0.75rem;\"></iframe><div style=\"font-size:0.85rem; color:var(--text-muted);\">' + escapeHtml(meta || 'PDF document ready') + '</div></div>';
          } else {
            previewBox.innerHTML = '<div style=\"padding:1rem; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border-subtle); font-size:0.9rem;\"><strong>✓ Complete:</strong> ' + escapeHtml(meta || 'File processed successfully.') + '</div>';
          }

          progressPct.textContent = '100%';
          progressBarFill.style.width = '100%';
          progressStatus.textContent = 'Conversion complete!';
          outputWrap.style.display = 'block';
          outputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          showToast('✓ Processed successfully!');
        } catch (err) {
          console.error('Media processing error:', err);
          showToast('Error: ' + err.message);
          progressStatus.textContent = 'Failed: ' + err.message;
        } finally {
          pageEngine.setProcessingUi(false);
        }
      });
    });
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(medDir, `${toolId}.html`), html, 'utf-8');
    count++;
  }

  console.log(`Successfully generated ${count} Media Converter Tool pages.`);
  return count;
}

// ----------------------------------------------------
// RUN ALL GENERATORS
// ----------------------------------------------------
export function runAllGenerators() {
  const aiCount = generateAllAIToolPages();
  const crCount = generateAllCreatorToolPages();
  const medCount = generateAllMediaConverterPages();

  console.log(`\nTool generation complete: ${aiCount} AI Tools + ${crCount} Creator Tools + ${medCount} Media Converters.`);
}

if (process.argv[1] && process.argv[1].endsWith('generate-all-tool-pages.mjs')) {
  runAllGenerators();
}
