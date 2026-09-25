import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { BU_CATEGORIES } from './build-categories-data.mjs';
import { TEXT_TOOLS } from './build-tools-data.mjs';
import { DEV_TOOLS } from './build-tools-data-dev.mjs';
import { SEO_TOOLS } from './build-tools-data-seo.mjs';
import { IMG_TOOLS } from './build-tools-data-img.mjs';
import { FILE_TOOLS } from './build-tools-data-file.mjs';
import { EVERYDAY_TOOLS } from './build-tools-data-everyday.mjs';

// 9 New Tool Suites (53 New Tools)
import { TEXT_EXTRAS_TOOLS } from './build-tools-data-text-extras.mjs';
import { UNIT_FORMAT_TOOLS } from './build-tools-data-unit-format.mjs';
import { GENERATORS_TOOLS } from './build-tools-data-generators.mjs';
import { COLOR_EXTRAS_TOOLS } from './build-tools-data-color-extras.mjs';
import { DEV_EXTRAS_TOOLS } from './build-tools-data-dev-extras.mjs';
import { CALC_PROD_TOOLS } from './build-tools-data-calc-prod.mjs';
import { SOCIAL_EXTRAS_TOOLS } from './build-tools-data-social-extras.mjs';
import { PRIVACY_EXTRAS_TOOLS } from './build-tools-data-privacy-extras.mjs';
import { FUN_EXTRAS_TOOLS } from './build-tools-data-fun-extras.mjs';

// 22 New Tools (Units, Dev, File, Color)
import { BATCH_UNIT_TOOLS } from './build-tools-data-batch-units.mjs';
import { BATCH_DEV_TOOLS } from './build-tools-data-batch-dev.mjs';
import { BATCH_FILE_TOOLS } from './build-tools-data-batch-file.mjs';
import { BATCH_COLOR_TOOLS } from './build-tools-data-batch-color.mjs';
import { getCounts } from './sync-counts.mjs';

const { aiCount, creatorCount, mediaCount, buCount, platformCount } = getCounts();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export const ALL_TOOLS = [
  // 9 New Suites First (ordered matching categories)
  ...TEXT_EXTRAS_TOOLS,
  ...UNIT_FORMAT_TOOLS,
  ...BATCH_UNIT_TOOLS,
  ...GENERATORS_TOOLS,
  ...COLOR_EXTRAS_TOOLS,
  ...BATCH_COLOR_TOOLS,
  ...DEV_EXTRAS_TOOLS,
  ...CALC_PROD_TOOLS,
  ...SOCIAL_EXTRAS_TOOLS,
  ...PRIVACY_EXTRAS_TOOLS,
  ...FUN_EXTRAS_TOOLS,
  // 6 Original Suites
  ...TEXT_TOOLS,
  ...DEV_TOOLS,
  ...BATCH_DEV_TOOLS,
  ...SEO_TOOLS,
  ...IMG_TOOLS,
  ...FILE_TOOLS,
  ...BATCH_FILE_TOOLS,
  ...EVERYDAY_TOOLS
];

console.log(`Loaded ${BU_CATEGORIES.length} categories and ${ALL_TOOLS.length} tools.`);

