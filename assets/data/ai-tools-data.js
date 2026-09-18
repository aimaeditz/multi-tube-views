/**
 * Multi Tube Views (MTV) — 110 AI Tools Data Directory
 * Structured metadata for 110 dedicated AI generative tools across 6 core categories.
 */

export const AI_CATEGORIES = [
  { id: 'all', name: 'All Tools', count: 110 },
  { id: 'video', name: 'Video & Scripting', count: 17 },
  { id: 'social', name: 'Social & Growth', count: 18 },
  { id: 'copywriting', name: 'Copywriting & Sales', count: 19 },
  { id: 'creative', name: 'Creative & Narrative', count: 19 },
  { id: 'seo', name: 'SEO & Discovery', count: 19 },
  { id: 'technical', name: 'Technical & Code', count: 18 }
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
    promptTemplate: 'Write a full-length, highly engaging YouTube video script about: {topic}. Include an attention-grabbing hook, clear chapter breakdowns, pacing notes, visual cue prompts, and a strong call-to-action.',
    dateAdded: '2026-09-08'
  },
  'viral-hooks-generator': {
    title: 'Viral Hooks Generator',
    desc: 'Scroll-stopping 3-second opening lines for Shorts & Reels',
    icon: '🪝',
    category: 'video',
    placeholder: 'Enter video theme or topic (e.g. Secret Productivity Hacks for Remote Workers)',
    label: 'Video Theme / Main Concept',
    promptTemplate: 'Generate 12 high-converting, scroll-stopping viral hook opening lines for short-form video on: {topic}. Group by hook archetype (curiosity gap, controversial statement, immediate value, storytelling).',
    dateAdded: '2026-09-07'
  },
  'podcast-episode-planner': {
    title: 'Podcast Episode Planner',
    desc: 'Comprehensive episode outlines, segment timings & questions',
    icon: '🎙️',
    category: 'video',
    placeholder: 'Enter podcast topic, guest name/niche, and episode goals (e.g. Future of Quantum Computing with Dr. Vance)',
    label: 'Podcast Topic & Guest Details',
    promptTemplate: 'Create a comprehensive podcast episode blueprint for: {topic}. Include episode title ideas, cold open hook, 4 structured segment blocks with timestamps, 8 insightful interview questions, and a memorable sign-off.',
    dateAdded: '2026-08-28'
  },
  'voiceover-script-generator': {
    title: 'Voiceover Script Generator',
    desc: 'Natural, human-sounding narration with speech cadence cues',
    icon: '🗣️',
    category: 'video',
    placeholder: 'Enter script subject, target tone, and word count (e.g. 60-second product launch video narration for an eco-friendly water bottle)',
    label: 'Voiceover Subject & Desired Tone',
    promptTemplate: 'Write a professional, human-sounding voiceover narration script for: {topic}. Include pronunciation keys, pause markers [PAUSE], emphasis cues [EMPHASIS], and vocal tone direction.',
    dateAdded: '2026-08-25'
  },
  'video-title-brainstormer': {
    title: 'Video Title Brainstormer',
    desc: 'Psychological, curiosity-driven YouTube titles for high CTR',
    icon: '💡',
    category: 'video',
    placeholder: 'Enter core video idea or draft title (e.g. I Spent 30 Days Learning 3D Animation in Blender)',
    label: 'Video Idea / Draft Title',
    promptTemplate: 'Brainstorm 20 high-CTR, psychological YouTube video titles for: {topic}. Categorize by emotional driver (curiosity, FOMO, extreme challenge, transformation, negative framing).',
    dateAdded: '2026-08-20'
  },
  'storyboard-visual-prompts': {
    title: 'Storyboard Visual Prompts',
    desc: 'Scene-by-scene visual descriptions and camera angle guides',
    icon: '🖼️',
    category: 'video',
    placeholder: 'Enter video concept or narrative outline (e.g. A developer building a project at midnight in a cyberpunk city)',
    label: 'Narrative or Concept Outline',
    promptTemplate: 'Generate a detailed 6-scene storyboard breakdown for: {topic}. For each scene specify shot type, camera angle, subject action, lighting setup, and generative image prompt description.',
    dateAdded: '2026-05-10'
  },
  'youtube-shorts-script': {
    title: 'Shorts & Reels Script',
    desc: '30-60 second rapid-fire scripts optimized for retention',
    icon: '⚡',
    category: 'video',
    placeholder: 'Enter quick topic or tip (e.g. 3 Hidden iPhone Features Nobody Uses)',
    label: 'Shorts / Reels Topic or Quick Tip',
    promptTemplate: 'Write a high-retention 45-second script for YouTube Shorts / Instagram Reels about: {topic}. Format into Hook (0-3s), Core Value / Twist (3-35s), Climax (35-40s), and Looping Outro (40-45s).',
    dateAdded: '2026-05-10'
  },
  'interview-question-creator': {
    title: 'Interview Question Creator',
    desc: 'Deep, non-cliché interview questions that elicit golden soundbites',
    icon: '❓',
    category: 'video',
    placeholder: 'Enter interviewee profession, background, and interview subject (e.g. Senior Game Designer on Indie vs AAA Development)',
    label: 'Interviewee Profile & Subject',
    promptTemplate: 'Develop 15 insightful, non-generic interview questions for: {topic}. Include icebreakers, thought-provoking technical/industry inquiries, vulnerable failure/lesson questions, and rapid-fire finishers.',
    dateAdded: '2026-05-10'
  },
  'video-cta-generator': {
    title: 'Video CTA Generator',
    desc: 'Seamless mid-roll and end-screen call-to-action scripts',
    icon: '🎯',
    category: 'video',
    placeholder: 'Enter your offer, channel goal, or lead magnet (e.g. Free Notion Template download in description)',
    label: 'Offer, Lead Magnet, or Channel Action',
    promptTemplate: 'Craft 8 smooth, natural Call-to-Action (CTA) scripts for a video promoting: {topic}. Provide 3 subtle mid-roll transitions, 3 high-urgency end screen pitches, and 2 pinned comment copy formulas.',
    dateAdded: '2026-05-10'
  },
  'b-roll-shot-list': {
    title: 'B-Roll Shot List',
    desc: 'Cinematic supplemental footage shot list to elevate production',
    icon: '🎥',
    category: 'video',
    placeholder: 'Enter video style and scene settings (e.g. Morning Routine / Day in the Life of a Solopreneur in a modern studio)',
    label: 'Video Context & Location Setting',
    promptTemplate: 'Generate a comprehensive cinematic B-Roll shot list for: {topic}. Group by location/lighting, specifying focal length, movement (pan, tilt, orbit, slider), speed (24fps vs 120fps slow-mo), and narrative purpose.',
    dateAdded: '2026-05-10'
  },

  // Category 2: Social Media & Growth (10)
  'linkedin-post-generator': {
    title: 'LinkedIn Post Generator',
    desc: 'High-engagement thought leadership posts with formatting',
    icon: '💼',
    category: 'social',
    placeholder: 'Enter lesson learned, career story, or industry insight (e.g. What 5 years of freelancing taught me about pricing)',
    label: 'Career Story, Insight, or Industry Lesson',
    promptTemplate: 'Write an engaging, high-reach LinkedIn post about: {topic}. Use crisp single-line sentence hooks, ample whitespace, bulleted lessons, and an open question that sparks comments.',
    dateAdded: '2026-05-10'
  },
  'twitter-thread-builder': {
    title: 'Twitter/X Thread Builder',
    desc: 'Multi-tweet viral thread sequences with hook and recap',
    icon: '🧵',
    category: 'social',
    placeholder: 'Enter master guide or breakdown topic (e.g. 10 Mental Models for Better Decision Making)',
    label: 'Thread Topic / Deep-Dive Subject',
    promptTemplate: 'Create an 8-tweet viral thread on: {topic}. Include a gripping Tweet 1 (hook), 6 actionable value tweets with crisp formatting, and a final summary tweet with retweet/follow CTA.',
    dateAdded: '2026-05-10'
  },
  'instagram-caption-writer': {
    title: 'Instagram Caption Writer',
    desc: 'Aesthetic, storytelling, and high-save captions with hashtags',
    icon: '📸',
    category: 'social',
    placeholder: 'Enter photo/carousel subject and vibe (e.g. Cozy coffee shop desk setup, discussing digital minimalism)',
    label: 'Post Visual & Vibe Description',
    promptTemplate: 'Write 3 contrasting Instagram caption options (Storytelling, Minimalist, Educational) for: {topic}. Include aesthetic emojis, spacing, line breaks, and a curated set of 15 targeted hashtags.',
    dateAdded: '2026-05-10'
  },
  'tiktok-trend-adapter': {
    title: 'TikTok Trend Adapter',
    desc: 'Adapt popular viral TikTok meme formats to your specific niche',
    icon: '🎵',
    category: 'social',
    placeholder: 'Enter your niche and desired format (e.g. Real Estate agent adapting relatable POV / expectations vs reality trends)',
    label: 'Your Niche & Audience',
    promptTemplate: 'Outline 5 viral TikTok video concepts adapting current trending formats and audio styles to the niche: {topic}. Include text overlay, acting cues, audio sound vibe, and caption.',
    dateAdded: '2026-05-10'
  },
  'content-repurposing-matrix': {
    title: 'Repurposing Matrix',
    desc: 'Turn 1 core idea into 8 distinct multi-platform assets',
    icon: '🔄',
    category: 'social',
    placeholder: 'Enter one long-form topic, article, or video concept (e.g. Why Remote Work is Reshaping Urban Economics)',
    label: 'Core Piece of Content / Subject',
    promptTemplate: 'Build a comprehensive content repurposing matrix for: {topic}. Break it down into: 1 LinkedIn post, 1 Twitter thread, 2 Short video concepts, 1 Newsletter section, 1 Infographic bullet list, and 2 Discussion poll ideas.',
    dateAdded: '2026-05-10'
  },
  'community-poll-creator': {
    title: 'Community Poll Creator',
    desc: 'Viral poll questions and options for YouTube, LinkedIn & X',
    icon: '📊',
    category: 'social',
    placeholder: 'Enter industry debate or controversial question area (e.g. React vs Vue vs Svelte for solo developers in 2026)',
    label: 'Debate Topic or Poll Subject',
    promptTemplate: 'Create 5 engaging community poll posts for YouTube Community, LinkedIn, and Twitter on: {topic}. Provide a hook question, 4 balanced poll answer choices, and a caption designed to provoke comment debate.',
    dateAdded: '2026-05-10'
  },
  'viral-tweet-generator': {
    title: 'Viral Tweet Generator',
    desc: 'Punchy one-liners, contrarian takes, and quote-worthy tweets',
    icon: '🐦',
    category: 'social',
    placeholder: 'Enter niche or belief (e.g. Modern web design is becoming too boring and homogenous)',
    label: 'Core Belief, Observation, or Topic',
    promptTemplate: 'Generate 15 punchy, standalone viral tweets on: {topic}. Use proven formats: contrarian observation, short lists, rule of three, witty one-liners, and inspirational reframes.',
    dateAdded: '2026-05-10'
  },
  'social-bio-optimizer': {
    title: 'Social Bio Optimizer',
    desc: 'Compelling 150-character profile bios with authority and CTA',
    icon: '👤',
    category: 'social',
    placeholder: 'Enter your role, target audience, and primary link offer (e.g. UI/UX Designer helping SaaS founders scale conversions)',
    label: 'Your Identity, Audience, & Value Proposition',
    promptTemplate: 'Craft 6 distinct, high-converting social bio options (for X, Instagram, and LinkedIn) for: {topic}. Focus on who you help, how you help them, social proof, and a clear call-to-action link.',
    dateAdded: '2026-05-10'
  },
  'carousel-slide-planner': {
    title: 'Carousel Slide Planner',
    desc: '10-slide visual sequence for Instagram and LinkedIn PDF carousels',
    icon: '📑',
    category: 'social',
    placeholder: 'Enter step-by-step tutorial or guide (e.g. How to Audit Your Website SEO in 10 Minutes)',
    label: 'Guide Topic or Step-by-Step Lesson',
    promptTemplate: 'Design a 10-slide visual carousel outline for: {topic}. For each slide, write the bold headline, bite-sized body copy (under 30 words), visual design instruction, and swipe prompt.',
    dateAdded: '2026-05-10'
  },
  'audience-engagement-replies': {
    title: 'Audience Reply Generator',
    desc: 'Thoughtful, authority-building responses to comments and mentions',
    icon: '💬',
    category: 'social',
    placeholder: 'Paste audience comment or question (e.g. "Do you think AI will replace junior frontend engineers in 3 years?")',
    label: 'Audience Comment / Question to Answer',
    promptTemplate: 'Generate 4 thoughtful, engaging response options to this audience comment: {topic}. Include a friendly supportive reply, a detailed expert breakdown, a conversational question-turner, and a concise witty acknowledgment.',
    dateAdded: '2026-05-10'
  },

  // Category 3: Copywriting & Sales (10)
  'cold-email-writer': {
    title: 'Cold Email Writer',
    desc: 'High-converting B2B outreach emails with personalized hooks',
    icon: '✉️',
    category: 'copywriting',
    placeholder: 'Enter prospect type, your service/product, and unique benefit (e.g. Reaching out to Shopify store owners about site speed optimization)',
    label: 'Prospect Profile & Your Offer',
    promptTemplate: 'Write 3 high-converting cold email sequences for: {topic}. Keep under 120 words each. Structure with a personalized icebreaker hook, specific pain point, concise value pitch, and low-friction soft CTA.',
    dateAdded: '2026-05-10'
  },
  'landing-page-copy': {
    title: 'Landing Page Copywriter',
    desc: 'Complete high-conversion landing page headlines, benefits & CTAs',
    icon: '🚀',
    category: 'copywriting',
    placeholder: 'Enter your product/service name, target user, and core solution (e.g. PulseFlow, an automated client onboarding portal for agencies)',
    label: 'Product / SaaS Concept & Core Benefit',
    promptTemplate: 'Write full landing page copy for: {topic}. Include Hero Section (Headline, Subhead, CTA, Social Proof chip), 3 Problem/Agitation cards, 3 Feature/Benefit blocks, FAQ section, and Final CTA banner.',
    dateAdded: '2026-05-10'
  },
  'ad-copy-generator': {
    title: 'Ad Copy Generator',
    desc: 'Multi-platform ad copy for Meta (FB/IG), Google Search & TikTok',
    icon: '📢',
    category: 'copywriting',
    placeholder: 'Enter product, key discount/offer, and target customer (e.g. Ergonomic lumbar cushion for remote developers, 20% off spring sale)',
    label: 'Product, Offer Details & Target Audience',
    promptTemplate: 'Generate high-performing ad copy for: {topic}. Provide 2 Meta Ads (Primary Text, Headline, Description), 3 Google Search Ads (Headlines + Descriptions under character limits), and 2 TikTok Ad hook scripts.',
    dateAdded: '2026-05-10'
  },
  'sales-page-generator': {
    title: 'Sales Letter / Page Copy',
    desc: 'Direct-response sales letter using proven PAS and AIDA frameworks',
    icon: '💰',
    category: 'copywriting',
    placeholder: 'Enter course, eBook, or service offer (e.g. Masterclass on Freelance Design Client Acquisition)',
    label: 'Offer Details, Pricing & Transformation',
    promptTemplate: 'Write a persuasive direct-response sales letter section for: {topic}. Follow the PAS (Problem-Agitate-Solution) framework: expose the frustration, intensify the cost of inaction, introduce the offer, and provide irresistible guarantees.',
    dateAdded: '2026-05-10'
  },
  'value-proposition-builder': {
    title: 'Value Proposition Builder',
    desc: 'Crystal-clear 1-sentence value propositions and positioning lines',
    icon: '🎯',
    category: 'copywriting',
    placeholder: 'Enter what you do, for whom, and what makes you different (e.g. Cloud video compression API that renders 5x faster than AWS MediaConvert)',
    label: 'Product Capabilities & Target Audience',
    promptTemplate: 'Craft 8 distinct Value Proposition statements for: {topic}. Include the Steve Blank formulation ("We help X do Y by Z"), positioning matrix formulas, and punchy tagline variations.',
    dateAdded: '2026-05-10'
  },
  'brand-voice-guide': {
    title: 'Brand Voice Guide',
    desc: 'Define tone pillars, vocabulary rules, and communication guardrails',
    icon: '💎',
    category: 'copywriting',
    placeholder: 'Enter company niche, brand personality adjectives (e.g. Modern fintech app for Gen Z: bold, witty, transparent, non-corporate)',
    label: 'Brand Concept & Personality Traits',
    promptTemplate: 'Develop a comprehensive Brand Voice & Tone Guideline for: {topic}. Detail 4 Core Tone Pillars (e.g. "Confident, but never arrogant"), vocabulary words to use vs ban, and sample customer communication examples.',
    dateAdded: '2026-05-10'
  },
  'testimonial-polisher': {
    title: 'Testimonial Polisher',
    desc: 'Shape messy client feedback into punchy, high-impact case study quotes',
    icon: '⭐',
    category: 'copywriting',
    placeholder: 'Paste raw, unedited client feedback (e.g. "We really liked working with Sarah, she delivered on time and our traffic went up like 40% in two months which was awesome")',
    label: 'Raw Client Feedback / Review Text',
    promptTemplate: 'Transform this raw client feedback into 3 polished, persuasive testimonial variations (Short Pull Quote, Problem-Outcome Mini-Story, Highlight Badge): {topic}. Maintain genuine voice while amplifying metrics and credibility.',
    dateAdded: '2026-05-10'
  },
  'newsletter-curator': {
    title: 'Newsletter Issue Writer',
    desc: 'Engaging email newsletter issues with intro story, links & takeaways',
    icon: '📰',
    category: 'copywriting',
    placeholder: 'Enter newsletter theme, 3 main links or ideas to cover (e.g. Issue on AI video generators: Sora updates, Runway gen-3 workflows, and copyright debate)',
    label: 'Newsletter Theme & Core Points',
    promptTemplate: 'Write an engaging, high-open-rate newsletter issue on: {topic}. Include 3 curiosity-inducing subject line options, preview text, personal conversational intro, 3 curated item breakdowns with commentary, and a closing thought.',
    dateAdded: '2026-05-10'
  },
  'call-to-action-engine': {
    title: 'Call-to-Action Engine',
    desc: 'Action-oriented button text and microcopy that lifts conversion',
    icon: '🔥',
    category: 'copywriting',
    placeholder: 'Enter what the user gets when clicking (e.g. Start a 14-day free trial of project management software without a credit card)',
    label: 'User Action & Desired Outcome',
    promptTemplate: 'Generate 20 high-conversion Call-to-Action (CTA) button copy options and supporting microcopy for: {topic}. Group by urgency, value-first, risk-reversal, and curiosity.',
    dateAdded: '2026-05-10'
  },
  'product-hunt-launch-copy': {
    title: 'Product Hunt Launch Copy',
    desc: 'Tagline, Maker Comment, and gallery captions for Product Hunt launches',
    icon: '🐱',
    category: 'copywriting',
    placeholder: 'Enter product name, core features, origin story, and launch offer (e.g. MockFlow: Instant 3D device mockups in your browser for designers)',
    label: 'Product Details, Features, & Origin Story',
    promptTemplate: 'Create the complete Product Hunt launch copy kit for: {topic}. Include: Catchy Tagline (under 60 chars), First Maker Comment (story, why we built it, special offer), and 5 gallery screenshot captions.',
    dateAdded: '2026-05-10'
  },

  // Category 4: Creative & Narrative (10)
  'story-plot-generator': {
    title: 'Story Plot Generator',
    desc: 'Multi-act narrative structures, character stakes & plot twists',
    icon: '📖',
    category: 'creative',
    placeholder: 'Enter genre, protagonist concept, and central conflict (e.g. Sci-Fi noir detective investigating the disappearance of the city\'s last organic tree)',
    label: 'Genre, Protagonist & Conflict Premise',
    promptTemplate: 'Generate a rich, multi-act story plot outline for: {topic}. Structure with Act 1 (Inciting Incident & Status Quo), Act 2 (Rising Stakes, Midpoint Twist & Dark Night of the Soul), and Act 3 (Climax & Resolution).',
    dateAdded: '2026-05-10'
  },
  'character-backstory-creator': {
    title: 'Character Backstory Creator',
    desc: 'Deep character dossiers with flaws, motivations, and internal conflict',
    icon: '🎭',
    category: 'creative',
    placeholder: 'Enter character name, archetype, and world setting (e.g. Evelyn Reed, a disgraced clockmaker in a Victorian steampunk city with a secret automaton child)',
    label: 'Character Concept & Setting',
    promptTemplate: 'Create a comprehensive character dossier for: {topic}. Detail physical appearance, defining personality contradiction, formative childhood trauma/event, core desire vs core lie they believe, and iconic habits.',
    dateAdded: '2026-05-10'
  },
  'world-building-architect': {
    title: 'World-Building Architect',
    desc: 'Societies, magic/tech systems, geography, factions & lore',
    icon: '🌍',
    category: 'creative',
    placeholder: 'Enter world concept or unique law of nature (e.g. A fantasy realm where memories are physical crystals used as currency and fuel)',
    label: 'World Premise or Foundational Rule',
    promptTemplate: 'Flesh out an immersive fictional world based on: {topic}. Cover: The Foundational Rule/System, Daily Life of Common Citizens, Major Factions in Conflict, Taboos and Cultural Rituals, and 3 Ancient Mysteries.',
    dateAdded: '2026-05-10'
  },
  'metaphor-analogy-crafter': {
    title: 'Metaphor & Analogy Crafter',
    desc: 'Vivid, memorable literary metaphors for complex concepts',
    icon: '🔮',
    category: 'creative',
    placeholder: 'Enter complex idea or emotional feeling (e.g. Explaining how distributed ledger technology works, or the feeling of nostalgia for a childhood summer)',
    label: 'Complex Idea or Emotion to Illustrate',
    promptTemplate: 'Craft 10 vivid, evocative metaphors and analogies explaining: {topic}. Provide a mix of visual, sensory, narrative, and mechanical analogies suitable for essays, speeches, and creative fiction.',
    dateAdded: '2026-05-10'
  },
  'poetry-lyrics-generator': {
    title: 'Poetry & Song Lyrics Generator',
    desc: 'Rhythmic stanzas, evocative rhyming schemes, and verse-chorus layouts',
    icon: '🎶',
    category: 'creative',
    placeholder: 'Enter theme, music genre, or poetic meter (e.g. Indie-folk song about moving away from a coastal hometown)',
    label: 'Theme, Musical Style, or Poetic Form',
    promptTemplate: 'Write rich, evocative poetry or song lyrics about: {topic}. If song lyrics: structure into Verse 1, Pre-Chorus, Chorus, Verse 2, Chorus, Bridge, and Outro with rhythm cues.',
    dateAdded: '2026-05-10'
  },
  'dialogue-doctor': {
    title: 'Dialogue Doctor',
    desc: 'Punch up flat dialogue with subtext, distinctive voices & pacing',
    icon: '💬',
    category: 'creative',
    placeholder: 'Paste draft dialogue between two characters with their conflicting goals (e.g. John wants to borrow money, Sarah knows he lost his job)',
    label: 'Draft Dialogue & Character Intentions',
    promptTemplate: 'Punch up and rewrite this dialogue to infuse subtext, tension, and unique speech patterns: {topic}. Explain what each character is REALLY saying beneath their spoken words.',
    dateAdded: '2026-05-10'
  },
  'creative-writing-prompts': {
    title: 'Creative Writing Prompts',
    desc: 'Original, boundary-pushing fiction prompts and first-sentence sparks',
    icon: '✨',
    category: 'creative',
    placeholder: 'Enter genre or mood (e.g. Psychological horror in a remote research station, eerie quiet)',
    label: 'Preferred Genre or Atmospheric Mood',
    promptTemplate: 'Generate 10 original, highly atmospheric creative writing prompts based on: {topic}. For each prompt, provide the opening sentence, the hidden premise, and the ticking clock constraint.',
    dateAdded: '2026-05-10'
  },
  'conflict-tension-generator': {
    title: 'Conflict & Tension Generator',
    desc: 'Complications, ticking clocks, and high-stakes moral dilemmas',
    icon: '⚡',
    category: 'creative',
    placeholder: 'Enter current scene scenario (e.g. Two spies trapped in an elevator as the alarm sounds)',
    label: 'Scene Situation & Characters Involved',
    promptTemplate: 'Brainstorm 8 escalations of conflict and psychological tension for this scene: {topic}. Include internal dilemmas, external environmental threats, unexpected revelations, and impossible choices.',
    dateAdded: '2026-05-10'
  },
  'genre-fusion-story': {
    title: 'Genre Fusion Concept Lab',
    desc: 'Blend two unexpected genres into a unique storytelling premise',
    icon: '🧪',
    category: 'creative',
    placeholder: 'Enter two contrasting genres (e.g. Regency Romance + Hard Cyberpunk, or Cozy Mystery + Cosmic Lovecraftian Horror)',
    label: 'Two Genres to Blend',
    promptTemplate: 'Design 3 compelling story concepts fusing these genres: {topic}. For each, describe the aesthetic setting, the protagonist archetype, the central villain/threat, and why the hybrid works brilliantly.',
    dateAdded: '2026-05-10'
  },
  'hero-journey-outline': {
    title: "Hero's Journey Story Map",
    desc: 'Map any story idea to the classic 12 Campbell/Vogler mythological stages',
    icon: '🗺️',
    category: 'creative',
    placeholder: 'Enter core story idea or character (e.g. A timid archivist who finds a map to an extinguished star)',
    label: 'Core Story Premise & Hero',
    promptTemplate: "Map this story idea across the 12 stages of the Hero's Journey: {topic}. Detail Ordinary World, Call to Adventure, Refusal, Meeting the Mentor, Crossing the Threshold, Tests & Enemies, The Inmost Cave, The Ordeal, The Reward, The Road Back, Resurrection, and Return with the Elixir.",
    dateAdded: '2026-05-10'
  },

  // Category 5: SEO & Discovery (10)
  'meta-description-pro': {
    title: 'Meta Description Pro',
    desc: 'SERP-optimized meta titles and descriptions adhering to pixel limits',
    icon: '🔍',
    category: 'seo',
    placeholder: 'Enter page topic, primary keyword, and brand name (e.g. Best Ergonomic Office Chairs, primary keyword: ergonomic office chair, Brand: WorkZen)',
    label: 'Page Topic, Primary Keyword, & Brand',
    promptTemplate: 'Generate 5 high-CTR SEO Meta Title (under 60 chars) and Meta Description (under 155 chars) combinations for: {topic}. Include primary keyword placement and strong searcher benefit.',
    dateAdded: '2026-05-10'
  },
  'long-tail-keyword-finder': {
    title: 'Long-Tail Keyword Finder',
    desc: 'Low-competition, high-intent long-tail search query ideas',
    icon: '🔑',
    category: 'seo',
    placeholder: 'Enter broad seed keyword (e.g. espresso machine)',
    label: 'Seed Keyword / Industry Topic',
    promptTemplate: 'Generate 25 high-intent long-tail keyword ideas for: {topic}. Categorize into: Transactional (ready to buy), Informational (questions & guides), Commercial Comparison (vs, best of), and Problem-Solving queries.',
    dateAdded: '2026-05-10'
  },
  'faq-schema-generator': {
    title: 'FAQ Schema Generator',
    desc: 'Rich FAQ questions, answers, and valid JSON-LD schema markup',
    icon: '📋',
    category: 'seo',
    placeholder: 'Enter topic or product details for FAQ section (e.g. Noise-cancelling headphones battery life, warranty, and airplane compatibility)',
    label: 'Topic, Product, or Page Details',
    promptTemplate: 'Generate 5 high-search-intent FAQ question/answer pairs for: {topic}. Then output the valid, ready-to-copy JSON-LD Schema markup `<script type="application/ld+json">` for Google Rich Results.',
    dateAdded: '2026-05-10'
  },
  'internal-linking-strategy': {
    title: 'Internal Linking Strategy',
    desc: 'Map contextual internal link anchors between parent and child pages',
    icon: '🔗',
    category: 'seo',
    placeholder: 'Enter your target pillar page and related sub-topics (e.g. Pillar: Web Performance Optimization, Sub-topics: Image compression, Caching headers, Critical CSS, CDN configuration)',
    label: 'Pillar Topic & Supporting Sub-Topics',
    promptTemplate: 'Develop an internal linking architecture plan for: {topic}. Outline anchor text variations (exact match, partial match, contextual), page-to-page link directional paths, and contextual in-content sentence examples.',
    dateAdded: '2026-05-10'
  },
  'search-intent-classifier': {
    title: 'Search Intent Classifier',
    desc: 'Analyze search queries for Navigational, Informational, Commercial, or Transactional intent',
    icon: '🎯',
    category: 'seo',
    placeholder: 'Paste a list of 5-10 search queries or topics (e.g. buy mechanical keyboard, what is a brown switch, keychron k2 vs logitech mx)',
    label: 'Search Query / Keyword List',
    promptTemplate: 'Classify the search intent for each query in: {topic}. Identify Intent Type (Informational, Navigational, Commercial, Transactional), what content format Google expects (e.g. blog post, product page, tool), and recommended page features.',
    dateAdded: '2026-05-10'
  },
  'content-gap-analyzer': {
    title: 'Content Gap Analyzer',
    desc: 'Identify missing sub-topics and questions your competitors cover',
    icon: '📊',
    category: 'seo',
    placeholder: 'Enter your article topic and brief outline of what you already cover (e.g. Guide to Intermittent Fasting covering 16/8 method and water intake)',
    label: 'Your Current Topic & Outline',
    promptTemplate: 'Perform an SEO content gap analysis on: {topic}. Identify 10 essential missing sub-topics, unaddressed user anxieties, related questions (People Also Ask), and data points required to rank in the top 3 on Google.',
    dateAdded: '2026-05-10'
  },
  'anchor-text-optimizer': {
    title: 'Anchor Text Optimizer',
    desc: 'Natural, penalty-safe backlink anchor text distribution profile',
    icon: '⚓',
    category: 'seo',
    placeholder: 'Enter target URL topic and primary keyword (e.g. Project Management Software for Remote Teams)',
    label: 'Target Page Subject & Main Keyword',
    promptTemplate: 'Generate a healthy, penalty-safe anchor text distribution plan for: {topic}. Provide: 4 Exact Match, 6 Partial Match, 6 Branded/Domain, 4 Semantic/Synonym, and 4 Generic/Natural anchors.',
    dateAdded: '2026-05-10'
  },
  'featured-snippet-optimizer': {
    title: 'Featured Snippet Optimizer',
    desc: 'Craft direct answers formatted specifically to capture Google Position 0',
    icon: '🏆',
    category: 'seo',
    placeholder: 'Enter the target "What is" or "How to" question (e.g. What is the difference between latency and throughput?)',
    label: 'Target Question / Query',
    promptTemplate: 'Craft the optimal 40-55 word direct-answer paragraph and complementary structured list designed to capture Google Position 0 (Featured Snippet) for: {topic}. Include header tag recommendation (H2) and follow-up elaboration.',
    dateAdded: '2026-05-10'
  },
  'pillar-cluster-planner': {
    title: 'Topic Cluster & Pillar Planner',
    desc: 'Comprehensive topical authority blueprint with pillar and sub-clusters',
    icon: '🏛️',
    category: 'seo',
    placeholder: 'Enter broad core topic for your niche authority (e.g. Personal Cloud Storage & Home NAS Servers)',
    label: 'Broad Domain / Authority Subject',
    promptTemplate: 'Build a full SEO Topic Cluster Architecture for: {topic}. Define 1 Core Pillar Page theme, 8 Cluster Sub-topics (supporting articles), primary keyword targets for each, and internal linking directives to dominate topical authority.',
    dateAdded: '2026-05-10'
  },
  'lsi-keyword-expander': {
    title: 'LSI & Semantic Keyword Expander',
    desc: 'Latent Semantic Indexing keywords to boost topical relevance',
    icon: '🌐',
    category: 'seo',
    placeholder: 'Enter main target keyword or subject (e.g. Machine Learning algorithms)',
    label: 'Main Subject / Keyword',
    promptTemplate: 'Generate 30 semantically related Latent Semantic Indexing (LSI) terms, entities, and co-occurring phrases for: {topic}. Group by concept sub-domain and explain how to naturally weave them into body text.',
    dateAdded: '2026-05-10'
  },

  // Category 6: Technical & Coding (10)
  'code-explainer': {
    title: 'Code Explainer',
    desc: 'Plain-English walkthrough of complex functions, algorithms & code',
    icon: '💻',
    category: 'technical',
    placeholder: 'Paste your code snippet here in any language (JavaScript, Python, Rust, Go, SQL...)',
    label: 'Code Snippet to Analyze & Explain',
    promptTemplate: 'Explain this code in clear, structured plain English: {topic}. Provide: 1. High-level purpose summary, 2. Line-by-line / block breakdown, 3. Time/Space complexity (Big-O) if applicable, and 4. Potential edge case bugs or optimizations.',
    dateAdded: '2026-05-10'
  },
  'regex-builder-ai': {
    title: 'Regex Builder & Explainer',
    desc: 'Generate tested regular expressions with pattern breakdowns',
    icon: '🔍',
    category: 'technical',
    placeholder: 'Describe what you need to match (e.g. Match international phone numbers with optional country code and hyphens)',
    label: 'Matching Requirement Description',
    promptTemplate: 'Construct a robust Regular Expression (Regex) for: {topic}. Output the regex pattern, recommended flags (g, i, m), a breakdown of every token/character class, and 4 test case examples (2 matches, 2 non-matches).',
    dateAdded: '2026-05-10'
  },
  'sql-query-generator': {
    title: 'SQL Query Generator',
    desc: 'PostgreSQL, MySQL, and SQLite queries from natural language requests',
    icon: '🗄️',
    category: 'technical',
    placeholder: 'Describe tables and the data you want to retrieve (e.g. Find top 5 users by total order value in 2025 with at least 3 orders from orders and users tables)',
    label: 'Data Request & Schema Description',
    promptTemplate: 'Write a clean, optimized SQL query for: {topic}. Provide the query formatted in standard SQL, explain JOINs/aggregations used, and mention index recommendations for query performance.',
    dateAdded: '2026-05-10'
  },
  'git-command-helper': {
    title: 'Git Command Helper',
    desc: 'Instant Git commands for fixing merge conflicts, rebase, and undoing mistakes',
    icon: '🌿',
    category: 'technical',
    placeholder: 'Describe the Git scenario or mistake you need to solve (e.g. I committed to main by accident instead of a feature branch and haven\'t pushed yet)',
    label: 'Git Scenario / Problem Description',
    promptTemplate: 'Provide the exact step-by-step Git commands to solve this scenario: {topic}. Explain what each command does safely and provide a fallback if things go wrong.',
    dateAdded: '2026-05-10'
  },
  'error-log-troubleshooter': {
    title: 'Error Log Troubleshooter',
    desc: 'Diagnose stack traces, runtime exceptions, and build errors',
    icon: '🛠️',
    category: 'technical',
    placeholder: 'Paste error message, stack trace, or terminal log here...',
    label: 'Error Message / Stack Trace / Log',
    promptTemplate: 'Analyze and diagnose this software error / stack trace: {topic}. Explain: 1. Root Cause in plain terms, 2. The exact line/file causing failure, 3. Step-by-step fix instructions with corrected code, and 4. Prevention advice.',
    dateAdded: '2026-05-10'
  },
  'api-doc-generator': {
    title: 'API Documentation Generator',
    desc: 'Generate REST/GraphQL endpoint docs with parameters and JSON payloads',
    icon: '📡',
    category: 'technical',
    placeholder: 'Describe your API endpoint, method, and request/response (e.g. POST /api/v1/subscriptions creates a new stripe billing subscription for a team)',
    label: 'API Endpoint Description & Parameters',
    promptTemplate: 'Generate professional developer API documentation for: {topic}. Include: Method & Path, Overview, Headers, URL/Body Parameters table, 200 OK JSON response example, and 400/401/500 Error responses.',
    dateAdded: '2026-05-10'
  },
  'bash-script-creator': {
    title: 'Bash Script Creator',
    desc: 'Production-ready shell scripts with safety flags, logging, and error handling',
    icon: '🐚',
    category: 'technical',
    placeholder: 'Describe what the shell script should automate (e.g. Backup a PostgreSQL database daily, compress with gzip, and delete backups older than 14 days)',
    label: 'Automation Task Description',
    promptTemplate: 'Write a robust, production-grade Bash shell script for: {topic}. Include shebang, strict mode (`set -euo pipefail`), colored logging functions, input argument validation, and cleanup traps.',
    dateAdded: '2026-05-10'
  },
  'prompt-enhancer': {
    title: 'Prompt Enhancer Pro',
    desc: 'Refine simple instructions into detailed, high-accuracy master prompts',
    icon: '✨',
    category: 'technical',
    placeholder: 'Enter simple rough prompt (e.g. Write a python script to scrape stock prices)',
    label: 'Simple / Draft Prompt to Enhance',
    promptTemplate: 'Transform this simple prompt into an expert-level Master Prompt for an LLM: {topic}. Structure with: Persona & Role, Task Objective, Strict Constraints & Edge Cases, Step-by-Step Methodology, and Expected Output Format.',
    dateAdded: '2026-05-10'
  },
  'unit-test-generator': {
    title: 'Unit Test Generator',
    desc: 'Comprehensive test suites covering happy paths, edge cases & mocks',
    icon: '🧪',
    category: 'technical',
    placeholder: 'Paste function code and preferred test framework (e.g. JavaScript function validating email addresses, use Vitest/Jest)',
    label: 'Function Code & Testing Framework',
    promptTemplate: 'Write a comprehensive unit test suite for: {topic}. Include: 1. Happy path tests, 2. Boundary condition tests, 3. Invalid input/rejection tests, and 4. Mocking instructions if external dependencies exist.',
    dateAdded: '2026-05-10'
  },
  'readme-generator-pro': {
    title: 'README Generator Pro',
    desc: 'Polished open-source GitHub README with badges, install, and architecture',
    icon: '📄',
    category: 'technical',
    placeholder: 'Enter project name, tech stack, and core purpose (e.g. FastSync, a lightweight Go CLI tool that mirrors S3 buckets locally in real-time)',
    label: 'Project Name, Tech Stack & Purpose',
    promptTemplate: 'Generate a professional GitHub README.md for: {topic}. Include Project Title, Badges placeholders, Feature Highlights bullet list, Architecture overview, Installation & Quickstart commands, and License section.',
    dateAdded: '2026-05-10'
  },

  // Category 3 (continued): Copywriting & Sales (9 new tools)
  'elevator-pitch-generator': {
    title: 'Elevator Pitch Generator',
    desc: 'High-impact 30-second and 60-second verbal pitches for investors or prospects',
    icon: '⏱️',
    category: 'copywriting',
    placeholder: 'Enter product concept, target audience, and core problem solved (e.g. AI-powered inventory management for boutique coffee shops)',
    label: 'Product / Service Concept & Audience',
    promptTemplate: 'Generate 4 distinct elevator pitches (a 10-second soundbite, a 30-second investor pitch, a 60-second conversational pitch, and a problem-solution hook) for: {topic}.',
    dateAdded: '2026-09-17'
  },
  'product-description-writer': {
    title: 'Product Description Writer',
    desc: 'Compelling eCommerce and marketplace product listings that convert browsers into buyers',
    icon: '🛍️',
    category: 'copywriting',
    placeholder: 'Enter product name, materials/specs, key benefits, and target shopper (e.g. Ergonomic Merino Wool Travel Pillow)',
    label: 'Product Name & Key Features',
    promptTemplate: 'Write 3 compelling, high-converting product descriptions (Sensory/Emotional, Feature-Benefit Bulleted, and Minimalist/Punchy) with SEO-friendly copy for: {topic}.',
    dateAdded: '2026-09-17'
  },
  'upsell-cross-sell-copy': {
    title: 'Upsell & Cross-Sell Copy Generator',
    desc: 'Frictionless post-purchase and checkout bump offers that maximize average order value',
    icon: '📈',
    category: 'copywriting',
    placeholder: 'Enter primary purchase and the complementary upsell or add-on product (e.g. Buying a DSLR Camera -> Upsell: Masterclass + Lens Bundle at 40% off)',
    label: 'Core Product & Add-On Offer',
    promptTemplate: 'Generate 4 high-converting upsell and cross-sell copy variations (One-Click Post-Purchase Modal, Cart Drawer Bump, Order Confirmation Email Recommendation, and Scarcity Bundle Offer) for: {topic}.',
    dateAdded: '2026-09-17'
  },
  'abandoned-cart-email-writer': {
    title: 'Abandoned Cart Email Writer',
    desc: 'High-recovery 3-part abandoned cart email sequences that recover lost revenue',
    icon: '🛒',
    category: 'copywriting',
    placeholder: 'Enter product/store niche and any discount or guarantee offered (e.g. Premium leather messenger bag, offering 10% coupon code or free shipping)',
    label: 'Store Niche, Product & Incentive',
    promptTemplate: 'Write a high-converting 3-part abandoned cart recovery email sequence for: {topic}. Email 1 (Gentle reminder & social proof after 1 hour), Email 2 (Customer objection handling & FAQ after 24 hours), and Email 3 (Urgency, scarcity & exclusive discount code after 48 hours). Include catchy subject lines.',
    dateAdded: '2026-09-17'
  },
  'discount-promo-announcement': {
    title: 'Discount & Promo Announcement Writer',
    desc: 'High-urgency promotional banners, emails, and social blasts for flash sales',
    icon: '🏷️',
    category: 'copywriting',
    placeholder: 'Enter promotional offer, discount percentage, promo code, and expiration deadline (e.g. Summer Flash Sale 35% off all presets with code SUMMER35 ends Sunday midnight)',
    label: 'Offer Details, Discount % & Deadline',
    promptTemplate: 'Write a multi-channel flash sale promotional package for: {topic}. Include: 1) 3 Punchy Email Subject Lines, 2) Hero Email Announcement Copy, 3) Website Header Notification Banner, 4) Instagram/Twitter Promo Caption with emojis, and 5) SMS/Push Notification blast.',
    dateAdded: '2026-09-17'
  },
  'customer-onboarding-sequence': {
    title: 'Customer Onboarding Email Sequence',
    desc: 'Welcoming, value-driven email drips that activate users and reduce churn',
    icon: '👋',
    category: 'copywriting',
    placeholder: 'Enter SaaS app or membership type and the primary "Aha!" action users should take (e.g. Design tool where first action is creating their first custom template)',
    label: 'Product / Service & Key First Action',
    promptTemplate: 'Generate a 4-part customer onboarding email drip sequence for: {topic}. Email 1 (Warm Welcome & Instant Quick Win), Email 2 (Core Feature Walkthrough & Pro Tip), Email 3 (Case Study / Community Inspiration), and Email 4 (Feedback check-in & Personal Support Offer). Include engaging subject lines.',
    dateAdded: '2026-09-17'
  },
  'press-release-generator': {
    title: 'Press Release Generator',
    desc: 'AP-style media releases formatted with headlines, dateline, quotes, and boilerplate',
    icon: '📰',
    category: 'copywriting',
    placeholder: 'Enter company name, city, major announcement, key milestones, and spokesperson quote topic (e.g. NexaHealth launches AI diagnostic assistant after $10M Series A)',
    label: 'Announcement Details & Company Info',
    promptTemplate: 'Write a professional, AP-style press release for: {topic}. Include: FOR IMMEDIATE RELEASE header, compelling Headline & Subheadline, City/Date Dateline, Strong Opening Lead paragraph, Supporting Details & Metrics, Executive/Founder Quote, and About Company Boilerplate.',
    dateAdded: '2026-09-17'
  },
  'affiliate-promo-copy': {
    title: 'Affiliate Promo Copy Generator',
    desc: 'Authentic, FTC-compliant endorsement reviews, swipe emails, and social pitches',
    icon: '🤝',
    category: 'copywriting',
    placeholder: 'Enter affiliate product name, why you love it, target audience, and your unique affiliate bonus (e.g. Web hosting service with free WordPress migration guide bonus)',
    label: 'Affiliate Product, Target Niche & Special Bonus',
    promptTemplate: 'Create an authentic, FTC-compliant affiliate promotional copy toolkit for: {topic}. Include: 1) Short Honest Review Tweet/Thread, 2) Dedicated Affiliate Newsletter Email with soft CTA, 3) Instagram/TikTok Story Script mentioning disclosure, and 4) 3 Natural Callout Boxes for blog insertion.',
    dateAdded: '2026-09-17'
  },
  'pricing-page-copy': {
    title: 'Pricing Page Copy Generator',
    desc: 'Tiered plan descriptions, feature comparisons, and objection-busting microcopy',
    icon: '💳',
    category: 'copywriting',
    placeholder: 'Enter 3 pricing tier names, price points, and target user for each (e.g. Starter $19/mo for solo creators, Pro $49/mo for small teams, Enterprise custom for agencies)',
    label: 'Tiers, Pricing & Target Personas',
    promptTemplate: 'Write complete, conversion-optimized pricing page copy for: {topic}. For 3 tiers (Starter, Pro, Enterprise): provide a Catchy Tier Name, 1-Line Target Audience Hook, Ideal For, 5 Key Feature Bullets with benefit emphasis, CTA Button Text, and a "Most Popular" highlight badge snippet.',
    dateAdded: '2026-09-17'
  },

  // Category 4 (continued): Creative & Narrative (9 new tools)
  'fairy-tale-generator': {
    title: 'Fairy Tale Generator',
    desc: 'Whimsical, enchanting folklore tales featuring moral lessons and magical realms',
    icon: '🧚',
    category: 'creative',
    placeholder: 'Enter main character, enchanted setting, and central theme (e.g. A young clockmaker who discovers a pocket watch that pauses moonlight in an ancient forest)',
    label: 'Characters, Setting & Moral Lesson',
    promptTemplate: 'Write a rich, imaginative, and enchanting modern fairy tale about: {topic}. Include an evocative classic opening ("Once upon a time..."), an unexpected magical obstacle, playful whimsical dialogue, an emotional turning point, and a timeless moral resolution.',
    dateAdded: '2026-09-17'
  },
  'fan-fiction-starter': {
    title: 'Fan Fiction Starter',
    desc: 'Immersive chapter-one opening hooks and alternate universe premises for favorite fandoms',
    icon: '✨',
    category: 'creative',
    placeholder: 'Enter universe/fandom, featured characters, and Alternate Universe (AU) twist (e.g. Harry Potter universe where Neville Longbottom was the Chosen One)',
    label: 'Fandom, Characters & "What If?" Premise',
    promptTemplate: 'Generate 3 captivating fan fiction story starters for: {topic}. For each option provide: 1) Catchy Fanfic Title & Tropes/Tags, 2) The "What If?" Premise synopsis, and 3) A gripping opening Chapter One scene establishing the new reality.',
    dateAdded: '2026-09-17'
  },
  'horror-story-prompt': {
    title: 'Horror Story Prompt Generator',
    desc: 'Bone-chilling psychological, supernatural, and cosmic horror writing prompts',
    icon: '🕯️',
    category: 'creative',
    placeholder: 'Enter setting, subgenre, or fear trigger (e.g. Abandoned deep-sea research station, cosmic horror, isolation)',
    label: 'Horror Subgenre, Setting or Phobia',
    promptTemplate: 'Generate 6 spine-tingling, original horror story concepts for: {topic}. Group into: 2 Psychological Thriller scenarios, 2 Supernatural / Ghostly premises, and 2 Cosmic / Eldritch Dread premises. For each, give the Haunting Hook, The Escalation, and The Unsettling Twist.',
    dateAdded: '2026-09-17'
  },
  'plot-twist-generator': {
    title: 'Plot Twist Generator',
    desc: 'Shocking mid-story twists and climax reveals that redefine the entire narrative',
    icon: '🌪️',
    category: 'creative',
    placeholder: 'Enter story genre, current plot summary, and protagonist\'s goal (e.g. Detective investigating an art heist in Paris discovers clues left in their own handwriting)',
    label: 'Current Story Premise, Protagonist & Genre',
    promptTemplate: 'Brainstorm 5 mind-bending, unforgettable narrative plot twists for: {topic}. Provide: 1) The Unreliable Narrator Twist, 2) The Hidden Ally / Betrayal Twist, 3) The Temporal / Reality Shift Twist, 4) The Moral Reversal Twist, and 5) The Ultimate Climax Subversion.',
    dateAdded: '2026-09-17'
  },
  'myth-legend-creator': {
    title: 'Myth & Legend Creator',
    desc: 'Grand creation myths, heroic epics, and mythical deities complete with folklore traditions',
    icon: '🏛️',
    category: 'creative',
    placeholder: 'Enter natural phenomenon, hero, or cultural archetype to explain (e.g. Why the ocean glows with bioluminescence at night, guardian spirit of constellations)',
    label: 'Natural Phenomenon, Hero, or Pantheon Concept',
    promptTemplate: 'Craft an ancient, mythic legend explaining: {topic}. Structure with: 1) The Age of Gods / Primordial Origin, 2) The Tragic Flaw or Epic Quest of the Hero/Deity, 3) The Great Confrontation or Divine Curse, and 4) The Eternal Folklore Legacy and cultural ritual passed down to humans.',
    dateAdded: '2026-09-17'
  },
  'superhero-villain-origin': {
    title: 'Superhero & Villain Origin Generator',
    desc: 'Compelling hero and villain dossiers with power dynamics, tragedy, and costume aesthetics',
    icon: '🦸',
    category: 'creative',
    placeholder: 'Enter character alignment, core power concept, and city setting (e.g. Vigilante with soundwave manipulation in a rainy cyberpunk metropolis)',
    label: 'Core Power, Setting & Alignment (Hero or Villain)',
    promptTemplate: 'Create a fully developed comic-book style character origin dossier for: {topic}. Include: 1) Hero/Villain Alias & Real Name, 2) Inciting Traumatic Event / Origin Moment, 3) Unique Power Set & Severe Limitation/Vulnerability, 4) Signature Costume & Weaponry aesthetic, and 5) Core Philosophy / Arch-Nemesis dynamic.',
    dateAdded: '2026-09-17'
  },
  'fable-parable-writer': {
    title: 'Fable & Parable Writer',
    desc: 'Aesop-style short animal fables and allegorical parables that teach practical wisdom',
    icon: '🦊',
    category: 'creative',
    placeholder: 'Enter moral lesson or dilemma to illustrate (e.g. Greed leads to losing what you already cherish, featuring a crow and a river fox)',
    label: 'Core Moral / Lesson & Animal / Character Types',
    promptTemplate: 'Write an engaging, memorable Aesop-style fable or philosophical parable teaching: {topic}. Include memorable anthropomorphic characters, crisp symbolic dialogue, a clever narrative test of character, and end with the definitive bold moral aphorism ("Moral: ...").',
    dateAdded: '2026-09-17'
  },
  'dystopian-scenario-builder': {
    title: 'Dystopian Scenario Builder',
    desc: 'Fleshed-out dystopian regimes, oppressive societal rules, and underground rebellion sparks',
    icon: '🏙️',
    category: 'creative',
    placeholder: 'Enter societal restriction, mega-corporation, or technological mandate (e.g. Memories are taxed annually and deleted if subscription fees lapse)',
    label: 'Central Control Mechanism or Ecological Catastrophe',
    promptTemplate: 'Build a chilling, immersive dystopian world briefing based on: {topic}. Include: 1) The Ruling Regime & Official Propaganda Slogan, 2) The Surveillance & Enforcement Apparatus, 3) The Illusion of Peace / Everyday Citizen Life, 4) The Forbidden Luxury / Taboo, and 5) The Sparks of the Underground Resistance.',
    dateAdded: '2026-09-17'
  },
  'scifi-tech-describer': {
    title: 'Sci-Fi Tech & Gadget Describer',
    desc: 'Plausible speculative blueprints, quantum gizmos, and hard science-fiction device dossiers',
    icon: '🛰️',
    category: 'creative',
    placeholder: 'Enter technological concept or gadget function (e.g. Handheld gravitational lensing scanner used to detect cloaked starships)',
    label: 'Device Purpose, Theoretical Physics or Alien Element',
    promptTemplate: 'Generate a detailed speculative science fiction technical dossier for: {topic}. Include: 1) Technical Designation & Colloquial Nickname, 2) Underlying Theoretical Science, 3) Operating Instructions & Interface, 4) Hazardous Side Effects & Safety Failures, and 5) Black Market / Military applications.',
    dateAdded: '2026-09-17'
  },

  // Category 5 (continued): SEO & Discovery (9 new tools)
  'schema-markup-generator': {
    title: 'Schema Markup (JSON-LD) Generator',
    desc: 'Valid Google-compliant JSON-LD structured data for Articles, FAQs, Products & Local Biz',
    icon: '🧬',
    category: 'seo',
    placeholder: 'Enter schema type (e.g. Article, HowTo, Product, LocalBusiness, SoftwareApplication) and key fields (title, author, price, rating)',
    label: 'Schema Type, Entity Name & Page Details',
    promptTemplate: 'Generate a 100% valid, copy-pasteable Schema.org JSON-LD script block for: {topic}. Ensure full Google Rich Results compliance with all required and recommended fields, clean formatting, and instructions on how to insert in the HTML <head>.',
    dateAdded: '2026-09-17'
  },
  'breadcrumb-schema-helper': {
    title: 'Breadcrumb Schema Helper',
    desc: 'Hierarchical BreadcrumbList structured data for clean SERP navigation trails',
    icon: '🍞',
    category: 'seo',
    placeholder: 'Enter site navigation trail and URLs (e.g. Home > Tech Blog > Laptops > Best MacBook Accessories 2026)',
    label: 'Site URL Structure & Navigation Hierarchy',
    promptTemplate: 'Generate clean, valid Schema.org BreadcrumbList JSON-LD structured data for: {topic}. Include the ordered itemListElement array with proper positions, names, and item URLs, and provide the semantic HTML <nav aria-label="Breadcrumb"> fallback snippet.',
    dateAdded: '2026-09-17'
  },
  'voice-search-optimizer': {
    title: 'Voice Search Optimization Copywriter',
    desc: 'Conversational, natural-language Q&A snippets tailored for Siri, Alexa, and Google Assistant',
    icon: '🎙️',
    category: 'seo',
    placeholder: 'Enter user question or service query (e.g. What is the fastest way to defrost chicken safely without a microwave?)',
    label: 'Target Topic, Question or Local Service',
    promptTemplate: 'Optimize content for conversational voice search queries for: {topic}. Generate: 1) 5 Natural Spoken Question variations, 2) A 29-word direct "Golden Snippet" answer designed to be read aloud by voice assistants, 3) 3 Conversational Follow-up Q&As, and 4) Phonetic keyword integration tips.',
    dateAdded: '2026-09-17'
  },
  'related-searches-expander': {
    title: 'Related Searches Topic Expander',
    desc: 'Semantic search lateral associations and "Searches Related To" query webs',
    icon: '🌐',
    category: 'seo',
    placeholder: 'Enter primary seed keyword (e.g. Podcasting Equipment for Beginners)',
    label: 'Core Keyword / Search Entity',
    promptTemplate: 'Generate a comprehensive semantic topic map and related search query web for: {topic}. Group into: 1) Adjacent Concepts & Prerequisites (8 queries), 2) Alternative Solutions & Competitors (8 queries), 3) Cost & Budget Considerations (6 queries), and 4) Advanced / Pro Next Steps (6 queries).',
    dateAdded: '2026-09-17'
  },
  'anchor-text-variety-builder': {
    title: 'Anchor Text Variety Builder',
    desc: 'Natural, penalty-safe internal and backlink anchor text distribution profiles',
    icon: '⚓',
    category: 'seo',
    placeholder: 'Enter target URL topic and brand name (e.g. Target: Comprehensive Guide to Sourdough Bread, Brand: ArtisanBake)',
    label: 'Target Page Topic, URL & Brand Name',
    promptTemplate: 'Create a natural, algorithmic-penalty-safe anchor text distribution plan for: {topic}. Provide 30 anchor texts grouped into: Exact Match (4), Partial / Broad Match (8), Branded & Domain (6), Topical Synonyms (8), and Natural Conversational (4).',
    dateAdded: '2026-09-17'
  },
  'content-refresh-suggestor': {
    title: 'Content Refresh & Update Suggestor',
    desc: 'Actionable audit checklists to revitalize stale articles and recover lost organic rankings',
    icon: '🔄',
    category: 'seo',
    placeholder: 'Enter existing blog post title and topic (e.g. Best SEO Strategies from 2023 that have lost traffic)',
    label: 'Existing Article Title, Topic & Current Year',
    promptTemplate: 'Generate a high-impact Content Refresh & Historical SEO Optimization plan for: {topic}. Include: 1) Outdated Concepts & Stats to Replace, 2) 4 Fresh Trending Subtopics to Add, 3) Title & Meta Tag Modernization for the current year, 4) Visual Media & Schema upgrades, and 5) Internal Linking opportunities.',
    dateAdded: '2026-09-17'
  },
  'search-engine-snippet-optimizer': {
    title: 'Search Engine Snippet Optimizer',
    desc: 'Snippets engineered to capture Position Zero across definition, table, and list formats',
    icon: '🎯',
    category: 'seo',
    placeholder: 'Enter target Google query (e.g. How to change a car battery safely)',
    label: 'Target Search Query / Intent',
    promptTemplate: 'Format content to win Google\'s Position Zero (Featured Snippet) for: {topic}. Output the 3 highest-probability snippet layouts: 1) The 42-word Crisp Definition Paragraph, 2) The 6-step Numbered Action Process, and 3) A Clean 4x3 Markdown Comparison Table with bold headers.',
    dateAdded: '2026-09-17'
  },
  'tofu-topic-finder': {
    title: 'Top-of-Funnel (TOFU) Topic Finder',
    desc: 'High-volume, broad educational awareness queries that attract massive new audiences',
    icon: '📢',
    category: 'seo',
    placeholder: 'Enter niche or product (e.g. Specialty Matcha Tea and Accessories)',
    label: 'Industry, Niche or Core Product',
    promptTemplate: 'Brainstorm 15 high-volume Top-of-Funnel (TOFU) educational content topics for: {topic}. Group by content format: 1) "What is..." / Beginner Guides (5), 2) "Common Myths & Mistakes" (5), and 3) "Curiosity & Trend Explanations" (5). Include search intent notes for each.',
    dateAdded: '2026-09-17'
  },
  'bofu-comparison-copywriter': {
    title: 'Bottom-of-Funnel (BOFU) Comparison Copy',
    desc: 'High-conversion "X vs Y" comparison pages and alternative reviews that close deals',
    icon: '⚖️',
    category: 'seo',
    placeholder: 'Enter your solution vs main competitor (e.g. Notion vs Obsidian for personal knowledge management)',
    label: 'Your Product vs Competitor / Alternative',
    promptTemplate: 'Write high-converting, objective Bottom-of-Funnel (BOFU) comparison copy for: {topic}. Include: 1) Neutral "At a Glance" Executive Summary, 2) Feature-by-Feature Comparison Matrix Breakdown, 3) "Choose [Option A] if you need..." vs "Choose [Option B] if you need...", and 4) Final Objective Buying Verdict with low-friction CTA.',
    dateAdded: '2026-09-17'
  },

  // Category 6 (continued): Technical & Code (8 new tools)
  'dockerfile-generator': {
    title: 'Dockerfile Generator',
    desc: 'Production-ready, multi-stage Dockerfiles with security hardening and caching layers',
    icon: '🐳',
    category: 'technical',
    placeholder: 'Enter runtime, framework, Node/Python/Go version, build step, and port (e.g. Node.js 20, Vite React build + Express server, port 3000)',
    label: 'Tech Stack, Framework, Version & Port',
    promptTemplate: 'Generate an optimized, production-grade, multi-stage Dockerfile and companion .dockerignore file for: {topic}. Include security best practices (non-root user, slim base image, layer caching, NODE_ENV=production, and healthcheck directive) with line-by-line comments.',
    dateAdded: '2026-09-17'
  },
  'crontab-builder-ai': {
    title: 'Crontab Expression Explainer & Builder',
    desc: 'Plain-English translation of cron schedules and custom recurring syntax generation',
    icon: '⏰',
    category: 'technical',
    placeholder: 'Enter frequency in plain English or a cron string (e.g. Every Monday, Wednesday, and Friday at 4:30 AM or 0 22 * * 1-5)',
    label: 'Desired Schedule or Existing Cron Expression',
    promptTemplate: 'Explain or generate the exact Crontab syntax for: {topic}. Output: 1) The 5-field Cron Expression (Minute, Hour, Day of Month, Month, Day of Week), 2) Plain-English Schedule Breakdown, 3) Human-readable Next 5 execution times, and 4) Example terminal command line with logging redirect.',
    dateAdded: '2026-09-17'
  },
  'git-commit-formatter': {
    title: 'Git Commit Message Formatter',
    desc: 'Conventional Commits messages (feat, fix, chore, refactor) based on diff descriptions',
    icon: '🌿',
    category: 'technical',
    placeholder: 'Enter summary of changes made (e.g. Added JWT refresh token rotation, fixed token expiry bug in auth middleware, updated unit tests)',
    label: 'Code Changes, Bug Fixed or Feature Added',
    promptTemplate: 'Generate 3 Conventional Commits-compliant commit message options for: {topic}. Include: 1) Short 50-character Subject Line with proper type prefix (feat:, fix:, refactor:, chore:, docs:), 2) Detailed bulleted body explaining "why" not just "what", and 3) BREAKING CHANGE or closes issue footer if applicable.',
    dateAdded: '2026-09-17'
  },
  'markdown-doc-formatter': {
    title: 'Markdown Table & Doc Formatter',
    desc: 'Clean GitHub-flavored Markdown tables, callout blocks, and documentation layouts',
    icon: '📝',
    category: 'technical',
    placeholder: 'Enter raw data, list of items with properties, or unstructured notes to convert into clean Markdown',
    label: 'Data / Outline to Format as Markdown',
    promptTemplate: 'Format the provided data or technical notes into clean, professional GitHub-flavored Markdown for: {topic}. Include an aligned Markdown Table with bold headers, styled blockquote callouts (> [!NOTE] or > [!TIP]), code blocks with language syntax highlighting, and nested task list checklists.',
    dateAdded: '2026-09-17'
  },
  'http-status-code-fixer': {
    title: 'HTTP Status Code Explainer & Fixer',
    desc: 'Root causes, debugging checklists, and client/server solutions for HTTP errors',
    icon: '🚦',
    category: 'technical',
    placeholder: 'Enter HTTP code and situation (e.g. 403 Forbidden on S3 upload, 502 Bad Gateway behind Nginx proxy, or 429 Too Many Requests)',
    label: 'HTTP Status Code & API / Web Context',
    promptTemplate: 'Provide an exhaustive technical diagnosis and resolution guide for HTTP Status: {topic}. Include: 1) Official RFC Definition, 2) Top 4 Real-World Root Causes, 3) Client-Side Debugging Steps & Headers, 4) Server-Side / Proxy Fixes, and 5) Best-practice error handling code snippet.',
    dateAdded: '2026-09-17'
  },
  'semantic-versioning-helper': {
    title: 'Semantic Versioning (SemVer) Helper',
    desc: 'Determine proper Major.Minor.Patch increments and release changelog highlights',
    icon: '🏷️',
    category: 'technical',
    placeholder: 'Enter current version and what changed (e.g. Current v1.4.2, removed deprecated API parameter and added optional dark mode setting)',
    label: 'Current Version & List of Changes',
    promptTemplate: 'Analyze the changes for: {topic} according to SemVer 2.0.0 rules (MAJOR.MINOR.PATCH). Output: 1) Exact Recommended New Version Number, 2) Technical Justification (why Major, Minor, or Patch), 3) Migration Warning for users (if breaking), and 4) Clean Keep-a-Changelog Markdown snippet.',
    dateAdded: '2026-09-17'
  },
  'env-template-builder': {
    title: 'Environment Variable (.env) Builder',
    desc: 'Safe, well-documented .env.example templates with validation schemas and dummy defaults',
    icon: '🔐',
    category: 'technical',
    placeholder: 'Enter stack components needing secrets (e.g. PostgreSQL, Redis, Stripe, AWS S3, SendGrid, Port 3000)',
    label: 'Services, Databases & APIs Used',
    promptTemplate: 'Create a comprehensive, production-ready .env.example file and companion validation guide for: {topic}. Include: Clean logical grouping comments, variable names in UPPER_SNAKE_CASE with explanatory comments, safe placeholder values (NO actual secrets), and a Zod/TypeScript runtime validation schema snippet.',
    dateAdded: '2026-09-17'
  },
  'jsdoc-typedoc-generator': {
    title: 'JSDoc & TypeDoc Comment Generator',
    desc: 'Exhaustive documentation comments with @param, @returns, @throws, and @example',
    icon: '📚',
    category: 'technical',
    placeholder: 'Paste function signature or code snippet (e.g. async function fetchUserOrders(userId: string, options?: PaginationOptions): Promise<Order[]>)',
    label: 'JavaScript / TypeScript Function or Class',
    promptTemplate: 'Generate complete, professional JSDoc / TypeDoc comments for: {topic}. Include: 1-sentence function overview, detailed description, @param tags with types and descriptions, @returns explanation, @throws error conditions, @example code block, and @see / @deprecated tags where appropriate.',
    dateAdded: '2026-09-17'
  },

  // Category 2 (continued): Social & Growth (8 new tools)
  'quote-card-text-generator': {
    title: 'Quote Card Text Generator',
    desc: 'High-impact, shareable micro-quotes paired with design aesthetic direction',
    icon: '💬',
    category: 'social',
    placeholder: 'Enter topic or theme (e.g. Overcoming imposter syndrome for junior developers, grit in entrepreneurship)',
    label: 'Topic, Philosophy or Niche',
    promptTemplate: 'Generate 8 punchy, highly shareable visual quote card lines on: {topic}. For each quote provide: 1) The memorable quote text (under 20 words), 2) Suggested visual typography vibe, and 3) Recommended background color palette & icon accent.',
    dateAdded: '2026-09-17'
  },
  'question-of-the-day': {
    title: 'Question of the Day Generator',
    desc: 'Thought-provoking, low-friction community questions that trigger massive comment sections',
    icon: '❓',
    category: 'social',
    placeholder: 'Enter community niche (e.g. Remote software engineers, indie game creators, fitness enthusiasts)',
    label: 'Community Niche or Industry Topic',
    promptTemplate: 'Generate 10 irresistible "Question of the Day" discussion starters for: {topic}. Group into: 3 "This or That / Battle" choices, 3 "Hot Takes / Unpopular Opinions", 2 "Share Your Win / Progress", and 2 "Vulnerable Advice / Lesson Learned". Provide an engaging follow-up comment for each.',
    dateAdded: '2026-09-17'
  },
  'meme-caption-writer': {
    title: 'Meme Caption & Format Writer',
    desc: 'Relatable, culturally attuned meme captions paired with trending meme template pairings',
    icon: '😂',
    category: 'social',
    placeholder: 'Enter creator/workplace struggle or funny reality (e.g. Fixing a bug at 4:59 PM on a Friday only to break production)',
    label: 'Relatable Situation, Frustration or Niche',
    promptTemplate: 'Generate 5 hilarious, hyper-relatable meme concepts for: {topic}. For each concept provide: 1) Best Meme Template Match, 2) Top Text / Setup, 3) Bottom Text / Punchline, and 4) Short-form social caption with emojis.',
    dateAdded: '2026-09-17'
  },
  'event-webinar-promo': {
    title: 'Event & Webinar Promo Copywriter',
    desc: 'Multi-stage event invitations, speaker spotlight posts, and "Last Chance" reminders',
    icon: '🎟️',
    category: 'social',
    placeholder: 'Enter event name, host/guest, date/time, and core promise (e.g. Live Masterclass: Scaling YouTube to $10k/mo with Jane Doe, Thursday 2 PM EST)',
    label: 'Event Title, Speaker, Date & Key Takeaway',
    promptTemplate: 'Write a high-converting promotional campaign package for this event/webinar: {topic}. Include: 1) Initial LinkedIn/Twitter Announcement Post with registration link, 2) Speaker Spotlight & Core Takeaways Post, 3) "24 Hours Left / Seats Filling" Urgency Post, and 4) 1-Hour Countdown Reminder blast.',
    dateAdded: '2026-09-17'
  },
  'case-study-hook-generator': {
    title: 'Case Study Hook & Teaser Generator',
    desc: 'Metric-driven transformation hooks and teaser threads that showcase client results',
    icon: '📊',
    category: 'social',
    placeholder: 'Enter client context and key metrics (e.g. B2B SaaS went from $10k to $85k MRR in 6 months using cold email outbound)',
    label: 'Client Niche, Starting Point & Measurable Result',
    promptTemplate: 'Generate 4 compelling case study hook variations on: {topic}: 1) The "Before vs After" Contrast Post, 2) The "Step-by-Step Breakdown" Thread Hook, 3) The Metric-Shock One-Liner, and 4) The Key Lesson Learned Carousel Cover Headline.',
    dateAdded: '2026-09-17'
  },
  'social-media-challenge-creator': {
    title: 'Social Media Challenge Creator',
    desc: 'Viral 7-day, 14-day, or 30-day community challenge frameworks with daily prompts',
    icon: '🏆',
    category: 'social',
    placeholder: 'Enter challenge concept and target duration (e.g. 7-Day Creative Writing Sprint: Write 250 words daily)',
    label: 'Challenge Theme, Duration & Transformation',
    promptTemplate: 'Design an addictive, community-building social media challenge for: {topic}. Provide: 1) Catchy Challenge Name & Branded Hashtag, 2) Rules & How to Participate, 3) Daily Prompt Schedule for each day with clear action tasks, and 4) Milestone celebration badge idea for finishers.',
    dateAdded: '2026-09-17'
  },
  'milestone-celebration-post': {
    title: 'Milestone & Celebration Post Writer',
    desc: 'Humble, authentic celebration posts for subscriber goals, revenue marks, or anniversaries',
    icon: '🎉',
    category: 'social',
    placeholder: 'Enter milestone reached (e.g. Just hit 100,000 YouTube subscribers after 3 years of weekly uploads)',
    label: 'Milestone Achieved, Journey Highlights & Gratitude',
    promptTemplate: 'Write 3 authentic milestone celebration posts for: {topic}: 1) Storytelling & Vulnerable Journey (highlighting early struggles, doubts, and breakthroughs), 2) Data & Lessons Learned (3 biggest takeaways to help the reader), and 3) Gratitude & Community Celebration (thanking audience with a giveaway or celebration AMA).',
    dateAdded: '2026-09-17'
  },
  'ama-question-generator': {
    title: 'AMA (Ask Me Anything) Question Generator',
    desc: 'High-value starter prompts and audience icebreakers for Reddit, Instagram & Discord AMAs',
    icon: '🎙️',
    category: 'social',
    placeholder: 'Enter host background and AMA theme (e.g. Former Netflix Senior Engineer answering questions about system design and career growth)',
    label: 'Host Expertise, Background & Topic',
    promptTemplate: 'Generate 15 engaging, insightful AMA (Ask Me Anything) starter questions for: {topic}. Group into: 1) Industry Insider & Technical Realities (5), 2) Career Struggles, Failures & Lessons (5), and 3) Fun, Unconventional & Rapid-Fire Personal Questions (5).',
    dateAdded: '2026-09-17'
  },

  // Category 1 (continued): Video & Scripting (7 new tools)
  'video-intro-rewriter': {
    title: 'Video Intro & Hook Rewriter',
    desc: 'Transform slow, rambling video openings into instant 5-second retention hooks',
    icon: '🎣',
    category: 'video',
    placeholder: 'Paste your current video opening or summarize how you usually start the video (e.g. "Hey guys, welcome back to my channel, today we are going to talk about...")',
    label: 'Current Video Intro or Rough Opening Script',
    promptTemplate: 'Analyze and rewrite the following video opening for: {topic}. Provide 4 punchy, high-retention alternatives: 1) The Visual Cold Open with immediate payoff, 2) The High-Stakes Question, 3) The Bold Contrarian Claim, and 4) The "If-You-Want-X" Direct Benefit Hook. Cut all generic fluff.',
    dateAdded: '2026-09-17'
  },
  'youtube-chapter-timestamps': {
    title: 'YouTube Chapter Timestamps Generator',
    desc: 'Search-optimized video chapter titles with realistic timestamps for key moments',
    icon: '⏱️',
    category: 'video',
    placeholder: 'Enter total video length and outline or bullet points (e.g. 15-minute complete guide to building a mechanical keyboard)',
    label: 'Video Topic, Duration & Section Summary',
    promptTemplate: 'Generate search-optimized, high-CTR YouTube chapter timestamps for: {topic}. Output clean timestamps starting at 00:00 through the full duration. Write descriptive, curiosity-sparking chapter titles that incorporate SEO search terms rather than generic labels.',
    dateAdded: '2026-09-17'
  },
  'video-pacing-retention-doctor': {
    title: 'Video Pacing & Retention Script Doctor',
    desc: 'Identify retention drop-off zones and inject pattern interrupts, visual resets, and b-roll',
    icon: '🩺',
    category: 'video',
    placeholder: 'Paste script section or describe the flow where viewers might get bored (e.g. Middle 5 minutes explaining dry technical architecture)',
    label: 'Video Draft Script or Detailed Section Outline',
    promptTemplate: 'Diagnose and inject high-retention pacing into this video concept: {topic}. Provide: 1) 4 Specific Retention Leak Points to watch for, 2) 5 Pattern Interrupt ideas, 3) Strategic open-loop cliffhangers to insert every 2 minutes, and 4) Revised dynamic script snippet.',
    dateAdded: '2026-09-17'
  },
  'b-roll-concept-planner': {
    title: 'B-Roll Concept Planner',
    desc: 'Categorized cutaway shot list with camera movement, lighting, and visual metaphor ideas',
    icon: '🎥',
    category: 'video',
    placeholder: 'Enter video topic and visual aesthetic (e.g. Minimalist desk setup tour, cinematic mood with moody neon and warm desk lamps)',
    label: 'Video Scene Topic & Aesthetic Style',
    promptTemplate: 'Create a comprehensive, cinematic B-Roll shot list for: {topic}. Group into: 1) Close-Up Macro Shots, 2) Dynamic Camera Movement Shots, 3) Environmental / Establishing Shots, and 4) Abstract Visual Metaphors.',
    dateAdded: '2026-09-17'
  },
  'livestream-agenda-planner': {
    title: 'Livestream Agenda & Run-of-Show Planner',
    desc: 'Structured broadcast rundowns with countdowns, engagement breaks, and technical buffers',
    icon: '📡',
    category: 'video',
    placeholder: 'Enter livestream theme and duration (e.g. 2-Hour Live Q&A and Project Roast with audience chat)',
    label: 'Stream Topic, Target Duration & Special Segments',
    promptTemplate: 'Generate a minute-by-minute Livestream Run-of-Show Agenda for: {topic}. Include: 1) Pre-Stream Countdown, 2) Welcoming & Chat Shoutouts, 3) Core Content Segment blocks with interactive poll cues, 4) Mid-Stream Engagement Check-in, 5) Rapid-Fire Q&A, and 6) Outro, Raid/Reroute, and Next Stream announcement.',
    dateAdded: '2026-09-17'
  },
  'sponsor-segment-transition': {
    title: 'Sponsor Segment Transition Writer',
    desc: 'Natural, non-cringe bridges from video content into paid brand integrations',
    icon: '🤝',
    category: 'video',
    placeholder: 'Enter video subject and sponsor product (e.g. Video about digital security, sponsor is password manager 1Password)',
    label: 'Video Topic & Sponsor Brand / Product',
    promptTemplate: 'Write 3 seamless, entertaining, and natural sponsor integration scripts connecting: {topic}. Include: 1) The Natural Thematic Bridge, 2) The 45-second Core Ad Read with personal endorsement, and 3) The Smooth Re-entry Transition back into the video without breaking viewer retention.',
    dateAdded: '2026-09-17'
  },
  'video-endscreen-annotation': {
    title: 'Video End-Screen Annotation Copywriter',
    desc: 'High-converting spoken sign-offs and on-screen cards that drive next-video clicks',
    icon: '📺',
    category: 'video',
    placeholder: 'Enter current video topic and the exact next video you want viewers to watch (e.g. Finished video on beginner Python, next video is building 5 real Python projects)',
    label: 'Current Video Topic & Recommended Next Video',
    promptTemplate: 'Write 4 high-converting YouTube End-Screen outro spoken scripts and card layouts for: {topic}. Focus on maximizing session watch time by pitching the recommended next video with an urgent curiosity hook, natural subscribe button trigger, and playlist link.',
    dateAdded: '2026-09-17'
  }
};
