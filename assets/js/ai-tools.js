/**
 * Multi Tube Views (MTV) — AI Tools Workspace Orchestrator
 * High-fidelity client-side coordinator for the eight custom AI productivity tools.
 * Handles interactive UI, input schemas, client-side validation, server calls,
 * and elegant output visualizations.
 */

// --- 1. DEFINITIONS OF THE 8 CUSTOM TOOLS ---
const TOOL_DEFINITIONS = {
  'youtube-seo-full-package': {
    name: 'YouTube SEO Full Package',
    description: 'Generates a complete, highly optimized SEO asset kit: search-intent titles, a structured description with placeholder chapters, optimized keywords, and video tags.',
    buttonText: 'Generate SEO Package',
    examples: {
      topic: 'Build a solid custom mechanical keyboard in 2026',
      keyword: 'custom mechanical keyboard guide',
      audience: 'Beginner tech enthusiasts',
      niche: 'Gaming & Technology Hardware'
    },
    fields: [
      { name: 'topic', label: 'Video Subject / Core Idea', type: 'text', required: true, placeholder: 'e.g., How to set up a home recording studio on a budget' },
      { name: 'keyword', label: 'Primary Target Keyword (Optional)', type: 'text', placeholder: 'e.g., home recording studio budget' },
      { name: 'audience', label: 'Target Audience Profile (Optional)', type: 'text', placeholder: 'e.g., Beginner musicians, bedroom producers' },
      { name: 'niche', label: 'Content Niche (Optional)', type: 'text', placeholder: 'e.g., Music Production, Tech Reviews' }
    ]
  },
  'youtube-seo-title': {
    name: 'YouTube SEO Title Generator',
    description: 'Generates search-intent-aligned, high-CTR, non-clickbait titles front-loaded with your primary keyword.',
    buttonText: 'Generate Titles',
    examples: {
      topic: '10 crucial visual editing tricks to speed up Premiere Pro workflow'
    },
    fields: [
      { name: 'topic', label: 'Video Topic / Working Title', type: 'textarea', required: true, placeholder: 'e.g., 10 tips to make Premiere Pro run faster and edit like a pro' }
    ]
  },
  'keyword-research': {
    name: 'SEO Keyword & Intent Explorer',
    description: 'Discovers high-value seed keywords, long-tail queries, search intents, and recommended content angles.',
    buttonText: 'Explore Keywords',
    examples: {
      topic: 'sustainable gardening tips'
    },
    fields: [
      { name: 'topic', label: 'Seed Topic / Focus Keyword', type: 'text', required: true, placeholder: 'e.g., sustainable organic gardening' }
    ]
  },
  'hashtag-generator': {
    name: 'Hashtag Generator',
    description: 'Generates contextual, platform-tailored hashtags optimized for discovery across social feeds.',
    buttonText: 'Generate Hashtags',
    examples: {
      topic: 'minimalist office setup tours',
      platform: 'YouTube & TikTok',
      quantity: '15'
    },
    fields: [
      { name: 'topic', label: 'Content Theme / Topic', type: 'text', required: true, placeholder: 'e.g., minimalist desk setups and cable management' },
      { name: 'platform', label: 'Target Social Platform', type: 'select', options: ['YouTube', 'Instagram', 'TikTok', 'X / Twitter', 'LinkedIn', 'All Platforms'], default: 'All Platforms' },
      { name: 'quantity', label: 'Desired Quantity', type: 'select', options: ['10', '15', '25', '50'], default: '15' }
    ]
  },
  'meta-description-generator': {
    name: 'Meta Description Generator',
    description: 'Generates eye-catching search snippet meta descriptions bounded between 135–158 characters with natural call-to-actions.',
    buttonText: 'Generate Meta Descriptions',
    examples: {
      topic: 'Ultimate React Native state management comparison guide for 2026'
    },
    fields: [
      { name: 'topic', label: 'Core Topic or Page Title', type: 'textarea', required: true, placeholder: 'e.g., Complete guide to choosing the best state management library in React Native' }
    ]
  },
  'topic-generator': {
    name: 'AI Topic & Content Planner',
    description: 'Generates creative, highly engaging video and blog topic ideas categorized by target audience interest.',
    buttonText: 'Generate Content Topics',
    examples: {
      topic: 'Figma design systems'
    },
    fields: [
      { name: 'topic', label: 'Seed Subject or Industry Niche', type: 'text', required: true, placeholder: 'e.g., UX/UI Design Systems in Figma' }
    ]
  },
  'grammar-text-improver': {
    name: 'Grammar & Text Polisher',
    description: 'Corrects grammar, eliminates awkward phrasings, and elevates content tone while fully maintaining your original message.',
    buttonText: 'Polish Copy',
    examples: {
      text: 'me and my friend was wanting to make a gaming channel on youtube but we dont know what is the best mic to buy that is cheap but sound good'
    },
    fields: [
      { name: 'text', label: 'Original Copy / Draft Text', type: 'textarea', required: true, placeholder: 'Paste your raw video description, script intro, or social post draft here...' }
    ]
  },
  'ai-translator': {
    name: 'AI Translation Suite',
    description: 'Translates titles, video scripts, or descriptions into localized languages while keeping idiomatic context and style intact.',
    buttonText: 'Translate Text',
    examples: {
      text: 'Hey guys! In this video, I will show you exactly how to edit your videos 10x faster using simple keyboard shortcuts.',
      targetLanguage: 'Spanish'
    },
    fields: [
      { name: 'text', label: 'Source Text to Translate', type: 'textarea', required: true, placeholder: 'Enter the title, description, or script to translate...' },
      { name: 'targetLanguage', label: 'Target Language', type: 'select', options: ['Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Portuguese', 'Hindi', 'Arabic'], default: 'Spanish' }
    ]
  }
};

