/**
 * Multi Tube Views (MTV) — AI Prompt Engine (Client)
 * Content source: Strictly https://aipromptxpert.blogspot.com/feeds/posts/default?alt=rss
 */

(function () {
  'use strict';

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

    // Global copy delegation for cards
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

  /**
   * Load prompt library data from /api/ai-prompts or fallback to assets/data/ai-prompts.json
   */
  async function loadPromptLibrary() {
    showLoading(true);

    try {
      // 1. Try server API endpoint first
      let data = null;
      try {
        const res = await fetch('/api/ai-prompts?limit=1000');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.prompts) && json.prompts.length > 0) {
            data = json;
          }
        }
      } catch (_) {
        // server endpoint unavailable, proceed to static json
      }

      // 2. Fallback to static JSON file (for GitHub Pages & static hosting)
      if (!data) {
        let staticRes = await fetch('assets/data/ai-prompts.json').catch(() => null);
        if (!staticRes || !staticRes.ok) {
          staticRes = await fetch('/assets/data/ai-prompts.json').catch(() => null);
        }
        if (staticRes && staticRes.ok) {
          const staticJson = await staticRes.json();
          if (Array.isArray(staticJson.prompts) && staticJson.prompts.length > 0) {
            data = staticJson;
          }
        }
      }

      if (data && data.prompts && data.prompts.length > 0) {
        allPrompts = data.prompts;
        categories = buildUniqueCategories(data.prompts, data.categories || []);
        renderCategoryFilters();
        renderLibrary();
      } else {
        showEmptyState("Prompt library is temporarily unavailable. Please try again later.");
      }
    } catch (err) {
      console.error("AI Prompt fetch error:", err);
      showEmptyState("Prompt library is temporarily unavailable. Please try again later.");
    } finally {
      showLoading(false);
    }
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
    const itemsToRender = filtered.slice(0, maxItems);
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

    // Optimized thumbnail
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
      modalSourceLink.href = record.sourceUrl || 'https://aipromptxpert.blogspot.com/';
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
   * Copy prompt text to clipboard (ensures ONLY exact prompt is copied, NO hashtags)
   */
  async function copyPromptToClipboard(text, btnElement) {
    if (!text) return;

    // Strict cleaning check to guarantee zero hashtags or external promotional text in copied string
    let cleanPrompt = text
      .replace(/#\w+[\s\w#]*$/, '')
      .replace(/^(?:PROMPT|Prompt)\s*:\s*/i, '')
      .trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanPrompt);
      } else {
        // Fallback for older context
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

      // Button feedback
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
