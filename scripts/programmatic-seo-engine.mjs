import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

// Helper for SEO Titles (Target: 50-60 chars)
export function formatOptimalTitle(toolTitle, toolType = 'Tool') {
  const clean = toolTitle.trim();
  let candidate = `${clean} — Free Online ${toolType} | MTV`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  candidate = `${clean} — Free ${toolType} Online | MTV`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  candidate = `${clean} — Free Online ${toolType} | Multi Tube`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  candidate = `${clean} — Free In-Browser Tool | Multi Tube Views`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  candidate = `${clean} — Free Online Utility | MTV`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  candidate = `${clean} — Fast Online Tool | MTV`;
  if (candidate.length >= 50 && candidate.length <= 60) return candidate;

  if (candidate.length < 50) {
    candidate = `${clean} — Free Online In-Browser Tool | MTV`;
    if (candidate.length > 60) {
      candidate = `${clean} — Free Online ${toolType} | MTV`;
    }
  }

  if (candidate.length > 60) {
    candidate = `${clean} — Free Online Tool`;
    if (candidate.length > 60) {
      candidate = clean.slice(0, 56) + '...';
    }
  }

  return candidate;
}

// Helper for SEO Meta Descriptions (Target: 135-155 chars)
export function formatOptimalMeta(toolTitle, toolDesc, toolType = 'tool') {
  const cleanTitle = toolTitle.trim();
  const cleanDesc = toolDesc.trim().replace(/\.$/, '');

  let desc = `Use the free ${cleanTitle} online. ${cleanDesc}. Fast, 100% private in-browser ${toolType} with zero server uploads.`;
  if (desc.length >= 135 && desc.length <= 155) return desc;

  desc = `Use free ${cleanTitle} on Multi Tube Views. ${cleanDesc}. 100% private client-side ${toolType} with zero server uploads.`;
  if (desc.length >= 135 && desc.length <= 155) return desc;

  desc = `Free ${cleanTitle} online on Multi Tube Views. ${cleanDesc}. Fast, private in-browser ${toolType} with instant export.`;
  if (desc.length >= 135 && desc.length <= 155) return desc;

  desc = `Use our free ${cleanTitle} online tool. ${cleanDesc}. 100% private in-browser processing with zero file uploads. Try it now.`;
  if (desc.length >= 135 && desc.length <= 155) return desc;

  if (desc.length < 135) {
    desc = `Use the free ${cleanTitle} online on Multi Tube Views. ${cleanDesc}. 100% private client-side processing with zero server uploads. Try it now.`;
    if (desc.length > 155) {
      desc = `Use free ${cleanTitle} on Multi Tube Views: ${cleanDesc}. Fast, 100% private in-browser ${toolType} with zero uploads.`;
    }
  }

  if (desc.length > 155) {
    const truncatedDesc = cleanDesc.slice(0, 75).trim().replace(/\s+\S*$/, '');
    desc = `Use free ${cleanTitle} online. ${truncatedDesc}... 100% private in-browser ${toolType} with zero server uploads.`;
  }

  if (desc.length > 155) {
    desc = desc.slice(0, 151).trim() + '...';
  }

  return desc;
}

// Generate Standard FAQs for any tool
export function generateToolFaqs(toolTitle, toolType, toolCategory) {
  return [
    {
      q: `How do I use the free ${toolTitle}?`,
      a: `Simply enter your input or select your file in the workspace above, adjust any desired options, and click the process button. Your results are generated instantly in your browser.`
    },
    {
      q: `Is the ${toolTitle} completely free to use?`,
      a: `Yes, ${toolTitle} is 100% free with unlimited usage. There are no subscriptions, credits, watermarks, sign-ups, or hidden fees.`
    },
    {
      q: `Are my files or inputs uploaded to a remote server?`,
      a: `No. Multi Tube Views processes your data locally inside your web browser. Your inputs and files never leave your device, ensuring total privacy and security.`
    },
    {
      q: `Can I export or download my ${toolTitle} results?`,
      a: `Yes, you can copy generated text directly to your clipboard or download processed files immediately upon completion with a single click.`
    }
  ];
}

console.log('Programmatic SEO engine helpers ready.');
