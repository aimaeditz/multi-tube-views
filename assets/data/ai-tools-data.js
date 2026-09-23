/**
 * Multi Tube Views (MTV) — 211 AI Tools Data Directory
 * Structured metadata for 211 dedicated AI generative tools across 6 core categories.
 */

export const AI_CATEGORIES = [
  {
    "id": "all",
    "name": "All Tools",
    "count": 211
  },
  {
    "id": "video",
    "name": "Video & Scripting",
    "count": 34
  },
  {
    "id": "social",
    "name": "Social & Growth",
    "count": 35
  },
  {
    "id": "copywriting",
    "name": "Copywriting & Sales",
    "count": 37
  },
  {
    "id": "creative",
    "name": "Creative & Narrative",
    "count": 35
  },
  {
    "id": "seo",
    "name": "SEO & Discovery",
    "count": 35
  },
  {
    "id": "technical",
    "name": "Technical & Code",
    "count": 35
  }
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
  'youtube-shorts-hook-rewriter': {
    title: 'YouTube Shorts Hook Rewriter',
    desc: 'High-retention 3-second visual and spoken hook variations for vertical short-form video',
    icon: '⚡',
    category: 'video',
    placeholder: 'Enter your Shorts topic or premise (e.g. 3 Hidden iPhone Features Nobody Uses)',
    label: 'Shorts Topic / Core Idea',
    promptTemplate: 'Generate 10 high-retention 3-second visual and spoken hook variations for YouTube Shorts / Reels on topic: {topic}. Include text overlay and visual action cues.',
    dateAdded: '2026-09-19'
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
  'bug-log-troubleshooter': {
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
  },

  // --- 50 NEW TOOLS (Batch 2 of 3) ---
  'video-outro-script': {
    "title": "Video Outro Script Generator",
    "desc": "High-retention outro scripts with subscribe CTAs, playlist recommendations, and end-screen cues",
    "icon": "🎬",
    "category": "video",
    "placeholder": "Enter video topic, next video recommendation & primary CTA (e.g. Full-stack React tutorial, recommend Next.js deep dive, CTA to star GitHub repo)",
    "label": "Video Topic, Recommended Next Video & Primary CTA",
    "promptTemplate": "Write 3 high-converting video outro scripts for: {topic}. Include precise spoken dialogue, end-screen visual cue timing [END-SCREEN CARD], natural subscribe hook, and an urgent reason to click the recommended next video.",
    "dateAdded": "2026-09-18"
  },
  'product-demo-script': {
    "title": "Product Demo Script Generator",
    "desc": "Structured walkthrough scripts highlighting pain points, key features, and user benefits",
    "icon": "📱",
    "category": "video",
    "placeholder": "Enter product name, target user, core problem & key features (e.g. TaskFlow AI project management for freelance designers)",
    "label": "Product Name, Target User, Problem & Key Features",
    "promptTemplate": "Write a compelling product demo video script for: {topic}. Structure with: 1) The 10-second relatable pain point hook, 2) The \"Aha!\" moment feature walkthrough, 3) 3 core benefit highlights with screen recording prompts, and 4) A frictionless call-to-action.",
    "dateAdded": "2026-09-18"
  },
  'webinar-script-generator': {
    "title": "Webinar Script Generator",
    "desc": "End-to-end presentation scripts with hook, teaching segments, audience engagement, and pitch",
    "icon": "🎙️",
    "category": "video",
    "placeholder": "Enter webinar topic, audience, 3 teaching pillars & offer details (e.g. Zero to 10k Newsletter Subscribers for creators, offer is cohort coaching)",
    "label": "Webinar Topic, Audience, Core Lessons & Offer Pitch",
    "promptTemplate": "Create an engaging webinar presentation script outline for: {topic}. Include: 1) High-energy welcome & expectation setting, 2) Story of transformation, 3) 3 actionable teaching frameworks with chat interaction prompts, 4) Natural transition into the offer, and 5) Q&A objection-handling rundown.",
    "dateAdded": "2026-09-18"
  },
  'explainer-video-script': {
    "title": "Explainer Video Script Generator",
    "desc": "60-to-90 second animated or live-action explainer scripts with visual stage directions",
    "icon": "💡",
    "category": "video",
    "placeholder": "Enter product/service, core problem, unique mechanism & visual aesthetic (e.g. EcoBox zero-waste grocery refills, 2D motion graphics)",
    "label": "Product/Service, Problem, Mechanism & Visual Style",
    "promptTemplate": "Write a 60-to-90 second explainer video script for: {topic}. Format with dual columns: [AUDIO / SPOKEN VOICE] and [VISUAL STAGE DIRECTIONS]. Emphasize problem, solution, unique mechanism, and final CTA.",
    "dateAdded": "2026-09-18"
  },
  'video-ad-script-generator': {
    "title": "Video Ad Script Generator",
    "desc": "High-converting direct response video ad scripts with hook variations and problem-agitate-solve structure",
    "icon": "📣",
    "category": "video",
    "placeholder": "Enter product/service, target audience, primary pain point & special offer (e.g. Ergonomic lumbar cushion for remote workers, 30% off launch)",
    "label": "Product/Service, Target Audience, Problem & Offer",
    "promptTemplate": "Write 3 high-converting direct response video ad scripts for: {topic}. For each ad provide: 3 hook variations (visual + verbal), Problem Agitation, Solution Introduction, Social Proof prompt, and Clear Urgency CTA.",
    "dateAdded": "2026-09-18"
  },
  'course-lecture-script': {
    "title": "Course Lecture Script Generator",
    "desc": "Structured educational lecture scripts with learning objectives, analogies, and student exercises",
    "icon": "🎓",
    "category": "video",
    "placeholder": "Enter lecture topic, module title, learning objective & target skill level (e.g. Understanding Async/Await in JavaScript, for intermediate students)",
    "label": "Lecture Topic, Learning Objective & Skill Level",
    "promptTemplate": "Write a structured online course lecture script for: {topic}. Include: 1) What we are building today & why it matters, 2) Core concept explanation using a vivid real-world analogy, 3) Step-by-step code/concept walkthrough, 4) Common beginner pitfalls to avoid, and 5) Student action challenge.",
    "dateAdded": "2026-09-18"
  },
  'livestream-talking-points': {
    "title": "Live Stream Talking Points Generator",
    "desc": "Bulleted speaking notes, transition prompts, and chat-interaction cues for confident streaming",
    "icon": "🔴",
    "category": "video",
    "placeholder": "Enter stream theme, key news/milestones & community discussion topics (e.g. Celebrating 50k subs, discussing channel roadmap, Q&A)",
    "label": "Stream Topic, Main Discussion Pillars & Chat Cues",
    "promptTemplate": "Generate a clean, bulleted Live Stream Talking Points card for: {topic}. Group by: 1) Stream Warmup & Sound Check, 2) Key Talking Point Pillars with chat conversation starters, 3) Seamless segment transitions, 4) Mid-stream poll idea, and 5) Sign-off announcements.",
    "dateAdded": "2026-09-18"
  },
  'video-chapter-timestamp-generator': {
    "title": "Video Chapter/Timestamp Generator",
    "desc": "Precise, SEO-optimized timestamp markers and descriptive chapter titles for long-form video",
    "icon": "⏱️",
    "category": "video",
    "placeholder": "Enter video transcript, outline, or milestone notes (e.g. 45-min podcast on SaaS pricing, MVP launch, churn reduction, Q&A)",
    "label": "Video Outline, Transcript or Key Topic Timings",
    "promptTemplate": "Create an SEO-optimized YouTube Chapter and Timestamp list based on: {topic}. Format strictly with 00:00 start, clear benefit-driven chapter titles that rank in search, and a formatted block ready to paste into YouTube descriptions.",
    "dateAdded": "2026-09-18"
  },
  'hashtag-research-assistant': {
    "title": "Hashtag Research Assistant",
    "desc": "Categorized hashtag clusters balancing broad reach, niche community, and high-relevance tags",
    "icon": "#️⃣",
    "category": "social",
    "placeholder": "Enter content topic, target platform (Instagram/TikTok/LinkedIn) & niche audience (e.g. Minimalist desk setups, Instagram Reels)",
    "label": "Topic, Target Platform & Specific Niche",
    "promptTemplate": "Generate 4 strategic hashtag clusters for: {topic}. Categorize into: 1) High-Volume Broad Tags (1M+ reach), 2) Mid-Volume Niche Community Tags (100k-500k), 3) Hyper-Targeted Micro Tags (<50k), and 4) Branded/Campaign Tags. Include best-practice placement advice.",
    "dateAdded": "2026-09-18"
  },
  'social-content-batch-planner': {
    "title": "Social Media Content Batch Planner",
    "desc": "7-day to 30-day multi-format content calendars with content pillars, hooks, and format cues",
    "icon": "📅",
    "category": "social",
    "placeholder": "Enter your niche, target platform, posting frequency & primary goal (e.g. B2B SaaS growth consultant on LinkedIn, 5 posts/week, inbound leads)",
    "label": "Niche, Platform, Frequency & Growth Goal",
    "promptTemplate": "Create a comprehensive 7-day social media content batch plan for: {topic}. For each day specify: Content Pillar (Authority, Empathy, Education, Proof, Conversion), Hook line, Recommended Format (Carousel, Text, Video), Core Takeaway, and Engagement Question.",
    "dateAdded": "2026-09-18"
  },
  'engagement-bait-question': {
    "title": "Engagement Bait Question Generator",
    "desc": "Irresistible debate questions, hot takes, and fill-in-the-blanks to trigger massive comment activity",
    "icon": "🎣",
    "category": "social",
    "placeholder": "Enter industry or topic & target audience (e.g. Remote work vs return to office, software engineers and managers)",
    "label": "Topic / Industry & Audience Dynamic",
    "promptTemplate": "Generate 15 irresistible comment-triggering engagement questions for: {topic}. Categorize by style: 1) The Unpopular Opinion / Hot Take, 2) The \"This or That\" Dilemma, 3) The Fill-in-the-Blank, 4) The Relatable Confession, and 5) The Career Dilemma.",
    "dateAdded": "2026-09-18"
  },
  'trend-jacking-post': {
    "title": "Trend-Jacking Post Generator",
    "desc": "Culturally timely social media posts that cleverly connect trending news or memes to your brand",
    "icon": "⚡",
    "category": "social",
    "placeholder": "Enter trending news/meme & your brand or industry niche (e.g. New viral Apple feature announcement, applied to freelance productivity)",
    "label": "Trending Topic/Meme & Your Brand Niche",
    "promptTemplate": "Write 4 clever, authentic trend-jacking social posts connecting: {topic}. Include options for X/Twitter, LinkedIn, and Instagram. Ensure the connection to the niche feels natural, insightful, and entertaining rather than forced.",
    "dateAdded": "2026-09-18"
  },
  'follower-growth-strategy': {
    "title": "Follower Growth Strategy Outline",
    "desc": "Comprehensive organic growth roadmaps covering profile optimization, posting cadence, and collab tactics",
    "icon": "📈",
    "category": "social",
    "placeholder": "Enter current follower count, target platform, niche & 90-day growth goal (e.g. 2,500 followers on X, AI automation niche, goal 25k)",
    "label": "Current Status, Platform, Niche & 90-Day Goal",
    "promptTemplate": "Develop an actionable 90-day organic follower growth blueprint for: {topic}. Structure into: 1) Profile & Bio Conversion Audit, 2) High-Leverage Content Strategy (daily cadence & formats), 3) Outbound Engagement & Networking protocol, and 4) Weekly milestone targets.",
    "dateAdded": "2026-09-18"
  },
  'cross-platform-repost-adapter': {
    "title": "Cross-Platform Repost Adapter",
    "desc": "Repurpose a single winning post across X, LinkedIn, Instagram captions, and short video scripts",
    "icon": "🔄",
    "category": "social",
    "placeholder": "Paste your original post, article excerpt, or core insight (e.g. Thread about why building in public creates loyal customers)",
    "label": "Original Post / Core Insight to Repurpose",
    "promptTemplate": "Adapt this piece of content into 4 platform-native variations for: {topic}. Provide: 1) Punchy X/Twitter Post or Thread Hook, 2) Polished LinkedIn Post with line breaks and professional framing, 3) Engaging Instagram Caption with carousel slide cues, and 4) 30-second Short/Reel spoken script.",
    "dateAdded": "2026-09-18"
  },
  'live-qa-question-generator': {
    "title": "Live Q&A Question Generator",
    "desc": "Thought-provoking seed questions and audience prompts to keep live streams and webinars engaging",
    "icon": "💬",
    "category": "social",
    "placeholder": "Enter event topic, speaker/guest background & audience type (e.g. Ask-Me-Anything with seed stage venture capitalist for SaaS founders)",
    "label": "Event Topic, Speaker Background & Audience",
    "promptTemplate": "Generate 15 engaging, insightful Q&A questions for: {topic}. Group into: 1) Warmup / Icebreaker Questions, 2) Deep-Dive Technical / Strategic Questions, 3) Contrarian / Challenge Questions, and 4) Practical \"How-To\" Questions.",
    "dateAdded": "2026-09-18"
  },
  'community-challenge-idea-generator': {
    "title": "Community Challenge Idea Generator",
    "desc": "7-day, 14-day, or 30-day interactive challenges with daily prompts, gamification, and hashtag ideas",
    "icon": "🏆",
    "category": "social",
    "placeholder": "Enter community niche, challenge duration & desired participant goal (e.g. Daily writing habit challenge for fiction writers, 14 days, Discord group)",
    "label": "Niche, Duration & Participant Transformation",
    "promptTemplate": "Design a viral, high-completion community challenge blueprint for: {topic}. Include: Catchy Challenge Name, Hashtag, Rules of Engagement, Daily prompt schedule with quick-win milestones, Accountability mechanics, and Celebration finale.",
    "dateAdded": "2026-09-18"
  },
  'subscription-cancellation-save-offer': {
    "title": "Subscription Cancellation Save-Offer Writer",
    "desc": "Empathetic churn-reduction exit flows with discount pauses, feature re-education, and win-back angles",
    "icon": "🛡️",
    "category": "copywriting",
    "placeholder": "Enter product name, monthly price, common churn reason & potential incentives (e.g. SaaS tool $29/mo, leaving due to cost, offer 50% off for 3 months)",
    "label": "Product, Pricing, Churn Reason & Concessions",
    "promptTemplate": "Write 3 empathetic, high-converting cancellation flow save screens for: {topic}. For each option provide: 1) Empathetic acknowledgement headline, 2) Alternative offer (e.g. Account pause, downgraded tier, temporary discount, or 1-on-1 concierge onboarding), and 3) Frictionless button copy.",
    "dateAdded": "2026-09-18"
  },
  'free-trial-signup-copy': {
    "title": "Free Trial Signup Copy Generator",
    "desc": "Frictionless CTA banners, headline pairs, and risk-reversal microcopy for trial conversions",
    "icon": "🎁",
    "category": "copywriting",
    "placeholder": "Enter app/service name, trial length, credit card requirement & primary value prop (e.g. AI video editor, 14-day trial, no credit card required)",
    "label": "Product Name, Trial Terms & Main Value Prop",
    "promptTemplate": "Write 4 high-converting Free Trial signup hero sections and CTA blocks for: {topic}. For each variation include: 1) High-impact value headline, 2) Supporting benefit subheadline, 3) Primary CTA button copy, and 4) Friction-removing reassurance microcopy (e.g. no credit card, cancel anytime).",
    "dateAdded": "2026-09-18"
  },
  'webinar-registration-copy': {
    "title": "Webinar Registration Copy Generator",
    "desc": "High-converting landing page headlines, bulleted takeaways, speaker bios, and countdown urgency",
    "icon": "🎟️",
    "category": "copywriting",
    "placeholder": "Enter webinar title, speaker credentials, 3 main takeaways & target attendee (e.g. Scale SEO to 100k visits with Sarah Lin for founders)",
    "label": "Webinar Topic, Host Credentials & Key Takeaways",
    "promptTemplate": "Write complete, high-converting landing page copy for a webinar on: {topic}. Include: 1) Curiosity-driven headline and subheadline, 2) \"What you will discover in 45 minutes\" bullet points, 3) Speaker authority bio snippet, 4) Scarcity/urgency seat limit callout, and 5) One-click registration CTA.",
    "dateAdded": "2026-09-18"
  },
  'case-study-writer': {
    "title": "Case Study Writer",
    "desc": "Comprehensive customer success stories formatted into Challenge, Solution, and Measurable Results",
    "icon": "📑",
    "category": "copywriting",
    "placeholder": "Enter client name/industry, original problem, implemented solution & metrics (e.g. Acme Logistics, manual dispatching errors, automated routing, saved 12 hrs/week)",
    "label": "Client, Problem Faced, Solution & Concrete Metrics",
    "promptTemplate": "Write a persuasive B2B Customer Case Study for: {topic}. Structure using the gold-standard framework: 1) Executive Summary & Key Metric Callout Box, 2) The Client & Initial Challenge, 3) Why Alternative Solutions Failed, 4) The Implementation, 5) Concrete Measurable Results, and 6) Pull-quote testimonial.",
    "dateAdded": "2026-09-18"
  },
  'b2b-cold-outreach-message': {
    "title": "B2B Cold Outreach Message Generator",
    "desc": "Personalized, non-spammy LinkedIn and email outreach with sharp observation hooks and low-friction asks",
    "icon": "💼",
    "category": "copywriting",
    "placeholder": "Enter prospect title/company, trigger event, value proposition & low-friction ask (e.g. VP of Sales at Series B SaaS, hiring 10 SDRs, AI objection training)",
    "label": "Target Role, Company Trigger, Value & Soft Ask",
    "promptTemplate": "Write 3 personalized, non-salesy B2B cold outreach messages for: {topic}. Include: 1) LinkedIn InMail format (<100 words), 2) Short 3-sentence Cold Email, and 3) Value-first Follow-Up. Ensure each opens with a specific observation and closes with a low-friction interest ask.",
    "dateAdded": "2026-09-18"
  },
  'product-comparison-copy-gen': {
    "title": "Product Comparison Copy Generator",
    "desc": "Fair, persuasive \"Us vs Them\" feature comparison tables, verdict summaries, and switcher testimonials",
    "icon": "⚖️",
    "category": "copywriting",
    "placeholder": "Enter your product, top competitor, key advantages & pricing edge (e.g. Our modern CRM vs Salesforce, 10x faster setup, transparent pricing)",
    "label": "Your Product, Competitor Name & Key Differentiators",
    "promptTemplate": "Write a balanced, persuasive \"Us vs Competitor\" comparison landing page section for: {topic}. Include: 1) Objective positioning headline, 2) Side-by-side feature & philosophy comparison matrix, 3) 3 reasons customers switch, and 4) Final verdict summary with risk-free CTA.",
    "dateAdded": "2026-09-18"
  },
  'limited-time-offer-copy': {
    "title": "Limited-Time Offer Copy Generator",
    "desc": "Urgent flash-sale promotional copy with authentic scarcity, value stacking, and countdown prompts",
    "icon": "⏳",
    "category": "copywriting",
    "placeholder": "Enter offer details, discount, deadline & bonuses (e.g. 40% off annual plan + free design template bundle, expires Friday midnight)",
    "label": "Special Offer, Discount %, Deadline & Bonuses",
    "promptTemplate": "Write urgent, high-converting limited-time promotional copy for: {topic}. Provide: 1) High-urgency announcement banner, 2) Email blast copy with countdown reminder, 3) Value-stack breakdown demonstrating price anchoring, and 4) Final-hours last chance reminder.",
    "dateAdded": "2026-09-18"
  },
  'customer-win-back-email': {
    "title": "Customer Win-Back Email Generator",
    "desc": "Re-engagement email sequences for dormant users featuring \"We miss you\" hooks and fresh updates",
    "icon": "💌",
    "category": "copywriting",
    "placeholder": "Enter product name, inactive duration, recent improvements & re-activation incentive (e.g. Project tracker, dormant 6 months, 5 new speed updates, 1 mo free)",
    "label": "Product, Inactive Time, New Features & Win-Back Gift",
    "promptTemplate": "Write a 3-part customer win-back email sequence for dormant users of: {topic}. Include: Email 1: \"We noticed you have been away\" (Curiosity + what has improved), Email 2: Exclusive incentive / free credit, and Email 3: Polite sunset notice asking if we should close their account.",
    "dateAdded": "2026-09-18"
  },
  'short-film-concept-generator': {
    "title": "Short Film Concept Generator",
    "desc": "Festival-worthy short film premises complete with logline, protagonist flaw, inciting incident, and twist",
    "icon": "🎥",
    "category": "creative",
    "placeholder": "Enter genre, budget/location scope & core thematic question (e.g. Sci-fi psychological thriller, single apartment, theme of artificial memories)",
    "label": "Genre, Location Scope & Core Theme",
    "promptTemplate": "Develop 3 festival-worthy short film concepts based on: {topic}. For each concept include: 1) One-sentence Logline, 2) Protagonist & Core Flaw, 3) The Inciting Incident, 4) Escalating Midpoint Obstacle, and 5) The Climactic Twist Ending.",
    "dateAdded": "2026-09-18"
  },
  'song-chorus-idea-generator': {
    "title": "Song Chorus Idea Generator",
    "desc": "Catchy vocal hooks, rhythmically matched lyrics, and emotional payoff lines for any music genre",
    "icon": "🎵",
    "category": "creative",
    "placeholder": "Enter music genre, emotional mood & lyrical story (e.g. Indie synth-pop, bittersweet nostalgia, driving through city streets after a breakup)",
    "label": "Music Genre, Mood & Song Story",
    "promptTemplate": "Write 4 catchy, emotionally resonant song chorus options for: {topic}. Include: Rhyme scheme notes, vocal cadence/rhythm suggestions, and chord progression ideas to complement the melody.",
    "dateAdded": "2026-09-18"
  },
  'poem-title-generator': {
    "title": "Poem Title Generator",
    "desc": "Evocative, lyrical, and metaphoric titles categorized by emotional resonance and poetic style",
    "icon": "📜",
    "category": "creative",
    "placeholder": "Enter poem imagery, themes & emotional arc (e.g. Autumn rain on abandoned piers, free-verse melancholy, unspoken goodbyes)",
    "label": "Poem Themes, Imagery & Emotional Tone",
    "promptTemplate": "Generate 20 evocative, literary poem titles for: {topic}. Categorize by poetic aesthetic: 1) Nature & Metaphoric, 2) Modernist & Minimalist, 3) Melancholy & Elegiac, and 4) Abstract & Surreal.",
    "dateAdded": "2026-09-18"
  },
  'villain-backstory-generator': {
    "title": "Villain Backstory Generator",
    "desc": "Complex, sympathetic antagonist origin stories highlighting core trauma, moral philosophy, and breaking point",
    "icon": "🦹",
    "category": "creative",
    "placeholder": "Enter villain archetype, story setting & hero they oppose (e.g. Former royal physician turned plague cult leader in steampunk empire)",
    "label": "Villain Archetype, Setting & The Hero",
    "promptTemplate": "Write a deep, psychologically rich villain backstory for: {topic}. Detail: 1) The Early Idealism, 2) The Formative Betrayal / Trauma, 3) The Distorted Moral Philosophy (why they believe they are the hero), 4) The Point of No Return, and 5) Their fatal flaw.",
    "dateAdded": "2026-09-18"
  },
  'fantasy-world-map-describer': {
    "title": "Fantasy World Map Description Generator",
    "desc": "Rich geographical lore, trade routes, treacherous borders, and environmental anomalies for fantasy realms",
    "icon": "🗺️",
    "category": "creative",
    "placeholder": "Enter realm name, major biomes, magic system influence & key factions (e.g. The Sunken Caldera of Vael, floating volcanic archipelagos)",
    "label": "Realm Name, Biomes, Magic & Factions",
    "promptTemplate": "Generate a rich, immersive geographical world map description for: {topic}. Include: 1) Overview of Major Landmasses & Natural Borders, 2) 3 Distinct Regions with climate and wildlife, 3) Key Settlements & Trade Corridors, and 4) Mythical Anomalies or Forbidden Zones.",
    "dateAdded": "2026-09-18"
  },
  'comic-strip-dialogue-generator': {
    "title": "Comic Strip Dialogue Generator",
    "desc": "Snappy 3-to-4 panel dialogue scripts with visual panel descriptions, character expressions, and punchlines",
    "icon": "💭",
    "category": "creative",
    "placeholder": "Enter characters, setting & comedic premise (e.g. Cynical cat and optimistic robot dog debating human habits over spilled coffee)",
    "label": "Characters, Premise & Humor Style",
    "promptTemplate": "Write a complete 4-panel comic strip script based on: {topic}. For Panels 1 through 4 specify: [PANEL VISUAL / ACTION / EXPRESSION] and [CHARACTER DIALOGUE / SOUND EFFECTS]. Deliver a sharp, punchy visual or verbal comedic payoff in panel 4.",
    "dateAdded": "2026-09-18"
  },
  'bedtime-story-generator': {
    "title": "Bedtime Story Generator",
    "desc": "Gentle, soothing bedtime tales with lovable characters, whimsical adventures, and calming sleep conclusions",
    "icon": "🌙",
    "category": "creative",
    "placeholder": "Enter character name, animal/setting & calming moral (e.g. Barnaby the little bear who was nervous about the dark forest, meets a glowing moth)",
    "label": "Main Character, Setting & Soothing Theme",
    "promptTemplate": "Write a gentle, comforting bedtime story for children about: {topic}. Keep the tone warm, rhythmic, and reassuring. Build a whimsical adventure that slows down in pacing toward the end, culminating in cozy sleep and sweet dreams.",
    "dateAdded": "2026-09-18"
  },
  'alternate-ending-generator': {
    "title": "Alternate Ending Generator",
    "desc": "Dramatic \"What If\" alternate conclusions, plot diverges, and shocking third-act resolutions for any story",
    "icon": "🔀",
    "category": "creative",
    "placeholder": "Enter story premise, original ending & key turning point to diverge (e.g. Classic tragedy, but the warning letter arrives 1 hour early)",
    "label": "Story Premise, Original Ending & The Divergence Point",
    "promptTemplate": "Create 3 captivating alternate endings for: {topic}. For each provide: 1) The Divergence Point (the single change), 2) Ripple effects on character arcs, 3) Climactic showdown or resolution, and 4) Final thematic lingering question.",
    "dateAdded": "2026-09-18"
  },
  'image-alt-text-generator': {
    "title": "Image Alt Text Generator",
    "desc": "Accessibility-compliant, keyword-conscious alt text descriptions for web images and illustrations",
    "icon": "🖼️",
    "category": "seo",
    "placeholder": "Describe image visuals, article context & target SEO keyword (e.g. Barista pouring latte art in sunlit cafe, article on specialty coffee beans)",
    "label": "Image Visuals, Article Context & Target Keyword",
    "promptTemplate": "Generate 4 optimized Image Alt Text options for: {topic}. Provide: 1) Strict Accessibility Focus (screen-reader friendly, objective), 2) SEO-Enhanced Alt Text (natural keyword inclusion), 3) Detailed E-commerce Product Alt Text, and 4) Social / Pinterest descriptive text.",
    "dateAdded": "2026-09-18"
  },
  'url-slug-seo-optimizer': {
    "title": "URL Slug SEO Optimizer",
    "desc": "Clean, keyword-rich, hyphenated permalinks stripped of stop words and optimized for crawlability",
    "icon": "🔗",
    "category": "seo",
    "placeholder": "Enter article title or target keyword topic (e.g. The 15 Best Noise-Cancelling Headphones You Can Buy for Under $100 in 2026)",
    "label": "Article Title or Target Keyword Phrase",
    "promptTemplate": "Generate 6 clean, high-ranking SEO URL slug options for: {topic}. Categorize by: 1) Ultra-Short & Concise, 2) Exact-Match Keyword, 3) High-CTR Descriptive, and 4) Category Sub-Folder Structure (e.g. /category/slug).",
    "dateAdded": "2026-09-18"
  },
  'meta-keywords-suggestion': {
    "title": "Meta Keywords Suggestion Tool",
    "desc": "Semantic keyword tags, secondary intent phrases, and LSI terms to enrich metadata and on-page topical depth",
    "icon": "🏷️",
    "category": "seo",
    "placeholder": "Enter primary keyword & page content summary (e.g. Beginner Guide to Solar Panel Installation, costs and roof requirements)",
    "label": "Primary Keyword & Page Topic Summary",
    "promptTemplate": "Generate a rich semantic keyword profile for: {topic}. Group into: 1) Primary Head Terms, 2) Long-Tail Intent Phrases, 3) LSI (Latent Semantic Indexing) Synonyms, and 4) User Problem Questions to answer in the text.",
    "dateAdded": "2026-09-18"
  },
  'content-freshness-checklist': {
    "title": "Content Freshness Checklist Generator",
    "desc": "Actionable audit checklists to update outdated blog posts, refresh stats, fix dead intent, and reclaim rankings",
    "icon": "🔄",
    "category": "seo",
    "placeholder": "Enter article topic, original publish year & current search ranking drop (e.g. Best Graphic Design Tools, published 2022, lost top 3 spot)",
    "label": "Article Topic, Original Date & Ranking Drop",
    "promptTemplate": "Generate a comprehensive Content Freshness & Decay Audit Checklist for: {topic}. Include steps for: 1) Outdated Data & Broken Links Audit, 2) Modern Search Intent Gap Analysis, 3) New Competitor Angle Insertion, 4) On-page UX & Media Upgrades, and 5) Re-indexing & Promotion plan.",
    "dateAdded": "2026-09-18"
  },
  'question-based-keyword-finder': {
    "title": "Question-Based Keyword Finder",
    "desc": "Who, What, Where, When, Why, and How query variations mapped directly to user search intent",
    "icon": "❓",
    "category": "seo",
    "placeholder": "Enter core seed topic or product (e.g. Cold plunge therapy, ice baths, mental clarity and recovery)",
    "label": "Core Seed Keyword or Niche Topic",
    "promptTemplate": "Generate 24 high-intent question-based search queries for: {topic}. Organize under the 6 interrogative pillars: Who, What, When, Where, Why, and How. Add practical search intent notes (informational, transactional, or troubleshooting).",
    "dateAdded": "2026-09-18"
  },
  'eeat-content-checklist': {
    "title": "E-E-A-T Content Checklist Generator",
    "desc": "Experience, Expertise, Authoritativeness, and Trustworthiness guidelines tailored to your niche",
    "icon": "🏅",
    "category": "seo",
    "placeholder": "Enter niche (e.g. YMYL, Personal Finance, Healthcare, Tech) & content piece topic (e.g. Cryptocurrency Tax Obligations Guide)",
    "label": "Niche, Content Topic & Target Audience",
    "promptTemplate": "Create an actionable Google E-E-A-T Quality Checklist for: {topic}. Detail specific requirements across: 1) First-Hand Experience signals, 2) Technical Expertise proof, 3) Site & Author Authoritativeness markers, and 4) Core Trustworthiness & Transparency audits.",
    "dateAdded": "2026-09-18"
  },
  'google-business-profile-writer': {
    "title": "Google Business Profile Description Writer",
    "desc": "Localized 750-character business descriptions packed with neighborhood keywords, service offerings, and trust signals",
    "icon": "🏬",
    "category": "seo",
    "placeholder": "Enter business name, industry, neighborhood/city & top specialties (e.g. Artisan Sourdough Bakery, Austin TX, organic flours, vegan pastries)",
    "label": "Business Name, Industry, City & Key Specialties",
    "promptTemplate": "Write 3 optimized 750-character Google Business Profile descriptions for: {topic}. Balance local geographic neighborhood keywords, unique service offerings, credentials/awards, and a friendly community call-to-action.",
    "dateAdded": "2026-09-18"
  },
  'site-search-query-suggester': {
    "title": "Site Search Query Suggestion Generator",
    "desc": "Predictive search terms, zero-result fallbacks, and typo-tolerant query expansions for internal site search",
    "icon": "🔍",
    "category": "seo",
    "placeholder": "Enter website type, content catalog & common user objectives (e.g. Streaming media portal with video creator tools and audio converters)",
    "label": "Website Type, Catalog Scope & User Intent",
    "promptTemplate": "Generate an internal site search taxonomy and query expansion list for: {topic}. Provide: 1) 15 Top High-Frequency Search Queries, 2) Common Typo & Synonym Mappings, 3) Related Search Suggestions, and 4) Zero-Results Fallback Recommendations.",
    "dateAdded": "2026-09-18"
  },
  'yaml-config-generator': {
    "title": "YAML Config Generator",
    "desc": "Valid, syntactically clean YAML configurations for Docker, Kubernetes, GitHub Actions, or OpenAPI specs",
    "icon": "📄",
    "category": "technical",
    "placeholder": "Enter configuration type & requirements (e.g. GitHub Action workflow to build Node 22 app, run linter, and deploy to Cloud Run on main push)",
    "label": "Configuration Type & Infrastructure Requirements",
    "promptTemplate": "Generate a production-ready, fully commented YAML configuration file for: {topic}. Ensure valid indentation, security best practices, environment variable handling, and detailed inline explanation of all config keys.",
    "dateAdded": "2026-09-18"
  },
  'api-endpoint-doc-writer': {
    "title": "API Endpoint Documentation Writer",
    "desc": "Clear, developer-friendly REST/GraphQL endpoint docs with parameters, headers, request bodies, and responses",
    "icon": "📖",
    "category": "technical",
    "placeholder": "Enter endpoint URL, HTTP method, parameters & payload (e.g. POST /api/v1/subscriptions/checkout, accepts customerId and planTier)",
    "label": "Endpoint Path, HTTP Method & Request/Response Schema",
    "promptTemplate": "Write complete, developer-friendly API endpoint documentation for: {topic}. Include: 1) Summary & Use Case, 2) Authentication & Headers, 3) Path & Query Parameters, 4) JSON Request Body Schema with types, 5) Success Response (200/201) sample, and 6) Common Error Responses (400, 401, 429).",
    "dateAdded": "2026-09-18"
  },
  'terraform-snippet-generator': {
    "title": "Terraform Snippet Generator",
    "desc": "Production-grade HCL Terraform resource blocks with variables, outputs, tags, and best-practice security defaults",
    "icon": "🏗️",
    "category": "technical",
    "placeholder": "Enter cloud provider (AWS/GCP/Azure), resource & specs (e.g. GCP Cloud Run service running container on port 3000 with custom domain)",
    "label": "Cloud Provider, Resource Type & Architecture",
    "promptTemplate": "Write clean, modular Terraform (HCL) configuration code for: {topic}. Include: 1) Resource definition with production security defaults, 2) Required input variables with descriptions, 3) Helpful outputs, and 4) State management comments.",
    "dateAdded": "2026-09-18"
  },
  'package-json-desc-generator': {
    "title": "package.json Description Generator",
    "desc": "Concise, npm-search-optimized project descriptions, keywords, and repository metadata for open source packages",
    "icon": "📦",
    "category": "technical",
    "placeholder": "Enter package name, core utility & target developers (e.g. fast-fuzzy-matcher: lightweight client-side fuzzy search for Vite and React)",
    "label": "Package Name, Core Utility & Key Benefits",
    "promptTemplate": "Write optimized npm package metadata for: {topic}. Provide: 1) 3 Concise package.json \"description\" options (<120 characters), 2) 15 high-ranking npm \"keywords\" array, 3) Clean GitHub README one-liner, and 4) Recommended badge list.",
    "dateAdded": "2026-09-18"
  },
  'changelog-generator': {
    "title": "Changelog Generator",
    "desc": "Keep-a-Changelog compliant release notes categorized into Added, Changed, Deprecated, Removed, Fixed, and Security",
    "icon": "📋",
    "category": "technical",
    "placeholder": "Enter version number, release date & raw commit notes or feature list (e.g. v2.4.0: Dark mode, fixed audio converter bug, upgraded express to 5.0)",
    "label": "Version Number, Date & Feature Updates",
    "promptTemplate": "Generate a professional, markdown-formatted release changelog based on: {topic}. Format strictly according to \"Keep a Changelog\" standards with sections: Added, Changed, Fixed, and Security where relevant.",
    "dateAdded": "2026-09-18"
  },
  'code-refactor-suggestion': {
    "title": "Code Refactor Suggestion Tool",
    "desc": "Actionable architectural refactoring advice for code cleanliness, type safety, performance, and DRY principles",
    "icon": "🧹",
    "category": "technical",
    "placeholder": "Enter programming language, code snippet & pain point (e.g. TypeScript: 120-line switch statement handling 15 event types, hard to maintain)",
    "label": "Language, Code Snippet & Refactoring Goal",
    "promptTemplate": "Analyze and provide a complete refactoring solution for: {topic}. Deliver: 1) Diagnosis of Code Smells & Bottlenecks, 2) Step-by-Step Refactoring Strategy (e.g. Strategy pattern, Map lookup, immutability), 3) Clean Refactored Code with types, and 4) Trade-off analysis.",
    "dateAdded": "2026-09-18"
  },
  'pseudocode-generator': {
    "title": "Pseudocode Generator",
    "desc": "Language-agnostic, structured pseudocode breaking complex algorithms into clear logical steps",
    "icon": "📝",
    "category": "technical",
    "placeholder": "Enter algorithm goal, expected inputs & outputs (e.g. Breadth-First Search on a directed graph to find shortest path with cycle detection)",
    "label": "Algorithm Objective, Inputs & Expected Outputs",
    "promptTemplate": "Write clear, standardized pseudocode for: {topic}. Format with clean indentation, defined variable initialization, explicit conditional/loop boundaries (IF/ELSE, WHILE, FOR EACH), and Time/Space Complexity analysis.",
    "dateAdded": "2026-09-18"
  },
  'algorithm-explainer': {
    "title": "Algorithm Explainer",
    "desc": "Intuitive, plain-English conceptual breakdowns of complex computer science algorithms with visual mental models",
    "icon": "🧠",
    "category": "technical",
    "placeholder": "Enter algorithm or concept (e.g. Raft Consensus protocol, Dijkstra Shortest Path, LRU Cache eviction)",
    "label": "Algorithm Name or Computer Science Concept",
    "promptTemplate": "Explain this computer science algorithm in a crystal-clear, intuitive way: {topic}. Structure with: 1) The Real-World Mental Model Analogy, 2) Step-by-Step Execution Walkthrough, 3) Key Trade-offs (Time vs Space), and 4) When to use vs when to avoid in production.",
    "dateAdded": "2026-09-18"
  },
  'job-interview-answer-generator': {
    "title": "Job Interview Answer Generator",
    "desc": "High-impact interview responses structured with the STAR framework (Situation, Task, Action, Result)",
    "icon": "🎯",
    "category": "copywriting",
    "placeholder": "Enter interview question, your role & project background (e.g. \"Tell me about a time you handled a tight deadline with shifting specs\" as Lead Dev)",
    "label": "Interview Question, Your Role & Project Context",
    "promptTemplate": "Generate a compelling, executive-level job interview response for: {topic}. Structure using the STAR method: 1) Situation (the context), 2) Task (your specific challenge), 3) Action (proactive leadership steps you took), and 4) Result (quantified business impact and key learning).",
    "dateAdded": "2026-09-18"
  },
  'performance-review-comment-generator': {
    "title": "Performance Review Comment Generator",
    "desc": "Constructive, balanced, professional performance feedback for self-evaluations, peer reviews, and manager appraisals",
    "icon": "⭐",
    "category": "technical",
    "placeholder": "Enter review type (Self, Peer, Manager), key accomplishments & growth areas (e.g. Senior dev peer review, great mentorship, encourage speaking up in arch reviews)",
    "label": "Review Type, Key Achievements & Areas for Growth",
    "promptTemplate": "Write balanced, professional, constructive performance appraisal comments for: {topic}. Provide: 1) Key Strengths & Concrete Contributions, 2) Growth & Development Opportunities with actionable coaching advice, and 3) Overall Impact Summary.",
    "dateAdded": "2026-09-18"
  },

  // ==========================================
  // 50 NEW TOOLS (Batch 3 of 3 - Final)
  // ==========================================
  'vlog-script': {
    "title": "Vlog Script Generator",
    "desc": "Generate engaging vlog scripts with dynamic intros, talking points, b-roll cues, and sign-offs.",
    "icon": "📹",
    "category": "video",
    "placeholder": "e.g., Day in the life of a remote software developer in Tokyo, focusing on morning routine and co-working spaces...",
    "label": "Vlog Topic & Setting",
    "promptTemplate": "Write a dynamic, highly engaging vlog video script for: {topic}. Structure with: 1) 0:00-0:15 Teaser Hook & Visual Cold Open, 2) 0:15-1:00 Cinematic Title & Day Objective, 3) 3-4 Core Story Segments with [Visual Cues], [A-Roll Talking Points], and [B-Roll Cutaway Instructions], 4) Climax / Reflection Moment, and 5) Natural Outro & Community Question.",
    "dateAdded": "2026-09-18"
  },
  'unboxing-script': {
    "title": "Unboxing Video Script Generator",
    "desc": "Create high-energy product unboxing scripts with package impressions, feature reveals, and first tests.",
    "icon": "📦",
    "category": "video",
    "placeholder": "e.g., Noise-cancelling wireless headphones with 40hr battery, premium matte case, and sound quality tests...",
    "label": "Product Details & Key Features",
    "promptTemplate": "Write an exciting, high-retention product unboxing video script for: {topic}. Include: 1) Packaging Impressions & ASMR Box Opening cues, 2) First Glance Build Quality & In-The-Hand Feel, 3) Guided Tour of Included Accessories, 4) Immediate First-Impression Test / Demo, and 5) Honest Early Verdict with Recommendation.",
    "dateAdded": "2026-09-18"
  },
  'tutorial-step-script': {
    "title": "Tutorial Video Step Script Generator",
    "desc": "Structure clear, numbered step-by-step tutorial scripts with beginner-friendly explanations and screen callouts.",
    "icon": "🛠️",
    "category": "video",
    "placeholder": "e.g., How to build a responsive portfolio website with Tailwind CSS for beginner web developers...",
    "label": "Tutorial Subject & Skill Level",
    "promptTemplate": "Create a clear, structured step-by-step tutorial script for: {topic}. Include: 1) The Finished Result Preview (What viewers will achieve), 2) Prerequisites & Tool Setup, 3) Chronological numbered steps with exact [On-Screen Visuals] and [Audio Explanations], 4) Common pitfalls and how to avoid them, and 5) Summary recap and next steps.",
    "dateAdded": "2026-09-18"
  },
  'sponsorship-read-script': {
    "title": "Video Sponsorship Read Script Generator",
    "desc": "Draft organic, seamless sponsorship ad reads with smooth segment transitions and strong discount codes.",
    "icon": "🎙️",
    "category": "video",
    "placeholder": "e.g., NordVPN 70% off deal with code MULTI, emphasizing security on public Wi-Fi and geo-unblocking...",
    "label": "Sponsor Brand, Offer & Talking Points",
    "promptTemplate": "Write an organic, seamless 60-second sponsored ad integration script for: {topic}. Provide: 1) A natural segue from typical creator content into the sponsor, 2) Personal genuine endorsement angle, 3) 3 mandatory brand talking points framed around audience benefits, 4) Special discount callout with unique code/link, and 5) Smooth transition back into the main video.",
    "dateAdded": "2026-09-18"
  },
  'documentary-narration-script': {
    "title": "Documentary Narration Script Generator",
    "desc": "Compose cinematic, immersive voiceover narration for historical, scientific, or investigative mini-documentaries.",
    "icon": "🎥",
    "category": "video",
    "placeholder": "e.g., The rise and sudden disappearance of the Mayan civilization in the 9th century, dramatic and reflective...",
    "label": "Documentary Topic & Tone",
    "promptTemplate": "Compose cinematic, immersive voiceover narration copy for a mini-documentary on: {topic}. Structure with: 1) Atmospheric opening hook with sweeping visual cues, 2) Historical context and tension build, 3) The turning point / crisis, 4) Critical analysis with pacing pauses indicated by [pause], and 5) Resonant philosophical conclusion.",
    "dateAdded": "2026-09-18"
  },
  'gaming-commentary-script': {
    "title": "Gaming Commentary Script Generator",
    "desc": "Produce punchy gameplay commentary outlines with banter hooks, hype reactions, and viewer engagement cues.",
    "icon": "🎮",
    "category": "video",
    "placeholder": "e.g., Elden Ring boss fight with level 1 wretch challenge, highlighting humorous deaths and clutch victory...",
    "label": "Game Title & Playthrough Scenario",
    "promptTemplate": "Create an energetic gaming commentary outline and talking-points guide for: {topic}. Include: 1) Challenge premise and stakes setup, 2) Key gameplay checkpoints with reaction triggers, 3) 5 witty banter topics to fill slow moments, 4) Live chat / audience engagement prompts, and 5) Climax celebration / cliffhanger teaser.",
    "dateAdded": "2026-09-18"
  },
  'cooking-video-script': {
    "title": "Cooking Video Script Generator",
    "desc": "Craft delicious, pace-optimized cooking and recipe scripts with ingredient callouts and sensory descriptions.",
    "icon": "🍳",
    "category": "video",
    "placeholder": "e.g., 15-minute creamy garlic butter Tuscan shrimp pasta, quick weeknight dinner style with sizzling audio cues...",
    "label": "Recipe Name, Key Ingredients & Style",
    "promptTemplate": "Write an irresistible, pace-optimized recipe video script for: {topic}. Provide: 1) Sensory hero shot description (cheese pull, sizzle, steam), 2) Mise-en-place ingredient list graphic text, 3) Step-by-step culinary process with chef techniques & flavor secrets, 4) Plating presentation tips, and 5) The first bite taste test reaction and call to save the recipe.",
    "dateAdded": "2026-09-18"
  },
  'travel-vlog-script': {
    "title": "Travel Vlog Script Generator",
    "desc": "Generate wanderlust-inducing travel vlog itineraries and narration covering hidden gems, food, and culture.",
    "icon": "✈️",
    "category": "video",
    "placeholder": "e.g., 48 hours in Lisbon exploring historic Alfama, pastel de nata bakeries, and scenic tram viewpoints on a budget...",
    "label": "Destination, Highlights & Travel Style",
    "promptTemplate": "Write an inspiring, wanderlust-inducing travel vlog script for: {topic}. Include: 1) Arrival montage & first impressions hook, 2) Hidden gem recommendation off the beaten tourist path, 3) Local culinary experience with taste descriptions, 4) Practical budgeting & transport tips, and 5) Golden hour sunset reflection and itinerary wrap-up.",
    "dateAdded": "2026-09-18"
  },
  'instagram-story-ideas': {
    "title": "Instagram Story Idea Generator",
    "desc": "Brainstorm high-retention Instagram Story sequences with interactive polls, sticker prompts, and swipe-up CTAs.",
    "icon": "📱",
    "category": "social",
    "placeholder": "e.g., Fitness coach launching a 30-day summer strength challenge, goal to drive DM inquiries...",
    "label": "Brand / Creator Niche & Goal",
    "promptTemplate": "Generate a high-converting 5-part Instagram Story sequence for: {topic}. For each frame provide: 1) Story format (Photo / Video / Boomerang), 2) Exact on-screen text copy, 3) Interactive sticker mechanism (Poll, Quiz, Slider, Question Box, Link Sticker), and 4) Psychological engagement trigger.",
    "dateAdded": "2026-09-18"
  },
  'pinterest-pin-description': {
    "title": "Pinterest Pin Description Generator",
    "desc": "Write keyword-rich, click-worthy Pinterest descriptions with search-friendly hashtags and clear save incentives.",
    "icon": "📌",
    "category": "social",
    "placeholder": "e.g., Minimalist Scandinavian home office organization ideas with DIY floating shelves...",
    "label": "Pin Topic & Destination URL Purpose",
    "promptTemplate": "Generate 4 search-optimized Pinterest Pin descriptions for: {topic}. Each description must include: 1) An inspiring, click-worthy opening hook, 2) High-volume natural keywords integrated seamlessly, 3) A compelling reason to Save / Pin for later, and 4) 5 targeted Pinterest hashtags.",
    "dateAdded": "2026-09-18"
  },
  'reddit-comment-reply': {
    "title": "Reddit Comment Reply Generator",
    "desc": "Draft authentic, value-first Reddit replies tailored to community etiquette and subreddit norms.",
    "icon": "💬",
    "category": "social",
    "placeholder": "e.g., r/webdev thread asking if junior devs should learn TypeScript in 2026, supportive and practical advice...",
    "label": "Original Post Context & Your Perspective",
    "promptTemplate": "Write 3 distinct, authentic Reddit replies for: {topic}. Variation 1: The Helpful Veteran (In-depth practical advice with formatting). Variation 2: The Direct & Concise TL;DR. Variation 3: The Empathetic Discussion Starter. All replies must adhere strictly to Reddiquette, avoiding corporate jargon or self-promotional spam.",
    "dateAdded": "2026-09-18"
  },
  'discord-server-announcement': {
    "title": "Discord Server Announcement Generator",
    "desc": "Create formatted, community-ready Discord announcements with clean emoji headers, role pings, and event bullet points.",
    "icon": "📢",
    "category": "social",
    "placeholder": "e.g., Weekend community game night tournament with prizes and voice channel links for a gaming clan...",
    "label": "Announcement Topic & Server Details",
    "promptTemplate": "Draft a polished, high-engagement Discord announcement message for: {topic}. Format using markdown headers, quote blocks, bulleted event logistics, channel link mentions, relevant emoji accents, and appropriate role tag callouts (@everyone / @here / @Announcements).",
    "dateAdded": "2026-09-18"
  },
  'newsletter-subject-line': {
    "title": "Newsletter Subject Line Generator",
    "desc": "Generate high-open-rate email newsletter subject lines and preview text using curiosity, urgency, and value.",
    "icon": "✉️",
    "category": "social",
    "placeholder": "e.g., Weekly tech digest explaining how generative AI is reshaping front-end development workflows...",
    "label": "Newsletter Content & Target Audience",
    "promptTemplate": "Generate 12 high-open-rate email subject lines paired with snippet/preview text for: {topic}. Categorize into: 1) Curiosity Gap (3), 2) Direct Benefit & How-To (3), 3) Urgent / FOMO (3), and 4) Short & Intriguing (under 35 characters) (3).",
    "dateAdded": "2026-09-18"
  },
  'social-proof-post': {
    "title": "Social Proof Post Generator",
    "desc": "Transform client testimonials, reviews, and metrics into captivating social proof posts for LinkedIn, X, and Instagram.",
    "icon": "⭐",
    "category": "social",
    "placeholder": "e.g., A SaaS client cut video rendering time from 2 hours to 8 minutes using our platform, quote praising speed...",
    "label": "Customer Result, Quote or Milestone",
    "promptTemplate": "Transform this customer success story into 3 high-impact social proof posts for: {topic}. Variation 1: The LinkedIn Case Study (Hook -> Challenge -> Solution -> Quantified Win -> Takeaway). Variation 2: The X/Twitter Single Post (Crisp metric + customer quote). Variation 3: The Humble Gratitude Post celebrating client success.",
    "dateAdded": "2026-09-18"
  },
  'behind-the-scenes-post': {
    "title": "Behind-the-Scenes Post Generator",
    "desc": "Write relatable behind-the-scenes social posts sharing creator workflows, mistakes, and raw production moments.",
    "icon": "🎬",
    "category": "social",
    "placeholder": "e.g., Building a new media workspace feature late at night, troubleshooting CSS grid bugs with coffee...",
    "label": "Project & Behind-the-Scenes Context",
    "promptTemplate": "Write 3 authentic, relatable behind-the-scenes social media posts for: {topic}. Include: 1) The unpolished reality / struggle, 2) The creative breakthrough or lesson learned, 3) High-engagement question inviting followers to share their own experience, and 4) Suggested visual format (desk photo, screen recording, timelapse).",
    "dateAdded": "2026-09-18"
  },
  'follower-milestone-post': {
    "title": "Follower Milestone Post Generator",
    "desc": "Craft heartfelt, celebratory milestone announcement posts thanking supporters and sharing future roadmap vision.",
    "icon": "🎉",
    "category": "social",
    "placeholder": "e.g., Reaching 50,000 subscribers on YouTube after 2 years of weekly content creation, thanking the community...",
    "label": "Milestone Number & Platform",
    "promptTemplate": "Write a heartfelt, inspirational milestone celebration post for: {topic}. Structure with: 1) The humble beginning (day 1 retrospective), 2) Genuine gratitude to the early supporters and community, 3) 3 biggest lessons learned along the way, 4) Exciting teaser of what is coming next, and 5) Community give-back / celebratory CTA.",
    "dateAdded": "2026-09-18"
  },
  'personal-bio-about-me': {
    "title": "Personal Bio / About-Me Page Writer",
    "desc": "Generate versatile personal bios and about-me pages tailored for portfolios, LinkedIn, speaking bios, and social headers.",
    "icon": "🖋️",
    "category": "social",
    "placeholder": "e.g., Full-stack engineer & video creator passionate about open source, modern web performance, friendly tone...",
    "label": "Name, Career Field, Achievements & Personal Tone",
    "promptTemplate": "Generate 4 versatile personal bio variations based on: {topic}. Provide: 1) Ultra-Short Social Bio (<160 chars for Twitter/Instagram), 2) Elevator Pitch Bio (1 paragraph for LinkedIn summary), 3) Formal Speaker / Conference Bio (3rd-person, highlighting credentials), and 4) Website About-Me Page Narrative (1st-person, warm, personal story).",
    "dateAdded": "2026-09-18"
  },
  'saas-feature-announcement': {
    "title": "SaaS Feature Announcement Writer",
    "desc": "Write compelling product update copy highlighting user benefits, problem-solution payoffs, and getting-started steps.",
    "icon": "🚀",
    "category": "copywriting",
    "placeholder": "e.g., Instant multi-stream sync feature allowing creators to watch 4 live streams without audio lag...",
    "label": "Feature Name, Benefits & Availability",
    "promptTemplate": "Write a comprehensive product feature announcement copy package for: {topic}. Include: 1) Exciting Hero Headline & Subhead, 2) The Old Way vs The New Way comparison, 3) 3 Core User Benefits with micro-illustrations, 4) Quick 3-step getting started guide, and 5) In-app notification banner copy.",
    "dateAdded": "2026-09-18"
  },
  'referral-program-copy': {
    "title": "Referral Program Copy Generator",
    "desc": "Craft persuasive double-sided referral copy for emails, landing pages, and in-app banners that drives viral invites.",
    "icon": "🤝",
    "category": "copywriting",
    "placeholder": "e.g., Give $20, Get $20 referral program for a creator productivity app, targeting freelance editors...",
    "label": "Incentive Structure & Audience",
    "promptTemplate": "Generate a complete high-converting referral program copy kit for: {topic}. Provide: 1) Catchy program name & tagline, 2) In-app referral modal copy explaining the dual incentive, 3) Pre-written invite email for users to send to friends, 4) 1-click shareable social message, and 5) FAQ addressing program rules and payout terms.",
    "dateAdded": "2026-09-18"
  },
  'app-store-listing-description': {
    "title": "App Store Listing Description Writer",
    "desc": "Compose ASO-optimized iOS App Store and Google Play descriptions with punchy feature bullets and promotional text.",
    "icon": "📲",
    "category": "copywriting",
    "placeholder": "e.g., Multi Tube Views mobile companion app for side-by-side stream monitoring, zero account required...",
    "label": "App Name, Core Features & Target Users",
    "promptTemplate": "Write an ASO-optimized App Store and Google Play listing copy kit for: {topic}. Include: 1) 30-character App Title with primary keyword, 2) 30-character Subtitle, 3) 170-character Promotional Text, 4) Compelling above-the-fold description hook, 5) Feature breakdown formatted with bullet emojis, and 6) Keyword list suggestions.",
    "dateAdded": "2026-09-18"
  },
  'crowdfunding-pitch-copy': {
    "title": "Crowdfunding Pitch Copy Generator",
    "desc": "Draft emotional, high-converting Kickstarter or Indiegogo campaign copy with mission hooks and reward tiers.",
    "icon": "💡",
    "category": "copywriting",
    "placeholder": "e.g., Open-source portable audio mixer for remote interviewers, $25k funding goal, early bird pricing...",
    "label": "Project Vision, Target Goal & Backer Perks",
    "promptTemplate": "Draft a compelling crowdfunding campaign pitch for Kickstarter/Indiegogo based on: {topic}. Structure with: 1) Mission statement & opening emotional hook, 2) The problem in today's market and why our solution is unique, 3) Technical specs / craftsmanship details, 4) 3 structured backer reward tiers (Early Bird, Standard, VIP Bundle), and 5) Creator bio & fulfillment timeline commitment.",
    "dateAdded": "2026-09-18"
  },
  'real-estate-listing-description': {
    "title": "Real Estate Listing Description Writer",
    "desc": "Generate alluring property listing descriptions highlighting architectural details, neighborhood perks, and luxury finishes.",
    "icon": "🏡",
    "category": "copywriting",
    "placeholder": "e.g., 3-bed 2-bath mid-century modern home in Austin with private sunlit courtyard, chef's kitchen, near parks...",
    "label": "Property Specs, Location & Special Features",
    "promptTemplate": "Write 3 captivating real estate property descriptions for: {topic}. Include: 1) The Luxury Editorial Style (Emphasizing architecture, natural light, and lifestyle), 2) The Feature-Packed MLS Summary (Bed/bath, square footage, upgrades, school districts), and 3) The Social Media Teaser with emoji highlights and open-house CTA.",
    "dateAdded": "2026-09-18"
  },
  'restaurant-menu-description': {
    "title": "Restaurant Menu Description Writer",
    "desc": "Write mouth-watering culinary descriptions for restaurant menus using sensory adjectives and provenance details.",
    "icon": "🍽️",
    "category": "copywriting",
    "placeholder": "e.g., Wood-fired artisanal sourdough pizza with San Marzano tomatoes, fresh buffalo mozzarella, and aged balsamic...",
    "label": "Dish Name, Ingredients & Cooking Style",
    "promptTemplate": "Write 5 enticing, mouthwatering restaurant menu descriptions for: {topic}. Focus on artisanal preparation methods (slow-roasted, wood-fired, hand-folded), ingredient provenance, texture contrasts, and delicate flavor pairings that elevate perceived value and appetite appeal.",
    "dateAdded": "2026-09-18"
  },
  'event-invitation-copy': {
    "title": "Event Invitation Copy Generator",
    "desc": "Draft irresistible event invitations and RSVP copy for workshops, conferences, launches, and celebrations.",
    "icon": "🎟️",
    "category": "copywriting",
    "placeholder": "e.g., Creator Economy Summit 2026, virtual keynote session with industry leaders, networking lounge, free RSVP...",
    "label": "Event Name, Date, Key Highlights & Audience",
    "promptTemplate": "Create an irresistible event invitation copy package for: {topic}. Include: 1) 3 Subject Line options with RSVP urgency, 2) Engaging email invitation highlighting keynote speakers and key takeaways, 3) 3 quick bullet reasons why attendees cannot afford to miss it, 4) Clear logistical details (Date, Time, Virtual/In-Person, RSVP deadline), and 5) High-converting registration button microcopy.",
    "dateAdded": "2026-09-18"
  },
  'loyalty-program-copy': {
    "title": "Loyalty Program Copy Generator",
    "desc": "Create engaging loyalty and VIP rewards program copy with tier names, point-earning incentives, and exclusive perks.",
    "icon": "💎",
    "category": "copywriting",
    "placeholder": "e.g., Coffee subscription club with Bronze, Silver, and Gold bean tiers, free seasonal tasting boxes...",
    "label": "Brand Niche & Reward Tiers",
    "promptTemplate": "Design a complete customer loyalty and VIP program copy suite for: {topic}. Provide: 1) Creative program name & currency (e.g. Points, Stars, Credits), 2) 3 distinct tier names with unlock criteria, 3) Specific exclusive perks for each tier, 4) Welcome email copy upon enrollment, and 5) Milestone celebration notification when a member levels up.",
    "dateAdded": "2026-09-18"
  },
  'scholarship-grant-essay-helper': {
    "title": "Scholarship/Grant Application Essay Helper",
    "desc": "Structure inspiring scholarship and grant essays with personal narrative hooks, academic goals, and financial impact.",
    "icon": "🎓",
    "category": "copywriting",
    "placeholder": "e.g., First-generation STEM student applying for computer science leadership grant, community volunteer work...",
    "label": "Scholarship Prompt, Personal Background & Academic Goal",
    "promptTemplate": "Draft a compelling, structured scholarship/grant application essay outline and draft for: {topic}. Structure with: 1) Personal Narrative Hook (Formative moment / overcoming obstacle), 2) Academic & Career Ambitions (Clear vision for the future), 3) Community Impact & Leadership (Giving back to others), and 4) Financial Justification (How this specific grant removes barriers to graduation).",
    "dateAdded": "2026-09-18"
  },
  'mystery-plot-generator': {
    "title": "Mystery Plot Generator",
    "desc": "Generate intricate whodunit mystery plots complete with red herrings, hidden clues, motive twists, and detectives.",
    "icon": "🔍",
    "category": "creative",
    "placeholder": "e.g., A renowned tech CEO found locked inside a soundproof vault at an annual retreat in the Swiss Alps...",
    "label": "Crime Setting, Victim & Detective Concept",
    "promptTemplate": "Develop an intricate, page-turning mystery plot based on: {topic}. Include: 1) The Crime Scene & Baffling Circumstance, 2) The Lead Investigator profile and personal weakness, 3) 3 Plausible Suspects with distinct motives and alibis, 4) 2 Misleading Red Herrings and 1 Crucial Overlooked Clue, and 5) The Shocking Climax Revelation explaining the true culprit's method.",
    "dateAdded": "2026-09-18"
  },
  'scifi-concept-generator': {
    "title": "Sci-Fi Concept Generator",
    "desc": "Develop imaginative science fiction world premises, futuristic dilemmas, speculative tech, and story conflicts.",
    "icon": "🛸",
    "category": "creative",
    "placeholder": "e.g., Cyberpunk space colony where memories are traded as currency and a hacker uncovers a missing century...",
    "label": "Sci-Fi Subgenre & Core Speculative Premise",
    "promptTemplate": "Develop an imaginative, thought-provoking science fiction story universe concept for: {topic}. Provide: 1) The Speculative \"What If?\" Core Premise, 2) The Technological / Scientific Breakthrough and its unintended dark side, 3) Society's Division (Who benefits vs who suffers), 4) The Protagonist's moral dilemma, and 5) 3 major story arcs or chapter catalysts.",
    "dateAdded": "2026-09-18"
  },
  'monologue-writer': {
    "title": "Monologue Writer",
    "desc": "Write powerful dramatic, comedic, or introspective theatrical monologues tailored to character motivations.",
    "icon": "🎭",
    "category": "creative",
    "placeholder": "e.g., An astronaut delivering a final transmission back home after their ship gets caught in orbital drift...",
    "label": "Character Profile, Emotion & Situation",
    "promptTemplate": "Write a powerful, audition-ready character monologue based on: {topic}. Include: 1) Character background & emotional objective (What do they desperately want?), 2) Stage directions & subtext cues in [brackets], 3) An escalating emotional shift from beginning to end, and 4) A memorable, punchy final closing statement.",
    "dateAdded": "2026-09-18"
  },
  'character-name-generator': {
    "title": "Character Name Generator",
    "desc": "Generate themed character names with origins, symbolic meanings, titles, and nickname variations for writers.",
    "icon": "👤",
    "category": "creative",
    "placeholder": "e.g., Dark fantasy rogue with noble ancestry, gritty Scandinavian sound, secretive personality...",
    "label": "Genre, Cultural Vibe & Character Role",
    "promptTemplate": "Generate 15 evocative, memorable character names tailored to: {topic}. For each name provide: 1) Full Name, 2) Cultural / Linguistic Origin, 3) Hidden Etymological Meaning or Symbolism, 4) Common In-World Nickname, and 5) An optional Title or Epithet.",
    "dateAdded": "2026-09-18"
  },
  'setting-scene-description': {
    "title": "Setting/Scene Description Generator",
    "desc": "Create sensory-rich environment descriptions evoking atmosphere, lighting, smells, and emotional undertones.",
    "icon": "🌄",
    "category": "creative",
    "placeholder": "e.g., An overgrown abandoned botanical greenhouse during a twilight summer thunderstorm, eerie yet serene...",
    "label": "Location, Time of Day & Mood",
    "promptTemplate": "Write a sensory-rich, atmospheric scene setting description for: {topic}. Engage all 5 senses: 1) Sight (Lighting, architecture, shadows, palette), 2) Sound (Ambient acoustics, distant whispers, cadence), 3) Smell & Taste (Atmospheric scents, moisture, decay or freshness), 4) Touch (Temperature, textures, humidity), and 5) The psychological mood evoked in a character entering the space.",
    "dateAdded": "2026-09-18"
  },
  'joke-pun-generator': {
    "title": "Joke & Pun Generator",
    "desc": "Generate clever dad jokes, situational puns, one-liners, and humorous banter on any topic or industry.",
    "icon": "😄",
    "category": "creative",
    "placeholder": "e.g., Software engineering, git commits, coffee addiction, clean and witty humor...",
    "label": "Topic, Profession or Keyword",
    "promptTemplate": "Generate 15 clever, family-friendly jokes and witty puns on: {topic}. Group them into: 1) Quick One-Liners (5), 2) Punny Dad Jokes with setup/punchline (5), and 3) Relatable Observational Situations (5). Keep them sharp, clever, and entertaining.",
    "dateAdded": "2026-09-18"
  },
  'fable-moral-story': {
    "title": "Fable/Moral Story Generator",
    "desc": "Write timeless fables featuring animal protagonists, metaphorical challenges, and clear moral lessons.",
    "icon": "🦊",
    "category": "creative",
    "placeholder": "e.g., An impatient hummingbird and a steady tortoise learning that haste without strategy wastes energy...",
    "label": "Lesson / Moral & Animal Characters",
    "promptTemplate": "Write a charming, timeless fable based on: {topic}. Structure with: 1) The animal protagonists and their contrasting traits, 2) The unexpected challenge or contest they face in the wild, 3) The humorous or humbling consequence of folly, 4) The moment of realization and assistance, and 5) The explicit moral proverb stated clearly at the end.",
    "dateAdded": "2026-09-18"
  },
  'superhero-origin-story': {
    "title": "Superhero Origin Story Generator",
    "desc": "Craft thrilling superhero origin arcs with inciting incidents, unique power mechanics, flaws, and nemesis encounters.",
    "icon": "⚡",
    "category": "creative",
    "placeholder": "e.g., A sonic acoustics engineer in Neo-Chicago who gains the ability to manipulate kinetic sound vibrations...",
    "label": "Power Concept, Identity & City Setting",
    "promptTemplate": "Develop a thrilling superhero origin story package for: {topic}. Provide: 1) Civilian identity, mundane profession, and personal trauma, 2) The inciting scientific / mystical accident that granted abilities, 3) Detailed power mechanics (strengths, physics, and critical biological limits), 4) The Hero Code & Costume Aesthetic, and 5) The birth of their arch-nemesis.",
    "dateAdded": "2026-09-18"
  },
  'faq-content-generator': {
    "title": "FAQ Content Generator",
    "desc": "Generate structured, SEO-friendly FAQ questions and authoritative answers with Schema.org readiness.",
    "icon": "❓",
    "category": "seo",
    "placeholder": "e.g., Multi Tube Views public media player workspace, account requirements, supported platforms, and privacy...",
    "label": "Product, Service or Topic",
    "promptTemplate": "Generate a structured, SEO-friendly FAQ section for: {topic}. Provide 8 high-intent user questions accompanied by clear, authoritative 40-70 word answers. Include a ready-to-copy JSON-LD FAQPage schema markup snippet for direct inclusion in webpage headers.",
    "dateAdded": "2026-09-18"
  },
  'product-page-seo-description': {
    "title": "Product Page SEO Description Writer",
    "desc": "Write high-ranking ecommerce product descriptions blending user-focused benefits with primary and secondary keywords.",
    "icon": "🏷️",
    "category": "seo",
    "placeholder": "e.g., Ergonomic bamboo standing desk, target keywords: motorized adjustable desk, home office furniture...",
    "label": "Product Name, Target Keywords & Specs",
    "promptTemplate": "Write an SEO-optimized, high-converting product page description for: {topic}. Structure with: 1) Keyword-rich H1 title and compelling product narrative hook, 2) Bulleted key features paired with tangible user benefits, 3) Technical specifications table format, 4) Natural integration of primary and LSI search keywords, and 5) Clear trust badges and purchase CTA.",
    "dateAdded": "2026-09-18"
  },
  'blog-outline-generator': {
    "title": "Blog Outline Generator",
    "desc": "Generate comprehensive, search-optimized article outlines with H2/H3 headers, search intent matching, and takeaways.",
    "icon": "📝",
    "category": "seo",
    "placeholder": "e.g., How to optimize video metadata for multi-platform streaming, comprehensive creator guide...",
    "label": "Target Keyword & Topic Concept",
    "promptTemplate": "Generate a comprehensive, search-intent-optimized long-form blog outline for: {topic}. Include: 1) Recommended SEO Title & Target Search Intent (Informational, Commercial, etc.), 2) Introduction hook and thesis statement, 3) 5-7 major H2 sections with nested H3 subheadings, bullet points of facts to include, and internal link suggestions, and 4) Actionable conclusion with key takeaways checklist.",
    "dateAdded": "2026-09-18"
  },
  'content-refresh-suggestions': {
    "title": "Content Refresh Suggestion Tool",
    "desc": "Analyze older blog posts or pages to generate actionable content updates, stat refreshes, and internal link ideas.",
    "icon": "🔄",
    "category": "seo",
    "placeholder": "e.g., 2024 Guide to Social Media Video Aspect Ratios, needing 2026 platform dimension updates...",
    "label": "Existing Article Title or URL Summary",
    "promptTemplate": "Generate an actionable content refresh and decay audit for: {topic}. Provide: 1) Identified outdated aspects needing modern 2026 replacement, 2) 3 new high-volume sub-topics / FAQs to add for search intent expansion, 3) Visual asset upgrades (infographics, video embeds), 4) Internal link opportunities, and 5) Revised Title & Meta Description to boost CTR.",
    "dateAdded": "2026-09-18"
  },
  'category-page-seo-description': {
    "title": "Category Page SEO Description Writer",
    "desc": "Write descriptive, keyword-targeted introductory copy for ecommerce or content category archive pages.",
    "icon": "📂",
    "category": "seo",
    "placeholder": "e.g., Wireless creator microphones and audio gear, commercial intent, highlighting Lavalier and shotgun mics...",
    "label": "Category Name, Product Types & Target Intent",
    "promptTemplate": "Write an SEO-optimized category page content guide for: {topic}. Provide: 1) Short top-of-page introduction (<60 words) designed to welcome users without pushing products below the fold, 2) In-depth bottom-of-page buyer guide (250 words) with H2 subheadings, and 3) 4 quick FAQ accordion entries to target long-tail queries.",
    "dateAdded": "2026-09-18"
  },
  'people-also-ask-answers': {
    "title": "People-Also-Ask Answer Generator",
    "desc": "Produce direct, authoritative 40-60 word answers specifically crafted to capture Google People Also Ask rich snippets.",
    "icon": "💡",
    "category": "seo",
    "placeholder": "e.g., Can you watch multiple Twitch and YouTube streams at the same time on one screen?...",
    "label": "Specific Question & Context",
    "promptTemplate": "Craft 4 direct, concise answers (40-55 words each) engineered specifically to win Google People Also Ask (PAA) rich snippet boxes for: {topic}. Format each answer to begin immediately with the direct factual response (no filler intros), followed by 1 supporting detail and a concluding verification point.",
    "dateAdded": "2026-09-18"
  },
  'title-tag-length-checker': {
    "title": "Title Tag Length Checker",
    "desc": "Evaluate SEO title tags for character length, pixel width approximation, power words, and mobile snippet truncation.",
    "icon": "📏",
    "category": "seo",
    "placeholder": "e.g., Best Multi-Platform Media Workspace for Creators (2026) | Multi Tube Views...",
    "label": "Proposed SEO Title Tag & Brand Name",
    "promptTemplate": "Analyze and optimize proposed SEO title tags for: {topic}. Provide: 1) Character count evaluation (ideal 50-60 chars) and estimated pixel width check (<580px), 2) Truncation risk assessment for desktop vs mobile SERP, 3) Click-through power word and number analysis, and 4) 5 rewritten, perfectly formatted variations with brand suffix.",
    "dateAdded": "2026-09-18"
  },
  'onpage-seo-checklist': {
    "title": "On-Page SEO Checklist Generator",
    "desc": "Generate tailored on-page optimization checklists covering title, meta, headers, images, schema, and internal links.",
    "icon": "📋",
    "category": "seo",
    "placeholder": "e.g., Landing page targeting 'free online audio video converter', high competition SaaS search...",
    "label": "Page Type, Target Keyword & Audience",
    "promptTemplate": "Generate a rigorous, prioritized on-page SEO checklist customized for: {topic}. Group items into: 1) URL & Snippet Optimization (Slug, Title, Meta), 2) Content & Structure (H1-H3, Keyword Density, Semantic Entities), 3) Media & Accessibility (Alt text, file compression), 4) Technical & Schema (Canonical, Structured Data), and 5) Internal & Outbound Linking Strategy.",
    "dateAdded": "2026-09-18"
  },
  'regex-cheatsheet-generator': {
    "title": "Regex Cheat-Sheet Generator",
    "desc": "Generate custom regular expression patterns, flags, group explanations, and test cases for any text parsing task.",
    "icon": "🔣",
    "category": "technical",
    "placeholder": "e.g., Matching international phone numbers with optional country codes and dashed extensions...",
    "label": "Text Pattern Matching Goal",
    "promptTemplate": "Generate a production-ready regular expression (Regex) pattern and documentation guide for: {topic}. Include: 1) The exact Regex pattern string with flags (g, i, m), 2) Token-by-token breakdown explaining each character group and quantifier, 3) 5 Valid test strings that match, 4) 3 Invalid test strings that fail, and 5) Code implementation snippets in JavaScript/TypeScript and Python.",
    "dateAdded": "2026-09-18"
  },
  'http-status-code-explainer': {
    "title": "HTTP Status Code Explainer",
    "desc": "Explain HTTP response codes with root cause diagnoses, common triggers, RFC specifications, and client/server fixes.",
    "icon": "🌐",
    "category": "technical",
    "placeholder": "e.g., 504 Gateway Timeout occurring during reverse proxy file uploads on Nginx...",
    "label": "Status Code (e.g., 403, 429, 502, 504) & Context",
    "promptTemplate": "Provide a comprehensive engineering diagnosis and resolution guide for HTTP status code: {topic}. Include: 1) Official RFC name and classification (Client Error vs Server Error), 2) Root technical cause in plain English, 3) 4 most common real-world triggers, 4) Step-by-step troubleshooting checklist for backend engineers and DevOps, and 5) Client-side handling best practices (retries with exponential backoff).",
    "dateAdded": "2026-09-18"
  },
  'config-file-comment-generator': {
    "title": "Config File Comment Generator",
    "desc": "Add clear, professional documentation comments and security tips to complex JSON, YAML, TOML, or INI configs.",
    "icon": "⚙️",
    "category": "technical",
    "placeholder": "e.g., Docker compose file with PostgreSQL, Redis cache, and Node backend service with volumes...",
    "label": "Configuration Snippet or Type",
    "promptTemplate": "Annotate and thoroughly document this configuration file or architecture setup: {topic}. Provide: 1) Annotated configuration file with professional inline comments explaining each directive, 2) Security best practices and permission warnings, 3) Environment variable recommendations for sensitive keys, and 4) Validation / linting command to verify syntax before deployment.",
    "dateAdded": "2026-09-18"
  },
  'code-snippet-formatter-guide': {
    "title": "Code Snippet Formatter Guide",
    "desc": "Receive clean code styling guides, linter recommendations, naming conventions, and idiomatic refactoring tips.",
    "icon": "🧹",
    "category": "technical",
    "placeholder": "e.g., TypeScript async/await error handling pattern in Express REST API controllers...",
    "label": "Language & Code Pattern",
    "promptTemplate": "Generate an idiomatic code style guide and clean refactoring example for: {topic}. Provide: 1) The standard \"Messy / Anti-Pattern\" example, 2) The refactored \"Clean Code\" version following SOLID principles, 3) Explicit naming conventions and directory organization tips, and 4) Recommended ESLint / Prettier rule settings.",
    "dateAdded": "2026-09-18"
  },
  'db-query-optimization-tips': {
    "title": "Database Query Optimization Tips Generator",
    "desc": "Analyze slow SQL and NoSQL queries to suggest index strategies, join optimizations, and execution plan fixes.",
    "icon": "🗄️",
    "category": "technical",
    "placeholder": "e.g., PostgreSQL query joining 2 million rows of user events with transactions on created_at...",
    "label": "SQL Query, Table Structure & Database Engine",
    "promptTemplate": "Analyze and provide query optimization recommendations for: {topic}. Provide: 1) Diagnosis of potential query bottlenecks (Full Table Scans, N+1 queries, Cartesian joins), 2) Suggested composite or partial index definitions (B-Tree, GIN, etc.), 3) Refactored, high-performance query rewrite, and 4) Query execution plan tips (EXPLAIN ANALYZE guidance).",
    "dateAdded": "2026-09-18"
  },
  'a11y-checklist-generator': {
    "title": "Web Accessibility (a11y) Checklist Generator",
    "desc": "Generate WCAG 2.2 AA compliance checklists tailored to web components, forms, modals, and screen reader navigability.",
    "icon": "♿",
    "category": "technical",
    "placeholder": "e.g., Custom dropdown select menu with keyboard navigation and ARIA live regions...",
    "label": "Component Type & User Flow",
    "promptTemplate": "Generate a comprehensive WCAG 2.2 Level AA accessibility compliance checklist for: {topic}. Cover: 1) Keyboard Navigation (Focus management, Tab order, Enter/Space/Escape interactions), 2) Screen Reader & ARIA (Roles, States, Live Regions, Labels), 3) Visual & Color Contrast (4.5:1 ratio, focus indicator rings), and 4) Mobile touch target sizing (minimum 44x44px) and testing tools.",
    "dateAdded": "2026-09-18"
  },
  'browser-compatibility-notes': {
    "title": "Browser Compatibility Notes Generator",
    "desc": "Check modern CSS, JavaScript, and Web API features against browser support matrices with polyfill solutions.",
    "icon": "💻",
    "category": "technical",
    "placeholder": "e.g., CSS subgrid and view transitions API support across Chrome, Safari, and Firefox with fallbacks...",
    "label": "Web Feature or API (e.g., CSS Container Queries, WebCodecs)",
    "promptTemplate": "Generate a browser compatibility and fallback guide for: {topic}. Include: 1) Current browser support breakdown (Chromium, Safari / WebKit, Firefox), 2) Known quirks or partial implementations on iOS Safari vs desktop, 3) Progressive enhancement fallback strategy (using @supports or feature detection), and 4) Recommended polyfill or modern graceful degradation pattern.",
    "dateAdded": "2026-09-18"
  },
  'tech-stack-recommendation': {
    "title": "Tech Stack Recommendation Generator",
    "desc": "Evaluate project requirements to recommend optimal frontend, backend, database, and hosting architecture stacks.",
    "icon": "🏗️",
    "category": "technical",
    "placeholder": "e.g., Real-time collaborative whiteboard app with 10k concurrent users, solo developer proficient in React...",
    "label": "Project Idea, Scale & Team Skillset",
    "promptTemplate": "Deliver an architectural tech stack recommendation for: {topic}. Provide: 1) Recommended Frontend framework & state strategy, 2) Backend language, framework & API protocol (REST vs GraphQL vs WebSocket), 3) Database engine & caching layer, 4) Hosting & Deployment infrastructure, and 5) Key trade-off analysis comparing development speed vs long-term maintenance costs.",
    "dateAdded": "2026-09-18"
  }
};

if (typeof window !== 'undefined') {
  window.AI_CATEGORIES = AI_CATEGORIES;
  window.AI_TOOLS_DATA = AI_TOOLS_DATA;
}