let activeToolId = 'youtube-seo-full-package';
let currentGeneratedData = null; // Store output globally for Copy All

// --- 2. DOM INTERACTION & RENDER ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
  const sidebarButtons = document.querySelectorAll('.tool-nav-item');
  const providerSelect = document.getElementById('provider-select');
  const toolForm = document.getElementById('tool-form');
  const copyToast = document.getElementById('copy-toast');
  const copyAllBtn = document.getElementById('copy-all-btn');

  // Load provider settings if previously saved in settings
  if (window.storageEngine) {
    const savedProvider = window.storageEngine.get('selected_ai_provider');
    if (savedProvider && providerSelect) {
      providerSelect.value = savedProvider;
    }
  }

  // Handle Sidebar Clicks
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeToolId = btn.getAttribute('data-tool');
      switchTool(activeToolId);

      // Smooth scroll/focus to the existing input/workspace section below
      const editorCard = document.getElementById('editor-card');
      if (editorCard) {
        editorCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Focus the first input/textarea/select in the form to activate it for typing
        setTimeout(() => {
          const firstInput = editorCard.querySelector('input, textarea, select');
          if (firstInput) {
            firstInput.focus({ preventScroll: true });
          }
        }, 150);
      }
    });
  });

  // Handle Copy All Button
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', () => {
      if (!currentGeneratedData) return;
      
      let textToCopy = '';
      if (typeof currentGeneratedData === 'string') {
        textToCopy = currentGeneratedData;
      } else if (Array.isArray(currentGeneratedData)) {
        textToCopy = currentGeneratedData.join('\n');
      } else if (typeof currentGeneratedData === 'object') {
        // Build pretty printable block for structured schemas
        textToCopy = Object.entries(currentGeneratedData)
          .map(([key, val]) => {
            const heading = key.toUpperCase().replace(/_/g, ' ');
            const valueStr = Array.isArray(val) ? val.join('\n') : (typeof val === 'object' ? JSON.stringify(val, null, 2) : val);
            return `=== ${heading} ===\n${valueStr}\n`;
          })
          .join('\n');
      }

      copyToClipboard(textToCopy);
    });
  }

  // Form Submit Handler
  if (toolForm) {
    toolForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await executeTool();
    });
  }

  // Initialize first tool
  switchTool(activeToolId);
});

