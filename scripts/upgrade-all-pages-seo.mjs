import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

// Helper for SEO Titles (Strictly 50-60 chars)
function getOptimalTitle(name, type = 'Tool') {
  const clean = name.trim();

  // Try variations in length order to find the one closest to 55 chars (50-60 range)
  const candidates = [
    `${clean} — Free Online ${type} | MTV`,
    `${clean} — Free Online In-Browser ${type} | MTV`,
    `${clean} — Free ${type} Online | MTV`,
    `${clean} — Free Online Tool | Multi Tube`,
    `${clean} — Free In-Browser Tool | MTV`,
    `${clean} — Free Online Utility | MTV`,
    `${clean} — Fast Online Tool | MTV`,
    `${clean} — Free Online Tool | MTV`,
    `${clean} — Free Generator | MTV`,
    `${clean} | Multi Tube Views`,
    `${clean} | MTV Online Tool`
  ];

  for (const c of candidates) {
    if (c.length >= 50 && c.length <= 60) return c;
  }

  // If none hit 50-60 exactly, build custom fitting string
  let base = `${clean} — Free Online Tool`;
  if (base.length < 50) {
    base = `${clean} — Free Online In-Browser Tool | MTV`;
    if (base.length > 60) {
      base = `${clean} — Free Online ${type} | MTV`;
    }
    if (base.length > 60) {
      base = `${clean} — Free Online Tool | MTV`;
    }
  }

  if (base.length > 60) {
    base = `${clean} — Free Online Tool`;
    if (base.length > 60) {
      base = clean.slice(0, 56) + '...';
    }
  }

  // Ensure minimum 50
  if (base.length < 50) {
    const pad = ' | MTV Online';
    if ((base + pad).length <= 60) {
      base = base + pad;
    }
  }

  return base;
}

// Helper for SEO Meta Descriptions (Strictly 135-155 chars, primary keyword in first 10 words)
function getOptimalMeta(name, rawDesc, type = 'tool') {
  const cleanName = name.trim();
  const cleanDesc = (rawDesc || '').trim().replace(/\.$/, '');

  const templates = [
    `Use the free ${cleanName} online. ${cleanDesc}. Fast, 100% private in-browser ${type} with zero server uploads. Try it now.`,
    `Use the free ${cleanName} online. ${cleanDesc}. Fast, 100% private in-browser ${type} with zero uploads.`,
    `Use free ${cleanName} on Multi Tube Views. ${cleanDesc}. 100% private client-side ${type} with zero uploads.`,
    `Free ${cleanName} online on Multi Tube Views: ${cleanDesc}. Fast, 100% private in-browser tool with zero server uploads.`,
    `Use our free ${cleanName} online tool. ${cleanDesc}. 100% private in-browser processing with zero file uploads.`,
    `Free ${cleanName} tool on Multi Tube Views. ${cleanDesc}. Fast, secure, and 100% private client-side processing.`
  ];

  for (const t of templates) {
    if (t.length >= 135 && t.length <= 155) return t;
  }

  // If none matched length range, construct carefully
  let target = `Use the free ${cleanName} online. ${cleanDesc}. Fast, 100% private in-browser ${type} with zero server uploads.`;
  if (target.length > 155) {
    const available = 155 - `Use the free ${cleanName} online. . Fast, private, and 100% in-browser.`.length;
    const truncatedDesc = cleanDesc.slice(0, Math.max(20, available)).trim().replace(/\s+\S*$/, '');
    target = `Use the free ${cleanName} online. ${truncatedDesc}. Fast, private, and 100% in-browser with zero uploads.`;
  }

  if (target.length < 135) {
    target = `Use the free ${cleanName} online tool on Multi Tube Views. ${cleanDesc}. 100% private client-side processing with zero server uploads. Try it now.`;
    if (target.length > 155) {
      target = `Use the free ${cleanName} on Multi Tube Views. ${cleanDesc}. Fast, 100% private in-browser tool with zero server uploads.`;
    }
  }

  if (target.length > 155) {
    target = target.slice(0, 151).trim() + '...';
  }

  // Ensure minimum 135 chars
  if (target.length < 135) {
    target = target.replace(/\.$/, '') + '. 100% free with zero registration.';
    if (target.length > 155) {
      target = target.slice(0, 151).trim() + '...';
    }
  }

  return target;
}

