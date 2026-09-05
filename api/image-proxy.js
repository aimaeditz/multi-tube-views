// ============================================================
// MTV IMAGE STUDIO — Robust AI Image Proxy (Backend)
// ============================================================
// - Auto-detects all GEMINI_API_KEY / GEMINI_API_KEY_2... keys
// - Uses the Google Gemini image generation/editing model (gemini-3.1-flash-lite-image)
// - Supports a per-attempt timeout (35 seconds) so slow keys don't block
// - Implements task-specific, high-precision reference-matched instructions
// - Fallback cascade options support high-quality gemini-3.1-flash-image
// ============================================================

async function tryOneImage(key, model, promptText, base64Image = null, mimeType = null, maskBase64 = null, imageConfig = null) {
  // Use native AbortController
  const controller = new globalThis.AbortController();
  // Image operations can take slightly longer, so we give it 45 seconds per attempt
  const timeout = setTimeout(() => controller.abort(), 45000);
  
  try {
    const parts = [];
    
    // Add primary or reference image if provided
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: base64Image
        }
      });
    }
    
    // For object-eraser or background-remover with mask, add the mask image
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
    
    const requestPayload = {
      contents: [{ parts }]
    };

    if (imageConfig) {
      requestPayload.generationConfig = {
        imageConfig
      };
    }
    
    console.log(`[ImageProxy] Attempting model ${model} with key snippet: ...${key.slice(-5)}`);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(requestPayload)
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
      // If candidates returned text instead of inlineData (e.g. error message or safety refusal)
      const textResponse = responseParts.map(p => p.text).filter(Boolean).join(' ');
      throw new Error(`Model ${model} succeeded but did not return image data. API message: ${textResponse || 'No image in response'}`);
    }
    
    return resultBase64;
  } finally {
    clearTimeout(timeout);
  }
}

