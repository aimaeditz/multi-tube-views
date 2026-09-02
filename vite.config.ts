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
          return html.replace(
            '</head>',
            `  <script>window.MTV_API_BASE_URL = ${JSON.stringify(apiBaseUrl)};</script>\n</head>`
          );
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
          imageStudioTools: path.resolve(__dirname, 'image-studio-tools.html'),
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
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