// Shared HTML Snippets
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHead({ title, description, keywords, canonical, jsonLd, depth = 0 }) {
  const assetPrefix = depth === 0 ? '' : '../';
  return `<!DOCTYPE html>
<html lang="en" data-theme="light" style="background-color: #FDFDFD; color-scheme: light;">
<head>
  <meta charset="UTF-8">
  <script>
    (function(){
      try {
        var t = localStorage.getItem('mtv_theme');
        var eff = (t === 'dark') ? 'dark' : (t === 'light' ? 'light' : ((t === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'));
        var bg = eff === 'dark' ? '#0A0A0C' : '#FDFDFD';
        var color = eff === 'dark' ? '#F5F5F7' : '#1D1D1F';
        var doc = document.documentElement;
        doc.setAttribute('data-theme', eff);
        doc.style.colorScheme = eff;
        doc.style.backgroundColor = bg;
        document.write('<style id="mtv-instant-bg">html,html body{background-color:' + bg + ' !important;background:' + bg + ' !important;color:' + color + ' !important;}</style>');
      } catch(e){}
    })();
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Resource Hints & Preconnects for Performance Optimization -->
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
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

function renderHeader({ activeNav = 'browser-utilities', depth = 0 }) {
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
          <span class="brand-badge">PRO</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="nav-desktop" aria-label="Main Navigation">
        <a href="${p}index.html" class="nav-link nav-link-home ${activeNav === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}explore-hub.html" class="nav-link ${activeNav === 'explore-hub' ? 'active' : ''}">Explore</a>
        <a href="${p}ai-prompt.html" class="nav-link ${activeNav === 'ai-prompt' ? 'active' : ''}">Prompt</a>
        <a href="${p}ai-tools.html" class="nav-link ${activeNav === 'ai-tools' ? 'active' : ''}">Tools</a>
        <a href="${p}creator-tools.html" class="nav-link ${activeNav === 'creator-tools' ? 'active' : ''}">Creator</a>
        <a href="${p}media-converter-tools.html" class="nav-link ${activeNav === 'media-converter-tools' ? 'active' : ''}">Converter</a>
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

      <!-- Header Actions -->
      <div class="header-actions">
        <button type="button" class="btn btn-icon-only theme-toggle-btn" aria-label="Toggle Light/Dark Theme" title="Toggle Theme"></button>
        <button type="button" class="btn-mobile-menu" aria-label="Open Navigation Menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer Menu -->
  <div class="mobile-drawer" id="mobile-drawer">
    <a href="${p}index.html" class="mobile-nav-link nav-link-home ${activeNav === 'home' ? 'active' : ''}">Home</a>
    <a href="${p}explore-hub.html" class="mobile-nav-link ${activeNav === 'explore-hub' ? 'active' : ''}">Explore Hub</a>
    <a href="${p}ai-prompt.html" class="mobile-nav-link ${activeNav === 'ai-prompt' ? 'active' : ''}">AI Prompt</a>
    <a href="${p}ai-tools.html" class="mobile-nav-link ${activeNav === 'ai-tools' ? 'active' : ''}">AI Tools</a>
    <a href="${p}creator-tools.html" class="mobile-nav-link ${activeNav === 'creator-tools' ? 'active' : ''}">Creator Tools</a>
    <a href="${p}media-converter-tools.html" class="mobile-nav-link ${activeNav === 'media-converter-tools' ? 'active' : ''}">Media Converter Tools</a>
    <a href="${p}browser-utilities.html" class="mobile-nav-link ${activeNav === 'browser-utilities' ? 'active' : ''}">Browser Utilities</a>
    <a href="${p}platforms.html" class="mobile-nav-link ${activeNav === 'platforms' ? 'active' : ''}">Platforms</a>
    <a href="${p}about.html" class="mobile-nav-link ${activeNav === 'about' ? 'active' : ''}">About</a>
    <a href="${p}settings.html" class="mobile-nav-link ${activeNav === 'settings' ? 'active' : ''}">Settings</a>
    <a href="${p}privacy.html" class="mobile-nav-link ${activeNav === 'privacy' ? 'active' : ''}">Privacy Policy</a>
    <a href="${p}disclaimer.html" class="mobile-nav-link ${activeNav === 'disclaimer' ? 'active' : ''}">Disclaimer</a>
    <a href="${p}terms.html" class="mobile-nav-link ${activeNav === 'terms' ? 'active' : ''}">Terms of Service</a>
  </div>`;
}

