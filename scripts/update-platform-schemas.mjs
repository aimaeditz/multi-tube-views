import fs from 'fs';
import path from 'path';

const PLATFORMS_DIR = path.resolve(process.cwd(), 'platforms');

if (fs.existsSync(PLATFORMS_DIR)) {
  const files = fs.readdirSync(PLATFORMS_DIR).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(PLATFORMS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract description
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract canonical
    const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : `https://multitubeviews.com/platforms/${file}`;

    // Match JSON-LD script block
    const jsonLdMatch = content.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const jsonLdData = JSON.parse(jsonLdMatch[1]);
        if (jsonLdData && Array.isArray(jsonLdData['@graph'])) {
          const graph = jsonLdData['@graph'];

          // 1. Ensure WebApplication has isAccessibleForFree
          graph.forEach(item => {
            if (item['@type'] === 'WebApplication' || (Array.isArray(item['@type']) && item['@type'].includes('WebApplication'))) {
              item['isAccessibleForFree'] = true;
              if (typeof item['@type'] === 'string') {
                item['@type'] = ['SoftwareApplication', 'WebApplication'];
              }
            }
          });

          // 2. Ensure WebPage schema is present
          const hasWebPage = graph.some(item => 
            item['@type'] === 'WebPage' || 
            (Array.isArray(item['@type']) && item['@type'].includes('WebPage')) ||
            item['@type'] === 'CollectionPage'
          );

          if (!hasWebPage) {
            graph.push({
              "@type": "WebPage",
              "@id": `${canonical}#webpage`,
              "url": canonical,
              "name": title,
              "description": description,
              "isPartOf": {
                "@type": "WebSite",
                "name": "Multi Tube Views",
                "url": "https://multitubeviews.com/"
              },
              "breadcrumb": { "@id": `${canonical}#breadcrumb` }
            });
          } else {
            // Update existing WebPage/CollectionPage name and description if missing or generic
            graph.forEach(item => {
              if (item['@type'] === 'WebPage' || item['@type'] === 'CollectionPage' || (Array.isArray(item['@type']) && (item['@type'].includes('WebPage') || item['@type'].includes('CollectionPage')))) {
                if (!item.name) item.name = title;
                if (!item.description) item.description = description;
              }
            });
          }

          const newJsonLdStr = `<script type="application/ld+json">\n${JSON.stringify(jsonLdData, null, 2)}\n  </script>`;
          content = content.replace(jsonLdMatch[0], newJsonLdStr);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated schema for platforms/${file}`);
        }
      } catch (err) {
        console.error(`Error parsing JSON-LD in platforms/${file}:`, err);
      }
    }
  });
}
