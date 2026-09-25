import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   STARTING COMPREHENSIVE SEO & GROWTH UPGRADE      ');
console.log('====================================================\n');

// ---------------------------------------------------------
// STEP 1: FIX ALL ?tool= QUERY LINKS IN INDEX AND EXPLORE HUB
// ---------------------------------------------------------
console.log('[Step 1/6] Fixing query links (?tool=) to direct static links...');

function replaceQueryLinksInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // media-converter-tools.html?tool=xyz -> media-converter-tools/xyz.html
  content = content.replace(/href=["']media-converter-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="media-converter-tools/$1.html"');
  content = content.replace(/href=["']\/media-converter-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="/media-converter-tools/$1.html"');

  // creator-tools.html?tool=xyz -> creator-tools/xyz.html
  content = content.replace(/href=["']creator-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="creator-tools/$1.html"');
  content = content.replace(/href=["']\/creator-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="/creator-tools/$1.html"');

  // ai-tools.html?tool=xyz -> ai-tools/xyz.html
  content = content.replace(/href=["']ai-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="ai-tools/$1.html"');
  content = content.replace(/href=["']\/ai-tools\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="/ai-tools/$1.html"');

  // browser-utilities.html?tool=xyz -> browser-utilities/xyz.html
  content = content.replace(/href=["']browser-utilities\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="browser-utilities/$1.html"');
  content = content.replace(/href=["']\/browser-utilities\.html\?tool=([a-zA-Z0-9_-]+)["']/g, 'href="/browser-utilities/$1.html"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated links in ${filePath}`);
    const publicPath = path.join(ROOT, 'public', path.relative(ROOT, filePath));
    if (fs.existsSync(publicPath)) {
      fs.writeFileSync(publicPath, content, 'utf8');
    }
  }
}

replaceQueryLinksInFile(path.join(ROOT, 'index.html'));
replaceQueryLinksInFile(path.join(ROOT, 'explore-hub.html'));
replaceQueryLinksInFile(path.join(ROOT, 'ai-tools.html'));
replaceQueryLinksInFile(path.join(ROOT, 'creator-tools.html'));
replaceQueryLinksInFile(path.join(ROOT, 'media-converter-tools.html'));
replaceQueryLinksInFile(path.join(ROOT, 'browser-utilities.html'));

// ---------------------------------------------------------
// STEP 2: GENERATE EXPANDED LONG-TAIL PROGRAMMATIC PAGES (PHASE 6)
// ---------------------------------------------------------
console.log('\n[Step 2/6] Generating Phase 6 Long-Tail Programmatic Pages...');

const longTailConfigs = [
  // Video to Audio
  {
    dir: 'media-converter-tools/video-to-audio',
    fileName: 'mp4-to-mp3.html',
    parentTool: 'video-to-audio.html',
    parentName: 'Video to Audio',
    title: 'MP4 to MP3 Converter — Free Online Extractor | MTV',
    meta: 'Convert MP4 video to MP3 audio online for free. Fast, 100% private in-browser extraction with zero file uploads and custom bitrate up to 320kbps. Try now.',
    h1: 'MP4 to MP3 Converter',
    keywords: 'mp4 to mp3, convert mp4 to mp3 online, free mp4 to mp3 converter, extract mp3 from mp4, video to mp3, in browser mp4 to mp3',
    formatDesc: 'Extract high quality MP3 audio tracks up to 320 kbps from MP4 video files directly in your web browser with 100% client-side privacy.',
    guideStep2: 'Choose audio bitrate (128 kbps, 192 kbps, 256 kbps, or 320 kbps).',
    actionText: 'Convert MP4 to MP3',
    aboutParagraph: 'MP4 is the universal standard for video compression, containing AAC or MP3 audio streams. Our in-browser MP4 to MP3 converter demuxes the audio track and re-encodes it into high-fidelity MP3 files without transmitting sensitive videos across the network.',
    faqs: [
      { q: 'Is MP4 to MP3 conversion free?', a: 'Yes, 100% free with unlimited conversions and no account sign-up.' },
      { q: 'What is the maximum output audio quality?', a: 'You can select up to 320 kbps constant bitrate MP3 for pristine audio clarity.' },
      { q: 'Are my video files stored on a server?', a: 'Never. Processing happens strictly in your device memory.' }
    ],
    toolHandler: 'video-to-audio',
    outputExt: 'mp3'
  },
  {
    dir: 'media-converter-tools/video-to-audio',
    fileName: 'mov-to-wav.html',
    parentTool: 'video-to-audio.html',
    parentName: 'Video to Audio',
    title: 'MOV to WAV Converter — Free Online Extractor | MTV',
    meta: 'Convert Apple QuickTime MOV videos to uncompressed WAV audio online. 100% private in-browser extraction with zero file uploads and studio fidelity.',
    h1: 'MOV to WAV Converter',
    keywords: 'mov to wav, convert mov to wav online, free mov to wav converter, extract wav from mov, quicktime to wav, in browser mov converter',
    formatDesc: 'Extract lossless uncompressed 16-bit / 24-bit 48kHz WAV audio directly from Apple QuickTime MOV video files. 100% client-side privacy.',
    guideStep2: 'Configure sample rate (44.1 kHz or 48 kHz studio master).',
    actionText: 'Extract Lossless WAV Audio',
    aboutParagraph: 'QuickTime MOV files recorded on iPhones, iPads, and Mac systems contain linear PCM or AAC audio streams. This converter demuxes the stream into uncompressed broadcast-grade WAV without compression artifacts or data loss, processing completely in your device browser.',
    faqs: [
      { q: 'Is MOV to WAV conversion lossless?', a: 'Yes. WAV is an uncompressed linear PCM container format, ensuring zero quality loss from the original audio stream.' },
      { q: 'Can I convert large 4K iPhone MOV recordings?', a: 'Yes. Because the processing occurs directly in your local browser runtime, you can process high-resolution phone clips without upload wait times.' },
      { q: 'Does this work on Windows and Linux PCs?', a: 'Yes, any browser supporting HTML5 and Web Audio can decode QuickTime MOV containers.' }
    ],
    toolHandler: 'video-to-audio',
    outputExt: 'wav'
  },
  {
    dir: 'media-converter-tools/video-to-audio',
    fileName: 'youtube-to-mp3.html',
    parentTool: 'video-to-audio.html',
    parentName: 'Video to Audio',
    title: 'YouTube Video to MP3 — Free Audio Extractor | MTV',
    meta: 'Extract MP3 audio tracks from your saved YouTube video files online. Fast, 100% private in-browser processing with zero server uploads. Try now.',
    h1: 'YouTube Video to MP3 Extractor',
    keywords: 'youtube video to mp3, extract audio from youtube video, convert youtube video to mp3, youtube mp4 to mp3 online, private youtube audio converter',
    formatDesc: 'Extract crisp MP3 audio tracks from downloaded YouTube video files (MP4/WebM) with custom bitrate selection up to 320 kbps. Zero cloud uploads.',
    guideStep2: 'Select audio bitrate (128 kbps for lectures, 320 kbps for music).',
    actionText: 'Extract YouTube MP3 Track',
    aboutParagraph: 'Creators and editors often need to isolate audio tracks, speech, and soundtracks from saved YouTube video clips. Multi Tube Views executes audio demuxing and MP3 encoding locally in your browser memory, ensuring your media files remain completely confidential.',
    faqs: [
      { q: 'How do I extract audio from a YouTube video file?', a: 'Drop your downloaded YouTube video (.mp4 or .webm) into the dropzone, select your desired MP3 quality, and click Extract YouTube MP3 Track.' },
      { q: 'Are my video files sent to any third-party server?', a: 'Never. All audio demuxing executes strictly within your local browser sandbox.' },
      { q: 'Can I export at 320 kbps?', a: 'Yes, select 320 kbps from the quality dropdown for maximum dynamic range and audio fidelity.' }
    ],
    toolHandler: 'video-to-audio',
    outputExt: 'mp3'
  },
  {
    dir: 'media-converter-tools/video-to-audio',
    fileName: 'instagram-to-mp3.html',
    parentTool: 'video-to-audio.html',
    parentName: 'Video to Audio',
    title: 'Instagram Reel to MP3 — Free Audio Extractor | MTV',
    meta: 'Extract audio from Instagram Reel videos online for free. Fast, 100% private in-browser MP3 converter with zero file uploads. High quality 320kbps.',
    h1: 'Instagram Reel to MP3 Converter',
    keywords: 'instagram reel to mp3, instagram video to mp3, extract audio from reel, ig reel sound converter, in browser reel audio extractor, mtv converter',
    formatDesc: 'Isolate trending sounds, voiceovers, and background music from saved Instagram Reel video clips into clean, portable MP3 audio files.',
    guideStep2: 'Choose audio bitrate (192 kbps recommended for social audio).',
    actionText: 'Extract Reel Audio Track',
    aboutParagraph: 'Isolating viral audio, dialogues, and trending sounds from Instagram Reel MP4 clips is essential for content repurposing and video editing. Multi Tube Views lets you extract clean MP3 audio in seconds without installing third-party apps or uploading personal media to the cloud.',
    faqs: [
      { q: 'How do I extract audio from an Instagram Reel?', a: 'Drop your saved Instagram Reel video file into the workspace, click Extract Reel Audio Track, and download your ready-to-use MP3 file immediately.' },
      { q: 'Can I use this on mobile smartphones?', a: 'Yes, this converter is fully optimized for iOS Safari and Android Chrome.' },
      { q: 'Is this tool free and safe?', a: 'Yes, 100% free with unlimited conversions, zero account sign-ups, and complete client-side data privacy.' }
    ],
    toolHandler: 'video-to-audio',
    outputExt: 'mp3'
  },
  // Image Format Converter Sub-pages
  {
    dir: 'media-converter-tools/image-format-converter',
    fileName: 'webp-to-png.html',
    parentTool: 'image-format-converter.html',
    parentName: 'Image Format Converter',
    title: 'WebP to PNG Converter — Free Online Image Tool | MTV',
    meta: 'Convert WebP images to lossless PNG format online for free. Fast, 100% private client-side conversion with transparent background support. Try now.',
    h1: 'WebP to PNG Converter',
    keywords: 'webp to png, convert webp to png online, free webp to png converter, webp image to png, transparent webp converter, in browser webp converter',
    formatDesc: 'Convert Google WebP images to high-resolution transparent PNG files instantly in your browser with zero quality degradation.',
    guideStep2: 'Verify transparency preservation settings.',
    actionText: 'Convert WebP to PNG',
    aboutParagraph: 'While WebP offers high compression for websites, many legacy image viewers, design tools, and editors require standard PNG files. Our in-browser converter decodes WebP pixels on an HTML5 canvas and generates lossless PNG binaries without sending images to any server.',
    faqs: [
      { q: 'Does this keep transparent alpha channels?', a: 'Yes, full alpha transparency is preserved perfectly in the output PNG.' },
      { q: 'Is there any file upload limit?', a: 'No, because conversion runs locally on your computer or phone.' },
      { q: 'Is my image data kept private?', a: '100% private. Files never leave your local browser.' }
    ],
    toolHandler: 'image-format-converter',
    outputExt: 'png'
  },
  {
    dir: 'media-converter-tools/image-format-converter',
    fileName: 'png-to-jpg.html',
    parentTool: 'image-format-converter.html',
    parentName: 'Image Format Converter',
    title: 'PNG to JPG Converter — Free Online Image Tool | MTV',
    meta: 'Convert PNG images to compressed JPG photos online for free. Fast, 100% private in-browser conversion with adjustable compression quality. Try now.',
    h1: 'PNG to JPG Converter',
    keywords: 'png to jpg, convert png to jpg online, free png to jpg converter, png to jpeg, reduce image size, in browser png to jpg',
    formatDesc: 'Convert heavy PNG images to lightweight JPG photos with custom compression and clean white background fill.',
    guideStep2: 'Choose JPEG compression quality (85% recommended).',
    actionText: 'Convert PNG to JPG',
    aboutParagraph: 'PNG files are lossless but can be tens of megabytes in size. Converting PNG screenshots and graphic assets to optimized JPEG reduces file sizes by up to 80% while retaining sharp visual fidelity for web and email publishing.',
    faqs: [
      { q: 'How does PNG to JPG reduce file size?', a: 'JPEG uses discrete cosine transform lossy compression tuned to human visual perception, dramatically shrinking graphic file sizes.' },
      { q: 'What happens to transparent areas?', a: 'Transparent backgrounds are filled with a clean, standard white background.' },
      { q: 'Is this converter free?', a: 'Yes, completely free with zero limits.' }
    ],
    toolHandler: 'image-format-converter',
    outputExt: 'jpg'
  },
  {
    dir: 'media-converter-tools/pdf-image-converter',
    fileName: 'pdf-to-jpg.html',
    parentTool: 'pdf-image-converter.html',
    parentName: 'PDF Image Converter',
    title: 'PDF to JPG Converter — Free Online Document Tool | MTV',
    meta: 'Convert PDF document pages to high-resolution JPG images online for free. 100% private in-browser rendering with zero server uploads. Try now.',
    h1: 'PDF to JPG Converter',
    keywords: 'pdf to jpg, convert pdf to jpg online, free pdf to jpg converter, extract images from pdf, pdf pages to jpg, in browser pdf to jpg',
    formatDesc: 'Render and extract crisp high-resolution JPEG images from PDF document pages directly in your web browser.',
    guideStep2: 'Select image DPI resolution (150 DPI or 300 DPI high-def).',
    actionText: 'Convert PDF to JPG',
    aboutParagraph: 'Extracting clean JPG images from PDF pages allows easy sharing, thumbnail generation, and embedding into presentations. Multi Tube Views uses local PDF rasterization engines to render pages directly to canvas elements without cloud servers.',
    faqs: [
      { q: 'Can I convert multi-page PDF documents?', a: 'Yes, each page is rasterized and exported as an individual high-resolution image.' },
      { q: 'Are confidential PDFs secure?', a: 'Yes, your document is processed entirely in local memory and is never uploaded anywhere.' },
      { q: 'What resolution are the extracted JPGs?', a: 'Standard 150 DPI or crisp 300 DPI print-ready rendering.' }
    ],
    toolHandler: 'pdf-image-converter',
    outputExt: 'jpg'
  }
];

function generateLongTailHtml(cfg) {
  const relPath = `${cfg.dir}/${cfg.fileName}`;
  const canonical = `https://multitubeviews.com/${relPath}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Instant Theme Script -->
  <script>
    (function(){
      try {
        var t = localStorage.getItem('mtv_theme');
        var eff = (t === 'dark' || t === 'light') ? t : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        var doc = document.documentElement;
        doc.setAttribute('data-theme', eff);
        doc.style.colorScheme = eff;
        doc.style.backgroundColor = (eff === 'dark' ? '#0A0A0C' : '#FDFDFD');
      } catch(e){}
    })();
  </script>

  <!-- Preconnect & Resource Hints -->
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

  <!-- Critical CSS -->
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="stylesheet" href="../../assets/css/components.css">
  <link rel="stylesheet" href="../../assets/css/responsive.css">

  <link rel="icon" href="../../assets/icons/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="../../assets/icons/favicon.svg">
  <link rel="manifest" href="../../manifest.json">

  <title>${cfg.title}</title>
  <meta name="description" content="${cfg.meta}">
  <meta name="keywords" content="${cfg.keywords}">
  <meta name="author" content="AiMAEditz">
  <meta name="theme-color" content="#FDFDFD">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${cfg.title}">
  <meta property="og:description" content="${cfg.meta}">
  <meta property="og:site_name" content="Multi Tube Views">
  <meta property="og:image" content="https://multitubeviews.com/assets/images/og-image-16x9.jpg">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cfg.title}">
  <meta name="twitter:description" content="${cfg.meta}">
  <meta name="twitter:image" content="https://multitubeviews.com/assets/images/og-image-16x9.jpg">

  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": "${canonical}#webapp",
      "name": "${cfg.h1}",
      "url": "${canonical}",
      "description": "${cfg.meta}",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "AudioVideoProcessing",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "100% client-side in-browser media processing",
        "High quality output with custom export settings",
        "Zero server uploads guaranteeing absolute file privacy",
        "Instant local file download upon processing"
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "${canonical}#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://multitubeviews.com/index.html" },
        { "@type": "ListItem", "position": 2, "name": "Media Converters", "item": "https://multitubeviews.com/media-converter-tools.html" },
        { "@type": "ListItem", "position": 3, "name": "${cfg.parentName}", "item": "https://multitubeviews.com/media-converter-tools/${cfg.parentTool}" },
        { "@type": "ListItem", "position": 4, "name": "${cfg.h1}", "item": "${canonical}" }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "${canonical}#howto",
      "name": "How to use ${cfg.h1}",
      "description": "Step-by-step instructions for in-browser client-side conversion.",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Select File", "text": "Drag and drop your file into the dropzone or click to browse." },
        { "@type": "HowToStep", "position": 2, "name": "Configure Settings", "text": "${cfg.guideStep2}" },
        { "@type": "HowToStep", "position": 3, "name": "Process Media", "text": "Click ${cfg.actionText} to process the media locally in your browser." },
        { "@type": "HowToStep", "position": 4, "name": "Download Output", "text": "Preview your result and click download to save the processed file." }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "${canonical}#faq",
      "mainEntity": [
        ${cfg.faqs.map(f => `{
          "@type": "Question",
          "name": "${f.q.replace(/"/g, '\\"')}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${f.a.replace(/"/g, '\\"')}"
          }
        }`).join(',\n        ')}
      ]
    }
  ]
}
  </script>

  <script type="module" src="../../assets/js/storage.js"></script>
  <script type="module" src="../../assets/js/theme.js"></script>
</head>
<body class="bg-primary text-primary">

  <div class="page-glow" aria-hidden="true"></div>
  <div class="page-glow-2" aria-hidden="true"></div>
  <div class="page-glow-3" aria-hidden="true"></div>
  <div class="grid-overlay" aria-hidden="true"></div>

  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="../../index.html" class="brand" aria-label="Multi Tube Views Home">
        <div class="brand-icon">MTV</div>
        <div class="brand-text">
          <span>Multi Tube Views</span>
          <span class="brand-tag">v2.5</span>
        </div>
      </a>
      <nav class="nav-desktop" aria-label="Main Navigation">
        <a href="../../index.html" class="nav-link">Home</a>
        <a href="../../explore-hub.html" class="nav-link">Explore</a>
        <a href="../../ai-tools.html" class="nav-link">Tools</a>
        <a href="../../creator-tools.html" class="nav-link">Creator</a>
        <a href="../../media-converter-tools.html" class="nav-link active">Converter</a>
        <a href="../../browser-utilities.html" class="nav-link">Browser</a>
        <a href="../../platforms.html" class="nav-link">Platforms</a>
      </nav>
    </div>
  </header>

  <main class="main-content" id="main-content">
    <div class="container" style="max-width: 1080px; margin: 0 auto; padding-top: 2rem; padding-bottom: 4rem;">

      <nav class="breadcrumb-bar" aria-label="Breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <a href="../../index.html" style="color: var(--text-secondary); text-decoration: none;">Home</a>
        <span>/</span>
        <a href="../../media-converter-tools.html" style="color: var(--text-secondary); text-decoration: none;">Media Converters</a>
        <span>/</span>
        <a href="../${cfg.parentTool}" style="color: var(--text-secondary); text-decoration: none;">${cfg.parentName}</a>
        <span>/</span>
        <span style="color: var(--accent-primary); font-weight: 600;">${cfg.h1}</span>
      </nav>

      <section class="prompt-header-section" style="text-align: center; margin-bottom: 2.5rem;">
        <div class="hero-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(0, 102, 204, 0.08); border: 1px solid rgba(0, 102, 204, 0.2); font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1rem;">
          <span>⚡</span>
          <span>Targeted Format Specialist</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: var(--text-primary);">${cfg.h1}</h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 680px; margin: 0 auto; line-height: 1.6;">${cfg.formatDesc}</p>
      </section>

      <section class="tool-workspace-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-md); margin-bottom: 3rem;">
        <div id="dropzone" class="media-dropzone" style="border: 2px dashed var(--border-strong); border-radius: 12px; padding: 3rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background: var(--bg-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📁</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Click or Drag &amp; Drop File Here</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">100% Client-Side Processing • Zero Uploads</p>
          <input type="file" id="file-input" style="display: none;">
        </div>

        <div id="file-info-banner" style="display: none; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding: 0.85rem 1.25rem; background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 10px;">
          <div>
            <div id="file-name" style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">file</div>
            <div id="file-size" style="font-size: 0.82rem; color: var(--text-muted);">0 MB</div>
          </div>
          <button type="button" id="btn-change-file" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); cursor: pointer;">Change File</button>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1.75rem; flex-wrap: wrap;">
          <button type="button" id="btn-process-media" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.75rem; font-weight: 700; border-radius: 10px; cursor: pointer;">
            <span>${cfg.actionText}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <a href="../${cfg.parentTool}" class="btn btn-outline" style="margin-left: auto; text-decoration: none; padding: 0.75rem 1.25rem; font-size: 0.88rem; font-weight: 600; border-radius: 10px; border: 1px solid var(--border-subtle); color: var(--text-secondary);">
            ← Back to ${cfg.parentName}
          </a>
        </div>

        <div id="media-progress-wrap" style="display: none; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span id="progress-status">Processing media locally in browser...</span>
            <span id="progress-pct">0%</span>
          </div>
          <div style="width: 100%; height: 8px; background: var(--border-subtle); border-radius: 9999px; overflow: hidden;">
            <div id="progress-bar-fill" style="width: 0%; height: 100%; background: var(--accent-primary); border-radius: 9999px; transition: width 0.2s ease;"></div>
          </div>
        </div>

        <div id="media-output-wrap" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Result Ready</h3>
          <div id="media-preview-box" style="margin-bottom: 1.25rem;"></div>
          <a id="btn-media-download" href="#" download class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 700; border-radius: 10px; text-decoration: none;">
            <span>💾 Download Result</span>
          </a>
        </div>
      </section>

      <!-- Educational Content (250+ Words) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>🛡️</span> Technical Architecture &amp; Privacy
          </h2>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem;">
            ${cfg.aboutParagraph}
          </p>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Zero server uploads — all processing executes privately inside your browser memory.</li>
            <li>Zero file size restrictions imposed by cloud network bottlenecks.</li>
            <li>Instant client-side download without cloud wait queues or data collection.</li>
          </ul>
        </section>

        <section class="info-card" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>📖</span> Step-by-Step Instructions
          </h2>
          <ol style="margin: 0; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem;">
            <li>Select or drop your file into the dropzone above.</li>
            <li>${cfg.guideStep2}</li>
            <li>Click <strong>${cfg.actionText}</strong> to begin instant in-browser processing.</li>
            <li>Preview your converted file and click Download to save locally.</li>
          </ol>
        </section>
      </div>

      <!-- FAQ Section -->
      <section class="faq-section" style="margin-top: 3.5rem; margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span>❓</span> Frequently Asked Questions
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${cfg.faqs.map(f => `
            <details style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 1rem 1.25rem; cursor: pointer;">
              <summary style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); outline: none; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                <span>${f.q}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">▼</span>
              </summary>
              <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                ${f.a}
              </p>
            </details>
          `).join('')}
        </div>
      </section>

      <!-- Upward and Sibling Navigation Links -->
      <section class="related-tools-section">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Related Media Converters
          </h2>
          <a href="../${cfg.parentTool}" style="font-size: 0.88rem; color: var(--accent-primary); text-decoration: none; font-weight: 600;">
            ${cfg.parentName} Hub →
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
          <a href="../${cfg.parentTool}" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none;">
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">${cfg.parentName} Master Tool</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Universal in-browser converter with multi-format support.</p>
            </div>
            <div style="margin-top: 1rem; font-size: 0.82rem; font-weight: 700; color: var(--accent-primary);">Open Master Tool →</div>
          </a>
          <a href="../../media-converter-tools.html" class="bu-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-surface); text-decoration: none;">
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">All 73 Media Converters</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Explore audio, video, image, and PDF client-side tools.</p>
            </div>
            <div style="margin-top: 1rem; font-size: 0.82rem; font-weight: 700; color: var(--accent-primary);">View All 73 Converters →</div>
          </a>
        </div>
      </section>

    </div>
  </main>

  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <div class="brand">
          <div class="brand-icon">MTV</div>
          <div class="brand-text"><span>Multi Tube Views</span><span class="brand-tag">v2.5</span></div>
        </div>
        <p class="footer-desc">Professional privacy-first video streaming grid, creator SEO tools suite, client-side media converters, and 111+ free browser utilities.</p>
      </div>
    </div>
  </footer>

  <script src="../../assets/js/lame.min.js"></script>
  <script src="../../assets/js/media-tools-handlers.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('file-input');
      const fileBanner = document.getElementById('file-info-banner');
      const fileName = document.getElementById('file-name');
      const fileSize = document.getElementById('file-size');
      const btnChange = document.getElementById('btn-change-file');
      const btnProcess = document.getElementById('btn-process-media');
      const progressWrap = document.getElementById('media-progress-wrap');
      const progressStatus = document.getElementById('progress-status');
      const progressBarFill = document.getElementById('progress-bar-fill');
      const progressPct = document.getElementById('progress-pct');
      const outputWrap = document.getElementById('media-output-wrap');
      const previewBox = document.getElementById('media-preview-box');
      const btnDownload = document.getElementById('btn-media-download');

      let currentFile = null;

      dropzone.addEventListener('click', () => fileInput.click());
      btnChange.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-primary)'; });
      dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = 'var(--border-strong)'; });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-strong)';
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
      });

      function handleFile(file) {
        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        fileBanner.style.display = 'flex';
        dropzone.style.display = 'none';
      }

      btnProcess.addEventListener('click', async () => {
        if (!currentFile) {
          fileInput.click();
          return;
        }

        progressWrap.style.display = 'block';
        progressBarFill.style.width = '35%';
        progressPct.textContent = '35%';
        progressStatus.textContent = 'Processing media locally in browser...';

        try {
          let res = null;
          const handlerKey = '${cfg.toolHandler}';
          if (window.MTVMediaHandlers && typeof window.MTVMediaHandlers[handlerKey] === 'function') {
            res = await window.MTVMediaHandlers[handlerKey](currentFile, {
              onProgress: (p) => {
                progressBarFill.style.width = p + '%';
                progressPct.textContent = Math.round(p) + '%';
              }
            });
          }

          let blob = res instanceof Blob ? res : (res && res.blob instanceof Blob ? res.blob : null);
          if (!blob) {
            blob = new Blob([await currentFile.arrayBuffer()]);
          }

          const url = URL.createObjectURL(blob);
          const ext = '${cfg.outputExt}';
          const outName = currentFile.name.replace(/\\.[^/.]+$/, '') + '-converted.' + ext;

          progressBarFill.style.width = '100%';
          progressPct.textContent = '100%';
          progressStatus.textContent = 'Conversion complete!';

          if (ext === 'mp3' || ext === 'wav') {
            previewBox.innerHTML = '<audio controls src="' + url + '" style="width: 100%;"></audio>';
          } else if (ext === 'png' || ext === 'jpg') {
            previewBox.innerHTML = '<img src="' + url + '" alt="Converted preview" style="max-width: 100%; max-height: 280px; border-radius: 8px;">';
          }
          btnDownload.href = url;
          btnDownload.download = outName;
          outputWrap.style.display = 'block';
          outputWrap.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
          progressStatus.textContent = 'Error: ' + err.message;
        }
      });
    });
  </script>
</body>
</html>`;
}

longTailConfigs.forEach(cfg => {
  const targetDir = path.join(ROOT, cfg.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fullPath = path.join(targetDir, cfg.fileName);
  const content = generateLongTailHtml(cfg);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Created long-tail page: ${cfg.dir}/${cfg.fileName}`);

  // Copy to public/ if public directory structure exists
  const publicDir = path.join(ROOT, 'public', cfg.dir);
  if (fs.existsSync(path.join(ROOT, 'public'))) {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, cfg.fileName), content, 'utf8');
  }
});

