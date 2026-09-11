/**
 * Multi Tube Views (MTV) — Browser Utilities Core Engine
 * 100% Client-Side Native Browser Processing
 * Zero Server Calls · Zero External APIs · Zero File Uploads
 */

(function(window) {
  'use strict';

  const MTV_BU = {
    // UI Helpers
    copyToClipboard: async function(text, buttonEl) {
      if (!text) return false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          textarea.style.top = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        if (buttonEl) {
          const originalHtml = buttonEl.innerHTML;
          buttonEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.35rem;"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
          buttonEl.classList.add('btn-copied');
          setTimeout(() => {
            buttonEl.innerHTML = originalHtml;
            buttonEl.classList.remove('btn-copied');
          }, 2000);
        }
        return true;
      } catch (err) {
        console.error('Copy failed:', err);
        return false;
      }
    },

    downloadFile: function(content, filename, mimeType = 'text/plain;charset=utf-8') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    escapeHtml: function(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    formatBytes: function(bytes, decimals = 2) {
      if (!+bytes) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },

    // 1. TEXT UTILITIES
    convertCase: function(text, mode) {
      if (!text) return '';
      switch (mode) {
        case 'uppercase':
          return text.toUpperCase();
        case 'lowercase':
          return text.toLowerCase();
        case 'title':
          return text.toLowerCase().replace(/(?:^|\s|-|_)\S/g, char => char.toUpperCase());
        case 'sentence':
          return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        case 'camel': {
          const words = text.replace(/[-_]+/g, ' ').match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
          if (!words) return '';
          return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        }
        case 'snake': {
          const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
          return words ? words.map(x => x.toLowerCase()).join('_') : '';
        }
        case 'kebab': {
          const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
          return words ? words.map(x => x.toLowerCase()).join('-') : '';
        }
        case 'constant': {
          const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
          return words ? words.map(x => x.toUpperCase()).join('_') : '';
        }
        case 'dot': {
          const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
          return words ? words.map(x => x.toLowerCase()).join('.') : '';
        }
        case 'capitalize':
          return text.replace(/\b\w/g, c => c.toUpperCase());
        default:
          return text;
      }
    },

    analyzeWords: function(text) {
      if (!text) {
        return { words: 0, chars: 0, charsNoSpaces: 0, lines: 0, paragraphs: 0, sentences: 0, readingTime: '0s', speakingTime: '0s' };
      }
      const trimmed = text.trim();
      const words = trimmed ? (trimmed.match(/\S+/g) || []).length : 0;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const lines = text.split(/\r\n|\r|\n/).length;
      const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

      // Reading time at ~200 WPM
      const readingMinutes = words / 200;
      const readMin = Math.floor(readingMinutes);
      const readSec = Math.round((readingMinutes - readMin) * 60);
      const readingTime = readMin > 0 ? `${readMin}m ${readSec}s` : `${readSec}s`;

      // Speaking time at ~130 WPM
      const speakMinutes = words / 130;
      const spkMin = Math.floor(speakMinutes);
      const spkSec = Math.round((speakMinutes - spkMin) * 60);
      const speakingTime = spkMin > 0 ? `${spkMin}m ${spkSec}s` : `${spkSec}s`;

      return { words, chars, charsNoSpaces, lines, paragraphs, sentences, readingTime, speakingTime };
    },

    analyzeCharacters: function(text) {
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const letters = (text.match(/[a-zA-Z]/g) || []).length;
      const digits = (text.match(/[0-9]/g) || []).length;
      const whitespace = (text.match(/\s/g) || []).length;
      const punctuation = (text.match(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>@\[\]\\|]/g) || []).length;
      const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
      const words = text.trim() ? (text.trim().match(/\S+/g) || []).length : 0;

      return { chars, charsNoSpaces, letters, digits, whitespace, punctuation, lines, words };
    },

    removeDuplicateLines: function(text, options = {}) {
      if (!text) return { result: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
      const { caseSensitive = false, trim = true, keepFirst = true, removeBlank = true } = options;
      const rawLines = text.split(/\r\n|\r|\n/);
      const originalCount = rawLines.length;

      const seen = new Set();
      const output = [];

      const lines = keepFirst ? rawLines : [...rawLines].reverse();

      for (let line of lines) {
        let testLine = trim ? line.trim() : line;
        if (removeBlank && !testLine) continue;

        let key = caseSensitive ? testLine : testLine.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          output.push(trim ? line.trim() : line);
        }
      }

      const finalLines = keepFirst ? output : output.reverse();
      const uniqueCount = finalLines.length;
      return {
        result: finalLines.join('\n'),
        originalCount,
        uniqueCount,
        removedCount: originalCount - uniqueCount
      };
    },

    sortLines: function(text, mode, options = {}) {
      if (!text) return '';
      const { caseSensitive = false, trim = true } = options;
      let lines = text.split(/\r\n|\r|\n/);
      if (trim) lines = lines.map(l => l.trim());

      switch (mode) {
        case 'az':
          lines.sort((a, b) => caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase()));
          break;
        case 'za':
          lines.sort((a, b) => caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase()));
          break;
        case 'num-asc':
          lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^0-9.-]/g, '')) || 0;
            const numB = parseFloat(b.replace(/[^0-9.-]/g, '')) || 0;
            return numA - numB;
          });
          break;
        case 'num-desc':
          lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^0-9.-]/g, '')) || 0;
            const numB = parseFloat(b.replace(/[^0-9.-]/g, '')) || 0;
            return numB - numA;
          });
          break;
        case 'len-asc':
          lines.sort((a, b) => a.length - b.length);
          break;
        case 'len-desc':
          lines.sort((a, b) => b.length - a.length);
          break;
        case 'reverse':
          lines.reverse();
          break;
        case 'shuffle':
          for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
          }
          break;
      }
      return lines.join('\n');
    },

    cleanText: function(text, options = {}) {
      if (!text) return '';
      let res = text;
      if (options.normalizeLineBreaks) {
        res = res.replace(/\r\n|\r/g, '\n');
      }
      if (options.tabsToSpaces) {
        res = res.replace(/\t/g, '  ');
      }
      if (options.stripHtml) {
        res = res.replace(/<[^>]*>?/gm, '');
      }
      if (options.trimLines) {
        res = res.split('\n').map(l => l.trim()).join('\n');
      }
      if (options.singleSpaces) {
        res = res.replace(/[^\S\r\n]+/g, ' ');
      }
      if (options.removeBlankLines) {
        res = res.split('\n').filter(l => l.trim().length > 0).join('\n');
      }
      if (options.removeSpecialChars) {
        res = res.replace(/[^a-zA-Z0-9\s.,!?'"\-\n]/g, '');
      }
      if (options.removeEmojis) {
        res = res.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      }
      return res;
    },

    // 2. DEVELOPER UTILITIES
    formatJson: function(jsonString, indent = 2) {
      if (!jsonString || !jsonString.trim()) {
        return { success: false, error: 'Input is empty' };
      }
      try {
        const parsed = JSON.parse(jsonString);
        const spaces = indent === 0 ? 0 : indent;
        const result = indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces);
        return { success: true, result, parsed };
      } catch (err) {
        let line = null;
        let col = null;
        const match = err.message.match(/at position (\d+)/);
        if (match) {
          const pos = parseInt(match[1], 10);
          const lines = jsonString.substring(0, pos).split('\n');
          line = lines.length;
          col = lines[lines.length - 1].length + 1;
        }
        return {
          success: false,
          error: err.message,
          line,
          col
        };
      }
    },

    validateJson: function(jsonString) {
      if (!jsonString || !jsonString.trim()) {
        return { isValid: false, message: 'Please enter JSON to validate.' };
      }
      try {
        const parsed = JSON.parse(jsonString);
        const type = Array.isArray(parsed) ? 'Array' : (parsed === null ? 'null' : typeof parsed);
        let keyCount = 0;
        if (typeof parsed === 'object' && parsed !== null) {
          keyCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
        }
        const sizeBytes = new Blob([jsonString]).size;
        return {
          isValid: true,
          message: 'Valid JSON format! No syntax errors detected.',
          type,
          keyCount,
          sizeBytes: this.formatBytes(sizeBytes)
        };
      } catch (err) {
        let line = 1, col = 1;
        const match = err.message.match(/at position (\d+)/);
        if (match) {
          const pos = parseInt(match[1], 10);
          const lines = jsonString.substring(0, pos).split('\n');
          line = lines.length;
          col = lines[lines.length - 1].length + 1;
        }
        return {
          isValid: false,
          message: err.message,
          line,
          col
        };
      }
    },

    base64Encode: function(text, urlSafe = false) {
      if (!text) return '';
      try {
        // Safe Unicode handling
        const utf8Bytes = new TextEncoder().encode(text);
        let binary = '';
        const len = utf8Bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(utf8Bytes[i]);
        }
        let b64 = window.btoa(binary);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return b64;
      } catch (e) {
        throw new Error('Base64 encoding failed: ' + e.message);
      }
    },

    base64Decode: function(b64, urlSafe = false) {
      if (!b64) return '';
      try {
        let str = b64.trim();
        if (urlSafe) {
          str = str.replace(/-/g, '+').replace(/_/g, '/');
          while (str.length % 4) str += '=';
        }
        const binary = window.atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
      } catch (e) {
        throw new Error('Invalid Base64 string. Please verify input.');
      }
    },

    encodeUrl: function(text, componentMode = true) {
      if (!text) return '';
      return componentMode ? encodeURIComponent(text) : encodeURI(text);
    },

    decodeUrl: function(text, componentMode = true) {
      if (!text) return '';
      return componentMode ? decodeURIComponent(text) : decodeURI(text);
    },

    testRegex: function(pattern, flags, testString) {
      if (!pattern) {
        return { success: false, error: 'Pattern cannot be empty' };
      }
      try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        
        if (flags.includes('g')) {
          let safety = 0;
          while ((match = regex.exec(testString)) !== null && safety < 1000) {
            safety++;
            matches.push({
              index: match.index,
              text: match[0],
              groups: match.slice(1)
            });
            if (match.index === regex.lastIndex) {
              regex.lastIndex++;
            }
          }
        } else {
          match = regex.exec(testString);
          if (match) {
            matches.push({
              index: match.index,
              text: match[0],
              groups: match.slice(1)
            });
          }
        }

        // Highlight HTML
        let highlighted = '';
        let lastIdx = 0;
        if (matches.length > 0) {
          for (const m of matches) {
            highlighted += this.escapeHtml(testString.substring(lastIdx, m.index));
            highlighted += `<mark class="regex-match">${this.escapeHtml(m.text)}</mark>`;
            lastIdx = m.index + m.text.length;
          }
          highlighted += this.escapeHtml(testString.substring(lastIdx));
        } else {
          highlighted = this.escapeHtml(testString);
        }

        return {
          success: true,
          matchCount: matches.length,
          matches,
          highlighted
        };
      } catch (err) {
        return {
          success: false,
          error: err.message
        };
      }
    },

    generateUUIDs: function(count = 1, uppercase = false, hyphens = true) {
      const uuids = [];
      const num = Math.min(Math.max(parseInt(count, 10) || 1, 1), 100);
      
      for (let i = 0; i < num; i++) {
        let u = '';
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          u = crypto.randomUUID();
        } else {
          // Fallback
          u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        }
        if (!hyphens) u = u.replace(/-/g, '');
        if (uppercase) u = u.toUpperCase();
        uuids.push(u);
      }
      return uuids;
    },

    // 3. WEB & SEO UTILITIES
    generateMetaTags: function(data) {
      const {
        title = '',
        description = '',
        keywords = '',
        author = '',
        canonicalUrl = '',
        ogType = 'website',
        ogImage = '',
        siteName = '',
        twitterCard = 'summary_large_image',
        robots = 'index, follow'
      } = data;

      let tags = `<!-- Primary Meta Tags -->\n`;
      if (title) tags += `<title>${this.escapeHtml(title)}</title>\n<meta name="title" content="${this.escapeHtml(title)}">\n`;
      if (description) tags += `<meta name="description" content="${this.escapeHtml(description)}">\n`;
      if (keywords) tags += `<meta name="keywords" content="${this.escapeHtml(keywords)}">\n`;
      if (author) tags += `<meta name="author" content="${this.escapeHtml(author)}">\n`;
      if (robots) tags += `<meta name="robots" content="${this.escapeHtml(robots)}">\n`;
      tags += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
      if (canonicalUrl) tags += `<link rel="canonical" href="${this.escapeHtml(canonicalUrl)}">\n`;

      tags += `\n<!-- Open Graph / Facebook / LinkedIn -->\n`;
      tags += `<meta property="og:type" content="${this.escapeHtml(ogType)}">\n`;
      if (canonicalUrl) tags += `<meta property="og:url" content="${this.escapeHtml(canonicalUrl)}">\n`;
      if (title) tags += `<meta property="og:title" content="${this.escapeHtml(title)}">\n`;
      if (description) tags += `<meta property="og:description" content="${this.escapeHtml(description)}">\n`;
      if (ogImage) tags += `<meta property="og:image" content="${this.escapeHtml(ogImage)}">\n`;
      if (siteName) tags += `<meta property="og:site_name" content="${this.escapeHtml(siteName)}">\n`;

      tags += `\n<!-- Twitter / X -->\n`;
      tags += `<meta name="twitter:card" content="${this.escapeHtml(twitterCard)}">\n`;
      if (canonicalUrl) tags += `<meta name="twitter:url" content="${this.escapeHtml(canonicalUrl)}">\n`;
      if (title) tags += `<meta name="twitter:title" content="${this.escapeHtml(title)}">\n`;
      if (description) tags += `<meta name="twitter:description" content="${this.escapeHtml(description)}">\n`;
      if (ogImage) tags += `<meta name="twitter:image" content="${this.escapeHtml(ogImage)}">\n`;

      return tags;
    },

    parseUrl: function(urlString) {
      if (!urlString) return null;
      let urlObj;
      try {
        urlObj = new URL(urlString);
      } catch (e) {
        // Try appending https://
        try {
          urlObj = new URL('https://' + urlString);
        } catch (err) {
          return null;
        }
      }

      const params = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      return {
        href: urlObj.href,
        protocol: urlObj.protocol,
        origin: urlObj.origin,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80'),
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        params
      };
    },

    buildUtmUrl: function(baseUrl, utm) {
      if (!baseUrl) return '';
      let url;
      try {
        url = new URL(baseUrl);
      } catch (e) {
        try {
          url = new URL('https://' + baseUrl);
        } catch (err) {
          return '';
        }
      }

      const { source, medium, campaign, term, content } = utm;
      if (source) url.searchParams.set('utm_source', source.trim());
      else url.searchParams.delete('utm_source');

      if (medium) url.searchParams.set('utm_medium', medium.trim());
      else url.searchParams.delete('utm_medium');

      if (campaign) url.searchParams.set('utm_campaign', campaign.trim());
      else url.searchParams.delete('utm_campaign');

      if (term) url.searchParams.set('utm_term', term.trim());
      else url.searchParams.delete('utm_term');

      if (content) url.searchParams.set('utm_content', content.trim());
      else url.searchParams.delete('utm_content');

      return url.toString();
    },

    generateRobotsTxt: function(options) {
      const {
        userAgent = '*',
        allows = [],
        disallows = [],
        sitemapUrl = '',
        crawlDelay = ''
      } = options;

      let out = `User-agent: ${userAgent}\n`;
      if (allows.length > 0) {
        allows.forEach(a => {
          if (a.trim()) out += `Allow: ${a.trim()}\n`;
        });
      }
      if (disallows.length > 0) {
        disallows.forEach(d => {
          if (d.trim()) out += `Disallow: ${d.trim()}\n`;
        });
      } else if (allows.length === 0) {
        out += `Allow: /\n`;
      }

      if (crawlDelay) {
        out += `Crawl-delay: ${crawlDelay}\n`;
      }
      if (sitemapUrl) {
        out += `\nSitemap: ${sitemapUrl.trim()}\n`;
      }
      return out;
    },

    generateSitemapXml: function(urlList, options = {}) {
      const { freq = 'weekly', priority = '0.8', lastmod = new Date().toISOString().split('T')[0] } = options;
      const lines = urlList.split(/\r\n|\r|\n/).map(u => u.trim()).filter(Boolean);
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      lines.forEach(u => {
        let validUrl = u;
        if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
          validUrl = 'https://' + validUrl;
        }
        xml += `  <url>\n`;
        xml += `    <loc>${this.escapeHtml(validUrl)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${freq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
      });
      
      xml += `</urlset>\n`;
      return xml;
    },

    // 4. IMAGE & COLOR UTILITIES
    hexToRgb: function(hex) {
      let c = hex.replace('#', '').trim();
      if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
      }
      if (c.length !== 6) return null;
      const num = parseInt(c, 16);
      if (isNaN(num)) return null;
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    },

    rgbToHex: function(r, g, b) {
      const toHex = n => {
        const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
        return h.length === 1 ? '0' + h : h;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    },

    rgbToHsl: function(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    },

    hslToRgb: function(h, s, l) {
      h = (h % 360) / 360;
      s = Math.max(0, Math.min(100, s)) / 100;
      l = Math.max(0, Math.min(100, l)) / 100;

      if (s === 0) {
        const val = Math.round(l * 255);
        return { r: val, g: val, b: val };
      }

      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return {
        r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
      };
    },

    getLuminance: function(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    },

    getContrastRatio: function(rgb1, rgb2) {
      const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    },

    generatePalette: function(baseHex) {
      const rgb = this.hexToRgb(baseHex);
      if (!rgb) return null;
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

      const makeHex = (h, s, l) => {
        const c = this.hslToRgb(h, s, l);
        return this.rgbToHex(c.r, c.g, c.b);
      };

      return {
        base: baseHex.toUpperCase(),
        monochromatic: [
          makeHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)),
          makeHex(hsl.h, hsl.s, Math.max(15, hsl.l - 15)),
          baseHex.toUpperCase(),
          makeHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)),
          makeHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30))
        ],
        analogous: [
          makeHex((hsl.h + 300) % 360, hsl.s, hsl.l),
          makeHex((hsl.h + 330) % 360, hsl.s, hsl.l),
          baseHex.toUpperCase(),
          makeHex((hsl.h + 30) % 360, hsl.s, hsl.l),
          makeHex((hsl.h + 60) % 360, hsl.s, hsl.l)
        ],
        complementary: [
          baseHex.toUpperCase(),
          makeHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          makeHex(hsl.h, Math.max(15, hsl.s - 25), Math.min(85, hsl.l + 20)),
          makeHex((hsl.h + 180) % 360, Math.max(15, hsl.s - 25), Math.min(85, hsl.l + 20))
        ],
        triadic: [
          baseHex.toUpperCase(),
          makeHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          makeHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        ]
      };
    },

    sanitizeSvg: function(rawSvg) {
      if (!rawSvg) return '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
      
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG XML syntax: ' + parserError.textContent);
      }

      const svgEl = doc.querySelector('svg');
      if (!svgEl) {
        throw new Error('No <svg> root element found.');
      }

      // Strip dangerous elements
      const scripts = svgEl.querySelectorAll('script, foreignObject, iframe, embed, object');
      scripts.forEach(s => s.remove());

      // Strip dangerous attributes
      const allElements = svgEl.querySelectorAll('*');
      const cleanEl = el => {
        const attrs = Array.from(el.attributes);
        attrs.forEach(attr => {
          const name = attr.name.toLowerCase();
          const val = attr.value.toLowerCase().trim();
          if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:text/html')) {
            el.removeAttribute(attr.name);
          }
        });
      };

      cleanEl(svgEl);
      allElements.forEach(cleanEl);

      return new XMLSerializer().serializeToString(svgEl);
    },

    // 5. FILE & DATA UTILITIES
    parseCsv: function(csvText, delimiter = ',') {
      if (!csvText) return [];
      const rows = [];
      let currentRow = [];
      let currentVal = '';
      let insideQuote = false;

      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (insideQuote) {
          if (char === '"') {
            if (nextChar === '"') {
              currentVal += '"';
              i++;
            } else {
              insideQuote = false;
            }
          } else {
            currentVal += char;
          }
        } else {
          if (char === '"') {
            insideQuote = true;
          } else if (char === delimiter) {
            currentRow.push(currentVal.trim());
            currentVal = '';
          } else if (char === '\r' || char === '\n') {
            currentRow.push(currentVal.trim());
            if (currentRow.some(c => c.length > 0)) {
              rows.push(currentRow);
            }
            currentRow = [];
            currentVal = '';
            if (char === '\r' && nextChar === '\n') i++;
          } else {
            currentVal += char;
          }
        }
      }
      if (currentVal || currentRow.length > 0) {
        currentRow.push(currentVal.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
      }
      return rows;
    },

    csvToJson: function(csvText, delimiter = ',') {
      const rows = this.parseCsv(csvText, delimiter);
      if (rows.length === 0) return [];
      const headers = rows[0];
      const result = [];

      for (let i = 1; i < rows.length; i++) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          const val = rows[i][j] !== undefined ? rows[i][j] : '';
          // Try parse number/boolean
          if (val === 'true') obj[headers[j]] = true;
          else if (val === 'false') obj[headers[j]] = false;
          else if (!isNaN(Number(val)) && val !== '') obj[headers[j]] = Number(val);
          else obj[headers[j]] = val;
        }
        result.push(obj);
      }
      return result;
    },

    jsonToCsv: function(jsonData) {
      let data = jsonData;
      if (typeof jsonData === 'string') {
        data = JSON.parse(jsonData);
      }
      if (!Array.isArray(data) || data.length === 0) {
        return '';
      }

      // Collect all keys
      const keys = Array.from(new Set(data.flatMap(item => typeof item === 'object' && item !== null ? Object.keys(item) : [])));
      const escapeField = val => {
        if (val === null || val === undefined) return '';
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const headerLine = keys.map(escapeField).join(',');
      const rows = data.map(item => {
        return keys.map(k => escapeField(item[k])).join(',');
      });

      return [headerLine, ...rows].join('\n');
    },

    generateFileHash: async function(file, algorithm = 'SHA-256') {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hex;
    },

    // 6. EVERYDAY UTILITIES
    checkPasswordStrength: function(password) {
      if (!password) {
        return {
          score: 0,
          label: 'Empty',
          color: 'var(--text-muted)',
          entropy: 0,
          crackTime: 'Instant',
          suggestions: ['Enter a password to evaluate its strength.']
        };
      }

      let score = 0;
      const suggestions = [];
      const len = password.length;

      // Length checks
      if (len >= 8) score += 20;
      else suggestions.push('Use at least 8 characters (12+ recommended).');

      if (len >= 12) score += 15;
      if (len >= 16) score += 10;

      // Character variety checks
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(password);

      let poolSize = 0;
      if (hasLower) { score += 15; poolSize += 26; } else suggestions.push('Include lowercase letters (a-z).');
      if (hasUpper) { score += 15; poolSize += 26; } else suggestions.push('Include uppercase letters (A-Z).');
      if (hasDigit) { score += 15; poolSize += 10; } else suggestions.push('Include at least one number (0-9).');
      if (hasSpecial) { score += 15; poolSize += 33; } else suggestions.push('Include special symbols (!@#$%^&*).');

      // Common weakness deductions
      if (/^[0-9]+$/.test(password) || /^[a-zA-Z]+$/.test(password)) {
        score -= 20;
      }
      if (/1234|qwerty|password|admin|welcome|login/i.test(password)) {
        score -= 30;
        suggestions.push('Avoid common words or sequences like "1234" or "password".');
      }
      if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        suggestions.push('Avoid repeating identical characters 3+ times.');
      }

      score = Math.max(5, Math.min(100, score));

      // Entropy calculation: E = L * log2(poolSize)
      const entropy = poolSize > 0 ? Math.round(len * (Math.log(poolSize) / Math.log(2))) : 0;

      let label = 'Very Weak';
      let color = '#FF3B30';
      let crackTime = '< 1 second';

      if (score >= 85 && len >= 12) {
        label = 'Very Strong';
        color = '#34C759';
        crackTime = 'Centuries to billions of years';
      } else if (score >= 65 && len >= 10) {
        label = 'Strong';
        color = '#30D158';
        crackTime = 'Years to decades';
      } else if (score >= 45 && len >= 8) {
        label = 'Fair';
        color = '#FF9500';
        crackTime = 'Hours to days';
      } else if (score >= 25) {
        label = 'Weak';
        color = '#FF6B22';
        crackTime = 'Seconds to minutes';
      }

      if (suggestions.length === 0) {
        suggestions.push('Excellent password! Strong entropy and character diversity.');
      }

      return {
        score,
        label,
        color,
        entropy,
        crackTime,
        suggestions
      };
    },

    convertTimestamp: function(inputVal, isSeconds = true) {
      let num = parseFloat(inputVal);
      if (isNaN(num)) return null;
      let ms = isSeconds ? num * 1000 : num;
      const date = new Date(ms);
      if (isNaN(date.getTime())) return null;

      return {
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        seconds: Math.floor(ms / 1000),
        milliseconds: ms
      };
    },

    calculateDateDiff: function(startStr, endStr) {
      const d1 = new Date(startStr);
      const d2 = new Date(endStr);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalWeeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;

      // Workdays count (Mon-Fri)
      let cur = new Date(Math.min(d1.getTime(), d2.getTime()));
      const end = new Date(Math.max(d1.getTime(), d2.getTime()));
      let workdays = 0;
      while (cur < end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          workdays++;
        }
        cur.setDate(cur.getDate() + 1);
      }

      return {
        totalDays,
        totalWeeks,
        remDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        workdays
      };
    },

    calculatePercentage: function(type, x, y) {
      x = parseFloat(x) || 0;
      y = parseFloat(y) || 0;
      switch (type) {
        case 'percentOf':
          // What is X% of Y?
          return {
            result: (x / 100) * y,
            formula: `(${x} ÷ 100) × ${y}`
          };
        case 'isWhatPercent':
          // X is what percent of Y?
          if (y === 0) return { result: 0, formula: 'Division by zero is undefined' };
          return {
            result: (x / y) * 100,
            formula: `(${x} ÷ ${y}) × 100%`
          };
        case 'change':
          // % increase/decrease from X to Y
          if (x === 0) return { result: 0, formula: 'Division by zero is undefined' };
          const diff = y - x;
          const pct = (diff / x) * 100;
          return {
            result: pct,
            formula: `((${y} - ${x}) ÷ ${x}) × 100%`
          };
        case 'addPercent':
          // Y + X%
          return {
            result: y + (y * (x / 100)),
            formula: `${y} + (${y} × ${x}%)`
          };
        default:
          return { result: 0, formula: '' };
      }
    },

    convertBase: function(val, fromBase) {
      if (!val || !val.trim()) return { bin: '', oct: '', dec: '', hex: '' };
      try {
        let dec;
        val = val.trim();
        if (fromBase === 10) {
          dec = BigInt(val);
        } else if (fromBase === 2) {
          if (!/^[01]+$/.test(val)) throw new Error('Invalid binary digits (0 and 1 only)');
          dec = BigInt('0b' + val);
        } else if (fromBase === 8) {
          if (!/^[0-7]+$/.test(val)) throw new Error('Invalid octal digits (0-7 only)');
          dec = BigInt('0o' + val);
        } else if (fromBase === 16) {
          if (!/^[0-9a-fA-F]+$/.test(val)) throw new Error('Invalid hex digits (0-9, A-F only)');
          dec = BigInt('0x' + val);
        }

        return {
          bin: dec.toString(2),
          oct: dec.toString(8),
          dec: dec.toString(10),
          hex: dec.toString(16).toUpperCase()
        };
      } catch (e) {
        return { error: e.message };
      }
    },

    generateRandomData: function(type, count = 5) {
      const num = Math.min(Math.max(parseInt(count, 10) || 1, 1), 50);
      const items = [];

      const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Sam', 'Chris', 'Robin', 'Jamie', 'Avery', 'Cameron', 'Dakota', 'Logan'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
      const domains = ['example.com', 'testmail.org', 'demo.net', 'sample.io'];

      for (let i = 0; i < num; i++) {
        if (type === 'number') {
          items.push(Math.floor(Math.random() * 1000000));
        } else if (type === 'string') {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let str = '';
          for (let j = 0; j < 16; j++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          items.push(str);
        } else if (type === 'name') {
          const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
          const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
          items.push(`${fn} ${ln}`);
        } else if (type === 'email') {
          const fn = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
          const ln = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
          const rand = Math.floor(Math.random() * 900) + 100;
          const domain = domains[Math.floor(Math.random() * domains.length)];
          items.push(`${fn}.${ln}${rand}@${domain}`);
        } else if (type === 'ip') {
          items.push(`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`);
        } else if (type === 'boolean') {
          items.push(Math.random() > 0.5 ? 'true' : 'false');
        }
      }
      return items;
    }
  };

  window.MTV_BU = MTV_BU;
})(window);
