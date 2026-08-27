import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
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
          aiPrompt: path.resolve(__dirname, 'ai-prompt.html'),
          articles: path.resolve(__dirname, 'articles.html'),
          contact: path.resolve(__dirname, 'contact.html'),
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
