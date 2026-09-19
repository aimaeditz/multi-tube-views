/**
 * Multi Tube Views (MTV) — Creator Tools Engine
 * Handles rendering, category filtering, search, routing, and MTVAI tool binding for all 70 Creator Tools.
 */

import { CREATOR_CATEGORIES, CREATOR_TOOLS_DATA } from '../data/creator-tools-data.js';

// Ensure global accessibility
if (typeof window !== 'undefined') {
  window.MTV_CREATOR_CATEGORIES = CREATOR_CATEGORIES;
  window.MTV_CREATOR_TOOLS = CREATOR_TOOLS_DATA;
  window.CREATOR_TOOLS_DATA = CREATOR_TOOLS_DATA;
}

function bootCreatorTools() {
  const toolsListView = document.getElementById('tools-list-view');
  const creatorGrid = document.querySelector('.creator-tools-grid');
  const categoryFiltersWrap = document.getElementById('category-filters-wrap');
  const searchInput = document.getElementById('creator-tools-search-input');
  const searchClearBtn = document.getElementById('creator-tools-search-clear');
  const emptyState = document.getElementById('creator-tools-empty-state');
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

  // 1. Setup Category Filter Chips
  function setupCategoryFilters() {
    if (!categoryFiltersWrap) return;

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
  }

  // 2. Render and Setup Tool Cards
  function renderAllCards() {
    if (!creatorGrid) return;

    // Check if cards need rendering (ensure all 70 are present)
    const existingCards = creatorGrid.querySelectorAll('.creator-tool-card');
    if (existingCards.length !== Object.keys(CREATOR_TOOLS_DATA).length) {
      creatorGrid.innerHTML = Object.entries(CREATOR_TOOLS_DATA).map(([toolId, tool]) => `
        <div class="creator-tool-card" data-tool-id="${toolId}" data-category="${tool.category || 'all'}" id="card-${toolId}">
          <div>
            <div class="creator-tool-header">
              <span class="creator-tool-icon" aria-hidden="true">${tool.icon || '⚡'}</span>
              <h3 class="creator-tool-title">${tool.title}</h3>
            </div>
            <p class="creator-tool-desc">${tool.desc}</p>
          </div>
          <div class="creator-tool-actions" style="margin-top: auto; padding-top: 1rem;">
            <a href="?tool=${toolId}" class="btn btn-primary btn-open-tool" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;" aria-label="Open ${tool.title}">
              <span>Open Tool</span>
              <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      `).join('');
    }

    // Event delegation on creatorGrid for card clicks
    creatorGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.creator-tool-card');
      if (!card) return;

      const toolId = card.getAttribute('data-tool-id');
      if (!toolId) return;

      e.preventDefault();
      history.pushState(null, '', `?tool=${encodeURIComponent(toolId)}`);
      updateViewFromURL();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Search and Category Filtering
  function filterAndRenderCards() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    if (searchClearBtn) {
      searchClearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
    }

    const cards = creatorGrid ? creatorGrid.querySelectorAll('.creator-tool-card') : [];
    let visibleCount = 0;

    cards.forEach(card => {
      const toolId = card.getAttribute('data-tool-id');
      const toolData = CREATOR_TOOLS_DATA[toolId];
      const cardCat = card.getAttribute('data-category') || (toolData ? toolData.category : '');

      const matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
      let matchesSearch = true;

      if (query && toolData) {
        const titleMatch = toolData.title.toLowerCase().includes(query);
        const descMatch = toolData.desc.toLowerCase().includes(query);
        const idMatch = toolId.toLowerCase().includes(query);
        const labelMatch = (toolData.label || '').toLowerCase().includes(query);
        matchesSearch = titleMatch || descMatch || idMatch || labelMatch;
      }

      if (matchesCategory && matchesSearch) {
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

  // 4. Router & Dedicated Single Tool Workspace View
  function updateViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    let toolId = params.get('tool') || (window.location.hash ? window.location.hash.substring(1) : '');

    if (toolId.startsWith('tool=')) {
      toolId = toolId.substring(5);
    }

    if (toolId && CREATOR_TOOLS_DATA[toolId]) {
      const tool = CREATOR_TOOLS_DATA[toolId];
      if (toolsListView) toolsListView.style.display = 'none';
      if (dedicatedWorkspace) dedicatedWorkspace.style.display = 'block';

      if (dedicatedToolTitle) dedicatedToolTitle.textContent = tool.title;
      if (dedicatedToolDesc) dedicatedToolDesc.textContent = tool.desc;
      if (dedicatedToolIcon) dedicatedToolIcon.textContent = tool.icon || '⚡';
      if (dedicatedInputLabel) dedicatedInputLabel.textContent = tool.label || 'Your Topic / Idea';
      if (dedicatedToolInput) dedicatedToolInput.placeholder = tool.placeholder || 'Enter your topic...';

      // Restore saved session inputs and outputs
      const savedInput = sessionStorage.getItem(`mtv_creator_input_${toolId}`) || '';
      const savedOutput = sessionStorage.getItem(`mtv_creator_output_${toolId}`) || '';

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
          sessionStorage.setItem(`mtv_creator_input_${toolId}`, dedicatedToolInput.value);
        };
      }

      // Modifiers selector visibility based on active tool (Language for Translate, Tone for Grammar Polish)
      const languageWrap = document.getElementById('dedicated-language-wrap');
      const toneWrap = document.getElementById('dedicated-tone-wrap');

      if (toolId === 'translate') {
        if (languageWrap) languageWrap.style.display = 'flex';
        if (toneWrap) toneWrap.style.display = 'none';
      } else if (toolId === 'grammar-polish') {
        if (languageWrap) languageWrap.style.display = 'none';
        if (toneWrap) toneWrap.style.display = 'flex';
      } else {
        if (languageWrap) languageWrap.style.display = 'none';
        if (toneWrap) toneWrap.style.display = 'none';
      }

      // Bind tool to MTV AI Engine (with resilient retry if script was defer-loaded)
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
            sessionStorage.setItem(`mtv_creator_output_${toolId}`, text);
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

      // Render Related Creator Tools (3 related tools)
      const relatedGrid = document.getElementById('dedicated-related-tools-grid');
      if (relatedGrid) {
        relatedGrid.innerHTML = '';
        const allToolKeys = Object.keys(CREATOR_TOOLS_DATA);
        const currentIndex = allToolKeys.indexOf(toolId);
        const selectedKeys = [];
        for (let i = 1; i <= allToolKeys.length && selectedKeys.length < 3; i++) {
          const relKey = allToolKeys[(currentIndex + i) % allToolKeys.length];
          if (relKey !== toolId) {
            selectedKeys.push(relKey);
          }
        }

        selectedKeys.forEach(relId => {
          const relTool = CREATOR_TOOLS_DATA[relId];
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

          card.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState(null, '', `?tool=${encodeURIComponent(relId)}`);
            updateViewFromURL();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });

          relatedGrid.appendChild(card);
        });
      }
    } else {
      if (toolsListView) toolsListView.style.display = 'block';
      if (dedicatedWorkspace) dedicatedWorkspace.style.display = 'none';

      if (breadcrumbSubPage) breadcrumbSubPage.style.display = 'none';
      if (breadcrumbSubSeparator) breadcrumbSubSeparator.style.display = 'none';
    }
  }

  // 5. Breadcrumb & History Navigation
  if (breadcrumbParent) {
    breadcrumbParent.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', 'creator-tools.html');
      updateViewFromURL();
      window.scrollTo({ top: 0 });
    });
  }

  window.addEventListener('popstate', () => {
    updateViewFromURL();
  });

  // 6. Copy and Clear Buttons
  function copyTextToClipboard(text, successMsg) {
    if (!text || !text.trim()) {
      showToast('No content to copy.');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(successMsg))
        .catch(() => fallbackCopyText(text, successMsg));
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
        sessionStorage.removeItem(`mtv_creator_input_${toolId}`);
        sessionStorage.removeItem(`mtv_creator_output_${toolId}`);
      }
      showToast('Cleared output');
    });
  }

  // Initial boot
  setupCategoryFilters();
  renderAllCards();

  const urlCat = new URLSearchParams(window.location.search).get('category');
  if (urlCat) {
    activeCategory = urlCat;
    if (categoryFiltersWrap) {
      categoryFiltersWrap.querySelectorAll('.filter-chip').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === urlCat);
      });
    }
  }

  filterAndRenderCards();
  updateViewFromURL();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCreatorTools);
} else {
  bootCreatorTools();
}
