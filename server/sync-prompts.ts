import fs from "fs";
import path from "path";
import { syncPromptsFromRss } from "./ai-prompt-engine.js";

async function main() {
  console.log("[Sync] Fetching AI Prompts from Blogger RSS feed...");
  try {
    const result = await syncPromptsFromRss(true);
    console.log(`[Sync] Successfully retrieved ${result.total} prompts across ${result.categories.length} categories.`);
    
    // Ensure both assets/data and public/assets/data have the latest JSON
    const targets = [
      path.join(process.cwd(), "assets", "data", "ai-prompts.json"),
      path.join(process.cwd(), "public", "assets", "data", "ai-prompts.json"),
    ];

    const jsonStr = JSON.stringify(result, null, 2);

    for (const target of targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(target, jsonStr, "utf-8");
      console.log(`[Sync] Wrote ${result.prompts.length} prompts to ${path.relative(process.cwd(), target)}`);
    }

    // Also copy to dist if dist exists
    const distData = path.join(process.cwd(), "dist", "assets", "data", "ai-prompts.json");
    if (fs.existsSync(path.join(process.cwd(), "dist"))) {
      const distDir = path.dirname(distData);
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
      fs.writeFileSync(distData, jsonStr, "utf-8");
      console.log(`[Sync] Copied to dist/assets/data/ai-prompts.json`);
    }
  } catch (err) {
    console.error("[Sync] Error during RSS synchronization:", err);
    // Do not crash the build if network error occurs, retain existing local file
    if (fs.existsSync(path.join(process.cwd(), "assets", "data", "ai-prompts.json"))) {
      console.log("[Sync] Existing assets/data/ai-prompts.json is retained.");
    }
  }
}

main();