// --- 3. SWITCH TOOLS AND DYNAMICALLY BUILD FORMS ---
function switchTool(toolId) {
  const tool = TOOL_DEFINITIONS[toolId];
  if (!tool) return;

  // Update headers
  document.getElementById('tool-title').innerText = tool.name;
  document.getElementById('tool-description').innerText = tool.description;
  document.getElementById('btn-text').innerText = tool.buttonText;

  // Reset results container
  resetOutputState();

  // Clear and rebuild fields
  const fieldsContainer = document.getElementById('dynamic-fields');
  fieldsContainer.innerHTML = '';

  // Add "Load Example" utility badge
  const exampleBadge = document.createElement('div');
  exampleBadge.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 0.75rem;';
  exampleBadge.innerHTML = `<button type="button" class="btn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; border-radius: 4px;" onclick="loadExampleData('${toolId}')">✨ Load Example Template</button>`;
  fieldsContainer.appendChild(exampleBadge);

  // Render fields
  tool.fields.forEach(f => {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', `field-${f.name}`);
    label.innerText = f.required ? `${f.label} *` : f.label;
    group.appendChild(label);

    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.id = `field-${f.name}`;
      input.name = f.name;
      input.placeholder = f.placeholder || '';
      if (f.required) input.required = true;
    } else if (f.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-control';
      input.id = `field-${f.name}`;
      input.name = f.name;
      f.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.innerText = opt;
        input.appendChild(option);
      });
      if (f.default) input.value = f.default;
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control';
      input.id = `field-${f.name}`;
      input.name = f.name;
      input.placeholder = f.placeholder || '';
      if (f.required) input.required = true;
    }

    group.appendChild(input);
    fieldsContainer.appendChild(group);
  });
}

// Global scope example population trigger
window.loadExampleData = function(toolId) {
  const tool = TOOL_DEFINITIONS[toolId];
  if (!tool) return;

  Object.entries(tool.examples).forEach(([key, val]) => {
    const input = document.getElementById(`field-${key}`);
    if (input) {
      input.value = val;
    }
  });
};

