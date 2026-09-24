import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://multitubeviews.com';

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

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  const canonicalUrl = `${BASE_URL}/${relPath === 'index.html' ? 'index.html' : relPath}`;

  // 1. PART 1 & 2: Canonical consistency & Keyword-natural Meta Descriptions
  // Ensure canonical uses multitubeviews.com (no www)
  content = content.replace(/https:\/\/www\.multitubeviews\.com/g, 'https://multitubeviews.com');

  // Extract <title>
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // Extract <meta name="description">
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  if (descMatch) {
    let desc = descMatch[1].trim();

    // Check media type / intent keywords
    const isAudio = /audio|sound|voice|mp3|wav|flac|aac|ogg|reverb|noise|bpm/i.test(relPath) || /audio|voice/i.test(pageTitle);
    const isVideo = /video|mp4|webm|mkv|movie|clip|stream|shorts/i.test(relPath) || /video|stream/i.test(pageTitle);
    const isImage = /image|photo|jpg|jpeg|png|webp|gif|svg|ico|resize|compress/i.test(relPath) || /image|photo/i.test(pageTitle);
    const isPdf = /pdf|document/i.test(relPath) || /pdf/i.test(pageTitle);
    const isPlatform = relPath.startsWith('platforms/');

    // Ensure description contains natural human-written terms if missing
    if (isAudio && !/audio|sound|convert|online|free/i.test(desc)) {
      desc = `Convert and process audio files online for free. ${desc}`;
    } else if (isVideo && !/video|stream|convert|online|free/i.test(desc)) {
      desc = `Download, trim, and convert video files online for free. ${desc}`;
    } else if (isImage && !/image|photo|convert|online|free/i.test(desc)) {
      desc = `Resize, compress, and edit image files online for free. ${desc}`;
    } else if (isPdf && !/pdf|document|convert|online|free/i.test(desc)) {
      desc = `Convert and process PDF documents online for free. ${desc}`;
    } else if (isPlatform && !/multi|player|grid|stream|watch|online|free/i.test(desc)) {
      desc = `Watch and stream multi-player video grid online for free. ${desc}`;
    }

    // Trim to 155 max characters on word boundary
    if (desc.length > 155) {
      desc = desc.slice(0, 152).replace(/\s+\S*$/, '') + '...';
    }

    // Replace in content
    content = content.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']/i,
      `<meta name="description" content="${escapeAttr(desc)}"`
    );
  }

  // 2. PART 4: HowTo / FAQ Schema in JSON-LD
  const jsonLdMatch = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const rawJson = jsonLdMatch[1].trim();
      const jsonObj = JSON.parse(rawJson);

      if (jsonObj && Array.isArray(jsonObj['@graph'])) {
        const graph = jsonObj['@graph'];
        const hasHowTo = graph.some(item => item['@type'] === 'HowTo');
        const hasFaq = graph.some(item => item['@type'] === 'FAQPage');

        // Check if HTML has "How to Use" or "How it works" section
        const hasHowToHtml = /How to (Use|Convert|Generate|Create|Format)/i.test(content) || /How It Works/i.test(content);

        if (!hasHowTo && hasHowToHtml) {
          // Extract title or main heading for HowTo
          const cleanTitle = pageTitle.split('—')[0].split('|')[0].trim();
          const howToItem = {
            "@type": "HowTo",
            "@id": `${canonicalUrl}#howto`,
            "name": `How to use ${cleanTitle}`,
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Input or Select Media",
                "text": "Enter your prompt, text, or drop media files into the input section."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Configure Options",
                "text": "Adjust processing parameters, layout options, or format settings."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Process & Execute",
                "text": "Click the process button to run the client-side tool or AI engine."
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Export & Copy",
                "text": "Preview your output, copy results to clipboard, or download the generated file."
              }
            ]
          };
          graph.push(howToItem);

          const updatedJson = JSON.stringify(jsonObj, null, 2);
          content = content.replace(
            /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
            `<script type="application/ld+json">\n${updatedJson}\n  </script>`
          );
        }
      }
    } catch (e) {
      // Ignore JSON parse errors for non-standard blocks
    }
  }

  // 3. PART 5: Alt text audit
  // Fix empty alt="" or alt="icon" or missing alt on <img> tags
  content = content.replace(/<img\b([^>]*?)>/gi, (match, p1) => {
    // If alt is missing or empty or alt="icon" or alt="logo" or alt="image"
    if (!/alt=/i.test(p1) || /alt=["']\s*["']/i.test(p1) || /alt=["'](icon|logo|image|pic|photo)["']/i.test(p1)) {
      const cleanTitle = pageTitle ? pageTitle.split('—')[0].split('|')[0].trim() : 'Multi Tube Views';
      let altVal = `${cleanTitle} Icon`;
      if (p1.includes('og-image') || p1.includes('banner')) {
        altVal = `${cleanTitle} Preview Card`;
      }
      
      if (/alt=/i.test(p1)) {
        return `<img${p1.replace(/alt=["'][\s\S]*?["']/i, `alt="${escapeAttr(altVal)}"`)}>`;
      } else {
        return `<img${p1} alt="${escapeAttr(altVal)}">`;
      }
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const files = getHtmlFiles(ROOT_DIR);
console.log(`Processing ${files.length} HTML files for SEO discoverability push...`);

let modifiedCount = 0;
for (const file of files) {
  if (processHtmlFile(file)) {
    modifiedCount++;
  }
}

console.log(`Successfully updated ${modifiedCount} HTML files.`);
