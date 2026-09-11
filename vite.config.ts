import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

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
          let transformed = html.replace(
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
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          aiAuto: path.resolve(__dirname, 'ai-auto.html'),
          aiPrompt: path.resolve(__dirname, 'ai-prompt.html'),
          articles: path.resolve(__dirname, 'articles.html'),
          creatorTools: path.resolve(__dirname, 'creator-tools.html'),
          mediaConverterTools: path.resolve(__dirname, 'media-converter-tools.html'),
          credits: path.resolve(__dirname, 'credits.html'),
          disclaimer: path.resolve(__dirname, 'disclaimer.html'),
          platforms: path.resolve(__dirname, 'platforms.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          settings: path.resolve(__dirname, 'settings.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          bilibili: path.resolve(__dirname, 'platforms/bilibili.html'),
          dailymotion: path.resolve(__dirname, 'platforms/dailymotion.html'),
          facebook: path.resolve(__dirname, 'platforms/facebook.html'),
          instagram: path.resolve(__dirname, 'platforms/instagram.html'),
          kick: path.resolve(__dirname, 'platforms/kick.html'),
          linkedin: path.resolve(__dirname, 'platforms/linkedin.html'),
          odysee: path.resolve(__dirname, 'platforms/odysee.html'),
          pinterest: path.resolve(__dirname, 'platforms/pinterest.html'),
          reddit: path.resolve(__dirname, 'platforms/reddit.html'),
          rumble: path.resolve(__dirname, 'platforms/rumble.html'),
          snapchat: path.resolve(__dirname, 'platforms/snapchat.html'),
          soundcloud: path.resolve(__dirname, 'platforms/soundcloud.html'),
          spotify: path.resolve(__dirname, 'platforms/spotify.html'),
          telegram: path.resolve(__dirname, 'platforms/telegram.html'),
          threads: path.resolve(__dirname, 'platforms/threads.html'),
          tiktok: path.resolve(__dirname, 'platforms/tiktok.html'),
          twitch: path.resolve(__dirname, 'platforms/twitch.html'),
          vimeo: path.resolve(__dirname, 'platforms/vimeo.html'),
          x: path.resolve(__dirname, 'platforms/x.html'),
          youtube: path.resolve(__dirname, 'platforms/youtube.html'),
          streamable: path.resolve(__dirname, 'platforms/streamable.html'),
          peertube: path.resolve(__dirname, 'platforms/peertube.html'),
          loom: path.resolve(__dirname, 'platforms/loom.html'),
          vevo: path.resolve(__dirname, 'platforms/vevo.html'),
          josh: path.resolve(__dirname, 'platforms/josh.html'),
          moj: path.resolve(__dirname, 'platforms/moj.html'),
          chingari: path.resolve(__dirname, 'platforms/chingari.html'),
          douyin: path.resolve(__dirname, 'platforms/douyin.html'),
          kuaishou: path.resolve(__dirname, 'platforms/kuaishou.html'),
          triller: path.resolve(__dirname, 'platforms/triller.html'),
          trovo: path.resolve(__dirname, 'platforms/trovo.html'),
          dlive: path.resolve(__dirname, 'platforms/dlive.html'),
          caffeine: path.resolve(__dirname, 'platforms/caffeine.html'),
          nimotv: path.resolve(__dirname, 'platforms/nimotv.html'),
          applepodcasts: path.resolve(__dirname, 'platforms/applepodcasts.html'),
          youtubemusic: path.resolve(__dirname, 'platforms/youtubemusic.html'),
          anchor: path.resolve(__dirname, 'platforms/anchor.html'),
          tumblr: path.resolve(__dirname, 'platforms/tumblr.html'),
          mastodon: path.resolve(__dirname, 'platforms/mastodon.html'),
          newgrounds: path.resolve(__dirname, 'platforms/newgrounds.html'),
          
          // Browser Utilities - Main and Category Listing Pages
          browserUtilities: path.resolve(__dirname, 'browser-utilities.html'),
          buTextUtilities: path.resolve(__dirname, 'browser-utilities/text-utilities.html'),
          buDeveloperUtilities: path.resolve(__dirname, 'browser-utilities/developer-utilities.html'),
          buWebSeoUtilities: path.resolve(__dirname, 'browser-utilities/web-seo-utilities.html'),
          buImageUtilities: path.resolve(__dirname, 'browser-utilities/image-utilities.html'),
          buFileDataUtilities: path.resolve(__dirname, 'browser-utilities/file-data-utilities.html'),
          buEverydayUtilities: path.resolve(__dirname, 'browser-utilities/everyday-utilities.html'),

          // Browser Utilities - Text Utilities (6 tools)
          buTextCaseConverter: path.resolve(__dirname, 'browser-utilities/text-case-converter.html'),
          buWordCounter: path.resolve(__dirname, 'browser-utilities/word-counter.html'),
          buCharacterCounter: path.resolve(__dirname, 'browser-utilities/character-counter.html'),
          buDuplicateLineRemover: path.resolve(__dirname, 'browser-utilities/duplicate-line-remover.html'),
          buTextSorter: path.resolve(__dirname, 'browser-utilities/text-sorter.html'),
          buTextCleaner: path.resolve(__dirname, 'browser-utilities/text-cleaner.html'),

          // Browser Utilities - Developer Utilities (6 tools)
          buJsonFormatter: path.resolve(__dirname, 'browser-utilities/json-formatter.html'),
          buJsonValidator: path.resolve(__dirname, 'browser-utilities/json-validator.html'),
          buBase64EncoderDecoder: path.resolve(__dirname, 'browser-utilities/base64-encoder-decoder.html'),
          buUrlEncoderDecoder: path.resolve(__dirname, 'browser-utilities/url-encoder-decoder.html'),
          buRegexTester: path.resolve(__dirname, 'browser-utilities/regex-tester.html'),
          buUuidGenerator: path.resolve(__dirname, 'browser-utilities/uuid-generator.html'),

          // Browser Utilities - Web & SEO Utilities (6 tools)
          buMetaTagGenerator: path.resolve(__dirname, 'browser-utilities/meta-tag-generator.html'),
          buOpenGraphPreview: path.resolve(__dirname, 'browser-utilities/open-graph-preview.html'),
          buUrlParser: path.resolve(__dirname, 'browser-utilities/url-parser.html'),
          buUtmBuilder: path.resolve(__dirname, 'browser-utilities/utm-builder.html'),
          buRobotsTxtGenerator: path.resolve(__dirname, 'browser-utilities/robots-txt-generator.html'),
          buSitemapXmlGenerator: path.resolve(__dirname, 'browser-utilities/sitemap-xml-generator.html'),

          // Browser Utilities - Image & Graphics Utilities (6 tools)
          buColorPicker: path.resolve(__dirname, 'browser-utilities/color-picker.html'),
          buColorPaletteGenerator: path.resolve(__dirname, 'browser-utilities/color-palette-generator.html'),
          buHexRgbHslConverter: path.resolve(__dirname, 'browser-utilities/hex-rgb-hsl-converter.html'),
          buImageColorExtractor: path.resolve(__dirname, 'browser-utilities/image-color-extractor.html'),
          buSvgViewer: path.resolve(__dirname, 'browser-utilities/svg-viewer.html'),
          buImageMetadataViewer: path.resolve(__dirname, 'browser-utilities/image-metadata-viewer.html'),

          // Browser Utilities - File & Data Utilities (6 tools)
          buCsvViewer: path.resolve(__dirname, 'browser-utilities/csv-viewer.html'),
          buCsvToJsonConverter: path.resolve(__dirname, 'browser-utilities/csv-to-json-converter.html'),
          buJsonToCsvConverter: path.resolve(__dirname, 'browser-utilities/json-to-csv-converter.html'),
          buFileInformationViewer: path.resolve(__dirname, 'browser-utilities/file-information-viewer.html'),
          buFileHashGenerator: path.resolve(__dirname, 'browser-utilities/file-hash-generator.html'),
          buTextFileMerger: path.resolve(__dirname, 'browser-utilities/text-file-merger.html'),

          // Browser Utilities - Everyday Utilities (6 tools)
          buPasswordStrengthChecker: path.resolve(__dirname, 'browser-utilities/password-strength-checker.html'),
          buTimestampConverter: path.resolve(__dirname, 'browser-utilities/timestamp-converter.html'),
          buDateDifferenceCalculator: path.resolve(__dirname, 'browser-utilities/date-difference-calculator.html'),
          buPercentageCalculator: path.resolve(__dirname, 'browser-utilities/percentage-calculator.html'),
          buNumberBaseConverter: path.resolve(__dirname, 'browser-utilities/number-base-converter.html'),
          buRandomDataGenerator: path.resolve(__dirname, 'browser-utilities/random-data-generator.html'),
        },
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