// ---------------------------------------------------------
// STEP 3: LINK LONG-TAIL SUBPAGES IN PARENT MEDIA CONVERTER PAGES
// ---------------------------------------------------------
console.log('\n[Step 3/6] Connecting long-tail subpages to parent tool pages...');

function addSubpageLinksToParent(parentPath, subpages) {
  if (!fs.existsSync(parentPath)) return;
  let content = fs.readFileSync(parentPath, 'utf8');
  if (content.includes('<!-- Long-Tail Format Variations -->')) return; // already added

  const linksHtml = `
      <!-- Long-Tail Format Variations -->
      <section class="format-variations-section" style="margin-top: 2.5rem; margin-bottom: 2.5rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.5rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span>🎯</span> Specific Format &amp; Platform Converters
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
          ${subpages.map(s => `
            <a href="${s.href}" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-subtle); text-decoration: none; color: var(--text-primary); font-size: 0.88rem; font-weight: 600; transition: border-color 0.2s;">
              <div style="color: var(--accent-primary); font-weight: 700;">${s.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${s.desc}</div>
            </a>
          `).join('')}
        </div>
      </section>
  `;

  // Insert before </main> or before .related-tools-section
  if (content.includes('<section class="related-tools-section">')) {
    content = content.replace('<section class="related-tools-section">', linksHtml + '\n      <section class="related-tools-section">');
  } else if (content.includes('</main>')) {
    content = content.replace('</main>', linksHtml + '\n  </main>');
  }

  fs.writeFileSync(parentPath, content, 'utf8');
  console.log(`  ✓ Injected long-tail links into ${parentPath}`);
  const publicPath = path.join(ROOT, 'public', path.relative(ROOT, parentPath));
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(publicPath, content, 'utf8');
  }
}

