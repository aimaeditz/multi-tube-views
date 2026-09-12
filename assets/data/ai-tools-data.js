/**
 * Multi Tube Views (MTV) — 60 AI Tools Data Directory
 * Structured metadata for 60 dedicated AI generative tools across 6 core categories.
 */

export const AI_CATEGORIES = [
  { id: 'all', name: 'All Tools', count: 60 },
  { id: 'video', name: 'Video & Scripting', count: 10 },
  { id: 'social', name: 'Social & Growth', count: 10 },
  { id: 'copywriting', name: 'Copywriting & Sales', count: 10 },
  { id: 'creative', name: 'Creative & Narrative', count: 10 },
  { id: 'seo', name: 'SEO & Discovery', count: 10 },
  { id: 'technical', name: 'Technical & Code', count: 10 }
];

export const AI_TOOLS_DATA = {
  // Category 1: Video & Scripting (10)
  'youtube-script-writer': {
    title: 'YouTube Script Writer',
    desc: 'Full-length video script with hooks, pacing, and visual cues',
    icon: '🎬',
    category: 'video',
    placeholder: 'Enter video topic, target duration, and key points (e.g. How to Build an AI Startup in 2026, 10 min)',
    label: 'Video Topic, Duration & Key Points',
    promptTemplate: 'Write a full-length, highly engaging YouTube video script about: {topic}. Include an attention-grabbing hook, clear chapter breakdowns, pacing notes, visual cue prompts, and a strong call-to-action.'
  },
  'viral-hooks-generator': {
    title: 'Viral Hooks Generator',
    desc: 'Scroll-stopping 3-second opening lines for Shorts & Reels',
    icon: '🪝',
    category: 'video',
    placeholder: 'Enter video theme or topic (e.g. Secret Productivity Hacks for Remote Workers)',
    label: 'Video Theme / Main Concept',
    promptTemplate: 'Generate 12 high-converting, scroll-stopping viral hook opening lines for short-form video on: {topic}. Group by hook archetype (curiosity gap, controversial statement, immediate value, storytelling).'
  },
  'podcast-episode-planner': {
    title: 'Podcast Episode Planner',
    desc: 'Comprehensive episode outlines, segment timings & questions',
    icon: '🎙️',
    category: 'video',
    placeholder: 'Enter podcast topic, guest name/niche, and episode goals (e.g. Future of Quantum Computing with Dr. Vance)',
    label: 'Podcast Topic & Guest Details',
    promptTemplate: 'Create a comprehensive podcast episode blueprint for: {topic}. Include episode title ideas, cold open hook, 4 structured segment blocks with timestamps, 8 insightful interview questions, and a memorable sign-off.'
  },
  'voiceover-script-generator': {
    title: 'Voiceover Script Generator',
    desc: 'Natural, human-sounding narration with speech cadence cues',
    icon: '🗣️',
    category: 'video',
    placeholder: 'Enter script subject, target tone, and word count (e.g. 60-second product launch video narration for an eco-friendly water bottle)',
    label: 'Voiceover Subject & Desired Tone',
    promptTemplate: 'Write a professional, human-sounding voiceover narration script for: {topic}. Include pronunciation keys, pause markers [PAUSE], emphasis cues [EMPHASIS], and vocal tone direction.'
  },
  'video-title-brainstormer': {
    title: 'Video Title Brainstormer',
    desc: 'Psychological, curiosity-driven YouTube titles for high CTR',
    icon: '💡',
    category: 'video',
    placeholder: 'Enter core video idea or draft title (e.g. I Spent 30 Days Learning 3D Animation in Blender)',
    label: 'Video Idea / Draft Title',
    promptTemplate: 'Brainstorm 20 high-CTR, psychological YouTube video titles for: {topic}. Categorize by emotional driver (curiosity, FOMO, extreme challenge, transformation, negative framing).'
  },
  'storyboard-visual-prompts': {
    title: 'Storyboard Visual Prompts',
    desc: 'Scene-by-scene visual descriptions and camera angle guides',
    icon: '🖼️',
    category: 'video',
    placeholder: 'Enter video concept or narrative outline (e.g. A developer building a project at midnight in a cyberpunk city)',
    label: 'Narrative or Concept Outline',
    promptTemplate: 'Generate a detailed 6-scene storyboard breakdown for: {topic}. For each scene specify shot type, camera angle, subject action, lighting setup, and generative image prompt description.'
  },
  'youtube-shorts-script': {
    title: 'Shorts & Reels Script',
    desc: '30-60 second rapid-fire scripts optimized for retention',
    icon: '⚡',
    category: 'video',
    placeholder: 'Enter quick topic or tip (e.g. 3 Hidden iPhone Features Nobody Uses)',
    label: 'Shorts / Reels Topic or Quick Tip',
    promptTemplate: 'Write a high-retention 45-second script for YouTube Shorts / Instagram Reels about: {topic}. Format into Hook (0-3s), Core Value / Twist (3-35s), Climax (35-40s), and Looping Outro (40-45s).'
  },
  'interview-question-creator': {
    title: 'Interview Question Creator',
    desc: 'Deep, non-cliché interview questions that elicit golden soundbites',
    icon: '❓',
    category: 'video',
    placeholder: 'Enter interviewee profession, background, and interview subject (e.g. Senior Game Designer on Indie vs AAA Development)',
    label: 'Interviewee Profile & Subject',
    promptTemplate: 'Develop 15 insightful, non-generic interview questions for: {topic}. Include icebreakers, thought-provoking technical/industry inquiries, vulnerable failure/lesson questions, and rapid-fire finishers.'
  },
  'video-cta-generator': {
    title: 'Video CTA Generator',
    desc: 'Seamless mid-roll and end-screen call-to-action scripts',
    icon: '🎯',
    category: 'video',
    placeholder: 'Enter your offer, channel goal, or lead magnet (e.g. Free Notion Template download in description)',
    label: 'Offer, Lead Magnet, or Channel Action',
    promptTemplate: 'Craft 8 smooth, natural Call-to-Action (CTA) scripts for a video promoting: {topic}. Provide 3 subtle mid-roll transitions, 3 high-urgency end screen pitches, and 2 pinned comment copy formulas.'
  },
  'b-roll-shot-list': {
    title: 'B-Roll Shot List',
    desc: 'Cinematic supplemental footage shot list to elevate production',
    icon: '🎥',
    category: 'video',
    placeholder: 'Enter video style and scene settings (e.g. Morning Routine / Day in the Life of a Solopreneur in a modern studio)',
    label: 'Video Context & Location Setting',
    promptTemplate: 'Generate a comprehensive cinematic B-Roll shot list for: {topic}. Group by location/lighting, specifying focal length, movement (pan, tilt, orbit, slider), speed (24fps vs 120fps slow-mo), and narrative purpose.'
  },

  // Category 2: Social Media & Growth (10)
  'linkedin-post-generator': {
    title: 'LinkedIn Post Generator',
    desc: 'High-engagement thought leadership posts with formatting',
    icon: '💼',
    category: 'social',
    placeholder: 'Enter lesson learned, career story, or industry insight (e.g. What 5 years of freelancing taught me about pricing)',
    label: 'Career Story, Insight, or Industry Lesson',
    promptTemplate: 'Write an engaging, high-reach LinkedIn post about: {topic}. Use crisp single-line sentence hooks, ample whitespace, bulleted lessons, and an open question that sparks comments.'
  },
  'twitter-thread-builder': {
    title: 'Twitter/X Thread Builder',
    desc: 'Multi-tweet viral thread sequences with hook and recap',
    icon: '🧵',
    category: 'social',
    placeholder: 'Enter master guide or breakdown topic (e.g. 10 Mental Models for Better Decision Making)',
    label: 'Thread Topic / Deep-Dive Subject',
    promptTemplate: 'Create an 8-tweet viral thread on: {topic}. Include a gripping Tweet 1 (hook), 6 actionable value tweets with crisp formatting, and a final summary tweet with retweet/follow CTA.'
  },
  'instagram-caption-writer': {
    title: 'Instagram Caption Writer',
    desc: 'Aesthetic, storytelling, and high-save captions with hashtags',
    icon: '📸',
    category: 'social',
    placeholder: 'Enter photo/carousel subject and vibe (e.g. Cozy coffee shop desk setup, discussing digital minimalism)',
    label: 'Post Visual & Vibe Description',
    promptTemplate: 'Write 3 contrasting Instagram caption options (Storytelling, Minimalist, Educational) for: {topic}. Include aesthetic emojis, spacing, line breaks, and a curated set of 15 targeted hashtags.'
  },
  'tiktok-trend-adapter': {
    title: 'TikTok Trend Adapter',
    desc: 'Adapt popular viral TikTok meme formats to your specific niche',
    icon: '🎵',
    category: 'social',
    placeholder: 'Enter your niche and desired format (e.g. Real Estate agent adapting relatable POV / expectations vs reality trends)',
    label: 'Your Niche & Audience',
    promptTemplate: 'Outline 5 viral TikTok video concepts adapting current trending formats and audio styles to the niche: {topic}. Include text overlay, acting cues, audio sound vibe, and caption.'
  },
  'content-repurposing-matrix': {
    title: 'Repurposing Matrix',
    desc: 'Turn 1 core idea into 8 distinct multi-platform assets',
    icon: '🔄',
    category: 'social',
    placeholder: 'Enter one long-form topic, article, or video concept (e.g. Why Remote Work is Reshaping Urban Economics)',
    label: 'Core Piece of Content / Subject',
    promptTemplate: 'Build a comprehensive content repurposing matrix for: {topic}. Break it down into: 1 LinkedIn post, 1 Twitter thread, 2 Short video concepts, 1 Newsletter section, 1 Infographic bullet list, and 2 Discussion poll ideas.'
  },
  'community-poll-creator': {
    title: 'Community Poll Creator',
    desc: 'Viral poll questions and options for YouTube, LinkedIn & X',
    icon: '📊',
    category: 'social',
    placeholder: 'Enter industry debate or controversial question area (e.g. React vs Vue vs Svelte for solo developers in 2026)',
    label: 'Debate Topic or Poll Subject',
    promptTemplate: 'Create 5 engaging community poll posts for YouTube Community, LinkedIn, and Twitter on: {topic}. Provide a hook question, 4 balanced poll answer choices, and a caption designed to provoke comment debate.'
  },
  'viral-tweet-generator': {
    title: 'Viral Tweet Generator',
    desc: 'Punchy one-liners, contrarian takes, and quote-worthy tweets',
    icon: '🐦',
    category: 'social',
    placeholder: 'Enter niche or belief (e.g. Modern web design is becoming too boring and homogenous)',
    label: 'Core Belief, Observation, or Topic',
    promptTemplate: 'Generate 15 punchy, standalone viral tweets on: {topic}. Use proven formats: contrarian observation, short lists, rule of three, witty one-liners, and inspirational reframes.'
  },
  'social-bio-optimizer': {
    title: 'Social Bio Optimizer',
    desc: 'Compelling 150-character profile bios with authority and CTA',
    icon: '👤',
    category: 'social',
    placeholder: 'Enter your role, target audience, and primary link offer (e.g. UI/UX Designer helping SaaS founders scale conversions)',
    label: 'Your Identity, Audience, & Value Proposition',
    promptTemplate: 'Craft 6 distinct, high-converting social bio options (for X, Instagram, and LinkedIn) for: {topic}. Focus on who you help, how you help them, social proof, and a clear call-to-action link.'
  },
  'carousel-slide-planner': {
    title: 'Carousel Slide Planner',
    desc: '10-slide visual sequence for Instagram and LinkedIn PDF carousels',
    icon: '📑',
    category: 'social',
    placeholder: 'Enter step-by-step tutorial or guide (e.g. How to Audit Your Website SEO in 10 Minutes)',
    label: 'Guide Topic or Step-by-Step Lesson',
    promptTemplate: 'Design a 10-slide visual carousel outline for: {topic}. For each slide, write the bold headline, bite-sized body copy (under 30 words), visual design instruction, and swipe prompt.'
  },
  'audience-engagement-replies': {
    title: 'Audience Reply Generator',
    desc: 'Thoughtful, authority-building responses to comments and mentions',
    icon: '💬',
    category: 'social',
    placeholder: 'Paste audience comment or question (e.g. "Do you think AI will replace junior frontend engineers in 3 years?")',
    label: 'Audience Comment / Question to Answer',
    promptTemplate: 'Generate 4 thoughtful, engaging response options to this audience comment: {topic}. Include a friendly supportive reply, a detailed expert breakdown, a conversational question-turner, and a concise witty acknowledgment.'
  },

  // Category 3: Copywriting & Sales (10)
  'cold-email-writer': {
    title: 'Cold Email Writer',
    desc: 'High-converting B2B outreach emails with personalized hooks',
    icon: '✉️',
    category: 'copywriting',
    placeholder: 'Enter prospect type, your service/product, and unique benefit (e.g. Reaching out to Shopify store owners about site speed optimization)',
    label: 'Prospect Profile & Your Offer',
    promptTemplate: 'Write 3 high-converting cold email sequences for: {topic}. Keep under 120 words each. Structure with a personalized icebreaker hook, specific pain point, concise value pitch, and low-friction soft CTA.'
  },
  'landing-page-copy': {
    title: 'Landing Page Copywriter',
    desc: 'Complete high-conversion landing page headlines, benefits & CTAs',
    icon: '🚀',
    category: 'copywriting',
    placeholder: 'Enter your product/service name, target user, and core solution (e.g. PulseFlow, an automated client onboarding portal for agencies)',
    label: 'Product / SaaS Concept & Core Benefit',
    promptTemplate: 'Write full landing page copy for: {topic}. Include Hero Section (Headline, Subhead, CTA, Social Proof chip), 3 Problem/Agitation cards, 3 Feature/Benefit blocks, FAQ section, and Final CTA banner.'
  },
  'ad-copy-generator': {
    title: 'Ad Copy Generator',
    desc: 'Multi-platform ad copy for Meta (FB/IG), Google Search & TikTok',
    icon: '📢',
    category: 'copywriting',
    placeholder: 'Enter product, key discount/offer, and target customer (e.g. Ergonomic lumbar cushion for remote developers, 20% off spring sale)',
    label: 'Product, Offer Details & Target Audience',
    promptTemplate: 'Generate high-performing ad copy for: {topic}. Provide 2 Meta Ads (Primary Text, Headline, Description), 3 Google Search Ads (Headlines + Descriptions under character limits), and 2 TikTok Ad hook scripts.'
  },
  'sales-page-generator': {
    title: 'Sales Letter / Page Copy',
    desc: 'Direct-response sales letter using proven PAS and AIDA frameworks',
    icon: '💰',
    category: 'copywriting',
    placeholder: 'Enter course, eBook, or service offer (e.g. Masterclass on Freelance Design Client Acquisition)',
    label: 'Offer Details, Pricing & Transformation',
    promptTemplate: 'Write a persuasive direct-response sales letter section for: {topic}. Follow the PAS (Problem-Agitate-Solution) framework: expose the frustration, intensify the cost of inaction, introduce the offer, and provide irresistible guarantees.'
  },
  'value-proposition-builder': {
    title: 'Value Proposition Builder',
    desc: 'Crystal-clear 1-sentence value propositions and positioning lines',
    icon: '🎯',
    category: 'copywriting',
    placeholder: 'Enter what you do, for whom, and what makes you different (e.g. Cloud video compression API that renders 5x faster than AWS MediaConvert)',
    label: 'Product Capabilities & Target Audience',
    promptTemplate: 'Craft 8 distinct Value Proposition statements for: {topic}. Include the Steve Blank formulation ("We help X do Y by Z"), positioning matrix formulas, and punchy tagline variations.'
  },
  'brand-voice-guide': {
    title: 'Brand Voice Guide',
    desc: 'Define tone pillars, vocabulary rules, and communication guardrails',
    icon: '💎',
    category: 'copywriting',
    placeholder: 'Enter company niche, brand personality adjectives (e.g. Modern fintech app for Gen Z: bold, witty, transparent, non-corporate)',
    label: 'Brand Concept & Personality Traits',
    promptTemplate: 'Develop a comprehensive Brand Voice & Tone Guideline for: {topic}. Detail 4 Core Tone Pillars (e.g. "Confident, but never arrogant"), vocabulary words to use vs ban, and sample customer communication examples.'
  },
  'testimonial-polisher': {
    title: 'Testimonial Polisher',
    desc: 'Shape messy client feedback into punchy, high-impact case study quotes',
    icon: '⭐',
    category: 'copywriting',
    placeholder: 'Paste raw, unedited client feedback (e.g. "We really liked working with Sarah, she delivered on time and our traffic went up like 40% in two months which was awesome")',
    label: 'Raw Client Feedback / Review Text',
    promptTemplate: 'Transform this raw client feedback into 3 polished, persuasive testimonial variations (Short Pull Quote, Problem-Outcome Mini-Story, Highlight Badge): {topic}. Maintain genuine voice while amplifying metrics and credibility.'
  },
  'newsletter-curator': {
    title: 'Newsletter Issue Writer',
    desc: 'Engaging email newsletter issues with intro story, links & takeaways',
    icon: '📰',
    category: 'copywriting',
    placeholder: 'Enter newsletter theme, 3 main links or ideas to cover (e.g. Issue on AI video generators: Sora updates, Runway gen-3 workflows, and copyright debate)',
    label: 'Newsletter Theme & Core Points',
    promptTemplate: 'Write an engaging, high-open-rate newsletter issue on: {topic}. Include 3 curiosity-inducing subject line options, preview text, personal conversational intro, 3 curated item breakdowns with commentary, and a closing thought.'
  },
  'call-to-action-engine': {
    title: 'Call-to-Action Engine',
    desc: 'Action-oriented button text and microcopy that lifts conversion',
    icon: '🔥',
    category: 'copywriting',
    placeholder: 'Enter what the user gets when clicking (e.g. Start a 14-day free trial of project management software without a credit card)',
    label: 'User Action & Desired Outcome',
    promptTemplate: 'Generate 20 high-conversion Call-to-Action (CTA) button copy options and supporting microcopy for: {topic}. Group by urgency, value-first, risk-reversal, and curiosity.'
  },
  'product-hunt-launch-copy': {
    title: 'Product Hunt Launch Copy',
    desc: 'Tagline, Maker Comment, and gallery captions for Product Hunt launches',
    icon: '🐱',
    category: 'copywriting',
    placeholder: 'Enter product name, core features, origin story, and launch offer (e.g. MockFlow: Instant 3D device mockups in your browser for designers)',
    label: 'Product Details, Features, & Origin Story',
    promptTemplate: 'Create the complete Product Hunt launch copy kit for: {topic}. Include: Catchy Tagline (under 60 chars), First Maker Comment (story, why we built it, special offer), and 5 gallery screenshot captions.'
  },

  // Category 4: Creative & Narrative (10)
  'story-plot-generator': {
    title: 'Story Plot Generator',
    desc: 'Multi-act narrative structures, character stakes & plot twists',
    icon: '📖',
    category: 'creative',
    placeholder: 'Enter genre, protagonist concept, and central conflict (e.g. Sci-Fi noir detective investigating the disappearance of the city\'s last organic tree)',
    label: 'Genre, Protagonist & Conflict Premise',
    promptTemplate: 'Generate a rich, multi-act story plot outline for: {topic}. Structure with Act 1 (Inciting Incident & Status Quo), Act 2 (Rising Stakes, Midpoint Twist & Dark Night of the Soul), and Act 3 (Climax & Resolution).'
  },
  'character-backstory-creator': {
    title: 'Character Backstory Creator',
    desc: 'Deep character dossiers with flaws, motivations, and internal conflict',
    icon: '🎭',
    category: 'creative',
    placeholder: 'Enter character name, archetype, and world setting (e.g. Evelyn Reed, a disgraced clockmaker in a Victorian steampunk city with a secret automaton child)',
    label: 'Character Concept & Setting',
    promptTemplate: 'Create a comprehensive character dossier for: {topic}. Detail physical appearance, defining personality contradiction, formative childhood trauma/event, core desire vs core lie they believe, and iconic habits.'
  },
  'world-building-architect': {
    title: 'World-Building Architect',
    desc: 'Societies, magic/tech systems, geography, factions & lore',
    icon: '🌍',
    category: 'creative',
    placeholder: 'Enter world concept or unique law of nature (e.g. A fantasy realm where memories are physical crystals used as currency and fuel)',
    label: 'World Premise or Foundational Rule',
    promptTemplate: 'Flesh out an immersive fictional world based on: {topic}. Cover: The Foundational Rule/System, Daily Life of Common Citizens, Major Factions in Conflict, Taboos and Cultural Rituals, and 3 Ancient Mysteries.'
  },
  'metaphor-analogy-crafter': {
    title: 'Metaphor & Analogy Crafter',
    desc: 'Vivid, memorable literary metaphors for complex concepts',
    icon: '🔮',
    category: 'creative',
    placeholder: 'Enter complex idea or emotional feeling (e.g. Explaining how distributed ledger technology works, or the feeling of nostalgia for a childhood summer)',
    label: 'Complex Idea or Emotion to Illustrate',
    promptTemplate: 'Craft 10 vivid, evocative metaphors and analogies explaining: {topic}. Provide a mix of visual, sensory, narrative, and mechanical analogies suitable for essays, speeches, and creative fiction.'
  },
  'poetry-lyrics-generator': {
    title: 'Poetry & Song Lyrics Generator',
    desc: 'Rhythmic stanzas, evocative rhyming schemes, and verse-chorus layouts',
    icon: '🎶',
    category: 'creative',
    placeholder: 'Enter theme, music genre, or poetic meter (e.g. Indie-folk song about moving away from a coastal hometown)',
    label: 'Theme, Musical Style, or Poetic Form',
    promptTemplate: 'Write rich, evocative poetry or song lyrics about: {topic}. If song lyrics: structure into Verse 1, Pre-Chorus, Chorus, Verse 2, Chorus, Bridge, and Outro with rhythm cues.'
  },
  'dialogue-doctor': {
    title: 'Dialogue Doctor',
    desc: 'Punch up flat dialogue with subtext, distinctive voices & pacing',
    icon: '💬',
    category: 'creative',
    placeholder: 'Paste draft dialogue between two characters with their conflicting goals (e.g. John wants to borrow money, Sarah knows he lost his job)',
    label: 'Draft Dialogue & Character Intentions',
    promptTemplate: 'Punch up and rewrite this dialogue to infuse subtext, tension, and unique speech patterns: {topic}. Explain what each character is REALLY saying beneath their spoken words.'
  },
  'creative-writing-prompts': {
    title: 'Creative Writing Prompts',
    desc: 'Original, boundary-pushing fiction prompts and first-sentence sparks',
    icon: '✨',
    category: 'creative',
    placeholder: 'Enter genre or mood (e.g. Psychological horror in a remote research station, eerie quiet)',
    label: 'Preferred Genre or Atmospheric Mood',
    promptTemplate: 'Generate 10 original, highly atmospheric creative writing prompts based on: {topic}. For each prompt, provide the opening sentence, the hidden premise, and the ticking clock constraint.'
  },
  'conflict-tension-generator': {
    title: 'Conflict & Tension Generator',
    desc: 'Complications, ticking clocks, and high-stakes moral dilemmas',
    icon: '⚡',
    category: 'creative',
    placeholder: 'Enter current scene scenario (e.g. Two spies trapped in an elevator as the alarm sounds)',
    label: 'Scene Situation & Characters Involved',
    promptTemplate: 'Brainstorm 8 escalations of conflict and psychological tension for this scene: {topic}. Include internal dilemmas, external environmental threats, unexpected revelations, and impossible choices.'
  },
  'genre-fusion-story': {
    title: 'Genre Fusion Concept Lab',
    desc: 'Blend two unexpected genres into a unique storytelling premise',
    icon: '🧪',
    category: 'creative',
    placeholder: 'Enter two contrasting genres (e.g. Regency Romance + Hard Cyberpunk, or Cozy Mystery + Cosmic Lovecraftian Horror)',
    label: 'Two Genres to Blend',
    promptTemplate: 'Design 3 compelling story concepts fusing these genres: {topic}. For each, describe the aesthetic setting, the protagonist archetype, the central villain/threat, and why the hybrid works brilliantly.'
  },
  'hero-journey-outline': {
    title: "Hero's Journey Story Map",
    desc: 'Map any story idea to the classic 12 Campbell/Vogler mythological stages',
    icon: '🗺️',
    category: 'creative',
    placeholder: 'Enter core story idea or character (e.g. A timid archivist who finds a map to an extinguished star)',
    label: 'Core Story Premise & Hero',
    promptTemplate: "Map this story idea across the 12 stages of the Hero's Journey: {topic}. Detail Ordinary World, Call to Adventure, Refusal, Meeting the Mentor, Crossing the Threshold, Tests & Enemies, The Inmost Cave, The Ordeal, The Reward, The Road Back, Resurrection, and Return with the Elixir."
  },

  // Category 5: SEO & Discovery (10)
  'meta-description-pro': {
    title: 'Meta Description Pro',
    desc: 'SERP-optimized meta titles and descriptions adhering to pixel limits',
    icon: '🔍',
    category: 'seo',
    placeholder: 'Enter page topic, primary keyword, and brand name (e.g. Best Ergonomic Office Chairs, primary keyword: ergonomic office chair, Brand: WorkZen)',
    label: 'Page Topic, Primary Keyword, & Brand',
    promptTemplate: 'Generate 5 high-CTR SEO Meta Title (under 60 chars) and Meta Description (under 155 chars) combinations for: {topic}. Include primary keyword placement and strong searcher benefit.'
  },
  'long-tail-keyword-finder': {
    title: 'Long-Tail Keyword Finder',
    desc: 'Low-competition, high-intent long-tail search query ideas',
    icon: '🔑',
    category: 'seo',
    placeholder: 'Enter broad seed keyword (e.g. espresso machine)',
    label: 'Seed Keyword / Industry Topic',
    promptTemplate: 'Generate 25 high-intent long-tail keyword ideas for: {topic}. Categorize into: Transactional (ready to buy), Informational (questions & guides), Commercial Comparison (vs, best of), and Problem-Solving queries.'
  },
  'faq-schema-generator': {
    title: 'FAQ Schema Generator',
    desc: 'Rich FAQ questions, answers, and valid JSON-LD schema markup',
    icon: '📋',
    category: 'seo',
    placeholder: 'Enter topic or product details for FAQ section (e.g. Noise-cancelling headphones battery life, warranty, and airplane compatibility)',
    label: 'Topic, Product, or Page Details',
    promptTemplate: 'Generate 5 high-search-intent FAQ question/answer pairs for: {topic}. Then output the valid, ready-to-copy JSON-LD Schema markup `<script type="application/ld+json">` for Google Rich Results.'
  },
  'internal-linking-strategy': {
    title: 'Internal Linking Strategy',
    desc: 'Map contextual internal link anchors between parent and child pages',
    icon: '🔗',
    category: 'seo',
    placeholder: 'Enter your target pillar page and related sub-topics (e.g. Pillar: Web Performance Optimization, Sub-topics: Image compression, Caching headers, Critical CSS, CDN configuration)',
    label: 'Pillar Topic & Supporting Sub-Topics',
    promptTemplate: 'Develop an internal linking architecture plan for: {topic}. Outline anchor text variations (exact match, partial match, contextual), page-to-page link directional paths, and contextual in-content sentence examples.'
  },
  'search-intent-classifier': {
    title: 'Search Intent Classifier',
    desc: 'Analyze search queries for Navigational, Informational, Commercial, or Transactional intent',
    icon: '🎯',
    category: 'seo',
    placeholder: 'Paste a list of 5-10 search queries or topics (e.g. buy mechanical keyboard, what is a brown switch, keychron k2 vs logitech mx)',
    label: 'Search Query / Keyword List',
    promptTemplate: 'Classify the search intent for each query in: {topic}. Identify Intent Type (Informational, Navigational, Commercial, Transactional), what content format Google expects (e.g. blog post, product page, tool), and recommended page features.'
  },
  'content-gap-analyzer': {
    title: 'Content Gap Analyzer',
    desc: 'Identify missing sub-topics and questions your competitors cover',
    icon: '📊',
    category: 'seo',
    placeholder: 'Enter your article topic and brief outline of what you already cover (e.g. Guide to Intermittent Fasting covering 16/8 method and water intake)',
    label: 'Your Current Topic & Outline',
    promptTemplate: 'Perform an SEO content gap analysis on: {topic}. Identify 10 essential missing sub-topics, unaddressed user anxieties, related questions (People Also Ask), and data points required to rank in the top 3 on Google.'
  },
  'anchor-text-optimizer': {
    title: 'Anchor Text Optimizer',
    desc: 'Natural, penalty-safe backlink anchor text distribution profile',
    icon: '⚓',
    category: 'seo',
    placeholder: 'Enter target URL topic and primary keyword (e.g. Project Management Software for Remote Teams)',
    label: 'Target Page Subject & Main Keyword',
    promptTemplate: 'Generate a healthy, penalty-safe anchor text distribution plan for: {topic}. Provide: 4 Exact Match, 6 Partial Match, 6 Branded/Domain, 4 Semantic/Synonym, and 4 Generic/Natural anchors.'
  },
  'featured-snippet-optimizer': {
    title: 'Featured Snippet Optimizer',
    desc: 'Craft direct answers formatted specifically to capture Google Position 0',
    icon: '🏆',
    category: 'seo',
    placeholder: 'Enter the target "What is" or "How to" question (e.g. What is the difference between latency and throughput?)',
    label: 'Target Question / Query',
    promptTemplate: 'Craft the optimal 40-55 word direct-answer paragraph and complementary structured list designed to capture Google Position 0 (Featured Snippet) for: {topic}. Include header tag recommendation (H2) and follow-up elaboration.'
  },
  'pillar-cluster-planner': {
    title: 'Topic Cluster & Pillar Planner',
    desc: 'Comprehensive topical authority blueprint with pillar and sub-clusters',
    icon: '🏛️',
    category: 'seo',
    placeholder: 'Enter broad core topic for your niche authority (e.g. Personal Cloud Storage & Home NAS Servers)',
    label: 'Broad Domain / Authority Subject',
    promptTemplate: 'Build a full SEO Topic Cluster Architecture for: {topic}. Define 1 Core Pillar Page theme, 8 Cluster Sub-topics (supporting articles), primary keyword targets for each, and internal linking directives to dominate topical authority.'
  },
  'lsi-keyword-expander': {
    title: 'LSI & Semantic Keyword Expander',
    desc: 'Latent Semantic Indexing keywords to boost topical relevance',
    icon: '🌐',
    category: 'seo',
    placeholder: 'Enter main target keyword or subject (e.g. Machine Learning algorithms)',
    label: 'Main Subject / Keyword',
    promptTemplate: 'Generate 30 semantically related Latent Semantic Indexing (LSI) terms, entities, and co-occurring phrases for: {topic}. Group by concept sub-domain and explain how to naturally weave them into body text.'
  },

  // Category 6: Technical & Coding (10)
  'code-explainer': {
    title: 'Code Explainer',
    desc: 'Plain-English walkthrough of complex functions, algorithms & code',
    icon: '💻',
    category: 'technical',
    placeholder: 'Paste your code snippet here in any language (JavaScript, Python, Rust, Go, SQL...)',
    label: 'Code Snippet to Analyze & Explain',
    promptTemplate: 'Explain this code in clear, structured plain English: {topic}. Provide: 1. High-level purpose summary, 2. Line-by-line / block breakdown, 3. Time/Space complexity (Big-O) if applicable, and 4. Potential edge case bugs or optimizations.'
  },
  'regex-builder-ai': {
    title: 'Regex Builder & Explainer',
    desc: 'Generate tested regular expressions with pattern breakdowns',
    icon: '🔍',
    category: 'technical',
    placeholder: 'Describe what you need to match (e.g. Match international phone numbers with optional country code and hyphens)',
    label: 'Matching Requirement Description',
    promptTemplate: 'Construct a robust Regular Expression (Regex) for: {topic}. Output the regex pattern, recommended flags (g, i, m), a breakdown of every token/character class, and 4 test case examples (2 matches, 2 non-matches).'
  },
  'sql-query-generator': {
    title: 'SQL Query Generator',
    desc: 'PostgreSQL, MySQL, and SQLite queries from natural language requests',
    icon: '🗄️',
    category: 'technical',
    placeholder: 'Describe tables and the data you want to retrieve (e.g. Find top 5 users by total order value in 2025 with at least 3 orders from orders and users tables)',
    label: 'Data Request & Schema Description',
    promptTemplate: 'Write a clean, optimized SQL query for: {topic}. Provide the query formatted in standard SQL, explain JOINs/aggregations used, and mention index recommendations for query performance.'
  },
  'git-command-helper': {
    title: 'Git Command Helper',
    desc: 'Instant Git commands for fixing merge conflicts, rebase, and undoing mistakes',
    icon: '🌿',
    category: 'technical',
    placeholder: 'Describe the Git scenario or mistake you need to solve (e.g. I committed to main by accident instead of a feature branch and haven\'t pushed yet)',
    label: 'Git Scenario / Problem Description',
    promptTemplate: 'Provide the exact step-by-step Git commands to solve this scenario: {topic}. Explain what each command does safely and provide a fallback if things go wrong.'
  },
  'error-log-troubleshooter': {
    title: 'Error Log Troubleshooter',
    desc: 'Diagnose stack traces, runtime exceptions, and build errors',
    icon: '🛠️',
    category: 'technical',
    placeholder: 'Paste error message, stack trace, or terminal log here...',
    label: 'Error Message / Stack Trace / Log',
    promptTemplate: 'Analyze and diagnose this software error / stack trace: {topic}. Explain: 1. Root Cause in plain terms, 2. The exact line/file causing failure, 3. Step-by-step fix instructions with corrected code, and 4. Prevention advice.'
  },
  'api-doc-generator': {
    title: 'API Documentation Generator',
    desc: 'Generate REST/GraphQL endpoint docs with parameters and JSON payloads',
    icon: '📡',
    category: 'technical',
    placeholder: 'Describe your API endpoint, method, and request/response (e.g. POST /api/v1/subscriptions creates a new stripe billing subscription for a team)',
    label: 'API Endpoint Description & Parameters',
    promptTemplate: 'Generate professional developer API documentation for: {topic}. Include: Method & Path, Overview, Headers, URL/Body Parameters table, 200 OK JSON response example, and 400/401/500 Error responses.'
  },
  'bash-script-creator': {
    title: 'Bash Script Creator',
    desc: 'Production-ready shell scripts with safety flags, logging, and error handling',
    icon: '🐚',
    category: 'technical',
    placeholder: 'Describe what the shell script should automate (e.g. Backup a PostgreSQL database daily, compress with gzip, and delete backups older than 14 days)',
    label: 'Automation Task Description',
    promptTemplate: 'Write a robust, production-grade Bash shell script for: {topic}. Include shebang, strict mode (`set -euo pipefail`), colored logging functions, input argument validation, and cleanup traps.'
  },
  'prompt-enhancer': {
    title: 'Prompt Enhancer Pro',
    desc: 'Refine simple instructions into detailed, high-accuracy master prompts',
    icon: '✨',
    category: 'technical',
    placeholder: 'Enter simple rough prompt (e.g. Write a python script to scrape stock prices)',
    label: 'Simple / Draft Prompt to Enhance',
    promptTemplate: 'Transform this simple prompt into an expert-level Master Prompt for an LLM: {topic}. Structure with: Persona & Role, Task Objective, Strict Constraints & Edge Cases, Step-by-Step Methodology, and Expected Output Format.'
  },
  'unit-test-generator': {
    title: 'Unit Test Generator',
    desc: 'Comprehensive test suites covering happy paths, edge cases & mocks',
    icon: '🧪',
    category: 'technical',
    placeholder: 'Paste function code and preferred test framework (e.g. JavaScript function validating email addresses, use Vitest/Jest)',
    label: 'Function Code & Testing Framework',
    promptTemplate: 'Write a comprehensive unit test suite for: {topic}. Include: 1. Happy path tests, 2. Boundary condition tests, 3. Invalid input/rejection tests, and 4. Mocking instructions if external dependencies exist.'
  },
  'readme-generator-pro': {
    title: 'README Generator Pro',
    desc: 'Polished open-source GitHub README with badges, install, and architecture',
    icon: '📄',
    category: 'technical',
    placeholder: 'Enter project name, tech stack, and core purpose (e.g. FastSync, a lightweight Go CLI tool that mirrors S3 buckets locally in real-time)',
    label: 'Project Name, Tech Stack & Purpose',
    promptTemplate: 'Generate a professional GitHub README.md for: {topic}. Include Project Title, Badges placeholders, Feature Highlights bullet list, Architecture overview, Installation & Quickstart commands, and License section.'
  }
};
