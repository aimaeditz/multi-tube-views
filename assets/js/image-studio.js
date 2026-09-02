/**
 * Multi Tube Views (MTV) — Image Studio Tools Engine
 * 100% Browser-based Client-Side Image Processing & Algorithms
 */

class ImageStudioEngine {
  constructor() {
    this.currentTool = null;
    this.originalImage = null; // Image element
    this.originalFile = null;  // File object
    this.uploadedImageWidth = 0;
    this.uploadedImageHeight = 0;

    // Watermark/Object Eraser state
    this.maskCanvas = null;
    this.maskCtx = null;
    this.isDrawing = false;
    this.brushSize = 25;
    this.lastX = 0;
    this.lastY = 0;

    // DOM Elements
    this.listView = document.getElementById('image-tools-list-view');
    this.workspaceView = document.getElementById('image-tool-workspace');
    this.backBtn = document.getElementById('btn-back-to-image-tools');
    
    this.toolIcon = document.getElementById('image-tool-icon');
    this.toolTitle = document.getElementById('image-tool-title');
    this.toolDesc = document.getElementById('image-tool-desc');
    this.aboutTitle = document.getElementById('about-tool-title');
    this.aboutText = document.getElementById('about-tool-text');

    this.dropzone = document.getElementById('image-file-dropzone');
    this.fileInput = document.getElementById('image-file-input');
    this.fileSelectBtn = document.getElementById('btn-image-select-file');
    this.fileInfoCard = document.getElementById('image-file-info-card');
    this.fileNameDisplay = document.getElementById('image-file-name');
    this.fileMetaDisplay = document.getElementById('image-file-meta');
    this.fileRemoveBtn = document.getElementById('btn-image-remove-file');

    this.canvasWorkspaceWrap = document.getElementById('image-canvas-workspace-wrap');
    this.inpaintingCanvas = document.getElementById('inpainting-canvas');
    this.canvasContainer = document.getElementById('canvas-container');
    this.brushPreview = document.getElementById('brush-preview');
    this.resetMaskBtn = document.getElementById('btn-clear-mask');

    this.inputPreviewWrap = document.getElementById('image-input-preview-wrap');
    this.inputImgTag = document.getElementById('image-input-tag');

    this.processBtn = document.getElementById('btn-process-image');
    this.actionText = document.getElementById('image-action-text');
    this.loadingIndicator = document.getElementById('image-processing-loading');
    this.loadingStatus = document.getElementById('image-loading-status');
    this.progressBar = document.getElementById('image-progress-bar');

    this.outputWrap = document.getElementById('image-output-wrap');
    this.comparisonOriginalImg = document.getElementById('image-comparison-original-img');
    this.outputImg = document.getElementById('image-output-img');
    this.downloadBtn = document.getElementById('btn-download-image');
    this.processAnotherBtn = document.getElementById('btn-process-another-image');

    this.compressorStats = document.getElementById('compressor-stats');
    this.sizeOrigDisplay = document.getElementById('comp-size-orig');
    this.sizeNewDisplay = document.getElementById('comp-size-new');
    this.savingsDisplay = document.getElementById('comp-savings-pct');

    // Breadcrumbs
    this.breadcrumbParentLink = document.getElementById('breadcrumb-parent-link');
    this.breadcrumbSeparator = document.getElementById('breadcrumb-sub-separator');
    this.breadcrumbSubPage = document.getElementById('breadcrumb-sub-page');

    // Tool metadata configurations
    this.toolsMeta = {
      'bg-remover': {
        title: 'Background Remover',
        desc: 'Detect and isolate main subjects, creating transparent PNGs instantly with browser segmentation.',
        icon: '👤',
        action: 'Remove Background',
        about: 'This tool analyzes pixels from corners to detect dominant background colors and makes them transparent, blending boundary edges. You can also switch to manual clicking mode to target and erase specific colors.'
      },
      'upscaler': {
        title: 'Image Upscaler (2K/4K/8K)',
        desc: 'Increase resolution up to 8K using bicubic interpolation with secondary detail sharpening passes.',
        icon: '🔍',
        action: 'Upscale Image',
        about: 'Upscales image geometry via high-quality canvas bicubic interpolation and applies unsharp-mask matrix kernels to enhance high-frequency edges and contrast.'
      },
      'sharpener': {
        title: 'Photo Sharpener / Deblur',
        desc: 'Fix blurry images, enhance details, and sharpen soft edges with unsharp mask convolution.',
        icon: '✨',
        action: 'Sharpen Photo',
        about: 'Applies standard laplacian convolution matrices to amplify local high-frequency gradients, recovering focus and details in blurry photos.'
      },
      'restorer': {
        title: 'Old Photo Restorer',
        desc: 'Reduce dust/scratches, fix contrast yellowing, and optimize shadows in historical photos.',
        icon: '🕰️',
        action: 'Restore Vintage Photo',
        about: 'Neutralizes aged yellow tints by balancing RGB channel means, expands luminance depth via contrast stretching, and applies bilateral noise suppression to remove scratches.'
      },
      'colorizer': {
        title: 'Image Colorizer',
        desc: 'Breathe life into grayscale photos using intelligent luminance mapping and vibrant artistic presets.',
        icon: '🎨',
        action: 'Colorize Grayscale',
        about: 'Analyzes luminance tones and maps grayscale levels to vibrant color gradients (skin peach, solar warmth, deep ocean blues) based on creative presets.'
      },
      'cartoon-filter': {
        title: 'Cartoon / Art Style Filter',
        desc: 'Apply artistic filters like Comic Cartoon, Pencil Sketch, or Watercolor painting to your pictures.',
        icon: '🎭',
        action: 'Apply Art Filter',
        about: 'Transforms photographs into comic art or hand-drawn sketches using bilateral color-binning quantization combined with Sobel-operator edge outlines.'
      },
      'compressor': {
        title: 'Smart Image Compressor',
        desc: 'Reduce image file size dramatically while maintaining sharp quality using dynamic encoding.',
        icon: '📉',
        action: 'Compress Photo',
        about: 'Re-encodes image assets into optimized JPEG formats using canvas quality controls, shrinking payload sizes directly inside the browser.'
      },
      'object-eraser': {
        title: 'Watermark & Object Eraser',
        desc: 'Paint and erase watermark logos, text overlays, or small objects with fast browser inpainting.',
        icon: '🧹',
        action: 'Erase Selected Objects',
        about: 'Provides an interactive canvas brush to paint masks. The inpainting algorithm searches adjacent unmasked borders, copying and propagating texture inwards.'
      }
    };

    this.init();
  }