function raceSuccess(promises) {
  return new Promise((resolve, reject) => {
    let remaining = promises.length;
    const errors = [];
    promises.forEach((p, idx) => {
      p.then(resolve).catch((err) => {
        errors[idx] = err.message || String(err);
        remaining--;
        if (remaining === 0) reject(new Error(errors.filter(Boolean).join(' | ')));
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
    const { image, task, options, prompt: rawPrompt, promptText: rawPromptText } = req.body || {};

    const isGenerationTask = task === 'text-to-image' || task === 'image-generator' || task === 'generate-image';

    if (!image && !isGenerationTask) {
      res.status(400).json({ error: 'Primary input image (base64) is required for editing tasks' });
      return;
    }

    if (!task) {
      res.status(400).json({ error: 'Task identifier is required' });
      return;
    }

    // Extract mimeType and raw base64 data from the base64 URL if provided
    let mimeType = 'image/jpeg';
    let base64Image = image || null;
    if (image && typeof image === 'string' && image.startsWith('data:')) {
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

    // Determine target aspect ratio if specified
    let imageConfig = null;
    const requestedRatio = (options && (options.aspectRatio || options.aspect_ratio)) || '1:1';
    const validRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    if (isGenerationTask) {
      imageConfig = {
        aspectRatio: validRatios.includes(requestedRatio) ? requestedRatio : '1:1'
      };
    }

    // Build the task-specific high-precision MTV AI prompt instruction
    let promptText = '';
    switch (task) {
      case 'text-to-image':
      case 'image-generator':
      case 'generate-image': {
        const userPrompt = (rawPrompt || rawPromptText || (options && options.prompt) || '').trim();
        if (!userPrompt) {
          res.status(400).json({ error: 'Please enter a description for the image you want MTV AI to create.' });
          return;
        }

        const style = (options && (options.style || options.selectedStyle)) || '';
        const mood = (options && (options.mood || options.lighting)) || '';
        const negativePrompt = (options && options.negativePrompt) || '';

        if (base64Image) {
          // Reference-to-Image / Image Guidance Mode
          promptText = `Generate a brand new, visually stunning artwork based on this creative description: "${userPrompt}". Use the provided reference image as visual context for composition, subject structure, color harmony, and aesthetic style.`;
        } else {
          // Pure Text-to-Image Mode
          promptText = `Create an original, ultra-detailed, high-definition visual based on the following prompt: "${userPrompt}".`;
        }

        if (style && style !== 'None' && style !== 'Auto' && style !== 'Default') {
          promptText += ` Visual art style: ${style}.`;
        }
        if (mood && mood !== 'None' && mood !== 'Auto') {
          promptText += ` Lighting & atmosphere: ${mood}.`;
        }
        if (negativePrompt && negativePrompt.trim()) {
          promptText += ` Avoid the following unwanted elements: ${negativePrompt.trim()}.`;
        }
        promptText += ` Ensure professional aesthetic quality, rich texture detail, accurate anatomy, clean lighting, and balanced composition.`;
        break;
      }
      case 'background-remover':
        promptText = "Detect the primary subject (person, product, object, animal) with ultra-precise sub-pixel edge matting. Remove the entire background completely, leaving it 100% transparent. Preserve microscopic edge details like fine individual hair strands, fur, fabric threads, transparent glass edges, and complex silhouettes. Output ONLY the isolated subject on a transparent background with zero haloing, zero residual background pixels, and crisp antialiased edges.";
        if (maskBase64) {
          promptText += " A highlight mask image is provided showing user-specified regions. Keep the subject areas marked in the mask and remove all background regions accordingly.";
        }
        break;
      case 'image-upscaler':
        const targetRes = (options && options.targetResolution) || '4K';
        promptText = `Perform ultra-high-definition AI super-resolution upscaling to ${targetRes}. Intelligently reconstruct lost detail, textures, skin pores, hair strands, text legibility, and fine geometry. Eliminate compression artifacts, noise, blur, and pixelation without creating artificial cartoonish smoothing or over-sharpened halos. Maintain natural photo realism, correct tone mapping, and perfect color fidelity. Output a clean, razor-sharp, photorealistic high-resolution image.`;
        break;
      case 'photo-sharpener':
        promptText = "Fix focus blur, motion blur, and optical softness while fully preserving natural photo texture. Intelligently restore sharp focus to eyes, faces, text, edges, and fine details. Remove optical haze and chromatic aberration without introducing grainy noise, ringing artifacts, or harsh over-sharpened edges. Output a crystal-clear, perfectly focused, natural photo.";
        break;
      case 'photo-restorer':
        promptText = "Perform master-level photo restoration on this vintage/damaged photograph. Remove all scratches, cracks, creases, dust spots, water stains, and tape marks. Denoise and remove film grain while restoring facial details, eyes, skin texture, and sharp features. Correct color fading, yellowing, sepia discoloration, and poor contrast, balancing light and shadows into rich, modern dynamic range. Output a clean, restored, high-definition photograph that retains original historical authenticity.";
        break;
      case 'image-colorizer':
        const moodPreset = (options && (options.selectedPreset || options.preset)) || 'Vibrant Warmth';
        promptText = `Colorize this black and white / grayscale photograph with photorealistic, historically accurate colors. Apply natural skin tones, realistic clothing hues, environmental flora/sky colors, and accurate ambient lighting reflections. Ensure zero color bleeding across object boundaries. Mood/style guidance: ${moodPreset}. Output a vibrant, full-color photorealistic image that looks like it was originally shot on a modern digital camera.`;
        break;
      case 'art-style-filter':
        const selectedStyle = (options && options.selectedStyle) || 'Comic Cartoon';
        promptText = `Transform this photo into a high-quality ${selectedStyle} artwork. Re-render the image with distinct artistic strokes, bold clean outlines, rich color palettes, and stylized shading appropriate for ${selectedStyle}. Preserve the original subject's facial resemblance, proportions, expression, and key visual identifiers. Output a polished, professional digital art piece in the ${selectedStyle} style.`;
        break;
      case 'object-eraser':
        promptText = "Completely remove the painted/marked watermarks, text overlays, logos, objects, or distracting elements specified in the mask image. Inpaint and seamlessly reconstruct the underlying background texture, lighting, patterns, and visual details with 100% photorealistic accuracy. The erased region must blend invisibly into the surrounding context with no blurry patches, ghosting, distorted geometry, or visible editing artifacts. Output the clean image with the object fully removed.";
        break;
      default:
        res.status(400).json({ error: `Unsupported task: ${task}` });
        return;
    }

    // Retrieve all available Gemini / MTV AI keys
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
      res.status(500).json({ error: 'No MTV AI service key configured. Please configure an API key in settings.' });
      return;
    }

    // Prioritize gemini-3.1-flash-lite-image, cascading to gemini-3.1-flash-image
    const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];

    let lastErrorDetails = '';
    for (const model of imageModels) {
      // Create attempts for all available API keys in parallel for this model
      const attempts = apiKeys.map((key) => 
        tryOneImage(key, model, promptText, base64Image, mimeType, maskBase64, imageConfig)
      );
      
      try {
        const resultBase64 = await raceSuccess(attempts);
        if (resultBase64) {
          // Send back the base64 encoded edited or generated image
          const outMimeType = (task === 'background-remover' || isGenerationTask) ? 'image/png' : 'image/jpeg';
          res.status(200).json({
            success: true,
            model: 'MTV AI Engine',
            aspectRatio: imageConfig ? imageConfig.aspectRatio : undefined,
            image: `data:${outMimeType};base64,${resultBase64}`
          });
          return;
        }
      } catch (err) {
        lastErrorDetails = err.message || String(err);
        console.warn(`[ImageProxy] Model ${model} cascade failed: ${lastErrorDetails}`);
        // Cascade to the next model in the list
      }
    }

    res.status(502).json({ 
      error: `MTV AI image processing attempt was unable to complete. Please try refining your prompt or reference image.` 
    });

  } catch (err) {
    console.error('[ImageProxy] Handler error:', err);
    res.status(500).json({ error: `Image processing error: ${err.message || 'Internal server error'}` });
  }
}