// --- 4. ENGINE GATEWAY EXECUTION LOGIC ---
async function executeTool() {
  const generateBtn = document.getElementById('generate-btn');
  const btnText = document.getElementById('btn-text');
  const providerSelect = document.getElementById('provider-select');
  const originalBtnText = btnText.innerText;

  // Set loading UI states
  generateBtn.disabled = true;
  generateBtn.classList.add('loading');
  btnText.innerHTML = `<span class="spinner"></span>Orchestrating AI...`;

  // Construct payload from active tool form values
  const tool = TOOL_DEFINITIONS[activeToolId];
  const input = {};
  tool.fields.forEach(f => {
    const el = document.getElementById(`field-${f.name}`);
    if (el) {
      input[f.name] = el.value.trim();
    }
  });

  const payload = {
    toolId: activeToolId,
    input: input,
    provider: providerSelect.value
  };

  try {
    let data = null;

    if (window.mtvAI && typeof window.mtvAI.generate === 'function') {
      data = await window.mtvAI.generate(payload);
    } else {
      const apiBase = (window.MTV_API_BASE_URL || (window.location && window.location.origin ? window.location.origin : '')).replace(/\/+$/, '');
      const response = await fetch(`${apiBase}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('API Gateway returned HTML response instead of JSON. Connected backend fallback active.');
      }
      data = await response.json();
    }

    if (!data || data.success === false || data.error) {
      throw new Error((data && data.error) || 'Server error. Please verify API configuration or retry.');
    }

    // Capture and display outputs
    currentGeneratedData = data;
    renderOutput(data);

  } catch (error) {
    console.error('[MTV AI Execution Failure]', error);
    renderErrorState(error.message);
  } finally {
    // Restore UI states
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
    btnText.innerText = originalBtnText;
  }
}

// --- 5. OUTPUT RENDERERS & FORMATTING HUB ---
function renderOutput(data) {
  const outputEmpty = document.getElementById('output-empty-state');
  const outputReadyHeader = document.getElementById('output-ready-header');
  const outputResults = document.getElementById('output-results');
  const outputMetaRow = document.getElementById('output-meta-row');

  // Reveal panels
  outputEmpty.style.display = 'none';
  outputReadyHeader.style.display = 'flex';
  outputResults.style.display = 'block';
  outputMetaRow.style.display = 'flex';

  // Inject performance meta metrics if available from Multi-Provider gateway
  const meta = data._aiMeta || {};
  document.getElementById('meta-provider').innerText = meta.provider || 'Gemini 2.5 Flash';
  document.getElementById('meta-latency').innerText = meta.latencyMs ? `${(meta.latencyMs / 1000).toFixed(2)}s` : 'Deterministic';
  document.getElementById('meta-fallback-wrap').style.display = meta.fallbackOccurred ? 'block' : 'none';

  // Format and layout output results
  outputResults.innerHTML = '';

  if (activeToolId === 'youtube-seo-full-package') {
    renderYouTubePackage(data);
  } else if (activeToolId === 'grammar-text-improver' || activeToolId === 'ai-translator') {
    renderPolishedText(data);
  } else {
    // Standard List Output (hashtags, titles, keywords, descriptions, topics)
    renderStandardList(data);
  }
}

// Format lists elegantly
function renderStandardList(data) {
  const outputResults = document.getElementById('output-results');
  
  // Extract list items regardless of key name (e.g. hashtags, titles, descriptions, primaryKeywords, topics)
  let items = [];
  if (Array.isArray(data.hashtags)) items = data.hashtags;
  else if (Array.isArray(data.titles)) items = data.titles;
  else if (Array.isArray(data.descriptions)) items = data.descriptions;
  else if (Array.isArray(data.keywords)) items = data.keywords;
  else if (Array.isArray(data.primaryKeywords)) items = data.primaryKeywords;
  else if (Array.isArray(data.topics)) items = data.topics;
  else if (Array.isArray(data.items)) items = data.items;
  else if (Array.isArray(data.suggestions)) items = data.suggestions;
  else {
    // Fallback if structured data is raw text or simple key-value object
    items = Object.entries(data)
      .filter(([k]) => k !== '_aiMeta')
      .map(([k, v]) => `${k.toUpperCase().replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
  }

  const listWrap = document.createElement('div');
  listWrap.className = 'output-list';

  items.forEach(item => {
    let textContent = '';
    if (typeof item === 'object' && item !== null) {
      textContent = item.text || item.title || item.topic || item.keyword || JSON.stringify(item);
      if (item.charCount) {
        textContent = `${textContent} (${item.charCount} chars)`;
      }
    } else {
      textContent = item;
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'output-list-item';
    itemEl.innerHTML = `
      <div class="output-list-item-text">${escapeHtml(textContent)}</div>
      <button class="copy-btn" title="Copy Item" onclick="copyToClipboard('${escapeJsString(textContent)}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
    `;
    listWrap.appendChild(itemEl);
  });

  outputResults.appendChild(listWrap);
}

// Format double panel text boxes (e.g. translation, grammar helper)
function renderPolishedText(data) {
  const outputResults = document.getElementById('output-results');
  
  // Extract results
  const text = data.improvedText || data.polishedText || data.translatedText || data.result || '';
  const shorter = data.shorterVersion || '';
  const professional = data.professionalVersion || '';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

  wrap.innerHTML = `
    <div>
      <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--text-secondary);">Polished & Corrected Output:</div>
      <div class="package-desc-box" style="position: relative; max-height: 400px; overflow-y: auto;">
        <button class="copy-btn" title="Copy Content" style="position: absolute; top: 0.75rem; right: 0.75rem;" onclick="copyToClipboard('${escapeJsString(text)}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <div style="padding-right: 2rem;">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  `;

  if (shorter) {
    wrap.innerHTML += `
      <div>
        <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--text-secondary);">Concise Version:</div>
        <div class="package-desc-box" style="position: relative; max-height: 200px; overflow-y: auto;">
          <button class="copy-btn" title="Copy Concise" style="position: absolute; top: 0.75rem; right: 0.75rem;" onclick="copyToClipboard('${escapeJsString(shorter)}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <div style="padding-right: 2rem;">${escapeHtml(shorter).replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
  }

  if (professional) {
    wrap.innerHTML += `
      <div>
        <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--text-secondary);">Professional / Formal Version:</div>
        <div class="package-desc-box" style="position: relative; max-height: 200px; overflow-y: auto;">
          <button class="copy-btn" title="Copy Professional" style="position: absolute; top: 0.75rem; right: 0.75rem;" onclick="copyToClipboard('${escapeJsString(professional)}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <div style="padding-right: 2rem;">${escapeHtml(professional).replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
  }

  outputResults.appendChild(wrap);
}

// Tabbed visualizer for compound package output (YouTube SEO Package)
function renderYouTubePackage(data) {
  const outputResults = document.getElementById('output-results');

  const titles = data.titles || [];
  const description = data.description || '';
  const tags = data.tags || [];
  const visualSuggestions = data.visualSuggestions || [];
  const seoTips = data.seoTips || [];

  const tabContainer = document.createElement('div');
  tabContainer.innerHTML = `
    <div class="package-tabs">
      <button class="package-tab-btn active" onclick="switchPackageTab(event, 'pkg-titles')">Titles</button>
      <button class="package-tab-btn" onclick="switchPackageTab(event, 'pkg-desc')">Description</button>
      <button class="package-tab-btn" onclick="switchPackageTab(event, 'pkg-tags')">Tags & Keywords</button>
      <button class="package-tab-btn" onclick="switchPackageTab(event, 'pkg-visuals')">Thumbnail / Hook</button>
    </div>

    <!-- Titles Tab -->
    <div id="pkg-titles" class="package-tab-content active">
      <div class="output-list">
        ${titles.map(t => `
          <div class="output-list-item">
            <div class="output-list-item-text">${escapeHtml(t)}</div>
            <button class="copy-btn" title="Copy Title" onclick="copyToClipboard('${escapeJsString(t)}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Description Tab -->
    <div id="pkg-desc" class="package-tab-content">
      <div class="package-desc-box" style="position: relative;">
        <button class="copy-btn" title="Copy Description" style="position: absolute; top: 0.75rem; right: 0.75rem;" onclick="copyToClipboard('${escapeJsString(description)}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <div style="padding-right: 2.5rem; max-height: 350px; overflow-y: auto;">${escapeHtml(description).replace(/\n/g, '<br>')}</div>
      </div>
    </div>

    <!-- Tags Tab -->
    <div id="pkg-tags" class="package-tab-content">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 0.75rem;">
        <button class="btn" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; border-radius: var(--radius-sm);" onclick="copyToClipboard('${escapeJsString(tags.join(', '))}')">Copy Tags CSV</button>
      </div>
      <div class="package-tags-grid">
        ${tags.map(tag => `
          <div class="package-tag-pill">
            <span>#${escapeHtml(tag)}</span>
            <button style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:0.75rem;" onclick="copyToClipboard('${escapeJsString(tag)}')">📋</button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Visual Suggestions Tab -->
    <div id="pkg-visuals" class="package-tab-content">
      <div class="output-list">
        ${visualSuggestions.map(s => `
          <div class="output-list-item">
            <div class="output-list-item-text">${escapeHtml(s)}</div>
            <button class="copy-btn" title="Copy Suggestion" onclick="copyToClipboard('${escapeJsString(s)}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        `).join('')}
      </div>
      ${seoTips.length > 0 ? `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-strong); padding: 1.25rem; border-radius: var(--radius-sm); margin-top: 1rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-primary); font-weight: 600;">SEO Execution Tips:</h4>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            ${seoTips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  outputResults.appendChild(tabContainer);
}

// Global scope YouTube SEO Package tabs switcher
window.switchPackageTab = function(event, tabId) {
  const container = event.currentTarget.closest('.package-tabs').parentElement;
  
  // Update buttons state
  container.querySelectorAll('.package-tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Update panel state
  container.querySelectorAll('.package-tab-content').forEach(panel => panel.classList.remove('active'));
  container.querySelector(`#${tabId}`).classList.add('active');
};

// --- 6. UTILITY FUNCTIONS ---
function resetOutputState() {
  document.getElementById('output-empty-state').style.display = 'block';
  document.getElementById('output-ready-header').style.display = 'none';
  document.getElementById('output-results').style.display = 'none';
  document.getElementById('output-meta-row').style.display = 'none';
  document.getElementById('output-results').innerHTML = '';
  currentGeneratedData = null;
}

function renderErrorState(message) {
  resetOutputState();
  const outputResults = document.getElementById('output-results');
  const outputEmpty = document.getElementById('output-empty-state');
  
  outputEmpty.style.display = 'none';
  outputResults.style.display = 'block';

  outputResults.innerHTML = `
    <div style="border: 1px solid var(--danger-border); background: var(--danger-bg); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
      <h4 style="margin: 0 0 0.5rem 0; color: var(--danger-text); font-weight: 600;">Orchestration Offline</h4>
      <p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--text-primary); line-height: 1.45;">
        ${escapeHtml(message)}
      </p>
      <a href="settings.html" class="btn" style="padding: 0.4rem 1rem; font-size: 0.85rem; background: var(--bg-surface); border-color: var(--border-strong);">
        Go to Settings &gt;
      </a>
    </div>
  `;
}

window.copyToClipboard = function(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied content to clipboard successfully.');
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
    showToast('Unable to copy. Please manually select the text.');
  });
};

function showToast(message) {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
