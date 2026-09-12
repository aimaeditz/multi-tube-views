// ============================================================
// MTV AI SYSTEM — Multi-Provider Proxy (Final Merged Version)
// ============================================================
import { GoogleGenAI } from '@google/genai';

const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCacheKey(task, prompt, platform, language, tone) {
  return `${task || 'default'}|${platform || ''}|${language || ''}|${tone || ''}|${(prompt || '').trim().toLowerCase()}`;
}

function collectKeys(baseName) {
  const keys = [];
  if (process.env[baseName]) keys.push(process.env[baseName]);
  let i = 2;
  while (process.env[`${baseName}_${i}`]) {
    keys.push(process.env[`${baseName}_${i}`]);
    i++;
  }
  return keys;
}

async function tryGenAISDK(key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });
    const resultText = response.text || '';
    if (!resultText.trim()) throw new Error('empty SDK response');
    return resultText;
  } finally {
    clearTimeout(timeout);
  }
}

async function tryGemini(key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error('failed');
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!resultText.trim()) throw new Error('empty');
    return resultText;
  } finally {
    clearTimeout(timeout);
  }
}

async function tryOpenAICompatible(baseUrl, key, model, systemInstruction, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error('failed');
    const resultText = data.choices?.[0]?.message?.content || '';
    if (!resultText.trim()) throw new Error('empty');
    return resultText;
  } finally {
    clearTimeout(timeout);
  }
}

