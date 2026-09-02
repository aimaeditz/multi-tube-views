// ============================================================
// MTV IMAGE STUDIO — Robust AI Image Proxy (Backend)
// ============================================================
// - Auto-detects all GEMINI_API_KEY / GEMINI_API_KEY_2... keys
// - Uses the Google Gemini image generation/editing model (gemini-3.1-flash-lite-image)
// - Supports a per-attempt timeout (35 seconds) so slow keys don't block
// - Implements task-specific, carefully-engineered instructions
// - Fallback cascade options support high-quality gemini-3.1-flash-image
// ============================================================

// Native global AbortController is used, no external package import is needed.

async function tryOneImage(key, model, promptText, base64Image, mimeType, maskBase64 = null) {
  // Use native AbortController
  const controller = new globalThis.AbortController();
  // Image operations can take slightly longer, so we give it 35 seconds per attempt
  const timeout = setTimeout(() => controller.abort(), 35000);
  
  try {
    const parts = [];
    
    // Add primary image
    parts.push({
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: base64Image
      }
    });
    
    // For object-eraser, add the black-and-white mask image
    if (maskBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/png', // Mask is always PNG
          data: maskBase64
        }
      });
    }
    
    // Add instruction text
    parts.push({
      text: promptText
    });
    
    console.log(`[ImageProxy] Attempting model ${model} with key snippet: ...${key.slice(-5)}`);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Model ${model} returned status ${response.status}: ${errText}`);
    }
    
    const data = await response.json();
    
    // Look for inlineData inside candidates
    let resultBase64 = '';
    const responseParts = data.candidates?.[0]?.content?.parts || [];
    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        resultBase64 = part.inlineData.data;
        break;
      }
    }
    
    if (!resultBase64) {
      throw new Error(`Model ${model} succeeded but did not return any image data`);
    }
    
    return resultBase64;
  } finally {
    clearTimeout(timeout);
  }
}

function raceSuccess(promises) {
  return new Promise((resolve, reject) => {
    let remaining = promises.length;
    let lastError = null;
    promises.forEach((p) => {
      p.then(resolve).catch((err) => {
        lastError = err;
        remaining--;
        if (remaining === 0) reject(lastError || new Error('All attempts failed'));
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
    const { image, task, options } = req.body || {};

    if (!image) {
      res.status(400).json({ error: 'Primary input image (base64) is required' });
      return;
    }

    if (!task) {
      res.status(400).json({ error: 'Task identifier is required' });
      return;
    }

    // Extract mimeType and raw base64 data from the base64 URL
    let mimeType = 'image/jpeg';
    let base64Image = image;
    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Image = match[2];
      }
    }

    let maskBase64 = null;
    if (options && options.maskImage) {
      let maskData = options.maskImage;
      if (maskData.startsWith('data:')) {
        const match = maskData.match(/^data:[^;]+;base64,(.+)$/);
        if (match) {
          maskBase64 = match[1];
        }
      } else {
        maskBase64 = maskData;
      }
    }

    // Build the task-specific Gemini prompt instruction
    let promptText = '';
    switch (task) {
      case 'background-remover':
        promptText = "Remove the background from this image completely, keeping only the main subject perfectly intact with clean, precise edges. Output the subject on a fully transparent background. Do not remove or alter any part of the subject itself, including hair, fine details, and natural shadows that are part of the subject. Preserve the subject's original quality and colors exactly.";
        break;
      case 'image-upscaler':
        const targetRes = (options && options.targetResolution) || '4K';
        promptText = `Upscale this image to a significantly higher resolution (${targetRes}) while intelligently reconstructing fine details, sharp edges, and natural textures. Do not introduce blur, artifacts, or unnatural smoothing. Preserve the original composition, colors, and content exactly — only enhance resolution and clarity.`;
        break;
      case 'photo-sharpener':
        promptText = "Sharpen this image and correct any blur, producing crisp, well-defined edges and clear fine details, as if refocused with a professional camera. Do not oversharpen or introduce halo artifacts. Preserve the original colors, lighting, and composition exactly.";
        break;
      case 'photo-restorer':
        promptText = "Restore this old or damaged photo to a clean, professional condition: remove dust, scratches, creases, and noise; correct faded or yellowed colors and contrast; recover lost detail where possible. Preserve the original subject, composition, and authentic character of the photo — do not alter the identity or expressions of any people in it.";
        break;
      case 'image-colorizer':
        promptText = "Colorize this black-and-white or grayscale photo with realistic, natural, and vivid colors appropriate to the subject, era, and setting shown. Ensure skin tones, clothing, and environmental colors look authentic and premium quality, not washed out or flat. Preserve all original details and composition exactly.";
        break;
      case 'art-style-filter':
        const selectedStyle = (options && options.selectedStyle) || 'Comic Cartoon';
        promptText = `Transform this photo into a high-quality [${selectedStyle}] artistic rendition, with clean, premium, professional-grade stylization — rich detail and appealing artistic quality, not a flat or low-effort filter. Preserve the subject's recognizable features and composition.`;
        break;
      case 'object-eraser':
        promptText = "Remove the marked/masked region from this image completely and realistically fill in the area based on the surrounding background, so the removal is seamless and undetectable. Do not affect any part of the image outside the marked region.";
        break;
      default:
        res.status(400).json({ error: `Unsupported task: ${task}` });
        return;
    }

    // Retrieve all available Gemini keys
    const apiKeys = [];
    if (process.env.GEMINI_API_KEY) apiKeys.push(process.env.GEMINI_API_KEY);
    if (process.env.GOOGLE_AI_API_KEY) apiKeys.push(process.env.GOOGLE_AI_API_KEY);
    if (process.env.GOOGLE_API_KEY) apiKeys.push(process.env.GOOGLE_API_KEY);
    if (process.env.GEMINI_KEY) apiKeys.push(process.env.GEMINI_KEY);
    let i = 2;
    while (process.env[`GEMINI_API_KEY_${i}`]) {
      apiKeys.push(process.env[`GEMINI_API_KEY_${i}`]);
      i++;
    }

    if (apiKeys.length === 0) {
      res.status(500).json({ error: 'No MTV AI API keys configured. Please add one in settings.' });
      return;
    }

    // We can prioritize gemini-3.1-flash-lite-image, cascading to gemini-3.1-flash-image
    const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];

    for (const model of imageModels) {
      // Create attempts for all available API keys in parallel for this model
      const attempts = apiKeys.map((key) => 
        tryOneImage(key, model, promptText, base64Image, mimeType, maskBase64)
      );
      
      try {
        const resultBase64 = await raceSuccess(attempts);
        if (resultBase64) {
          // Send back the base64 encoded edited image
          // Let's deduce response mimeType (PNG for transparent/background remover, original/JPEG for others)
          const outMimeType = task === 'background-remover' ? 'image/png' : 'image/jpeg';
          res.status(200).json({
            success: true,
            model,
            image: `data:${outMimeType};base64,${resultBase64}`
          });
          return;
        }
      } catch (err) {
        console.warn(`[ImageProxy] Model ${model} cascade failed: ${err.message}`);
        // Cascade to the next model in the list
      }
    }

    res.status(502).json({ error: 'All MTV AI image editing API attempts were exhausted or timed out.' });

  } catch (err) {
    console.error('[ImageProxy] Handler error:', err);
    res.status(500).json({ error: 'Something went wrong during image processing. Please try again.' });
  }
}
