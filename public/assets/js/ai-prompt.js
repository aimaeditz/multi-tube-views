/**
 * Multi Tube Views (MTV) — AI Prompts & Tools Engine
 * Loads prompt feed from backend and manages search, filter, preview, modal, and clipboard copying.
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

  function boot() {
    initElements();
    initEventListeners();
    loadPromptLibrary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

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
        const promptRecord = allPrompts.find((p) => p.id === promptId);
        if (promptRecord && promptRecord.promptText) {
          copyPromptToClipboard(promptRecord.promptText, copyBtn);
        }
      }

      const viewBtn = e.target.closest('.btn-view-prompt');
      if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const promptId = viewBtn.getAttribute('data-prompt-id');
        const promptRecord = allPrompts.find((p) => p.id === promptId);
        if (promptRecord) {
          openDetailModal(promptRecord);
        }
      }
    });
  }

  /**
   * Load Prompt Feed from the backend endpoint /api/prompt-feed
   */
  function loadPromptLibrary() {
    showLoading(true);

    const feedUrl = `/api/prompt-feed?_t=${Date.now()}`;
    fetch(feedUrl, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) {
          throw new Error('Network response was not ok');
        }
        return r.json();
      })
      .then((data) => {
        showLoading(false);
        if (data && Array.isArray(data.prompts) && data.prompts.length > 0) {
          allPrompts = data.prompts.map((p, idx) => ({
            id: p.id || `prompt_${idx + 1}`,
            title: p.title || 'AI Prompt',
            image: p.image || p.imageUrl || '',
            promptText: p.promptText || '',
            categories:
              Array.isArray(p.categories) && p.categories.length > 0
                ? p.categories
                : [p.category || 'AI Prompt'],
            category:
              (Array.isArray(p.categories) && p.categories[0]) || p.category || 'AI Prompt',
            originalLink: p.originalLink || p.sourceUrl || '',
            published: p.published || p.pubDate || '',
          }));

          categories = buildUniqueCategories(allPrompts);
          renderCategoryFilters();
          renderLibrary();
        } else {
          showEmptyState('Could not load prompts right now');
        }
      })
      .catch((err) => {
        console.error('Failed to load prompts from /api/prompt-feed, trying fallback:', err);
        fetch('/api/ai-prompts?limit=1000')
          .then((r) => r.json())
          .then((fbData) => {
            showLoading(false);
            if (fbData && Array.isArray(fbData.prompts) && fbData.prompts.length > 0) {
              allPrompts = fbData.prompts;
              categories = buildUniqueCategories(allPrompts);
              renderCategoryFilters();
              renderLibrary();
            } else {
              showEmptyState('Could not load prompts right now');
            }
          })
          .catch(() => {
            showLoading(false);
            showEmptyState('Could not load prompts right now');
          });
      });
  }

  /**
   * Extract unique categories with accurate counts
   */
  function buildUniqueCategories(prompts) {
    const map = new Map();
    prompts.forEach((p) => {
      const cats =
        Array.isArray(p.categories) && p.categories.length > 0
          ? p.categories
          : [p.category || 'AI Prompt'];
      cats.forEach((c) => {
        const clean = (c || '').trim();
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

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-pill ${cat.name === activeCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.name);
      btn.innerHTML = `<span>${escapeHtml(cat.name)}</span><span class="pill-count">${cat.count}</span>`;

      btn.addEventListener('click', () => {
        if (activeCategory === cat.name) return;
        activeCategory = cat.name;
        categoryPillsContainer.querySelectorAll('.category-pill').forEach((el) => {
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
    return allPrompts.filter((p) => {
      // Category match
      let matchCat = true;
      if (activeCategory !== 'All') {
        const target = activeCategory.toLowerCase();
        const pCats = (Array.isArray(p.categories) ? p.categories : [p.category || '']).map((c) =>
          (c || '').toLowerCase()
        );
        matchCat = pCats.some((c) => c.includes(target) || target.includes(c));
      }

      // Search match (title, promptText, categories)
      let matchSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = (p.title || '').toLowerCase();
        const text = (p.promptText || '').toLowerCase();
        const pCats = (Array.isArray(p.categories) ? p.categories : [p.category || '']).map((c) =>
          (c || '').toLowerCase()
        );
        const catMatch = pCats.some((c) => c.includes(q));
        matchSearch = title.includes(q) || text.includes(q) || catMatch;
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
        countSummaryEl.textContent = `Found ${totalCount} matching prompt${totalCount === 1 ? '' : 's'} for "${searchQuery}"`;
      } else if (activeCategory !== 'All') {
        countSummaryEl.textContent = `Showing ${totalCount} prompt${totalCount === 1 ? '' : 's'} in ${activeCategory}`;
      } else {
        countSummaryEl.textContent = `Showing all ${totalCount} AI prompts`;
      }
    }

    if (totalCount === 0) {
      if (emptyStateEl) {
        emptyStateEl.style.display = 'block';
        const p = emptyStateEl.querySelector('p');
        if (p) p.textContent = 'Try searching for different keywords or select "All" categories.';
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      if (gridContainer) gridContainer.innerHTML = '';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    const maxItems = currentPage * pageSize;
    hasMore = maxItems < totalCount;

    if (!isAppend && gridContainer) {
      gridContainer.innerHTML = '';
    }

    const startIdx = isAppend ? (currentPage - 1) * pageSize : 0;
    const currentSlice = filtered.slice(startIdx, maxItems);

    if (gridContainer) {
      currentSlice.forEach((record) => {
        const card = createCardElement(record);
        gridContainer.appendChild(card);
      });
    }

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

    const thumbUrl = record.image || 'assets/icons/favicon.svg';
    const cleanTitle = record.title || 'AI Image Prompt';
    const categoryTag =
      Array.isArray(record.categories) && record.categories.length > 0
        ? record.categories[0]
        : record.category || 'AI Prompt';
    const previewText =
      (record.promptText || '').slice(0, 160) +
      (record.promptText && record.promptText.length > 160 ? '...' : '');

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
          <button type="button" class="btn btn-primary btn-sm btn-copy-prompt" data-prompt-id="${escapeHtml(record.id)}" aria-label="Copy Full Prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Full Prompt</span>
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

    if (modalImg) {
      modalImg.src = record.image || 'assets/icons/favicon.svg';
      modalImg.onerror = function () {
        this.onerror = null;
        this.src = 'assets/icons/favicon.svg';
        this.style.objectFit = 'contain';
        this.style.padding = '2rem';
      };
    }
    if (modalTitle) modalTitle.textContent = record.title || 'AI Prompt Details';
    if (modalCategory) {
      const catText =
        Array.isArray(record.categories) && record.categories.length > 0
          ? record.categories.join(', ')
          : record.category || 'AI Prompt';
      modalCategory.textContent = catText;
    }
    if (modalText) modalText.textContent = record.promptText || '';

    if (modalSourceLink) {
      if (record.originalLink) {
        modalSourceLink.href = record.originalLink;
        modalSourceLink.style.display = 'inline';
      } else {
        modalSourceLink.style.display = 'none';
      }
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
   * Copy prompt text to clipboard
   */
  async function copyPromptToClipboard(text, btnElement) {
    if (!text) return;

    const cleanPrompt = String(text).trim();

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

      showToast('Prompt copied successfully.');

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
      console.error('Clipboard copy failed:', err);
      showToast('Failed to copy prompt.');
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
    isLoading = show;
    const spinner = document.getElementById('prompt-loading-spinner');
    if (spinner) {
      spinner.style.display = show ? 'flex' : 'none';
    }
    if (show && countSummaryEl) {
      countSummaryEl.textContent = 'Loading AI prompts...';
    }
  }

  function showEmptyState(msg) {
    if (emptyStateEl) {
      emptyStateEl.style.display = 'block';
      const heading = emptyStateEl.querySelector('h3');
      const textEl = emptyStateEl.querySelector('p');
      if (msg === 'Could not load prompts right now') {
        if (heading) heading.textContent = 'Could not load prompts right now';
        if (textEl) textEl.textContent = 'Please check your connection or try again later.';
      } else {
        if (heading) heading.textContent = 'No matching prompts found';
        if (textEl) textEl.textContent = msg || 'Try searching for different keywords or select "All" categories.';
      }
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

