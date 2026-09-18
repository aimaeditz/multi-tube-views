import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function getHtmlInputs() {
  const inputs: Record<string, string> = {
    main: path.resolve(__dirname, 'index.html'),
    about: path.resolve(__dirname, 'about.html'),
    aiAuto: path.resolve(__dirname, 'ai-auto.html'),
    aiPrompt: path.resolve(__dirname, 'ai-prompt.html'),
    articles: path.resolve(__dirname, 'articles.html'),
    creatorTools: path.resolve(__dirname, 'creator-tools.html'),
    aiTools: path.resolve(__dirname, 'ai-tools.html'),
    mediaConverterTools: path.resolve(__dirname, 'media-converter-tools.html'),
    credits: path.resolve(__dirname, 'credits.html'),
    disclaimer: path.resolve(__dirname, 'disclaimer.html'),
    platforms: path.resolve(__dirname, 'platforms.html'),
    privacy: path.resolve(__dirname, 'privacy.html'),
    settings: path.resolve(__dirname, 'settings.html'),
    terms: path.resolve(__dirname, 'terms.html'),
    contact: path.resolve(__dirname, 'contact.html'),
    browserUtilities: path.resolve(__dirname, 'browser-utilities.html'),
    exploreHub: path.resolve(__dirname, 'explore-hub.html'),
  };

  // Add all platform pages
  const platformsDir = path.resolve(__dirname, 'platforms');
  if (fs.existsSync(platformsDir)) {
    fs.readdirSync(platformsDir).forEach(file => {
      if (file.endsWith('.html')) {
        const name = 'platform_' + file.replace('.html', '');
        inputs[name] = path.resolve(platformsDir, file);
      }
    });
  }

  // Add all browser utilities pages (categories and 89 tools)
  const buDir = path.resolve(__dirname, 'browser-utilities');
  if (fs.existsSync(buDir)) {
    fs.readdirSync(buDir).forEach(file => {
      if (file.endsWith('.html')) {
        const name = 'bu_' + file.replace('.html', '').replace(/[^a-zA-Z0-9_]/g, '_');
        inputs[name] = path.resolve(buDir, file);
      }
    });
  }

  return inputs;
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const apiBaseUrl = process.env.VITE_API_BASE_URL || '';
          
          let transformed = html;
          
          // If the HTML does not already include the instant theme script at head, inject it
          if (!transformed.includes('mtv_theme')) {
            transformed = transformed.replace(
              '<head>',
              `<head>\n  <script>
    (function() {
      try {
        var saved = localStorage.getItem('mtv_theme');
        var theme = 'light';
        if (saved === 'dark') {
          theme = 'dark';
        } else if (saved === 'light') {
          theme = 'light';
        } else if (saved === 'system') {
          theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        }
        var docEl = document.documentElement;
        docEl.setAttribute('data-theme', theme);
        docEl.style.colorScheme = theme;
        docEl.style.backgroundColor = (theme === 'dark' ? '#0A0A0C' : '#FDFDFD');
      } catch(e) {}
    })();
  </script>`
            );
          }

          // Inject defensive webview mock script if not already present
          if (!transformed.includes('webviewProxy')) {
            transformed = transformed.replace(
              '<head>',
              `<head>\n  <script>
    try {
      if (typeof window !== 'undefined') {
        let webviewProxy = (typeof window.Proxy !== 'undefined') ? new Proxy({}, {
          get: function(target, prop) {
            if (prop === '_android') {
              return (typeof window.Proxy !== 'undefined') ? new Proxy({}, {
                get: function(t, p) {
                  return function() {};
                }
              }) : {};
            }
            if (prop === 'postMessage') {
              return function() {};
            }
            if (prop === 'addEventListener' || prop === 'removeEventListener') {
              return function() {};
            }
            return undefined;
          }
        }) : { 
          _android: {}, 
          postMessage: function() {}, 
          addEventListener: function() {}, 
          removeEventListener: function() {} 
        };

        if (window.chrome) {
          try {
            if (!window.chrome.webview) {
              Object.defineProperty(window.chrome, 'webview', {
                configurable: true,
                enumerable: true,
                get: function() { return webviewProxy; },
                set: function(val) { webviewProxy = val; }
              });
            }
          } catch (e) {
            try {
              window.chrome.webview = webviewProxy;
            } catch (e2) {}
          }
        } else {
          let chromeProxy = (typeof window.Proxy !== 'undefined') ? new Proxy({}, {
            get: function(target, prop) {
              if (prop === 'webview') {
                return webviewProxy;
              }
              return undefined;
            }
          }) : { webview: webviewProxy };

          try {
            Object.defineProperty(window, 'chrome', {
              configurable: true,
              enumerable: true,
              get: function() { return chromeProxy; },
              set: function(val) { chromeProxy = val; }
            });
          } catch (e) {
            try {
              window.chrome = chromeProxy;
            } catch (e2) {}
          }
        }
      }
    } catch (err) {
      console.warn('Defensive webview mocking failed:', err);
    }
  </script>`
            );
          }

          transformed = transformed.replace(
            '</head>',
            `  <script>window.MTV_API_BASE_URL = ${JSON.stringify(apiBaseUrl)};</script>\n</head>`
          );
          transformed = transformed.replace(/<script\s+src="([^"]+\.js)">/g, '<script type="module" src="$1">');
          transformed = transformed.replace(/<script\s+src="(\.\.\/[^"]+\.js)">/g, '<script type="module" src="$1">');
          return transformed;
        }
      },
      {
        name: 'copy-static-assets',
        closeBundle() {
          const srcAssets = path.resolve(__dirname, 'assets');
          const distAssets = path.resolve(__dirname, 'dist/assets');
          const publicAssets = path.resolve(__dirname, 'public/assets');
          if (fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
            fs.cpSync(srcAssets, publicAssets, { recursive: true, force: true });
          }

          // Ensure root favicon and icon files are copied to dist/ and public/
          const rootFiles = ['favicon.ico', 'favicon-192.png', 'favicon-512.png', 'manifest.json', 'robots.txt', 'sitemap.xml', 'sw.js', 'CNAME', '.nojekyll'];
          for (const file of rootFiles) {
            const src = path.resolve(__dirname, file);
            const distDest = path.resolve(__dirname, 'dist', file);
            const pubDest = path.resolve(__dirname, 'public', file);
            if (fs.existsSync(src)) {
              if (!fs.existsSync(path.dirname(distDest))) {
                fs.mkdirSync(path.dirname(distDest), { recursive: true });
              }
              fs.copyFileSync(src, distDest);
              if (!fs.existsSync(path.dirname(pubDest))) {
                fs.mkdirSync(path.dirname(pubDest), { recursive: true });
              }
              fs.copyFileSync(src, pubDest);
            }
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: getHtmlInputs(),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
