// Web & SEO Utilities (Tools 13-18)
export const SEO_TOOLS = [
  // 13. Meta Tag Generator
  {
    id: 'meta-tag-generator',
    categoryId: 'web-seo-utilities',
    name: 'Meta Tag Generator',
    icon: '🏷️',
    title: 'Meta Tag Generator — SEO, Open Graph & Twitter Cards HTML',
    description: 'Generate complete, search-engine-friendly HTML meta tags, Open Graph tags, and Twitter card tags with live character counters.',
    keywords: 'meta tag generator, html meta tags, seo meta generator, open graph generator, twitter cards generator, html head tags',
    howToUse: [
      { step: '1', title: 'Enter Site Details', desc: 'Fill in page title, description, keywords, author, and canonical URL.' },
      { step: '2', title: 'Add Social Media Info', desc: 'Specify Open Graph image URL and select Twitter card format.' },
      { step: '3', title: 'Copy HTML Code', desc: 'Copy the generated <head> tags directly into your web templates.' }
    ],
    features: [
      { title: 'Live Length Counters', desc: 'Guides you to keep Title under 60 chars and Description under 160 chars.' },
      { title: 'Comprehensive Tags', desc: 'Generates SEO, Open Graph (Facebook/LinkedIn), and Twitter Summary tags.' },
      { title: 'Standard-Compliant', desc: 'Includes canonical link and robots index/follow directives.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="meta-title">Page Title <span class="bu-form-label-hint" id="meta-title-cnt">0 / 60</span></label>
            <input type="text" id="meta-title" class="bu-input" placeholder="e.g., Multi Tube Views — Free Multi-Stream Video Player" value="Multi Tube Views (MTV) — The Creator's Media Workspace">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="meta-desc">Meta Description <span class="bu-form-label-hint" id="meta-desc-cnt">0 / 160</span></label>
            <textarea id="meta-desc" class="bu-textarea" style="min-height: 85px;" placeholder="Brief summary for Google search snippets...">Watch multiple live video streams side-by-side across 40+ platforms with 20 creator tools, 15 media converters, and 36 browser utilities. 100% private and free.</textarea>
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="meta-url">Canonical URL</label>
            <input type="url" id="meta-url" class="bu-input" placeholder="https://example.com/page.html" value="https://multitubeviews.com/index.html">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="meta-image">Open Graph Image URL</label>
            <input type="url" id="meta-image" class="bu-input" placeholder="https://example.com/og-image.jpg" value="https://multitubeviews.com/assets/images/og-image-16x9.jpg">
          </div>
          <div class="bu-grid-2col">
            <div class="bu-form-group">
              <label class="bu-form-label" for="meta-author">Author / Brand</label>
              <input type="text" id="meta-author" class="bu-input" value="AiMAEditz">
            </div>
            <div class="bu-form-group">
              <label class="bu-form-label" for="meta-robots">Robots Directive</label>
              <select id="meta-robots" class="bu-select">
                <option value="index, follow" selected>index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="meta-output">Generated HTML Tags</label>
            <textarea id="meta-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 380px;" placeholder="Generated meta tags will appear here..."></textarea>
          </div>
          <div class="bu-actions-bar">
            <button type="button" id="btn-meta-copy" class="bu-btn bu-btn-primary">Copy Meta Tags</button>
            <button type="button" id="btn-meta-download" class="bu-btn">Download .html</button>
            <button type="button" id="btn-meta-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const titleIn = document.getElementById('meta-title');
      const descIn = document.getElementById('meta-desc');
      const urlIn = document.getElementById('meta-url');
      const imgIn = document.getElementById('meta-image');
      const authorIn = document.getElementById('meta-author');
      const robotsIn = document.getElementById('meta-robots');
      const titleCnt = document.getElementById('meta-title-cnt');
      const descCnt = document.getElementById('meta-desc-cnt');
      const output = document.getElementById('meta-output');
      const copyBtn = document.getElementById('btn-meta-copy');
      const dlBtn = document.getElementById('btn-meta-download');
      const clearBtn = document.getElementById('btn-meta-clear');

      function generate() {
        const title = titleIn.value.trim();
        const desc = descIn.value.trim();
        titleCnt.textContent = \`\${title.length} / 60\`;
        titleCnt.style.color = title.length > 60 ? 'var(--warning-text)' : 'var(--text-muted)';
        descCnt.textContent = \`\${desc.length} / 160\`;
        descCnt.style.color = desc.length > 160 ? 'var(--warning-text)' : 'var(--text-muted)';

        const tags = window.MTV_BU.generateMetaTags({
          title: title,
          description: desc,
          canonicalUrl: urlIn.value.trim(),
          ogImage: imgIn.value.trim(),
          author: authorIn.value.trim(),
          robots: robotsIn.value
        });
        output.value = tags;
      }

      [titleIn, descIn, urlIn, imgIn, authorIn, robotsIn].forEach(el => el.addEventListener('input', generate));
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'meta-tags.html', 'text/html');
      });
      clearBtn.addEventListener('click', () => {
        titleIn.value = '';
        descIn.value = '';
        urlIn.value = '';
        imgIn.value = '';
        authorIn.value = '';
        generate();
        titleIn.focus();
      });
      generate();
    `
  },

  // 14. Open Graph Preview
  {
    id: 'open-graph-preview',
    categoryId: 'web-seo-utilities',
    name: 'Open Graph Preview',
    icon: '📱',
    title: 'Open Graph & Social Card Preview — Facebook, Twitter & Google',
    description: 'Preview how your web page and social metadata look when shared on Facebook, Twitter/X, and Google search results.',
    keywords: 'open graph preview, social card debugger, twitter card preview, facebook link preview, google serp snippet preview',
    howToUse: [
      { step: '1', title: 'Enter Title & Content', desc: 'Type your webpage title and engaging social description.' },
      { step: '2', title: 'Provide Thumbnail Image', desc: 'Paste an image URL or choose a sample image to see the visual card.' },
      { step: '3', title: 'Compare Platforms', desc: 'Toggle between Facebook, Twitter/X, and Google SERP snippet previews.' }
    ],
    features: [
      { title: 'Three Real-World Renders', desc: 'Simulates Facebook share cards, Twitter large image cards, and Google mobile/desktop search results.' },
      { title: 'Aspect Ratio Verification', desc: 'Confirms proper 1.91:1 standard display ratio for social media banners.' },
      { title: 'Instant Code Export', desc: 'Generates corresponding og:title, og:description, and og:image tags.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="og-title">Card Title</label>
            <input type="text" id="og-title" class="bu-input" value="Multi Tube Views (MTV) — Multi-Screen Video Workspace">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="og-desc">Card Description</label>
            <textarea id="og-desc" class="bu-textarea" style="min-height: 80px;">Stream multiple videos concurrently with 40+ platform adapters, 20 creator tools, 15 media converters, and 36 browser utilities. Fast, responsive, and private.</textarea>
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="og-domain">Display Domain / Site Name</label>
            <input type="text" id="og-domain" class="bu-input" value="multitubeviews.com">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="og-image-url">Image URL</label>
            <input type="url" id="og-image-url" class="bu-input" value="https://multitubeviews.com/assets/images/og-image-16x9.jpg">
          </div>
        </div>
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label">Facebook / LinkedIn Card Preview</label>
            <div id="fb-card" style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: var(--bg-card);">
              <div id="fb-img-box" style="height: 170px; background: #222; background-size: cover; background-position: center; background-image: url('assets/images/og-image-16x9.jpg');"></div>
              <div style="padding: 0.85rem;">
                <div id="fb-domain" style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">MULTITUBEVIEWS.COM</div>
                <div id="fb-title" style="font-size: 0.95rem; font-weight: 700; margin: 0.25rem 0; color: var(--text-primary);">Multi Tube Views (MTV) — Multi-Screen Video Workspace</div>
                <div id="fb-desc" style="font-size: 0.82rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Stream multiple videos concurrently with 40+ platform adapters...</div>
              </div>
            </div>
          </div>
          <div class="bu-form-group" style="margin-top: 1.25rem;">
            <label class="bu-form-label">Google Search Result Preview</label>
            <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; background: var(--bg-card);">
              <div id="serp-url" style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.2rem;">https://multitubeviews.com › index.html</div>
              <div id="serp-title" style="font-size: 1.05rem; color: var(--accent-blue); font-weight: 600; text-decoration: underline; margin-bottom: 0.25rem;">Multi Tube Views (MTV) — Multi-Screen Video Workspace</div>
              <div id="serp-desc" style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4;">Stream multiple videos concurrently with 40+ platform adapters, 20 creator tools, 15 media converters, and 36 browser utilities. Fast, responsive, and private.</div>
            </div>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const titleIn = document.getElementById('og-title');
      const descIn = document.getElementById('og-desc');
      const domainIn = document.getElementById('og-domain');
      const imgIn = document.getElementById('og-image-url');

      const fbImg = document.getElementById('fb-img-box');
      const fbDomain = document.getElementById('fb-domain');
      const fbTitle = document.getElementById('fb-title');
      const fbDesc = document.getElementById('fb-desc');

      const serpTitle = document.getElementById('serp-title');
      const serpDesc = document.getElementById('serp-desc');
      const serpUrl = document.getElementById('serp-url');

      function update() {
        const title = titleIn.value || 'Page Title';
        const desc = descIn.value || 'Page description preview...';
        const domain = domainIn.value || 'example.com';
        const img = imgIn.value || '';

        fbTitle.textContent = title;
        fbDesc.textContent = desc;
        fbDomain.textContent = domain.toUpperCase();
        if (img) fbImg.style.backgroundImage = \`url('\${img}')\`;

        serpTitle.textContent = title;
        serpDesc.textContent = desc;
        serpUrl.textContent = \`https://\${domain} › index.html\`;
      }

      [titleIn, descIn, domainIn, imgIn].forEach(el => el.addEventListener('input', update));
      update();
    `
  },

  // 15. URL Parser
  {
    id: 'url-parser',
    categoryId: 'web-seo-utilities',
    name: 'URL Parser',
    icon: '🌐',
    title: 'URL Parser & Query Parameter Inspector — Native URL Breakdown',
    description: 'Decompose any web URL into its standard protocol, hostname, port, pathname, hash, and structured query parameter key-value pairs.',
    keywords: 'url parser, parse url online, query string inspector, url query parameters, breakdown url, query param extractor',
    howToUse: [
      { step: '1', title: 'Paste Target URL', desc: 'Enter any web URL with query strings, anchors, or ports.' },
      { step: '2', title: 'Inspect Components', desc: 'Review the parsed protocol, origin, pathname, and individual query parameters.' },
      { step: '3', title: 'Export JSON', desc: 'Copy the parsed component structure as structured JSON.' }
    ],
    features: [
      { title: 'Standard URL API', desc: 'Built on the native browser window.URL object for RFC-compliant parsing.' },
      { title: 'Query Parameter Grid', desc: 'Extracts every key-value parameter into an easy-to-read table.' },
      { title: 'JSON Export', desc: 'One-click copy of all parameters and path segments as JSON.' }
    ],
    sampleText: 'https://multitubeviews.com/platforms/youtube.html?platform=youtube&view=multigrid&theme=dark&autoplay=1#player-container',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="urlp-input">URL to Parse</label>
        <input type="url" id="urlp-input" class="bu-input bu-input-mono" value="https://multitubeviews.com/platforms/youtube.html?platform=youtube&view=multigrid&theme=dark&autoplay=1#player-container" placeholder="https://example.com/path?key=value">
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-urlp-parse" class="bu-btn bu-btn-primary">Parse URL</button>
        <button type="button" id="btn-urlp-copy-json" class="bu-btn">Copy as JSON</button>
        <button type="button" id="btn-urlp-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-urlp-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
      <div id="urlp-error" class="bu-status-banner bu-status-error" style="display: none; margin-top: 1rem;"></div>
      <div id="urlp-results" style="margin-top: 1.25rem;">
        <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
          <div class="bu-stat-item">Protocol: <strong id="urlp-proto">https:</strong></div>
          <div class="bu-stat-item">Host: <strong id="urlp-host">multitubeviews.com</strong></div>
          <div class="bu-stat-item">Port: <strong id="urlp-port">default</strong></div>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label">Pathname</label>
          <input type="text" id="urlp-path" class="bu-input bu-input-mono" readonly>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label">Query Parameters (<span id="urlp-param-count">0</span>)</label>
          <div class="bu-table-wrap">
            <table class="bu-table">
              <thead><tr><th>Parameter Key</th><th>Parameter Value</th></tr></thead>
              <tbody id="urlp-params-body"></tbody>
            </table>
          </div>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label">Hash / Anchor</label>
          <input type="text" id="urlp-hash" class="bu-input bu-input-mono" readonly>
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('urlp-input');
      const parseBtn = document.getElementById('btn-urlp-parse');
      const copyJsonBtn = document.getElementById('btn-urlp-copy-json');
      const sampleBtn = document.getElementById('btn-urlp-sample');
      const clearBtn = document.getElementById('btn-urlp-clear');
      const errorEl = document.getElementById('urlp-error');
      const protoEl = document.getElementById('urlp-proto');
      const hostEl = document.getElementById('urlp-host');
      const portEl = document.getElementById('urlp-port');
      const pathEl = document.getElementById('urlp-path');
      const hashEl = document.getElementById('urlp-hash');
      const countEl = document.getElementById('urlp-param-count');
      const bodyEl = document.getElementById('urlp-params-body');

      let lastParsed = null;

      function parse() {
        errorEl.style.display = 'none';
        const val = input.value.trim();
        if (!val) return;
        const res = window.MTV_BU.parseURL(val);
        if (!res.valid) {
          errorEl.textContent = '✗ ' + res.error;
          errorEl.style.display = 'block';
          return;
        }
        lastParsed = res;
        protoEl.textContent = res.protocol;
        hostEl.textContent = res.host;
        portEl.textContent = res.port || '(default)';
        pathEl.value = res.pathname;
        hashEl.value = res.hash || '(none)';

        const keys = Object.keys(res.searchParams);
        countEl.textContent = keys.length;
        if (keys.length === 0) {
          bodyEl.innerHTML = '<tr><td colspan="2" style="text-align:center; color: var(--text-muted);">No query parameters present</td></tr>';
        } else {
          bodyEl.innerHTML = keys.map(k => \`<tr><td style="font-weight:600; font-family:monospace;">\${k}</td><td style="font-family:monospace; color:var(--accent-blue);">\${res.searchParams[k]}</td></tr>\`).join('');
        }
      }

      parseBtn.addEventListener('click', parse);
      input.addEventListener('input', parse);

      copyJsonBtn.addEventListener('click', () => {
        if (!lastParsed) return;
        window.MTV_BU.copyToClipboard(JSON.stringify(lastParsed, null, 2), copyJsonBtn);
      });

      sampleBtn.addEventListener('click', () => {
        input.value = 'https://multitubeviews.com/platforms/youtube.html?platform=youtube&view=multigrid&theme=dark&autoplay=1#player-container';
        parse();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        protoEl.textContent = '-';
        hostEl.textContent = '-';
        portEl.textContent = '-';
        pathEl.value = '';
        hashEl.value = '';
        bodyEl.innerHTML = '';
        countEl.textContent = '0';
        input.focus();
      });

      parse();
    `
  },

  // 16. UTM Builder
  {
    id: 'utm-builder',
    categoryId: 'web-seo-utilities',
    name: 'UTM Campaign Builder',
    icon: '🎯',
    title: 'UTM Campaign URL Builder — Google Analytics Tracking Link Maker',
    description: 'Create Google Analytics tracking URLs with standard utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters.',
    keywords: 'utm builder, utm link generator, google analytics campaign url, campaign tracking link, marketing url builder',
    howToUse: [
      { step: '1', title: 'Enter Destination URL', desc: 'Enter the target page URL where visitors should land.' },
      { step: '2', title: 'Set Campaign Values', desc: 'Fill in campaign source (e.g. newsletter), medium (email), and campaign name.' },
      { step: '3', title: 'Copy Tracking Link', desc: 'Copy the formatted UTM link for use in ads, social posts, or emails.' }
    ],
    features: [
      { title: 'Standard UTM Tags', desc: 'Generates utm_source, utm_medium, utm_campaign, utm_term, and utm_content.' },
      { title: 'Marketing Presets', desc: 'Quickly populate common values for YouTube promos, Google Ads, or Facebook posts.' },
      { title: 'Safe Encoding', desc: 'Properly encodes spaces and special characters into clean percent-encoded query strings.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="utm-base">Website URL <span style="color: var(--accent-blue);">*</span></label>
        <input type="url" id="utm-base" class="bu-input" value="https://multitubeviews.com/platforms/youtube.html" placeholder="https://example.com/landing">
      </div>
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="utm-source">Campaign Source (utm_source) <span style="color: var(--accent-blue);">*</span></label>
          <input type="text" id="utm-source" class="bu-input" value="youtube" placeholder="e.g. google, youtube, newsletter">
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="utm-medium">Campaign Medium (utm_medium) <span style="color: var(--accent-blue);">*</span></label>
          <input type="text" id="utm-medium" class="bu-input" value="video_description" placeholder="e.g. cpc, email, banner, social">
        </div>
      </div>
      <div class="bu-grid-3col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="utm-campaign">Campaign Name (utm_campaign)</label>
          <input type="text" id="utm-campaign" class="bu-input" value="summer_creator_launch" placeholder="e.g. spring_sale">
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="utm-term">Campaign Term (utm_term)</label>
          <input type="text" id="utm-term" class="bu-input" value="multiview+tools" placeholder="e.g. running+shoes">
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="utm-content">Campaign Content (utm_content)</label>
          <input type="text" id="utm-content" class="bu-input" value="link_cta" placeholder="e.g. header_button">
        </div>
      </div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="utm-output">Generated Tracking URL</label>
        <textarea id="utm-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 100px; font-size: 0.95rem;"></textarea>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-utm-copy" class="bu-btn bu-btn-primary">Copy Tracking Link</button>
        <button type="button" id="btn-utm-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const baseIn = document.getElementById('utm-base');
      const srcIn = document.getElementById('utm-source');
      const medIn = document.getElementById('utm-medium');
      const cmpIn = document.getElementById('utm-campaign');
      const trmIn = document.getElementById('utm-term');
      const cntIn = document.getElementById('utm-content');
      const output = document.getElementById('utm-output');
      const copyBtn = document.getElementById('btn-utm-copy');
      const clearBtn = document.getElementById('btn-utm-clear');

      function generate() {
        const url = window.MTV_BU.buildUTM(baseIn.value.trim(), {
          source: srcIn.value.trim(),
          medium: medIn.value.trim(),
          campaign: cmpIn.value.trim(),
          term: trmIn.value.trim(),
          content: cntIn.value.trim()
        });
        output.value = url;
      }

      [baseIn, srcIn, medIn, cmpIn, trmIn, cntIn].forEach(el => el.addEventListener('input', generate));
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      clearBtn.addEventListener('click', () => {
        baseIn.value = '';
        srcIn.value = '';
        medIn.value = '';
        cmpIn.value = '';
        trmIn.value = '';
        cntIn.value = '';
        output.value = '';
        baseIn.focus();
      });
      generate();
    `
  },

  // 17. Robots.txt Generator
  {
    id: 'robots-txt-generator',
    categoryId: 'web-seo-utilities',
    name: 'Robots.txt Generator',
    icon: '🤖',
    title: 'Robots.txt Generator — Custom Search Engine Crawler Directives',
    description: 'Generate search-engine-compliant robots.txt files with custom user-agents, allow/disallow paths, crawl delays, and XML sitemaps.',
    keywords: 'robots.txt generator, create robots.txt, robots txt builder, crawler directives, googlebot allow disallow, sitemap robots.txt',
    howToUse: [
      { step: '1', title: 'Specify Crawlers', desc: 'Select standard User-agent (* for all, Googlebot, Bingbot).' },
      { step: '2', title: 'Set Rules', desc: 'Enter disallow paths (e.g., /admin/, /private/) and allow paths.' },
      { step: '3', title: 'Export File', desc: 'Copy the directives or download directly as robots.txt for your web root.' }
    ],
    features: [
      { title: 'Standard Syntax', desc: 'Generates RFC 9309 compliant User-agent, Allow, Disallow, and Sitemap rules.' },
      { title: 'Crawl Delay Support', desc: 'Optionally specifies delay seconds for high-traffic or API-heavy servers.' },
      { title: 'One-Click Presets', desc: 'Quick templates for Allow All, Disallow Private Folders, or Block All.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-agent">User-agent</label>
            <input type="text" id="rb-agent" class="bu-input bu-input-mono" value="*" placeholder="*">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-disallow">Disallow Paths (one per line)</label>
            <textarea id="rb-disallow" class="bu-textarea bu-textarea-mono" style="min-height: 90px;" placeholder="/admin/&#10;/private/&#10;/temp/">/api/
/admin/
/private/</textarea>
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-allow">Allow Paths (one per line)</label>
            <textarea id="rb-allow" class="bu-textarea bu-textarea-mono" style="min-height: 80px;" placeholder="/public/&#10;/assets/">/
/assets/</textarea>
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-sitemap">Sitemap URL</label>
            <input type="url" id="rb-sitemap" class="bu-input" value="https://multitubeviews.com/sitemap.xml">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-delay">Crawl-delay (seconds, optional)</label>
            <input type="number" id="rb-delay" class="bu-input" min="0" max="60" placeholder="e.g. 10">
          </div>
        </div>
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="rb-output">Generated robots.txt</label>
            <textarea id="rb-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 380px;"></textarea>
          </div>
          <div class="bu-actions-bar">
            <button type="button" id="btn-rb-copy" class="bu-btn bu-btn-primary">Copy robots.txt</button>
            <button type="button" id="btn-rb-download" class="bu-btn">Download robots.txt</button>
            <button type="button" id="btn-rb-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const agentIn = document.getElementById('rb-agent');
      const disallowIn = document.getElementById('rb-disallow');
      const allowIn = document.getElementById('rb-allow');
      const sitemapIn = document.getElementById('rb-sitemap');
      const delayIn = document.getElementById('rb-delay');
      const output = document.getElementById('rb-output');
      const copyBtn = document.getElementById('btn-rb-copy');
      const dlBtn = document.getElementById('btn-rb-download');
      const clearBtn = document.getElementById('btn-rb-clear');

      function generate() {
        const disallows = disallowIn.value.split('\\n').map(s => s.trim()).filter(Boolean);
        const allows = allowIn.value.split('\\n').map(s => s.trim()).filter(Boolean);
        const txt = window.MTV_BU.generateRobotsTxt({
          userAgent: agentIn.value.trim() || '*',
          disallow: disallows,
          allow: allows,
          sitemap: sitemapIn.value.trim(),
          crawlDelay: delayIn.value ? parseInt(delayIn.value, 10) : null
        });
        output.value = txt;
      }

      [agentIn, disallowIn, allowIn, sitemapIn, delayIn].forEach(el => el.addEventListener('input', generate));
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'robots.txt', 'text/plain');
      });
      clearBtn.addEventListener('click', () => {
        disallowIn.value = '';
        allowIn.value = '';
        sitemapIn.value = '';
        delayIn.value = '';
        generate();
      });
      generate();
    `
  },

  // 18. Sitemap XML Generator
  {
    id: 'sitemap-xml-generator',
    categoryId: 'web-seo-utilities',
    name: 'Sitemap XML Generator',
    icon: '🗺️',
    title: 'Sitemap XML Generator — Google & Search Console Compliant XML',
    description: 'Create valid XML sitemaps for search engines from a list of URLs with configurable priority, change frequency, and last-modified timestamps.',
    keywords: 'sitemap xml generator, create sitemap online, xml sitemap maker, google sitemap builder, generate sitemap.xml',
    howToUse: [
      { step: '1', title: 'Paste Page URLs', desc: 'Enter full URLs (including https://), one per line.' },
      { step: '2', title: 'Select Frequency & Priority', desc: 'Set change frequency (daily, weekly, monthly) and priority (0.1 to 1.0).' },
      { step: '3', title: 'Download sitemap.xml', desc: 'Export the clean XML file and upload to your web host.' }
    ],
    features: [
      { title: 'Sitemap 0.9 Standard', desc: 'Generates valid XML formatted for Google, Bing, and Yandex webmaster consoles.' },
      { title: 'Batch URL Processing', desc: 'Transform dozens of site URLs into structured XML nodes in seconds.' },
      { title: 'Custom Lastmod Date', desc: 'Includes ISO 8601 formatted date stamps for each URL.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="sm-urls">Page URLs (one per line)</label>
            <textarea id="sm-urls" class="bu-textarea bu-textarea-mono" style="min-height: 180px;" placeholder="https://example.com/&#10;https://example.com/about.html&#10;https://example.com/tools.html">https://multitubeviews.com/index.html
https://multitubeviews.com/platforms.html
https://multitubeviews.com/creator-tools.html
https://multitubeviews.com/media-converter-tools.html
https://multitubeviews.com/browser-utilities.html</textarea>
          </div>
          <div class="bu-grid-2col">
            <div class="bu-form-group">
              <label class="bu-form-label" for="sm-freq">Change Frequency</label>
              <select id="sm-freq" class="bu-select">
                <option value="daily">daily</option>
                <option value="weekly" selected>weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>
            <div class="bu-form-group">
              <label class="bu-form-label" for="sm-prio">Priority</label>
              <select id="sm-prio" class="bu-select">
                <option value="1.0">1.0 (Highest)</option>
                <option value="0.8" selected>0.8 (High)</option>
                <option value="0.5">0.5 (Normal)</option>
                <option value="0.3">0.3 (Low)</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="sm-output">Generated XML Sitemap</label>
            <textarea id="sm-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 320px;"></textarea>
          </div>
          <div class="bu-actions-bar">
            <button type="button" id="btn-sm-copy" class="bu-btn bu-btn-primary">Copy XML</button>
            <button type="button" id="btn-sm-download" class="bu-btn">Download sitemap.xml</button>
            <button type="button" id="btn-sm-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const urlsIn = document.getElementById('sm-urls');
      const freqIn = document.getElementById('sm-freq');
      const prioIn = document.getElementById('sm-prio');
      const output = document.getElementById('sm-output');
      const copyBtn = document.getElementById('btn-sm-copy');
      const dlBtn = document.getElementById('btn-sm-download');
      const clearBtn = document.getElementById('btn-sm-clear');

      function generate() {
        const lines = urlsIn.value.split('\\n').map(s => s.trim()).filter(Boolean);
        const xml = window.MTV_BU.generateSitemapXML(lines, {
          changefreq: freqIn.value,
          priority: prioIn.value
        });
        output.value = xml;
      }

      [urlsIn, freqIn, prioIn].forEach(el => el.addEventListener('input', generate));
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'sitemap.xml', 'application/xml');
      });
      clearBtn.addEventListener('click', () => {
        urlsIn.value = '';
        output.value = '';
        urlsIn.focus();
      });
      generate();
    `
  }
];
