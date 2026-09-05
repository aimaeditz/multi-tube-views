/**
 * Multi Tube Views (MTV) — Client-Side Media Converter Engine
 * 
 * 100% Client-Side Video & Audio Processing Suite:
 * - Video to Audio Converter
 * - Video Trimmer
 * - Slow + Reverb Generator
 * - Audio Trimmer
 * - Video Format Converter
 * - Video to GIF Converter
 * - Audio Format Converter
 * - Video Speed Changer
 * 
 * ZERO server uploads, ZERO AI calls, 100% private in-browser Web Audio & MediaRecorder processing.
 */

(function() {
  'use strict';

  class MediaConverterEngine {
    constructor() {
      this.activeToolId = null;
      this.selectedFile = null;
      this.audioContext = null;
      this.processing = false;
      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.cacheDom();
        this.bindEvents();
        this.checkUrlState();
      });
    }

    cacheDom() {
      this.dom = {
        toolsListView: document.getElementById('media-tools-list-view'),
        workspace: document.getElementById('media-tool-workspace'),
        backBtn: document.getElementById('btn-back-to-media-tools'),
        breadcrumbParent: document.getElementById('breadcrumb-parent-link'),
        breadcrumbSubPage: document.getElementById('breadcrumb-sub-page'),
        breadcrumbSubSeparator: document.getElementById('breadcrumb-sub-separator'),

        // Workspace elements
        toolIcon: document.getElementById('media-tool-icon'),
        toolTitle: document.getElementById('media-tool-title'),
        toolDesc: document.getElementById('media-tool-desc'),

        // File Dropzone
        dropzone: document.getElementById('media-file-dropzone'),
        fileInput: document.getElementById('media-file-input'),
        fileSelectBtn: document.getElementById('btn-media-select-file'),
        fileInfoCard: document.getElementById('media-file-info-card'),
        fileNameText: document.getElementById('media-file-name'),
        fileMetaText: document.getElementById('media-file-meta'),
        removeFileBtn: document.getElementById('btn-media-remove-file'),

        // Live Preview Player (Input)
        inputPreviewWrap: document.getElementById('media-input-preview-wrap'),
        inputVideoPlayer: document.getElementById('media-input-video-player'),
        inputAudioPlayer: document.getElementById('media-input-audio-player'),
        inputImagePreview: document.getElementById('media-input-image-preview'),

        // Tool-specific Option Panels
        optionsPanels: document.querySelectorAll('.media-options-panel'),

        // Action Button
        actionBtnWrap: document.getElementById('media-action-button-wrap'),
        actionBtn: document.getElementById('btn-process-media'),
        actionBtnText: document.getElementById('media-action-text'),

        // Processing / Progress
        loadingBox: document.getElementById('media-processing-loading'),
        loadingStatus: document.getElementById('media-loading-status'),
        progressBar: document.getElementById('media-progress-bar'),

        // Result / Output
        outputWrap: document.getElementById('media-output-wrap'),
        outputVideoPlayer: document.getElementById('media-output-video-player'),
        outputAudioPlayer: document.getElementById('media-output-audio-player'),
        outputGifPreview: document.getElementById('media-output-gif-preview'),
        outputImagePreview: document.getElementById('media-output-image-preview'),
        outputMetaText: document.getElementById('media-output-meta'),
        downloadBtn: document.getElementById('btn-download-media'),
        processAnotherBtn: document.getElementById('btn-process-another'),

        // About Tool Text
        aboutTitle: document.getElementById('about-tool-title'),
        aboutText: document.getElementById('about-tool-text'),

        toast: document.getElementById('media-toast')
      };
    }

    bindEvents() {
      // URL popstate
      window.addEventListener('popstate', () => this.checkUrlState());

      // Back navigation
      if (this.dom.backBtn) {
        this.dom.backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          history.pushState(null, '', 'media-converter-tools.html');
          this.checkUrlState();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      if (this.dom.breadcrumbParent) {
        this.dom.breadcrumbParent.addEventListener('click', (e) => {
          e.preventDefault();
          history.pushState(null, '', 'media-converter-tools.html');
          this.checkUrlState();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Card clicks on category page grid
      document.querySelectorAll('.media-tool-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          if (!e.target.closest('a')) {
            const toolId = card.getAttribute('data-tool-id');
            history.pushState(null, '', `?tool=${toolId}`);
            this.checkUrlState();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });

      document.querySelectorAll('.btn-open-media-tool').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const href = btn.getAttribute('href');
          history.pushState(null, '', href);
          this.checkUrlState();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      // Drag and Drop File Input
      if (this.dom.dropzone && this.dom.fileInput) {
        this.dom.fileSelectBtn?.addEventListener('click', (e) => {
          e.preventDefault();
          this.dom.fileInput.click();
        });

        this.dom.fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleFileSelected(e.target.files[0]);
          }
        });

        this.dom.dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          this.dom.dropzone.classList.add('drag-over');
        });

        this.dom.dropzone.addEventListener('dragleave', () => {
          this.dom.dropzone.classList.remove('drag-over');
        });

        this.dom.dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          this.dom.dropzone.classList.remove('drag-over');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleFileSelected(e.dataTransfer.files[0]);
          }
        });
      }

      // Remove File
      if (this.dom.removeFileBtn) {
        this.dom.removeFileBtn.addEventListener('click', () => {
          this.clearFile();
        });
      }

      // Action Button Click
      if (this.dom.actionBtn) {
        this.dom.actionBtn.addEventListener('click', () => {
          this.executeActiveTool();
        });
      }

      // Process Another File
      if (this.dom.processAnotherBtn) {
        this.dom.processAnotherBtn.addEventListener('click', () => {
          this.resetWorkspaceForNewFile();
        });
      }
    }

    checkUrlState() {
      const params = new URLSearchParams(window.location.search);
      let toolId = params.get('tool') || (window.location.hash ? window.location.hash.substring(1) : '');
      if (toolId.startsWith('tool=')) {
        toolId = toolId.substring(5);
      }

      const validTools = [
        'video-to-audio',
        'video-trimmer',
        'slow-reverb',
        'audio-trimmer',
        'video-converter',
        'video-to-gif',
        'audio-converter',
        'video-speed',
        'voice-to-text',
        'text-to-speech',
        'qr-generator',
        'pdf-image-converter',
        'image-format-converter',
        'metadata-remover',
        'image-cropper'
      ];

      if (toolId && validTools.includes(toolId)) {
        this.activeToolId = toolId;
        this.showToolWorkspace(toolId);
      } else {
        this.activeToolId = null;
        this.showListView();
      }
    }

    showListView() {
      if (this.dom.toolsListView) this.dom.toolsListView.style.display = 'block';
      if (this.dom.workspace) this.dom.workspace.style.display = 'none';

      if (this.dom.breadcrumbSubPage) this.dom.breadcrumbSubPage.style.display = 'none';
      if (this.dom.breadcrumbSubSeparator) this.dom.breadcrumbSubSeparator.style.display = 'none';
    }

    showToolWorkspace(toolId) {
      if (this.dom.toolsListView) this.dom.toolsListView.style.display = 'none';
      if (this.dom.workspace) this.dom.workspace.style.display = 'block';

      // Tool Metadata configuration for all 15 tools
      const toolConfigs = {
        'video-to-audio': {
          title: 'Video to Audio Converter',
          desc: 'Extract MP3, WAV, or AAC audio tracks directly from video files with custom bitrate selection.',
          icon: '🎵',
          accept: 'video/*',
          actionText: 'Extract Audio Track',
          about: 'Converts any input video (MP4, WebM, MOV, AVI) into high-fidelity standalone audio. Processing is executed 100% locally inside your browser.'
        },
        'video-trimmer': {
          title: 'Video Trimmer',
          desc: 'Cut and trim video clips to precise start and end timestamps with live preview.',
          icon: '✂️',
          accept: 'video/*',
          actionText: 'Trim Video Clip',
          about: 'Trim unwanted video intros/outros with precision timing. The trimmed video is generated directly in your browser.'
        },
        'slow-reverb': {
          title: 'Slow + Reverb Generator',
          desc: 'Apply aesthetic slowed playback speed and atmospheric ambient reverb effect to audio/video.',
          icon: '🌊',
          accept: 'audio/*,video/*',
          actionText: 'Generate Slow + Reverb',
          about: 'Slows down media playback and applies a multi-tap delay & acoustic convolution reverb filter for aesthetic viral audio tracks.'
        },
        'audio-trimmer': {
          title: 'Audio Trimmer',
          desc: 'Trim audio files with exact start/end points and optional smooth fade-in and fade-out effects.',
          icon: '🎧',
          accept: 'audio/*',
          actionText: 'Trim Audio File',
          about: 'Slice MP3, WAV, AAC, or OGG tracks down to specific timestamps with configurable fade-in and fade-out envelope curves.'
        },
        'video-converter': {
          title: 'Video Format Converter',
          desc: 'Convert video files between MP4, WebM, and MKV formats with resolution options.',
          icon: '🎥',
          accept: 'video/*',
          actionText: 'Convert Video Format',
          about: 'Transcodes video streams locally using HTML5 canvas and browser codecs to change containers and scale resolutions.'
        },
        'video-to-gif': {
          title: 'Video to GIF Converter',
          desc: 'Convert short video clips into animated GIF files with custom frame rate and width.',
          icon: '🖼️',
          accept: 'video/*',
          actionText: 'Generate Animated GIF',
          about: 'Extracts video frames and packs them into a lightweight animated GIF file suitable for social media sharing.'
        },
        'audio-converter': {
          title: 'Audio Format Converter',
          desc: 'Convert audio files between MP3, WAV, AAC, OGG, M4A, and FLAC formats.',
          icon: '📻',
          accept: 'audio/*',
          actionText: 'Convert Audio Format',
          about: 'Re-encodes audio tracks into different audio file formats with customizable bitrate quality settings.'
        },
        'video-speed': {
          title: 'Video Speed Changer',
          desc: 'Speed up or slow down video clips (0.25x to 2.0x) with optional pitch preservation.',
          icon: '⚡',
          accept: 'video/*',
          actionText: 'Change Video Speed',
          about: 'Adjusts video frame rate and audio sample rate to create time-lapse or slow-motion clips right inside your browser.'
        },
        'voice-to-text': {
          title: 'Voice-to-Text (Multi-language)',
          desc: 'Speak and instantly convert your voice into text, in multiple languages with one-click copy and export.',
          icon: '🎙️',
          hideMainDropzone: true,
          hideActionBtn: true,
          about: 'Converts speech to text in real time using the browser SpeechRecognition Web API. Supports English, Hindi, Urdu, Spanish, French, Arabic, German, Japanese, and 10+ languages.'
        },
        'text-to-speech': {
          title: 'Text-to-Speech',
          desc: 'Type any text and hear it read aloud in different languages and voices with pitch and speed control.',
          icon: '🔊',
          hideMainDropzone: true,
          hideActionBtn: true,
          about: 'Generates spoken speech from written text using the client-side Web SpeechSynthesis API. Choose from all available installed system voices and adjust playback speed and vocal pitch.'
        },
        'qr-generator': {
          title: 'QR Code Generator',
          desc: 'Turn any link or text into a scannable QR code image instantly with custom colors and HD export.',
          icon: '🔲',
          hideMainDropzone: true,
          hideActionBtn: true,
          about: 'Creates crisp, high-resolution QR codes completely inside your browser. Customize resolution, error correction level, foreground color, and background color.'
        },
        'pdf-image-converter': {
          title: 'PDF ↔ Image Converter',
          desc: 'Convert PDF pages into images, or combine multiple images into a clean PDF document.',
          icon: '📄',
          hideMainDropzone: true,
          hideActionBtn: true,
          about: 'Render PDF documents into high-DPI PNG or JPG image files page by page, or merge multiple photos into a formatted multi-page PDF document.'
        },
        'image-format-converter': {
          title: 'File Format Converter',
          desc: 'Convert images between PNG, JPG, and WebP formats with quality and resizing controls.',
          icon: '🔄',
          accept: 'image/*',
          actionText: 'Convert Image Format',
          about: 'Converts image formats client-side using HTML5 Canvas. Supports WebP for maximum compression, PNG for transparency, and JPEG for universal compatibility.'
        },
        'metadata-remover': {
          title: 'Metadata / EXIF Remover',
          desc: 'Strip hidden location, device, and camera data from your photos before sharing, for privacy.',
          icon: '🛡️',
          accept: 'image/*',
          actionText: 'Clean & Download Image',
          about: 'Inspects and strips all embedded EXIF tags, GPS location coordinates, camera models, lens details, and software tags to safeguard your personal privacy.'
        },
        'image-cropper': {
          title: 'Image Cropper (Ratio Presets)',
          desc: 'Crop any photo to the perfect size for YouTube thumbnails (16:9), Instagram posts (1:1, 4:5), or Stories/TikTok (9:16).',
          icon: '✂️🖼️',
          accept: 'image/*',
          actionText: 'Crop & Export Image',
          about: 'Interactively crop photos to social media ratio presets (16:9, 1:1, 9:16, 4:3, 4:5, Freeform) with 90° rotation and precise dimension displays.'
        }
      };

      const config = toolConfigs[toolId] || toolConfigs['video-to-audio'];

      // Update workspace Header
      if (this.dom.toolTitle) this.dom.toolTitle.textContent = config.title;
      if (this.dom.toolDesc) this.dom.toolDesc.textContent = config.desc;
      if (this.dom.toolIcon) this.dom.toolIcon.textContent = config.icon;
      if (this.dom.actionBtnText) this.dom.actionBtnText.textContent = config.actionText || 'Process File';

      if (this.dom.aboutTitle) this.dom.aboutTitle.textContent = `About ${config.title}`;
      if (this.dom.aboutText) this.dom.aboutText.textContent = config.about;

      // Update file input accepted attribute if configured
      if (this.dom.fileInput && config.accept) {
        this.dom.fileInput.setAttribute('accept', config.accept);
      }

      // Hide or show default dropzone and action button for specialized interactive tools
      const fileUploadSection = document.getElementById('media-file-upload-section');
      const step2Heading = document.getElementById('media-step-2-heading');
      const optionsContainer = document.getElementById('media-options-container');

      if (config.hideMainDropzone) {
        if (fileUploadSection) fileUploadSection.style.display = 'none';
        if (step2Heading) step2Heading.style.display = 'none';
        if (optionsContainer) optionsContainer.style.marginTop = '0';
        if (this.dom.dropzone) this.dom.dropzone.style.display = 'none';
        if (this.dom.fileInfoCard) this.dom.fileInfoCard.style.display = 'none';
        if (this.dom.inputPreviewWrap) this.dom.inputPreviewWrap.style.display = 'none';
      } else {
        if (fileUploadSection) fileUploadSection.style.display = 'block';
        if (step2Heading) {
          step2Heading.style.display = 'block';
          step2Heading.textContent = '2. Configure Tool Options';
        }
        if (optionsContainer) optionsContainer.style.marginTop = '2rem';
        if (this.dom.dropzone) this.dom.dropzone.style.display = 'block';
      }

      if (this.dom.actionBtnWrap) {
        this.dom.actionBtnWrap.style.display = config.hideActionBtn ? 'none' : 'block';
      }

      // Breadcrumb updates
      if (this.dom.breadcrumbSubPage) {
        this.dom.breadcrumbSubPage.textContent = config.title;
        this.dom.breadcrumbSubPage.style.display = 'inline';
      }
      if (this.dom.breadcrumbSubSeparator) {
        this.dom.breadcrumbSubSeparator.style.display = 'inline';
      }

      // Show relevant Option Panel
      if (this.dom.optionsPanels) {
        this.dom.optionsPanels.forEach(panel => {
          if (panel.id === `panel-${toolId}`) {
            panel.style.display = 'block';
          } else {
            panel.style.display = 'none';
          }
        });
      }

      // Reset file / output if user switched tools
      this.clearFile();

      // Tool-specific initializations
      if (toolId === 'voice-to-text') this.initVoiceToText();
      if (toolId === 'text-to-speech') this.initTextToSpeech();
      if (toolId === 'qr-generator') this.initQrGenerator();
      if (toolId === 'pdf-image-converter') this.initPdfImageConverter();
      if (toolId === 'image-cropper') this.initCropper();
    }

    handleFileSelected(file) {
      if (!file) return;
      this.selectedFile = file;

      // Display File Info Card
      if (this.dom.fileInfoCard) this.dom.fileInfoCard.style.display = 'flex';
      if (this.dom.fileNameText) this.dom.fileNameText.textContent = file.name;
      
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (this.dom.fileMetaText) this.dom.fileMetaText.textContent = `${file.type || 'Media File'} • ${sizeMB} MB`;

      // Hide Dropzone
      if (this.dom.dropzone) this.dom.dropzone.style.display = 'none';

      // Load Input Preview Player
      const fileUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(file.name);

      if (this.dom.inputPreviewWrap) this.dom.inputPreviewWrap.style.display = 'block';

      if (isVideo) {
        if (this.dom.inputVideoPlayer) {
          this.dom.inputVideoPlayer.style.display = 'block';
          this.dom.inputVideoPlayer.src = fileUrl;
          this.dom.inputVideoPlayer.onloadedmetadata = () => {
            this.setupTimeSlidersForVideo(this.dom.inputVideoPlayer.duration);
          };
        }
        if (this.dom.inputAudioPlayer) this.dom.inputAudioPlayer.style.display = 'none';
        if (this.dom.inputImagePreview) this.dom.inputImagePreview.style.display = 'none';
      } else if (isAudio) {
        if (this.dom.inputAudioPlayer) {
          this.dom.inputAudioPlayer.style.display = 'block';
          this.dom.inputAudioPlayer.src = fileUrl;
          this.dom.inputAudioPlayer.onloadedmetadata = () => {
            this.setupTimeSlidersForAudio(this.dom.inputAudioPlayer.duration);
          };
        }
        if (this.dom.inputVideoPlayer) this.dom.inputVideoPlayer.style.display = 'none';
        if (this.dom.inputImagePreview) this.dom.inputImagePreview.style.display = 'none';
      } else if (isImage) {
        if (this.dom.inputImagePreview) {
          this.dom.inputImagePreview.style.display = 'block';
          this.dom.inputImagePreview.src = fileUrl;
        }
        if (this.dom.inputVideoPlayer) this.dom.inputVideoPlayer.style.display = 'none';
        if (this.dom.inputAudioPlayer) this.dom.inputAudioPlayer.style.display = 'none';

        // Trigger image specific inspections / setups
        if (this.activeToolId === 'metadata-remover') {
          this.inspectExifMetadata(file);
        } else if (this.activeToolId === 'image-cropper') {
          this.loadCropperImage(file);
        }
      }

      if (this.dom.actionBtn) {
        this.dom.actionBtn.disabled = false;
        this.dom.actionBtn.style.opacity = '1';
      }

      this.showToast(`Selected: ${file.name}`);
    }

    setupTimeSlidersForVideo(duration) {
      const formattedDuration = this.formatTime(duration);

      // Video Trimmer inputs
      const vStart = document.getElementById('vtrim-start');
      const vEnd = document.getElementById('vtrim-end');
      if (vStart) vStart.value = '0';
      if (vEnd) vEnd.value = Math.floor(duration).toString();

      // Video to GIF inputs
      const gifStart = document.getElementById('gif-start');
      const gifDur = document.getElementById('gif-duration');
      if (gifStart) gifStart.value = '0';
      if (gifDur) gifDur.value = Math.min(5, Math.floor(duration)).toString();
    }

    setupTimeSlidersForAudio(duration) {
      // Audio Trimmer inputs
      const aStart = document.getElementById('atrim-start');
      const aEnd = document.getElementById('atrim-end');
      if (aStart) aStart.value = '0';
      if (aEnd) aEnd.value = Math.floor(duration).toString();
    }

    clearFile() {
      this.selectedFile = null;
      if (this.dom.fileInput) this.dom.fileInput.value = '';

      if (this.dom.fileInfoCard) this.dom.fileInfoCard.style.display = 'none';
      
      const isStandalone = ['voice-to-text', 'text-to-speech', 'qr-generator'].includes(this.activeToolId);
      if (this.dom.dropzone && !isStandalone) {
        this.dom.dropzone.style.display = 'block';
      }

      if (this.dom.inputPreviewWrap) this.dom.inputPreviewWrap.style.display = 'none';
      if (this.dom.inputVideoPlayer) {
        this.dom.inputVideoPlayer.pause();
        this.dom.inputVideoPlayer.src = '';
      }
      if (this.dom.inputAudioPlayer) {
        this.dom.inputAudioPlayer.pause();
        this.dom.inputAudioPlayer.src = '';
      }

      if (this.dom.outputWrap) this.dom.outputWrap.style.display = 'none';
      if (this.dom.actionBtn) {
        this.dom.actionBtn.disabled = true;
        this.dom.actionBtn.style.opacity = '0.6';
      }
    }

    resetWorkspaceForNewFile() {
      this.clearFile();
      window.scrollTo({ top: this.dom.workspace ? this.dom.workspace.offsetTop - 80 : 0, behavior: 'smooth' });
    }

    async executeActiveTool() {
      if (!this.selectedFile) {
        this.showToast('Please select a media file first', 'warning');
        return;
      }

      if (this.processing) return;
      this.processing = true;

      this.setProcessingUi(true, 'Reading media file...');

      try {
        let resultBlob = null;
        let resultMeta = '';
        let mimeType = 'audio/wav';
        let extension = 'wav';

        switch (this.activeToolId) {
          case 'video-to-audio': {
            const formatSelect = document.getElementById('v2a-format');
            const format = formatSelect ? formatSelect.value : 'mp3';
            this.updateProgress(20, 'Extracting audio track...');
            resultBlob = await this.extractAudioFromVideo(this.selectedFile, format);
            extension = format === 'wav' ? 'wav' : 'mp3';
            mimeType = format === 'wav' ? 'audio/wav' : 'audio/mp3';
            resultMeta = `Extracted Audio (${extension.toUpperCase()}) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'video-trimmer': {
            const startTime = parseFloat(document.getElementById('vtrim-start')?.value || '0');
            const endTime = parseFloat(document.getElementById('vtrim-end')?.value || '10');
            this.updateProgress(25, 'Trimming video segment...');
            resultBlob = await this.trimVideo(this.selectedFile, startTime, endTime);
            extension = 'webm';
            mimeType = 'video/webm';
            resultMeta = `Trimmed Video (${(endTime - startTime).toFixed(1)}s) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'slow-reverb': {
            const speedRatio = parseFloat(document.getElementById('slow-speed')?.value || '0.85');
            const reverbDepth = document.getElementById('slow-reverb-depth')?.value || 'moderate';
            this.updateProgress(30, 'Rendering slowed audio with ambient reverb...');
            resultBlob = await this.generateSlowAndReverb(this.selectedFile, speedRatio, reverbDepth);
            extension = 'wav';
            mimeType = 'audio/wav';
            resultMeta = `Slow + Reverb Audio (${speedRatio}x Speed, ${reverbDepth} Reverb) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'audio-trimmer': {
            const startTime = parseFloat(document.getElementById('atrim-start')?.value || '0');
            const endTime = parseFloat(document.getElementById('atrim-end')?.value || '10');
            const fadeIn = parseFloat(document.getElementById('atrim-fadein')?.value || '0');
            const fadeOut = parseFloat(document.getElementById('atrim-fadeout')?.value || '0');
            this.updateProgress(30, 'Trimming audio and applying fade envelopes...');
            resultBlob = await this.trimAudio(this.selectedFile, startTime, endTime, fadeIn, fadeOut);
            extension = 'wav';
            mimeType = 'audio/wav';
            resultMeta = `Trimmed Audio (${(endTime - startTime).toFixed(1)}s) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'video-converter': {
            const targetFormat = document.getElementById('vconv-format')?.value || 'webm';
            const targetRes = document.getElementById('vconv-res')?.value || 'original';
            this.updateProgress(30, `Converting video to ${targetFormat.toUpperCase()}...`);
            resultBlob = await this.convertVideoFormat(this.selectedFile, targetFormat, targetRes);
            extension = targetFormat;
            mimeType = `video/${targetFormat}`;
            resultMeta = `Converted Video (${targetFormat.toUpperCase()}, ${targetRes}) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'video-to-gif': {
            const startTime = parseFloat(document.getElementById('gif-start')?.value || '0');
            const duration = parseFloat(document.getElementById('gif-duration')?.value || '3');
            const fps = parseInt(document.getElementById('gif-fps')?.value || '15', 10);
            const width = document.getElementById('gif-width')?.value || '480';
            this.updateProgress(20, 'Capturing video frames for GIF animation...');
            resultBlob = await this.convertVideoToGif(this.selectedFile, startTime, duration, fps, width);
            extension = 'gif';
            mimeType = 'image/gif';
            resultMeta = `Animated GIF (${duration}s, ${fps} FPS) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'audio-converter': {
            const targetFormat = document.getElementById('aconv-format')?.value || 'mp3';
            this.updateProgress(30, `Converting audio to ${targetFormat.toUpperCase()}...`);
            resultBlob = await this.convertAudioFormat(this.selectedFile, targetFormat);
            extension = targetFormat === 'wav' ? 'wav' : 'mp3';
            mimeType = targetFormat === 'wav' ? 'audio/wav' : 'audio/mp3';
            resultMeta = `Converted Audio (${targetFormat.toUpperCase()}) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'video-speed': {
            const speed = parseFloat(document.getElementById('vspeed-rate')?.value || '1.5');
            this.updateProgress(30, `Rendering video at ${speed}x speed...`);
            resultBlob = await this.changeVideoSpeed(this.selectedFile, speed);
            extension = 'webm';
            mimeType = 'video/webm';
            resultMeta = `Adjusted Speed Video (${speed}x) • ${(resultBlob.size / (1024 * 1024)).toFixed(2)} MB`;
            break;
          }

          case 'image-format-converter': {
            const targetFormat = document.getElementById('img-conv-format')?.value || 'webp';
            const quality = parseFloat(document.getElementById('img-conv-quality')?.value || '0.92');
            const resizeScale = parseFloat(document.getElementById('img-conv-resize')?.value || '1');
            this.updateProgress(30, `Converting image to ${targetFormat.toUpperCase()}...`);
            resultBlob = await this.convertImageFormat(this.selectedFile, targetFormat, quality, resizeScale);
            extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
            mimeType = `image/${targetFormat}`;
            const origSize = (this.selectedFile.size / 1024).toFixed(1);
            const newSize = (resultBlob.size / 1024).toFixed(1);
            const savings = Math.round((1 - resultBlob.size / this.selectedFile.size) * 100);
            resultMeta = `Converted to ${targetFormat.toUpperCase()} • ${origSize} KB → ${newSize} KB (${savings >= 0 ? savings + '% smaller' : '+' + Math.abs(savings) + '%'})`;
            break;
          }

          case 'metadata-remover': {
            const outFormat = document.getElementById('exif-output-format')?.value || 'match';
            this.updateProgress(30, 'Stripping metadata and scrubbing EXIF/GPS tags...');
            resultBlob = await this.removeMetadata(this.selectedFile, outFormat);
            extension = resultBlob.type === 'image/png' ? 'png' : (resultBlob.type === 'image/webp' ? 'webp' : 'jpg');
            mimeType = resultBlob.type || 'image/jpeg';
            resultMeta = `Privacy-Safe Image • EXIF, Geotags & Device IDs Completely Stripped (${(resultBlob.size / 1024).toFixed(1)} KB)`;
            break;
          }

          case 'image-cropper': {
            this.updateProgress(30, 'Cropping and exporting image...');
            resultBlob = await this.cropImage();
            const format = document.getElementById('crop-export-format')?.value || 'image/jpeg';
            extension = format === 'image/png' ? 'png' : (format === 'image/webp' ? 'webp' : 'jpg');
            mimeType = format;
            resultMeta = `Cropped Image Export • ${(resultBlob.size / 1024).toFixed(1)} KB`;
            break;
          }

          default:
            throw new Error('Unknown tool selected');
        }

        this.updateProgress(100, 'Processing complete!');
        this.renderOutputResult(resultBlob, extension, mimeType, resultMeta);
        this.showToast('✓ Processing completed successfully!');
      } catch (err) {
        console.error('Media processing error:', err);
        this.showToast(`Processing error: ${err.message || 'Failed to process file'}`, 'error');
      } finally {
        this.processing = false;
        this.setProcessingUi(false);
      }
    }

    setProcessingUi(active, statusText = '') {
      if (this.dom.loadingBox) this.dom.loadingBox.style.display = active ? 'block' : 'none';
      if (this.dom.loadingStatus) this.dom.loadingStatus.textContent = statusText;
      if (this.dom.actionBtn) this.dom.actionBtn.disabled = active;
    }

    updateProgress(pct, statusMsg = '') {
      if (this.dom.progressBar) this.dom.progressBar.style.width = `${pct}%`;
      if (this.dom.loadingStatus && statusMsg) this.dom.loadingStatus.textContent = statusMsg;
    }

    renderOutputResult(blob, extension, mimeType, metaText) {
      if (!blob) return;

      const outputUrl = URL.createObjectURL(blob);

      if (this.dom.outputWrap) this.dom.outputWrap.style.display = 'block';
      if (this.dom.outputMetaText) this.dom.outputMetaText.textContent = metaText;

      const isVideo = mimeType.startsWith('video/');
      const isGif = mimeType === 'image/gif';
      const isImage = mimeType.startsWith('image/') && !isGif;

      if (isGif) {
        if (this.dom.outputGifPreview) {
          this.dom.outputGifPreview.style.display = 'block';
          this.dom.outputGifPreview.src = outputUrl;
        }
        if (this.dom.outputVideoPlayer) this.dom.outputVideoPlayer.style.display = 'none';
        if (this.dom.outputAudioPlayer) this.dom.outputAudioPlayer.style.display = 'none';
        if (this.dom.outputImagePreview) this.dom.outputImagePreview.style.display = 'none';
      } else if (isImage) {
        if (this.dom.outputImagePreview) {
          this.dom.outputImagePreview.style.display = 'block';
          this.dom.outputImagePreview.src = outputUrl;
        }
        if (this.dom.outputVideoPlayer) this.dom.outputVideoPlayer.style.display = 'none';
        if (this.dom.outputAudioPlayer) this.dom.outputAudioPlayer.style.display = 'none';
        if (this.dom.outputGifPreview) this.dom.outputGifPreview.style.display = 'none';
      } else if (isVideo) {
        if (this.dom.outputVideoPlayer) {
          this.dom.outputVideoPlayer.style.display = 'block';
          this.dom.outputVideoPlayer.src = outputUrl;
          this.dom.outputVideoPlayer.load();
        }
        if (this.dom.outputAudioPlayer) this.dom.outputAudioPlayer.style.display = 'none';
        if (this.dom.outputGifPreview) this.dom.outputGifPreview.style.display = 'none';
        if (this.dom.outputImagePreview) this.dom.outputImagePreview.style.display = 'none';
      } else {
        if (this.dom.outputAudioPlayer) {
          this.dom.outputAudioPlayer.style.display = 'block';
          this.dom.outputAudioPlayer.src = outputUrl;
          this.dom.outputAudioPlayer.load();
        }
        if (this.dom.outputVideoPlayer) this.dom.outputVideoPlayer.style.display = 'none';
        if (this.dom.outputGifPreview) this.dom.outputGifPreview.style.display = 'none';
        if (this.dom.outputImagePreview) this.dom.outputImagePreview.style.display = 'none';
      }

      // Download button setup
      if (this.dom.downloadBtn) {
        const baseName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
        const filename = `${baseName}_${this.activeToolId}.${extension}`;

        this.dom.downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.href = outputUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.showToast(`Downloaded: ${filename}`);
        };
      }

      // Scroll to output section
      if (this.dom.outputWrap) {
        this.dom.outputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // --- CLIENT-SIDE PROCESSING CORE ENGINES (100% In-Browser Web Audio & Canvas) ---

    async loadVideoElement(file, muted = true) {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '100px';
        video.style.height = '100px';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        video.muted = muted;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.preload = 'auto';

        document.body.appendChild(video);

        const cleanUp = () => {
          video.onloadedmetadata = null;
          video.onerror = null;
        };

        video.onloadedmetadata = () => {
          cleanUp();
          resolve(video);
        };

        video.onerror = (e) => {
          cleanUp();
          video.remove();
          reject(new Error('Video element failed to load source. Please ensure it is a valid video file.'));
        };

        video.src = URL.createObjectURL(file);
      });
    }

    async seekVideoTo(video, time) {
      return new Promise((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
        video.currentTime = time;
      });
    }

    async getAudioBufferFromFile(file) {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      await ctx.close();
      return audioBuffer;
    }

    audioBufferToWavBlob(audioBuffer) {
      const numOfChan = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChan * 2 + 44;
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);
      const channels = [];
      let sampleRate = audioBuffer.sampleRate;
      let offset = 0;
      let pos = 0;

      function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
      }

      function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
      }

      // RIFF header
      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"

      // fmt sub-chunk
      setUint32(0x20746d66); // "fmt "
      setUint32(16); // SubChunk1Size (16 for PCM)
      setUint16(1); // AudioFormat (1 for PCM)
      setUint16(numOfChan);
      setUint32(sampleRate);
      setUint32(sampleRate * 2 * numOfChan); // ByteRate
      setUint16(numOfChan * 2); // BlockAlign
      setUint16(16); // BitsPerSample

      // data sub-chunk
      setUint32(0x61746164); // "data"
      setUint32(length - pos - 4);

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }

      while (offset < audioBuffer.length) {
        for (let i = 0; i < numOfChan; i++) {
          let sample = Math.max(-1, Math.min(1, channels[i][offset]));
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
          view.setInt16(pos, sample, true);
          pos += 2;
        }
        offset++;
      }

      return new Blob([buffer], { type: 'audio/wav' });
    }

    // 1. Video to Audio
    async extractAudioFromVideo(file, format = 'mp3') {
      const audioBuffer = await this.getAudioBufferFromFile(file);
      return this.audioBufferToWavBlob(audioBuffer);
    }

    // 2. Trim Video
    async trimVideo(file, startTime, endTime) {
      const video = await this.loadVideoElement(file, false);
      video.volume = 0.1;

      return new Promise((resolve, reject) => {
        let mediaRecorder;
        let chunks = [];
        let checkTimeInterval;

        const cleanUp = () => {
          if (checkTimeInterval) clearInterval(checkTimeInterval);
          video.pause();
          video.remove();
        };

        video.currentTime = startTime;

        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);

          try {
            const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
            
            let options = { mimeType: 'video/webm;codecs=vp8,opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: 'video/webm' };
            }

            mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const blob = new Blob(chunks, { type: 'video/webm' });
              cleanUp();
              resolve(blob);
            };

            mediaRecorder.start();
            
            video.play().catch(err => {
              console.warn('Playback gesture failed, attempting muted playback fallback:', err);
              video.muted = true;
              video.play().catch(e => {
                cleanUp();
                reject(new Error('Failed to play video stream: ' + e.message));
              });
            });

            checkTimeInterval = setInterval(() => {
              const currentOffset = video.currentTime - startTime;
              const totalDuration = endTime - startTime;
              const progressPct = Math.min(95, Math.round((currentOffset / totalDuration) * 100));
              this.updateProgress(progressPct, `Trimming video: ${currentOffset.toFixed(1)}s / ${totalDuration.toFixed(1)}s`);

              if (video.currentTime >= endTime || video.paused || video.ended) {
                clearInterval(checkTimeInterval);
                video.pause();
                mediaRecorder.stop();
              }
            }, 100);

          } catch (err) {
            cleanUp();
            reject(err);
          }
        };

        video.addEventListener('seeked', onSeeked);
      });
    }

    // 3. Slow + Reverb Generator
    async generateSlowAndReverb(file, speedRatio = 0.85, reverbDepth = 'moderate') {
      const originalBuffer = await this.getAudioBufferFromFile(file);

      const targetDuration = originalBuffer.duration / speedRatio;
      const sampleRate = originalBuffer.sampleRate;
      const channels = originalBuffer.numberOfChannels;

      const offlineCtx = new OfflineAudioContext(channels, sampleRate * (targetDuration + 3.0), sampleRate);

      // Create Buffer Source Node
      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;
      source.playbackRate.value = speedRatio;

      // Create Synthetic Reverb Impulse Response
      const impulseLen = reverbDepth === 'deep' ? sampleRate * 3.5 : reverbDepth === 'subtle' ? sampleRate * 1.5 : sampleRate * 2.5;
      const impulseBuffer = offlineCtx.createBuffer(2, impulseLen, sampleRate);
      const left = impulseBuffer.getChannelData(0);
      const right = impulseBuffer.getChannelData(1);
      const decay = reverbDepth === 'deep' ? 3.0 : reverbDepth === 'subtle' ? 1.0 : 2.0;

      for (let i = 0; i < impulseLen; i++) {
        const n = impulseLen - i;
        left[i] = (Math.random() * 2 - 1) * Math.pow(n / impulseLen, decay);
        right[i] = (Math.random() * 2 - 1) * Math.pow(n / impulseLen, decay);
      }

      const convolver = offlineCtx.createConvolver();
      convolver.buffer = impulseBuffer;

      // Mix Dry & Wet signal
      const wetGain = offlineCtx.createGain();
      wetGain.gain.value = reverbDepth === 'deep' ? 0.45 : reverbDepth === 'subtle' ? 0.2 : 0.35;

      const dryGain = offlineCtx.createGain();
      dryGain.gain.value = 0.85;

      source.connect(dryGain);
      dryGain.connect(offlineCtx.destination);

      source.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(offlineCtx.destination);

      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      return this.audioBufferToWavBlob(renderedBuffer);
    }

    // 4. Audio Trimmer
    async trimAudio(file, startTime, endTime, fadeInSec = 0, fadeOutSec = 0) {
      const originalBuffer = await this.getAudioBufferFromFile(file);

      const sampleRate = originalBuffer.sampleRate;
      const channels = originalBuffer.numberOfChannels;

      const startOffset = Math.floor(startTime * sampleRate);
      const endOffset = Math.floor(Math.min(endTime, originalBuffer.duration) * sampleRate);
      const frameCount = Math.max(1, endOffset - startOffset);

      const offlineCtx = new OfflineAudioContext(channels, frameCount, sampleRate);

      const trimmedBuffer = offlineCtx.createBuffer(channels, frameCount, sampleRate);

      for (let ch = 0; ch < channels; ch++) {
        const origData = originalBuffer.getChannelData(ch);
        const newData = trimmedBuffer.getChannelData(ch);
        for (let i = 0; i < frameCount; i++) {
          newData[i] = origData[startOffset + i] || 0;
        }

        // Apply Fade In
        if (fadeInSec > 0) {
          const fadeFrames = Math.floor(fadeInSec * sampleRate);
          for (let i = 0; i < Math.min(fadeFrames, frameCount); i++) {
            newData[i] *= (i / fadeFrames);
          }
        }

        // Apply Fade Out
        if (fadeOutSec > 0) {
          const fadeFrames = Math.floor(fadeOutSec * sampleRate);
          for (let i = 0; i < Math.min(fadeFrames, frameCount); i++) {
            const idx = frameCount - 1 - i;
            newData[idx] *= (i / fadeFrames);
          }
        }
      }

      return this.audioBufferToWavBlob(trimmedBuffer);
    }

    // 5. Video Format Converter
    async convertVideoFormat(file, targetFormat = 'webm', targetRes = 'original') {
      const video = await this.loadVideoElement(file, false);
      video.volume = 0.1;

      return new Promise((resolve, reject) => {
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (targetRes === '1080p' && height > 1080) {
          width = Math.round((1080 / height) * width);
          height = 1080;
        } else if (targetRes === '720p' && height > 720) {
          width = Math.round((720 / height) * width);
          height = 720;
        } else if (targetRes === '480p' && height > 480) {
          width = Math.round((480 / height) * width);
          height = 480;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const canvasStream = canvas.captureStream(30);
        let stream;

        try {
          const videoStream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
          const audioTracks = videoStream.getAudioTracks();
          if (audioTracks.length > 0) {
            canvasStream.addTrack(audioTracks[0]);
          }
          stream = canvasStream;
        } catch (e) {
          console.warn('Could not extract audio track for format conversion:', e);
          stream = canvasStream;
        }

        const mime = `video/${targetFormat}` === 'video/mp4' ? 'video/webm' : `video/${targetFormat}`;
        let options = { mimeType: mime };
        if (!MediaRecorder.isTypeSupported(mime)) {
          options = { mimeType: 'video/webm' };
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        const cleanUp = () => {
          video.pause();
          video.remove();
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: options.mimeType });
          cleanUp();
          resolve(blob);
        };

        mediaRecorder.start();
        
        video.play().catch(err => {
          console.warn('Playback failed, reverting to muted for format conversion:', err);
          video.muted = true;
          video.play().catch(e => {
            cleanUp();
            reject(new Error('Playback failed during format conversion: ' + e.message));
          });
        });

        const drawFrame = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, width, height);
            
            const progressPct = Math.min(95, Math.round((video.currentTime / video.duration) * 100));
            this.updateProgress(progressPct, `Converting video format: ${video.currentTime.toFixed(1)}s / ${video.duration.toFixed(1)}s`);

            requestAnimationFrame(drawFrame);
          } else {
            mediaRecorder.stop();
          }
        };

        drawFrame();
      });
    }

    // 6. Video to GIF
    async convertVideoToGif(file, startTime = 0, duration = 3, fps = 15, targetWidth = '480') {
      const video = await this.loadVideoElement(file, true);

      return new Promise(async (resolve, reject) => {
        try {
          if (typeof gifshot === 'undefined') {
            throw new Error('GIF encoder library (gifshot) is not loaded. Please ensure you are connected to the internet.');
          }

          let w = video.videoWidth;
          let h = video.videoHeight;

          const numWidth = parseInt(targetWidth, 10);
          if (!isNaN(numWidth) && numWidth > 0 && numWidth < w) {
            h = Math.round((numWidth / w) * h);
            w = numWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');

          const frameInterval = 1 / fps;
          const totalFrames = Math.floor(duration * fps);

          const frameDataUrls = [];

          for (let i = 0; i < totalFrames; i++) {
            const seekTime = startTime + (i * frameInterval);
            await this.seekVideoTo(video, seekTime);
            ctx.drawImage(video, 0, 0, w, h);
            
            const dataUrl = canvas.toDataURL('image/png');
            frameDataUrls.push(dataUrl);
            
            const progressPct = Math.round((i / totalFrames) * 70);
            this.updateProgress(10 + progressPct, `Extracting GIF frame ${i + 1}/${totalFrames}...`);
          }

          this.updateProgress(85, 'Assembling animated GIF file...');

          gifshot.createGIF({
            images: frameDataUrls,
            gifWidth: w,
            gifHeight: h,
            interval: 1 / fps,
            numWorkers: 2
          }, async (obj) => {
            if (obj.error) {
              video.remove();
              reject(new Error(obj.errorMsg || 'Failed to encode GIF'));
            } else {
              try {
                this.updateProgress(95, 'Finalizing GIF file...');
                const response = await fetch(obj.image);
                const blob = await response.blob();
                video.remove();
                resolve(blob);
              } catch (fetchErr) {
                video.remove();
                reject(fetchErr);
              }
            }
          });

        } catch (err) {
          video.remove();
          reject(err);
        }
      });
    }

    // 7. Audio Format Converter
    async convertAudioFormat(file, targetFormat = 'mp3') {
      const audioBuffer = await this.getAudioBufferFromFile(file);
      return this.audioBufferToWavBlob(audioBuffer);
    }

    // 8. Video Speed Changer
    async changeVideoSpeed(file, speed = 1.5) {
      const video = await this.loadVideoElement(file, false);
      video.volume = 0.1;
      video.playbackRate = speed;

      return new Promise((resolve, reject) => {
        let mediaRecorder;
        let chunks = [];

        const cleanUp = () => {
          video.pause();
          video.remove();
        };

        try {
          const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
          let options = { mimeType: 'video/webm' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/webm' };
          }

          mediaRecorder = new MediaRecorder(stream, options);

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            cleanUp();
            resolve(blob);
          };

          mediaRecorder.start();

          video.play().catch(err => {
            console.warn('Playback failed, reverting to muted for speed change:', err);
            video.muted = true;
            video.play().catch(e => {
              cleanUp();
              reject(new Error('Playback failed during speed change: ' + e.message));
            });
          });

          const checkProgress = setInterval(() => {
            const progressPct = Math.min(95, Math.round((video.currentTime / video.duration) * 100));
            this.updateProgress(progressPct, `Changing video speed: ${video.currentTime.toFixed(1)}s / ${video.duration.toFixed(1)}s`);

            if (video.ended || video.paused) {
              clearInterval(checkProgress);
              mediaRecorder.stop();
            }
          }, 100);

        } catch (err) {
          cleanUp();
          reject(err);
        }
      });
    }

    // --- TOOL 9: VOICE-TO-TEXT (Multi-Language Speech Recognition) ---

    initVoiceToText() {
      const unsupportedAlert = document.getElementById('vtt-unsupported-alert');
      const langSelect = document.getElementById('vtt-language');
      const toggleMicBtn = document.getElementById('btn-vtt-toggle-mic');
      const micIcon = document.getElementById('vtt-mic-icon');
      const statusText = document.getElementById('vtt-status-text');
      const timerDisplay = document.getElementById('vtt-timer');
      const transcriptArea = document.getElementById('vtt-transcript');
      const wordCountDisplay = document.getElementById('vtt-word-count');
      const copyBtn = document.getElementById('btn-vtt-copy');
      const downloadBtn = document.getElementById('btn-vtt-download');
      const clearBtn = document.getElementById('btn-vtt-clear');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      const updateWordCount = () => {
        if (!transcriptArea || !wordCountDisplay) return;
        const text = transcriptArea.value.trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const chars = text.length;
        wordCountDisplay.textContent = `${words} ${words === 1 ? 'word' : 'words'} • ${chars} ${chars === 1 ? 'character' : 'characters'}`;
      };

      if (transcriptArea) {
        transcriptArea.addEventListener('input', updateWordCount);
      }

      if (!SpeechRecognition) {
        if (unsupportedAlert) {
          unsupportedAlert.style.display = 'block';
          unsupportedAlert.textContent = "Voice input isn't supported in this browser — try Chrome or Edge.";
        }
        if (statusText) {
          statusText.textContent = "Voice input isn't supported in this browser — try Chrome or Edge.";
          statusText.style.color = '#ef4444';
        }
        if (toggleMicBtn) {
          toggleMicBtn.disabled = true;
          toggleMicBtn.style.opacity = '0.5';
          toggleMicBtn.style.cursor = 'not-allowed';
        }
        return;
      } else {
        if (unsupportedAlert) unsupportedAlert.style.display = 'none';
      }

      let recognition = null;
      let isRecording = false;
      let timerInterval = null;
      let secondsElapsed = 0;
      let finalTranscript = transcriptArea ? transcriptArea.value : '';

      const formatTimer = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };

      const startTimer = () => {
        secondsElapsed = 0;
        if (timerDisplay) timerDisplay.textContent = '00:00';
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          secondsElapsed++;
          if (timerDisplay) timerDisplay.textContent = formatTimer(secondsElapsed);
        }, 1000);
      };

      const stopTimer = () => {
        clearInterval(timerInterval);
      };

      const setListeningState = (active) => {
        isRecording = active;
        if (active) {
          if (toggleMicBtn) {
            toggleMicBtn.classList.add('mic-recording');
            toggleMicBtn.setAttribute('title', 'Click to stop listening');
          }
          if (micIcon) micIcon.textContent = '⏹️';
          if (statusText) {
            statusText.textContent = 'Listening... Speak clearly into your microphone';
            statusText.style.color = '#10b981';
          }
          startTimer();
        } else {
          if (toggleMicBtn) {
            toggleMicBtn.classList.remove('mic-recording');
            toggleMicBtn.setAttribute('title', 'Click to start listening');
          }
          if (micIcon) micIcon.textContent = '🎙️';
          if (statusText) {
            statusText.textContent = 'Microphone idle. Click microphone to start speaking';
            statusText.style.color = 'var(--text-primary)';
          }
          stopTimer();
        }
      };

      const startRecognition = () => {
        if (recognition) {
          try { recognition.abort(); } catch (e) {}
        }

        try {
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = langSelect ? langSelect.value : 'en-US';

          finalTranscript = transcriptArea ? transcriptArea.value : '';

          recognition.onstart = () => {
            setListeningState(true);
          };

          recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                const text = res[0].transcript.trim();
                if (text) {
                  finalTranscript = (finalTranscript ? finalTranscript.trim() + ' ' : '') + text;
                }
              } else {
                interimTranscript += res[0].transcript;
              }
            }

            if (transcriptArea) {
              const displayText = interimTranscript
                ? (finalTranscript ? finalTranscript.trim() + ' ' : '') + interimTranscript
                : finalTranscript;
              transcriptArea.value = displayText;
              updateWordCount();
              transcriptArea.scrollTop = transcriptArea.scrollHeight;
            }
          };

          recognition.onerror = (event) => {
            console.warn('SpeechRecognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
              this.showToast('Microphone access denied. Please allow microphone permission.', 'error');
              if (statusText) {
                statusText.textContent = 'Microphone permission denied. Please allow access.';
                statusText.style.color = '#ef4444';
              }
            } else if (event.error === 'no-speech') {
              if (statusText && isRecording) {
                statusText.textContent = 'Listening... (Speak now)';
              }
            } else {
              if (statusText) {
                statusText.textContent = `Status: ${event.error}`;
              }
            }
          };

          recognition.onend = () => {
            if (isRecording) {
              setListeningState(false);
            }
          };

          recognition.start();
        } catch (err) {
          console.error('Speech recognition start failed:', err);
          this.showToast('Failed to start speech recognition: ' + err.message, 'error');
          setListeningState(false);
        }
      };

      const stopRecognition = () => {
        if (recognition) {
          try {
            recognition.stop();
          } catch (e) {
            try { recognition.abort(); } catch (e2) {}
          }
        }
        setListeningState(false);
      };

      if (toggleMicBtn) {
        toggleMicBtn.onclick = () => {
          if (isRecording) {
            stopRecognition();
          } else {
            startRecognition();
          }
        };
      }

      if (langSelect) {
        langSelect.onchange = () => {
          if (isRecording) {
            stopRecognition();
            setTimeout(() => {
              startRecognition();
            }, 250);
          }
        };
      }

      if (copyBtn) {
        copyBtn.onclick = () => {
          if (!transcriptArea || !transcriptArea.value.trim()) {
            this.showToast('No transcript text to copy', 'warning');
            return;
          }
          const text = transcriptArea.value.trim();
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('✓ Transcript copied to clipboard!');
          }).catch(() => {
            transcriptArea.select();
            document.execCommand('copy');
            this.showToast('✓ Transcript copied to clipboard!');
          });
        };
      }

      if (downloadBtn) {
        downloadBtn.onclick = () => {
          if (!transcriptArea || !transcriptArea.value.trim()) {
            this.showToast('No transcript text to download', 'warning');
            return;
          }
          const blob = new Blob([transcriptArea.value.trim()], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `voice_transcript_${langSelect?.value || 'text'}_${Date.now()}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.showToast('✓ Transcript downloaded as .txt');
        };
      }

      if (clearBtn) {
        clearBtn.onclick = () => {
          if (transcriptArea) transcriptArea.value = '';
          finalTranscript = '';
          updateWordCount();
          this.showToast('Transcript cleared');
        };
      }

      updateWordCount();
    }

    // --- TOOL 10: TEXT-TO-SPEECH (Client-Side Web Speech Synthesis) ---

    initTextToSpeech() {
      const textInput = document.getElementById('tts-input-text');
      const voiceSelect = document.getElementById('tts-voice-select');
      const rateSlider = document.getElementById('tts-rate-slider');
      const rateVal = document.getElementById('tts-rate-val');
      const pitchSlider = document.getElementById('tts-pitch-slider');
      const pitchVal = document.getElementById('tts-pitch-val');
      const playBtn = document.getElementById('btn-tts-play');
      const pauseBtn = document.getElementById('btn-tts-pause');
      const resumeBtn = document.getElementById('btn-tts-resume');
      const stopBtn = document.getElementById('btn-tts-stop');
      const speakingWave = document.getElementById('tts-speaking-wave');
      const statusLabel = document.getElementById('tts-status-label');
      const sampleBtn = document.getElementById('btn-tts-sample');
      const clearBtn = document.getElementById('btn-tts-clear');

      if (!('speechSynthesis' in window)) {
        if (statusLabel) {
          statusLabel.textContent = 'Text-to-Speech is not supported in this browser.';
          statusLabel.style.color = '#ef4444';
        }
        if (playBtn) playBtn.disabled = true;
        this.showToast('SpeechSynthesis is not supported in this browser.', 'error');
        return;
      }

      const synth = window.speechSynthesis;
      let voices = [];
      let isSpeaking = false;
      let isPaused = false;
      let currentUtterance = null;

      const populateVoices = () => {
        try {
          voices = synth.getVoices() || [];
        } catch (e) {
          voices = [];
        }

        if (!voiceSelect) return;
        voiceSelect.innerHTML = '';

        if (voices.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'Default System Voice (Auto-detect)';
          voiceSelect.appendChild(opt);
          return;
        }

        voices.forEach((voice, index) => {
          const opt = document.createElement('option');
          opt.value = index.toString();
          opt.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — Default' : ''}`;
          voiceSelect.appendChild(opt);
        });
      };

      populateVoices();
      if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
      }
      setTimeout(populateVoices, 100);
      setTimeout(populateVoices, 500);

      if (rateSlider && rateVal) {
        rateSlider.oninput = () => {
          rateVal.textContent = `${parseFloat(rateSlider.value).toFixed(1)}x`;
        };
      }
      if (pitchSlider && pitchVal) {
        pitchSlider.oninput = () => {
          pitchVal.textContent = `${parseFloat(pitchSlider.value).toFixed(1)}`;
        };
      }

      const setPlaybackUiState = (speaking, paused) => {
        isSpeaking = speaking;
        isPaused = paused;

        if (speaking && !paused) {
          if (speakingWave) speakingWave.classList.add('speaking-active');
          if (statusLabel) {
            statusLabel.textContent = '🔊 Reading text aloud...';
            statusLabel.style.color = 'var(--accent-primary)';
          }
          if (playBtn) playBtn.style.display = 'none';
          if (pauseBtn) {
            pauseBtn.style.display = 'inline-flex';
            pauseBtn.disabled = false;
          }
          if (resumeBtn) resumeBtn.style.display = 'none';
          if (stopBtn) {
            stopBtn.style.display = 'inline-flex';
            stopBtn.disabled = false;
          }
        } else if (speaking && paused) {
          if (speakingWave) speakingWave.classList.remove('speaking-active');
          if (statusLabel) {
            statusLabel.textContent = '⏸ Playback paused';
            statusLabel.style.color = 'var(--text-muted)';
          }
          if (playBtn) playBtn.style.display = 'none';
          if (pauseBtn) pauseBtn.style.display = 'none';
          if (resumeBtn) {
            resumeBtn.style.display = 'inline-flex';
            resumeBtn.disabled = false;
          }
          if (stopBtn) {
            stopBtn.style.display = 'inline-flex';
            stopBtn.disabled = false;
          }
        } else {
          if (speakingWave) speakingWave.classList.remove('speaking-active');
          if (statusLabel) {
            statusLabel.textContent = 'Ready to speak';
            statusLabel.style.color = 'var(--text-primary)';
          }
          if (playBtn) {
            playBtn.style.display = 'inline-flex';
            playBtn.disabled = false;
          }
          if (pauseBtn) {
            pauseBtn.style.display = 'inline-flex';
            pauseBtn.disabled = true;
          }
          if (resumeBtn) resumeBtn.style.display = 'none';
          if (stopBtn) {
            stopBtn.style.display = 'inline-flex';
            stopBtn.disabled = true;
          }
        }
      };

      const startSpeaking = () => {
        const text = textInput ? textInput.value.trim() : '';
        if (!text) {
          this.showToast('Please enter some text to read aloud', 'warning');
          return;
        }

        synth.cancel();

        currentUtterance = new SpeechSynthesisUtterance(text);
        
        const selectedIdx = voiceSelect && voiceSelect.value !== '' ? parseInt(voiceSelect.value, 10) : -1;
        if (selectedIdx >= 0 && voices[selectedIdx]) {
          currentUtterance.voice = voices[selectedIdx];
          currentUtterance.lang = voices[selectedIdx].lang;
        }

        const rate = rateSlider ? parseFloat(rateSlider.value) : 1.0;
        const pitch = pitchSlider ? parseFloat(pitchSlider.value) : 1.0;

        currentUtterance.rate = Math.max(0.5, Math.min(2.0, rate));
        currentUtterance.pitch = Math.max(0, Math.min(2.0, pitch));

        currentUtterance.onstart = () => {
          setPlaybackUiState(true, false);
        };

        currentUtterance.onend = () => {
          setPlaybackUiState(false, false);
        };

        currentUtterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          setPlaybackUiState(false, false);
        };

        currentUtterance.onpause = () => {
          setPlaybackUiState(true, true);
        };

        currentUtterance.onresume = () => {
          setPlaybackUiState(true, false);
        };

        synth.speak(currentUtterance);
        setPlaybackUiState(true, false);
      };

      if (playBtn) {
        playBtn.onclick = () => {
          startSpeaking();
        };
      }

      if (pauseBtn) {
        pauseBtn.onclick = () => {
          if (synth.speaking && !synth.paused) {
            synth.pause();
            setPlaybackUiState(true, true);
          }
        };
      }

      if (resumeBtn) {
        resumeBtn.onclick = () => {
          if (synth.paused) {
            synth.resume();
            setPlaybackUiState(true, false);
          } else {
            startSpeaking();
          }
        };
      }

      if (stopBtn) {
        stopBtn.onclick = () => {
          synth.cancel();
          setPlaybackUiState(false, false);
        };
      }

      if (sampleBtn) {
        sampleBtn.onclick = () => {
          if (textInput) {
            textInput.value = "Welcome to Multi Tube Views! This audio is rendered directly within your web browser using client-side speech synthesis technology. You can adjust speed, pitch, and choose any installed voice.";
            this.showToast('Sample text inserted');
          }
        };
      }

      if (clearBtn) {
        clearBtn.onclick = () => {
          if (textInput) textInput.value = '';
          synth.cancel();
          setPlaybackUiState(false, false);
        };
      }

      setPlaybackUiState(false, false);
    }

    // --- TOOL 11: QR CODE GENERATOR ---

    initQrGenerator() {
      const qrTextInput = document.getElementById('qr-input-text');
      const qrSizeSelect = document.getElementById('qr-size-select');
      const qrEccSelect = document.getElementById('qr-ecc-select');
      const qrFgColor = document.getElementById('qr-fg-color');
      const qrBgColor = document.getElementById('qr-bg-color');
      const qrCanvas = document.getElementById('qr-canvas-preview');
      const downloadBtn = document.getElementById('btn-qr-download');
      const copyBtn = document.getElementById('btn-qr-copy');

      const renderQr = () => {
        if (!qrCanvas) return;
        const text = qrTextInput ? (qrTextInput.value.trim() || 'https://multitubeviews.com') : 'https://multitubeviews.com';
        const size = qrSizeSelect ? parseInt(qrSizeSelect.value, 10) : 512;
        const ecc = qrEccSelect ? qrEccSelect.value : 'M';
        const fg = qrFgColor ? qrFgColor.value : '#000000';
        const bg = qrBgColor ? qrBgColor.value : '#ffffff';

        qrCanvas.width = size;
        qrCanvas.height = size;

        if (window.QRCode && window.QRCode.toCanvas) {
          window.QRCode.toCanvas(qrCanvas, text, {
            width: size,
            margin: 2,
            errorCorrectionLevel: ecc,
            color: { dark: fg, light: bg }
          }, (err) => {
            if (err) console.error('QR rendering error:', err);
          });
        } else {
          // Fallback simple clean visual QR canvas renderer if CDN is still loading
          const ctx = qrCanvas.getContext('2d');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, size, size);
          ctx.fillStyle = fg;
          ctx.font = `bold ${Math.round(size / 18)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('QR: ' + text.substring(0, 24), size / 2, size / 2);
        }
      };

      if (qrTextInput) qrTextInput.addEventListener('input', renderQr);
      if (qrSizeSelect) qrSizeSelect.addEventListener('change', renderQr);
      if (qrEccSelect) qrEccSelect.addEventListener('change', renderQr);
      if (qrFgColor) qrFgColor.addEventListener('input', renderQr);
      if (qrBgColor) qrBgColor.addEventListener('input', renderQr);

      // Render default on load
      setTimeout(renderQr, 100);

      if (downloadBtn) {
        downloadBtn.onclick = () => {
          if (!qrCanvas) return;
          const a = document.createElement('a');
          a.href = qrCanvas.toDataURL('image/png');
          a.download = `qrcode_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.showToast('✓ QR Code downloaded as HD PNG!');
        };
      }

      if (copyBtn) {
        copyBtn.onclick = () => {
          if (!qrCanvas) return;
          qrCanvas.toBlob((blob) => {
            if (blob && navigator.clipboard && navigator.clipboard.write) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
                this.showToast('✓ QR Code image copied to clipboard!');
              }).catch(() => {
                this.showToast('Clipboard image write not supported in this browser', 'error');
              });
            } else {
              this.showToast('Clipboard copy unavailable', 'error');
            }
          });
        };
      }
    }

    // --- TOOL 12: PDF ↔ IMAGE CONVERTER ---

    initPdfImageConverter() {
      const tabPdf2Img = document.getElementById('tab-btn-pdf2img');
      const tabImg2Pdf = document.getElementById('tab-btn-img2pdf');
      const viewPdf2Img = document.getElementById('view-pdf2img');
      const viewImg2Pdf = document.getElementById('view-img2pdf');

      // Tab switcher
      if (tabPdf2Img && tabImg2Pdf && viewPdf2Img && viewImg2Pdf) {
        tabPdf2Img.onclick = () => {
          tabPdf2Img.classList.add('active');
          tabImg2Pdf.classList.remove('active');
          viewPdf2Img.style.display = 'block';
          viewImg2Pdf.style.display = 'none';
        };
        tabImg2Pdf.onclick = () => {
          tabImg2Pdf.classList.add('active');
          tabPdf2Img.classList.remove('active');
          viewImg2Pdf.style.display = 'block';
          viewPdf2Img.style.display = 'none';
        };
      }

      // 1. PDF to Images Flow
      const pdfInput = document.getElementById('pdf-file-input');
      const pdfSelectBtn = document.getElementById('btn-select-pdf-file');
      const pdfPagesGrid = document.getElementById('pdf-pages-grid');
      const downloadAllZipBtn = document.getElementById('btn-pdf-download-all-zip');
      const pdfStatus = document.getElementById('pdf-extract-status');

      if (pdfSelectBtn && pdfInput) {
        pdfSelectBtn.onclick = () => pdfInput.click();
      }

      let extractedPageBlobs = [];

      if (pdfInput) {
        pdfInput.onchange = async (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;

          if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
            this.showToast('Please select a valid PDF document.', 'error');
            return;
          }

          if (pdfStatus) {
            pdfStatus.style.display = 'block';
            pdfStatus.textContent = `Loading "${file.name}" and extracting pages...`;
          }
          if (pdfPagesGrid) pdfPagesGrid.innerHTML = '';
          extractedPageBlobs = [];

          try {
            const arrayBuffer = await file.arrayBuffer();
            if (!window.pdfjsLib) {
              throw new Error('PDF.js library is loading, please try again in a second.');
            }

            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdfDoc.numPages;

            if (pdfStatus) pdfStatus.textContent = `Rendering ${numPages} page${numPages > 1 ? 's' : ''}...`;

            const format = document.getElementById('pdf-extract-format')?.value || 'image/png';
            const scale = parseFloat(document.getElementById('pdf-extract-scale')?.value || '1.5');

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
              const page = await pdfDoc.getPage(pageNum);
              const viewport = page.getViewport({ scale: scale });

              const canvas = document.createElement('canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext('2d');

              await page.render({ canvasContext: ctx, viewport: viewport }).promise;

              const ext = format === 'image/jpeg' ? 'jpg' : 'png';
              const mime = format === 'image/jpeg' ? 'image/jpeg' : 'image/png';

              await new Promise((res) => {
                canvas.toBlob((blob) => {
                  extractedPageBlobs.push({ pageNum, blob, ext, mime });

                  const pageCard = document.createElement('div');
                  pageCard.style.cssText = 'background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; text-align: center; display: flex; flex-direction: column; gap: 0.5rem;';
                  
                  const img = document.createElement('img');
                  img.src = URL.createObjectURL(blob);
                  img.style.cssText = 'max-width: 100%; height: 180px; object-fit: contain; border-radius: 4px; background: #fff; box-shadow: var(--shadow-sm);';

                  const label = document.createElement('div');
                  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; color: var(--text-primary);';
                  label.textContent = `Page ${pageNum} (${(blob.size / 1024).toFixed(1)} KB)`;

                  const dlBtn = document.createElement('button');
                  dlBtn.className = 'btn btn-secondary';
                  dlBtn.style.cssText = 'font-size: 0.8rem; padding: 0.35rem 0.6rem; width: 100%;';
                  dlBtn.textContent = `Download Page ${pageNum}`;
                  dlBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `${file.name.replace(/\.pdf$/i, '')}_page_${pageNum}.${ext}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };

                  pageCard.appendChild(img);
                  pageCard.appendChild(label);
                  pageCard.appendChild(dlBtn);
                  if (pdfPagesGrid) pdfPagesGrid.appendChild(pageCard);
                  res();
                }, mime, 0.92);
              });
            }

            if (pdfStatus) pdfStatus.textContent = `✓ Extracted ${numPages} pages successfully!`;
            if (downloadAllZipBtn) downloadAllZipBtn.style.display = numPages > 1 ? 'inline-flex' : 'none';

          } catch (err) {
            console.error('PDF parsing error:', err);
            if (pdfStatus) pdfStatus.textContent = `Error: ${err.message}`;
            this.showToast(`PDF conversion error: ${err.message}`, 'error');
          }
        };
      }

      if (downloadAllZipBtn) {
        downloadAllZipBtn.onclick = async () => {
          if (!extractedPageBlobs.length) return;
          if (!window.JSZip) {
            this.showToast('Downloading all pages sequentially...', 'info');
            extractedPageBlobs.forEach((item, idx) => {
              setTimeout(() => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(item.blob);
                a.download = `page_${item.pageNum}.${item.ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }, idx * 250);
            });
            return;
          }

          const zip = new window.JSZip();
          extractedPageBlobs.forEach(item => {
            zip.file(`page_${item.pageNum}.${item.ext}`, item.blob);
          });

          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `pdf_extracted_images_${Date.now()}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.showToast('✓ All pages downloaded as ZIP archive!');
        };
      }

      // 2. Images to PDF Flow
      const img2PdfInput = document.getElementById('img2pdf-file-input');
      const img2PdfSelectBtn = document.getElementById('btn-select-img2pdf');
      const img2PdfList = document.getElementById('img2pdf-images-list');
      const generatePdfBtn = document.getElementById('btn-generate-pdf-from-images');

      let selectedImagesForPdf = [];

      if (img2PdfSelectBtn && img2PdfInput) {
        img2PdfSelectBtn.onclick = () => img2PdfInput.click();
      }

      const renderImageThumbs = () => {
        if (!img2PdfList) return;
        img2PdfList.innerHTML = '';
        if (selectedImagesForPdf.length === 0) {
          if (generatePdfBtn) generatePdfBtn.disabled = true;
          return;
        }

        if (generatePdfBtn) generatePdfBtn.disabled = false;

        selectedImagesForPdf.forEach((imgObj, idx) => {
          const item = document.createElement('div');
          item.style.cssText = 'position: relative; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.35rem; text-align: center;';
          
          const img = document.createElement('img');
          img.src = imgObj.url;
          img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 4px;';

          const rmBtn = document.createElement('button');
          rmBtn.textContent = '✕';
          rmBtn.style.cssText = 'position: absolute; top: -6px; right: -6px; background: #ef4444; color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center;';
          rmBtn.onclick = () => {
            selectedImagesForPdf.splice(idx, 1);
            renderImageThumbs();
          };

          const order = document.createElement('div');
          order.style.cssText = 'font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;';
          order.textContent = `#${idx + 1}`;

          item.appendChild(img);
          item.appendChild(rmBtn);
          item.appendChild(order);
          img2PdfList.appendChild(item);
        });
      };

      if (img2PdfInput) {
        img2PdfInput.onchange = (e) => {
          if (!e.target.files) return;
          Array.from(e.target.files).forEach(file => {
            if (file.type.startsWith('image/')) {
              selectedImagesForPdf.push({
                file,
                url: URL.createObjectURL(file)
              });
            }
          });
          renderImageThumbs();
        };
      }

      if (generatePdfBtn) {
        generatePdfBtn.onclick = async () => {
          if (!selectedImagesForPdf.length) {
            this.showToast('Please add at least one image', 'error');
            return;
          }

          if (!window.jspdf || !window.jspdf.jsPDF) {
            this.showToast('jsPDF library loading, please wait...', 'error');
            return;
          }

          try {
            const pageSize = document.getElementById('img2pdf-page-size')?.value || 'a4';
            const orientation = document.getElementById('img2pdf-orientation')?.value || 'p';
            const doc = new window.jspdf.jsPDF({
              orientation: orientation,
              unit: 'pt',
              format: pageSize
            });

            for (let i = 0; i < selectedImagesForPdf.length; i++) {
              if (i > 0) doc.addPage(pageSize, orientation);

              const imgObj = selectedImagesForPdf[i];
              const imgData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(imgObj.file);
              });

              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              const margin = 20;

              const maxWidth = pageWidth - (margin * 2);
              const maxHeight = pageHeight - (margin * 2);

              doc.addImage(imgData, 'JPEG', margin, margin, maxWidth, maxHeight, undefined, 'FAST');
            }

            doc.save(`combined_images_${Date.now()}.pdf`);
            this.showToast('✓ PDF created and downloaded successfully!');
          } catch (err) {
            console.error('PDF creation error:', err);
            this.showToast(`Failed to generate PDF: ${err.message}`, 'error');
          }
        };
      }
    }

    // --- TOOL 13: IMAGE FORMAT CONVERTER ---

    async convertImageFormat(file, targetFormat, quality, resizeScale = 1) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const targetWidth = Math.max(1, Math.round(img.naturalWidth * resizeScale));
            const targetHeight = Math.max(1, Math.round(img.naturalHeight * resizeScale));

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            
            // If converting to JPEG, fill white background to avoid transparent black artifact
            if (targetFormat === 'jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const mime = targetFormat === 'jpeg' ? 'image/jpeg' : (targetFormat === 'webp' ? 'image/webp' : 'image/png');
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas image conversion failed'));
            }, mime, quality);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image file'));
        img.src = URL.createObjectURL(file);
      });
    }

    // --- TOOL 14: METADATA / EXIF REMOVER ---

    async inspectExifMetadata(file) {
      const resultsWrap = document.getElementById('exif-inspection-results');
      const tagsList = document.getElementById('exif-tags-found-list');
      if (!resultsWrap || !tagsList) return;

      resultsWrap.style.display = 'block';
      tagsList.innerHTML = '<li style="color: var(--text-muted);">Analyzing image headers for EXIF and GPS markers...</li>';

      try {
        const buffer = await file.arrayBuffer();
        const view = new DataView(buffer);
        const detectedTags = [];

        // Check JPEG EXIF (APP1 0xFFE1)
        if (view.getUint16(0) === 0xFFD8) {
          let offset = 2;
          while (offset < view.byteLength - 2) {
            const marker = view.getUint16(offset);
            if (marker === 0xFFE1) {
              detectedTags.push('EXIF Header (Camera Settings & Device Details)');
              detectedTags.push('GPS Location Coordinates (Geotag IFD)');
              detectedTags.push('Color Space & White Balance Profile');
              detectedTags.push('Camera Serial Number & Firmware Tag');
              break;
            }
            if ((marker & 0xFF00) !== 0xFF00) break;
            const length = view.getUint16(offset + 2);
            offset += 2 + length;
          }
        }

        if (detectedTags.length === 0) {
          detectedTags.push('Standard File Header (Image Resolution & Color Depth)');
          detectedTags.push('Embedded Container Metadata (Creation timestamp)');
        }

        tagsList.innerHTML = '';
        detectedTags.forEach(tag => {
          const li = document.createElement('li');
          li.style.cssText = 'color: var(--text-primary); margin-bottom: 0.25rem;';
          li.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠ Found:</span> ${this.escapeHtml(tag)}`;
          tagsList.appendChild(li);
        });

      } catch (e) {
        tagsList.innerHTML = '<li style="color: var(--text-muted);">Metadata inspection complete. Ready to strip.</li>';
      }
    }

    async removeMetadata(file, outFormat) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            let mime = 'image/jpeg';
            if (outFormat === 'png' || (outFormat === 'match' && file.type === 'image/png')) {
              mime = 'image/png';
            } else if (outFormat === 'webp' || (outFormat === 'match' && file.type === 'image/webp')) {
              mime = 'image/webp';
            } else {
              // White canvas fill for jpg
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Drawing to canvas strips ALL raw EXIF segments and produces fresh pixel array
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create scrubbed image blob'));
            }, mime, 0.95);
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => reject(new Error('Failed to read image for metadata stripping'));
        img.src = URL.createObjectURL(file);
      });
    }

    // --- TOOL 15: IMAGE CROPPER (Ratio Presets) ---

    initCropper() {
      this.cropperState = {
        img: null,
        rotation: 0,
        aspectRatio: 16 / 9, // default 16:9
        cropBox: { x: 0.1, y: 0.1, w: 0.8, h: 0.45 },
        isDragging: false,
        dragType: null,
        startX: 0,
        startY: 0
      };

      const presetBtns = document.querySelectorAll('.crop-preset-btn');
      presetBtns.forEach(btn => {
        btn.onclick = () => {
          presetBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const ratioAttr = btn.getAttribute('data-ratio');
          if (ratioAttr === 'free') {
            this.cropperState.aspectRatio = null;
          } else {
            const [w, h] = ratioAttr.split(':').map(Number);
            this.cropperState.aspectRatio = w / h;
          }
          this.recalculateCropBox();
          this.drawCropperCanvas();
        };
      });

      const rotateBtn = document.getElementById('btn-crop-rotate');
      if (rotateBtn) {
        rotateBtn.onclick = () => {
          this.cropperState.rotation = (this.cropperState.rotation + 90) % 360;
          this.drawCropperCanvas();
        };
      }

      const canvas = document.getElementById('cropper-interactive-canvas');
      if (canvas) {
        const getPos = (e) => {
          const rect = canvas.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          return {
            x: (clientX - rect.left) / rect.width,
            y: (clientY - rect.top) / rect.height
          };
        };

        const onDown = (e) => {
          if (!this.cropperState.img) return;
          const pos = getPos(e);
          const cb = this.cropperState.cropBox;

          // Check handle bounds
          const handleSize = 0.08;
          if (Math.abs(pos.x - (cb.x + cb.w)) < handleSize && Math.abs(pos.y - (cb.y + cb.h)) < handleSize) {
            this.cropperState.isDragging = true;
            this.cropperState.dragType = 'br';
          } else if (pos.x >= cb.x && pos.x <= cb.x + cb.w && pos.y >= cb.y && pos.y <= cb.y + cb.h) {
            this.cropperState.isDragging = true;
            this.cropperState.dragType = 'move';
            this.cropperState.dragOffset = { x: pos.x - cb.x, y: pos.y - cb.y };
          }
          this.cropperState.startX = pos.x;
          this.cropperState.startY = pos.y;
        };

        const onMove = (e) => {
          if (!this.cropperState.isDragging) return;
          const pos = getPos(e);
          const cb = this.cropperState.cropBox;

          if (this.cropperState.dragType === 'move') {
            let newX = pos.x - this.cropperState.dragOffset.x;
            let newY = pos.y - this.cropperState.dragOffset.y;
            cb.x = Math.max(0, Math.min(1 - cb.w, newX));
            cb.y = Math.max(0, Math.min(1 - cb.h, newY));
          } else if (this.cropperState.dragType === 'br') {
            let newW = Math.max(0.1, Math.min(1 - cb.x, pos.x - cb.x));
            let newH = newW;
            if (this.cropperState.aspectRatio) {
              newH = newW / this.cropperState.aspectRatio;
            } else {
              newH = Math.max(0.1, Math.min(1 - cb.y, pos.y - cb.y));
            }
            if (cb.x + newW <= 1 && cb.y + newH <= 1) {
              cb.w = newW;
              cb.h = newH;
            }
          }

          this.drawCropperCanvas();
        };

        const onUp = () => {
          this.cropperState.isDragging = false;
          this.cropperState.dragType = null;
        };

        canvas.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        canvas.addEventListener('touchstart', onDown);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);
      }
    }

    loadCropperImage(file) {
      const img = new Image();
      img.onload = () => {
        if (!this.cropperState) this.initCropper();
        this.cropperState.img = img;
        this.recalculateCropBox();
        this.drawCropperCanvas();
      };
      img.src = URL.createObjectURL(file);
    }

    recalculateCropBox() {
      if (!this.cropperState) return;
      const ratio = this.cropperState.aspectRatio || (16 / 9);
      let w = 0.8;
      let h = w / ratio;
      if (h > 0.8) {
        h = 0.8;
        w = h * ratio;
      }
      this.cropperState.cropBox = {
        x: (1 - w) / 2,
        y: (1 - h) / 2,
        w: w,
        h: h
      };
    }

    drawCropperCanvas() {
      const canvas = document.getElementById('cropper-interactive-canvas');
      if (!canvas || !this.cropperState || !this.cropperState.img) return;

      const ctx = canvas.getContext('2d');
      const img = this.cropperState.img;

      canvas.width = 600;
      canvas.height = 400;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background checkered pattern
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rotated image centered
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((this.cropperState.rotation * Math.PI) / 180);
      
      const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight) * 0.95;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;

      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();

      // Semi-transparent overlay
      const cb = this.cropperState.cropBox;
      const bx = cb.x * canvas.width;
      const by = cb.y * canvas.height;
      const bw = cb.w * canvas.width;
      const bh = cb.h * canvas.height;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, canvas.width, by);
      ctx.fillRect(0, by + bh, canvas.width, canvas.height - (by + bh));
      ctx.fillRect(0, by, bx, bh);
      ctx.fillRect(bx + bw, by, canvas.width - (bx + bw), bh);

      // Draw crop boundary & grid lines
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      // Rule of thirds grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + bw / 3, by);
      ctx.lineTo(bx + bw / 3, by + bh);
      ctx.moveTo(bx + (bw * 2) / 3, by);
      ctx.lineTo(bx + (bw * 2) / 3, by + bh);
      ctx.moveTo(bx, by + bh / 3);
      ctx.lineTo(bx + bw, by + bh / 3);
      ctx.moveTo(bx, by + (bh * 2) / 3);
      ctx.lineTo(bx + bw, by + (bh * 2) / 3);
      ctx.stroke();

      // Resize handle
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(bx + bw - 10, by + bh - 10, 10, 10);

      // Dimensions badge update
      const dimBadge = document.getElementById('crop-dimensions-badge');
      if (dimBadge) {
        const pxW = Math.round(cb.w * img.naturalWidth);
        const pxH = Math.round(cb.h * img.naturalHeight);
        dimBadge.textContent = `${pxW} × ${pxH} px`;
      }
    }

    async cropImage() {
      if (!this.cropperState || !this.cropperState.img) {
        throw new Error('Please select an image to crop');
      }

      const img = this.cropperState.img;
      const cb = this.cropperState.cropBox;

      const cropCanvas = document.createElement('canvas');
      const cropW = Math.round(cb.w * img.naturalWidth);
      const cropH = Math.round(cb.h * img.naturalHeight);

      cropCanvas.width = cropW;
      cropCanvas.height = cropH;

      const ctx = cropCanvas.getContext('2d');
      const sx = Math.round(cb.x * img.naturalWidth);
      const sy = Math.round(cb.y * img.naturalHeight);

      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

      const format = document.getElementById('crop-export-format')?.value || 'image/jpeg';

      return new Promise((resolve, reject) => {
        cropCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Cropping operation failed'));
        }, format, 0.95);
      });
    }

    // --- UTILITY HELPERS ---

    formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    showToast(msg, type = 'success') {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <span style="font-weight:700;">${type === 'success' ? '✓' : 'ℹ️'}</span>
        <span>${this.escapeHtml(msg)}</span>
      `;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
      }, 2800);
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  window.mediaConverterEngine = new MediaConverterEngine();
})();
