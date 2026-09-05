/**
 * MTV AI Image Generator
 * Dedicated Client Engine for text-to-image and reference-to-image creation.
 * Server-side processed via MTV AI Engine without any client-side vendor exposure.
 */

(function () {
  'use strict';

  // State
  let currentMode = 'text-to-image'; // 'text-to-image' | 'ref-to-image'
  let selectedAspectRatio = '1:1';
  let selectedStyle = 'Photorealistic';
  let referenceImageBase64 = null;
  let referenceImageName = '';
  let isGenerating = false;
  let statusInterval = null;
  let currentGeneratedImage = null;
  let currentGeneratedPrompt = '';
  const generationHistory = [];

  // DOM Elements cache
  let promptInput;
  let charCounter;
  let btnClearPrompt;
  let btnEnhancePrompt;
  let dropZone;
  let fileInput;
  let refPreview;
  let refThumb;
  let refFileName;
  let refFileSize;
  let btnRemoveRef;
  let refCard;
  let btnGenerate;
  let btnGenerateText;
  let idleState;
  let loadingState;
  let loadingStatusText;
  let resultWrap;
  let resultImg;
  let actionsBar;
  let btnDownload;
  let btnCopyImage;
  let btnCopyPrompt;
  let btnUseAsRef;
  let btnFullscreen;
  let historyCard;
  let historyList;
  let lightboxModal;
  let lightboxImg;
  let lightboxClose;
  let advancedToggle;
  let advancedContent;
  let negativePromptInput;
  let lightingSelect;

  const STATUS_MESSAGES = [
    'Connecting to MTV AI Engine...',
    'Interpreting creative vision...',
    'Synthesizing visual geometry...',
    'Refining lighting & atmospheric depth...',
    'Rendering high-fidelity details...',
    'Finalizing master canvas...'
  ];

  const STYLE_ENHANCERS = {
    'Photorealistic': '8k resolution, photorealistic, highly detailed, authentic textures, natural reflections, professional camera RAW photography',
    'Digital Art': 'vibrant digital art, dynamic composition, master illustration, concept art wallpaper, crisp contours',
    'Cinematic': 'cinematic still, 35mm anamorphic lens, dramatic moody lighting, volumetric haze, color graded masterpiece',
    'Anime': 'modern anime style, clean line art, vibrant cel shading, detailed background scenery, expressive aesthetics',
    '3D Render': 'octane render, raytracing, subsurface scattering, 3D CGI masterpiece, ultra-detailed geometry',
    'Oil Painting': 'classic oil on canvas, expressive impasto brushstrokes, rich chromatic pigments, fine art masterpiece',
    'Concept Art': 'epic concept art, expansive scale, atmospheric lighting, detailed matte painting, matte fantasy landscape',
    'Cyberpunk': 'cyberpunk aesthetics, glowing neon reflections on wet surfaces, futuristic tech details, midnight contrast',
    'Minimalist': 'clean minimalist vector, elegant silhouette, balanced negative space, refined geometric harmony'
  };

  function init() {
    // Cache DOM Elements
    promptInput = document.getElementById('image-prompt-input');
    charCounter = document.getElementById('prompt-char-count');
    btnClearPrompt = document.getElementById('btn-clear-prompt');
    btnEnhancePrompt = document.getElementById('btn-enhance-prompt');
    dropZone = document.getElementById('image-drop-zone');
    fileInput = document.getElementById('reference-file-input');
    refPreview = document.getElementById('image-ref-preview');
    refThumb = document.getElementById('image-ref-thumb');
    refFileName = document.getElementById('image-ref-filename');
    refFileSize = document.getElementById('image-ref-filesize');
    btnRemoveRef = document.getElementById('btn-remove-ref');
    refCard = document.getElementById('card-reference-image');
    btnGenerate = document.getElementById('btn-generate-artwork');
    btnGenerateText = document.getElementById('btn-generate-text');
    idleState = document.getElementById('image-idle-state');
    loadingState = document.getElementById('image-loading-state');
    loadingStatusText = document.getElementById('loading-status-text');
    resultWrap = document.getElementById('image-result-wrap');
    resultImg = document.getElementById('image-result-display');
    actionsBar = document.getElementById('image-actions-bar');
    btnDownload = document.getElementById('btn-download-image');
    btnCopyImage = document.getElementById('btn-copy-image');
    btnCopyPrompt = document.getElementById('btn-copy-prompt');
    btnUseAsRef = document.getElementById('btn-use-as-ref');
    btnFullscreen = document.getElementById('btn-fullscreen-image');
    historyCard = document.getElementById('image-history-card');
    historyList = document.getElementById('image-history-list');
    lightboxModal = document.getElementById('image-lightbox-modal');
    lightboxImg = document.getElementById('image-lightbox-img');
    lightboxClose = document.getElementById('image-lightbox-close');
    advancedToggle = document.getElementById('btn-advanced-toggle');
    advancedContent = document.getElementById('advanced-options-content');
    negativePromptInput = document.getElementById('negative-prompt-input');
    lightingSelect = document.getElementById('lighting-mood-select');

    bindEvents();
    updateCharCounter();
  }

  function bindEvents() {
    // Mode Switching Tabs
    const modeTabs = document.querySelectorAll('.image-gen-tab-btn');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.getAttribute('data-mode') || 'text-to-image';
        if (currentMode === 'ref-to-image') {
          if (refCard) refCard.style.display = 'block';
        } else {
          // If in text mode, keep reference image collapsed if empty
          if (refCard && !referenceImageBase64) {
            refCard.style.display = 'none';
          }
        }
      });
    });

    // Prompt Textarea inputs
    if (promptInput) {
      promptInput.addEventListener('input', updateCharCounter);
      promptInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          startGeneration();
        }
      });
    }

    // Clear prompt button
    if (btnClearPrompt) {
      btnClearPrompt.addEventListener('click', () => {
        if (promptInput) {
          promptInput.value = '';
          promptInput.focus();
          updateCharCounter();
        }
      });
    }

    // Enhance prompt button
    if (btnEnhancePrompt) {
      btnEnhancePrompt.addEventListener('click', enhancePrompt);
    }

    // Inspiration prompt chips
    const presetChips = document.querySelectorAll('.image-gen-preset-chip');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
        const style = chip.getAttribute('data-style');
        if (promptInput) {
          promptInput.value = text;
          promptInput.focus();
          updateCharCounter();
        }
        if (style) {
          selectStylePreset(style);
        }
      });
    });

    // Aspect Ratio buttons
    const ratioBtns = document.querySelectorAll('.aspect-ratio-btn');
    ratioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ratioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAspectRatio = btn.getAttribute('data-ratio') || '1:1';
      });
    });

    // Style preset chips
    const styleBtns = document.querySelectorAll('.style-chip-btn');
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStyle = btn.getAttribute('data-style') || 'Photorealistic';
      });
    });

    // Reference Image Upload Zone
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleReferenceFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          handleReferenceFile(fileInput.files[0]);
        }
      });
    }

    // Remove reference image
    if (btnRemoveRef) {
      btnRemoveRef.addEventListener('click', (e) => {
        e.stopPropagation();
        clearReferenceImage();
      });
    }

    // Advanced Options accordion toggle
    if (advancedToggle && advancedContent) {
      advancedToggle.addEventListener('click', () => {
        const isHidden = advancedContent.style.display === 'none';
        advancedContent.style.display = isHidden ? 'block' : 'none';
        const arrow = advancedToggle.querySelector('.arrow-toggle');
        if (arrow) {
          arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    // Generate button
    if (btnGenerate) {
      btnGenerate.addEventListener('click', startGeneration);
    }

    // Action buttons
    if (btnDownload) {
      btnDownload.addEventListener('click', downloadCurrentResult);
    }

    if (btnCopyImage) {
      btnCopyImage.addEventListener('click', copyCurrentImageToClipboard);
    }

    if (btnCopyPrompt) {
      btnCopyPrompt.addEventListener('click', copyCurrentPrompt);
    }

    if (btnUseAsRef) {
      btnUseAsRef.addEventListener('click', useResultAsReference);
    }

    if (btnFullscreen && resultImg) {
      btnFullscreen.addEventListener('click', openLightbox);
      resultImg.addEventListener('click', openLightbox);
    }

    // Lightbox modal controls
    if (lightboxModal && lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  }

  function updateCharCounter() {
    if (!promptInput || !charCounter) return;
    const len = promptInput.value.length;
    charCounter.textContent = `${len} characters`;
  }

  function selectStylePreset(styleName) {
    selectedStyle = styleName;
    const styleBtns = document.querySelectorAll('.style-chip-btn');
    styleBtns.forEach(btn => {
      if (btn.getAttribute('data-style') === styleName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function enhancePrompt() {
    if (!promptInput) return;
    const current = promptInput.value.trim();
    if (!current) {
      showToast('Please enter an initial idea or prompt first.', 'info');
      return;
    }

    const enhancer = STYLE_ENHANCERS[selectedStyle] || 'ultra-detailed, 8k resolution, cinematic lighting, masterpiece';
    
    // If prompt doesn't already contain common quality keywords, enrich it
    if (!current.toLowerCase().includes('detailed') && !current.toLowerCase().includes('lighting')) {
      promptInput.value = `${current}, ${enhancer}`;
    } else {
      promptInput.value = `${current}, award-winning composition, volumetric atmosphere, masterfully executed`;
    }
    updateCharCounter();
    showToast('Prompt enhanced with cinematic & stylistic details.', 'success');
  }

  function handleReferenceFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPEG, WEBP).', 'error');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showToast('Image size exceeds 12MB. Please select a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      referenceImageBase64 = e.target.result;
      referenceImageName = file.name;

      if (dropZone) dropZone.style.display = 'none';
      if (refPreview) refPreview.style.display = 'flex';
      if (refThumb) refThumb.src = referenceImageBase64;
      if (refFileName) refFileName.textContent = file.name;
      if (refFileSize) refFileSize.textContent = formatBytes(file.size);

      // Switch mode tab to Reference to Image if not already active
      const refTab = document.querySelector('.image-gen-tab-btn[data-mode="ref-to-image"]');
      if (refTab) refTab.click();

      showToast('Reference image attached successfully.', 'success');
    };
    reader.readAsDataURL(file);
  }

  function clearReferenceImage() {
    referenceImageBase64 = null;
    referenceImageName = '';
    if (fileInput) fileInput.value = '';
    if (dropZone) dropZone.style.display = 'block';
    if (refPreview) refPreview.style.display = 'none';
    if (refThumb) refThumb.src = '';
  }

  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async function startGeneration() {
    if (isGenerating) return;

    const rawPrompt = promptInput ? promptInput.value.trim() : '';
    if (!rawPrompt) {
      showToast('Please enter a description for the image you want to generate.', 'error');
      if (promptInput) promptInput.focus();
      return;
    }

    setGeneratingState(true);

    // Prepare payload
    const payload = {
      task: 'text-to-image',
      prompt: rawPrompt,
      options: {
        prompt: rawPrompt,
        aspectRatio: selectedAspectRatio,
        style: selectedStyle,
        lighting: lightingSelect ? lightingSelect.value : 'Natural Balanced',
        negativePrompt: negativePromptInput ? negativePromptInput.value.trim() : ''
      }
    };

    // Attach reference image if present
    if (referenceImageBase64) {
      payload.image = referenceImageBase64;
    }

    try {
      const apiBase = (window.MTV_API_BASE_URL !== undefined) ? window.MTV_API_BASE_URL : '';
      const endpoint = `${apiBase}/api/image-proxy`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errMessage = 'MTV AI image processing failed.';
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMessage = errData.error;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }

      const data = await response.json();

      if (!data || !data.image) {
        throw new Error('No image was returned from the MTV AI Engine.');
      }

      // Display result
      displayGeneratedImage(data.image, rawPrompt, selectedAspectRatio, selectedStyle);
      showToast('Artwork generated successfully!', 'success');

    } catch (err) {
      console.error('[MTV AI Image Generator Error]:', err);
      showToast(err.message || 'Image generation failed. Please try again.', 'error');
      setGeneratingState(false, false);
    }
  }

  function setGeneratingState(generating, showSuccess = true) {
    isGenerating = generating;

    if (btnGenerate) {
      btnGenerate.disabled = generating;
      if (btnGenerateText) {
        btnGenerateText.textContent = generating ? 'Creating Artwork...' : 'Generate Artwork';
      }
    }

    if (generating) {
      if (idleState) idleState.style.display = 'none';
      if (resultWrap) resultWrap.style.display = 'none';
      if (actionsBar) actionsBar.style.display = 'none';
      if (loadingState) {
        loadingState.style.display = 'flex';
        let msgIndex = 0;
        if (loadingStatusText) loadingStatusText.textContent = STATUS_MESSAGES[0];
        clearInterval(statusInterval);
        statusInterval = setInterval(() => {
          msgIndex = (msgIndex + 1) % STATUS_MESSAGES.length;
          if (loadingStatusText) {
            loadingStatusText.textContent = STATUS_MESSAGES[msgIndex];
          }
        }, 2600);

        // On mobile viewports, smoothly scroll to the canvas output card below the generate button
        if (window.innerWidth <= 768 && canvasCard) {
          setTimeout(() => {
            canvasCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    } else {
      clearInterval(statusInterval);
      if (loadingState) loadingState.style.display = 'none';
      if (!showSuccess) {
        if (!currentGeneratedImage && idleState) {
          idleState.style.display = 'flex';
        } else if (currentGeneratedImage && resultWrap) {
          resultWrap.style.display = 'flex';
          if (actionsBar) actionsBar.style.display = 'flex';
        }
      }
    }
  }

  function displayGeneratedImage(imageUrl, prompt, ratio, style) {
    currentGeneratedImage = imageUrl;
    currentGeneratedPrompt = prompt;

    setGeneratingState(false, true);

    if (idleState) idleState.style.display = 'none';
    if (resultWrap) resultWrap.style.display = 'flex';
    if (actionsBar) actionsBar.style.display = 'flex';

    if (resultImg) {
      resultImg.src = imageUrl;
      resultImg.alt = `Generated by MTV AI: ${prompt}`;
    }

    // Add to history list
    addToHistory({
      image: imageUrl,
      prompt: prompt,
      ratio: ratio,
      style: style,
      timestamp: Date.now()
    });
  }

  function addToHistory(item) {
    generationHistory.unshift(item);
    if (generationHistory.length > 8) {
      generationHistory.pop();
    }
    renderHistory();
  }

  function renderHistory() {
    if (!historyCard || !historyList) return;

    if (generationHistory.length <= 1) {
      historyCard.style.display = 'none';
      return;
    }

    historyCard.style.display = 'block';
    historyList.innerHTML = '';

    generationHistory.forEach((item, index) => {
      const thumb = document.createElement('img');
      thumb.className = `image-gen-history-thumb ${index === 0 ? 'active' : ''}`;
      thumb.src = item.image;
      thumb.alt = `MTV AI Render ${index + 1}`;
      thumb.title = item.prompt;

      thumb.addEventListener('click', () => {
        document.querySelectorAll('.image-gen-history-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        currentGeneratedImage = item.image;
        currentGeneratedPrompt = item.prompt;
        if (resultImg) {
          resultImg.src = item.image;
          resultImg.alt = `Generated by MTV AI: ${item.prompt}`;
        }
      });

      historyList.appendChild(thumb);
    });
  }

  function downloadCurrentResult() {
    if (!currentGeneratedImage) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const link = document.createElement('a');
    link.href = currentGeneratedImage;
    link.download = `mtv-ai-image-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Download started.', 'success');
  }

  async function copyCurrentImageToClipboard() {
    if (!currentGeneratedImage) return;

    try {
      const res = await fetch(currentGeneratedImage);
      const blob = await res.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        showToast('Image copied to clipboard!', 'success');
      } else {
        showToast('Direct image copying is unsupported in this browser. Use Download button.', 'info');
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
      showToast('Could not copy image to clipboard. Please use Download.', 'info');
    }
  }

  function copyCurrentPrompt() {
    if (!currentGeneratedPrompt) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentGeneratedPrompt)
        .then(() => showToast('Prompt copied to clipboard!', 'success'))
        .catch(() => showToast('Could not copy prompt text.', 'error'));
    }
  }

  function useResultAsReference() {
    if (!currentGeneratedImage) return;

    referenceImageBase64 = currentGeneratedImage;
    referenceImageName = 'Generated-Concept-Ref.png';

    if (refThumb) refThumb.src = referenceImageBase64;
    if (refFileName) refFileName.textContent = 'Generated-Concept-Ref.png';
    if (refFileSize) refFileSize.textContent = 'MTV AI Canvas';

    if (dropZone) dropZone.style.display = 'none';
    if (refPreview) refPreview.style.display = 'flex';
    if (refCard) refCard.style.display = 'block';

    const refTab = document.querySelector('.image-gen-tab-btn[data-mode="ref-to-image"]');
    if (refTab) refTab.click();

    showToast('Loaded into Reference Image slot. You can now iterate!', 'success');
  }

  function openLightbox() {
    if (!currentGeneratedImage || !lightboxModal || !lightboxImg) return;
    lightboxImg.src = currentGeneratedImage;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Lightweight Toast Notification
  function showToast(message, type = 'info') {
    let toast = document.getElementById('mtv-ai-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mtv-ai-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.right = '2rem';
      toast.style.zIndex = '99999';
      toast.style.padding = '0.75rem 1.25rem';
      toast.style.borderRadius = '8px';
      toast.style.fontSize = '0.86rem';
      toast.style.fontWeight = '600';
      toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      toast.style.transition = 'opacity 220ms ease, transform 220ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }

    if (type === 'error') {
      toast.style.backgroundColor = '#e11d48';
      toast.style.color = '#ffffff';
    } else if (type === 'success') {
      toast.style.backgroundColor = '#10b981';
      toast.style.color = '#ffffff';
    } else {
      toast.style.backgroundColor = 'var(--text-primary, #111827)';
      toast.style.color = 'var(--bg-surface-elevated, #ffffff)';
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