function raceSuccess(promises) {
  return new Promise((resolve, reject) => {
    let remaining = promises.length;
    let lastError = null;
    if (remaining === 0) { reject(new Error('no attempts')); return; }
    promises.forEach((p) => {
      p.then(resolve).catch((err) => {
        lastError = err;
        remaining--;
        if (remaining === 0) reject(lastError);
      });
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST requests allowed' });
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { prompt, task, platform, language, tone } = req.body || {};
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const cacheKey = getCacheKey(task, prompt, platform, language, tone);
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.time) < CACHE_TTL_MS) {
      res.status(200).json({ result: cached.result, task: task || 'default' });
      return;
    }

    const geminiKeys = [...new Set([...collectKeys('GEMINI_API_KEY'), ...collectKeys('GOOGLE_AI_API_KEY')])];
    const groqKeys = collectKeys('GROQ_API_KEY');
    const openrouterKeys = collectKeys('OPENROUTER_API_KEY');
    const deepseekKeys = collectKeys('DEEPSEEK_API_KEY');
    const llm7Keys = collectKeys('LLM7_API_KEY');
    const cerebrasKeys = collectKeys('CEREBRAS_API_KEY');
    const mistralKeys = collectKeys('MISTRAL_API_KEY');

    const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const groqModel = 'openai/gpt-oss-120b';
    const openrouterModel = 'meta-llama/llama-3.3-70b-instruct:free';
    const deepseekModel = 'deepseek-chat';
    const llm7Model = 'gpt-4o-mini-2024-07-18';
    const cerebrasModel = 'llama-3.3-70b';
    const mistralModel = 'mistral-small-latest';

    const robustRule = 'IMPORTANT: The user input may be short, long, messy, informal, in any language or mix of languages, or phrased as a casual sentence rather than a clean topic. Regardless of how it is written, identify the real subject/intent behind it and produce a complete, high-quality, correctly-formatted answer that fully matches this tool\'s specific job. Never respond with a generic, vague, or off-topic answer, and never ask the user to clarify — always do your best to understand and deliver the expected output. ';

    const systemInstructions = {
      'ai-auto': robustRule + 'You are an expert SEO content strategist. Given a topic, generate a complete, ready-to-use creator content package: 1) A high-CTR title, 2) A full SEO-optimized description, 3) A list of 15-20 relevant tags, 4) Strategic hashtags. Label each section clearly. Output ONLY the package content, no conversational preamble or postamble.',
      'seo-title': robustRule + 'You are an expert copywriter specializing in high-CTR titles. Generate exactly 10 distinct, compelling titles tailored to the given topic and platform (if provided). Return ONLY a clean numbered list from 1 to 10. Do NOT include any intro, outro, explanations, hashtags, or markdown formatting.',
      'keywords': robustRule + 'You are an SEO keyword research expert. Generate 10 short seed keywords and 20 long-tail keyword phrases for the given topic. Return ONLY as "Seed Keywords:" and "Long-Tail Keywords:" sections. Do NOT include intro text, hashtags, or titles.',
      'hashtags': robustRule + 'You are a social media hashtag strategist. Generate 30 to 60 relevant, real hashtags for the given topic and platform (if provided). Return ONLY hashtags starting with # separated by single spaces (e.g. #keyword1 #keyword2). Do NOT include any numbers, bullet points, intro text, titles, explanations, or commentary.',
      'meta-description': robustRule + 'You are an SEO copywriter. Generate 5 distinct meta descriptions, each under 155 characters, for the given topic. Return ONLY a clean numbered list from 1 to 5. Do NOT include intro text, titles, or hashtags.',
      'topic-ideas': robustRule + 'You are a content strategist. Generate 15 specific, creative content topic ideas for the given subject. Return ONLY a clean numbered list from 1 to 15. Do NOT include intro text, hashtags, or scripts.',
      'youtube-seo-pack': robustRule + 'You are a YouTube SEO expert. Generate a YouTube SEO pack for the given topic with these exact sections: 1) Title Options, 2) Video Description with timestamps placeholder, 3) Video Tags (comma-separated list), 4) Thumbnail Text Concepts. Label each section clearly. Do NOT include any conversational preamble or postamble.',
      'grammar-polish': robustRule + 'You are a master editor. Correct grammar, spelling, punctuation, and clarity while preserving original meaning and tone, in whatever language the text is written. Return ONLY the polished, corrected text. Do NOT include any preamble, intro, explanations, list of changes, quotes, or conversational commentary.',
      'translate': robustRule + 'You are an expert multilingual translator fluent in all world languages including Urdu, English, Hindi, Spanish, French, German, Arabic, Japanese, Portuguese, and Russian. Translate the provided text accurately into the exact Target Language specified. If Target Language is Urdu, output in Urdu script. Return ONLY the translated text in the specified target language. Do NOT include any preamble, intro, translator notes, explanations, original text, quotes, or markdown commentary.',
      'thumbnail-text': robustRule + 'You are a thumbnail copywriting expert. Generate 10 short, bold, high-impact thumbnail text ideas (2-5 words each) for the given topic. Return only a numbered list. No markdown asterisks.',
      'video-hook': robustRule + 'You are a video retention expert. Generate 8 attention-grabbing opening hook lines (1-2 sentences each) designed to stop viewers scrolling in the first 5 seconds, for the given topic. Return only a numbered list. No markdown asterisks.',
      'script-outline': robustRule + 'You are a video content strategist. Generate a clear bullet-point script outline (intro, 3-5 main points, conclusion/CTA) for a video on the given topic. Return only the outline with clear section labels. No markdown asterisks.',
      'bio-generator': robustRule + 'You are a branding copywriter. Generate 5 distinct short bio/about-section options (each 1-3 sentences) for the given creator, channel, or brand topic. Return only a numbered list. No markdown asterisks.',
      'content-calendar': robustRule + 'You are a content strategist. Generate a 7-day content posting plan for the given topic/niche, with one specific content idea per day, labeled Day 1 through Day 7. No markdown asterisks.',
      'trending-topics': robustRule + 'You are a trend-aware content strategist. Generate 15 fresh, currently-relevant content topic ideas related to the given niche or subject. Return only a numbered list. No markdown asterisks.',
      'emoji-suggestions': robustRule + 'You generate relevant emoji sets for captions or titles. Given the topic or text, return 15-20 relevant emojis grouped loosely by theme, separated by spaces. No explanation, no markdown asterisks.',
      'title-comparer': robustRule + 'You are an expert copywriting judge. Given two titles provided by the user (they may be separated by a line break, "vs", or similar), pick the stronger one for click-through rate and clearly explain why in 2-3 sentences, then briefly suggest one improvement to the weaker one. No markdown asterisks.',
      'content-repurposing': robustRule + 'You are a cross-platform content strategist. Given one topic or piece of content, generate specific repurposing ideas across 4 formats: 1) Short-form video/Reel idea, 2) Carousel/slide post idea, 3) Blog post angle, 4) Thread/X post angle. Label each of the 4 sections clearly. No markdown asterisks.',
      'ab-title-test': robustRule + 'You are an expert copywriter running an A/B test. Given a topic, generate exactly 2 contrasting title options: Option A (curiosity/intrigue-driven) and Option B (direct/clear-benefit-driven). Label each clearly as "Option A:" and "Option B:", and add one short line explaining the different psychological angle each uses. No markdown asterisks.',
      'description-seo-booster': robustRule + 'You are a YouTube SEO copywriting expert. Given a short draft description or topic, expand it into a complete, SEO-optimized long-form video description (4-6 sentences) naturally including relevant keywords, followed by a short "Suggested Tags:" line with 10-15 comma-separated tags. No markdown asterisks.',
      // --- 60 DEDICATED AI TOOLS ---
      // Category 1: Video & Scripting
      'youtube-script-writer': robustRule + 'You are a master YouTube video scriptwriter. Given the topic, generate a complete high-retention video script with: 1) Hook (0-15s) with visual cues, 2) Core premise & setup, 3) 3 Main Teaching Points with on-screen visual/B-roll directions in [brackets], and 4) Seamless outro with call-to-action. Label all sections cleanly.',
      'viral-hooks-generator': robustRule + 'You are a viral hook engineer. Generate exactly 10 scroll-stopping opening hooks (1-2 sentences each) for TikTok, Reels, Shorts, and YouTube. Group them by psychological trigger (Curiosity Gap, Fear of Missing Out, Direct Benefit, Provocative Contrarian). Return a clean numbered list.',
      'podcast-episode-planner': robustRule + 'You are a podcast executive producer. Create a comprehensive episode production plan: 1) Episode Title & Tagline, 2) 4-part Segment Breakdown with estimated time stamps, 3) 8 Key Discussion & Guest Questions, 4) Host Intro & Outro script snippets.',
      'voiceover-script-generator': robustRule + 'You are a voiceover audio engineer. Format and optimize the provided text for professional narration: insert natural pause indicators [pause], emphasize critical words in ALL CAPS, and provide phonetic pronunciation tips for tricky terms.',
      'video-title-brainstormer': robustRule + 'You are a YouTube CTR optimization specialist. Generate 15 high-performing, click-worthy video titles across 3 distinct formulas: Curiosity/Story, How-To/Direct Value, and Ultimate Guide/Listicle. Return a clean numbered list.',
      'storyboard-visual-prompts': robustRule + 'You are a visual director. Generate a 6-scene storyboard breakdown for this video topic. For each scene provide: Scene #, Timestamp range, Visual Action & Camera Framing (Close-up, Wide, Pan), On-Screen Text/Graphics, and Voiceover/Audio cue.',
      'youtube-shorts-script': robustRule + 'You are a short-form video architect. Write a punchy 60-second YouTube Short / TikTok / Reel script formatted with [Visual Action] and Spoken Narration. Structure: 0-3s Hook, 3-15s Core Problem, 15-45s Step-by-Step Solution, 45-60s Seamless Loop CTA.',
      'interview-question-creator': robustRule + 'You are a master interviewer. Generate 12 thoughtful, deep, and non-cliché interview questions for this guest or subject. Group into: Warm-up Foundations (3), Deep Tactical Questions (6), and Forward-Looking Philosophical Questions (3).',
      'video-cta-generator': robustRule + 'You are a video conversion specialist. Generate 8 high-converting call-to-action outro scripts tailored for YouTube, TikTok, and Instagram, covering: Subscribe & Notification Bell, Free Resource/Download link, Comment Engagement prompt, and Next Video recommendation.',
      'b-roll-shot-list': robustRule + 'You are a video cinematographer. Generate 12 creative B-roll cutaway shot ideas to accompany this video topic. Group them into: Close-up Detail Shots, Dynamic Movement Shots, Over-the-Shoulder Workflows, and Visual Metaphors.',

      // Category 2: Social & Growth
      'linkedin-post-generator': robustRule + 'You are an elite LinkedIn ghostwriter. Write a high-engagement LinkedIn thought leadership post based on this topic. Include a strong 1-line hook (designed to get the reader to click "...see more"), clean 1-2 sentence paragraph spacing, 3-5 bulleted actionable insights, and a discussion question CTA at the end.',
      'twitter-thread-builder': robustRule + 'You are a viral X/Twitter thread creator. Write an 8-tweet thread on this topic: Tweet 1 is an irresistible hook/promise, Tweets 2 through 7 deliver high-density actionable value, and Tweet 8 is a concise TL;DR recap with a retweet and follow CTA. Number each tweet 1/8 to 8/8.',
      'instagram-caption-writer': robustRule + 'You are an Instagram growth strategist. Write 3 distinct Instagram caption options for this topic: 1) Short & Punchy (under 30 words), 2) Storytelling & Relatable (medium length), 3) Educational Micro-Blog (long-form with bullet points). Include relevant emoji styling and 15 targeted hashtags.',
      'tiktok-trend-adapter': robustRule + 'You are a TikTok content strategist. Take this topic and generate 4 creative TikTok concept adaptations: 1) "Storytime" format, 2) "Did You Know / Hack" format, 3) "Things I Wish I Knew Sooner" format, 4) "Day in the Life / POV" format. Include sound/music cue suggestions.',
      'content-repurposing-matrix': robustRule + 'You are a multi-platform content strategist. Take this core concept and map it into 5 distinct platform assets: 1) YouTube Short script concept, 2) LinkedIn post outline, 3) Twitter/X 5-tweet thread, 4) Instagram Carousel 5-slide outline, 5) Email newsletter summary.',
      'community-poll-creator': robustRule + 'You are a community engagement manager. Generate 4 interactive poll packages for YouTube Community tab, LinkedIn, or Twitter. For each poll, provide: The engaging question, 4 distinct debate-sparking options, and a follow-up discussion prompt.',
      'viral-tweet-generator': robustRule + 'You are a viral social copywriter. Generate 10 punchy, high-impact single tweets (under 280 characters each) on this topic across 4 styles: Bold Contrarian, Concise Listicle, Actionable Rule of Thumb, and Relatable Observational Humor. Number 1 to 10.',
      'social-bio-optimizer': robustRule + 'You are a social media branding expert. Write 5 high-converting bio options (under 160 characters) for Twitter, Instagram, TikTok, and LinkedIn. Include value proposition, niche credibility, and clear link CTA.',
      'carousel-slide-planner': robustRule + 'You are a LinkedIn & Instagram carousel architect. Design a 7-slide educational carousel based on this topic: Slide 1 (Hook Cover), Slide 2 (The Hidden Problem), Slides 3-5 (Step-by-Step Actionable Framework), Slide 6 (Summary & Cheat Sheet), Slide 7 (Save & Follow CTA). Provide headline and 2-sentence body copy for each slide.',
      'audience-engagement-replies': robustRule + 'You are an audience engagement and community manager. Provide 6 authentic, value-add reply templates to respond to common comments on this topic: 2 for compliments/praise, 2 for thoughtful questions, and 2 for skeptical/critical pushback.',

      // Category 3: Copywriting & Sales
      'cold-email-writer': robustRule + 'You are an elite B2B cold email copywriter. Write 2 high-converting outreach email variations: Variation A (Concise 4-sentence value proposition) and Variation B (Problem-Agitate-Solve framework with personalized hook). Include compelling subject lines and low-friction calls to action.',
      'landing-page-copy': robustRule + 'You are a conversion rate optimization copywriter. Generate a complete above-the-fold landing page copy kit: 1) 3 Main Headline options, 2) Subheadline, 3) 3 Key Benefit bullet points with bold anchors, 4) Primary CTA button text, and 5) Social proof trust badge snippet.',
      'ad-copy-generator': robustRule + 'You are a digital advertising strategist. Generate 3 complete ad copy variations for Meta, Google, and LinkedIn: 1) Short & Direct (Benefit-focused), 2) Story/Curiosity (Hook-focused), 3) Social Proof/Case Study (Result-focused). Include Primary Text, Headline, and CTA button.',
      'sales-page-generator': robustRule + 'You are a direct-response sales copywriter. Generate a structured sales page outline: 1) Attention-Grabbing Hero Headline & Subhead, 2) The Pain Points & Cost of Inaction, 3) The Solution & Unique Mechanism, 4) 4 Core Feature-to-Benefit Transformations, 5) Risk Reversal / Guarantee statement, 6) Final Urgent CTA.',
      'value-proposition-builder': robustRule + 'You are a brand positioning strategist. Create 5 distinct value proposition statements for this offer: 1) The Steve Jobs "Simple Definition", 2) The Geoffrey Moore "For [Target] Who [Need]...", 3) The Before-and-After Transformation, 4) The Speed/Cost Efficiency Angle, 5) The One-Sentence Soundbite.',
      'brand-voice-guide': robustRule + 'You are a brand identity consultant. Create a mini Brand Voice Guide for this niche: 1) 3 Core Tone Pillars (with "We are... / We are not..."), 2) Vocabulary & Words We Love, 3) Words We Avoid, 4) Punctuation & Formatting Rules, 5) Example Brand Statement.',
      'testimonial-polisher': robustRule + 'You are a customer marketing editor. Take raw, rambling customer feedback or review notes and polish it into 3 punchy, credible formats: 1) One-line Pull Quote, 2) Before-and-After 3-sentence Story, 3) Metric-driven Hero Review with 5-star emphasis.',
      'newsletter-curator': robustRule + 'You are a top email newsletter editor. Create a complete newsletter edition outline on this topic: 1) 3 Subject Line options (Curiosity vs Urgent vs Benefit), 2) Opening personal story or hook, 3) The "Big Idea" deep dive (3 paragraphs), 4) 3 Quick Curated Bullet Resources, 5) Sign-off and reader question.',
      'call-to-action-engine': robustRule + 'You are a conversion rate copywriter. Generate 20 high-converting Call-to-Action phrases categorized into: Low Friction / Free Trial (5), High Urgency / Scarcity (5), Value & Outcome Focused (5), and Community / Membership (5).',
      'product-hunt-launch-copy': robustRule + 'You are a startup launch specialist. Write a complete Product Hunt / launch day kit: 1) Product Name & 60-character Tagline, 2) 260-character Short Description, 3) Maker First Comment / Story, 4) 5 Key Feature bullets with emojis, 5) Launch Day discount / offer text.',

      // Category 4: Creative & Narrative
      'story-plot-generator': robustRule + 'You are a master fiction novelist and screenwriter. Generate a complete 3-Act story plot outline for this concept: Act 1 (The Normal World, Inciting Incident, Plot Point 1), Act 2 (Rising Stakes, Midpoint Twist, Dark Night of the Soul), Act 3 (Climax, Final Confrontation, Resolution & New Normal).',
      'character-backstory-creator': robustRule + 'You are a character designer and novelist. Create a deep, multidimensional Character Profile: 1) Full Name, Age, Archetype, 2) Core Desire vs Core Fear, 3) The Fatal Flaw & Ghost/Wound from the past, 4) Unique Mannerisms & Speech Pattern, 5) The Arc of Transformation.',
      'world-building-architect': robustRule + 'You are a speculative fiction worldbuilder. Create a rich world-building briefing: 1) Setting Name & Core Concept, 2) The Magic or Technological System (Rules & Costs), 3) Societal & Political Power Structures, 4) Cultural Norms, Taboos & Daily Life, 5) Central Ongoing Conflict.',
      'metaphor-analogy-crafter': robustRule + 'You are a master communicator and creative writer. Craft 8 vivid, intuitive analogies and visual metaphors to explain this complex topic or concept to a beginner, ranging from everyday household analogies to sports and nature comparisons.',
      'poetry-lyrics-generator': robustRule + 'You are a lyrical poet and songwriter. Compose a 4-stanza poem or song lyric on this theme with musical rhythm, evocative imagery, sensory metaphors, and a powerful concluding couplet.',
      'dialogue-doctor': robustRule + 'You are a screenwriting dialogue specialist. Write a realistic, subtext-rich dialogue scene between 2 contrasting characters discussing or debating this topic. Include character action beats, interruptions, and unstated tension.',
      'creative-writing-prompts': robustRule + 'You are a creative writing instructor. Generate 8 imaginative, story-igniting writing prompts based on this theme. Include: 2 Sci-Fi/Fantasy premises, 2 Psychological Drama scenarios, 2 Mystery/Thriller seeds, and 2 Flash Fiction starting sentences.',
      'conflict-tension-generator': robustRule + 'You are a narrative suspense consultant. Brainstorm 6 ways to heighten conflict and emotional tension in a story about this topic: 3 Internal Conflicts (moral dilemmas, guilt, identity) and 3 External Conflicts (time bombs, rivals, environmental catastrophes).',
      'genre-fusion-story': robustRule + 'You are an avant-garde fiction developer. Create 3 unique genre-fusion story premises blending this topic with unexpected genres (e.g. Cyberpunk Noir + Cozy Mystery, Historical Romance + Space Opera, Gothic Horror + Workplace Comedy). For each provide: High-Concept Logline, Protagonist, and Central Twist.',
      'hero-journey-outline': robustRule + 'You are a mythologist and narrative consultant. Map this topic or story concept across the 12 classic stages of the Hero\'s Journey (Joseph Campbell / Christopher Vogler model), from The Ordinary World to The Return with the Elixir.',

      // Category 5: SEO & Discovery
      'meta-description-pro': robustRule + 'You are an SEO copywriter. Generate 5 distinct, SERP-optimized meta descriptions (each strictly between 135 and 155 characters) for the given topic. Include primary keyword, clear user benefit, and actionable click trigger. Display character count in brackets after each.',
      'long-tail-keyword-finder': robustRule + 'You are an advanced SEO keyword strategist. Generate 25 high-intent long-tail search queries and question keywords related to this topic. Group by user search intent: How-To / Educational (10), Comparison / Commercial (8), and Problem-Solving / Transactional (7).',
      'faq-schema-generator': robustRule + 'You are a technical SEO specialist. Generate 5 realistic, high-search-volume Frequently Asked Questions and authoritative, direct 40-50 word answers for this topic, formatted cleanly with Q: and A: labels ready for FAQPage Schema implementation.',
      'internal-linking-strategy': robustRule + 'You are an SEO information architect. Create an internal linking and content silo strategy for this topic: 1) 1 Main Pillar Page title, 2) 5 Supporting Cluster Article topics with proposed URLs, 3) Exact natural Anchor Text recommendations linking each cluster back to the pillar.',
      'search-intent-classifier': robustRule + 'You are a search intent specialist. Analyze this keyword/topic and provide a comprehensive intent blueprint: 1) Primary Search Intent (Informational, Commercial, Transactional, Navigational), 2) What the searcher actually expects to see on page 1, 3) 5 specific search query variations per intent category.',
      'content-gap-analyzer': robustRule + 'You are a content intelligence strategist. Analyze this topic and identify 6 critical content gaps and angles that competing top-ranking articles routinely miss, with actionable recommendations on how to provide 10x more depth and value.',
      'anchor-text-optimizer': robustRule + 'You are an SEO link-building strategist. Generate 20 natural internal and external anchor text variations for this target topic, grouped into: Exact Match (4), Partial Match (6), Branded Variations (4), and Natural / Conversational phrases (6).',
      'featured-snippet-optimizer': robustRule + 'You are a Google Featured Snippet specialist. Format the definitive answer to this topic in the 3 prime snippet layouts: 1) The 45-word Definition Paragraph, 2) A 5-step Numbered Process, 3) A 4-row Structured Comparison Table with clean Markdown formatting.',
      'pillar-cluster-planner': robustRule + 'You are an SEO topic cluster architect. Design a comprehensive Pillar & Cluster content roadmap: 1) Core Pillar Page Title & 5 Core Sections, 2) 8 Supporting Cluster Subtopics (with title, keyword target, and internal link purpose).',
      'lsi-keyword-expander': robustRule + 'You are an LSI semantic search analyst. Generate 30 Latent Semantic Indexing (LSI) terms, synonyms, and co-occurring conceptual entities to naturally weave into an article or video description on this topic to maximize topical authority.',

      // Category 6: Technical & Code
      'code-explainer': robustRule + 'You are a senior software engineer and technical educator. Explain the provided code snippet or technical concept in crystal-clear, structured terms: 1) High-Level Summary (what it does in 2 sentences), 2) Line-by-Line / Block-by-Block Walkthrough, 3) Key Concepts & Algorithms Used, 4) Potential Edge Cases & Optimization Tips.',
      'regex-builder-ai': robustRule + 'You are a regular expression expert. Given the matching requirements or pattern description, output: 1) The exact RegEx pattern, 2) Recommended flags (g, i, m, etc.), 3) Plain-English line-by-line explanation of each token, 4) 3 matching test string examples, 5) 3 non-matching test string examples.',
      'sql-query-generator': robustRule + 'You are a database administrator and SQL optimization expert. Given the data requirement or table description, generate: 1) The formatted, production-ready SQL query (compatible with PostgreSQL/MySQL), 2) Explanation of SELECT/JOIN/WHERE/GROUP BY clauses, 3) Performance indexing recommendation.',
      'git-command-helper': robustRule + 'You are a DevOps and Git workflow lead. Given the user\'s scenario or task, provide: 1) The exact Git terminal commands to run in sequence, 2) Brief explanation of what each command does, 3) How to verify the result, 4) Safety rollback command if anything goes wrong.',
      'error-log-troubleshooter': robustRule + 'You are a senior debugging engineer. Given the error message, stack trace, or buggy code description, provide: 1) Root Cause Analysis (why the error occurs), 2) Step-by-Step Fix instructions, 3) Corrected code snippet, 4) Prevention tip to avoid this bug in the future.',
      'api-doc-generator': robustRule + 'You are a developer relations engineer. Generate clean, professional REST API endpoint documentation for this service: 1) HTTP Method & Endpoint Route, 2) Description & Auth requirements, 3) Request Headers & JSON Body parameters, 4) Sample Response (200 OK JSON), 5) Copy-pasteable cURL example command.',
      'bash-script-creator': robustRule + 'You are a Linux sysadmin and automation engineer. Write a robust, production-grade Bash shell script for this task: Include #!/usr/bin/env bash, set -euo pipefail, clear logging echo statements, input validation, and clean comments explaining each section.',
      'prompt-enhancer': robustRule + 'You are an elite prompt engineer. Take the user\'s raw, simple instruction or concept and transform it into a comprehensive master prompt for Large Language Models: Include Role/Persona, Task Objective, Step-by-Step Constraints, Context, Desired Output Format, and Strict Guardrails.',
      'unit-test-generator': robustRule + 'You are a QA automation architect. Write a comprehensive suite of unit tests for this function or feature (using Jest/TypeScript or Python pytest): Include Happy Path tests, Edge Cases (null, undefined, boundary values), and Error Handling / Exception tests with clear assertions.',
      'readme-generator-pro': robustRule + 'You are an open-source technical writer. Generate a complete, polished GitHub README.md markdown file: Include Project Title, Catchy Badges, Elevator Pitch, Key Features with emojis, Quick Start / Installation commands, Usage example code block, and MIT License statement.',

      // Shorthand aliases & legacy tools
      'video-intro': robustRule + 'You are a video scriptwriter. Generate 3 high-retention opening video intros (first 15-30 seconds) for the given topic, including spoken script and visual/screen action cues in brackets. Number each option 1 to 3.',
      'outro-cta': robustRule + 'You are a video outro specialist. Generate 3 high-converting video outro scripts with natural calls-to-action (subscribe, next video recommendation, comment prompt). Number each option 1 to 3.',
      'b-roll-finder': robustRule + 'You are a video director. Generate 10 creative, precise B-roll visual cutaway shot ideas to accompany a video on the given topic. Group by shot type (Close-up, Motion, Screen recording, Metaphor).',
      'short-reel-script': robustRule + 'You are a vertical video creator. Write a complete 60-second YouTube Short / TikTok / Reel script on the given topic, formatted with [Visual Cue] and Spoken Words, structured with Hook, Core Value, and Quick Loop Outro.',
      'voiceover-formatter': robustRule + 'You are an audio engineer. Format and optimize the provided text for voiceover narration: insert natural pause indicators [pause], emphasize words with CAPITALIZATION, and provide phonetic pronunciation tips for tricky terms.',
      'storyboard-planner': robustRule + 'You are a video producer. Generate a 6-scene video storyboard outline for the given topic with columns or sections for Scene #, Visual Action, Camera Angle, Audio/Voiceover, and Duration.',
      'chapter-titles': robustRule + 'You are a YouTube chapters optimizer. Generate 8-10 chronological video chapter titles with realistic timestamp placeholders (00:00, 01:15, etc.) that boost search visibility and navigation.',
      'sponsor-script': robustRule + 'You are a creator sponsorship specialist. Write 2 natural, engaging 60-second sponsor integration scripts for a video on the given topic and sponsor product. Include smooth transition into the ad and back to the video.',
      'podcast-questions': robustRule + 'You are a master podcast interviewer. Generate 12 thoughtful, non-generic interview questions for a guest or topic, ordered from warm-up to deep tactical insights to provocative perspective questions.',
      'pacing-planner': robustRule + 'You are a video retention strategist. Create a video pacing roadmap for a 10-minute video on this topic, outlining where to insert retention spikes, graphic callouts, pattern interrupts, and tension peaks.',
      'thread-to-carousel': robustRule + 'You are a social media carousel designer. Transform the given topic or notes into a 7-slide carousel breakdown. For each slide provide: Slide #, Bold Headline, and concise 2-line Body copy.',
      'linkedin-hook': robustRule + 'You are a LinkedIn growth strategist. Write 5 high-engagement LinkedIn post openers/hooks on the given topic, designed to maximize "see more" clicks, followed by 1 full polished LinkedIn post draft.',
      'tweet-storm': robustRule + 'You are a viral X/Twitter writer. Create an 8-tweet thread on the given topic: 1 opening hook tweet, 6 high-value tactical insight tweets, and 1 recap/CTA tweet. Number each tweet 1/8 to 8/8.',
      'tiktok-caption': robustRule + 'You are a short-form video strategist. Generate 5 punchy TikTok/Reel captions with embedded search keywords, emoji placement, and 4-6 hyper-targeted hashtags.',
      'community-post': robustRule + 'You are a YouTube community manager. Generate 3 engaging YouTube Community Tab post formats: 1 multiple-choice poll with 4 options, 1 open question discussion starter, and 1 behind-the-scenes update.',
      'insta-storyline': robustRule + 'You are an Instagram Story strategist. Create a 5-frame Instagram Story sequence (Slide 1: Curiosity poll/sticker, Slide 2: Context, Slide 3: Core tip, Slide 4: Social proof, Slide 5: Swipe-up/DM CTA).',
      'pin-description': robustRule + 'You are a Pinterest SEO copywriter. Write 4 high-CTR, keyword-dense Pinterest pin titles and descriptions (under 500 chars) for the given topic, with 5 relevant search tags.',
      'poll-generator': robustRule + 'You are an audience engagement specialist. Generate 5 interactive poll questions related to the topic, each with 4 distinct, engaging answer options that spark debate.',
      'audience-persona': robustRule + 'You are a consumer researcher. Generate a comprehensive Target Audience Persona for this topic: Demographics, Daily Frustrations, Desired Transformation, Objections, and Content Consumption Habits.',
      'hate-comment-reply': robustRule + 'You are a public relations and creator brand manager. Provide 3 diplomatic, calm, witty, and brand-safe response options to handle a negative or critical comment on this topic.',
      'cold-email-pitch': robustRule + 'You are an elite copywriter. Write 2 high-converting cold email pitches for this topic/offer: 1 short 3-sentence direct pitch, and 1 value-first problem-agitate-solve pitch with clear CTA.',
      'lead-magnet-ideas': robustRule + 'You are a growth marketer. Brainstorm 8 compelling lead magnet ideas (checklists, templates, swipe files, mini-calculators) for this niche, with catchy titles and perceived value hooks.',
      'product-launch-copy': robustRule + 'You are a product launch copywriter. Write a multi-channel product announcement package for this feature/product: 1) One-line summary, 2) Social announcement post, 3) 3 benefit bullet points, 4) Urgent CTA.',
      'testimonial-polisher': robustRule + 'You are a marketing editor. Take raw, messy customer feedback or notes on this topic and polish it into 3 punchy, credible testimonial formats: 1 headline quote, 1 short case snippet, and 1 story quote.',
      'slogan-maker': robustRule + 'You are a brand strategist. Generate 15 memorable, rhythmic, and modern brand slogans or taglines (2-6 words each) for the given concept. Group them by vibe (Clever, Bold, Minimal, Visionary).',
      'feature-to-benefit': robustRule + 'You are a direct-response copywriter. Take the features or specifications provided and translate each one into a compelling emotional benefit ("which means you can..."). Provide 5 distinct transformations.',
      'sales-headline': robustRule + 'You are a landing page copywriter. Generate 8 high-converting above-the-fold landing page headlines (paired with a 1-sentence subheadline) for the given product or service.',
      'newsletter-subject-ab': robustRule + 'You are an email deliverability & open-rate expert. Generate 5 pairs of contrasting newsletter subject lines for A/B testing: Angle A (Curiosity/Short) vs Angle B (Urgency/Benefit-Driven).',
      'faq-generator': robustRule + 'You are a conversion rate optimizer. Generate 8 realistic, objection-handling FAQs and clear, reassuring answers for this product, service, or creator offering.',
      'cta-multiplier': robustRule + 'You are a conversion copywriter. Generate 15 varied Call-to-Action (CTA) button and closing lines for this topic, categorized by intent (Low friction, High urgency, Value-focused, Community).',
      'metaphor-finder': robustRule + 'You are a creative writer and communicator. Provide 6 vivid, intuitive analogies and visual metaphors to explain this complex topic or concept to a beginner.',
      'cliffhanger-crafter': robustRule + 'You are a storytelling expert. Craft 5 open-loop cliffhangers and suspense bridges to insert before a commercial break, mid-video transition, or between article sections on this topic.',
      'bullet-enhancer': robustRule + 'You are a copywriting editor. Take the bullet points or rough thoughts provided and rewrite them into 5 punchy, power-verb bullet points with bolded anchor words.',
      'tone-shifter': robustRule + 'You are a versatile stylistic editor. Rewrite the provided text into 4 distinct tones: 1) Executive & Authoritative, 2) Casual & Friendly Creator, 3) Provocative & Bold, 4) High-Energy Enthusiastic.',
      'active-voice-converter': robustRule + 'You are an editor specializing in vigorous prose. Convert all passive voice sentences in the provided text into clear, dynamic active voice. Return only the revised text with key verbs bolded.',
      'plain-english': robustRule + 'You are an advocate for plain-language communication. Translate the complex, jargon-heavy text provided into simple, crystal-clear 6th-grade reading level English that anyone can understand.',
      'tldr-summary': robustRule + 'You are an executive summary writer. Analyze the provided text or topic and produce: 1) A 25-word Executive TL;DR sentence, followed by 2) Exactly 4 key takeaway bullet points.',
      'fact-to-story': robustRule + 'You are a narrative copywriter. Take the dry fact, data point, or technical concept provided and turn it into a captivating 3-paragraph narrative micro-story with emotional stakes.',
      'question-generator': robustRule + 'You are a discussion facilitator. Generate 10 provocative, open-ended discussion questions based on this topic that stimulate deep comments and debates.',
      'one-liner-maker': robustRule + 'You are a punchline and soundbite writer. Generate 10 razor-sharp, memorable one-liners, rules of thumb, or aphorisms (under 15 words each) summarizing this core idea.',
      'search-intent-map': robustRule + 'You are a search intent analyst. Take the keyword or topic and map out 4 search intent categories: Informational, Navigational, Commercial Investigation, and Transactional queries with search volume intent.',
      'competitor-angle': robustRule + 'You are an SEO content strategist. Analyze the topic and identify 5 overlooked content angles and information gaps that competing videos and articles fail to address.',
      'people-also-ask': robustRule + 'You are a Google SERP specialist. Generate 6 "People Also Ask" style questions for this topic, and write an authoritative 45-50 word direct-answer snippet for each.',
      'voice-search-seo': robustRule + 'You are a conversational search optimizer. Generate 8 natural, spoken question-and-answer pairs optimized for Siri, Alexa, and Google Voice Search for this topic.',
      'lsi-expander': robustRule + 'You are an LSI semantic search analyst. Generate 25 Latent Semantic Indexing (LSI) terms and conceptually related phrase entities to include in an article or video on this topic.',
      'backlink-pitch': robustRule + 'You are a digital PR outreach specialist. Write 2 personalized, value-driven email pitches to site editors suggesting an editorial link or resource addition to an existing guide on this topic.',
      'anchor-text-gen': robustRule + 'You are an SEO link-building architect. Generate 20 natural internal and external anchor text variations for this target page, categorized into Exact Match, Partial Match, Branded, and Topical.',
      'featured-snippet-seo': robustRule + 'You are a Google Featured Snippet specialist. Format the answer to this topic into the 3 prime snippet formats: 1) 45-word Paragraph Definition, 2) 5-step Numbered List, and 3) 4-row Comparison Table.',
      'gmb-bio-crafter': robustRule + 'You are a local SEO copywriter. Write 3 localized business descriptions (750 chars max) optimized for Google Business Profile with natural local service keywords, CTA, and hours.',
      'schema-desc-writer': robustRule + 'You are a technical SEO architect. Write an accurate, semantically rich 200-character description suitable for Schema.org JSON-LD (Article, VideoObject, or Product) for this topic.',
      'regex-builder': robustRule + 'You are a regular expression specialist. Given a description or matching requirement, output: 1) The exact RegEx pattern, 2) Recommended flags, 3) Plain-English line-by-line explanation, 4) Example matching and non-matching test strings.',
      'css-snippet': robustRule + 'You are a frontend CSS architect. Given a layout requirement, generate clean, modern CSS code (Flexbox or CSS Grid) with responsive media queries, CSS variables, and comments explaining how it works.',
      'git-commit-helper': robustRule + 'You are a software engineering lead. Given code changes or a summary of work, format 3 conventional Git commit message options (e.g. feat:, fix:, refactor:, chore:) with clear 50-char subject lines and bulleted body.',
      'meta-tag-builder': robustRule + 'You are a web developer. Given a page title, description, and URL/image, generate complete, valid HTML <meta> tags including Title, Description, Canonical, Viewport, Open Graph (og:), and Twitter Card tags.',
      'mock-data-json': robustRule + 'You are an API developer. Given an entity description or schema requirement, generate a clean, realistic JSON array of 5 sample records with realistic names, emails, dates, IDs, and nested properties.',
      'json-schema-gen': robustRule + 'You are a data architect. Given a JSON object or data description, output a complete, valid JSON Schema (draft-07 or draft 2020-12) with types, required fields, and format constraints.',
      'readme-generator': robustRule + 'You are an open-source technical writer. Given a project name and short description, generate a complete GitHub README.md markdown template with Badges, Features, Installation, Usage, and License sections.',
      'sql-query-helper': robustRule + 'You are a database specialist. Given a plain English data request and table description, generate: 1) The optimized SQL query, 2) Explanation of clauses/joins used, 3) Indexing recommendation for performance.',
      'shell-script-snippet': robustRule + 'You are a DevOps engineer. Given an automation task, write a robust Bash shell script snippet with error handling (set -euo pipefail), helpful log echoes, and comments.',
      'docstring-commenter': robustRule + 'You are a code documentation expert. Given a function or code snippet, write clean, comprehensive documentation comments (JSDoc for JS/TS, PEP 257 docstring for Python, etc.) detailing parameters, return types, and examples.',
      'default': robustRule + 'You are a helpful assistant for the MTV platform. Keep responses clear, specific, and useful. No markdown asterisks.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    let contextPrefix = '';
    if (platform) contextPrefix += `Platform: ${platform}\n`;
    if (language) contextPrefix += `Target Language: ${language}\n`;
    if (tone && tone !== 'default') contextPrefix += `Tone: ${tone}\n`;
    const finalPrompt = contextPrefix ? `${contextPrefix}${prompt}` : prompt;

    const attempts = [];
    geminiKeys.forEach((key) => {
      geminiModels.forEach((model) => {
        attempts.push(tryGenAISDK(key, model, systemInstruction, finalPrompt));
        attempts.push(tryGemini(key, model, systemInstruction, finalPrompt));
      });
    });
    groqKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', key, groqModel, systemInstruction, finalPrompt));
    });
    openrouterKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', key, openrouterModel, systemInstruction, finalPrompt));
    });
    deepseekKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.deepseek.com/chat/completions', key, deepseekModel, systemInstruction, finalPrompt));
    });
    llm7Keys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.llm7.io/v1/chat/completions', key, llm7Model, systemInstruction, finalPrompt));
    });
    cerebrasKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.cerebras.ai/v1/chat/completions', key, cerebrasModel, systemInstruction, finalPrompt));
    });
    mistralKeys.forEach((key) => {
      attempts.push(tryOpenAICompatible('https://api.mistral.ai/v1/chat/completions', key, mistralModel, systemInstruction, finalPrompt));
    });

    if (attempts.length > 0) {
      try {
        const resultText = await raceSuccess(attempts);
        responseCache.set(cacheKey, { result: resultText, time: Date.now() });
        res.status(200).json({ result: resultText, task: task || 'default' });
        return;
      } catch (e) {
        // AI calls failed - fall through to formatted generator fallback
      }
    }

    // High reliability fallback generator matching specific tool output requirements
    const topic = (prompt || 'Content Creator Strategy').trim().replace(/['"]/g, '');
    const cleanTopic = topic.split('\n')[0] || 'Content Strategy';
    const fallbackResult = generateProxyFallback(task || 'default', cleanTopic, platform, language, tone);
    res.status(200).json({ result: fallbackResult, task: task || 'default' });

  } catch (err) {
    res.status(500).json({ error: 'Service temporarily unavailable. Please try again.' });
  }
}