// Generate FAQ pairs
function getFaqs(name, section, category = '') {
  if (section === 'media') {
    return [
      {
        q: `How do I convert or process files using ${name}?`,
        a: `Select or drop your media file into the dropzone above, adjust your desired output settings or format parameters, and click the process button. Your file is processed directly in your browser.`
      },
      {
        q: `Are my media files uploaded to an external server?`,
        a: `No. ${name} processes your video, audio, image, or document locally inside your browser runtime via Web Audio and HTML5 Canvas. Zero data is ever sent to cloud servers.`
      },
      {
        q: `Is there a file size limit or watermarking?`,
        a: `There are no arbitrary file size caps imposed by remote upload limits, and Multi Tube Views never adds watermarks. The tool is 100% free with unlimited local processing.`
      },
      {
        q: `Can I download my processed file immediately?`,
        a: `Yes, as soon as local conversion completes, click the Download button to save your file directly to your computer or mobile device.`
      }
    ];
  } else if (section === 'creator') {
    return [
      {
        q: `How does ${name} help content creators grow?`,
        a: `The ${name} generates search-optimized metadata, engaging hooks, and high-CTR phrasing designed specifically for YouTube, TikTok, and social media discovery algorithms.`
      },
      {
        q: `Is ${name} free to use without an account?`,
        a: `Yes, ${name} is completely free with no registration, login, or subscriptions. You can generate unlimited creator metadata instantly.`
      },
      {
        q: `Can I export or copy results from ${name}?`,
        a: `Yes, you can copy outputs with one click using the Copy button or download them as a text file for immediate use in your video publishing workflow.`
      },
      {
        q: `Does ${name} work on mobile devices?`,
        a: `Yes, Multi Tube Views is fully responsive and optimized for smartphones, tablets, and desktop workstations.`
      }
    ];
  } else if (section === 'ai') {
    return [
      {
        q: `What is the ${name} and how does it work?`,
        a: `The ${name} is a dedicated generative tool engineered with specialized prompt structures for ${category || 'creative workflows'}. Enter your topic or instructions to get tailored results instantly.`
      },
      {
        q: `Is ${name} 100% free with unlimited generations?`,
        a: `Yes, Multi Tube Views provides free, unlimited access with no credit cards, credits, signups, or usage limits.`
      },
      {
        q: `Are my prompts and outputs private?`,
        a: `Yes. Your inputs and generated responses are kept private in your browser session and are not stored or indexed on remote databases.`
      },
      {
        q: `Can I use outputs from ${name} commercially?`,
        a: `Yes, all content generated by ${name} is yours to use freely for personal, editorial, or commercial projects without restrictions.`
      }
    ];
  } else if (section === 'platform') {
    return [
      {
        q: `Can I watch multiple ${name} streams simultaneously?`,
        a: `Yes, Multi Tube Views allows you to play multiple ${name} videos, livestreams, or clips side-by-side in custom multi-player grid layouts.`
      },
      {
        q: `Do I need to log in to stream ${name}?`,
        a: `No account or login is required. Paste your stream or video links and start watching immediately with independent volume and mute controls.`
      },
      {
        q: `Is ${name} multi-view supported on mobile?`,
        a: `Yes, the multi-player grid adapts seamlessly to mobile screens with touch-friendly controls and responsive aspect ratios.`
      }
    ];
  } else {
    return [
      {
        q: `How do I use the ${name} utility?`,
        a: `Enter your text, numbers, or configuration into the input fields above. The utility processes your calculation or conversion immediately in your browser.`
      },
      {
        q: `Does ${name} require an internet connection after loading?`,
        a: `Because ${name} executes 100% client-side via JavaScript, it functions smoothly even with offline or intermittent connectivity once loaded.`
      },
      {
        q: `Is my data safe when using ${name}?`,
        a: `Yes. All calculations, formatting, and operations remain isolated inside your browser's local sandbox with zero server telemetry.`
      },
      {
        q: `Can I use ${name} on both mobile and desktop?`,
        a: `Yes, the tool is optimized for all screen sizes, supporting touch inputs, dark mode, and quick copy-to-clipboard actions.`
      }
    ];
  }
}

