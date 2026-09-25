import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

const rootAdjustments = {
  'index.html': {
    title: 'Multi Tube Views — 505+ Free Media & AI Tools | MTV',
    meta: 'Access 505+ free in-browser tools on Multi Tube Views. Multi-player video grids, 73 media converters, 70 creator tools, and 211 AI utilities.'
  },
  'about.html': {
    title: 'About Multi Tube Views — Free 505+ Tools Workspace',
    meta: 'Learn about Multi Tube Views (MTV): a free public workspace with 505+ AI, creator, converter, and utility tools. 100% private and client-side.'
  },
  'ai-auto.html': {
    title: 'Automated Video SEO Generator — Free SEO Pack | MTV',
    meta: 'Generate complete automated video SEO packages on Multi Tube Views. Instant high-CTR titles, descriptions, tags, and hashtags with zero login.'
  },
  'articles.html': {
    title: 'Video SEO Guides & Media Player Architecture | MTV',
    meta: 'Read in-depth video SEO guides, client-side streaming architectures, and creator growth tutorials on Multi Tube Views. 100% free resources.'
  },
  'browser-utilities.html': {
    title: 'Browser Utilities — 111 Free Client-Side Tools | MTV',
    meta: 'Suite of 111 fast, 100% private in-browser utilities for developers and creators. Text tools, unit converters, CSS generators, and code tools.'
  },
  'contact.html': {
    title: 'Contact Multi Tube Views — Support & Inquiries | MTV',
    meta: 'Contact the Multi Tube Views team for support, feature feedback, and tool suggestions. Fast response for all creator and developer inquiries.'
  },
  'credits.html': {
    title: 'Credits & Open Source Acknowledgments | Multi Tube Views',
    meta: 'View open-source acknowledgments, libraries, icons, and platform trademark attributions powering the free Multi Tube Views media workspace.'
  },
  'disclaimer.html': {
    title: 'Legal & Platform Disclaimer — Multi Tube Views | MTV',
    meta: 'Read the official Multi Tube Views platform disclaimer, third-party media embedding policies, and terms of fair use for creator utilities.'
  },
  'explore-hub.html': {
    title: 'Explore Hub — 505+ Free Online Tools Directory | MTV',
    meta: 'Explore the complete directory of 505+ client-side utilities, generative AI tools, media converters, and 40+ supported media player platforms.'
  },
  'media-converter-tools.html': {
    title: 'In-Browser Media Converters — 73 Free Tools | MTV',
    meta: 'Convert, compress, and edit media files in your browser with 73 free converters on Multi Tube Views. 100% private with zero server uploads.'
  },
  'platforms.html': {
    title: 'Supported Media Platforms — 40+ Video Grids | MTV',
    meta: 'Watch and compare videos across 40+ supported streaming platforms on Multi Tube Views. Multi-player grid workspaces with independent audio.'
  },
  'privacy.html': {
    title: 'Privacy Policy — Zero Data Collection | Multi Tube Views',
    meta: 'Read our strict privacy policy. Multi Tube Views operates 100% client-side with zero data collection, no tracking cookies, and no accounts.'
  },
  'settings.html': {
    title: 'Workspace Settings & Layout Preferences | Multi Tube Views',
    meta: 'Customize default grid layouts, playback audio sync, theme preferences, and quick URL import behaviors stored locally in your web browser.'
  },
  'terms.html': {
    title: 'Terms of Service — Usage Guidelines | Multi Tube Views',
    meta: 'Review the Terms of Service for Multi Tube Views. Clear usage guidelines, embedding policies, and fair use terms for our free 505+ tools.'
  }
};

for (const [file, data] of Object.entries(rootAdjustments)) {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<title>[^<]+<\/title>/i, `<title>${data.title}</title>`);
    content = content.replace(/<meta\s+(?:name=["']description["']\s+content=["'][^"']+["']|content=["'][^"']+["']\s+name=["']description["'])[^>]*>/i, `<meta name="description" content="${data.meta}">`);
    content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']+["'][^>]*>/i, `<meta property="og:title" content="${data.title}">`);
    content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']+["'][^>]*>/i, `<meta property="og:description" content="${data.meta}">`);
    content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["'][^>]*>/i, `<meta name="twitter:title" content="${data.title}">`);
    content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["'][^>]*>/i, `<meta name="twitter:description" content="${data.meta}">`);
    fs.writeFileSync(filePath, content, 'utf8');

    const publicCopy = path.join(ROOT, 'public', file);
    if (fs.existsSync(publicCopy)) {
      fs.copyFileSync(filePath, publicCopy);
    }
    console.log(`✓ Tuned ${file} (Title: ${data.title.length} chars, Meta: ${data.meta.length} chars)`);
  }
}