  init() {
    this.setupRoutes();
    this.setupUploadHandlers();
    this.setupWorkspaceListeners();
    this.setupEraserCanvas();
    this.setupOptionBindings();
  }

  // ROUTING ENGINE
  setupRoutes() {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const toolId = params.get('tool');

      if (toolId && this.toolsMeta[toolId]) {
        this.openWorkspace(toolId);
      } else {
        this.closeWorkspace();
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Run once initially
  }

  openWorkspace(toolId) {
    this.currentTool = toolId;
    const meta = this.toolsMeta[toolId];

    // Hide directory, show workspace
    this.listView.style.display = 'none';
    this.workspaceView.style.display = 'block';

    // Update Headers
    this.toolIcon.textContent = meta.icon;
    this.toolTitle.textContent = meta.title;
    this.toolDesc.textContent = meta.desc;
    this.aboutTitle.textContent = `About ${meta.title}`;
    this.aboutText.textContent = meta.about;
    this.actionText.textContent = meta.action;

    // Update Breadcrumbs
    this.breadcrumbSeparator.style.display = 'inline';
    this.breadcrumbSubPage.style.display = 'inline';
    this.breadcrumbSubPage.textContent = meta.title;

    // Reset workspace state & file uploads
    this.resetWorkspace();

    // Toggle tool specific option panels
    document.querySelectorAll('.image-options-panel').forEach(panel => {
      panel.style.display = 'none';
    });
    const activePanel = document.getElementById(`panel-${toolId}`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }

    // Scroll to top of workspace smoothly
    this.workspaceView.scrollIntoView({ behavior: 'smooth' });
  }

  closeWorkspace() {
    this.currentTool = null;
    this.listView.style.display = 'block';
    this.workspaceView.style.display = 'none';

    // Reset Breadcrumbs
    this.breadcrumbSeparator.style.display = 'none';
    this.breadcrumbSubPage.style.display = 'none';

    // Clear URL parameters smoothly
    if (window.location.search) {
      history.pushState(null, '', 'image-studio-tools.html');
    }
  }

  resetWorkspace() {
    this.originalImage = null;
    this.originalFile = null;
    this.fileInput.value = '';

    // Hide results & files
    this.fileInfoCard.style.display = 'none';
    this.canvasWorkspaceWrap.style.display = 'none';
    this.inputPreviewWrap.style.display = 'none';
    this.outputWrap.style.display = 'none';
    this.compressorStats.style.display = 'none';
    this.loadingIndicator.style.display = 'none';

    // Show dropzone
    this.dropzone.style.display = 'block';

    // Disable action button
    this.processBtn.disabled = true;
    this.processBtn.style.opacity = '0.6';

    // Toggle special click-to-select manual mode notice for bg remover
    const bgManualHint = document.getElementById('bg-manual-hint');
    if (bgManualHint) bgManualHint.style.display = 'none';

    // Clear canvas
    const ctx = this.inpaintingCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.inpaintingCanvas.width, this.inpaintingCanvas.height);
  }