// Generate HowTo Steps
function getHowToSteps(name, section) {
  if (section === 'media') {
    return [
      { position: 1, name: 'Select Media File', text: 'Drag and drop your media file into the dropzone or click to browse.' },
      { position: 2, name: 'Configure Output Options', text: 'Adjust format settings, bitrate, resolution, or quality parameters.' },
      { position: 3, name: 'Convert Locally', text: 'Click the process button to execute client-side media conversion.' },
      { position: 4, name: 'Download Result', text: 'Preview your converted media and click Download to save locally.' }
    ];
  } else if (section === 'creator') {
    return [
      { position: 1, name: 'Enter Topic or Keywords', text: 'Input your video topic, niche keywords, or content theme.' },
      { position: 2, name: 'Set Optimization Goals', text: 'Choose your preferred target format or distribution channel.' },
      { position: 3, name: 'Generate Content', text: 'Click Generate to run client-side creator optimization.' },
      { position: 4, name: 'Copy & Publish', text: 'Copy generated titles, tags, or scripts directly into your workflow.' }
    ];
  } else if (section === 'ai') {
    return [
      { position: 1, name: 'Enter Prompt or Topic', text: 'Type your requirements, seed topic, or creative instructions.' },
      { position: 2, name: 'Configure Options', text: 'Specify format, style, or focus parameters as needed.' },
      { position: 3, name: 'Generate AI Output', text: 'Click Generate to start high-speed generative processing.' },
      { position: 4, name: 'Copy or Download', text: 'Review the output preview, copy to clipboard, or download as text.' }
    ];
  } else if (section === 'platform') {
    return [
      { position: 1, name: 'Paste Stream URLs', text: `Enter public ${name} video or livestream links into the grid inputs.` },
      { position: 2, name: 'Choose Grid Layout', text: 'Select dual split-screen, triple stream, or quad multi-view.' },
      { position: 3, name: 'Sync & Watch', text: 'Control volume, fullscreen, and playback independently for each stream.' }
    ];
  } else {
    return [
      { position: 1, name: 'Input Data or Values', text: 'Enter your text, numbers, code, or parameters into the input fields.' },
      { position: 2, name: 'Select Options', text: 'Adjust conversion units, formatting styles, or options.' },
      { position: 3, name: 'Execute Operation', text: 'Calculation or conversion executes instantly client-side.' },
      { position: 4, name: 'Copy Results', text: 'Copy formatted outputs to your clipboard or download files.' }
    ];
  }
}

// Generate Cross-Category Links HTML
function getCrossCategoryLinks(section, currentToolId) {
  const hubs = [
    { name: 'Media Converters', path: '../media-converter-tools.html', icon: '🎬', desc: '73 in-browser media converters' },
    { name: 'Creator Tools', path: '../creator-tools.html', icon: '📝', desc: '70 high-CTR video SEO tools' },
    { name: 'AI Generative Tools', path: '../ai-tools.html', icon: '⚡', desc: '211 generative writing tools' },
    { name: 'Browser Utilities', path: '../browser-utilities.html', icon: '🛠️', desc: '111 client-side web utilities' },
    { name: 'Platform Workspaces', path: '../platforms.html', icon: '🌐', desc: '40 multi-stream player grids' }
  ];

  const currentHubName = section === 'media' ? 'Media Converters' :
                         section === 'creator' ? 'Creator Tools' :
                         section === 'ai' ? 'AI Generative Tools' :
                         section === 'platform' ? 'Platform Workspaces' : 'Browser Utilities';

  const otherHubs = hubs.filter(h => h.name !== currentHubName).slice(0, 3);

  return `
    <!-- Cross-Category Exploration Hub Links -->
    <section class="cross-category-section" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0;">
          Explore More Multi Tube Views Workspaces
        </h2>
        <a href="../explore-hub.html" style="font-size: 0.88rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">
          Explore All 505+ Tools →
        </a>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
        ${otherHubs.map(h => `
          <a href="${h.path}" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.3rem;">${h.icon}</span>
                <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-primary);">${h.name}</h3>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${h.desc}</p>
            </div>
            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); display: flex; align-items: center; gap: 0.25rem;">
              <span>Open Suite</span>
              <span>→</span>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

// Generate FAQ HTML Block
function renderFaqHtml(faqs) {
  return `
    <!-- Comprehensive FAQ Section (Rich Snippets) -->
    <section class="faq-section" style="margin-top: 3.5rem; margin-bottom: 3.5rem;">
      <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
        <span>❓</span> Frequently Asked Questions
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${faqs.map(faq => `
          <details style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 1rem 1.25rem; cursor: pointer; transition: background 0.2s ease;">
            <summary style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); outline: none; list-style: none; display: flex; justify-content: space-between; align-items: center;">
              <span>${faq.q}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">▼</span>
            </summary>
            <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
              ${faq.a}
            </p>
          </details>
        `).join('')}
      </div>
    </section>
  `;
}

export {
  getOptimalTitle,
  getOptimalMeta,
  getFaqs,
  getHowToSteps,
  getCrossCategoryLinks,
  renderFaqHtml
};

console.log('SEO Upgrade module loaded.');