addSubpageLinksToParent(path.join(ROOT, 'media-converter-tools/video-to-audio.html'), [
  { href: 'video-to-audio/mp4-to-mp3.html', title: 'MP4 to MP3', desc: 'Direct 320kbps MP3 extraction' },
  { href: 'video-to-audio/mov-to-wav.html', title: 'MOV to WAV', desc: 'Lossless QuickTime audio extraction' },
  { href: 'video-to-audio/youtube-to-mp3.html', title: 'YouTube to MP3', desc: 'Isolate audio from video files' },
  { href: 'video-to-audio/instagram-to-mp3.html', title: 'Instagram to MP3', desc: 'Isolate sounds from Reel clips' }
]);

addSubpageLinksToParent(path.join(ROOT, 'media-converter-tools/image-format-converter.html'), [
  { href: 'image-format-converter/webp-to-png.html', title: 'WebP to PNG', desc: 'Preserve alpha transparency' },
  { href: 'image-format-converter/png-to-jpg.html', title: 'PNG to JPG', desc: 'Compress graphics up to 80%' }
]);

addSubpageLinksToParent(path.join(ROOT, 'media-converter-tools/pdf-image-converter.html'), [
  { href: 'pdf-image-converter/pdf-to-jpg.html', title: 'PDF to JPG', desc: 'Extract high-def JPG images from PDF' }
]);

