/**
 * Multi Tube Views (MTV) — Explore Hub Controller
 * Renders the 6 compact main section cards with gentle cursor-following tilt,
 * Populates Featured Tools, Latest Additions, and Discover All Categories from real data,
 * with direct links to all real existing pages.
 */

import { BU_CATEGORIES, BU_TOOLS_CATALOG } from '../data/browser-utilities-data.js';
import { AI_TOOLS_DATA } from '../data/ai-tools-data.js';
import { ALL_TOOL_CONFIGS } from './media-tools-data.js';
import { CREATOR_TOOLS_DATA } from '../data/creator-tools-data.js';
import { PLATFORM_CONFIG } from './platform-engine.js';
import { getWebsiteToolMetrics } from '../data/tools-registry.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('explore-cards-grid');
  const featuredGridEl = document.getElementById('featured-tools-grid');
  const latestGridEl = document.getElementById('latest-tools-grid');
  const categoriesGridEl = document.getElementById('discover-categories-grid');

  const totalToolsStatEl = document.getElementById('stat-total-tools');
  const totalPlatformsStatEl = document.getElementById('stat-total-platforms');

  // 1. Calculate live counts directly from existing platform registries
  const buToolsCount = Object.keys(BU_TOOLS_CATALOG || {}).length || 89;
  const aiToolsCount = Object.keys(AI_TOOLS_DATA || {}).length || 60;
  const mediaToolsCount = Object.keys(ALL_TOOL_CONFIGS || {}).length || 60;
  const creatorToolsCount = Object.keys(CREATOR_TOOLS_DATA || {}).length || 20;
  const platformsCount = Object.keys(PLATFORM_CONFIG || {}).length || 40;
  let promptsCount = '370+';

  // Update site stats summary row
  if (totalToolsStatEl) {
    const calculatedTotal = buToolsCount + aiToolsCount + mediaToolsCount + creatorToolsCount;
    totalToolsStatEl.textContent = `${calculatedTotal}+`;
  }
  if (totalPlatformsStatEl) {
    totalPlatformsStatEl.textContent = `${platformsCount}+`;
  }

  // 2. Define the 6 MAIN top-level sections in exact required order:
  const mainSections = [
    {
      id: 'card-ai-prompt',
      title: 'AI Prompt Library',
      countNum: promptsCount,
      countUnit: 'Prompts',
      countId: 'count-ai-prompt-val',
      desc: 'Curated AI image prompt formulas, creative styles, and free image generator directory.',
      url: 'ai-prompt.html',
      bg: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', // Purple / Indigo
      color: '#7C3AED',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>`
    },
    {
      id: 'card-ai-tools',
      title: 'AI Tools',
      countNum: `${aiToolsCount}`,
      countUnit: 'Tools',
      countId: 'count-ai-tools-val',
      desc: 'Generative AI tools for video scripts, viral hooks, tags, captions, and creative workflows.',
      url: 'ai-tools.html',
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)', // Emerald Green
      color: '#059669',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="3"/>
          <circle cx="12" cy="5" r="2"/>
          <path d="M12 7v4"/>
          <line x1="8" y1="16" x2="8.01" y2="16"/>
          <line x1="16" y1="16" x2="16.01" y2="16"/>
        </svg>`
    },
    {
      id: 'card-creator-tools',
      title: 'Creator Tools',
      countNum: `${creatorToolsCount}`,
      countUnit: 'Tools',
      countId: 'count-creator-tools-val',
      desc: 'High-converting title analyzers, thumbnail visualizers, and digital video studio utilities.',
      url: 'creator-tools.html',
      bg: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)', // Sunset Flame / Orange
      color: '#EA580C',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m22 8-6 4 6 4V8Z"/>
          <rect width="14" height="12" x="2" y="6" rx="2"/>
        </svg>`
    },
    {
      id: 'card-media-converters',
      title: 'Media Converter Tools',
      countNum: `${mediaToolsCount}`,
      countUnit: 'Tools',
      countId: 'count-media-tools-val',
      desc: 'Client-side processing for image formats, video encoding, audio tracks, and PDF documents.',
      url: 'media-converter-tools.html',
      bg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', // Royal Blue
      color: '#2563EB',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"/>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
          <path d="M3 22v-6h6"/>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
        </svg>`
    },
    {
      id: 'card-browser-utilities',
      title: 'Browser Utilities',
      countNum: `${buToolsCount}`,
      countUnit: 'Tools',
      countId: 'count-bu-tools-val',
      desc: 'Zero-upload web utilities for text manipulation, security, math, and developer calculators.',
      url: 'browser-utilities.html',
      bg: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', // Rose Crimson
      color: '#E11D48',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`
    },
    {
      id: 'card-platforms',
      title: 'Platforms',
      countNum: `${platformsCount}`,
      countUnit: 'Platforms',
      countId: 'count-platforms-val',
      desc: 'Multi-stream embed players and link validation gateways for 40+ video, audio, and social feeds.',
      url: 'platforms.html',
      bg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)', // Ocean Teal
      color: '#0D9488',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>`
    }
  ];

  // 3. Render the 6 Main Section Cards
  function renderMainCards() {
    if (!gridContainer) return;

    if (!gridContainer.children || gridContainer.children.length === 0) {
      gridContainer.innerHTML = mainSections.map((sec) => `
        <a 
          href="${sec.url}" 
          class="explore-section-card" 
          id="${sec.id}"
          style="background: ${sec.bg}; --card-accent: ${sec.color};"
          aria-label="${escapeHtml(sec.title)} — ${escapeHtml(sec.countNum)} ${escapeHtml(sec.countUnit)}"
        >
          <!-- 1. Icon representing section -->
          <div class="explore-section-icon-wrap" aria-hidden="true">
            ${sec.iconSvg}
          </div>

          <!-- 2. Real count as prominent number -->
          <div class="explore-section-count-row">
            <span class="explore-section-count-num" id="${sec.countId}">${escapeHtml(sec.countNum)}</span>
            <span class="explore-section-count-unit">${escapeHtml(sec.countUnit)}</span>
          </div>

          <!-- 3. Section title -->
          <h2 class="explore-section-title">${escapeHtml(sec.title)}</h2>

          <!-- 4. Short one-line description -->
          <p class="explore-section-desc">${escapeHtml(sec.desc)}</p>

          <!-- 5. Explore button / link -->
          <div class="explore-section-action">
            <span class="explore-section-btn">
              <span>Explore</span>
              <svg class="arrow-nudge" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>
      `).join('');
    }

    // Subtle cursor-following shift/tilt effect (No bright glow/highlight)
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      const cards = gridContainer.querySelectorAll('.explore-section-card');
      cards.forEach((card) => {
        let rafId = null;

        const onMouseMove = (e) => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            const tiltX = -y * 3.5;
            const tiltY = x * 3.5;
            const shiftX = x * 2;
            const shiftY = y * 2 - 2;
            card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
          });
        };

        const onMouseLeave = () => {
          if (rafId) cancelAnimationFrame(rafId);
          card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
        };

        card.addEventListener('mousemove', onMouseMove, { passive: true });
        card.addEventListener('mouseleave', onMouseLeave, { passive: true });
      });
    }
  }

  // 4. Unified Site Tool Data Aggregation & Automated Tracking Integration
  function getUnifiedSiteTools() {
    const unified = [];
    const todayStr = new Date().toISOString().slice(0, 10);

    // 1. AI Tools (211)
    if (typeof AI_TOOLS_DATA !== 'undefined' && AI_TOOLS_DATA) {
      Object.entries(AI_TOOLS_DATA).forEach(([id, t]) => {
        unified.push({
          id: id,
          title: t.title || id,
          desc: t.desc || '',
          icon: t.icon || '🎬',
          category: 'AI Tools',
          url: `ai-tools.html?tool=${encodeURIComponent(id)}`,
          dateAdded: t.dateAdded || t.date_added || '2026-05-01'
        });
      });
    }

    // 2. Creator Tools (20)
    if (typeof CREATOR_TOOLS_DATA !== 'undefined' && CREATOR_TOOLS_DATA) {
      Object.entries(CREATOR_TOOLS_DATA).forEach(([id, t]) => {
        unified.push({
          id: id,
          title: t.title || id,
          desc: t.desc || '',
          icon: t.icon || '⚡',
          category: 'Creator',
          url: id === 'ai-auto' ? 'ai-auto.html' : `creator-tools.html?tool=${encodeURIComponent(id)}`,
          dateAdded: t.dateAdded || t.date_added || '2026-05-15'
        });
      });
    }

    // 3. Media Converter Tools (60)
    if (typeof ALL_TOOL_CONFIGS !== 'undefined' && ALL_TOOL_CONFIGS) {
      Object.entries(ALL_TOOL_CONFIGS).forEach(([id, t]) => {
        unified.push({
          id: id,
          title: t.title || id,
          desc: t.desc || '',
          icon: t.icon || '🎵',
          category: 'Converters',
          url: `media-converter-tools.html?tool=${encodeURIComponent(id)}`,
          dateAdded: t.dateAdded || t.date_added || '2026-06-01'
        });
      });
    }

    // 4. Browser Utilities (89)
    if (typeof BU_TOOLS_CATALOG !== 'undefined' && Array.isArray(BU_TOOLS_CATALOG)) {
      BU_TOOLS_CATALOG.forEach(t => {
        let shortCat = 'Utilities';
        if (t.categoryName) {
          if (t.categoryName.includes('Text')) shortCat = 'Text';
          else if (t.categoryName.includes('Design') || t.categoryName.includes('Color')) shortCat = 'Design';
          else if (t.categoryName.includes('Developer') || t.categoryName.includes('Web')) shortCat = 'Developer';
          else if (t.categoryName.includes('Security') || t.categoryName.includes('Privacy')) shortCat = 'Security';
          else if (t.categoryName.includes('Productivity') || t.categoryName.includes('Calculators')) shortCat = 'Productivity';
          else if (t.categoryName.includes('Everyday')) shortCat = 'Everyday';
          else if (t.categoryName.includes('File')) shortCat = 'File Utilities';
          else if (t.categoryName.includes('Social')) shortCat = 'Social Media';
        }
        unified.push({
          id: t.id,
          title: t.name || t.id,
          desc: t.description || '',
          icon: t.icon || '🛠️',
          category: shortCat,
          url: `browser-utilities/${t.id}.html`,
          dateAdded: t.dateAdded || t.date_added || '2026-07-01'
        });
      });
    }

    unified.forEach(item => {
      if (!item.dateAdded) item.dateAdded = todayStr;
    });

    return unified;
  }

  // Curated popular fallback order for Featured Tools (Popular)
  // Ensures Popular section displays a diverse mix of high-demand tools before click data is logged
  const CURATED_POPULAR_IDS = [
    'youtube-script-writer',
    'word-counter',
    'image-format-converter',
    'viral-hooks-generator',
    'wifi-qr-code-generator',
    'json-formatter',
    'seo-title',
    'color-palette-generator',
    'video-to-audio',
    'hashtags',
    'unit-converter',
    'strong-password-generator',
    'url-encoder-decoder',
    'pdf-image-converter',
    'slug-url-generator',
    'text-case-converter'
  ];

  const popularRankMap = new Map();
  CURATED_POPULAR_IDS.forEach((id, index) => {
    popularRankMap.set(id, index);
  });

  // Automated Featured Tools (Popular) - Sorted by localStorage Click Count with Curated Popular Fallback
  function renderFeaturedTools() {
    if (!featuredGridEl) return;
    
    let clickCounts = {};
    try {
      if (window.mtvGetToolClickCounts) {
        clickCounts = window.mtvGetToolClickCounts();
      } else if (window.StorageManager && typeof window.StorageManager.getToolClicks === 'function') {
        clickCounts = window.StorageManager.getToolClicks();
      } else {
        const raw = localStorage.getItem('mtv_tool_clicks');
        clickCounts = raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      console.warn('Error fetching click counts for featured tools:', e);
      clickCounts = {};
    }

    const allTools = getUnifiedSiteTools();

    // Sort by click count descending; tie-break/fallback by curated popular rank
    allTools.sort((a, b) => {
      const clicksA = Number(clickCounts[a.id]) || 0;
      const clicksB = Number(clickCounts[b.id]) || 0;
      if (clicksA !== clicksB) {
        return clicksB - clicksA;
      }
      const rankA = popularRankMap.has(a.id) ? popularRankMap.get(a.id) : 999;
      const rankB = popularRankMap.has(b.id) ? popularRankMap.get(b.id) : 999;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.title.localeCompare(b.title);
    });

    const featured = allTools.slice(0, 8);

    featuredGridEl.innerHTML = featured.map((t) => `
      <a href="${t.url}" class="explore-tool-card" id="tool-${t.id}" aria-label="${escapeHtml(t.title)}">
        <div class="explore-tool-card-top">
          <div class="explore-tool-icon-box" aria-hidden="true">${t.icon}</div>
          <span class="explore-tool-category-badge">${escapeHtml(t.category)}</span>
        </div>
        <h3 class="explore-tool-card-title">${escapeHtml(t.title)}</h3>
        <p class="explore-tool-card-desc">${escapeHtml(t.desc)}</p>
        <div class="explore-tool-card-footer">
          <span>Launch Tool</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
    `).join('');
  }

  // Automated Latest Additions (New) - Sorted by dateAdded Descending
  function renderLatestTools() {
    if (!latestGridEl) return;

    const allTools = getUnifiedSiteTools();

    // Sort strictly by dateAdded descending (newest first)
    allTools.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime() || 0;
      const dateB = new Date(b.dateAdded).getTime() || 0;
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      return a.title.localeCompare(b.title);
    });

    const latest = allTools.slice(0, 8);

    latestGridEl.innerHTML = latest.map((t) => `
      <a href="${t.url}" class="explore-tool-card" id="tool-${t.id}" aria-label="${escapeHtml(t.title)}">
        <div class="explore-tool-card-top">
          <div class="explore-tool-icon-box" aria-hidden="true">${t.icon}</div>
          <span class="explore-tool-category-badge">${escapeHtml(t.category)}</span>
        </div>
        <h3 class="explore-tool-card-title">${escapeHtml(t.title)}</h3>
        <p class="explore-tool-card-desc">${escapeHtml(t.desc)}</p>
        <div class="explore-tool-card-footer">
          <span>Open Utility</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
    `).join('');
  }

  // 6. Discover All Tools (Dynamic aggregation of EVERY category across all 6 main sections)
  function buildAllCategories() {
    const list = [];

    // --- Section 1: AI Prompt Library (2 sub-categories) ---
    list.push({
      id: 'cat-ai-prompt-library',
      title: 'AI Image Prompt Library',
      count: `${promptsCount} Prompts`,
      desc: 'Curated formulas, creative styles, anime, cinematic, and photorealistic prompt guides.',
      icon: '✨',
      url: 'ai-prompt.html',
      accent: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.08)',
      border: 'rgba(124, 58, 237, 0.2)'
    });
    list.push({
      id: 'cat-ai-image-generators',
      title: 'AI Image Generators',
      count: '8 Generators',
      desc: 'Directory of top free generative models: Midjourney, DALL-E, Stable Diffusion, Flux & more.',
      icon: '🖼️',
      url: 'ai-prompt.html#ai-image-tools-section',
      accent: '#9333EA',
      bg: 'rgba(147, 51, 234, 0.08)',
      border: 'rgba(147, 51, 234, 0.2)'
    });

    // --- Section 2: AI Tools (All 6 core categories) ---
    const aiCategoryMeta = [
      { id: 'video', title: 'Video & Scripting AI', desc: 'YouTube scriptwriters, viral hooks, title hooks, video outlines, and storyboard generators.', icon: '🎬', accent: '#059669', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.2)' },
      { id: 'social', title: 'Social & Growth AI', desc: 'Tweet thread creators, LinkedIn posts, TikTok captions, and social growth optimizers.', icon: '📈', accent: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
      { id: 'copywriting', title: 'Copywriting & Sales AI', desc: 'Ad copy generators, landing page headlines, cold email outreach, and sales formulas.', icon: '✍️', accent: '#14B8A6', bg: 'rgba(20, 184, 166, 0.08)', border: 'rgba(20, 184, 166, 0.2)' },
      { id: 'creative', title: 'Creative & Narrative AI', desc: 'Story plot generators, character backstories, dialogue writers, and creative worldbuilding.', icon: '🎨', accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)' },
      { id: 'seo', title: 'SEO & Discovery AI', desc: 'Meta tag optimizers, keyword clustering engines, FAQ schema, and search snippet tools.', icon: '🔍', accent: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)' },
      { id: 'technical', title: 'Technical & Code AI', desc: 'Regex builders, SQL query writers, code explainers, Git command helpers, and syntax tools.', icon: '💻', accent: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)' }
    ];

    aiCategoryMeta.forEach(cat => {
      let count = 10;
      if (AI_TOOLS_DATA && typeof AI_TOOLS_DATA === 'object') {
        const matching = Object.values(AI_TOOLS_DATA).filter(t => t && t.category === cat.id);
        if (matching.length > 0) count = matching.length;
      }
      list.push({
        id: `cat-ai-${cat.id}`,
        title: cat.title,
        count: `${count} AI Tools`,
        desc: cat.desc,
        icon: cat.icon,
        url: `ai-tools.html?category=${cat.id}`,
        accent: cat.accent,
        bg: cat.bg,
        border: cat.border
      });
    });

    // --- Section 3: Creator Tools (All categories) ---
    const creatorCategoriesMeta = [
      { id: 'seo', title: 'SEO & Metadata', desc: 'Keyword research, platform hashtag sets, video tags, and search description builders.', icon: '🔑', accent: '#EA580C', bg: 'rgba(234, 88, 12, 0.08)', border: 'rgba(234, 88, 12, 0.2)', count: 5 },
      { id: 'titles', title: 'Titles & CTR', desc: 'High-converting video titles, clickable headlines, thumbnail copy, and emotional scoring.', icon: '📝', accent: '#F97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.2)', count: 4 },
      { id: 'writing', title: 'Writing & Scripting', desc: 'Video hook generators, retention outlines, description builders, and content repurposing.', icon: '📜', accent: '#E11D48', bg: 'rgba(225, 29, 72, 0.08)', border: 'rgba(225, 29, 72, 0.2)', count: 5 },
      { id: 'strategy', title: 'Ideation & Strategy', desc: 'AI Auto workflow generator, viral video ideas, content calendar planner, and title A/B testing.', icon: '⚡', accent: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.2)', count: 6 }
    ];

    creatorCategoriesMeta.forEach(cat => {
      let count = cat.count;
      if (CREATOR_TOOLS_DATA && typeof CREATOR_TOOLS_DATA === 'object') {
        const matching = Object.values(CREATOR_TOOLS_DATA).filter(t => t && (t.category === cat.id || (cat.id === 'strategy' && t.category === 'ideation-planning') || (cat.id === 'seo' && t.category === 'seo-metadata') || (cat.id === 'titles' && t.category === 'titles-ctr') || (cat.id === 'writing' && (t.category === 'scripting-hooks' || t.category === 'writing-polish'))));
        if (matching.length > 0) count = matching.length;
      }
      list.push({
        id: `cat-creator-${cat.id}`,
        title: `${cat.title} Tools`,
        count: `${count} Tools`,
        desc: cat.desc,
        icon: cat.icon,
        url: `creator-tools.html?category=${cat.id}`,
        accent: cat.accent,
        bg: cat.bg,
        border: cat.border
      });
    });

    // --- Section 4: Media Converter Tools (Image, Video, Audio, PDF & Documents) ---
    const mediaCategoriesMeta = [
      { id: 'image', title: 'Image Converters', desc: 'Convert WebP, PNG, JPG, SVG, AVIF, compress image files, crop, resize, and remove EXIF.', icon: '🖼️', accent: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', border: 'rgba(37, 99, 235, 0.2)', fallbackCount: 19 },
      { id: 'video', title: 'Video Converters', desc: 'Convert MP4, WebM, MOV, extract audio, create GIFs, trim clips, and compress video.', icon: '🎥', accent: '#4F46E5', bg: 'rgba(79, 70, 229, 0.08)', border: 'rgba(79, 70, 229, 0.2)', fallbackCount: 15 },
      { id: 'audio', title: 'Audio Converters', desc: 'Convert MP3, WAV, OGG, AAC, FLAC, trim audio, adjust bitrate, and normalize volume.', icon: '🎵', accent: '#7C3AED', bg: 'rgba(124, 58, 237, 0.08)', border: 'rgba(124, 58, 237, 0.2)', fallbackCount: 15 },
      { id: 'pdf-document', title: 'PDF & Documents', desc: 'Merge PDFs, split pages, convert PDF to images, compress files, and extract clean text.', icon: '📄', accent: '#0284C7', bg: 'rgba(2, 132, 199, 0.08)', border: 'rgba(2, 132, 199, 0.2)', fallbackCount: 11 }
    ];

    mediaCategoriesMeta.forEach(cat => {
      let count = cat.fallbackCount;
      if (ALL_TOOL_CONFIGS && typeof ALL_TOOL_CONFIGS === 'object') {
        const matching = Object.values(ALL_TOOL_CONFIGS).filter(t => t && (t.category === cat.id || (cat.id === 'pdf-document' && (t.category === 'pdf' || t.category === 'document'))));
        if (matching.length > 0) count = matching.length;
      }
      list.push({
        id: `cat-media-${cat.id}`,
        title: cat.title,
        count: `${count} Converters`,
        desc: cat.desc,
        icon: cat.icon,
        url: `media-converter-tools.html?category=${cat.id}`,
        accent: cat.accent,
        bg: cat.bg,
        border: cat.border
      });
    });

    // --- Section 5: Browser Utilities (All 15 Categories) ---
    const buPalette = [
      { accent: '#E11D48', bg: 'rgba(225, 29, 72, 0.08)', border: 'rgba(225, 29, 72, 0.2)' },
      { accent: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', border: 'rgba(37, 99, 235, 0.2)' },
      { accent: '#9333EA', bg: 'rgba(147, 51, 234, 0.08)', border: 'rgba(147, 51, 234, 0.2)' },
      { accent: '#EC4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)' },
      { accent: '#0284C7', bg: 'rgba(2, 132, 199, 0.08)', border: 'rgba(2, 132, 199, 0.2)' },
      { accent: '#059669', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.2)' },
      { accent: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)' },
      { accent: '#0D9488', bg: 'rgba(13, 148, 136, 0.08)', border: 'rgba(13, 148, 136, 0.2)' },
      { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
      { accent: '#F43F5E', bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.2)' },
      { accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)' },
      { accent: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
      { accent: '#6366F1', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)' },
      { accent: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.2)' },
      { accent: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.08)', border: 'rgba(14, 165, 233, 0.2)' }
    ];

    if (Array.isArray(BU_CATEGORIES)) {
      BU_CATEGORIES.forEach((cat, index) => {
        const pal = buPalette[index % buPalette.length];
        const count = cat.tools ? cat.tools.length : (cat.toolCount || 6);
        list.push({
          id: `cat-bu-${cat.id}`,
          title: cat.name,
          count: `${count} Tools`,
          desc: cat.desc || 'Fast in-browser utilities running 100% client-side with zero data tracking.',
          icon: cat.icon || '🛠️',
          url: `browser-utilities/${cat.filename}`,
          accent: pal.accent,
          bg: pal.bg,
          border: pal.border
        });
      });
    }

    // --- Section 6: Platforms (All platform categories) ---
    const platformCategoriesMeta = [
      { id: 'video-streaming', filter: 'Video & Streaming', title: 'Video & Streaming Platforms', desc: 'Multi-stream embed gateways and link analyzers for YouTube, Dailymotion, Bilibili, and Loom.', icon: '▶️', accent: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.2)' },
      { id: 'social-media', filter: 'Social Media', title: 'Social Media Platforms', desc: 'Broadcast previews and embeds for Facebook, Instagram, Threads, X (Twitter), and LinkedIn.', icon: '💬', accent: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', border: 'rgba(37, 99, 235, 0.2)' },
      { id: 'short-form-video', filter: 'Short-Form Video', title: 'Short-Form Video Platforms', desc: 'Vertical video players and sharing hubs for TikTok, Snapchat, Josh, and Moj.', icon: '📱', accent: '#EC4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)' },
      { id: 'audio-podcasts', filter: 'Audio & Podcasts', title: 'Audio & Podcasts Platforms', desc: 'Audio embeds and track players for Spotify, SoundCloud, Mixcloud, and Podbean.', icon: '🎧', accent: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
      { id: 'live-broadcasts', filter: 'Live Broadcasts', title: 'Live Broadcasts Platforms', desc: 'Live streaming channels and creator stream viewers for Twitch, Kick, DLive, and Trovo.', icon: '👾', accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)' },
      { id: 'creative-video', filter: 'Creative Video', title: 'Creative & Open Media', desc: 'Open-source and creative hubs for Vimeo, Reddit, Pinterest, Odysee, and PeerTube.', icon: '🚀', accent: '#F97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.2)' }
    ];

    platformCategoriesMeta.forEach(cat => {
      let count = 6;
      if (PLATFORM_CONFIG && typeof PLATFORM_CONFIG === 'object') {
        const matching = Object.values(PLATFORM_CONFIG).filter(p => p && p.category === cat.filter);
        if (matching.length > 0) count = matching.length;
      }
      list.push({
        id: `cat-platform-${cat.id}`,
        title: cat.title,
        count: `${count} Platforms`,
        desc: cat.desc,
        icon: cat.icon,
        url: `platforms.html?category=${encodeURIComponent(cat.id)}`,
        accent: cat.accent,
        bg: cat.bg,
        border: cat.border
      });
    });

    return list;
  }

  function renderCategories() {
    if (!categoriesGridEl) return;
    const allCategories = buildAllCategories();
    
    // Update category count pill if present
    const catCountPillEl = document.getElementById('categories-count-pill');
    if (catCountPillEl) {
      catCountPillEl.textContent = `${allCategories.length} Categories`;
    }

    categoriesGridEl.innerHTML = allCategories.map((c) => `
      <a 
        href="${c.url}" 
        class="explore-category-card" 
        id="${c.id}" 
        style="--cat-accent: ${c.accent}; --cat-bg: ${c.bg}; --cat-border: ${c.border};"
        aria-label="${escapeHtml(c.title)} — ${escapeHtml(c.count)}"
      >
        <div class="explore-category-card-top">
          <div class="explore-category-icon-box" aria-hidden="true">${c.icon}</div>
          <span class="explore-category-count-badge">${escapeHtml(c.count)}</span>
        </div>
        <h3 class="explore-category-card-title">${escapeHtml(c.title)}</h3>
        <p class="explore-category-card-desc">${escapeHtml(c.desc)}</p>
        <div class="explore-category-card-footer">
          <span>Browse Category</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
    `).join('');
  }

  // 7. Optionally fetch live prompt feed count if available
  fetch(`/api/prompt-feed?_t=${Date.now()}`, { cache: 'no-cache' })
    .then((res) => {
      if (res.ok) return res.json();
      return null;
    })
    .then((data) => {
      if (data && Array.isArray(data.prompts) && data.prompts.length > 0) {
        const livePromptCount = `${data.prompts.length}+`;
        const promptEl = document.getElementById('count-ai-prompt-val');
        if (promptEl) {
          promptEl.textContent = livePromptCount;
        }
      }
    })
    .catch(() => {
      // Graceful fallback to initial 370+
    });

  // 8. Smooth Scroll Reveal Animations
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '60px 0px 60px 0px'
    });

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight + 100) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // Initial renders
  renderMainCards();
  renderFeaturedTools();
  renderLatestTools();
  renderCategories();
  initScrollReveal();
});
