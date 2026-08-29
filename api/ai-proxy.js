// ============================================================
// MTV AI SYSTEM — Core AI Proxy (Backend)
// ============================================================
// Ye file GitHub repo mein "api/ai-proxy.js" path par jaani chahiye.
// Vercel isko automatically ek secure serverless endpoint bana dega:
//   https://yourdomain.com/api/ai-proxy
//
// NAYA TOOL ADD KARNA HO? Bas neeche "systemInstructions" object mein
// ek naya entry add karo — baaki sab automatic kaam karega.
// ============================================================

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
    const { prompt, task } = req.body || {};

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server AI key not configured. Vercel Environment Variables check karo.' });
      return;
    }

    // ------------------------------------------------------
    // YAHAN NAYE TOOLS ADD KARO (task name : instructions)
    // ------------------------------------------------------
    const systemInstructions = {
      'hashtag-generator': 'You generate relevant, trending hashtags for social media content. Return only a clean list of hashtags, nothing else.',
      'keyword-generator': 'You generate SEO-friendly keywords for video or content titles. Return only a comma-separated list of keywords, nothing else.',
      'title-generator': 'You generate catchy, click-worthy titles for videos or posts. Return 5 short title options as a numbered list.',
      'default': 'You are a helpful assistant for the MTV (Multi Tube Views) platform. Keep responses short and useful.'
    };

    const systemInstruction = systemInstructions[task] || systemInstructions['default'];

    const model = 'gemini-3.6-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'AI request failed' });
      return;
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ result: resultText, task: task || 'default' });

  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
