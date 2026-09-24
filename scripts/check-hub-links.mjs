import fs from 'fs';

for (const f of ['ai-tools.html', 'creator-tools.html', 'media-converter-tools.html']) {
  const content = fs.readFileSync(f, 'utf8');
  const queryLinks = (content.match(/href=["']\?[^"']+["']/g) || []).length;
  const staticLinks = (content.match(/href=["'][^"']+\.html["']/g) || []).length;
  console.log(`${f}: query links=${queryLinks}, html links=${staticLinks}`);
}