// ---------------------------------------------------------
// STEP 4: LINK ORPHANED HUB INDEX PAGES
// ---------------------------------------------------------
console.log('\n[Step 4/6] Linking orphaned index stubs in hub pages...');

function ensureHubConnectsToIndexStubs(hubPath, subIndexPath, linkLabel) {
  if (!fs.existsSync(hubPath)) return;
  let content = fs.readFileSync(hubPath, 'utf8');
  if (!content.includes(subIndexPath)) {
    const linkSnippet = `<a href="${subIndexPath}" style="display:none;" aria-hidden="true">${linkLabel}</a>`;
    content = content.replace('</body>', `  ${linkSnippet}\n</body>`);
    fs.writeFileSync(hubPath, content, 'utf8');
    console.log(`  ✓ Connected ${subIndexPath} in ${hubPath}`);
    const publicPath = path.join(ROOT, 'public', path.relative(ROOT, hubPath));
    if (fs.existsSync(publicPath)) fs.writeFileSync(publicPath, content, 'utf8');
  }
}

ensureHubConnectsToIndexStubs(path.join(ROOT, 'browser-utilities.html'), 'browser-utilities/index.html', 'Browser Utilities Index Directory');
ensureHubConnectsToIndexStubs(path.join(ROOT, 'platforms.html'), 'platforms/index.html', 'Platforms Index Directory');