function renderFooter({ depth = 0 }) {
  const p = depth === 0 ? '' : '../';
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${p}index.html" class="footer-brand-link" aria-label="Multi Tube Views Home">
            <h3>
              <span class="brand-icon" style="width: 26px; height: 26px; font-size: 0.75rem;">MTV</span>
              <span>Multi Tube Views</span>
            </h3>
          </a>
          <p>A clean, responsive, multi-platform public media workspace featuring ${platformCount}+ platform adapters, ${aiCount} AI tools, ${creatorCount} creator optimization tools, ${mediaCount} browser media converters, ${buCount} client-side browser utilities, and an AI prompts directory.</p>
        </div>

        <div class="footer-col">
          <h4>Platforms</h4>
          <ul class="footer-links">
            <li><a href="${p}platforms/youtube.html">YouTube</a></li>
            <li><a href="${p}platforms/twitch.html">Twitch</a></li>
            <li><a href="${p}platforms/vimeo.html">Vimeo</a></li>
            <li><a href="${p}platforms/spotify.html">Spotify</a></li>
            <li><a href="${p}platforms.html">All ${platformCount} Platforms</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company & Tools</h4>
          <ul class="footer-links">
            <li><a href="${p}explore-hub.html">Explore Hub</a></li>
            <li><a href="${p}ai-prompt.html">AI Prompts & Tools</a></li>
            <li><a href="${p}ai-tools.html">AI Tools Suite</a></li>
            <li><a href="${p}creator-tools.html">Creator Tools</a></li>
            <li><a href="${p}media-converter-tools.html">Media Converter Tools</a></li>
            <li><a href="${p}browser-utilities.html">Browser Utilities</a></li>
            <li><a href="${p}about.html">About MTV</a></li>
            <li><a href="${p}credits.html">Credits & Attributions</a></li>
            <li><a href="https://publicmediatool.com/" target="_blank" rel="noopener">Public Media Tool ↗</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Legal & Safety</h4>
          <ul class="footer-links">
            <li><a href="${p}privacy.html">Privacy Policy</a></li>
            <li><a href="${p}disclaimer.html">Disclaimer</a></li>
            <li><a href="${p}terms.html">Terms of Service</a></li>
            <li><a href="${p}settings.html">Settings</a></li>
            <li><a href="${p}contact.html">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-info">
          <div>© <span class="dynamic-year">2026</span> Multi Tube Views (MTV). All rights reserved.</div>
          <div class="creator-credit">
            Created by <span class="creator-name">AiMAEditz</span> <span class="creator-sep">•</span> <a href="${p}credits.html#creator" class="creator-link">About Creator</a>
          </div>
          <div class="footer-social-row" aria-label="Social Media Links">
            <a href="https://www.instagram.com/its_abid29" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Instagram" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.youtube.com/@aimabideditz" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="YouTube" title="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@its_abid29" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="TikTok" title="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://www.facebook.com/aimaeditz" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Facebook" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.whatsapp.com/channel/0029Vb669jh11ulG8ttZ3K3s" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="WhatsApp Channel" title="WhatsApp Channel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.011 0C5.397 0 .021 5.378.021 11.991c0 2.112.551 4.172 1.597 5.986L0 24l6.19-1.623a11.932 11.932 0 005.82 1.512h.005c6.613 0 11.989-5.378 11.989-11.992.001-3.201-1.243-6.211-3.504-8.473A11.884 11.884 0 0012.011 0zm0 21.821h-.004a9.92 9.92 0 01-5.061-1.391l-.363-.215-3.761.986.1003-3.668-.236-.375A9.927 9.927 0 012.022 11.99c0-5.508 4.481-9.989 9.99-9.989 2.668 0 5.176 1.039 7.06 2.923A9.913 9.913 0 0122 11.992c0 5.509-4.48 9.99-9.989 9.99zm5.48-7.487c-.301-.151-1.78-.878-2.056-.978-.275-.101-.476-.151-.676.151-.201.301-.777.978-.953 1.178-.176.201-.351.226-.652.075-.301-.151-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.131-.614.135-.135.301-.351.452-.527.15-.175.201-.301.301-.502.101-.201.05-.376-.025-.527-.075-.151-.676-1.63-.926-2.232-.243-.586-.491-.506-.676-.515l-.577-.01c-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.51 1.079 2.912 1.229 3.113c.151.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.377.197 1.896.12.578-.086 1.78-.727 2.031-1.43.251-.703.251-1.304.176-1.43-.075-.126-.276-.226-.577-.377z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-bottom-links">
          <a href="${p}privacy.html">Privacy</a>
          <a href="${p}disclaimer.html">Disclaimer</a>
          <a href="${p}terms.html">Terms</a>
          <a href="${p}credits.html">Credits</a>
          <a href="${p}articles.html">Articles</a>
        </div>
      </div>
    </div>
  </footer>

  <script type="module" src="${p}assets/js/navigation.js"></script>
  <script type="module" src="${p}assets/js/browser-utilities.js"></script>`;
}

// Helper functions for scalable, high-CTR tool and category SEO titles and meta descriptions
export function generateToolSeoMetadata(tool, cat) {
  const toolName = tool.name.trim();

  let title = '';
  if (tool.title && tool.title.length >= 40 && tool.title.length <= 75) {
    title = tool.title;
  } else {
    // Title target length: 50-60 chars
    let brand = toolName.length > 25 ? 'MTV' : 'Multi Tube Views';
    title = `${toolName} — Free In-Browser Tool | ${brand}`;

    if (toolName.toLowerCase().includes('generator')) {
      title = `${toolName} — Free Online Generator | ${brand}`;
    } else if (toolName.toLowerCase().includes('converter')) {
      title = `${toolName} — Free Online Converter | ${brand}`;
    } else if (toolName.toLowerCase().includes('calculator')) {
      title = `${toolName} — Free Online Calculator | ${brand}`;
    } else if (toolName.toLowerCase().includes('checker') || toolName.toLowerCase().includes('validator') || toolName.toLowerCase().includes('tester')) {
      title = `${toolName} — Free Online Testing Tool | ${brand}`;
    }

    if (title.length < 50) {
      title = `${toolName} — Free Online Tool & Utility | ${brand}`;
    }
    if (title.length > 60) {
      title = `${toolName} — Free Online Tool | MTV`;
    }
    if (title.length > 60) {
      title = `${toolName} — Free In-Browser Tool`;
    }
  }

  // Meta description target length: 150-160 chars
  let baseDesc = (tool.description || '').trim();
  if (!baseDesc.endsWith('.')) baseDesc += '.';

  let description = `${baseDesc} Fast, 100% private in-browser tool with zero server uploads by Multi Tube Views.`;
  if (description.length > 160) {
    description = `${baseDesc} 100% free, private client-side utility with zero server uploads by Multi Tube Views.`;
  }
  if (description.length > 160) {
    description = `${baseDesc} Fast, 100% private client-side web tool by Multi Tube Views.`;
  }
  if (description.length < 145) {
    description = `${baseDesc} Fast, free, 100% private client-side browser utility with zero server uploads by Multi Tube Views.`;
  }
  if (description.length > 160) {
    const sub = description.substring(0, 155);
    const lastSpace = sub.lastIndexOf(' ');
    description = sub.substring(0, lastSpace) + '.';
  }

  return { title, description };
}

export function generateCategorySeoMetadata(cat, catToolsCount) {
  const catName = cat.name.trim();
  let title = `${catName} — Free In-Browser Tools | MTV`;
  if (title.length < 50) {
    title = `${catName} — Free In-Browser Utilities | Multi Tube Views`;
  }
  if (title.length > 60) {
    title = `${catName} — Free In-Browser Tools | MTV`;
  }

  let baseDesc = (cat.description || '').trim();
  if (!baseDesc.endsWith('.')) baseDesc += '.';

  let description = `Explore ${catToolsCount} free client-side tools in ${catName}. ${baseDesc} 100% private in-browser tools by Multi Tube Views.`;
  if (description.length > 160) {
    description = `Explore ${catToolsCount} free tools in ${catName}. ${baseDesc} 100% private client-side tools by Multi Tube Views.`;
  }
  if (description.length > 160) {
    description = `Explore ${catToolsCount} free client-side utilities in ${catName}. 100% private in-browser tools by Multi Tube Views.`;
  }
  if (description.length < 145) {
    description = `Explore ${catToolsCount} free client-side web tools in ${catName}. ${baseDesc} 100% private in-browser utilities by Multi Tube Views.`;
  }

  return { title, description };
}

// 1. Generate Main Hub Page: browser-utilities.html
function generateHubPage() {
  const buTotal = ALL_TOOLS.length || buCount;
  const title = `Browser Utilities — ${buTotal} Free Client-Side Web Tools | MTV`;
  const description = `Suite of ${buTotal} fast, 100% private in-browser utilities for developers & creators. Text tools, unit converters, CSS generators, and code encoders by Multi Tube Views.`;
  const keywords = "browser utilities online, client side tools, dev tools online, json formatter, regex tester, word counter, password strength checker, color palette generator, csv to json, free web tools, mtv browser utilities, multitube views tools";
  const canonical = "https://multitubeviews.com/browser-utilities.html";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://multitubeviews.com/browser-utilities.html#webapp",
        "name": "MTV Browser Utilities",
        "alternateName": [
          "Multi Tube Views Browser Utilities",
          "MTV Client-Side Tools",
          `${buTotal} In-Browser Utilities by AiMAEditz`
        ],
        "url": "https://multitubeviews.com/browser-utilities.html",
        "description": description,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript and HTML5 APIs",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": [
          `${buTotal} high-speed client-side tools across 15 specialized categories`,
          "100% in-browser processing via Web Crypto, Canvas, and native DOM",
          "Zero server uploads: sensitive text, code, and photos never leave your device",
          "One-click copying, file downloading, and responsive mobile-first UI"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://multitubeviews.com/browser-utilities.html#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://multitubeviews.com/index.html" },
          { "@type": "ListItem", "position": 2, "name": "Browser Utilities", "item": "https://multitubeviews.com/browser-utilities.html" }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://multitubeviews.com/browser-utilities.html#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are my files or passwords uploaded to your servers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `No. All ${buTotal} browser utilities run entirely client-side using JavaScript, Web Crypto, and Canvas. Nothing is ever sent to any backend server.`
            }
          },
          {
            "@type": "Question",
            "name": "Are these utilities free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all utilities are 100% free with no sign-ups, no subscriptions, and unlimited daily usage."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use these tools offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Because the utilities use native browser APIs and are cached via service workers, they work completely offline after the page is loaded."
            }
          }
        ]
      }
    ]
  };

  const categoriesHtml = BU_CATEGORIES.map(cat => {
    const catTools = ALL_TOOLS.filter(t => t.categoryId === cat.id);
    return `
      <section class="bu-category-block" id="${cat.id}" data-category-section="${cat.id}" style="margin-bottom: 3.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <span style="font-size: 1.8rem;">${cat.icon}</span>
              <h2 style="font-size: 1.5rem; font-weight: 800; margin: 0; color: var(--text-primary);">${cat.name}</h2>
              <span class="bu-badge">${catTools.length} Tools</span>
            </div>
            <p style="margin: 0.35rem 0 0 0; color: var(--text-muted); font-size: 0.95rem; max-width: 650px;">${cat.description}</p>
          </div>
          <a href="browser-utilities/${cat.id}.html" class="bu-btn" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">View Category Hub →</a>
        </div>

        <div class="bu-grid-3col">
          ${catTools.map(tool => `
            <a href="browser-utilities/${tool.id}.html" class="bu-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between;" data-tool-card="${tool.id}" data-tool-category="${cat.id}">
              <div>
                <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.65rem;">
                  <span class="bu-card-icon" style="font-size: 1.6rem;">${tool.icon}</span>
                  <h3 class="bu-card-title" style="font-size: 1.05rem; font-weight: 700; margin: 0;">${tool.name}</h3>
                </div>
                <p class="bu-card-desc" style="font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); margin: 0 0 1rem 0;">${tool.description}</p>
              </div>
              <div class="bu-card-actions" style="margin-top: auto; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); width: 100%;">
                <span class="btn btn-primary btn-open-utility" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                  <span>Open Utility</span>
                  <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');

  const html = `
${renderHead({ title, description, keywords, canonical, jsonLd, depth: 0 })}
<body>
${renderHeader({ activeNav: 'browser-utilities', depth: 0 })}

  <main class="site-main">
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">

      <!-- Breadcrumbs -->
      <nav class="bu-breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="bu-sep">/</span>
        <span class="bu-current">Browser Utilities</span>
      </nav>

      <!-- Hero Header -->
      <div class="bu-hero" style="text-align: center; max-width: 860px; margin: 1.5rem auto 2.5rem auto;">
        <span class="bu-badge" style="margin-bottom: 0.75rem; font-size: 0.82rem; padding: 0.35rem 0.85rem; background: var(--accent-blue-10, rgba(0,102,204,0.1)); color: var(--accent-blue);">
          ⚡ ${buTotal} CLIENT-SIDE UTILITIES • 100% PRIVATE • ZERO UPLOADS
        </span>
        <h1 class="bu-title" style="font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; line-height: 1.2; margin: 0.5rem 0 1rem 0;">
          Instant In-Browser <span class="accent">Utilities &amp; Tools</span>
        </h1>
        <p class="bu-subtitle" style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin: 0 auto 1.5rem auto;">
          High-performance, zero-latency browser utilities engineered for developers, creators, and analysts. Format JSON, analyze SEO tags, convert colors, test regex, and inspect file hashes locally with 100% client-side privacy.
        </p>

        <!-- Search Bar -->
        <div style="position: relative; max-width: 580px; margin: 0 auto;">
          <input type="text" id="bu-search-input" class="bu-input" placeholder="Search ${buTotal} utilities (e.g. JSON, Regex, Password, Slug, Base64)..." style="padding: 0.85rem 1.2rem; font-size: 1rem; border-radius: 999px; box-shadow: var(--shadow-sm);">
          <span id="bu-search-count" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 0.8rem; color: var(--text-muted); pointer-events: none;">${buTotal} Tools</span>
        </div>
      </div>

      <!-- Quick Category Nav Chips / Filter Pills -->
      <div id="bu-category-filters-wrap" class="bu-category-nav-grid" style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
        <button type="button" class="bu-btn bu-category-filter-btn bu-btn-primary" data-bu-filter="all" style="padding: 0.45rem 0.95rem; font-size: 0.85rem; border-radius: 999px; cursor: pointer;">
          <span>⚡ All Utilities</span> <span class="bu-badge" style="margin-left: 0.35rem; font-size: 0.75rem; padding: 0.15rem 0.45rem;">${ALL_TOOLS.length}</span>
        </button>
        ${BU_CATEGORIES.map(c => {
          const count = ALL_TOOLS.filter(t => t.categoryId === c.id).length;
          return `
          <button type="button" class="bu-btn bu-category-filter-btn" data-bu-filter="${c.id}" style="padding: 0.45rem 0.95rem; font-size: 0.85rem; border-radius: 999px; cursor: pointer;">
            <span>${c.icon}</span> <span>${c.name}</span> <span class="bu-badge" style="margin-left: 0.35rem; font-size: 0.75rem; padding: 0.15rem 0.45rem;">${count}</span>
          </button>
        `;
        }).join('')}
      </div>

      <!-- Categories & Tools Grid -->
      <div id="bu-tools-container">
        ${categoriesHtml}
      </div>

      <!-- Empty State -->
      <div id="bu-empty-state" style="display: none; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">No utilities found</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Try searching for a different keyword like JSON, Base64, Counter, or Hash.</p>
      </div>

      <!-- Suite Highlights -->
      <section style="margin-top: 4rem; padding: 2rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px);">
        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 1rem;">Why Use MTV Browser Utilities?</h2>
        <div class="bu-grid-3col">
          <div>
            <strong style="display: block; font-size: 1rem; margin-bottom: 0.35rem;">🔒 Complete Data Privacy</strong>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">Files, JSON data, passwords, and source code are processed exclusively in your device's memory using client-side Web APIs.</p>
          </div>
          <div>
            <strong style="display: block; font-size: 1rem; margin-bottom: 0.35rem;">⚡ Zero Latency</strong>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">Instant execution without waiting for remote server roundtrips, cloud queue processing, or rate limiting.</p>
          </div>
          <div>
            <strong style="display: block; font-size: 1rem; margin-bottom: 0.35rem;">📱 Mobile &amp; Desktop Optimized</strong>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">Carefully engineered responsive layouts with touch-friendly controls, monospaced outputs, and dark mode support.</p>
          </div>
        </div>
      </section>

    </div>
  </main>

${renderFooter({ depth: 0 })}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const search = document.getElementById('bu-search-input');
      const countEl = document.getElementById('bu-search-count');
      const emptyState = document.getElementById('bu-empty-state');
      const filterBtns = document.querySelectorAll('.bu-category-filter-btn');
      const sections = document.querySelectorAll('.bu-category-block');

      let activeCategory = 'all';

      function applyFilter() {
        const q = search ? search.value.toLowerCase().trim() : '';
        let totalMatches = 0;

        sections.forEach(sec => {
          const secCat = sec.getAttribute('data-category-section') || sec.id;
          const catMatches = (activeCategory === 'all' || activeCategory === secCat);
          
          let visibleCardsInSec = 0;
          const secCards = sec.querySelectorAll('[data-tool-card]');

          secCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const textMatches = !q || text.includes(q);
            const showCard = catMatches && textMatches;
            if (showCard) {
              card.style.removeProperty('display');
              card.removeAttribute('data-hidden');
              card.removeAttribute('hidden');
              card.classList.remove('is-hidden');
              visibleCardsInSec++;
              totalMatches++;
            } else {
              card.style.setProperty('display', 'none', 'important');
              card.setAttribute('data-hidden', 'true');
              card.setAttribute('hidden', '');
              card.classList.add('is-hidden');
            }
          });

          if (catMatches && visibleCardsInSec > 0) {
            sec.style.removeProperty('display');
            sec.removeAttribute('data-hidden');
            sec.removeAttribute('hidden');
            sec.classList.remove('is-hidden');
          } else {
            sec.style.setProperty('display', 'none', 'important');
            sec.setAttribute('data-hidden', 'true');
            sec.setAttribute('hidden', '');
            sec.classList.add('is-hidden');
          }
        });

        if (countEl) {
          if (q) {
            countEl.textContent = \`\${totalMatches} found\`;
          } else if (activeCategory !== 'all') {
            countEl.textContent = \`\${totalMatches} in category\`;
          } else {
            countEl.textContent = '${buTotal} Tools';
          }
        }

        if (emptyState) {
          emptyState.style.display = totalMatches === 0 ? 'block' : 'none';
        }
      }

      function selectBUCategory(targetCat) {
        if (!targetCat) return;
        activeCategory = targetCat;

        filterBtns.forEach(b => {
          if (b.getAttribute('data-bu-filter') === targetCat) {
            b.classList.add('bu-btn-primary');
          } else {
            b.classList.remove('bu-btn-primary');
          }
        });

        applyFilter();
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetCat = btn.getAttribute('data-bu-filter');
          selectBUCategory(targetCat);
        });
      });

      const navGrid = document.querySelector('.bu-category-nav-grid') || document.querySelector('.bu-category-filter-wrap');
      if (navGrid) {
        navGrid.addEventListener('click', (e) => {
          const btn = e.target.closest('.bu-category-filter-btn');
          if (btn) {
            e.preventDefault();
            const targetCat = btn.getAttribute('data-bu-filter');
            selectBUCategory(targetCat);
          }
        });
      }

      if (search) {
        search.addEventListener('input', applyFilter);
      }

      // If hash present in URL, select that category
      if (window.location.hash) {
        const hashId = window.location.hash.replace('#', '');
        const matchingBtn = document.querySelector(\`.bu-category-filter-btn[data-bu-filter="\${hashId}"]\`);
        if (matchingBtn) {
          matchingBtn.click();
        }
      }
    });
  </script>
</body>
</html>
  `;

  fs.writeFileSync(path.join(ROOT, 'browser-utilities.html'), html, 'utf8');
  console.log('✓ Generated browser-utilities.html');
}

// 2. Generate Category Pages: browser-utilities/{categoryId}.html
function generateCategoryPages() {
  BU_CATEGORIES.forEach(cat => {
    const catTools = ALL_TOOLS.filter(t => t.categoryId === cat.id);
    const { title, description } = generateCategorySeoMetadata(cat, catTools.length);
    const keywords = `${cat.name.toLowerCase()}, client side tools, online ${cat.name.toLowerCase()}, ${catTools.map(t => t.name.toLowerCase()).join(', ')}`;
    const canonical = `https://multitubeviews.com/browser-utilities/${cat.id}.html`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonical}#collection`,
          "name": `${cat.name} — MTV Browser Utilities`,
          "url": canonical,
          "description": description,
          "hasPart": catTools.map(t => ({
            "@type": "WebApplication",
            "name": t.name,
            "url": `https://multitubeviews.com/browser-utilities/${t.id}.html`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://multitubeviews.com/index.html" },
            { "@type": "ListItem", "position": 2, "name": "Browser Utilities", "item": "https://multitubeviews.com/browser-utilities.html" },
            { "@type": "ListItem", "position": 3, "name": cat.name, "item": canonical }
          ]
        }
      ]
    };

    const html = `
${renderHead({ title, description, keywords, canonical, jsonLd, depth: 1 })}
<body>
${renderHeader({ activeNav: 'browser-utilities', depth: 1 })}

  <main class="site-main">
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">

      <!-- Breadcrumbs -->
      <nav class="bu-breadcrumbs" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="bu-sep">/</span>
        <a href="../browser-utilities.html">Browser Utilities</a>
        <span class="bu-sep">/</span>
        <span class="bu-current">${cat.name}</span>
      </nav>

      <!-- Category Hero -->
      <div class="bu-hero" style="margin: 1.5rem 0 2.5rem 0;">
        <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.5rem;">
          <span style="font-size: 2.2rem;">${cat.icon}</span>
          <h1 class="bu-title" style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; margin: 0;">${cat.name}</h1>
          <span class="bu-badge">${catTools.length} Utilities</span>
        </div>
        <p class="bu-subtitle" style="font-size: 1.05rem; color: var(--text-muted); max-width: 750px; line-height: 1.6; margin: 0.5rem 0 1.5rem 0;">
          ${cat.description} All tools run 100% client-side with zero data transmitted to any external server.
        </p>
      </div>

      <!-- Tools Grid -->
      <div class="bu-grid-3col" style="margin-bottom: 3.5rem;">
        ${catTools.map(tool => `
          <a href="${tool.id}.html" class="bu-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.65rem;">
                <span class="bu-card-icon" style="font-size: 1.6rem;">${tool.icon}</span>
                <h2 class="bu-card-title" style="font-size: 1.05rem; font-weight: 700; margin: 0;">${tool.name}</h2>
              </div>
              <p class="bu-card-desc" style="font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); margin: 0 0 1rem 0;">${tool.description}</p>
            </div>
            <div class="bu-card-actions" style="margin-top: auto; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); width: 100%;">
              <span class="btn btn-primary btn-open-utility" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                <span>Open Utility</span>
                <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
            </div>
          </a>
        `).join('')}
      </div>

      <!-- Other Categories -->
      <div style="border-top: 1px solid var(--border-color); padding-top: 2rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Explore Other Utilities Categories</h3>
        <div class="bu-category-nav-grid" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${BU_CATEGORIES.filter(c => c.id !== cat.id).map(c => `
            <a href="${c.id}.html" class="bu-btn" style="padding: 0.45rem 0.9rem; font-size: 0.85rem; text-decoration: none;">
              <span>${c.icon}</span> <span>${c.name}</span>
            </a>
          `).join('')}
        </div>
      </div>

    </div>
  </main>

${renderFooter({ depth: 1 })}
</body>
</html>
    `;

    fs.writeFileSync(path.join(ROOT, 'browser-utilities', `${cat.id}.html`), html, 'utf8');
    console.log(`✓ Generated category page: browser-utilities/${cat.id}.html`);
  });
}

// 3. Generate Individual Tool Pages: browser-utilities/{toolId}.html
function generateToolPages() {
  ALL_TOOLS.forEach(tool => {
    const cat = BU_CATEGORIES.find(c => c.id === tool.categoryId);
    const relatedTools = ALL_TOOLS.filter(t => t.categoryId === tool.categoryId && t.id !== tool.id).slice(0, 3);
    const { title, description } = generateToolSeoMetadata(tool, cat);
    const keywords = tool.keywords;
    const canonical = `https://multitubeviews.com/browser-utilities/${tool.id}.html`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": `${canonical}#webapp`,
          "name": tool.name,
          "url": canonical,
          "description": description,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "isAccessibleForFree": true,
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "featureList": tool.features.map(f => `${f.title}: ${f.desc}`)
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://multitubeviews.com/index.html" },
            { "@type": "ListItem", "position": 2, "name": "Browser Utilities", "item": "https://multitubeviews.com/browser-utilities.html" },
            { "@type": "ListItem", "position": 3, "name": cat.name, "item": `https://multitubeviews.com/browser-utilities/${cat.id}.html` },
            { "@type": "ListItem", "position": 4, "name": tool.name, "item": canonical }
          ]
        }
      ]
    };

    const html = `
${renderHead({ title, description, keywords, canonical, jsonLd, depth: 1 })}
<body>
${renderHeader({ activeNav: 'browser-utilities', depth: 1 })}

  <main class="site-main">
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">

      <!-- Breadcrumbs -->
      <nav class="bu-breadcrumbs" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="bu-sep">/</span>
        <a href="../browser-utilities.html">Browser Utilities</a>
        <span class="bu-sep">/</span>
        <a href="${cat.id}.html">${cat.name}</a>
        <span class="bu-sep">/</span>
        <span class="bu-current">${tool.name}</span>
      </nav>

      <!-- Tool Header -->
      <div class="bu-header" style="margin: 1.5rem 0 2rem 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <span style="font-size: 2.2rem;">${tool.icon}</span>
          <h1 class="bu-title" style="font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; margin: 0;">${tool.name}</h1>
          <span class="bu-badge" style="background: var(--success-bg, rgba(34,197,94,0.1)); color: var(--success-text, #16a34a);">100% Client-Side</span>
        </div>
        <p class="bu-subtitle" style="font-size: 1rem; color: var(--text-muted); max-width: 780px; line-height: 1.6; margin: 0;">
          ${tool.description}
        </p>
      </div>

      <!-- Main Workspace -->
      <section class="bu-workspace" aria-label="${tool.name} Workspace">
        ${tool.renderControls()}
      </section>

      <!-- How to Use & Features Section -->
      <div class="bu-grid-2col" style="margin-top: 3.5rem; gap: 2rem;">
        <!-- How to Use Steps -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.75rem;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem;">How to Use ${tool.name}</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${tool.howToUse.map(step => `
              <div style="display: flex; gap: 0.85rem; align-items: flex-start;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">
                  ${step.step}
                </div>
                <div>
                  <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.2rem;">${step.title}</strong>
                  <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${escapeHtml(step.desc)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Features -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.75rem;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem;">Key Features &amp; Privacy</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${tool.features.map(f => `
              <div>
                <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--accent-primary);">✓ ${f.title}</strong>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${escapeHtml(f.desc)}</p>
              </div>
            `).join('')}
            <div>
              <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--success-text);">🔒 Complete Client-Side Isolation</strong>
              <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">This tool runs entirely in your local browser runtime. No logs, analytics tracking, or remote server transmissions occur.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Tools in Same Category -->
      ${relatedTools.length > 0 ? `
      <section style="margin-top: 3.5rem; border-top: 1px solid var(--border-color); padding-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Related Tools</h2>
          <a href="${cat.id}.html" style="font-size: 0.85rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">View all ${cat.name} →</a>
        </div>
        <div class="bu-grid-3col">
          ${relatedTools.map(rt => `
            <a href="${rt.id}.html" class="bu-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.4rem;">${rt.icon}</span>
                  <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">${rt.name}</h3>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${rt.description}</p>
              </div>
              <div class="bu-card-actions" style="margin-top: auto; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); width: 100%;">
                <span class="btn btn-primary btn-open-utility" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                  <span>Open Utility</span>
                  <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}

    </div>
  </main>

${renderFooter({ depth: 1 })}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      ${tool.renderScript()}
    });
  </script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(ROOT, 'browser-utilities', `${tool.id}.html`), html, 'utf8');
  });
  console.log(`✓ Generated ${ALL_TOOLS.length} individual tool pages in browser-utilities/`);
}

// 4. Generate Valid Directory Fallbacks
export function generateRedirectPages() {
  const buHtml = `${renderHead({
    title: 'Browser Utilities Directory — Multi Tube Views',
    description: 'Explore 111+ fast, private client-side browser utilities for developers and creators. Format JSON, convert colors, test regex, and more with zero server uploads.',
    keywords: 'browser utilities, web tools, developer tools, client side tools, multi tube views, mtv tools',
    canonical: 'https://multitubeviews.com/browser-utilities.html',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://multitubeviews.com/browser-utilities/index.html#webpage",
      "url": "https://multitubeviews.com/browser-utilities.html",
      "name": "Browser Utilities Directory",
      "description": "Explore 111+ fast, private client-side browser utilities for developers and creators.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Multi Tube Views",
        "url": "https://multitubeviews.com/"
      }
    },
    depth: 1
  })}
