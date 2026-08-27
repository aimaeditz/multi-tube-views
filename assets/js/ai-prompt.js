/**
 * Multi Tube Views (MTV) — AI Prompt Engine (Client)
 * Content source: Strictly https://aipromptxpert.blogspot.com/feeds/posts/default?alt=rss
 * Fully compatible with GitHub Pages, custom domains, static hosting, and full-stack Node.
 */

(function () {
  'use strict';

  // Constants
  const BLOGGER_BASE_URL = 'https://aipromptxpert.blogspot.com';
  const RSS_FEED_URL = `${BLOGGER_BASE_URL}/feeds/posts/default?alt=rss`;
  const JSON_FEED_URL = `${BLOGGER_BASE_URL}/feeds/posts/default?alt=json`;
  const LOCAL_CACHE_KEY = 'mtv_ai_prompt_library_cache_v2';
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache validity

  // State
  let allPrompts = [];
  let categories = [];
  let activeCategory = 'All';
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 24;
  let isLoading = false;
  let hasMore = true;

  // DOM Elements
  let gridContainer = null;
  let categoryPillsContainer = null;
  let searchInput = null;
  let searchClearBtn = null;
  let countSummaryEl = null;
  let loadMoreBtn = null;
  let emptyStateEl = null;
  let detailModal = null;
  let toastEl = null;

  document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
    loadPromptLibrary();
  });

  function initElements() {
    gridContainer = document.getElementById('prompt-grid');
    categoryPillsContainer = document.getElementById('category-pills');
    searchInput = document.getElementById('prompt-search-input');
    searchClearBtn = document.getElementById('prompt-search-clear');
    countSummaryEl = document.getElementById('prompt-count-summary');
    loadMoreBtn = document.getElementById('load-more-btn');
    emptyStateEl = document.getElementById('prompt-empty-state');
    detailModal = document.getElementById('prompt-detail-modal');
    toastEl = document.getElementById('copy-toast');
  }

  function initEventListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').trim();
        if (searchClearBtn) {
          searchClearBtn.style.display = searchQuery ? 'flex' : 'none';
        }
        currentPage = 1;
        renderLibrary();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          searchClearBtn.style.display = 'none';
          searchInput.focus();
        }
        currentPage = 1;
        renderLibrary();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderCards(true);
      });
    }

    // Modal Close handlers
    if (detailModal) {
      const closeBtn = detailModal.querySelector('.modal-close-btn');
      const backdrop = detailModal.querySelector('.modal-backdrop');

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }
      if (backdrop) {
        backdrop.addEventListener('click', closeModal);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModal.classList.contains('active')) {
          closeModal();
        }
      });
    }

    // Global copy & view delegation for cards
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.btn-copy-prompt');
      if (copyBtn) {
        e.preventDefault();
        e.stopPropagation();
        const promptId = copyBtn.getAttribute('data-prompt-id');
        const promptRecord = allPrompts.find(p => p.id === promptId);
        if (promptRecord && promptRecord.promptText) {
          copyPromptToClipboard(promptRecord.promptText, copyBtn);
        }
      }

      const viewBtn = e.target.closest('.btn-view-prompt');
      if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const promptId = viewBtn.getAttribute('data-prompt-id');
        const promptRecord = allPrompts.find(p => p.id === promptId);
        if (promptRecord) {
          openDetailModal(promptRecord);
        }
      }
    });
  }

  // Helper to resolve possible asset paths for static hosting & subpaths
  function getCandidateAssetUrls() {
    const candidates = [];
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const dir = pathname.substring(0, pathname.lastIndexOf('/') + 1);

    // 1. Current directory relative
    candidates.push('assets/data/ai-prompts.json');
    candidates.push('./assets/data/ai-prompts.json');
    
    // 2. Computed relative to current directory path
    if (origin && origin !== 'null') {
      try {
        const fullRel = new URL('assets/data/ai-prompts.json', origin + dir).href;
        if (!candidates.includes(fullRel)) candidates.push(fullRel);
      } catch (_) {}
    }

    // 3. Domain root absolute
    candidates.push('/assets/data/ai-prompts.json');

    // 4. Parent relative (if inside subfolder)
    candidates.push('../assets/data/ai-prompts.json');

    return candidates;
  }

  /**
   * Main loader: Multi-tier strategy with instant cache display, local file fallback,
   * server API fallback, and live Blogger feed synchronization.
   */
  async function loadPromptLibrary() {
    // Step 0: Try loading from localStorage cache first for 0ms initial render
    const cached = getLocalCache();
    let hasLoadedInitialData = false;

    if (cached && Array.isArray(cached.prompts) && cached.prompts.length > 0) {
      applyPromptsData(cached.prompts, cached.categories);
      hasLoadedInitialData = true;
    } else {
      showLoading(true);
    }

    let loadedPrompts = null;
    let sourceCategories = [];

    // Step 1: Try Local Static JSON file first (fastest for GitHub Pages / static hosting)
    const assetUrls = getCandidateAssetUrls();
    for (const url of assetUrls) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.prompts) && json.prompts.length > 0) {
            loadedPrompts = json.prompts;
            sourceCategories = json.categories || [];
            break;
          }
        }
      } catch (_) {
        // continue to next candidate path
      }
    }

    // Step 2: If static JSON not resolved, try Node server API endpoint
    if (!loadedPrompts) {
      try {
        const res = await fetch('/api/ai-prompts?limit=1000');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.prompts) && json.prompts.length > 0) {
            loadedPrompts = json.prompts;
            sourceCategories = json.categories || [];
          }
        }
      } catch (_) {
        // Node backend unavailable (e.g. pure static hosting)
      }
    }

    // Step 3: If still no data or for live updates, fetch directly from Blogger feed
    if (!loadedPrompts) {
      try {
        const liveResult = await fetchBloggerPostsLive(50);
        if (liveResult && liveResult.length > 0) {
          loadedPrompts = liveResult;
        }
      } catch (err) {
        console.warn("Live Blogger initial fetch attempt failed:", err);
      }
    }

    // If we obtained prompts from any source, apply and cache them
    if (loadedPrompts && loadedPrompts.length > 0) {
      applyPromptsData(loadedPrompts, sourceCategories);
      setLocalCache(loadedPrompts, sourceCategories);
      showLoading(false);
    } else if (!hasLoadedInitialData) {
      showEmptyState("Prompt library is currently updating. Please refresh in a moment.");
      showLoading(false);
    }

    // Step 4: Background live sync to ensure future Blogger posts auto-update without rebuild
    syncFutureBloggerPostsInBackground();
  }

  /**
   * Apply prompts to state and trigger UI render
   */
  function applyPromptsData(prompts, initialCategories) {
    // Deduplicate prompts by ID and content hash
    const seen = new Set();
    const cleanList = [];

    for (const p of prompts) {
      if (!p || !p.promptText || !p.imageUrl) continue;
      const key = `${p.id || ''}::${p.imageUrl}::${p.promptText.slice(0, 60)}`;
      if (!seen.has(key)) {
        seen.add(key);
        cleanList.push(p);
      }
    }

    if (cleanList.length === 0) return;

    allPrompts = cleanList;
    categories = buildUniqueCategories(cleanList, initialCategories || []);
    renderCategoryFilters();
    renderLibrary();
  }

  /**
   * Background sync: queries Blogger feed to automatically pull latest/future posts
   * and merges them into the existing prompt library seamlessly.
   */
  async function syncFutureBloggerPostsInBackground() {
    try {
      const livePosts = await fetchBloggerPostsLive(30);
      if (!livePosts || livePosts.length === 0) return;

      let newCount = 0;
      const existingIds = new Set(allPrompts.map(p => p.id));
      const existingHashes = new Set(allPrompts.map(p => `${p.imageUrl}::${p.promptText.slice(0, 60)}`));
      const toPrepend = [];

      for (const p of livePosts) {
        const hash = `${p.imageUrl}::${p.promptText.slice(0, 60)}`;
        if (!existingIds.has(p.id) && !existingHashes.has(hash)) {
          toPrepend.push(p);
          existingIds.add(p.id);
          existingHashes.add(hash);
          newCount++;
        }
      }

      if (newCount > 0) {
        console.log(`[Blogger Sync] Discovered ${newCount} new live prompt(s) from Blogger.`);
        allPrompts = [...toPrepend, ...allPrompts];
        categories = buildUniqueCategories(allPrompts, []);
        renderCategoryFilters();
        renderLibrary();
        setLocalCache(allPrompts, categories.map(c => c.name));
      }
    } catch (err) {
      // Non-blocking background sync warning
      console.debug("Background Blogger live sync check completed:", err);
    }
  }

  /**
   * Fetch live Blogger posts using JSON feed, JSONP, or RSS
   */
  async function fetchBloggerPostsLive(maxResults = 50) {
    // Method A: Direct fetch of Blogger JSON feed
    try {
      const url = `${JSON_FEED_URL}&max-results=${maxResults}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        if (json && json.feed && Array.isArray(json.feed.entry)) {
          return parseBloggerJsonEntries(json.feed.entry);
        }
      }
    } catch (_) {
      // Direct CORS might be blocked in some browser contexts, fall through to JSONP
    }

    // Method B: JSONP script injection (100% CORS-proof across all browsers & static domains)
    try {
      const jsonpResult = await fetchBloggerViaJsonp(maxResults);
      if (jsonpResult && jsonpResult.length > 0) {
        return jsonpResult;
      }
    } catch (_) {
      // JSONP fallback
    }

    // Method C: RSS via public CORS proxy
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${RSS_FEED_URL}&max-results=${maxResults}`)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const xmlText = await res.text();
        return parseRssXmlString(xmlText);
      }
    } catch (_) {
      // Proxy fallback
    }

    return [];
  }

  /**
   * JSONP loader for Blogger feed (bypasses browser CORS completely)
   */
  function fetchBloggerViaJsonp(maxResults = 50) {
    return new Promise((resolve, reject) => {
      const callbackName = '__mtvBloggerCallback_' + Math.floor(Math.random() * 1000000);
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timeout'));
      }, 8000);

      function cleanup() {
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }

      window[callbackName] = function (data) {
        cleanup();
        try {
          if (data && data.feed && Array.isArray(data.feed.entry)) {
            const parsed = parseBloggerJsonEntries(data.feed.entry);
            resolve(parsed);
          } else {
            resolve([]);
          }
        } catch (e) {
          reject(e);
        }
      };

      script.src = `${BLOGGER_BASE_URL}/feeds/posts/default?alt=json-in-script&callback=${callbackName}&max-results=${maxResults}`;
      script.onerror = function () {
        cleanup();
        reject(new Error('JSONP script load error'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Parse Blogger JSON entry format into PromptRecord items
   */
  function parseBloggerJsonEntries(entries) {
    const items = [];

    for (const entry of entries) {
      const rawTitle = entry.title?.$t || 'AI Prompt';
      const postId = entry.id?.$t || '';
      const pubDate = entry.published?.$t || entry.updated?.$t || '';
      const sourceUrl = (entry.link || []).find(l => l.rel === 'alternate')?.href || BLOGGER_BASE_URL;
      const catMatches = (entry.category || []).map(c => (c.term || '').trim()).filter(Boolean);
      const primaryCategory = catMatches[0] || 'AI Prompt';
      const rawHtml = entry.content?.$t || '';

      if (!rawHtml) continue;

      // Extract content images
      const allImages = [...rawHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
        .map(m => m[1])
        .filter(src => src && !src.includes('blogger_logo') && !src.includes('clear.gif') && !src.includes('blank.gif'));

      // Extract prompt blocks
      let promptBlocks = [...rawHtml.matchAll(/class=["'][^"']*prompt-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1]);

      if (promptBlocks.length === 0) {
        const altMatches = [...rawHtml.matchAll(/(?:PROMPT|Prompt)\s*:\s*([\s\S]*?)(?:<\/div>|<\/p>|<button|<\/blockquote>)/gi)].map(m => m[1]);
        if (altMatches.length > 0) promptBlocks = altMatches;
      }

      // Clean prompts
      const validPrompts = promptBlocks
        .map(p => cleanPromptText(p))
        .filter(t => t.length > 20 && !t.startsWith('http') && !t.includes('Step 1 — Copy'));

      const baseTitle = rawTitle.replace(/\s*\[Code\s*#?\d+\]/i, '').trim();

      validPrompts.forEach((promptText, idx) => {
        const imgUrl = allImages[idx] || allImages[0] || '';
        if (promptText && imgUrl) {
          const itemIdx = idx + 1;
          const stableId = 'prompt_' + (postId.replace(/[^a-zA-Z0-9]/g, '_') || 'post') + '_' + itemIdx;
          const itemTitle = validPrompts.length > 1 ? `${baseTitle} (Style ${itemIdx})` : baseTitle;

          items.push({
            id: stableId,
            postId,
            title: itemTitle,
            originalPostTitle: rawTitle,
            sourceUrl,
            imageUrl: imgUrl,
            promptText,
            category: primaryCategory,
            categories: catMatches.length > 0 ? catMatches : ['AI Prompt'],
            pubDate,
            itemIndex: itemIdx,
          });
        }
      });
    }

    return items;
  }

  /**
   * Parse RSS XML format string into PromptRecord items
   */
  function parseRssXmlString(xmlText) {
    const items = [];
    const rawItems = xmlText.split('<item>').slice(1);

    for (const rawItem of rawItems) {
      const titleMatch = rawItem.match(/<title>([^<]+)<\/title>/);
      const rawTitle = titleMatch ? unescapeHtml(titleMatch[1]).trim() : '';

      const linkMatch = rawItem.match(/<link>([^<]+)<\/link>/);
      const sourceUrl = linkMatch ? linkMatch[1].trim() : '';

      const guidMatch = rawItem.match(/<guid[^>]*>([^<]+)<\/guid>/);
      const postId = guidMatch ? guidMatch[1].trim() : '';

      const pubDateMatch = rawItem.match(/<pubDate>([^<]+)<\/pubDate>/);
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

      const catMatches = [...rawItem.matchAll(/<category[^>]*>([^<]+)<\/category>/g)].map(m => unescapeHtml(m[1]).trim());
      const primaryCategory = catMatches[0] || 'AI Prompt';

      const descMatch = rawItem.match(/<description>([\s\S]*?)<\/description>/);
      if (!descMatch) continue;

      const rawHtml = unescapeHtml(descMatch[1]);

      const allImages = [...rawHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
        .map(m => m[1])
        .filter(src => src && !src.includes('blogger_logo') && !src.includes('clear.gif') && !src.includes('blank.gif'));

      let promptBlocks = [...rawHtml.matchAll(/class=["'][^"']*prompt-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1]);

      if (promptBlocks.length === 0) {
        const altMatches = [...rawHtml.matchAll(/(?:PROMPT|Prompt)\s*:\s*([\s\S]*?)(?:<\/div>|<\/p>|<button|<\/blockquote>)/gi)].map(m => m[1]);
        if (altMatches.length > 0) promptBlocks = altMatches;
      }

      const validPrompts = promptBlocks
        .map(p => cleanPromptText(p))
        .filter(t => t.length > 20 && !t.startsWith('http') && !t.includes('Step 1 — Copy'));

      const baseTitle = rawTitle.replace(/\s*\[Code\s*#?\d+\]/i, '').trim();

      validPrompts.forEach((promptText, idx) => {
        const imgUrl = allImages[idx] || allImages[0] || '';
        if (promptText && imgUrl) {
          const itemIdx = idx + 1;
          const stableId = 'prompt_' + (postId.replace(/[^a-zA-Z0-9]/g, '_') || 'post') + '_' + itemIdx;
          const itemTitle = validPrompts.length > 1 ? `${baseTitle} (Style ${itemIdx})` : baseTitle;

          items.push({
            id: stableId,
            postId,
            title: itemTitle,
            originalPostTitle: rawTitle,
            sourceUrl,
            imageUrl: imgUrl,
            promptText,
            category: primaryCategory,
            categories: catMatches.length > 0 ? catMatches : ['AI Prompt'],
            pubDate,
            itemIndex: itemIdx,
          });
        }
      });
    }

    return items;
  }

  /**
   * Remove hashtags, links, promo, and author text from prompt
   */
  function cleanPromptText(text) {
    if (!text) return '';
    let clean = unescapeHtml(text)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Remove leading 'PROMPT:' or 'Prompt:' label
    clean = clean.replace(/^(?:PROMPT|Prompt)\s*:\s*/i, '').trim();

    // Remove trailing hashtags (#something or multiple #tags)
    clean = clean.replace(/#\w+[\s\w#]*$/, '').trim();

    // Remove any trailing instructions/promotions that might have leaked
    clean = clean.replace(/(?:Support Us|Join Our Community|Follow on Instagram|Step 1\s*[—–-]|Welcome to AIPromptXpert).*$/i, '').trim();

    return clean;
  }

  /**
   * Local storage cache helpers
   */
  function getLocalCache() {
    try {
      const raw = localStorage.getItem(LOCAL_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.prompts) && parsed.prompts.length > 0) {
        return parsed;
      }
    } catch (_) {}
    return null;
  }

  function setLocalCache(prompts, categories) {
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        categories: categories || [],
        prompts: prompts || [],
      }));
    } catch (_) {}
  }

  /**
   * Extract and clean source categories
   */
  function buildUniqueCategories(prompts, sourceCategories) {
    const map = new Map();
    prompts.forEach(p => {
      const cats = p.categories || [p.category || 'AI Prompt'];
      cats.forEach(c => {
        const clean = c.trim();
        if (clean) {
          map.set(clean, (map.get(clean) || 0) + 1);
        }
      });
    });

    const list = [{ name: 'All', count: prompts.length }];
    for (const [name, count] of map.entries()) {
      list.push({ name, count });
    }
    return list;
  }

  /**
   * Render Category Filter Pills
   */
  function renderCategoryFilters() {
    if (!categoryPillsContainer) return;
    categoryPillsContainer.innerHTML = '';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-pill ${cat.name === activeCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.name);
      btn.innerHTML = `<span>${escapeHtml(cat.name)}</span><span class="pill-count">${cat.count}</span>`;

      btn.addEventListener('click', () => {
        if (activeCategory === cat.name) return;
        activeCategory = cat.name;
        categoryPillsContainer.querySelectorAll('.category-pill').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-category') === activeCategory);
        });
        currentPage = 1;
        renderLibrary();
      });

      categoryPillsContainer.appendChild(btn);
    });
  }

  /**
   * Filter prompts by active category and search keyword
   */
  function getFilteredPrompts() {
    return allPrompts.filter(p => {
      // Category match
      let matchCat = true;
      if (activeCategory !== 'All') {
        const target = activeCategory.toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pCats = (p.categories || []).map(c => c.toLowerCase());
        matchCat = pCat.includes(target) || pCats.includes(target);
      }

      // Search match
      let matchSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = (p.title || '').toLowerCase();
        const prompt = (p.promptText || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        matchSearch = title.includes(q) || prompt.includes(q) || cat.includes(q);
      }

      return matchCat && matchSearch;
    });
  }

  /**
   * Render complete library (resets grid)
   */
  function renderLibrary() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    renderCards(false);
  }

  /**
   * Render cards with pagination support
   */
  function renderCards(isAppend) {
    const filtered = getFilteredPrompts();
    const totalCount = filtered.length;

    // Update count summary
    if (countSummaryEl) {
      if (searchQuery) {
        countSummaryEl.textContent = `Found ${totalCount} matching prompts for "${searchQuery}"`;
      } else if (activeCategory !== 'All') {
        countSummaryEl.textContent = `Showing ${totalCount} prompts in ${activeCategory}`;
      } else {
        countSummaryEl.textContent = `Showing all ${totalCount} genuine AI prompts from AiPromptXpert`;
      }
    }

    if (totalCount === 0) {
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      if (gridContainer) gridContainer.innerHTML = '';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    const maxItems = currentPage * pageSize;
    hasMore = maxItems < totalCount;

    if (!isAppend) {
      gridContainer.innerHTML = '';
    }

    const startIdx = isAppend ? (currentPage - 1) * pageSize : 0;
    const currentSlice = filtered.slice(startIdx, maxItems);

    currentSlice.forEach(record => {
      const card = createCardElement(record);
      gridContainer.appendChild(card);
    });

    if (loadMoreBtn) {
      loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
      if (hasMore) {
        const remaining = totalCount - maxItems;
        loadMoreBtn.textContent = `Load More Prompts (${remaining} remaining)`;
      }
    }
  }

  /**
   * Create an individual prompt card DOM element
   */
  function createCardElement(record) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.setAttribute('data-id', record.id);

    const thumbUrl = record.imageUrl;
    const cleanTitle = record.title || 'AI Image Prompt';
    const categoryTag = record.category || 'AI Prompt';
    const previewText = (record.promptText || '').slice(0, 160) + (record.promptText.length > 160 ? '...' : '');

    card.innerHTML = `
      <div class="prompt-card-media">
        <img 
          src="${escapeHtml(thumbUrl)}" 
          alt="${escapeHtml(cleanTitle)}" 
          class="prompt-card-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null; this.src='assets/icons/favicon.svg'; this.style.objectFit='contain'; this.style.padding='2rem';"
        />
        <span class="prompt-card-badge">${escapeHtml(categoryTag)}</span>
      </div>
      <div class="prompt-card-body">
        <h3 class="prompt-card-title">${escapeHtml(cleanTitle)}</h3>
        <p class="prompt-card-preview">${escapeHtml(previewText)}</p>
        <div class="prompt-card-actions">
          <button type="button" class="btn btn-primary btn-sm btn-copy-prompt" data-prompt-id="${escapeHtml(record.id)}" aria-label="Copy AI Prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Prompt</span>
          </button>
          <button type="button" class="btn btn-outline btn-sm btn-view-prompt" data-prompt-id="${escapeHtml(record.id)}" aria-label="View Full Prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View</span>
          </button>
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Detail Modal View
   */
  function openDetailModal(record) {
    if (!detailModal) return;

    const modalImg = detailModal.querySelector('.modal-prompt-img');
    const modalTitle = detailModal.querySelector('.modal-prompt-title');
    const modalCategory = detailModal.querySelector('.modal-prompt-category');
    const modalText = detailModal.querySelector('.modal-prompt-text');
    const modalSourceLink = detailModal.querySelector('.modal-source-link');
    const modalCopyBtn = detailModal.querySelector('.modal-copy-btn');

    if (modalImg) modalImg.src = record.imageUrl;
    if (modalTitle) modalTitle.textContent = record.title;
    if (modalCategory) modalCategory.textContent = record.category;
    if (modalText) modalText.textContent = record.promptText;

    if (modalSourceLink) {
      modalSourceLink.href = record.sourceUrl || BLOGGER_BASE_URL;
    }

    if (modalCopyBtn) {
      modalCopyBtn.onclick = (e) => {
        e.preventDefault();
        copyPromptToClipboard(record.promptText, modalCopyBtn);
      };
    }

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!detailModal) return;
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Copy prompt text to clipboard (guarantees ONLY clean prompt text is copied)
   */
  async function copyPromptToClipboard(text, btnElement) {
    if (!text) return;

    let cleanPrompt = text
      .replace(/#\w+[\s\w#]*$/, '')
      .replace(/^(?:PROMPT|Prompt)\s*:\s*/i, '')
      .trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanPrompt);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = cleanPrompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      showToast("Prompt copied successfully.");

      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.classList.add('btn-copied');
        btnElement.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;
        setTimeout(() => {
          btnElement.classList.remove('btn-copied');
          btnElement.innerHTML = originalHtml;
        }, 2000);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      showToast("Failed to copy prompt.");
    }
  }

  /**
   * Show toast notification
   */
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'copy-toast';
      toastEl.className = 'prompt-toast';
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = msg;
    toastEl.classList.add('show');

    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  function showLoading(show) {
    const spinner = document.getElementById('prompt-loading-spinner');
    if (spinner) {
      spinner.style.display = show ? 'flex' : 'none';
    }
  }

  function showEmptyState(msg) {
    if (emptyStateEl) {
      emptyStateEl.style.display = 'block';
      const textEl = emptyStateEl.querySelector('p');
      if (textEl) textEl.textContent = msg;
    }
    if (countSummaryEl) {
      countSummaryEl.textContent = msg;
    }
    if (gridContainer) {
      gridContainer.innerHTML = '';
    }
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
  }

  function unescapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
