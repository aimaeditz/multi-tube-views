import fs from 'fs';

const subpages = [
  "media-converter-tools/image-format-converter/png-to-jpg.html",
  "media-converter-tools/image-format-converter/webp-to-png.html",
  "media-converter-tools/pdf-image-converter/pdf-to-jpg.html",
  "media-converter-tools/video-to-audio/instagram-to-mp3.html",
  "media-converter-tools/video-to-audio/mov-to-wav.html",
  "media-converter-tools/video-to-audio/mp4-to-mp3.html",
  "media-converter-tools/video-to-audio/youtube-to-mp3.html",
  "public/media-converter-tools/image-format-converter/png-to-jpg.html",
  "public/media-converter-tools/image-format-converter/webp-to-png.html",
  "public/media-converter-tools/pdf-image-converter/pdf-to-jpg.html",
  "public/media-converter-tools/video-to-audio/instagram-to-mp3.html",
  "public/media-converter-tools/video-to-audio/mov-to-wav.html",
  "public/media-converter-tools/video-to-audio/mp4-to-mp3.html",
  "public/media-converter-tools/video-to-audio/youtube-to-mp3.html"
];

const TARGET_LINK = '<a href="https://publicmediatool.com/" target="_blank" rel="noopener">Public Media Tool ↗</a>';

for (const f of subpages) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('https://publicmediatool.com/')) {
      content = content.replace(/(<a href="[^"]*credits\.html[^"]*">.*?<\/a>)/i, (m) => `${m}\n          ${TARGET_LINK}`);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Updated:', f);
    }
  }
}
