/**
 * Multi Tube Views (MTV) — 210 AI Generative Tools Engine
 * Handles rendering, category filtering, search, routing, and MTVAI tool binding.
 */

import { AI_CATEGORIES, AI_TOOLS_DATA } from '../data/ai-tools-data.js';

function bootAITools() {
  const toolsListView = document.getElementById('tools-list-view');
  const toolsGrid = document.getElementById('ai-tools-grid');
  const categoryFiltersWrap = document.getElementById('category-filters-wrap');
  const searchInput = document.getElementById('ai-tools-search-input');
  const searchClearBtn = document.getElementById('ai-tools-search-clear');
  const emptyState = document.getElementById('ai-tools-empty-state');
  const toast = document.getElementById('copy-toast');

  // Dedicated Workspace Elements
  const dedicatedWorkspace = document.getElementById('dedicated-tool-workspace');
  const dedicatedToolTitle = document.getElementById('dedicated-tool-title');
  const dedicatedToolDesc = document.getElementById('dedicated-tool-desc');
  const dedicatedToolIcon = document.getElementById('dedicated-tool-icon');
  const dedicatedInputLabel = document.getElementById('dedicated-input-label');
  const dedicatedToolInput = document.getElementById('dedicated-tool-input');
  const btnGenerateDedicated = document.getElementById('btn-generate-dedicated');
  const dedicatedToolLoading = document.getElementById('dedicated-tool-loading');
  const dedicatedToolOutputWrap = document.getElementById('dedicated-tool-output-wrap');
  const dedicatedToolOutput = document.getElementById('dedicated-tool-output');
  const btnDedicatedCopy = document.getElementById('btn-dedicated-copy');
  const btnDedicatedCopyAll = document.getElementById('btn-dedicated-copy-all');
  const btnDedicatedClear = document.getElementById('btn-dedicated-clear');

  // Breadcrumbs
  const breadcrumbParent = document.getElementById('breadcrumb-parent-link');
  const breadcrumbSubPage = document.getElementById('breadcrumb-sub-page');
  const breadcrumbSubSeparator = document.getElementById('breadcrumb-sub-separator');

  let activeCategory = 'all';

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 1. Setup Category Filters
  function setupCategoryFilters() {
    if (!categoryFiltersWrap) return;

    // Delegated click handler on categoryFiltersWrap ensures reliable tap handling on mobile & desktop
    categoryFiltersWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      e.preventDefault();
      const catId = btn.getAttribute('data-category');
      if (!catId) return;

      activeCategory = catId;
      categoryFiltersWrap.querySelectorAll('.filter-chip').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === catId);
      });
      filterAndRenderCards();
    });

    const existingChips = categoryFiltersWrap.querySelectorAll('.filter-chip');
    if (existingChips.length > 0) {
      existingChips.forEach(btn => {
        const catId = btn.getAttribute('data-category');
        btn.onclick = (e) => {
          e.preventDefault();
          activeCategory = catId;
          categoryFiltersWrap.querySelectorAll('.filter-chip').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-category') === catId);
          });
          filterAndRenderCards();
        };
      });
    } else {
      categoryFiltersWrap.innerHTML = '';
      AI_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `filter-chip ${cat.id === activeCategory ? 'active' : ''}`;
        btn.setAttribute('data-category', cat.id);
        btn.innerHTML = `<span>${cat.name}</span><span class="filter-count">${cat.count}</span>`;

        btn.onclick = (e) => {
          e.preventDefault();
          activeCategory = cat.id;
          categoryFiltersWrap.querySelectorAll('.filter-chip').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-category') === cat.id);
          });
          filterAndRenderCards();
        };

        categoryFiltersWrap.appendChild(btn);
      });
    }
  }

  // Bind individual card interactions
  function bindCardEvents(card, id) {
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
      if (!e.target.closest('a')) {
        history.pushState(null, '', `?tool=${id}`);
        updateViewFromURL();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const link = card.querySelector('.btn-open-tool');
    if (link) {
      link.onclick = (e) => {
        e.preventDefault();
        history.pushState(null, '', `?tool=${id}`);
        updateViewFromURL();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }

    attachTilt(card);
  }

  // 2. Setup Tool Cards
  function setupToolCards() {
    if (!toolsGrid) return;
    const existingCards = toolsGrid.querySelectorAll('.creator-tool-card');
    const existingIds = new Set();

    existingCards.forEach(card => {
      const id = card.getAttribute('data-tool-id');
      if (id) {
        existingIds.add(id);
        bindCardEvents(card, id);
      }
    });

    // Ensure any tools in AI_TOOLS_DATA not yet in DOM are created
    Object.entries(AI_TOOLS_DATA).forEach(([id, tool]) => {
      if (!existingIds.has(id)) {
        const card = document.createElement('div');
        card.className = 'creator-tool-card tilt-card';
        card.setAttribute('data-tool-id', id);
        card.setAttribute('data-category', tool.category);
        card.id = `card-${id}`;

        card.innerHTML = `
          <div>
            <div class="creator-tool-header">
              <span class="creator-tool-icon" aria-hidden="true">${tool.icon}</span>
              <h3 class="creator-tool-title">${tool.title}</h3>
            </div>
            <p class="creator-tool-desc">${tool.desc}</p>
          </div>
          <div class="creator-tool-actions" style="margin-top: auto; padding-top: 1rem;">
            <a href="ai-tools/${id}.html" class="btn btn-primary btn-open-tool" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
              <span>Open Tool</span>
              <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        `;

        bindCardEvents(card, id);
        toolsGrid.appendChild(card);
      }
    });
  }

  // 3D Tilt on Hover disabled for UI stability (matching Browser Utilities standard)
  function attachTilt(el) {
    return;
  }

  // 3. Search & Category Filter logic
  function filterAndRenderCards() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    if (searchClearBtn) {
      searchClearBtn.style.display = query ? 'flex' : 'none';
    }

    const cards = toolsGrid.querySelectorAll('.creator-tool-card');
    let visibleCount = 0;
    const activeCat = (activeCategory || 'all').trim().toLowerCase();

    cards.forEach(card => {
      const toolId = (card.getAttribute('data-tool-id') || '').trim();
      const category = (card.getAttribute('data-category') || '').trim().toLowerCase();
      const tool = AI_TOOLS_DATA[toolId];

      const matchesCat = activeCat === 'all' || category === activeCat;
      const matchesSearch = !query || !tool || 
        (tool.title && tool.title.toLowerCase().includes(query)) || 
        (tool.desc && tool.desc.toLowerCase().includes(query)) || 
        toolId.toLowerCase().includes(query);

      if (matchesCat && matchesSearch) {
        card.style.removeProperty('display');
        card.removeAttribute('data-hidden');
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.style.setProperty('display', 'none', 'important');
        card.setAttribute('data-hidden', 'true');
        card.classList.add('is-hidden');
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Search Input Handlers
  if (searchInput) {
    searchInput.addEventListener('input', filterAndRenderCards);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        searchInput.focus();
        filterAndRenderCards();
      }
    });
  }

  // 4. Router & Single Tool View
  function updateViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    let toolId = params.get('tool') || (window.location.hash ? window.location.hash.substring(1) : '');

    if (toolId.startsWith('tool=')) {
      toolId = toolId.substring(5);
    }

    if (toolId && AI_TOOLS_DATA[toolId]) {
      const tool = AI_TOOLS_DATA[toolId];
      if (toolsListView) toolsListView.style.display = 'none';
      if (dedicatedWorkspace) dedicatedWorkspace.style.display = 'block';

      if (dedicatedToolTitle) dedicatedToolTitle.textContent = tool.title;
      if (dedicatedToolDesc) dedicatedToolDesc.textContent = tool.desc;
      if (dedicatedToolIcon) dedicatedToolIcon.textContent = tool.icon;
      if (dedicatedInputLabel) dedicatedInputLabel.textContent = tool.label;
      if (dedicatedToolInput) dedicatedToolInput.placeholder = tool.placeholder;

      // Restore sessionStorage
      const savedInput = sessionStorage.getItem(`mtv_input_${toolId}`) || '';
      const savedOutput = sessionStorage.getItem(`mtv_output_${toolId}`) || '';

      if (dedicatedToolInput) dedicatedToolInput.value = savedInput;
      if (dedicatedToolOutput) {
        if (savedOutput) {
          dedicatedToolOutput.textContent = savedOutput;
          if (dedicatedToolOutputWrap) dedicatedToolOutputWrap.style.display = 'block';
        } else {
          dedicatedToolOutput.textContent = '';
          if (dedicatedToolOutputWrap) dedicatedToolOutputWrap.style.display = 'none';
        }
      }

      // Save input as user types
      if (dedicatedToolInput) {
        dedicatedToolInput.oninput = () => {
          sessionStorage.setItem(`mtv_input_${toolId}`, dedicatedToolInput.value);
        };
      }

      // Wire tool to MTVAI
      const bindToolToEngine = () => {
        if (window.MTVAI && typeof window.MTVAI.bindTool === 'function') {
          window.MTVAI.bindTool({
            task: toolId,
            inputId: 'dedicated-tool-input',
            buttonId: 'btn-generate-dedicated',
            outputId: 'dedicated-tool-output'
          });
        } else {
          setTimeout(bindToolToEngine, 100);
        }
      };
      bindToolToEngine();

      // Watch for output updates to save in sessionStorage
      if (dedicatedToolOutput) {
        const observer = new MutationObserver(() => {
          const text = dedicatedToolOutput.innerText || dedicatedToolOutput.textContent;
          if (text) {
            sessionStorage.setItem(`mtv_output_${toolId}`, text);
            if (dedicatedToolOutputWrap) dedicatedToolOutputWrap.style.display = 'block';
          }
        });
        observer.observe(dedicatedToolOutput, { childList: true, characterData: true, subtree: true });
      }

      // Update Breadcrumbs
      if (breadcrumbSubPage) {
        breadcrumbSubPage.textContent = tool.title;
        breadcrumbSubPage.style.display = 'inline';
      }
      if (breadcrumbSubSeparator) {
        breadcrumbSubSeparator.style.display = 'inline';
      }

      // Render Related Tools (3 tools in same category)
      const relatedGrid = document.getElementById('dedicated-related-tools-grid');
      if (relatedGrid) {
        relatedGrid.innerHTML = '';
        const sameCatTools = Object.entries(AI_TOOLS_DATA)
          .filter(([id, t]) => id !== toolId && t.category === tool.category);
        
        let relatedCandidates = sameCatTools;
        if (relatedCandidates.length < 3) {
          const otherCatTools = Object.entries(AI_TOOLS_DATA)
            .filter(([id]) => id !== toolId && !sameCatTools.some(([sId]) => sId === id));
          relatedCandidates = [...sameCatTools, ...otherCatTools];
        }
        
        const selected = relatedCandidates.slice(0, 3);
        selected.forEach(([relId, relTool]) => {
          const card = document.createElement('div');
          card.className = 'bu-card';
          card.setAttribute('data-tool-id', relId);
          card.style.cursor = 'pointer';
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.justifyContent = 'space-between';
          card.innerHTML = `
            <div>
              <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.4rem;">${relTool.icon || '⚡'}</span>
                <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary);">${relTool.title}</h3>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${relTool.desc}</p>
            </div>
            <div class="bu-card-actions" style="margin-top: auto; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); width: 100%;">
              <a href="?tool=${relId}" class="btn btn-primary btn-open-tool" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                <span>Open Tool</span>
                <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            </div>
          `;

          bindCardEvents(card, relId);
          relatedGrid.appendChild(card);
        });
      }

      // Update page title
      document.title = `${tool.title} — AI Tools | Multi Tube Views`;
    } else {
      if (toolsListView) toolsListView.style.display = 'block';
      if (dedicatedWorkspace) dedicatedWorkspace.style.display = 'none';

      if (breadcrumbSubPage) breadcrumbSubPage.style.display = 'none';
      if (breadcrumbSubSeparator) breadcrumbSubSeparator.style.display = 'none';

      document.title = 'AI Tools Suite — 210 Free Generative AI Writing Tools | Multi Tube Views';

      const catParam = params.get('category');
      if (catParam && AI_CATEGORIES.some(c => c.id === catParam)) {
        activeCategory = catParam;
        if (categoryFiltersWrap) {
          categoryFiltersWrap.querySelectorAll('.filter-chip').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-category') === catParam);
          });
        }
        filterAndRenderCards();
      }
    }
  }

  // Breadcrumb Parent Click
  if (breadcrumbParent) {
    breadcrumbParent.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', 'ai-tools.html');
      updateViewFromURL();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('popstate', updateViewFromURL);

  // Helper for reliable clipboard copy
  function copyTextToClipboard(text, successMsg) {
    if (!text) {
      showToast('Nothing to copy');
      return;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        showToast(successMsg);
      } else {
        showToast('Failed to copy');
      }
    } catch (err) {
      showToast('Failed to copy');
    }
  }

  // Copy Buttons
  if (btnDedicatedCopyAll) {
    btnDedicatedCopyAll.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = dedicatedToolOutput ? (dedicatedToolOutput.innerText || dedicatedToolOutput.textContent) : '';
      copyTextToClipboard(text, '✓ Complete output copied!');
    });
  }

  if (btnDedicatedCopy) {
    btnDedicatedCopy.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = dedicatedToolOutput ? (dedicatedToolOutput.innerText || dedicatedToolOutput.textContent) : '';
      copyTextToClipboard(text, 'Copied to clipboard!');
    });
  }

  // Clear Button
  if (btnDedicatedClear) {
    btnDedicatedClear.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const params = new URLSearchParams(window.location.search);
      let toolId = params.get('tool') || '';
      if (dedicatedToolInput) dedicatedToolInput.value = '';
      if (dedicatedToolOutput) dedicatedToolOutput.textContent = '';
      if (dedicatedToolOutputWrap) dedicatedToolOutputWrap.style.display = 'none';

      if (toolId) {
        sessionStorage.removeItem(`mtv_input_${toolId}`);
        sessionStorage.removeItem(`mtv_output_${toolId}`);
      }
      showToast('Cleared output');
    });
  }

  // Init
  setupCategoryFilters();
  setupToolCards();
  updateViewFromURL();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAITools);
} else {
  bootAITools();
}
