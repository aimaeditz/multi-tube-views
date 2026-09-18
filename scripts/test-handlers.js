import fs from 'fs';

console.log("=== VERIFYING SERVER & CLIENT HANDLERS ===");

// Check server.ts AI route templates
const serverContent = fs.readFileSync('server.ts', 'utf8');

// Check if all prompt templates in server.ts are valid
const aiToolIdsInServer = [...serverContent.matchAll(/'([a-z0-9-]+)':\s*['"`]/g)].map(m => m[1]);
console.log(`Found ${aiToolIdsInServer.length} AI tool key matches in server.ts`);

// Check browser utilities js
const buJs = fs.readFileSync('assets/js/browser-utilities.js', 'utf8');
console.log(`browser-utilities.js length: ${buJs.length}`);

// Check media tools handlers
const mediaJs = fs.readFileSync('assets/js/media-tools-handlers.js', 'utf8');
console.log(`media-tools-handlers.js length: ${mediaJs.length}`);

// Check growth engine js
const growthJs = fs.readFileSync('assets/js/growth-engine.js', 'utf8');
console.log(`growth-engine.js length: ${growthJs.length}`);