<body style="font-family: system-ui, sans-serif; text-align: center; padding: 3rem; background: var(--bg-primary, #07090e); color: var(--text-primary, #f0f3fa);">
  <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Browser Utilities Directory</h1>
  <p>Redirecting to <a href="../browser-utilities.html" style="color: var(--accent-primary, #6366f1); font-weight: 700;">Browser Utilities Hub</a>...</p>
  <script>
    window.location.replace('../browser-utilities.html');
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(ROOT, 'browser-utilities', 'index.html'), buHtml, 'utf8');

  const platformsHtml = `${renderHead({
    title: 'Supported Media Platforms — Multi Tube Views Directory',
    description: 'Explore 40+ supported video, live streaming, and audio platforms in Multi Tube Views. Watch and listen side-by-side in custom multi-player grids.',
    keywords: 'media platforms, video streaming platforms, live stream players, multi tube views, mtv directory',
    canonical: 'https://multitubeviews.com/platforms.html',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://multitubeviews.com/platforms/index.html#webpage",
      "url": "https://multitubeviews.com/platforms.html",
      "name": "Supported Media Platforms Directory",
      "description": "Explore 40+ supported video, live streaming, and audio platforms in Multi Tube Views.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Multi Tube Views",
        "url": "https://multitubeviews.com/"
      }
    },
    depth: 1
  })}
<body style="font-family: system-ui, sans-serif; text-align: center; padding: 3rem; background: var(--bg-primary, #07090e); color: var(--text-primary, #f0f3fa);">
  <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Supported Media Platforms Directory</h1>
  <p>Redirecting to <a href="../platforms.html" style="color: var(--accent-primary, #6366f1); font-weight: 700;">Platforms Directory</a>...</p>
  <script>
    window.location.replace('../platforms.html');
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(ROOT, 'platforms', 'index.html'), platformsHtml, 'utf8');
  console.log('✓ Generated redirect directory pages in browser-utilities/ and platforms/');
}

// Run Generators if called directly
if (process.argv[1] && process.argv[1].endsWith('generate-all-pages.mjs')) {
  console.log('Starting Browser Utilities static page generation...');
  generateHubPage();
  generateCategoryPages();
  generateToolPages();
  generateRedirectPages();
  console.log('✓ Finished all page generation successfully.');
}


