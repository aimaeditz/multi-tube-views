import fs from 'fs';
import path from 'path';

const dups = {
  'creator-tools/comic-strip-dialogue-generator.html': 'Comic Strip Dialogue Generator — Free Creator Tool | MTV',
  'creator-tools/community-challenge-idea-generator.html': 'Community Challenge Idea Generator — Creator Tool | MTV',
  'creator-tools/cross-platform-repost-adapter.html': 'Cross-Platform Repost Adapter — Creator Tool | MTV',
  'creator-tools/live-qa-question-generator.html': 'Live Q&A Question Generator — Free Creator Tool | MTV',
  'creator-tools/social-media-challenge-creator.html': 'Social Media Challenge Creator — Creator Tool | MTV'
};

for (const [file, title] of Object.entries(dups)) {
  const p = path.resolve(file);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/<title>[^<]+<\/title>/i, `<title>${title}</title>`);
  c = c.replace(/<meta\s+property="og:title"\s+content="[^"]+"/i, `<meta property="og:title" content="${title}"`);
  c = c.replace(/<meta\s+name="twitter:title"\s+content="[^"]+"/i, `<meta name="twitter:title" content="${title}"`);
  fs.writeFileSync(p, c, 'utf8');
  console.log(`✓ Fixed title for ${file} (${title.length} chars): ${title}`);
}
