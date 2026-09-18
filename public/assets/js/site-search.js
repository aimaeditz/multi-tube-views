/**
 * Multi Tube Views (MTV) — Ultimate Premium Site-Wide Search Engine
 * 100% Client-Side Fuzzy Search across 420+ Tools, Converters & Platforms.
 * Powered by Fuse.js with category-aware related suggestions.
 * Non-blocking, deferred initialization prevents render delay on page load.
 */

(function initSiteSearch() {
  'use strict';

  // --- Category Display Mapping & Helpers ---
  const AI_CATEGORY_NAMES = {
    'voice': 'Voice & Speech',
    'video': 'Video & Scripting',
    'social': 'Social & Growth',
    'copywriting': 'Copywriting & Sales',
    'creative': 'Creative & Narrative',
    'seo': 'SEO & Discovery',
    'technical': 'Technical & Code'
  };

  const MEDIA_CATEGORY_NAMES = {
    'video': 'Video Converters',
    'audio': 'Audio Tools',
    'image': 'Image Utilities',
    'pdf-document': 'PDF & Documents'
  };

  // State & Deferred Search Engine
  let fuse = null;
  const searchIndex = [];
  let isEngineLoading = false;
  let engineReadyCallbacks = [];

  function buildSearchIndex(CREATOR_TOOLS_DATA, AI_TOOLS_DATA, ALL_TOOL_CONFIGS, BU_CATEGORIES, BU_TOOLS_CATALOG, PLATFORM_CONFIG) {
    if (searchIndex.length > 0) return searchIndex;

    // 1. Creator Tools (20 tools)
    if (CREATOR_TOOLS_DATA && typeof CREATOR_TOOLS_DATA === 'object') {
      Object.entries(CREATOR_TOOLS_DATA).forEach(([id, tool]) => {
        searchIndex.push({
          id: `creator-${id}`,
          rawId: id,
          title: tool.title || id,
          desc: tool.desc || '',
          icon: tool.icon || '⚡',
          group: 'Creator Tools',
          category: 'Creator Studio',
          categoryId: 'creator-tools',
          categoryLabel: 'Creator Tool',
          badgeClass: 'badge-creator',
          url: id === 'ai-auto' ? 'ai-auto.html' : `creator-tools.html?tool=${encodeURIComponent(id)}`,
          keywords: `${tool.title || ''} ${tool.desc || ''} ${id} creator youtube viral tags seo script prompt`.toLowerCase()
        });
      });
    }

    // 2. AI Tools (210 tools)
    if (AI_TOOLS_DATA && typeof AI_TOOLS_DATA === 'object') {
      Object.entries(AI_TOOLS_DATA).forEach(([id, tool]) => {
        const catKey = tool.category || 'video';
        const catName = AI_CATEGORY_NAMES[catKey] || catKey;
        searchIndex.push({
          id: `ai-${id}`,
          rawId: id,
          title: tool.title || id,
          desc: tool.desc || '',
          icon: tool.icon || '🤖',
          group: 'AI Tools',
          category: `AI · ${catName}`,
          categoryId: `ai-${catKey}`,
          categoryLabel: 'AI Tool',
          badgeClass: 'badge-ai',
          url: `ai-tools.html?tool=${encodeURIComponent(id)}`,
          keywords: `${tool.title || ''} ${tool.desc || ''} ${id} ${catKey} ai generator mtv writing creator prompt`.toLowerCase()
        });
      });
    }

    // 3. Media Converter Tools (73 tools)
    if (ALL_TOOL_CONFIGS && typeof ALL_TOOL_CONFIGS === 'object') {
      Object.entries(ALL_TOOL_CONFIGS).forEach(([id, tool]) => {
        const catKey = tool.category || 'video';
        const catName = MEDIA_CATEGORY_NAMES[catKey] || catKey;
        let mediaKeywords = `converter ${catKey} ${id} `;
        if (catKey === 'audio' || id.includes('audio') || id.includes('video-to-audio')) {
          mediaKeywords += 'mp3 wav audio sound music extract voice volume trim ';
        }
        if (catKey === 'video' || id.includes('video')) {
          mediaKeywords += 'mp4 video movie clip webm format record screen ';
        }
        if (catKey === 'image' || id.includes('image')) {
          mediaKeywords += 'image photo picture png jpg webp svg gif ';
        }
        if (catKey === 'pdf-document' || id.includes('pdf')) {
          mediaKeywords += 'pdf document file merge split page markdown ';
        }
        searchIndex.push({
          id: `media-${id}`,
          rawId: id,
          title: tool.title || id,
          desc: tool.desc || tool.about || '',
          icon: tool.icon || '🔄',
          group: 'Media Converters',
          category: `Media · ${catName}`,
          categoryId: `media-${catKey}`,
          categoryLabel: 'Converter',
          badgeClass: 'badge-media',
          url: `media-converter-tools.html?tool=${encodeURIComponent(id)}`,
          keywords: `${tool.title || ''} ${tool.desc || ''} ${tool.about || ''} ${mediaKeywords}`.toLowerCase()
        });
      });
    }

    // 4. Browser Utilities (89 tools)
    if (Array.isArray(BU_TOOLS_CATALOG) && BU_TOOLS_CATALOG.length > 0) {
      BU_TOOLS_CATALOG.forEach(tool => {
        searchIndex.push({
          id: `bu-${tool.id}`,
          rawId: tool.id,
          title: tool.name || tool.id,
          desc: tool.description || '',
          icon: tool.icon || '🛠️',
          group: 'Browser Utilities',
          category: `Utility · ${tool.categoryName || 'Browser'}`,
          categoryId: `bu-${tool.categoryId}`,
          categoryLabel: 'Utility',
          badgeClass: 'badge-bu',
          url: `browser-utilities/${encodeURIComponent(tool.id)}.html`,
          keywords: `browser client utility offline privacy ${tool.keywords || ''} ${tool.id}`
        });
      });
    } else if (Array.isArray(BU_CATEGORIES)) {
      // Fallback if catalog not loaded
      BU_CATEGORIES.forEach(cat => {
        (cat.tools || []).forEach(toolId => {
          const readable = toolId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          searchIndex.push({
            id: `bu-${toolId}`,
            rawId: toolId,
            title: readable,
            desc: cat.desc || '',
            icon: cat.icon || '🛠️',
            group: 'Browser Utilities',
            category: `Utility · ${cat.name}`,
            categoryId: `bu-${cat.id}`,
            categoryLabel: 'Utility',
            badgeClass: 'badge-bu',
            url: `browser-utilities/${encodeURIComponent(toolId)}.html`,
            keywords: `browser client utility offline ${toolId}`
          });
        });
      });
    }

    // 5. Media Platforms (40 platforms)
    if (PLATFORM_CONFIG && typeof PLATFORM_CONFIG === 'object') {
      Object.entries(PLATFORM_CONFIG).forEach(([id, p]) => {
        const typesStr = Array.isArray(p.supportedTypes) ? p.supportedTypes.join(' ') : '';
        searchIndex.push({
          id: `platform-${id}`,
          rawId: id,
          title: p.name || id,
          desc: p.description || '',
          icon: p.icon || '▶',
          group: 'Platforms',
          category: `Platform · ${p.category || 'Streaming'}`,
          categoryId: `platform-${(p.category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          categoryLabel: 'Platform',
          badgeClass: 'badge-platform',
          url: `platforms/${encodeURIComponent(id)}.html`,
          keywords: `platform stream player live video audio ${p.officialDomain || ''} ${typesStr} ${id}`
        });
      });
    }

    // 6. Core Site Hubs & Key Navigation Pages
    const CORE_PAGES = [
      {
        id: 'page-ai-prompt',
        title: 'AI Prompt Library',
        desc: '1,000+ ready-to-run copy-paste prompts organized across 10 specialized creator categories.',
        icon: '✨',
        category: 'Explore · AI Prompts',
        categoryId: 'pages-core',
        url: 'ai-prompt.html',
        keywords: 'prompts library chatgpt claude midjourney dalle gemini copy paste'
      },
      {
        id: 'page-articles',
        title: 'Creator Articles & Strategy',
        desc: 'In-depth workflows, video SEO tactics, and multimedia streaming documentation.',
        icon: '📚',
        category: 'Explore · Articles',
        categoryId: 'pages-core',
        url: 'articles.html',
        keywords: 'articles guides tutorials documentation blog'
      },
      {
        id: 'page-platforms-hub',
        title: 'Platform Directory Hub',
        desc: 'Unified multi-screen monitoring and custom player workspaces across 40 platforms.',
        icon: '🌐',
        category: 'Explore · Platforms',
        categoryId: 'pages-core',
        url: 'platforms.html',
        keywords: 'platforms multi view streaming youtube twitch kick live'
      },
      {
        id: 'page-browser-utilities-hub',
        title: 'Browser Utilities Hub',
        desc: '89 zero-server, offline-capable browser utilities for text, data, dev, and everyday tasks.',
        icon: '🧰',
        category: 'Explore · Utilities',
        categoryId: 'pages-core',
        url: 'browser-utilities.html',
        keywords: 'utilities tools converter offline private local browser'
      }
    ];

    CORE_PAGES.forEach(pg => {
      searchIndex.push({
        id: pg.id,
        rawId: pg.id,
        title: pg.title,
        desc: pg.desc,
        icon: pg.icon,
        group: 'Core Hubs',
        category: pg.category,
        categoryId: pg.categoryId,
        categoryLabel: 'Hub',
        badgeClass: 'badge-hub',
        url: pg.url,
        keywords: pg.keywords
      });
    });

    return searchIndex;
  }

  async function ensureSearchEngine() {
    if (fuse) return fuse;
    if (isEngineLoading) {
      return new Promise(resolve => engineReadyCallbacks.push(resolve));
    }
    isEngineLoading = true;

    try {
      const [
        { default: Fuse },
        { CREATOR_TOOLS_DATA },
        { AI_TOOLS_DATA },
        { ALL_TOOL_CONFIGS },
        { BU_CATEGORIES, BU_TOOLS_CATALOG },
        { PLATFORM_CONFIG }
      ] = await Promise.all([
        import('./vendor/fuse.min.mjs'),
        import('../data/creator-tools-data.js'),
        import('../data/ai-tools-data.js'),
        import('./media-tools-data.js'),
        import('../data/browser-utilities-data.js'),
        import('./platform-engine.js')
      ]);

      buildSearchIndex(CREATOR_TOOLS_DATA, AI_TOOLS_DATA, ALL_TOOL_CONFIGS, BU_CATEGORIES, BU_TOOLS_CATALOG, PLATFORM_CONFIG);

      fuse = new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 0.45 },
          { name: 'keywords', weight: 0.30 },
          { name: 'category', weight: 0.15 },
          { name: 'desc', weight: 0.10 }
        ],
        threshold: 0.28,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true
      });

      isEngineLoading = false;
      engineReadyCallbacks.forEach(cb => cb(fuse));
      engineReadyCallbacks = [];
      return fuse;
    } catch (err) {
      console.error('Error loading search engine:', err);
      isEngineLoading = false;
      return null;
    }
  }

  // DOM Elements Cache
  let triggerBtn = null;
  let overlay = null;
  let backdrop = null;
  let palette = null;
  let dropdownPanel = null;
  let searchInput = null;
  let clearBtn = null;
  let closeBtn = null;
  let countPill = null;
  let emptyState = null;
  let noResults = null;
  let resultsContent = null;
  let matchesGrid = null;
  let matchesCount = null;
  let relatedSection = null;
  let relatedGrid = null;
  let relatedCategoryName = null;
  let activeIndex = -1;
  let currentNavigableCards = [];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openSearch(initialQuery = '') {
    ensureSearchEngine();

    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mtv-search-open');

    if (searchInput) {
      if (initialQuery) {
        searchInput.value = initialQuery;
        handleSearchInput(initialQuery);
      } else {
        // Clean empty overlay state: show ONLY the search input bar itself (no dropdown panel)
        searchInput.value = '';
        renderEmptyState();
      }
      // Fluid non-blocking focus preventing browser layout jump during animation
      requestAnimationFrame(() => {
        try {
          searchInput.focus({ preventScroll: true });
        } catch {
          searchInput.focus();
        }
        if (initialQuery) {
          searchInput.select();
        }
      });
    }
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mtv-search-open');
    activeIndex = -1;
    currentNavigableCards = [];

    // Return focus to hero search trigger
    if (triggerBtn) {
      triggerBtn.focus();
    }
  }

  function renderEmptyState() {
    // When overlay first opens (before typing), show ONLY the search input bar itself!
    // No empty box, panel, or container below it.
    if (dropdownPanel) dropdownPanel.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (resultsContent) resultsContent.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
    if (countPill) countPill.style.display = 'none';
    if (matchesGrid) matchesGrid.innerHTML = '';
    if (relatedGrid) relatedGrid.innerHTML = '';
    currentNavigableCards = [];
    activeIndex = -1;
  }

  function renderCard(item, isRelated = false) {
    const isMobile = window.innerWidth <= 768;
    
    // On mobile: compact card layout for 3-4 column grid
    if (isMobile) {
      return `
        <a href="${escapeHtml(item.url)}" class="mtv-search-card ${isRelated ? 'mtv-card-related' : ''}" data-url="${escapeHtml(item.url)}" role="option" tabindex="-1">
          <div class="mtv-card-icon-wrap" aria-hidden="true">
            <span class="mtv-card-icon">${item.icon}</span>
          </div>
          <div class="mtv-card-info">
            <span class="mtv-card-badge ${item.badgeClass}">${escapeHtml(item.categoryLabel)}</span>
            <h4 class="mtv-card-title">${escapeHtml(item.title)}</h4>
          </div>
        </a>
      `;
    }

    // On desktop: rich spotlight card layout
    return `
      <a href="${escapeHtml(item.url)}" class="mtv-search-card ${isRelated ? 'mtv-card-related' : ''}" data-url="${escapeHtml(item.url)}" role="option" tabindex="-1">
        <div class="mtv-card-icon-wrap" aria-hidden="true">
          <span class="mtv-card-icon">${item.icon}</span>
        </div>
        <div class="mtv-card-info">
          <div class="mtv-card-header-row">
            <h4 class="mtv-card-title">${escapeHtml(item.title)}</h4>
            <span class="mtv-card-badge ${item.badgeClass}">${escapeHtml(item.categoryLabel)}</span>
          </div>
          <p class="mtv-card-desc">${escapeHtml(item.desc)}</p>
          <div class="mtv-card-footer-row">
            <span class="mtv-card-category">${escapeHtml(item.category)}</span>
            <span class="mtv-card-action">
              <span>Open</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </span>
          </div>
        </div>
      </a>
    `;
  }

  async function handleSearchInput(rawVal) {
    const query = (rawVal || '').trim();

    if (!query) {
      renderEmptyState();
      return;
    }

    if (clearBtn) clearBtn.style.display = 'inline-flex';
    if (emptyState) emptyState.style.display = 'none';

    // Ensure search engine is ready
    const searcher = fuse || await ensureSearchEngine();
    if (!searcher) return;

    // Guard against stale query if user kept typing while loading
    if (searchInput && searchInput.value.trim() !== query) {
      return;
    }

    // Perform Fuzzy Search
    const fuseResults = searcher.search(query);

    // Reveal dropdown results panel smoothly
    if (dropdownPanel) dropdownPanel.style.display = 'flex';

    if (fuseResults.length === 0) {
      // No matches found
      if (resultsContent) resultsContent.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      if (countPill) {
        countPill.style.display = 'inline-flex';
        countPill.textContent = '0 results';
      }
      currentNavigableCards = [];
      activeIndex = -1;
      return;
    }

    if (noResults) noResults.style.display = 'none';
    if (resultsContent) resultsContent.style.display = 'block';

    // Limit top matches to best 12 results for crisp responsiveness
    const topMatches = fuseResults.slice(0, 14).map(res => res.item);

    if (countPill) {
      countPill.style.display = 'inline-flex';
      countPill.textContent = `${fuseResults.length} ${fuseResults.length === 1 ? 'match' : 'matches'}`;
    }

    if (matchesCount) {
      matchesCount.textContent = `${topMatches.length} shown of ${fuseResults.length}`;
    }

    // Render Matching Tools Grid
    if (matchesGrid) {
      matchesGrid.innerHTML = topMatches.map(item => renderCard(item, false)).join('');
    }

    // Requirement:
    // "Other tools from the SAME category as the top match, shown as related suggestions in a card/category-box style"
    const topMatch = topMatches[0];
    const topCategoryId = topMatch.categoryId;
    const topCategoryTitle = topMatch.category || topMatch.group;

    // Find all other tools in the index sharing this category that are NOT already in topMatches
    const topMatchIds = new Set(topMatches.map(m => m.id));
    const relatedItems = searchIndex.filter(it => 
      it.categoryId === topCategoryId && 
      !topMatchIds.has(it.id) &&
      it.id !== topMatch.id
    ).slice(0, 8); // Display up to 8 category peers

    if (relatedSection && relatedGrid) {
      if (relatedItems.length > 0) {
        relatedSection.style.display = 'block';
        if (relatedCategoryName) {
          relatedCategoryName.textContent = topCategoryTitle;
        }
        relatedGrid.innerHTML = relatedItems.map(item => renderCard(item, true)).join('');
      } else {
        relatedSection.style.display = 'none';
        relatedGrid.innerHTML = '';
      }
    }

    // Update keyboard navigable elements
    updateNavigableCards();
  }

  function updateNavigableCards() {
    if (!palette) return;
    currentNavigableCards = Array.from(palette.querySelectorAll('.mtv-search-card'));
    activeIndex = -1;
  }

  function highlightCard(index) {
    currentNavigableCards.forEach((c, idx) => {
      if (idx === index) {
        c.classList.add('mtv-card-focused');
        c.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        c.classList.remove('mtv-card-focused');
      }
    });
  }

  // Keyboard navigation
  function handleKeyDown(e) {
    if (!overlay || !overlay.classList.contains('active')) {
      // Global shortcut: ⌘K or Ctrl+K or / (when not focused in an input)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || 
          (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName))) {
        e.preventDefault();
        openSearch();
      }
      return;
    }

    // When overlay is active:
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (currentNavigableCards.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % currentNavigableCards.length;
      highlightCard(activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + currentNavigableCards.length) % currentNavigableCards.length;
      highlightCard(activeIndex);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < currentNavigableCards.length) {
        e.preventDefault();
        const activeCard = currentNavigableCards[activeIndex];
        const url = activeCard.getAttribute('data-url');
        if (url) {
          window.location.href = url;
        }
      }
    }
  }

  function setupDOM() {
    triggerBtn = document.getElementById('hero-search-trigger');
    overlay = document.getElementById('mtv-search-overlay');
    backdrop = document.getElementById('mtv-search-backdrop');
    palette = document.getElementById('mtv-search-palette');
    dropdownPanel = document.getElementById('mtv-search-dropdown-panel');
    searchInput = document.getElementById('mtv-search-input');
    clearBtn = document.getElementById('mtv-search-clear-btn');
    closeBtn = document.getElementById('mtv-search-close-btn');
    countPill = document.getElementById('mtv-search-count-pill');
    emptyState = document.getElementById('mtv-search-empty-state');
    noResults = document.getElementById('mtv-search-no-results');
    resultsContent = document.getElementById('mtv-search-results');
    matchesGrid = document.getElementById('mtv-matches-grid');
    matchesCount = document.getElementById('mtv-matches-count');
    relatedSection = document.getElementById('mtv-section-related');
    relatedGrid = document.getElementById('mtv-related-grid');
    relatedCategoryName = document.getElementById('mtv-related-category-name');

    // Trigger click/focus listener in Hero
    if (triggerBtn) {
      triggerBtn.addEventListener('mouseenter', () => ensureSearchEngine(), { once: true, passive: true });
      triggerBtn.addEventListener('touchstart', () => ensureSearchEngine(), { once: true, passive: true });
      triggerBtn.addEventListener('focusin', () => ensureSearchEngine(), { once: true, passive: true });

      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
      triggerBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSearch();
        }
      });
    }

    // Idle non-blocking warmup of search engine after initial page render
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => ensureSearchEngine(), { timeout: 2000 });
      } else {
        setTimeout(() => ensureSearchEngine(), 800);
      }
    }

    // Search Input listeners
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handleSearchInput(e.target.value);
      });
    }

    // Clear Button
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        renderEmptyState();
      });
    }

    // Close Button & Backdrop click
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSearch();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeSearch();
      });
    }

    // Suggestion chips in "empty state" and "no results"
    [emptyState, noResults].forEach(container => {
      if (container) {
        container.addEventListener('click', (e) => {
          const chip = e.target.closest('.mtv-suggestion-chip');
          if (chip && searchInput) {
            e.preventDefault();
            const val = chip.textContent.trim();
            searchInput.value = val;
            handleSearchInput(val);
            try {
              searchInput.focus({ preventScroll: true });
            } catch {
              searchInput.focus();
            }
          }
        });
      }
    });

    // Global Key Listener
    window.addEventListener('keydown', handleKeyDown);

    // Responsive resize listener to update card density if window changes
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (searchInput && searchInput.value.trim()) {
          handleSearchInput(searchInput.value.trim());
        }
      }, 150);
    });

    // Expose API for external triggers if needed
    window.MTV_SEARCH = {
      open: openSearch,
      close: closeSearch,
      getIndex: () => searchIndex
    };
  }

  // Run on DOMContentLoaded or immediately if ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDOM);
  } else {
    setupDOM();
  }
})();