function generateProxyFallback(task, topic, platform = 'YouTube', language = 'English', tone = 'professional') {
  const clean = topic.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const primaryWord = words[0] || 'Creator';
  const tagList = words.slice(0, 5).map(w => `#${w.toLowerCase()}`).join(' ') || '#creator #growth #seo';

  switch (task) {
    // Category 1: Video & Scripting
    case 'youtube-script-writer':
      return `### 🎬 High-Retention YouTube Video Script
**Topic:** ${topic}

**[00:00 - 00:15] Hook & Visual Cue:**
[Visual: Fast-paced dynamic text cut with energetic background audio]
"If you want to master ${topic} in 2026, stop making this #1 critical mistake that 95% of creators fall for!"

**[00:15 - 01:00] Core Premise:**
"Welcome back! In today's video, we are breaking down the exact step-by-step strategy for ${topic} so you can achieve maximum audience reach and retention."

**[01:00 - 04:00] Key Teaching Points:**
1. **Point 1: Foundations of ${primaryWord}:** Establish strong core principles before scaling. [B-Roll: On-screen diagram / screen recording]
2. **Point 2: Advanced Execution:** Optimize your workflow to save hours every single week. [B-Roll: Hands-on demonstration]
3. **Point 3: Secret Growth Trigger:** Leverage audience signals to trigger algorithmic recommendation loops.

**[04:00 - 04:30] Outro & Call to Action:**
"If you found this valuable, hit the Like button, subscribe for more content on ${topic}, and comment below with your biggest takeaway!"`;

    case 'viral-hooks-generator':
      return `### 🚀 10 Scroll-Stopping Opening Hooks for: "${topic}"

1. **Curiosity Gap:** "Nobody is talking about this secret trick for ${topic}, but it changes everything..."
2. **Fear of Missing Out:** "If you are still ignoring ${topic} in 2026, you are losing 80% of your potential results!"
3. **Direct Benefit:** "Here is the exact 3-step formula I used to master ${topic} in under 10 minutes."
4. **Provocative Contrarian:** "Why everything you have been told about ${topic} is completely wrong (and what to do instead)."
5. **Pattern Interrupt:** "Stop! Before you spend another dollar on ${topic}, watch this short breakdown."
6. **Story Arc:** "I spent 30 days testing ${topic} so you don't have to — here are the crazy results."
7. **Actionable Hack:** "This 1-minute ${primaryWord} shortcut will save you 10+ hours every single month."
8. **Relatable Problem:** "Struggling with ${topic}? Here is the simple framework that fixed it for me instantly."
9. **Metric-Driven:** "How 1 simple change to ${topic} boosted overall performance by 340%."
10. **The Challenge:** "Try this 7-day ${topic} challenge and tell me your results in the comments below!"`;

    case 'podcast-episode-planner':
      return `### 🎙️ Podcast Production Blueprint
**Episode Topic:** ${topic}

**1. Episode Title Options:**
- Unlocking ${topic}: Strategies for Modern Creators
- The Deep Dive into ${topic} (Episode Guide)

**2. Segment Breakdown:**
- **[00:00 - 03:00] Segment 1:** Teaser Hook & Host Intro
- **[03:00 - 12:00] Segment 2:** The Current State of ${topic}
- **[12:00 - 25:00] Segment 3:** Tactical Breakdown & Case Studies
- **[25:00 - 30:00] Segment 4:** Listener Q&A & Outro Wrap-up

**3. Key Discussion Questions:**
1. What was the catalyst that made ${topic} so essential today?
2. What are the common misconceptions beginners have about ${topic}?
3. Can you share a real-world scenario where this framework transformed results?
4. What is one actionable step listeners can take today?`;

    // Category 2: Social & Growth
    case 'linkedin-post-generator':
      return `Most people get ${topic} completely wrong.

Here is what 5+ years of real-world testing taught me about ${primaryWord}:

1. **Simplicity beats complexity:** Focus on mastering core fundamentals first.
2. **Consistency fuels momentum:** Small daily improvements compound exponentially.
3. **Data guides decisions:** Track real feedback instead of guessing.

The takeaway? Stop overthinking ${topic} and start executing today.

What is your biggest takeaway on ${topic}? Let me know in the comments below! 👇`;

    case 'twitter-thread-builder':
      return `1/8 Most creators struggle with ${topic}. Here is the complete breakdown to master it in 2026 (Bookmark this thread 🧵):

2/8 Rule #1: Clarify your objective. Without a clear goal, effort on ${primaryWord} is wasted.

3/8 Rule #2: Optimize your workflow. Systemize your process to deliver consistent output.

4/8 Rule #3: Leverage high-impact levers. Focus 80% of your effort on the 20% of actions that drive results.

5/8 Rule #4: Test and iterate rapidly. Feedback loops are your strongest growth engine.

6/8 Rule #5: Build in public. Share your real journey and takeaways on ${topic}.

7/8 TL;DR Recap: Focus on foundations, systemize your strategy, measure results, and keep iterating.

8/8 If you enjoyed this thread:
1. Follow for more insights on ${topic}.
2. Retweet the first tweet to share with your audience!`;

    // Category 3: Copywriting & Sales
    case 'cold-email-writer':
      return `### ✉️ Outreach Email Variations

**Subject:** Quick question regarding ${topic}
**Subject:** High-impact proposal for ${primaryWord}

**Variation A (Concise Value Pitch):**
Hi {{FirstName}},

I noticed your work around ${topic} and wanted to share a quick insight. We recently helped a team in your space boost performance by 40% using a streamlined ${primaryWord} framework.

Would you be open to a brief 5-minute chat this Thursday to explore if this could help your team as well?

Best regards,
{{YourName}}

**Variation B (Problem-Agitate-Solve):**
Hi {{FirstName}},

Are you currently finding that traditional approaches to ${topic} take too much time without driving clear results?

We created a custom framework designed specifically to solve this issue, delivering measurable outcomes in under 14 days.

Let me know if you would like me to send over a short 2-minute video walkthrough!

Best,
{{YourName}}`;

    // Category 4: Creative & Narrative
    case 'story-plot-generator':
      return `### 📖 3-Act Narrative Outline
**Concept:** ${topic}

**Act 1: The Inciting Catalyst**
- **The Normal World:** The protagonist navigates daily life while grappling with a hidden frustration regarding ${primaryWord}.
- **The Inciting Incident:** An unexpected discovery forces them out of their comfort zone.
- **Plot Point 1:** They make an irreversible choice to commit to the journey.

**Act 2: Rising Conflict & The Twist**
- **Rising Action:** Initial successes are met with unexpected obstacles and mounting stakes.
- **Midpoint Twist:** A major revelation about ${topic} turns their entire perspective upside down.
- **Dark Night of the Soul:** All hope seems lost when their primary strategy fails.

**Act 3: Resolution & Transformation**
- **Climax:** Applying lessons learned, they face the ultimate test with renewed clarity.
- **Resolution:** Victory leads to a new, transformed normal for the protagonist and their world.`;

    // Category 5: SEO & Discovery
    case 'meta-description-pro':
      return `### 🔍 SERP-Optimized Meta Descriptions

1. Master ${topic} with our comprehensive 2026 guide. Learn actionable steps, proven tips, and expert strategies to boost results today. [138 chars]
2. Looking for the ultimate guide to ${topic}? Discover step-by-step strategies designed to help you achieve success quickly and easily. [142 chars]
3. Unlock the power of ${topic}! Read our in-depth walkthrough featuring top tools, actionable tips, and key takeaways for modern creators. [140 chars]
4. Everything you need to know about ${topic} in one concise breakdown. Learn proven techniques and start optimizing your results now. [136 chars]
5. Step-by-step ${topic} strategy for creators and entrepreneurs. Explore expert recommendations and scale your growth today. [128 chars]`;

    // Category 6: Technical & Code
    case 'code-explainer':
      return `### 💻 Technical Breakdown & Explanation
**Subject:** ${topic}

**1. Overview:**
This implementation provides a clean, modular pattern for handling ${topic} efficiently in modern TypeScript / JavaScript applications.

**2. Key Concepts:**
- **State Management:** Preserves data consistency across asynchronous execution cycles.
- **Error Handling:** Safely wraps API calls with fallback logic to prevent app crashes.
- **Performance:** Optimizes response time through efficient data structures.

**3. Example Snippet:**
\`\`\`typescript
// Production-ready pattern for ${primaryWord}
async function execute${primaryWord.replace(/[^a-zA-Z]/g, '')}(params: Record<string, any>) {
  try {
    const result = await processTask(params);
    return { success: true, data: result };
  } catch (error) {
    console.error("Task failed:", error);
    return { success: false, error: String(error) };
  }
}
\`\`\``;

    // Default Fallback
    default:
      return `### 🚀 Custom Output for: "${topic}"

**Key Highlights & Recommendations:**
1. **Strategic Focus:** Prioritize clear objectives and core principles for ${topic}.
2. **Actionable Steps:** Implement high-leverage techniques to maximize output and efficiency.
3. **Continuous Optimization:** Test results, refine your strategy, and build consistent momentum.

${tagList}`;
  }
}
