import fs from "fs";
import path from "path";

function copyFolderSync(from: string, to: string) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const entries = fs.readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFileIfExists(src: string, dest: string) {
  if (fs.existsSync(src)) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`[Static Copy] Copied ${src} -> ${dest}`);
  }
}

function main() {
  const distDir = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy full assets tree into dist/assets
  const assetsSrc = path.join(process.cwd(), "assets");
  const assetsDest = path.join(distDir, "assets");
  copyFolderSync(assetsSrc, assetsDest);
  console.log(`[Static Copy] Copied assets folder to dist/assets`);

  // Copy root meta files for GitHub Pages / static hosting
  const rootFiles = ["CNAME", "robots.txt", "sitemap.xml", ".nojekyll", "manifest.json", "sw.js"];
  for (const f of rootFiles) {
    copyFileIfExists(path.join(process.cwd(), f), path.join(distDir, f));
  }
}

main();
