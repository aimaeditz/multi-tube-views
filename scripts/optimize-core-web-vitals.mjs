import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (filePath.includes('/node_modules') || filePath.includes('/dist') || filePath.includes('/public') || file.startsWith('.')) {
      return;
    }
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

function optimizeHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  const isSubFolder = normalizedPath.includes('/');
  const assetPrefix = isSubFolder ? '../' : '';

  let modified = false;

  // Clean any duplicated decoding= strings
  if (content.includes('decoding=')) {
    const cleanedContent = content.replace(/(decoding=)+/g, 'decoding=')
                                  .replace(/decoding="async"\s+decoding="async"/g, 'decoding="async"');
    if (cleanedContent !== content) {
      content = cleanedContent;
      modified = true;
    }
  }

  // 1. Add Resource Hints (Preconnect & DNS prefetch) for all external resource domains used on this page
  const possibleResourceDomains = [
    { domain: 'www.googletagmanager.com', pattern: /googletagmanager\.com/ },
    { domain: 'pagead2.googlesyndication.com', pattern: /(googlesyndication\.com|adsbygoogle)/ },
    { domain: 'cdnjs.cloudflare.com', pattern: /cdnjs\.cloudflare\.com/ },
    { domain: 'cdn.jsdelivr.net', pattern: /cdn\.jsdelivr\.net/ },
    { domain: 'fonts.googleapis.com', pattern: /fonts\.googleapis\.com/ },
    { domain: 'fonts.gstatic.com', pattern: /fonts\.gstatic\.com/ },
    { domain: 'unpkg.com', pattern: /unpkg\.com/ }
  ];

  const neededDomains = [];
  possibleResourceDomains.forEach(({ domain, pattern }) => {
    if (pattern.test(content)) {
      neededDomains.push(domain);
    }
  });

  const missingPreconnects = [];
  const missingDnsPrefetches = [];

  neededDomains.forEach(domain => {
    const pcPattern = new RegExp(`<link[^>]*rel=["']preconnect["'][^>]*href=["']https://${domain.replace(/\./g, '\\.')}/?["']`, 'i');
    const pcPatternAlt = new RegExp(`<link[^>]*href=["']https://${domain.replace(/\./g, '\\.')}/?["'][^>]*rel=["']preconnect["']`, 'i');
    if (!pcPattern.test(content) && !pcPatternAlt.test(content)) {
      missingPreconnects.push(`  <link rel="preconnect" href="https://${domain}" crossorigin>`);
    }

    const dnsPattern = new RegExp(`<link[^>]*rel=["']dns-prefetch["'][^>]*href=["']https://${domain.replace(/\./g, '\\.')}/?["']`, 'i');
    const dnsPatternAlt = new RegExp(`<link[^>]*href=["']https://${domain.replace(/\./g, '\\.')}/?["'][^>]*rel=["']dns-prefetch["']`, 'i');
    if (!dnsPattern.test(content) && !dnsPatternAlt.test(content)) {
      missingDnsPrefetches.push(`  <link rel="dns-prefetch" href="https://${domain}">`);
    }
  });

  if (missingPreconnects.length > 0 || missingDnsPrefetches.length > 0) {
    const newHints = [...missingPreconnects, ...missingDnsPrefetches].join('\n') + '\n';
    if (content.includes('<!-- Resource Hints & Preconnects for Performance Optimization -->')) {
      content = content.replace(
        '<!-- Resource Hints & Preconnects for Performance Optimization -->',
        `<!-- Resource Hints & Preconnects for Performance Optimization -->\n${newHints.trimEnd()}`
      );
      modified = true;
    } else if (content.includes('<head>')) {
      content = content.replace(
        '<head>',
        `<head>\n  <!-- Resource Hints & Preconnects for Performance Optimization -->\n${newHints}`
      );
      modified = true;
    }
  }

  // 2. Add CSS Preloads if missing
  if (!content.includes('as="style"') && !content.includes("as='style'")) {
    const stylePreloads = `  <!-- Preload Critical CSS Assets -->
  <link rel="preload" href="${assetPrefix}assets/css/style.css" as="style">
  <link rel="preload" href="${assetPrefix}assets/css/components.css" as="style">
  <link rel="preload" href="${assetPrefix}assets/css/responsive.css" as="style">\n\n`;

    const firstStyleIndex = content.search(/<link\s+rel=["']stylesheet["']/i);
    if (firstStyleIndex !== -1) {
      content = content.slice(0, firstStyleIndex) + stylePreloads + content.slice(firstStyleIndex);
      modified = true;
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', `${stylePreloads}</head>`);
      modified = true;
    }
  }

  // 2.5 Add Instant Theme Boot Script if missing
  if (!content.includes('mtv_theme') && content.includes('</head>')) {
    const themeBoot = `  <!-- Instant Theme Boot Script to prevent flash or lag -->
  <script>
    (function(){
      try {
        var t = localStorage.getItem('mtv_theme');
        if (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          t = 'dark';
        }
        if (t === 'dark' || t === 'light') {
          document.documentElement.setAttribute('data-theme', t);
          document.documentElement.style.colorScheme = t;
        }
      } catch(e){}
    })();
  </script>\n`;
    content = content.replace('</head>', `${themeBoot}</head>`);
    modified = true;
  }

  // 3. Defer non-critical scripts missing async / defer / type="module"
  content = content.replace(/<script\s+([^>]*src=["'][^"']+["'][^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('async') && !attrs.includes('defer') && !attrs.includes('type="module"') && !attrs.includes("type='module'")) {
      modified = true;
      return `<script ${attrs} defer>`;
    }
    return match;
  });

  // 4. Add loading="lazy" and decoding="async" to all <img> tags missing loading attribute
  content = content.replace(/<img\s+([^>]*)\/?>/gi, (match, attrs) => {
    let cleanAttrs = attrs.replace(/\/\s*$/, '').trim();
    if (!cleanAttrs.includes('loading=')) {
      modified = true;
      if (!cleanAttrs.includes('decoding=')) {
        cleanAttrs += ' decoding="async"';
      }
      cleanAttrs += ' loading="lazy"';
      return `<img ${cleanAttrs} />`;
    }
    return match;
  });

  // 5. Cumulative Layout Shift Fix: Ensure font-display: swap on all Google Fonts links if present
  content = content.replace(/href=["'](https:\/\/fonts\.googleapis\.com\/css2?[^"']+)["']/gi, (match, url) => {
    if (!url.includes('display=swap')) {
      modified = true;
      const joiner = url.includes('?') ? '&' : '?';
      return `href="${url}${joiner}display=swap"`;
    }
    return match;
  });

  // Final cleanup of img tags for duplicate attributes
  content = content.replace(/<img\s+([^>]*)\/?>/gi, (match, attrs) => {
    let clean = attrs
      .replace(/(decoding=)+/g, 'decoding=')
      .replace(/decoding="async"\s+decoding="async"/g, 'decoding="async"')
      .replace(/loading="lazy"\s+loading="lazy"/g, 'loading="lazy"');
    if (clean !== attrs) {
      modified = true;
      return `<img ${clean.trim()} />`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return modified;
}

const files = getHtmlFiles('.');
let updatedCount = 0;
files.forEach(file => {
  if (optimizeHtmlFile(file)) {
    updatedCount++;
  }
});

console.log(`Core Web Vitals optimizations applied across ${updatedCount} / ${files.length} HTML files.`);