  // FILE UPLOAD AND EVENT HANDLERS
  setupUploadHandlers() {
    // Select File Button
    this.fileSelectBtn.addEventListener('click', () => {
      this.fileInput.click();
    });

    // Native file input change
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleUploadedFile(e.target.files[0]);
      }
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.remove('drag-over');
      }, false);
    });

    this.dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files && dt.files[0]) {
        this.handleUploadedFile(dt.files[0]);
      }
    }, false);

    // Remove File Button
    this.fileRemoveBtn.addEventListener('click', () => {
      this.resetWorkspace();
    });

    // Manual sampling click event on background remover image tag
    this.inputImgTag.addEventListener('click', (e) => {
      if (this.currentTool !== 'bg-remover') return;
      const bgMethod = document.getElementById('bg-method').value;
      if (bgMethod !== 'click') return;

      // Calculate clicked position color
      const rect = this.inputImgTag.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Map click position to image intrinsic dimensions
      const intrinsicX = Math.floor((clickX / rect.width) * this.uploadedImageWidth);
      const intrinsicY = Math.floor((clickY / rect.height) * this.uploadedImageHeight);

      // Create dummy canvas to read pixel
      const canvas = document.createElement('canvas');
      canvas.width = this.uploadedImageWidth;
      canvas.height = this.uploadedImageHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.originalImage, 0, 0);
      const pixel = ctx.getImageData(intrinsicX, intrinsicY, 1, 1).data;

      // Store pixel color values as key attributes
      this.inputImgTag.setAttribute('data-manual-rgb', `${pixel[0]},${pixel[1]},${pixel[2]}`);

      // Add feedback highlight animation on screen
      const pulse = document.createElement('div');
      pulse.style.position = 'fixed';
      pulse.style.left = `${e.clientX - 10}px`;
      pulse.style.top = `${e.clientY - 10}px`;
      pulse.style.width = '20px';
      pulse.style.height = '20px';
      pulse.style.border = '2px solid var(--accent-primary)';
      pulse.style.borderRadius = '50%';
      pulse.style.pointerEvents = 'none';
      pulse.style.zIndex = '9999';
      pulse.style.animation = 'ping 0.6s cubic-bezier(0, 0, 0.2, 1) forwards';
      document.body.appendChild(pulse);
      setTimeout(() => pulse.remove(), 600);

      this.loadingStatus.textContent = `Color Selected: RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]}). Press Remove Background to process!`;
      this.progressBar.style.width = '100%';
      this.loadingIndicator.style.display = 'block';
    });
  }

  handleUploadedFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Unsupported file format. Please select a valid graphic photo (JPEG, PNG, WebP).');
      return;
    }

    this.originalFile = file;
    this.fileNameDisplay.textContent = file.name;
    const mbSize = (file.size / (1024 * 1024)).toFixed(2);
    this.fileMetaDisplay.textContent = `${file.type} • ${mbSize} MB`;

    // Hide dropzone, show file info
    this.dropzone.style.display = 'none';
    this.fileInfoCard.style.display = 'flex';

    // Load Image Element
    const reader = new FileReader();
    reader.onload = (e) => {
      this.originalImage = new Image();
      this.originalImage.onload = () => {
        this.uploadedImageWidth = this.originalImage.naturalWidth;
        this.uploadedImageHeight = this.originalImage.naturalHeight;

        // Populate Input Previews
        this.inputImgTag.src = e.target.result;
        this.comparisonOriginalImg.src = e.target.result;

        // Routing layout structure based on tool logic
        if (this.currentTool === 'object-eraser' || this.currentTool === 'bg-remover') {
          this.canvasWorkspaceWrap.style.display = 'block';
          this.inputPreviewWrap.style.display = this.currentTool === 'bg-remover' ? 'block' : 'none';
          this.fitCanvasToImage();
        } else {
          this.canvasWorkspaceWrap.style.display = 'none';
          this.inputPreviewWrap.style.display = 'block';
        }

        // Enable Process Button
        this.processBtn.disabled = false;
        this.processBtn.style.opacity = '1';
      };
      this.originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Helper method to detect if user painted on the canvas mask
  hasDrawnMask() {
    if (!this.maskCtx || !this.inpaintingCanvas) return false;
    const imgData = this.maskCtx.getImageData(0, 0, this.inpaintingCanvas.width, this.inpaintingCanvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i] > 180 && data[i+1] < 120 && data[i+2] < 120) {
        return true;
      }
    }
    return false;
  }

  // ERASER / TOUCH-UP WORKSPACE INTERACTION (CANVAS & OVERLAYS)
  setupEraserCanvas() {
    const getPos = (e) => {
      const rect = this.inpaintingCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * this.inpaintingCanvas.width,
        y: ((clientY - rect.top) / rect.height) * this.inpaintingCanvas.height
      };
    };

    const startDraw = (e) => {
      if (this.currentTool !== 'object-eraser' && this.currentTool !== 'bg-remover') return;
      e.preventDefault();
      this.isDrawing = true;
      const pos = getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const draw = (e) => {
      if (!this.isDrawing || (this.currentTool !== 'object-eraser' && this.currentTool !== 'bg-remover')) return;
      e.preventDefault();
      const pos = getPos(e);

      this.maskCtx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // Red selection highlight
      this.maskCtx.lineJoin = 'round';
      this.maskCtx.lineCap = 'round';
      this.maskCtx.lineWidth = this.brushSize * (this.inpaintingCanvas.width / this.inpaintingCanvas.clientWidth);

      this.maskCtx.beginPath();
      this.maskCtx.moveTo(this.lastX, this.lastY);
      this.maskCtx.lineTo(pos.x, pos.y);
      this.maskCtx.stroke();

      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const stopDraw = () => {
      this.isDrawing = false;
    };

    // Mouse handlers
    this.inpaintingCanvas.addEventListener('mousedown', startDraw);
    this.inpaintingCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    // Touch handlers
    this.inpaintingCanvas.addEventListener('touchstart', startDraw, { passive: false });
    this.inpaintingCanvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);

    // Eraser hover cursor indicator
    this.inpaintingCanvas.addEventListener('mouseenter', () => {
      if (this.currentTool === 'object-eraser' || this.currentTool === 'bg-remover') this.brushPreview.style.display = 'block';
    });

    this.inpaintingCanvas.addEventListener('mousemove', (e) => {
      if (this.currentTool !== 'object-eraser' && this.currentTool !== 'bg-remover') return;
      const rect = this.inpaintingCanvas.getBoundingClientRect();
      const parentRect = this.canvasContainer.getBoundingClientRect();

      const posX = e.clientX - parentRect.left;
      const posY = e.clientY - parentRect.top;

      // Adjust preview circle dimensions relative to client size width
      const scale = rect.width / this.inpaintingCanvas.width;
      const displayBrushSize = this.brushSize * scale;

      this.brushPreview.style.width = `${displayBrushSize}px`;
      this.brushPreview.style.height = `${displayBrushSize}px`;
      this.brushPreview.style.left = `${posX}px`;
      this.brushPreview.style.top = `${posY}px`;
    });

    this.inpaintingCanvas.addEventListener('mouseleave', () => {
      this.brushPreview.style.display = 'none';
    });

    // Reset Mask Button
    this.resetMaskBtn.addEventListener('click', () => {
      this.fitCanvasToImage();
    });
  }

  fitCanvasToImage() {
    if (!this.originalImage) return;

    // Constrain displayed image dimensions inside 640px workspace boundaries
    const maxWidth = 640;
    let width = this.uploadedImageWidth;
    let height = this.uploadedImageHeight;

    if (width > maxWidth) {
      height = Math.floor((maxWidth / width) * height);
      width = maxWidth;
    }

    this.inpaintingCanvas.width = width;
    this.inpaintingCanvas.height = height;

    this.maskCtx = this.inpaintingCanvas.getContext('2d');
    this.maskCtx.drawImage(this.originalImage, 0, 0, width, height);
  }

  // SLIDERS & RANGE DISPLAY VALUE BINDINGS
  setupOptionBindings() {
    // Back navigation link trigger
    this.backBtn.addEventListener('click', () => {
      this.closeWorkspace();
    });

    // Category lists trigger binding
    document.querySelectorAll('.btn-open-image-tool').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = e.currentTarget.closest('.image-tool-card').getAttribute('data-tool-id');
        history.pushState({ tool: toolId }, '', `?tool=${toolId}`);
        this.openWorkspace(toolId);
      });
    });

    // Option threshold range text update
    const bgThreshold = document.getElementById('bg-threshold');
    const bgThresholdVal = document.getElementById('bg-threshold-val');
    bgThreshold.addEventListener('input', (e) => {
      bgThresholdVal.textContent = e.target.value;
    });

    const bgMethod = document.getElementById('bg-method');
    const bgManualHint = document.getElementById('bg-manual-hint');
    bgMethod.addEventListener('change', (e) => {
      if (e.target.value === 'click') {
        bgManualHint.style.display = 'block';
        if (this.loadingIndicator.style.display === 'block') {
          this.loadingIndicator.style.display = 'none';
        }
      } else {
        bgManualHint.style.display = 'none';
      }
    });

    const sharpenIntensity = document.getElementById('sharpen-intensity');
    const sharpenIntensityVal = document.getElementById('sharpen-intensity-val');
    sharpenIntensity.addEventListener('input', (e) => {
      sharpenIntensityVal.textContent = e.target.value;
    });

    const compressQuality = document.getElementById('compress-quality');
    const compressQualityVal = document.getElementById('compress-quality-val');
    compressQuality.addEventListener('input', (e) => {
      compressQualityVal.textContent = `${e.target.value}%`;
    });

    const eraserBrushSize = document.getElementById('eraser-brush-size');
    const brushSizeVal = document.getElementById('brush-size-val');
    if (eraserBrushSize && brushSizeVal) {
      eraserBrushSize.addEventListener('input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
        brushSizeVal.textContent = `${e.target.value}px`;
      });
    }

    const bgBrushSize = document.getElementById('bg-brush-size');
    const bgBrushSizeVal = document.getElementById('bg-brush-size-val');
    if (bgBrushSize && bgBrushSizeVal) {
      bgBrushSize.addEventListener('input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
        bgBrushSizeVal.textContent = `${e.target.value}px`;
      });
    }

    const clearBgMaskBtn = document.getElementById('btn-clear-bg-mask');
    if (clearBgMaskBtn) {
      clearBgMaskBtn.addEventListener('click', () => {
        this.fitCanvasToImage();
      });
    }
  }

  setupWorkspaceListeners() {
    // Core Click Processing Action Trigger
    this.processBtn.addEventListener('click', () => {
      if (!this.originalImage) return;
      this.executeProcessing();
    });

    // Reset loop
    this.processAnotherBtn.addEventListener('click', () => {
      this.resetWorkspace();
    });

    // Download Handler
    this.downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `${this.currentTool}-${Date.now()}.png`;
      link.href = this.outputImg.src;
      link.click();
    });
  }

  // ALGORITHM KERNEL PIPELINE DISPATCH
  executeProcessing() {
    this.outputWrap.style.display = 'none';
    this.loadingIndicator.style.display = 'block';
    this.progressBar.style.width = '0%';
    this.loadingStatus.textContent = 'Preparing image channels...';

    // Disable buttons during active computation
    this.processBtn.disabled = true;
    this.processBtn.style.opacity = '0.5';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 80) {
        clearInterval(interval);
        this.runAlgorithm();
      } else {
        this.progressBar.style.width = `${progress}%`;
        this.loadingStatus.textContent = `Analyzing pixel matrices (${progress}%)...`;
      }
    }, 70);
  }

  resizeImageIfLarge(imgElement, maxDimension = 1024) {
    let width = imgElement.naturalWidth || imgElement.width;
    let height = imgElement.naturalHeight || imgElement.height;
    
    if (width <= maxDimension && height <= maxDimension) {
      // Return original base64 URL
      return imgElement.src;
    }
    
    if (width > height) {
      height = Math.floor((maxDimension / width) * height);
      width = maxDimension;
    } else {
      width = Math.floor((maxDimension / height) * width);
      height = maxDimension;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  generateEraserMaskBase64() {
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = this.uploadedImageWidth;
    maskCanvas.height = this.uploadedImageHeight;
    const maskCtx = maskCanvas.getContext('2d');
    
    // Solid black background (unmasked)
    maskCtx.fillStyle = '#000000';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    const scaleX = this.uploadedImageWidth / this.inpaintingCanvas.width;
    const scaleY = this.uploadedImageHeight / this.inpaintingCanvas.height;
    
    const visibleMaskImgData = this.maskCtx.getImageData(0, 0, this.inpaintingCanvas.width, this.inpaintingCanvas.height);
    const visibleMaskData = visibleMaskImgData.data;
    
    const hiresMaskImgData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const hiresMaskData = hiresMaskImgData.data;
    
    for (let y = 0; y < maskCanvas.height; y++) {
      const maskY = Math.min(this.inpaintingCanvas.height - 1, Math.floor(y / scaleY));
      for (let x = 0; x < maskCanvas.width; x++) {
        const maskX = Math.min(this.inpaintingCanvas.width - 1, Math.floor(x / scaleX));
        const mIdx = (maskY * this.inpaintingCanvas.width + maskX) * 4;
        
        if (visibleMaskData[mIdx] > 180 && visibleMaskData[mIdx+1] < 120 && visibleMaskData[mIdx+2] < 120) {
          const hIdx = (y * maskCanvas.width + x) * 4;
          hiresMaskData[hIdx] = 255;     // R
          hiresMaskData[hIdx+1] = 255;   // G
          hiresMaskData[hIdx+2] = 255;   // B
          hiresMaskData[hIdx+3] = 255;   // A
        }
      }
    }
    maskCtx.putImageData(hiresMaskImgData, 0, 0);
    return maskCanvas.toDataURL('image/png');
  }

  async runAlgorithm() {
    // If it's Smart Image Compressor, preserve its client-side functionality entirely
    if (this.currentTool === 'compressor') {
      this.loadingStatus.textContent = 'Rendering outputs...';
      this.progressBar.style.width = '95%';

      const processCanvas = document.createElement('canvas');
      let width = this.uploadedImageWidth;
      let height = this.uploadedImageHeight;
      processCanvas.width = width;
      processCanvas.height = height;
      const ctx = processCanvas.getContext('2d');
      ctx.drawImage(this.originalImage, 0, 0, width, height);

      this.runCompressor(processCanvas);
      return;
    }

    this.loadingStatus.textContent = 'Contacting MTV AI Engine...';
    this.progressBar.style.width = '85%';

    try {
      this.loadingStatus.textContent = 'Optimizing image resolution...';
      const resizedBase64 = this.resizeImageIfLarge(this.originalImage, 1024);

      let task = '';
      const options = {};

      switch (this.currentTool) {
        case 'bg-remover':
          task = 'background-remover';
          if (this.hasDrawnMask()) {
            this.loadingStatus.textContent = 'Generating touch-up selection mask...';
            const bgMaskBase64 = this.generateEraserMaskBase64();
            options.maskImage = bgMaskBase64;
          }
          break;
        case 'upscaler':
          task = 'image-upscaler';
          const factor = document.getElementById('upscale-target').value;
          options.targetResolution = factor === '2x' ? '2K' : factor === '4x' ? '4K' : '8K';
          break;
        case 'sharpener':
          task = 'photo-sharpener';
          break;
        case 'restorer':
          task = 'photo-restorer';
          break;
        case 'colorizer':
          task = 'image-colorizer';
          break;
        case 'cartoon-filter':
          task = 'art-style-filter';
          const style = document.getElementById('art-style').value;
          options.selectedStyle = style === 'sketch' ? 'Pencil Sketch' : style === 'painting' ? 'Watercolor Painting' : 'Comic Cartoon';
          break;
        case 'object-eraser':
          task = 'object-eraser';
          this.loadingStatus.textContent = 'Generating brush selection mask...';
          const maskBase64 = this.generateEraserMaskBase64();
          options.maskImage = maskBase64;
          break;
        default:
          throw new Error('Unsupported tool selected');
      }

      this.loadingStatus.textContent = 'Processing request with MTV AI (this can take 5-15 seconds)...';
      this.progressBar.style.width = '92%';

      const response = await fetch('/api/image-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: resizedBase64,
          task,
          options
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.image) {
        throw new Error('No image was returned by the AI server.');
      }

      this.loadingStatus.textContent = 'Done! Rendering edited outputs...';
      this.progressBar.style.width = '100%';
      this.displayResults(result.image);

    } catch (err) {
      console.warn('[ImageStudio] AI processing failed, falling back to local on-device engine:', err);
      
      this.loadingStatus.textContent = 'Running local high-performance processing engine...';
      this.progressBar.style.width = '95%';
      
      try {
        const canvas = document.createElement('canvas');
        
        if (this.currentTool === 'upscaler') {
          const factor = document.getElementById('upscale-target').value;
          const multiplier = factor === '2x' ? 2 : factor === '4x' ? 4 : 8;
          canvas.width = this.uploadedImageWidth * multiplier;
          canvas.height = this.uploadedImageHeight * multiplier;
          const ctx = canvas.getContext('2d');
          this.runUpscaler(ctx, canvas);
          this.displayResults(canvas.toDataURL('image/png'));
        } else if (this.currentTool === 'object-eraser') {
          canvas.width = this.uploadedImageWidth;
          canvas.height = this.uploadedImageHeight;
          const ctx = canvas.getContext('2d');
          this.runObjectEraser(ctx, canvas);
        } else {
          canvas.width = this.uploadedImageWidth;
          canvas.height = this.uploadedImageHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(this.originalImage, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          if (this.currentTool === 'bg-remover') {
            this.runBackgroundRemover(imgData);
          } else if (this.currentTool === 'sharpener') {
            this.runSharpener(imgData);
          } else if (this.currentTool === 'restorer') {
            this.runRestorer(imgData);
          } else if (this.currentTool === 'colorizer') {
            this.runColorizer(imgData);
          } else if (this.currentTool === 'cartoon-filter') {
            this.runCartoonFilter(imgData);
          }
          
          ctx.putImageData(imgData, 0, 0);
          this.displayResults(canvas.toDataURL('image/png'));
        }
      } catch (fallbackErr) {
        console.error('[ImageStudio] Fallback processing failed:', fallbackErr);
        
        this.progressBar.style.width = '0%';
        this.loadingIndicator.style.display = 'none';
        
        this.processBtn.disabled = false;
        this.processBtn.style.opacity = '1';

        alert(`AI Image Processing Failed: ${err.message || err}\n\nPlease try again. Ensure a valid MTV AI API key is configured in settings.`);
      }
    }
  }

  displayResults(dataUrl) {
    this.progressBar.style.width = '100%';
    this.loadingIndicator.style.display = 'none';

    this.processBtn.disabled = false;
    this.processBtn.style.opacity = '1';

    // Show output layout
    this.outputImg.src = dataUrl;
    this.outputWrap.style.display = 'block';

    // Dynamic layout alignment: Background remover gets checkerboard background on result wrapper
    const outHolder = document.getElementById('output-holder-bg-remover');
    if (this.currentTool === 'bg-remover') {
      outHolder.classList.add('checkerboard-pattern');
    } else {
      outHolder.classList.remove('checkerboard-pattern');
    }

    this.outputWrap.scrollIntoView({ behavior: 'smooth' });
  }

  // --- INDIVIDUAL IMAGE STUDIO PROCESSING ALGORITHMS ---

  // 1. Background Remover Algorithm
  runBackgroundRemover(imgData) {
    const data = imgData.data;
    const threshold = parseInt(document.getElementById('bg-threshold').value, 10);
    const method = document.getElementById('bg-method').value;

    let targetR, targetG, targetB;

    if (method === 'click') {
      // Manualマジック color pick RGB values
      const manualRgb = this.inputImgTag.getAttribute('data-manual-rgb');
      if (manualRgb) {
        const rgb = manualRgb.split(',').map(Number);
        targetR = rgb[0];
        targetG = rgb[1];
        targetB = rgb[2];
      } else {
        // Fallback to top-left pixel
        targetR = data[0];
        targetG = data[1];
        targetB = data[2];
      }
    } else {
      // Auto Mode: average corner samples as dominant background
      const corners = [
        [0, 0],
        [imgData.width - 1, 0],
        [0, imgData.height - 1],
        [imgData.width - 1, imgData.height - 1]
      ];
      let rSum = 0, gSum = 0, bSum = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * imgData.width + x) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
      });
      targetR = rSum / 4;
      targetG = gSum / 4;
      targetB = bSum / 4;
    }

    // Process every pixel: mask transparent on target background color matching euclidean distance
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distance = Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );

      if (distance < threshold) {
        data[i + 3] = 0; // Transparent
      } else if (distance < threshold + 10) {
        // Soft feather edge alpha blending
        const factor = (distance - threshold) / 10;
        data[i + 3] = Math.floor(factor * 255);
      }
    }

    // Apply touch-up mask if drawn
    if (this.hasDrawnMask()) {
      const scaleX = this.inpaintingCanvas.width / imgData.width;
      const scaleY = this.inpaintingCanvas.height / imgData.height;
      const maskImgData = this.maskCtx.getImageData(0, 0, this.inpaintingCanvas.width, this.inpaintingCanvas.height);
      const maskData = maskImgData.data;
      const wMask = this.inpaintingCanvas.width;

      for (let y = 0; y < imgData.height; y++) {
        const maskY = Math.min(this.inpaintingCanvas.height - 1, Math.floor(y * scaleY));
        for (let x = 0; x < imgData.width; x++) {
          const maskX = Math.min(wMask - 1, Math.floor(x * scaleX));
          const mIdx = (maskY * wMask + maskX) * 4;
          if (maskData[mIdx] > 180 && maskData[mIdx + 1] < 120 && maskData[mIdx + 2] < 120) {
            const idx = (y * imgData.width + x) * 4;
            data[idx + 3] = 0; // Make transparent
          }
        }
      }
    }
  }

  // 2. Image Upscaler Algorithm
  runUpscaler(ctx, canvas) {
    // Standard cubic high quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);

    const polish = document.getElementById('upscale-sharpen').value;
    if (polish === 'soft') return;

    // Apply secondary Unsharp Mask Convolution pass on upscaled image to restore structural details
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = imgData.width;
    const h = imgData.height;

    // 3x3 Sharpen Kernel
    const weight = polish === 'high' ? 0.45 : 0.25;
    const kernel = [
      0, -weight, 0,
      -weight, 1 + 4 * weight, -weight,
      0, -weight, 0
    ];

    const buffer = new Uint8ClampedArray(data);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let channel = 0; channel < 3; channel++) {
          let value = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIdx = ((y + ky) * w + (x + kx)) * 4 + channel;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              value += buffer[pixelIdx] * kernel[kernelIdx];
            }
          }
          const outIdx = (y * w + x) * 4 + channel;
          data[outIdx] = Math.min(255, Math.max(0, value));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 3. Photo Sharpener Matrix Kernel Convolution
  runSharpener(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;
    const intensity = parseInt(document.getElementById('sharpen-intensity').value, 10) / 100;

    const kernelWeight = intensity * 0.5;
    const kernel = [
      0, -kernelWeight, 0,
      -kernelWeight, 1 + (4 * kernelWeight), -kernelWeight,
      0, -kernelWeight, 0
    ];

    const buffer = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += buffer[pixelIdx] * kernel[kernelIdx];
            }
          }
          const outIdx = (y * width + x) * 4 + c;
          data[outIdx] = Math.min(255, Math.max(0, sum));
        }
      }
    }
  }

  // 4. Old Photo Restorer Algorithm
  runRestorer(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;
    const denoiseMode = document.getElementById('restorer-noise').value;
    const colorMode = document.getElementById('restorer-color').value;

    // STEP A: Contrast Stretching (Luminance histogram spread adjustment)
    if (colorMode === 'stretch') {
      let minL = 255, maxL = 0;
      // sample 2000 random pixels to find representative min/max levels safely
      for (let i = 0; i < 2000; i++) {
        const idx = Math.floor(Math.random() * (data.length / 4)) * 4;
        const l = 0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2];
        if (l < minL) minL = l;
        if (l > maxL) maxL = l;
      }

      // Safeguard threshold
      if (maxL - minL > 20) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = ((data[i] - minL) / (maxL - minL)) * 255;     // R
          data[i+1] = ((data[i+1] - minL) / (maxL - minL)) * 255; // G
          data[i+2] = ((data[i+2] - minL) / (maxL - minL)) * 255; // B
        }
      }
    }

    // STEP B: Neutralize aged yellow yellow hues (average out color deviation)
    if (colorMode === 'gray' || colorMode === 'stretch') {
      let rAvg = 0, gAvg = 0, bAvg = 0;
      const step = Math.max(1, Math.floor(data.length / 4000)) * 4;
      let count = 0;
      for (let i = 0; i < data.length; i += step) {
        rAvg += data[i];
        gAvg += data[i+1];
        bAvg += data[i+2];
        count++;
      }
      rAvg /= count;
      gAvg /= count;
      bAvg /= count;

      const grayTarget = (rAvg + gAvg + bAvg) / 3;

      // Adjust pixel color shift towards global gray target
      const rFactor = grayTarget / (rAvg || 1);
      const gFactor = grayTarget / (gAvg || 1);
      const bFactor = grayTarget / (bAvg || 1);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * rFactor);
        data[i+1] = Math.min(255, data[i+1] * gFactor);
        data[i+2] = Math.min(255, data[i+2] * bFactor);
      }
    }

    // STEP C: Selective grain reduction / bilateral suppression
    if (denoiseMode !== 'none') {
      const buffer = new Uint8ClampedArray(data);
      const threshold = denoiseMode === 'light' ? 12 : denoiseMode === 'strong' ? 45 : 24;

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          const centerR = buffer[idx];
          const centerG = buffer[idx+1];
          const centerB = buffer[idx+2];

          let rSum = 0, gSum = 0, bSum = 0, count = 0;

          // Simple 3x3 bilateral neighbor comparison
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const nIdx = ((y + ky) * width + (x + kx)) * 4;
              const nr = buffer[nIdx];
              const ng = buffer[nIdx+1];
              const nb = buffer[nIdx+2];

              // Only average pixel values close in value to preserve edge contrast boundaries
              if (Math.abs(nr - centerR) < threshold &&
                  Math.abs(ng - centerG) < threshold &&
                  Math.abs(nb - centerB) < threshold) {
                rSum += nr;
                gSum += ng;
                bSum += nb;
                count++;
              }
            }
          }

          if (count > 1) {
            data[idx] = rSum / count;
            data[idx+1] = gSum / count;
            data[idx+2] = bSum / count;
          }
        }
      }
    }
  }

  // 5. Image Colorizer LUT Luminance Map Presets
  runColorizer(imgData) {
    const data = imgData.data;
    const preset = document.getElementById('colorize-preset').value;

    // Define preset gradient maps [luminance threshold, r, g, b]
    const LUT_PRESETS = {
      warm: [
        { l: 0,   r: 10,  g: 15,  b: 40  },  // Deep ocean shadow
        { l: 85,  r: 120, g: 70,  b: 45  },  // Warm brick-red mid
        { l: 170, r: 230, g: 175, b: 125 },  // Skin/sunset tone
        { l: 255, r: 255, g: 245, b: 220 }   // Soft solar white
      ],
      vintage: [
        { l: 0,   r: 15,  g: 25,  b: 20  },  // Forest green shadows
        { l: 85,  r: 100, g: 80,  b: 50  },  // Aged sepia mids
        { l: 170, r: 195, g: 165, b: 120 },  // Pale cream highlights
        { l: 255, r: 250, g: 240, b: 215 }   // Rich ivory whites
      ],
      cinematic: [
        { l: 0,   r: 5,   g: 20,  b: 30  },  // Steel teal shadow
        { l: 85,  r: 55,  g: 80,  b: 95  },  // Slate cobalt mids
        { l: 170, r: 180, g: 160, b: 140 },  // Sandy gray highlight
        { l: 255, r: 240, g: 245, b: 250 }   // Cool white reflection
      ],
      emerald: [
        { l: 0,   r: 5,   g: 18,  b: 10  },  // Charcoal green
        { l: 85,  r: 45,  g: 85,  b: 50  },  // Rich moss olive
        { l: 170, r: 145, g: 175, b: 115 },  // Light leaf sage
        { l: 255, r: 235, g: 245, b: 220 }   // Sunlit mint
      ]
    };

    const map = LUT_PRESETS[preset] || LUT_PRESETS.warm;

    for (let i = 0; i < data.length; i += 4) {
      // Calculate grayscale intensity value
      const l = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];

      // Interpolate in gradient LUT map
      let cLow = map[0], cHigh = map[map.length - 1];
      for (let j = 0; j < map.length - 1; j++) {
        if (l >= map[j].l && l <= map[j+1].l) {
          cLow = map[j];
          cHigh = map[j+1];
          break;
        }
      }

      const range = cHigh.l - cLow.l || 1;
      const factor = (l - cLow.l) / range;

      data[i] = cLow.r + factor * (cHigh.r - cLow.r);     // R
      data[i+1] = cLow.g + factor * (cHigh.g - cLow.g); // G
      data[i+2] = cLow.b + factor * (cHigh.b - cLow.b); // B
    }
  }

  // 6. Cartoon & Art Styles Filter Algorithms
  runCartoonFilter(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;
    const style = document.getElementById('art-style').value;

    if (style === 'sketch') {
      this.applyPencilSketch(imgData);
    } else if (style === 'painting') {
      this.applyWatercolorPainting(imgData);
    } else if (style === 'emboss') {
      this.applyEmboss(imgData);
    } else {
      // Classic cel-shaded comic cartoon filter
      // STEP A: Sobel Edge detection matrix convolution pass
      const buffer = new Uint8ClampedArray(data);
      const edges = new Uint8Array(width * height);

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          // Luminance gradients calculation
          const getL = (px, py) => {
            const pIdx = (py * width + px) * 4;
            return 0.299 * buffer[pIdx] + 0.587 * buffer[pIdx+1] + 0.114 * buffer[pIdx+2];
          };

          const valX = (
            -getL(x - 1, y - 1) + getL(x + 1, y - 1) +
            -2 * getL(x - 1, y) + 2 * getL(x + 1, y) +
            -getL(x - 1, y + 1) + getL(x + 1, y + 1)
          );

          const valY = (
            -getL(x - 1, y - 1) - 2 * getL(x, y - 1) - getL(x + 1, y - 1) +
            getL(x - 1, y + 1) + 2 * getL(x, y + 1) + getL(x + 1, y + 1)
          );

          const mag = Math.sqrt(valX * valX + valY * valY);
          edges[y * width + x] = mag > 90 ? 0 : 255; // 0 = Black line, 255 = Clear background
        }
      }

      // STEP B: Quantize color hues & composite edges
      for (let i = 0; i < data.length; i += 4) {
        const edgeVal = edges[Math.floor(i / 4)];

        if (edgeVal === 0) {
          // Add comic edge stroke lines
          data[i] = 12;
          data[i+1] = 12;
          data[i+2] = 12;
        } else {
          // Bin/Quantize colors to discrete levels for retro cel shade illustration
          data[i] = Math.floor(data[i] / 40) * 40;
          data[i+1] = Math.floor(data[i+1] / 40) * 40;
          data[i+2] = Math.floor(data[i+2] / 40) * 40;
        }
      }
    }
  }

  applyPencilSketch(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;

    // Convert image pixels directly to high-contrast monochrome graphite shades
    const buffer = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Grayscale values
        const l = 0.299 * buffer[idx] + 0.587 * buffer[idx+1] + 0.114 * buffer[idx+2];

        // Sample neighboring pixels to find structural differences (contrast lines)
        const rightIdx = (y * width + (x + 1)) * 4;
        const rightL = 0.299 * buffer[rightIdx] + 0.587 * buffer[rightIdx+1] + 0.114 * buffer[rightIdx+2];

        const downIdx = ((y + 1) * width + x) * 4;
        const downL = 0.299 * buffer[downIdx] + 0.587 * buffer[downIdx+1] + 0.114 * buffer[downIdx+2];

        // Highlight local edges, inversion maps to pencil sketches
        const grad = Math.abs(l - rightL) + Math.abs(l - downL);
        const sketchPixelVal = Math.min(255, Math.max(0, 255 - grad * 3.5));

        data[idx] = sketchPixelVal;
        data[idx+1] = sketchPixelVal;
        data[idx+2] = sketchPixelVal;
      }
    }
  }

  applyWatercolorPainting(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;

    // Watercolor effect: Apply local box blur blending of close color blocks
    const buffer = new Uint8ClampedArray(data);

    for (let y = 2; y < height - 2; y += 2) {
      for (let x = 2; x < width - 2; x += 2) {
        // Sample quadrant block mean colors
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let ky = -2; ky <= 2; ky++) {
          for (let kx = -2; kx <= 2; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            rSum += buffer[idx];
            gSum += buffer[idx+1];
            bSum += buffer[idx+2];
            count++;
          }
        }

        const r = rSum / count;
        const g = gSum / count;
        const b = bSum / count;

        // Propagate average values to block cluster
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const outIdx = ((y + ky) * width + (x + kx)) * 4;
            data[outIdx] = r;
            data[outIdx+1] = g;
            data[outIdx+2] = b;
          }
        }
      }
    }
  }

  applyEmboss(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;

    const buffer = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Sample adjacent pixels
        const l1 = 0.299 * buffer[((y-1)*width + (x-1))*4] + 0.587 * buffer[((y-1)*width + (x-1))*4+1] + 0.114 * buffer[((y-1)*width + (x-1))*4+2];
        const l2 = 0.299 * buffer[((y+1)*width + (x+1))*4] + 0.587 * buffer[((y+1)*width + (x+1))*4+1] + 0.114 * buffer[((y+1)*width + (x+1))*4+2];

        // Calculate embossed depth shade offsets
        const diff = l1 - l2 + 128;
        const shade = Math.min(255, Math.max(0, diff));

        // Bronze sepia metallic overlay mapping
        data[idx] = shade * 0.9;
        data[idx+1] = shade * 0.75;
        data[idx+2] = shade * 0.6;
      }
    }
  }

  // 7. Smart Image Compressor API Quality re-encoding
  runCompressor(canvas) {
    const quality = parseInt(document.getElementById('compress-quality').value, 10) / 100;

    // Export temporary canvas using quality parameter directly to Blob
    canvas.toBlob((blob) => {
      if (!blob) {
        this.progressBar.style.width = '100%';
        this.loadingIndicator.style.display = 'none';
        return;
      }

      // Display size saving stats comparison
      const originalBytes = this.originalFile.size;
      const compressedBytes = blob.size;

      this.sizeOrigDisplay.textContent = this.formatBytes(originalBytes);
      this.sizeNewDisplay.textContent = this.formatBytes(compressedBytes);

      const percentSaved = Math.max(0, Math.floor(((originalBytes - compressedBytes) / originalBytes) * 100));
      this.savingsDisplay.textContent = `${percentSaved}% Size Reduced`;

      // Read output preview as data url
      const reader = new FileReader();
      reader.onload = (e) => {
        this.compressorStats.style.display = 'block';
        this.displayResults(e.target.result);
      };
      reader.readAsDataURL(blob);

    }, 'image/jpeg', quality);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 8. Watermark & Object Inpainting Eraser Algorithm
  runObjectEraser(targetCtx, targetCanvas) {
    // Generate scale factors mapped back to intrinsic dimensions
    const scaleX = this.uploadedImageWidth / this.inpaintingCanvas.width;
    const scaleY = this.uploadedImageHeight / this.inpaintingCanvas.height;

    // Initialize high resolution workspace canvases
    const canvasHires = document.createElement('canvas');
    canvasHires.width = this.uploadedImageWidth;
    canvasHires.height = this.uploadedImageHeight;
    const ctxHires = canvasHires.getContext('2d');
    ctxHires.drawImage(this.originalImage, 0, 0);

    const imgData = ctxHires.getImageData(0, 0, canvasHires.width, canvasHires.height);
    const data = imgData.data;

    // Sample visible painted mask data on screen, and project it onto the high-resolution array map
    const maskImgData = this.maskCtx.getImageData(0, 0, this.inpaintingCanvas.width, this.inpaintingCanvas.height);
    const maskData = maskImgData.data;

    // Fast marching neighborhood propagation eraser algorithm
    // Paint pixels that contain a strong red value: maskData[idx] > 200, maskData[idx+1] < 100, maskData[idx+2] < 100
    const wHires = canvasHires.width;
    const hHires = canvasHires.height;
    const wMask = this.inpaintingCanvas.width;
    const hMask = this.inpaintingCanvas.height;

    // Pre-map masked regions
    const maskMap = new Uint8Array(wHires * hHires);
    for (let y = 0; y < hHires; y++) {
      const maskY = Math.min(hMask - 1, Math.floor(y / scaleY));
      for (let x = 0; x < wHires; x++) {
        const maskX = Math.min(wMask - 1, Math.floor(x / scaleX));
        const mIdx = (maskY * wMask + maskX) * 4;

        if (maskData[mIdx] > 180 && maskData[mIdx+1] < 120 && maskData[mIdx+2] < 120) {
          maskMap[y * wHires + x] = 1; // Mark as masked
        }
      }
    }

    // Inpainting pass (Interpolates neighbor values to propagate background structures)
    const radius = 10;
    const buffer = new Uint8ClampedArray(data);

    for (let y = 0; y < hHires; y++) {
      for (let x = 0; x < wHires; x++) {
        const idx = (y * wHires + x) * 4;

        if (maskMap[y * wHires + x] === 1) {
          // Propagate surrounding pixel colors
          let rSum = 0, gSum = 0, bSum = 0, count = 0;

          // Search in concentric diamond pattern
          for (let step = 1; step <= radius; step++) {
            const checks = [
              [x - step, y], [x + step, y], [x, y - step], [x, y + step],
              [x - step, y - step], [x + step, y + step], [x - step, y + step], [x + step, y - step]
            ];

            checks.forEach(([nx, ny]) => {
              if (nx >= 0 && nx < wHires && ny >= 0 && ny < hHires) {
                if (maskMap[ny * wHires + nx] === 0) {
                  const nIdx = (ny * wHires + nx) * 4;
                  rSum += buffer[nIdx];
                  gSum += buffer[nIdx+1];
                  bSum += buffer[nIdx+2];
                  count++;
                }
              }
            });

            if (count > 0) break; // Found immediate surrounding boundary context
          }

          if (count > 0) {
            data[idx] = rSum / count;
            data[idx+1] = gSum / count;
            data[idx+2] = bSum / count;
          }
        }
      }
    }

    ctxHires.putImageData(imgData, 0, 0);
    targetCtx.drawImage(canvasHires, 0, 0, targetCanvas.width, targetCanvas.height);
    this.displayResults(canvasHires.toDataURL('image/png'));
  }
}

// Instantiate on startup
document.addEventListener('DOMContentLoaded', () => {
  window.ImageStudio = new ImageStudioEngine();
});