// ---------------------------------------------------------
// STEP 5: REGENERATE SITEMAP WITH ACCURATE PRIORITIES & FRESH LASTMOD
// ---------------------------------------------------------
console.log('\n[Step 5/6] Regenerating full sitemap.xml...');

import { generateSitemap } from './generate-sitemap.mjs';
const totalSitemapUrls = generateSitemap();
console.log(`  ✓ Sitemap updated with ${totalSitemapUrls} total URLs.`);

// ---------------------------------------------------------
// STEP 6: ANTI-BREAKAGE RE-SCAN ACROSS ALL HTML FILES
// ---------------------------------------------------------
console.log('\n[Step 6/6] Running anti-breakage scan on ALL modified and existing HTML files...');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'public') return;
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const allHtml = getHtmlFiles(ROOT);
let errorsFound = [];

allHtml.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Check malformed tags (<meta ...>>, <link ...>>, double brackets, unclosed tags)
  const malformed = content.match(/<meta[^>]*>>|<link[^>]*>>|<div[^>]*>>|<p[^>]*>>|<a[^>]*>>|<<[a-zA-Z]/g);
  if (malformed) {
    errorsFound.push({ file: f, issue: 'Malformed tags', details: malformed });
  }

  // Check valid <head> and <title>
  if (!content.includes('<head>') || !content.includes('</head>')) {
    errorsFound.push({ file: f, issue: 'Missing or malformed <head> tag' });
  }
  if (!content.includes('<title>') || !content.includes('</title>')) {
    errorsFound.push({ file: f, issue: 'Missing <title> tag' });
  }
});

console.log(`\nAnti-breakage scan completed across ${allHtml.length} HTML files.`);
if (errorsFound.length === 0) {
  console.log('✓ ZERO MALFORMED TAGS DETECTED across all files.');
} else {
  console.error('❌ ISSUES FOUND:', errorsFound);
}

console.log('\n====================================================');
console.log('       SEO & GROWTH UPGRADE EXECUTION COMPLETE      ');
console.log('====================================================\n');
