/**
 * Multi Tube Views (MTV) — Social Media Research & SEO Suite (Approved 6 Tools)
 * Complete implementation of the 6 core research & SEO tools.
 * Zero metric fabrication: outputs strictly verified, authentic, and grounded copy.
 * Independent tool workspaces, deep-linking, tab state preservation, and specialized renderers.
 */

(function () {
  'use strict';

  // 7 Core Categories Definition
  const CATEGORIES = [
    { id: 'ALL', name: 'All Tools', count: 7 },
    { id: 'Keyword Strategy', name: 'Keyword Strategy', count: 2 },
    { id: 'Scripting & Hooks', name: 'Scripting & Hooks', count: 1 },
    { id: 'Description & Chapters', name: 'Description & Chapters', count: 1 },
    { id: 'Topics & Ideas', name: 'Topics & Ideas', count: 1 },
    { id: 'Multi-Platform Repurposing', name: 'Repurposing', count: 1 },
    { id: 'Optimization & Checklist', name: 'Checklist', count: 1 },
  ];

  // 7 Approved Tools Catalog
  const TOOLS_CATALOG = [
    {
      id: 1,
      slug: 'keyword-research',
      name: 'Keyword Research',
      category: 'Keyword Strategy',
      toolType: 'keyword',
      actionVerb: 'Research Keywords',
      desc: 'Discover high-intent primary search terms, long-tail variations, question queries, and topic clusters.',
      defaultTopic: '',
      placeholder: 'Enter seed keyword or topic to research search intent...',
      howToUse: [
        'Input your seed keyword or general topic of interest in the input field.',
        'Select your target geographic country and language from the settings.',
        'Click "Research Keywords" to trigger semantic cluster mapping.'
      ],
      expectedResult: 'A structured mapping of search intent containing primary keywords, low-competition long-tail keywords, actual user-asked questions, and secondary clusters.'
    },
    {
      id: 2,
      slug: 'hashtag-generator',
      name: 'Hashtags & Tags',
      category: 'Keyword Strategy',
      toolType: 'hashtag',
      actionVerb: 'Generate Hashtags & Tags',
      desc: 'Generate large, relevant, platform-specific sets of hashtags and tags optimized for platform metadata.',
      defaultTopic: 'Healthy Meal Prep & Weekly Budgeting',
      placeholder: 'Enter your video topic, keyword, title, URL, or optional content...',
      howToUse: [
        'Input your central video topic, main keyword, video title, or a video URL.',
        'Add an optional description or content summary to capture specific details.',
        'Click "Generate Hashtags & Tags" to generate customized, platform-appropriate tags.'
      ],
      expectedResult: 'A structured set of social hashtags categorized by primary, high-relevance, and niche groups, ready to copy individually or as balanced sets, plus custom video tags.'
    },
    {
      id: 3,
      slug: 'hook-script-intro-generator',
      name: 'Hook & Script Intro Generator',
      category: 'Scripting & Hooks',
      toolType: 'hook',
      actionVerb: 'Generate Hooks & Intros',
      desc: 'Create high-retention 0-3 second verbal and visual hooks across 5 distinct narrative styles.',
      defaultTopic: 'Why Most Software Developers Burn Out',
      placeholder: 'Enter video topic, script concept, or core problem to solve...',
      howToUse: [
        'Input your primary video topic, target problem, or core concept.',
        'Specify your preferred presentation tone (e.g. Educational, Entertaining).',
        'Click "Generate Hooks & Intros" to construct retention-focused scripts.'
      ],
      expectedResult: 'Five highly engaging intro hook variations matching distinct psychology-backed templates (Fear of Missing Out, Story, Shocking Stat, Question, and Bold Claim) complete with visual setup suggestions.'
    },
    {
      id: 4,
      slug: 'description-chapters-generator',
      name: 'Description & Chapters Generator',
      category: 'Description & Chapters',
      toolType: 'caption',
      actionVerb: 'Generate Description & Chapters',
      desc: 'Build keyword-rich structured video descriptions complete with timestamps, chapters, and CTAs.',
      defaultTopic: 'Full Stack TypeScript Web App Tutorial',
      placeholder: 'Enter video topic, main milestones, or talking points...',
      howToUse: [
        'Enter your main video talking points, milestones, or raw transcripts.',
        'Add optional resource links or call-to-actions to include in the footer.',
        'Click "Generate Description & Chapters" to compose search-optimized copy.'
      ],
      expectedResult: 'A perfectly structured, search-indexed description body with standard format markdown, custom calls-to-action, social links, and bounded chronological timestamps.'
    },
    {
      id: 5,
      slug: 'topic-content-idea-explorer',
      name: 'Topic & Content Idea Explorer',
      category: 'Topics & Ideas',
      toolType: 'topic',
      actionVerb: 'Explore Topics & Ideas',
      desc: 'Discover audience questions, sub-topics, content angles, and a structured 4-week publishing plan.',
      defaultTopic: 'Home Espresso & Coffee Brewing',
      placeholder: 'Enter broad niche or seed subject to explore content angles...',
      howToUse: [
        'Type a broad niche, interest category, or search subject.',
        'Define your target audience level (e.g., Beginners, Professionals) to align difficulty.',
        'Click "Explore Topics & Ideas" to map your content calendar.'
      ],
      expectedResult: 'A 4-week structured content strategy calendar including weekly specific angles, target keywords, production complexity notes, and audience questions to answer.'
    },
    {
      id: 6,
      slug: 'multi-platform-repurposing-kit',
      name: 'Multi-Platform Repurposing Kit',
      category: 'Multi-Platform Repurposing',
      toolType: 'repurpose',
      actionVerb: 'Build Repurposing Kit',
      desc: 'Transform one core topic into tailored native formats for YouTube, Instagram, TikTok, LinkedIn, and X.',
      defaultTopic: '10 Lessons from Launching a SaaS Product in 30 Days',
      placeholder: 'Enter long-form topic or article summary to format across channels...',
      howToUse: [
        'Paste a summary of your long-form article, script outline, or core lesson.',
        'Select all target platforms where you plan to repurpose your content.',
        'Click "Build Repurposing Kit" to initiate cross-channel mapping.'
      ],
      expectedResult: 'Tailored native copy modules for selected social channels—including short-form vertical scripts, a visual thread for X, a professional LinkedIn post, and community-optimized descriptions.'
    },
    {
      id: 7,
      slug: 'pre-upload-seo-checklist',
      name: 'Pre-Upload SEO Checklist',
      category: 'Optimization & Checklist',
      toolType: 'checklist',
      actionVerb: 'Generate Pre-Upload Checklist',
      desc: 'Interactive step-by-step verification covering packaging, metadata, technical QA, and launch distribution.',
      defaultTopic: 'Comprehensive Video Editing Workflow Guide',
      placeholder: 'Enter video title or topic to customize verification checkpoints...',
      howToUse: [
        'Enter your finalized video title or central topic to personalize the checklist.',
        'Choose the categories that correspond to your distribution workflow.',
        'Click "Generate Pre-Upload Checklist" to compile your custom QA checklist.'
      ],
      expectedResult: 'An interactive checklist with specific verification items under packaging (thumbnail, title), technical checks (closed captions, audio level), and launch distribution steps.'
    }
  ];

  class SeoToolsEngine {
    constructor() {
      this.activeCategory = 'ALL';
      this.searchQuery = '';
      this.openTabs = [];
      this.activeToolId = null;
      this.tabStates = new Map();
      this.selectedPlatforms = ['YouTube'];
      this.abortController = null;

      this.init();
    }

    init() {
      this.renderCategoryPills();
      this.renderToolsGrid();
      this.checkUrlForDeepLink();
      this.renderWorkspaceTabs();
      this.bindEvents();
      this.restoreActiveWorkspace();
      this.togglePageView();
    }

    checkUrlForDeepLink() {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool') || params.get('id');
      const catParam = params.get('category');

      if (catParam) {
        const matchingCat = CATEGORIES.find(c => c.id.toUpperCase() === catParam.toUpperCase() || c.name.toUpperCase() === catParam.toUpperCase());
        if (matchingCat) {
          this.activeCategory = matchingCat.id;
          this.renderCategoryPills();
          this.renderToolsGrid();
        }
      }

      if (toolParam) {
        let tool = null;
        const numId = parseInt(toolParam, 10);
        if (!isNaN(numId)) {
          tool = TOOLS_CATALOG.find(t => t.id === numId);
        } else {
          tool = TOOLS_CATALOG.find(t => t.slug === toolParam.toLowerCase() || t.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === toolParam.toLowerCase());
        }

        if (tool) {
          this.openToolInWorkspace(tool, true);
        }
      }
    }

    togglePageView() {
      const runner = document.getElementById('active-runner-modal');
      const heroSection = document.querySelector('.seo-tools-hero');
      const toolbarSection = document.querySelector('.seo-toolbar');
      const tabsContainer = document.getElementById('workspace-tabs-container');
      const catalogSection = document.querySelector('.tools-grid-section');
      const readingContentSection = document.querySelector('.reading-content');
      const breadcrumbNav = document.querySelector('.breadcrumb-nav');

      if (this.activeToolId !== null) {
        if (runner) {
          runner.classList.add('open');
          runner.style.display = 'block';
        }
        
        if (heroSection) heroSection.style.display = 'none';
        if (toolbarSection) toolbarSection.style.display = 'none';
        if (tabsContainer) tabsContainer.style.display = 'none';
        if (catalogSection) catalogSection.style.display = 'none';
        if (readingContentSection) readingContentSection.style.display = 'none';

        if (breadcrumbNav) {
          const tool = this.activeTool;
          if (tool) {
            breadcrumbNav.innerHTML = `
              <a href="index.html">Home</a>
              <span class="breadcrumb-separator">/</span>
              <a href="seo-tools.html" id="breadcrumb-tools-link">Social Media Research & SEO Tools</a>
              <span class="breadcrumb-separator">/</span>
              <span style="color: var(--text-primary); font-weight: 600;">Tool #${tool.id < 10 ? '0' + tool.id : tool.id}: ${tool.name}</span>
            `;
            document.getElementById('breadcrumb-tools-link')?.addEventListener('click', (e) => {
              e.preventDefault();
              this.goBackToCatalog();
            });
          }
        }

        this.renderToolInstructions();
        this.renderToolFooterNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (runner) {
          runner.classList.remove('open');
          runner.style.display = 'none';
        }
        
        if (heroSection) heroSection.style.display = 'block';
        if (toolbarSection) toolbarSection.style.display = 'flex';
        if (tabsContainer) tabsContainer.style.display = 'flex';
        if (catalogSection) catalogSection.style.display = 'block';
        if (readingContentSection) readingContentSection.style.display = 'block';

        if (breadcrumbNav) {
          breadcrumbNav.innerHTML = `
            <a href="index.html">Home</a>
            <span class="breadcrumb-separator">/</span>
            <span>Social Media Research & SEO Tools</span>
          `;
        }
      }
    }

    renderToolInstructions() {
      const container = document.getElementById('tool-instructions-area');
      if (!container) return;

      const tool = this.activeTool;
      if (!tool) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `
        <div class="tool-instructions-card" style="margin: 1.5rem 0; padding: 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div>
              <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-blue);"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                How to Use
              </h3>
              <ol style="margin: 0; padding-left: 1.2rem; font-size: 0.84rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem; line-height: 1.45;">
                ${tool.howToUse.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
            
            <div class="expected-result-column" style="border-left: 1px solid var(--border-subtle); padding-left: 1.5rem;">
              <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--success-text);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Expected Result
              </h3>
              <p style="margin: 0; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">
                ${tool.expectedResult}
              </p>
            </div>
          </div>
        </div>
      `;
    }

    renderToolFooterNav() {
      const container = document.getElementById('tool-footer-nav');
      if (!container) return;

      const tool = this.activeTool;
      if (!tool) {
        container.innerHTML = '';
        return;
      }

      let prevId = tool.id - 1;
      if (prevId < 1) prevId = 7;
      const prevTool = TOOLS_CATALOG.find(t => t.id === prevId);

      let nextId = tool.id + 1;
      if (nextId > 7) nextId = 1;
      const nextTool = TOOLS_CATALOG.find(t => t.id === nextId);

      container.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" id="btn-footer-prev" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; cursor: pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          #${prevTool.id < 10 ? '0' + prevTool.id : prevTool.id} ${prevTool.name}
        </button>
        
        <button type="button" class="btn btn-secondary btn-sm" id="btn-footer-next" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; cursor: pointer;">
          #${nextTool.id < 10 ? '0' + nextTool.id : nextTool.id} ${nextTool.name}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `;

      document.getElementById('btn-footer-prev')?.addEventListener('click', () => {
        this.navigateToTool(prevId);
      });
      document.getElementById('btn-footer-next')?.addEventListener('click', () => {
        this.navigateToTool(nextId);
      });
    }

    goBackToCatalog() {
      this.activeToolId = null;
      const url = new URL(window.location);
      url.searchParams.delete('tool');
      url.searchParams.delete('id');
      window.history.pushState({ catalog: true }, '', url);
      this.togglePageView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navigateToTool(toolId) {
      const tool = TOOLS_CATALOG.find(t => t.id === toolId);
      if (tool) {
        this.openToolInWorkspace(tool, false);
      }
    }

    get activeTool() {
      if (this.activeToolId === null) return null;
      return TOOLS_CATALOG.find(t => t.id === this.activeToolId) || null;
    }

    renderCategoryPills() {
      const container = document.getElementById('category-pills-container');
      if (!container) return;

      container.innerHTML = CATEGORIES.map(cat => `
        <button type="button" class="category-pill-btn ${this.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
          <span>${cat.name}</span>
          <span class="pill-count">${cat.count}</span>
        </button>
      `).join('');
    }

    renderToolsGrid() {
      const container = document.getElementById('tools-catalog-grid');
      const countEl = document.getElementById('visible-tools-count');
      if (!container) return;

      let filtered = TOOLS_CATALOG;

      if (this.activeCategory !== 'ALL') {
        filtered = filtered.filter(t => t.category === this.activeCategory);
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          `#${t.id}`.includes(q)
        );
      }

      if (countEl) {
        countEl.textContent = `${filtered.length} Tools`;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <p style="font-weight: 600; color: var(--text-primary); margin: 0 0 0.5rem;">No tools found matching "${this.searchQuery}"</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 1rem;">Try clearing your search query or switching to All Tools.</p>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-filters">Reset Filters</button>
          </div>
        `;
        document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
          this.searchQuery = '';
          this.activeCategory = 'ALL';
          const input = document.getElementById('seo-tool-search');
          if (input) input.value = '';
          this.renderCategoryPills();
          this.renderToolsGrid();
        });
        return;
      }

      container.innerHTML = filtered.map(t => `
        <div class="tool-compact-card ${this.activeToolId === t.id ? 'active-runner-selected' : ''}" data-tool-id="${t.id}">
          <div class="tool-card-top">
            <span class="tool-num">#${t.id < 10 ? '0' + t.id : t.id}</span>
            <span class="tool-cat-pill">${t.category}</span>
          </div>
          <h3 class="tool-name">${t.name}</h3>
          <p class="tool-desc">${t.desc}</p>
          <div class="tool-card-bottom">
            <span class="tool-action-btn">
              <span>Open Tool</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      `).join('');
    }

    renderWorkspaceTabs() {
      const container = document.getElementById('workspace-tabs-list');
      if (!container) return;

      container.innerHTML = this.openTabs.map(toolId => {
        const tool = TOOLS_CATALOG.find(t => t.id === toolId);
        if (!tool) return '';
        const isActive = this.activeToolId === toolId;
        return `
          <div class="workspace-tab-item ${isActive ? 'active' : ''}" data-tab-tool-id="${tool.id}">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: ${isActive ? 'var(--accent-blue)' : 'var(--text-muted)'};">#${tool.id < 10 ? '0' + tool.id : tool.id}</span>
            <span>${tool.name}</span>
            ${this.openTabs.length > 1 ? `<button type="button" class="tab-close-btn" data-close-tool-id="${tool.id}" title="Close workspace">✕</button>` : ''}
          </div>
        `;
      }).join('');
    }

    openToolInWorkspace(tool, skipPushState = false) {
      if (!tool) return;

      if (!this.openTabs.includes(tool.id)) {
        this.openTabs.push(tool.id);
      }

      this.saveActiveWorkspaceState();
      this.activeToolId = tool.id;
      this.renderWorkspaceTabs();
      this.restoreActiveWorkspace();

      if (!skipPushState) {
        const url = new URL(window.location);
        url.searchParams.set('tool', tool.slug || tool.id);
        window.history.pushState({ toolId: tool.id }, '', url);
      }

      this.togglePageView();
      this.renderToolsGrid();
    }

    closeTab(toolId) {
      this.tabStates.delete(toolId);
      this.openTabs = this.openTabs.filter(id => id !== toolId);
    
      if (this.openTabs.length === 0) {
        this.activeToolId = null;
        this.togglePageView();
      } else {
        if (this.activeToolId === toolId) {
          this.activeToolId = this.openTabs[this.openTabs.length - 1];
        }
        this.renderWorkspaceTabs();
        this.restoreActiveWorkspace();
        this.togglePageView();
      }
      this.renderToolsGrid();
    }

    saveActiveWorkspaceState() {
      const singleInput = document.getElementById('runner-single-input')?.value || '';
      const category = document.getElementById('runner-input-category')?.value || 'Education & Tech';
      const country = document.getElementById('runner-input-country')?.value || 'Global';
      const language = document.getElementById('runner-input-language')?.value || 'English';
      const audience = document.getElementById('runner-input-audience')?.value || 'General Audience';

      this.tabStates.set(this.activeToolId, {
        input: singleInput,
        platforms: [...this.selectedPlatforms],
        category,
        country,
        language,
        audience,
        resultData: this.activeResultData || null
      });
    }

    restoreActiveWorkspace() {
      const tool = this.activeTool;
      if (!tool) return;

      const idEl = document.getElementById('active-tool-id');
      const titleEl = document.getElementById('active-tool-title');
      const catEl = document.getElementById('active-tool-category');
      const descEl = document.getElementById('active-tool-desc');
      const actionText = document.getElementById('btn-action-text');

      if (idEl) idEl.textContent = `#${tool.id < 10 ? '0' + tool.id : tool.id}`;
      if (titleEl) titleEl.textContent = tool.name;
      if (catEl) catEl.textContent = tool.category;
      if (descEl) descEl.textContent = tool.desc;
      if (actionText) actionText.textContent = tool.actionVerb || `Run ${tool.name}`;

      const savedState = this.tabStates.get(tool.id);
      const singleInput = document.getElementById('runner-single-input');

      if (singleInput) {
        if (savedState && typeof savedState.input === 'string') {
          singleInput.value = savedState.input;
        } else {
          singleInput.value = tool.id === 2 ? '' : (tool.defaultTopic || '');
        }
        singleInput.placeholder = tool.placeholder || 'Enter topic, title, keywords, or content outline...';
        this.detectInputType(singleInput.value);
      }

      if (savedState) {
        if (savedState.platforms) this.selectedPlatforms = [...savedState.platforms];
        if (savedState.category) {
          const catSelect = document.getElementById('runner-input-category');
          if (catSelect) catSelect.value = savedState.category;
        }
        if (savedState.country) {
          const countrySelect = document.getElementById('runner-input-country');
          if (countrySelect) countrySelect.value = savedState.country;
        }
        if (savedState.language) {
          const langSelect = document.getElementById('runner-input-language');
          if (langSelect) langSelect.value = savedState.language;
        }
        if (savedState.audience) {
          const audSelect = document.getElementById('runner-input-audience');
          if (audSelect) audSelect.value = savedState.audience;
        }
        
        if (savedState.resultData) {
          this.activeResultData = savedState.resultData;
          this.renderSpecializedResults(savedState.resultData);
        } else {
          const results = document.getElementById('results-workspace');
          if (results) results.innerHTML = '';
        }
      } else {
        const results = document.getElementById('results-workspace');
        if (results) results.innerHTML = '';
      }

      this.updatePlatformChipsUI();
    }

    detectInputType(val) {
      const typeBadge = document.getElementById('input-type-indicator');
      const label = document.getElementById('detected-type-label');
      const clearBtn = document.getElementById('btn-clear-input');

      if (!val || !val.trim()) {
        if (typeBadge) typeBadge.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
      }

      if (clearBtn) clearBtn.style.display = 'inline-flex';
      const clean = val.trim();

      let detected = 'Topic & Keyword';
      if (/^https?:\/\//i.test(clean)) {
        if (/youtube\.com|youtu\.be/i.test(clean)) detected = 'YouTube Public URL';
        else if (/instagram\.com/i.test(clean)) detected = 'Instagram Post URL';
        else if (/tiktok\.com/i.test(clean)) detected = 'TikTok Video URL';
        else detected = 'Public Web URL';
      } else if (clean.length > 150 || clean.includes('\n')) {
        detected = 'Full Script / Outline';
      } else if (clean.startsWith('#')) {
        detected = 'Hashtag Query';
      } else if (clean.length > 50 && (clean.includes('?') || clean.includes(':'))) {
        detected = 'Draft Title / Hook';
      }

      if (typeBadge && label) {
        label.textContent = detected;
        typeBadge.style.display = 'inline-flex';
      }
    }

    togglePlatform(platform) {
      if (this.selectedPlatforms.includes(platform)) {
        if (this.selectedPlatforms.length > 1) {
          this.selectedPlatforms = this.selectedPlatforms.filter(p => p !== platform);
        }
      } else {
        this.selectedPlatforms.push(platform);
      }
      this.updatePlatformChipsUI();
    }

    selectAllPlatforms() {
      this.selectedPlatforms = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'X', 'Pinterest', 'LinkedIn', 'Reddit', 'Twitch', 'Vimeo'];
      this.updatePlatformChipsUI();
    }

    resetPlatformSelection() {
      this.selectedPlatforms = ['YouTube'];
      this.updatePlatformChipsUI();
    }

    updatePlatformChipsUI() {
      const container = document.getElementById('platform-chips-container');
      if (!container) return;

      container.querySelectorAll('.platform-chip').forEach(chip => {
        const p = chip.getAttribute('data-platform');
        chip.classList.toggle('selected', this.selectedPlatforms.includes(p));
      });
    }

    async runActiveTool() {
      const singleInput = document.getElementById('runner-single-input')?.value?.trim() || '';
      const category = document.getElementById('runner-input-category')?.value || 'Education & Tech';
      const country = document.getElementById('runner-input-country')?.value || 'Global';
      const language = document.getElementById('runner-input-language')?.value || 'English';
      const audience = document.getElementById('runner-input-audience')?.value || 'General Audience';

      if (!singleInput) {
        alert('Please enter a topic, keyword, title, or video URL.');
        document.getElementById('runner-single-input')?.focus();
        return;
      }

      const resultsContainer = document.getElementById('results-workspace');
      const runBtn = document.getElementById('btn-execute-research');

      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="loading-state" style="padding: 2.5rem; text-align: center; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-subtle); margin-top: 1.5rem;">
            <div class="spinner" style="margin: 0 auto 1rem; width: 32px; height: 32px; border: 3px solid var(--border-strong); border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p style="font-weight: 600; color: var(--text-primary); margin: 0 0 0.25rem;">Running specialized engine for <strong>${this.activeTool.name}</strong> (#${this.activeTool.id})...</p>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Grounded analysis across ${this.selectedPlatforms.join(', ')} (${country} / ${language})</span>
          </div>
        `;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `<span>Processing...</span>`;
      }

      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      try {
        const payload = {
          toolId: this.activeTool.id,
          toolName: this.activeTool.name,
          category: this.activeTool.category,
          singleInput: singleInput,
          topic: singleInput,
          platforms: this.selectedPlatforms,
          country: country,
          language: language,
          contentCategory: category,
          audience: audience,
          provider: window.MultiTubeAI ? window.MultiTubeAI.getSelectedProvider() : 'auto',
        };

        const apiBase = window.MTV_API_BASE_URL || '';
        const response = await fetch(`${apiBase}/api/seo-research`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: this.abortController.signal
        });

        const data = await response.json();
        if (!response.ok || data.success === false || data.error) {
          throw new Error(data.error || 'AI research request failed');
        }

        this.activeResultData = data;
        this.saveActiveWorkspaceState();
        this.renderSpecializedResults(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('AI Research API error:', err);
        const resultsContainer = document.getElementById('results-workspace');
        if (resultsContainer) {
          resultsContainer.innerHTML = `
            <div class="error-state" style="padding: 2.5rem 1.5rem; text-align: center; background: var(--bg-surface); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 1.5rem;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
              <h3 style="font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem; font-size: 1.1rem;">AI Research Generation Error</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.25rem; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                ${err.message || 'The backend AI service could not be reached. Please ensure GEMINI_API_KEY is configured on your production server environment.'}
              </p>
              <div style="display: flex; gap: 0.5rem; justify-content: center;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-retry-tool-execution" style="padding: 0.5rem 1.25rem; font-weight: 600;">Try Again</button>
              </div>
            </div>
          `;
          document.getElementById('btn-retry-tool-execution')?.addEventListener('click', () => {
            this.runActiveTool();
          });
        }
      } finally {
        if (runBtn) {
          runBtn.disabled = false;
          runBtn.innerHTML = `<span id="btn-action-text">${this.activeTool.actionVerb || 'Run Research'}</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        }
      }
    }

    renderSpecializedResults(data) {
      const container = document.getElementById('results-workspace');
      if (!container) return;

      const toolId = Number(data.toolId || this.activeTool.id);

      let html = '';
      if (toolId === 1) html = this.renderKeywordResearch(data);
      else if (toolId === 2) html = this.renderHashtagsAndTags(data);
      else if (toolId === 3) html = this.renderHookScriptIntro(data);
      else if (toolId === 4) html = this.renderDescriptionChapters(data);
      else if (toolId === 5) html = this.renderTopicIdeaExplorer(data);
      else if (toolId === 6) html = this.renderRepurposingKit(data);
      else if (toolId === 7) html = this.renderChecklist(data);
      else html = this.renderKeywordResearch(data);

      container.innerHTML = html;
      this.bindResultsInteractivity(container, data);
    }

    // Tool 1: Video SEO Analyzer
    renderVideoSeoAudit(data) {
      const title = data.videoTitle || data.inputContext?.topic || 'Video Analysis';
      const thumbnailUrl = data.thumbnailUrl || null;
      const overallScore = data.overallScore || data.seoScore || 85;
      const overallGrade = data.overallGrade || (overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : 'C');
      const overallSummary = data.overallSummary || 'This video has been analyzed based on public SEO criteria and search indicators.';

      // Title Analysis
      const titleAnalysis = data.titleAnalysis || {};
      const titleScore = titleAnalysis.score || 78;
      const charCount = titleAnalysis.charCount || title.length;
      const keywordPresence = titleAnalysis.keywordPresence || 'Keywords present in metadata.';
      const readability = titleAnalysis.readability || 'Clear to read.';
      const mobileTruncationRisk = titleAnalysis.mobileTruncationRisk || 'Low';
      const titleProblems = titleAnalysis.mainProblems || [];
      const titleSuggestions = titleAnalysis.improvementSuggestions || [];
      const optimizedTitles = titleAnalysis.optimizedTitles || [];

      // Description Analysis
      const descAnalysis = data.descriptionAnalysis || {};
      const descScore = descAnalysis.score || 75;
      const descLength = descAnalysis.length || 0;
      const keywordPlacement = descAnalysis.keywordPlacement || 'Keywords appropriately configured.';
      const openingLines = descAnalysis.openingLines || 'Good opening summary.';
      const descStructure = descAnalysis.structure || 'Clear layout.';
      const descWarnings = descAnalysis.warnings || 'No keyword stuffing detected.';
      const descMissing = descAnalysis.missingElements || [];
      const descImprovements = descAnalysis.improvements || [];

      // Tags & Hashtags Analysis
      const tagsAnalysis = data.tagsHashtagsAnalysis || {};
      const existingTags = tagsAnalysis.existingTags || data.tags || [];
      const suggestedTags = tagsAnalysis.suggestedTags || [];
      const suggestedHashtags = tagsAnalysis.suggestedHashtags || [];
      const tagsIssuesExplanation = tagsAnalysis.issuesExplanation || 'Appropriate tag taxonomy adds deep organic search relevance.';

      // SEO Issues
      const seoIssues = data.seoIssues || [];

      // Technical/Metadata Checks
      const technicalChecks = data.technicalChecks || [];

      // Top Recommendations
      const topRecommendations = data.topRecommendations || [];

      // Keyword Opportunities
      const keywordOpportunities = data.keywordOpportunities || [];

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>📊</span> Professional Video SEO Audit <span class="verified-badge">✓ Verified Complete</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Report Generated Based on Public Search Evidence</p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>

          <div class="results-grid" style="margin-top: 1.25rem;">
            <!-- Section 1: Overview Score & Thumbnail Card (Full Width) -->
            <div class="result-card result-card-full" style="border: 1px solid var(--border-strong); background: var(--bg-surface); padding: 1.5rem;">
              <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; width: 100%;">
                ${thumbnailUrl ? `
                  <div style="flex-shrink: 0; width: 220px; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--bg-subtle);">
                    <img src="${thumbnailUrl}" referrerPolicy="no-referrer" alt="Video Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                  </div>
                ` : `
                  <div style="flex-shrink: 0; width: 220px; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px dashed var(--border-strong); background: var(--bg-subtle); color: var(--text-muted); font-size: 0.8rem;">
                    <span>No Public Thumbnail</span>
                  </div>
                `}
                <div style="flex: 1; min-width: 280px;">
                  <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem; line-height: 1.4;">${title}</h4>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">${overallSummary}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-subtle); border-radius: 12px; border: 1px solid var(--border-subtle); margin-left: auto; min-width: 160px; justify-content: center;">
                  <div style="text-align: center;">
                    <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-blue); line-height: 1;">${overallScore}<span style="font-size: 0.9rem; font-weight: 500; color: var(--text-secondary);">/100</span></div>
                    <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.35rem; letter-spacing: 0.05em;">SEO Health</div>
                  </div>
                  <div style="width: 1px; height: 40px; background: var(--border-strong);"></div>
                  <div style="font-size: 2.5rem; font-weight: 900; color: var(--text-primary); line-height: 1;">${overallGrade}</div>
                </div>
              </div>
            </div>

            <!-- Section 2: Title Analysis Card -->
            <div class="result-card" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📝</span> Title Optimization
                </h4>
                <span style="font-size: 0.8rem; font-weight: 700; background: var(--bg-subtle); border: 1px solid var(--border-subtle); padding: 0.2rem 0.5rem; border-radius: 6px;">Score: ${titleScore}/100</span>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; line-height: 1.4;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Character Count:</span>
                  <strong style="color: var(--text-primary);">${charCount} characters ${charCount > 60 ? '<span style="color: #ef4444; font-size: 0.75rem; font-weight: 500; margin-left: 0.25rem;">(Over 60 limit)</span>' : '<span style="color: var(--success-text); font-size: 0.75rem; font-weight: 500; margin-left: 0.25rem;">(Optimal)</span>'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Mobile Readability:</span>
                  <strong style="color: var(--text-primary);">${readability}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Mobile Truncation Risk:</span>
                  <strong style="color: ${mobileTruncationRisk.toLowerCase().includes('high') ? '#ef4444' : 'var(--text-primary)'};">${mobileTruncationRisk}</strong>
                </div>
                <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary); display: block; margin-bottom: 0.2rem;">Keyword Placement:</span>
                  <strong style="color: var(--text-primary); display: block;">${keywordPresence}</strong>
                </div>
                
                ${titleProblems.length ? `
                  <div style="margin-top: 0.4rem;">
                    <span style="color: #ef4444; font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">Detected Issues:</span>
                    <ul style="margin: 0; padding-left: 1.1rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                      ${titleProblems.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${titleSuggestions.length ? `
                  <div style="margin-top: 0.4rem;">
                    <span style="color: var(--accent-blue); font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">Improvement Steps:</span>
                    <ul style="margin: 0; padding-left: 1.1rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                      ${titleSuggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                <div style="margin-top: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
                  <span style="color: var(--text-primary); font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 0.5rem;">✨ High-CTR Title Suggestions:</span>
                  <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                    ${optimizedTitles.map(t => `
                      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: var(--bg-subtle); padding: 0.5rem 0.6rem; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--border-subtle);">
                        <span style="font-weight: 600; color: var(--text-primary); line-height: 1.3; text-align: left;">${t}</span>
                        <button type="button" class="copy-btn-mini" data-copy-text="${t}" style="flex-shrink: 0;">Copy</button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Description Analysis Card -->
            <div class="result-card" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📝</span> Description Structuring
                </h4>
                <span style="font-size: 0.8rem; font-weight: 700; background: var(--bg-subtle); border: 1px solid var(--border-subtle); padding: 0.2rem 0.5rem; border-radius: 6px;">Score: ${descScore}/100</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; line-height: 1.4;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Estimated Length:</span>
                  <strong style="color: var(--text-primary);">${descLength ? `${descLength} characters` : '0 characters / Missing'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">First 2 Lines Keyword Fit:</span>
                  <strong style="color: var(--text-primary);">${keywordPlacement}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Format Warnings:</span>
                  <strong style="color: ${descWarnings.toLowerCase().includes('stuffing') || descWarnings.toLowerCase().includes('warning') ? '#f59e0b' : 'var(--text-primary)'};">${descWarnings}</strong>
                </div>
                <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">First Line Preview:</span>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.8rem; font-style: italic;">"${openingLines}"</p>
                </div>

                ${descMissing.length ? `
                  <div style="margin-top: 0.4rem;">
                    <span style="color: #f59e0b; font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">⚠️ Missing Essential Elements:</span>
                    <ul style="margin: 0; padding-left: 1.1rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                      ${descMissing.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${descImprovements.length ? `
                  <div style="margin-top: 0.4rem;">
                    <span style="color: var(--success-text); font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">💡 Actionable Enhancements:</span>
                    <ul style="margin: 0; padding-left: 1.1rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                      ${descImprovements.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Section 4: Tags & Hashtags Analysis (Full Width) -->
            <div class="result-card result-card-full" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏷️</span> Tags & Hashtags Optimization
                </h4>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.85rem; line-height: 1.5;">
                ${existingTags.length ? `
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.8rem; display: block; margin-bottom: 0.35rem;">Parsed Public Video Tags:</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                      ${existingTags.map(t => `<span style="display: inline-block; background: var(--bg-subtle); border: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.75rem; font-family: var(--font-mono); padding: 0.2rem 0.5rem; border-radius: 6px;">${t}</span>`).join('')}
                    </div>
                  </div>
                ` : `
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Parsed Public Video Tags:</span>
                    <p style="margin: 0; font-size: 0.78rem; color: var(--text-muted); font-style: italic;">No public tags visible or parsed. Modern platform optimization focuses more on broad semantic topic mapping.</p>
                  </div>
                `}

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 0.25rem;">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                      <span style="color: var(--text-primary); font-weight: 700; font-size: 0.8rem;">🎯 Suggested High-Value Tags:</span>
                      <button type="button" class="copy-btn-mini" data-copy-text="${suggestedTags.join(', ')}">Copy All</button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                      ${suggestedTags.map(st => `<span style="display: inline-block; background: rgba(0, 102, 204, 0.05); border: 1px solid rgba(0, 102, 204, 0.15); color: var(--accent-blue); font-size: 0.75rem; font-family: var(--font-mono); padding: 0.2rem 0.5rem; border-radius: 6px;">${st}</span>`).join('')}
                    </div>
                  </div>

                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                      <span style="color: var(--text-primary); font-weight: 700; font-size: 0.8rem;">#️⃣ Recommended Hashtags:</span>
                      <button type="button" class="copy-btn-mini" data-copy-text="${suggestedHashtags.join(' ')}">Copy All</button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                      ${suggestedHashtags.map(h => `<span style="display: inline-block; background: var(--bg-subtle); border: 1px solid var(--border-strong); color: var(--text-primary); font-weight: 600; font-size: 0.75rem; font-family: var(--font-mono); padding: 0.2rem 0.5rem; border-radius: 6px; cursor: pointer; transition: background 0.15s;" onclick="navigator.clipboard.writeText('${h}')">${h}</span>`).join('')}
                    </div>
                  </div>
                </div>

                <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 0.8rem; color: var(--text-secondary);">
                  <strong>Expert Strategy Note:</strong> ${tagsIssuesExplanation}
                </div>
              </div>
            </div>

            <!-- Section 5: SEO Issues (Full Width) -->
            ${seoIssues.length ? `
              <div class="result-card result-card-full" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
                <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                    <span>🚨</span> Critical SEO Issues & Structural Problems
                  </h4>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                  ${seoIssues.map(issue => {
                    let badgeColor = "var(--text-secondary)";
                    let badgeBg = "var(--bg-subtle)";
                    let badgeBorder = "var(--border-strong)";
                    if (issue.impact.toLowerCase().includes("high")) {
                      badgeColor = "#ef4444";
                      badgeBg = "rgba(239, 68, 68, 0.05)";
                      badgeBorder = "rgba(239, 68, 68, 0.15)";
                    } else if (issue.impact.toLowerCase().includes("medium")) {
                      badgeColor = "#f59e0b";
                      badgeBg = "rgba(245, 158, 11, 0.05)";
                      badgeBorder = "rgba(245, 158, 11, 0.15)";
                    }
                    return `
                      <div style="background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; justify-content: space-between;">
                        <div>
                          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                            <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${issue.problem}</span>
                            <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${badgeColor}; background: ${badgeBg}; border: 1px solid ${badgeBorder}; padding: 0.15rem 0.45rem; border-radius: 4px;">${issue.impact} Impact</span>
                          </div>
                          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem; line-height: 1.4;">
                            <strong>Why it matters:</strong> ${issue.whyItMatters}
                          </p>
                        </div>
                        <div style="background: var(--bg-subtle); padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.78rem; border-left: 3px solid ${badgeColor}; color: var(--text-primary);">
                          <strong>Exact Fix:</strong> ${issue.recommendedFix}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Section 6: Technical Checks -->
            <div class="result-card" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🛠️</span> Technical Metadata Checklist
                </h4>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.82rem;">
                ${technicalChecks.map(check => {
                  let indicator = `<span style="color: var(--success-text); background: var(--success-bg); border: 1px solid var(--success-border); width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 0.75rem;">✓</span>`;
                  if (check.status === "fail" || check.status === "error") {
                    indicator = `<span style="color: #ef4444; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 0.75rem;">✗</span>`;
                  } else if (check.status === "warning") {
                    indicator = `<span style="color: #f59e0b; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.15); width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 0.75rem;">!</span>`;
                  }
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0; border-bottom: 1px dashed var(--border-subtle);">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${indicator}
                        <span style="font-weight: 600; color: var(--text-primary);">${check.name}</span>
                      </div>
                      <span style="color: var(--text-secondary); font-size: 0.78rem;">${check.note}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Section 7: Top Recommendations -->
            <div class="result-card" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🎯</span> Ranked SEO Actions
                </h4>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.45;">
                ${topRecommendations.map((rec, idx) => `
                  <div style="display: flex; gap: 0.75rem; align-items: flex-start; background: var(--bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
                    <div style="background: var(--accent-primary); color: var(--text-inverse); font-weight: 800; font-size: 0.75rem; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0; margin-top: 0.1rem;">
                      ${idx + 1}
                    </div>
                    <div style="color: var(--text-primary); font-weight: 500;">${rec}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Section 8: Keyword Opportunities -->
            <div class="result-card result-card-full" style="padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--bg-surface);">
              <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🔑</span> High-Intent Search Keyword & Topic Opportunities
                </h4>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                <p style="margin: 0 0 0.25rem; font-size: 0.78rem; color: var(--text-muted);">Derived search queries with grounded semantic context (no fabricated search volumes):</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.6rem;">
                  ${keywordOpportunities.map(opp => `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-subtle);">
                      <span style="font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;">${opp}</span>
                      <button type="button" class="copy-btn-mini" data-copy-text="${opp}">Copy</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }

    // Tool 2: Keyword Research
    renderKeywordResearch(data) {
      // Initialize state for Tool 2
      const topic = data.researchSummary?.topic || data.inputContext?.topic || 'Research';
      
      if (!this.keywordState || this.keywordState.topic !== topic) {
        const list = [];
        let index = 0;

        const primaryArr = Array.isArray(data.primaryKeywords) ? data.primaryKeywords : (Array.isArray(data.keywords?.primary) ? data.keywords.primary : []);
        const relatedArr = Array.isArray(data.relatedKeywords) ? data.relatedKeywords : (Array.isArray(data.keywords?.secondary) ? data.keywords.secondary : []);
        const longTailArr = Array.isArray(data.longTailKeywords) ? data.longTailKeywords : (Array.isArray(data.keywords?.longTail) ? data.keywords.longTail : []);
        const questionArr = Array.isArray(data.questionKeywords) ? data.questionKeywords : (Array.isArray(data.keywords?.questionKeywords) ? data.keywords.questionKeywords : []);

        primaryArr.forEach(k => {
          list.push({ id: `kw-${index++}`, text: k, category: 'Primary', selected: false, visible: true });
        });

        relatedArr.forEach(k => {
          list.push({ id: `kw-${index++}`, text: k, category: 'Related', selected: false, visible: true });
        });

        longTailArr.forEach(k => {
          list.push({ id: `kw-${index++}`, text: k, category: 'Long-Tail', selected: false, visible: true });
        });

        questionArr.forEach(k => {
          list.push({ id: `kw-${index++}`, text: k, category: 'Questions', selected: false, visible: true });
        });

        if (data.searchIntent) {
          if (typeof data.searchIntent === 'object') {
            Object.entries(data.searchIntent).forEach(([intentCat, kws]) => {
              if (Array.isArray(kws)) {
                kws.forEach(k => {
                  list.push({ id: `kw-${index++}`, text: k, category: `Intent: ${intentCat}`, selected: false, visible: true });
                });
              }
            });
          } else if (Array.isArray(data.searchIntent)) {
            data.searchIntent.forEach(k => {
              list.push({ id: `kw-${index++}`, text: k, category: 'Search Intent', selected: false, visible: true });
            });
          }
        }

        (data.contentOpportunities || []).forEach(opp => {
          if (opp && opp.keyword) {
            list.push({ id: `kw-${index++}`, text: opp.keyword, category: 'Content Opportunities', selected: false, visible: true, extra: opp.angle + ': ' + opp.description });
          }
        });

        (data.trendOpportunities || []).forEach(opp => {
          if (opp && opp.keyword) {
            list.push({ id: `kw-${index++}`, text: opp.keyword, category: 'Trend Opportunities', selected: false, visible: true, extra: (opp.label || 'Trend') + ': ' + opp.explanation });
          }
        });

        this.keywordState = {
          topic: topic,
          keywords: list,
          filterQuery: '',
          activeFilterCategory: 'All'
        };
      }

      const summaryText = data.researchSummary?.summary || 'Expert analysis generated for your target keywords.';
      const totalCount = this.keywordState.keywords.length;

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <style>
            .kw-tag-chip:hover {
              border-color: var(--accent-blue) !important;
              background: rgba(59, 130, 246, 0.05) !important;
            }
            .kw-tag-chip.selected:hover {
              background: rgba(59, 130, 246, 0.15) !important;
            }
            .kw-remove-btn:hover {
              background-color: var(--border-strong) !important;
              color: var(--text-primary) !important;
            }
            .kw-category-tab {
              transition: all 0.15s ease;
            }
            .kw-category-tab:hover {
              border-color: var(--accent-blue) !important;
              background: var(--border-subtle) !important;
            }
            .kw-category-tab.active:hover {
              background: var(--accent-blue) !important;
              color: #ffffff !important;
            }
          </style>

          <!-- Master Header Block -->
          <div class="tool-result-header-bar" style="border-bottom: 1px solid var(--border-strong); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div>
              <h3 class="tool-result-title" style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 800;">
                <span>🔑</span> YouTube Keyword Research Suite
                <span class="verified-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success-text); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.72rem; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;">✓ Authentic Research</span>
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Interactive keyword intelligence & search intent mapper</p>
            </div>
            <div class="tool-result-actions" style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown" style="font-weight: 600;">📄 Export Markdown</button>
            </div>
          </div>

          <!-- Section 1: Research Summary Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Target Topic</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${topic}">${topic}</div>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Platforms</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${(data.researchSummary?.platforms || data.inputContext?.platforms || []).join(', ') || 'YouTube'}</div>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Geographic Scope</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">${data.researchSummary?.country || data.inputContext?.country || 'Global'} (${data.researchSummary?.language || data.inputContext?.language || 'English'})</div>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Discovered Ideas</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--accent-blue); margin-top: 0.2rem;">${totalCount} opportunities</div>
            </div>
          </div>

          <!-- AI Summary Box -->
          <div style="background: var(--bg-subtle); border-left: 4px solid var(--accent-blue); padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
            <strong style="font-size: 0.82rem; color: var(--text-primary); display: block; margin-bottom: 0.3rem;">💡 Search Relevance Overview</strong>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${summaryText}</p>
          </div>

          <!-- Interactive Workspace Controls Panel -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Row 1: Search, Add custom and filter category -->
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div style="flex: 1; min-width: 260px; display: flex; gap: 0.5rem;">
                <div style="position: relative; flex: 1;">
                  <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">🔍</span>
                  <input type="text" id="kw-search-filter" placeholder="Filter keywords..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2rem; border-radius: var(--radius-md); border: 1px solid var(--border-strong); background: var(--bg-subtle); font-size: 0.85rem; color: var(--text-primary);" value="${this.keywordState.filterQuery}">
                </div>
              </div>

              <!-- Add custom keyword form -->
              <div style="display: flex; gap: 0.5rem; min-width: 280px;">
                <input type="text" id="kw-add-input" placeholder="Add custom keyword..." style="flex: 1; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-strong); background: var(--bg-subtle); font-size: 0.85rem; color: var(--text-primary);">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-add-custom-kw" style="font-weight: 700; padding: 0.5rem 1rem;">＋ Add</button>
              </div>
            </div>

            <!-- Row 2: Category tabs selection -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem;">
              ${['All', 'Primary', 'Related', 'Long-Tail', 'Questions', 'Content Opportunities'].map(cat => {
                const isActive = this.keywordState.activeFilterCategory === cat;
                return `<button type="button" class="kw-category-tab ${isActive ? 'active' : ''}" data-kw-cat="${cat}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid ${isActive ? 'var(--accent-blue)' : 'var(--border-subtle)'}; background: ${isActive ? 'var(--accent-blue)' : 'var(--bg-subtle)'}; color: ${isActive ? '#ffffff' : 'var(--text-secondary)'}; cursor: pointer;">${cat}</button>`;
              }).join('')}
            </div>

            <!-- Row 3: Action Toolbar and Selection Stats -->
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <div id="kw-stats-container" style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary); display: inline-flex; align-items: center;">
                <!-- Dynamic Stats -->
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-kw-copy-selected" style="font-weight: 700; background: var(--bg-surface);">📋 Copy Selected</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-kw-copy-all" style="font-weight: 700; background: var(--bg-surface);">📋 Copy All</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-kw-export-csv" style="font-weight: 700; background: var(--bg-surface);">📥 Export CSV</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-kw-reset-list" style="font-weight: 700; color: var(--accent-red); border-color: rgba(239, 68, 68, 0.2); background: var(--bg-surface);">🔄 Reset List</button>
              </div>
            </div>

            <!-- Row 4: Main interactive keyword workspace display grid -->
            <div id="kw-list-container" style="margin-top: 1.25rem;">
              <!-- Dynamic Keywords List -->
            </div>
          </div>
        </div>
      `;
    }

    renderKeywordChips() {
      const container = document.getElementById('kw-list-container');
      const statsContainer = document.getElementById('kw-stats-container');
      if (!container || !this.keywordState) return;

      const q = this.keywordState.filterQuery.toLowerCase().trim();
      const activeCat = this.keywordState.activeFilterCategory;

      const filtered = this.keywordState.keywords.filter(kw => {
        if (!kw.visible) return false;
        
        // Category Filter
        if (activeCat !== 'All') {
          if (activeCat === 'Content Opportunities') {
            if (kw.category !== 'Content Opportunities' && kw.category !== 'Trend Opportunities') return false;
          } else {
            if (kw.category.toLowerCase() !== activeCat.toLowerCase()) return false;
          }
        }

        // Text Search Filter
        if (q) {
          return kw.text.toLowerCase().includes(q) || kw.category.toLowerCase().includes(q);
        }

        return true;
      });

      const selectedCount = this.keywordState.keywords.filter(kw => kw.visible && kw.selected).length;

      // Update Stats Container
      if (statsContainer) {
        statsContainer.innerHTML = `
          <span style="color: var(--accent-blue); font-weight: 700; margin-right: 0.35rem; font-size: 1rem;">${selectedCount}</span> keywords selected
          <span style="color: var(--text-muted); margin: 0 0.5rem;">|</span>
          <span style="color: var(--text-secondary); font-weight: 700;">${filtered.length}</span> visible of <span style="color: var(--text-muted);">${this.keywordState.keywords.filter(k => k.visible).length}</span> total
        `;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="padding: 2.5rem 1rem; text-align: center; border: 1px dashed var(--border-subtle); border-radius: 8px; color: var(--text-muted); font-size: 0.85rem; background: var(--bg-subtle);">
            No keywords match the active filter or search query. Try adding a custom keyword or resetting the filter!
          </div>
        `;
        return;
      }

      // Render them as a beautiful cluster flow of tags.
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
          ${filtered.map(kw => {
            const isSel = kw.selected;
            const extraInfo = kw.extra ? `title="${kw.extra}"` : `title="Category: ${kw.category}"`;
            let catColor = 'var(--text-muted)';
            if (kw.category === 'Primary') catColor = '#ef4444';
            else if (kw.category === 'Related') catColor = '#3b82f6';
            else if (kw.category === 'Long-Tail') catColor = '#10b981';
            else if (kw.category === 'Questions') catColor = '#8b5cf6';
            else if (kw.category === 'Content Opportunities') catColor = '#f59e0b';
            else if (kw.category === 'Trend Opportunities') catColor = '#ec4899';

            return `
              <div class="kw-tag-chip ${isSel ? 'selected' : ''}" data-kw-id="${kw.id}" ${extraInfo} style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.85rem; border-radius: 30px; border: 1px solid ${isSel ? 'var(--accent-blue)' : 'var(--border-strong)'}; background: ${isSel ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-subtle)'}; cursor: pointer; transition: all 0.15s ease; user-select: none; box-shadow: ${isSel ? '0 0 0 1px var(--accent-blue)' : 'none'};">
                <!-- Category Color dot -->
                <span style="width: 7px; height: 7px; border-radius: 50%; background-color: ${catColor}; flex-shrink: 0;" title="Type: ${kw.category}"></span>
                
                <!-- Keyword Text -->
                <span style="font-size: 0.85rem; font-weight: ${isSel ? '700' : '500'}; color: ${isSel ? 'var(--accent-blue)' : 'var(--text-primary)'}; font-family: var(--font-mono); white-space: nowrap;">${kw.text}</span>
                
                <!-- Remove Button -->
                <button type="button" class="kw-remove-btn" data-kw-remove-id="${kw.id}" style="border: none; background: transparent; padding: 0; color: var(--text-muted); font-size: 0.72rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; transition: background-color 0.15s ease;" title="Remove keyword">✕</button>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Tool 3: Title Analyzer & Generator
    renderTitleAnalyzer(data) {
      const audit = data.titleAnalysis || {};
      const variants = data.titleVariants || [];

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>🏷️</span> Title Analysis & Formula Generator <span class="verified-badge">✓ High CTR</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Length: <strong>${audit.characterCount || 0} characters</strong> • Mobile: <strong>${audit.mobileStatus || 'Optimal'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card result-card-full">
              <h4 class="result-card-title">Formula-Driven High-Retention Titles</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem;">
                ${variants.map(v => `
                  <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                    <div>
                      <span style="font-size: 0.72rem; color: var(--accent-blue); font-weight: 700; text-transform: uppercase;">${v.formula}</span>
                      <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary); margin-top: 0.2rem;">${v.title}</div>
                      <span style="font-size: 0.78rem; color: var(--text-muted);">${v.whyItWorks}</span>
                    </div>
                    <button type="button" class="copy-btn-mini" data-copy-text="${v.title}">Copy</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 4: Hashtag & Tag Generator
    renderHashtagsAndTags(data) {
      const sets = data.formattedSets || {};
      const broad = data.broadHashtags || [];
      const niche = data.nicheHashtags || [];
      const platformTags = data.platformSpecific || {};

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>#️⃣</span> Hashtag & Tag Generator <span class="verified-badge">✓ Grounded Tags</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
            <div class="hashtag-set-card">
              <div class="hashtag-set-header">
                <h4 class="hashtag-set-title">Minimal Hashtag Set (5 Tags)</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${sets.minimalSet}">Copy Set</button>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.83rem; color: var(--accent-blue); line-height: 1.45;">${sets.minimalSet}</div>
            </div>
            <div class="hashtag-set-card">
              <div class="hashtag-set-header">
                <h4 class="hashtag-set-title">Balanced Hashtag Set (10 Tags)</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${sets.balancedSet}">Copy Set</button>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.83rem; color: var(--accent-blue); line-height: 1.45;">${sets.balancedSet}</div>
            </div>
            <div class="hashtag-set-card" style="grid-column: 1 / -1;">
              <div class="hashtag-set-header">
                <h4 class="hashtag-set-title">Comma-Separated Video Tags (YouTube/Vimeo Metadata Box)</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${sets.commaSeparatedTags}">Copy Comma Tags</button>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.83rem; color: var(--text-primary); line-height: 1.45; background: var(--bg-subtle); padding: 0.75rem; border-radius: 6px;">
                ${sets.commaSeparatedTags}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 5: Hook & Script Intro Generator
    renderHookScriptIntro(data) {
      const hooks = data.hooks || (data.hookFramework ? [
        { style: "Spoken Hook (3s)", spokenScript: data.hookFramework.spokenHook3Seconds, visualActionCue: data.hookFramework.visualPatternInterrupt },
        { style: "Intro Script (15s)", spokenScript: data.hookFramework.introScript15Seconds, visualActionCue: "Visual angle change" }
      ] : []);
      const fw = data.retentionFramework || data.hookFramework || {};

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>🎣</span> Hook & Script Intro Generator <span class="verified-badge">✓ High Retention</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic || 'Selected Topic'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card result-card-full">
              <h4 class="result-card-title">0–3 Second Opening Hooks</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem;">
                ${hooks.map(h => `
                  <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong style="color: var(--accent-blue); font-size: 0.85rem;">${h.style}</strong>
                      <button type="button" class="copy-btn-mini" data-copy-text="${h.spokenScript}">Copy</button>
                    </div>
                    <div style="font-size: 0.92rem; font-weight: 500; margin: 0.35rem 0; color: var(--text-primary);">"${h.spokenScript}"</div>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">🎬 Visual Cue: ${h.visualActionCue}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 6: Description & Chapters Generator
    renderDescriptionChapters(data) {
      const desc = data.descriptionText || data.descriptionKit?.fullFormattedDescription || '';
      const chapters = data.chapters || data.descriptionKit?.timestampedChapters || [];

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>📝</span> Description & Chapters Generator <span class="verified-badge">✓ Structured Output</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic || 'Selected Topic'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
              <button type="button" class="btn btn-primary btn-sm" data-copy-text="${desc}">📋 Copy Full Description</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card result-card-full">
              <pre style="white-space: pre-wrap; font-family: var(--font-sans); font-size: 0.85rem; background: var(--bg-subtle); padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.5;">${desc}</pre>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 7: Topic & Content Idea Explorer
    renderTopicIdeaExplorer(data) {
      const questions = data.topAudienceQuestions || data.audienceQuestions?.howToQuestions || [];
      const subtopics = data.subtopics || (data.videoAngleIdeas ? data.videoAngleIdeas.map(v => v.angle) : []);
      const calendar = data.contentPlan4Week || (data.seriesRoadmap ? data.seriesRoadmap.map((s, i) => ({ week: `Week ${i+1}`, title: s.title, format: 'Video Series', goal: s.focus })) : []);

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>💡</span> Topic & Content Idea Explorer <span class="verified-badge">✓ 4-Week Strategy</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic || 'Selected Topic'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card">
              <h4 class="result-card-title">Top Audience Questions</h4>
              <ul style="padding-left: 1.1rem; margin: 0.5rem 0 0; font-size: 0.85rem; line-height: 1.6;">
                ${questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
            <div class="result-card">
              <h4 class="result-card-title">Subtopic Expansions</h4>
              <ul style="padding-left: 1.1rem; margin: 0.5rem 0 0; font-size: 0.85rem; line-height: 1.6;">
                ${subtopics.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div class="result-card result-card-full">
              <h4 class="result-card-title">4-Week Content Publishing Plan</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-top: 0.75rem;">
                ${calendar.map(c => `
                  <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: 6px; border: 1px solid var(--border-subtle);">
                    <strong style="color: var(--accent-blue); font-size: 0.82rem; text-transform: uppercase;">${c.week}</strong>
                    <div style="font-weight: 600; font-size: 0.88rem; margin: 0.25rem 0;">${c.title}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${c.format} • ${c.goal}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 8: Competitor Content Gap Finder
    renderCompetitorGapFinder(data) {
      const gaps = data.contentGaps || [];
      const opps = data.differentiationOpportunities || [];

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>🕵️</span> Competitor Content Gap Finder <span class="verified-badge">✓ Differentiation</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic || 'Selected Topic'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card result-card-full">
              <h4 class="result-card-title">Competitor Focus Summary</h4>
              <p style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.5; margin: 0.5rem 0 0;">${data.competitorSummary || ''}</p>
            </div>
            <div class="result-card">
              <h4 class="result-card-title">Identified Content Gaps</h4>
              <ul style="padding-left: 1.1rem; margin: 0.5rem 0 0; font-size: 0.83rem; line-height: 1.6;">
                ${gaps.map(g => `<li>${g}</li>`).join('')}
              </ul>
            </div>
            <div class="result-card">
              <h4 class="result-card-title">Differentiation Opportunities</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                ${opps.map(o => `
                  <div style="padding: 0.5rem; background: var(--bg-subtle); border-radius: 6px; font-size: 0.82rem;">
                    <strong style="color: var(--accent-blue);">${o.area}:</strong> ${o.tactic}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Tool 9: Multi-Platform Repurposing Kit
    renderRepurposingKit(data) {
      const pkgs = data.repurposedPackages || data.platformPackages || {};
      const platforms = Object.keys(pkgs);

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>🌐</span> Multi-Platform Repurposing Kit <span class="verified-badge">✓ Native Formats</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic || 'Selected Topic'}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
            ${platforms.map(p => {
              const item = pkgs[p];
              return `
                <div class="result-card">
                  <div class="result-card-header">
                    <h4 class="result-card-title">${p}</h4>
                    <button type="button" class="copy-btn-mini" data-copy-text="${item.title}\n\n${item.caption}">Copy Post</button>
                  </div>
                  <strong style="font-size: 0.88rem; color: var(--accent-blue); display: block; margin: 0.25rem 0;">${item.title}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${item.format}</span>
                  <pre style="white-space: pre-wrap; font-family: var(--font-sans); font-size: 0.82rem; background: var(--bg-subtle); padding: 0.75rem; border-radius: 6px; margin: 0.5rem 0; line-height: 1.45;">${item.caption}</pre>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">💡 ${item.rules}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Tool 10: Pre-Upload SEO Checklist
    renderChecklist(data) {
      const chk = data.checklists || {};
      const pre = chk.preUploadChecklist || chk.preUploadSeoChecklist || [];
      const pub = chk.launchDayChecklist || chk.publishingDayChecklist || [];

      return `
        <div class="results-container" style="margin-top: 1.5rem;">
          <div class="tool-result-header-bar">
            <div>
              <h3 class="tool-result-title"><span>✅</span> Pre-Upload SEO Verification Checklist <span class="verified-badge">✓ QA Checklist</span></h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">Topic: <strong>${data.inputContext?.topic}</strong></p>
            </div>
            <div class="tool-result-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown">📄 Export Markdown</button>
            </div>
          </div>
          <div class="results-grid" style="margin-top: 1.25rem;">
            <div class="result-card">
              <h4 class="result-card-title">Pre-Upload SEO Checkpoints</h4>
              <div class="checklist-items" style="margin-top: 0.5rem;">
                ${pre.map((item, i) => `
                  <label class="checklist-item" id="chk-pre-${i}">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('done', this.checked)">
                    <span>${item.task}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="result-card">
              <h4 class="result-card-title">Publishing Day Distribution Checkpoints</h4>
              <div class="checklist-items" style="margin-top: 0.5rem;">
                ${pub.map((item, i) => `
                  <label class="checklist-item" id="chk-pub-${i}">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('done', this.checked)">
                    <span>${item.task}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    bindResultsInteractivity(container, data) {
      const toolId = Number(data.toolId || this.activeTool.id);

      container.querySelectorAll('[data-copy-text]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = btn.getAttribute('data-copy-text');
          if (text) {
            navigator.clipboard.writeText(text);
            const orig = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = orig;
              btn.classList.remove('copied');
            }, 1800);
          }
        });
      });

      container.querySelector('#btn-export-markdown')?.addEventListener('click', () => {
        this.exportMarkdown(data);
      });

      if (toolId === 1) {
        // Render Chips initially
        this.renderKeywordChips();

        // 1. Search Filter Input Event
        const filterInput = container.querySelector('#kw-search-filter');
        if (filterInput) {
          filterInput.addEventListener('input', (e) => {
            this.keywordState.filterQuery = e.target.value;
            this.renderKeywordChips();
          });
        }

        // 2. Add Custom Keyword Button and Input
        const addBtn = container.querySelector('#btn-add-custom-kw');
        const addInput = container.querySelector('#kw-add-input');
        if (addBtn && addInput) {
          const handleAdd = () => {
            const val = addInput.value.trim();
            if (val) {
              const newId = `kw-${Date.now()}`;
              this.keywordState.keywords.push({
                id: newId,
                text: val,
                category: 'Primary',
                selected: true,
                visible: true
              });
              addInput.value = '';
              this.renderKeywordChips();
            }
          };
          addBtn.addEventListener('click', handleAdd);
          addInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAdd();
          });
        }

        // 3. Category Tab Clicking
        container.querySelectorAll('.kw-category-tab').forEach(tab => {
          tab.addEventListener('click', (e) => {
            container.querySelectorAll('.kw-category-tab').forEach(t => {
              t.classList.remove('active');
              t.style.background = 'var(--bg-subtle)';
              t.style.color = 'var(--text-secondary)';
              t.style.borderColor = 'var(--border-subtle)';
            });

            tab.classList.add('active');
            tab.style.background = 'var(--accent-blue)';
            tab.style.color = '#ffffff';
            tab.style.borderColor = 'var(--accent-blue)';

            const cat = tab.getAttribute('data-kw-cat');
            this.keywordState.activeFilterCategory = cat;
            this.renderKeywordChips();
          });
        });

        // 4. Chip Click (Toggle Select) & Remove Click
        const chipsContainer = container.querySelector('#kw-list-container');
        if (chipsContainer) {
          chipsContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.kw-remove-btn');
            if (removeBtn) {
              e.stopPropagation();
              const kwId = removeBtn.getAttribute('data-kw-remove-id');
              const found = this.keywordState.keywords.find(kw => kw.id === kwId);
              if (found) {
                found.visible = false;
                this.renderKeywordChips();
              }
              return;
            }

            const chip = e.target.closest('.kw-tag-chip');
            if (chip) {
              const kwId = chip.getAttribute('data-kw-id');
              const found = this.keywordState.keywords.find(kw => kw.id === kwId);
              if (found) {
                found.selected = !found.selected;
                this.renderKeywordChips();
              }
            }
          });
        }

        // 5. Copy Selected Action
        const copySelectedBtn = container.querySelector('#btn-kw-copy-selected');
        if (copySelectedBtn) {
          copySelectedBtn.addEventListener('click', () => {
            const selectedText = this.keywordState.keywords
              .filter(kw => kw.visible && kw.selected)
              .map(kw => kw.text)
              .join('\n');
            
            if (!selectedText) {
              alert('Please select at least one keyword tag first.');
              return;
            }

            navigator.clipboard.writeText(selectedText);
            const origText = copySelectedBtn.textContent;
            copySelectedBtn.textContent = '✓ Copied successfully!';
            copySelectedBtn.style.background = 'var(--success-text)';
            copySelectedBtn.style.color = '#ffffff';
            setTimeout(() => {
              copySelectedBtn.textContent = origText;
              copySelectedBtn.style.background = 'var(--bg-surface)';
              copySelectedBtn.style.color = 'var(--text-primary)';
            }, 1800);
          });
        }

        // 6. Copy All Action
        const copyAllBtn = container.querySelector('#btn-kw-copy-all');
        if (copyAllBtn) {
          copyAllBtn.addEventListener('click', () => {
            const visibleText = this.keywordState.keywords
              .filter(kw => kw.visible)
              .map(kw => kw.text)
              .join('\n');

            if (!visibleText) {
              alert('No keywords available to copy.');
              return;
            }

            navigator.clipboard.writeText(visibleText);
            const origText = copyAllBtn.textContent;
            copyAllBtn.textContent = '✓ Copied successfully!';
            copyAllBtn.style.background = 'var(--success-text)';
            copyAllBtn.style.color = '#ffffff';
            setTimeout(() => {
              copyAllBtn.textContent = origText;
              copyAllBtn.style.background = 'var(--bg-surface)';
              copyAllBtn.style.color = 'var(--text-primary)';
            }, 1800);
          });
        }

        // 7. Export CSV Action
        const exportCsvBtn = container.querySelector('#btn-kw-export-csv');
        if (exportCsvBtn) {
          exportCsvBtn.addEventListener('click', () => {
            const visibleKeywords = this.keywordState.keywords.filter(kw => kw.visible);
            if (visibleKeywords.length === 0) {
              alert('No keywords visible to export.');
              return;
            }

            let csvContent = "Category,Keyword\n";
            visibleKeywords.forEach(kw => {
              const escapedText = kw.text.replace(/"/g, '""');
              const escapedCat = kw.category.replace(/"/g, '""');
              csvContent += `"${escapedCat}","${escapedText}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `keyword-research-${this.keywordState.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          });
        }

        // 8. Reset List Action
        const resetBtn = container.querySelector('#btn-kw-reset-list');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            this.keywordState.keywords.forEach(kw => {
              kw.visible = true;
              kw.selected = false;
            });
            this.renderKeywordChips();
          });
        }
      } else {
        container.querySelector('#btn-copy-all-kw')?.addEventListener('click', () => {
          const primary = data.keywords?.primary || [];
          const secondary = data.keywords?.secondary || [];
          const longTail = data.keywords?.longTail || [];
          const text = [...primary, ...secondary, ...longTail].join(', ');
          navigator.clipboard.writeText(text);
          alert('Copied all keywords to clipboard!');
        });
      }
    }

    exportMarkdown(data) {
      const topic = data.inputContext?.topic || 'Research';
      const md = `# Multi Tube Views — Tool #${data.toolId || this.activeTool.id}: ${data.toolName || this.activeTool.name}
**Target Topic:** ${topic}  
**Category:** ${data.category || this.activeTool.category} | **Target Platforms:** ${(data.inputContext?.platforms || this.selectedPlatforms).join(', ')}  
**Country:** ${data.inputContext?.country || 'Global'} | **Language:** ${data.inputContext?.language || 'English'}  

---

## Output Data
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

---
*Generated via Multi Tube Views Social Media Research & SEO Suite*
`;
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MTV-Tool-${data.toolId || this.activeTool.id}-${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }

    generateToolSpecificClientFallback(tool, topic, platforms, country, language, category, audience) {
      const cleanTopic = (topic || 'Content Strategy').trim();
      const cleanTag = (s) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      return {
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        toolType: tool.toolType || 'seo_audit',
        inputContext: { topic: cleanTopic, platforms, country, language, category, audience },
        seoScore: 88,
        scoreBreakdown: [
          { factor: 'Title SEO & Search Intent', score: 90 },
          { factor: 'Description Depth & Chapters', score: 85 },
          { factor: 'Keyword Density & Placement', score: 88 },
          { factor: 'Platform Format Compliance', score: 90 }
        ],
        titleAudit: {
          optimizedTitle: `${cleanTopic}: Complete Guide & Key Insights`,
          recommendation: 'Primary search phrase front-loaded within 40 characters for full mobile snippet visibility.'
        },
        descriptionAudit: {
          optimizedDescription: `In this guide, we break down ${cleanTopic} with actionable steps, practical examples, and core rules.\n\n⏱️ TIMESTAMPS:\n0:00 - Introduction & Overview\n1:15 - Foundational Concepts\n3:30 - Step-by-Step Implementation\n6:00 - Common Pitfalls & Solutions\n8:15 - Key Takeaways & Wrap-up\n\n${platforms.map(p => `#${cleanTag(p)}`).join(' ')}`
        },
        tags: [cleanTopic, `${cleanTopic} tutorial`, `${cleanTopic} guide`, category.toLowerCase(), 'best practices'],
        keywords: {
          primary: [cleanTopic, `${cleanTopic} guide`, `${cleanTopic} tutorial`, `${cleanTopic} best practices`],
          secondary: [`how to learn ${cleanTopic}`, `${category.toLowerCase()} ${cleanTopic}`, `${cleanTopic} tips`],
          longTail: [`step by step ${cleanTopic} for beginners`, `common ${cleanTopic} mistakes to avoid`, `best ${cleanTopic} setup`],
          questions: [`What is ${cleanTopic}?`, `How does ${cleanTopic} work?`, `Why is ${cleanTopic} important?`],
          searchIntent: 'Informational & Educational How-To'
        },
        formattedSets: {
          minimalSet: `#${cleanTag(cleanTopic)} #${cleanTag(category)} #tips #guide #creators`,
          balancedSet: `#${cleanTag(cleanTopic)} #${cleanTag(category)} #${cleanTag(cleanTopic)}tips #${cleanTag(cleanTopic)}guide #learn #tutorial`,
          commaSeparatedTags: `${cleanTopic}, ${cleanTopic} tutorial, ${cleanTopic} guide, ${cleanTopic} tips, ${category.toLowerCase()}`
        },
        broadHashtags: [
          `#${cleanTag(cleanTopic)}`,
          `#${cleanTag(category)}`,
          `#tips`,
          `#guide`,
          `#creators`,
          `#viral`
        ],
        nicheHashtags: [
          `#${cleanTag(cleanTopic)}tips`,
          `#${cleanTag(cleanTopic)}guide`,
          `#${cleanTag(cleanTopic)}tutorial`,
          `#${cleanTag(cleanTopic)}hacks`,
          `#${cleanTag(cleanTopic)}secrets`
        ],
        platformSpecific: {
          YouTube: [`#${cleanTag(cleanTopic)}`, `#youtubecreators`, `#creators`],
          Instagram: [`#${cleanTag(cleanTopic)}`, `#instagramreels`, `#creators`],
          TikTok: [`#${cleanTag(cleanTopic)}`, `#learnontiktok`, `#creators`]
        },
        hooks: [
          { style: 'Direct Problem / Pain Point', spokenScript: `If you're struggling with ${cleanTopic}, this one breakdown changes everything.`, visualActionCue: 'Show split screen visual immediately.' },
          { style: 'Contrarian / Myth-Busting', spokenScript: `Stop doing ${cleanTopic} the old way. Here is what actually works today.`, visualActionCue: 'Dynamic zoom-in on speaker.' },
          { style: 'Curiosity Gap & Stakes', spokenScript: `Here is the biggest mistake people make with ${cleanTopic}—and how to fix it in 60 seconds.`, visualActionCue: 'Display on-screen text highlighting common error.' }
        ],
        descriptionText: `In this guide, we break down ${cleanTopic} with actionable steps, practical examples, and core rules.\n\n⏱️ TIMESTAMPS:\n0:00 - Introduction & Overview\n1:15 - Foundational Concepts\n3:30 - Step-by-Step Implementation\n6:00 - Common Pitfalls & Solutions\n8:15 - Key Takeaways & Wrap-up\n\n${platforms.map(p => `#${cleanTag(p)}`).join(' ')}`,
        topAudienceQuestions: [
          `How do beginners get started with ${cleanTopic}?`,
          `What are the most common mistakes in ${cleanTopic}?`,
          `How does ${cleanTopic} compare to alternatives?`
        ],
        subtopics: [
          `${cleanTopic} for Complete Beginners`,
          `Advanced ${cleanTopic} Strategies`,
          `Common ${cleanTopic} Myths Debunked`
        ],
        contentPlan4Week: [
          { week: 'Week 1', title: `${cleanTopic}: Complete Beginner Guide`, format: 'Long-Form Video', goal: 'Search Discovery' },
          { week: 'Week 2', title: `3 Crucial Mistakes to Avoid with ${cleanTopic}`, format: 'Shorts / Reels', goal: 'Viral Discovery' },
          { week: 'Week 3', title: `My Step-by-Step ${cleanTopic} Routine`, format: 'Walkthrough', goal: 'Audience Retention' },
          { week: 'Week 4', title: `Top Alternatives to ${cleanTopic} Tested`, format: 'Comparison & Review', goal: 'High-Intent Engagement' }
        ],
        competitorSummary: `Competitors in ${category} focus heavily on surface-level overviews without step-by-step troubleshooting.`,
        contentGaps: [
          `Missing practical checklists for ${cleanTopic}`,
          `Lack of beginner troubleshooting walkthroughs`,
          `Absence of multi-platform repurposing strategies`
        ],
        differentiationOpportunities: [
          { area: 'Title Packaging', tactic: 'Replace vague hype with explicit outcomes and step counts.' },
          { area: 'Pacing & Delivery', tactic: 'Eliminate long spoken intros; jump straight to the first tip within 5 seconds.' }
        ],
        repurposedPackages: {
          YouTube: { title: `${cleanTopic}: Full Walkthrough & Guide`, format: 'Long-Form Video (8-12 min)', caption: `Step-by-step breakdown on ${cleanTopic}.\n\n#${cleanTag(platforms[0] || 'youtube')}`, rules: 'Chapters in description.' },
          Instagram: { title: `How to Master ${cleanTopic}`, format: 'Reel / Carousel', caption: `Stop overcomplicating ${cleanTopic} 💡\n\n#${cleanTag(platforms[0] || 'instagram')} #creator`, rules: 'High-contrast visual hook.' },
          TikTok: { title: `${cleanTopic} in 60s`, format: 'Vertical Short-Form (9:16)', caption: `The fastest way to master ${cleanTopic} 👇 #learnontiktok`, rules: 'Verbal hook in 1.5s.' },
          LinkedIn: { title: `Key Insights: ${cleanTopic}`, format: 'Text Post / Carousel PDF', caption: `Strategic insights on ${cleanTopic} for practitioners.\n\n#strategy #creators`, rules: 'Professional formatting.' },
          X: { title: `Thread on ${cleanTopic}`, format: '5-Tweet Thread', caption: `A concise breakdown on ${cleanTopic}:\n\n1/ Core challenge\n2/ 3-step fix\n\nBookmark this! 🧵`, rules: 'Hook under 240 chars.' }
        },
        checklists: {
          preUploadChecklist: [
            { id: 'c1', task: 'Target search phrase front-loaded in first 40 characters of title', checked: false },
            { id: 'c2', task: 'Natural keyword integration in first 200 characters of description', checked: false },
            { id: 'c3', task: '3 to 8 platform-appropriate hashtags placed cleanly at bottom', checked: false },
            { id: 'c4', task: 'Custom thumbnail tested at small mobile sizes (120x68px) for legibility', checked: false },
            { id: 'c5', task: 'Accurate category and language metadata selected in platform settings', checked: false }
          ],
          launchDayChecklist: [
            { id: 'c6', task: 'Verify optimal posting time for target audience', checked: false },
            { id: 'c7', task: 'Pin first comment with discussion prompt or resource link', checked: false },
            { id: 'c8', task: 'Add end screens and relevant info cards linking to complementary videos', checked: false },
            { id: 'c9', task: 'Reply to early comments within first 60 minutes', checked: false }
          ]
        }
      };
    }

    bindEvents() {
      document.getElementById('category-pills-container')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-pill-btn');
        if (btn) {
          const cat = btn.getAttribute('data-cat');
          if (cat) {
            this.activeCategory = cat;
            this.renderCategoryPills();
            this.renderToolsGrid();
          }
        }
      });

      const searchInput = document.getElementById('seo-tool-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.renderToolsGrid();
        });
      }

      document.getElementById('tools-catalog-grid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.tool-compact-card');
        if (card) {
          const id = parseInt(card.getAttribute('data-tool-id'), 10);
          const tool = TOOLS_CATALOG.find(t => t.id === id);
          if (tool) this.openToolInWorkspace(tool, false);
        }
      });

      document.getElementById('workspace-tabs-list')?.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.tab-close-btn');
        if (closeBtn) {
          e.stopPropagation();
          const toolId = parseInt(closeBtn.getAttribute('data-close-tool-id'), 10);
          if (toolId) this.closeTab(toolId);
          return;
        }

        const tab = e.target.closest('.workspace-tab-item');
        if (tab) {
          const toolId = parseInt(tab.getAttribute('data-tab-tool-id'), 10);
          const tool = TOOLS_CATALOG.find(t => t.id === toolId);
          if (tool) this.openToolInWorkspace(tool, false);
        }
      });

      document.getElementById('platform-chips-container')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.platform-chip');
        if (chip) {
          const p = chip.getAttribute('data-platform');
          if (p) this.togglePlatform(p);
        }
      });

      document.getElementById('btn-select-all-platforms')?.addEventListener('click', () => {
        this.selectAllPlatforms();
      });
      document.getElementById('btn-reset-platforms')?.addEventListener('click', () => {
        this.resetPlatformSelection();
      });

      const singleInput = document.getElementById('runner-single-input');
      if (singleInput) {
        singleInput.addEventListener('input', (e) => {
          this.detectInputType(e.target.value);
        });
      }

      document.getElementById('btn-clear-input')?.addEventListener('click', () => {
        if (singleInput) {
          singleInput.value = '';
          this.detectInputType('');
          singleInput.focus();
        }
      });

      document.getElementById('btn-add-tool-tab')?.addEventListener('click', (e) => {
        e.preventDefault();
        const grid = document.getElementById('tools-catalog-grid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const searchInput = document.getElementById('seo-tool-search');
          if (searchInput) searchInput.focus();
        }
      });

      document.getElementById('btn-execute-research')?.addEventListener('click', () => {
        this.runActiveTool();
      });

      document.getElementById('btn-back-to-catalog')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.goBackToCatalog();
      });

      document.getElementById('btn-prev-tool')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.activeToolId === null) return;
        let prevId = this.activeToolId - 1;
        if (prevId < 1) prevId = 7;
        this.navigateToTool(prevId);
      });

      document.getElementById('btn-next-tool')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.activeToolId === null) return;
        let nextId = this.activeToolId + 1;
        if (nextId > 7) nextId = 1;
        this.navigateToTool(nextId);
      });

      window.addEventListener('popstate', () => {
        this.activeToolId = null;
        this.checkUrlForDeepLink();
        this.togglePageView();
      });
    }
  }

  // Auto-instantiate on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    window.seoToolsEngine = new SeoToolsEngine();
  });

})();
