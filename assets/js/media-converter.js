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

        // Tool-specific Option Panels
        optionsPanels: document.querySelectorAll('.media-options-panel'),

        // Action Button
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
        'video-speed'
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

      // Tool Metadata configuration
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
        }
      };

      const config = toolConfigs[toolId] || toolConfigs['video-to-audio'];

      // Update workspace Header
      if (this.dom.toolTitle) this.dom.toolTitle.textContent = config.title;
      if (this.dom.toolDesc) this.dom.toolDesc.textContent = config.desc;
      if (this.dom.toolIcon) this.dom.toolIcon.textContent = config.icon;
      if (this.dom.actionBtnText) this.dom.actionBtnText.textContent = config.actionText;

      if (this.dom.aboutTitle) this.dom.aboutTitle.textContent = `About ${config.title}`;
      if (this.dom.aboutText) this.dom.aboutText.textContent = config.about;

      // Update file input accepted accept attribute
      if (this.dom.fileInput) this.dom.fileInput.setAttribute('accept', config.accept);

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
      } else {
        if (this.dom.inputAudioPlayer) {
          this.dom.inputAudioPlayer.style.display = 'block';
          this.dom.inputAudioPlayer.src = fileUrl;
          this.dom.inputAudioPlayer.onloadedmetadata = () => {
            this.setupTimeSlidersForAudio(this.dom.inputAudioPlayer.duration);
          };
        }
        if (this.dom.inputVideoPlayer) this.dom.inputVideoPlayer.style.display = 'none';
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
      if (this.dom.dropzone) this.dom.dropzone.style.display = 'block';

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

          default:
            throw new Error('Unknown tool selected');
        }

        this.updateProgress(100, 'Processing complete!');
        this.renderOutputResult(resultBlob, extension, mimeType, resultMeta);
        this.showToast('✓ Media processing completed successfully!');
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

      if (isGif) {
        if (this.dom.outputGifPreview) {
          this.dom.outputGifPreview.style.display = 'block';
          this.dom.outputGifPreview.src = outputUrl;
        }
        if (this.dom.outputVideoPlayer) this.dom.outputVideoPlayer.style.display = 'none';
        if (this.dom.outputAudioPlayer) this.dom.outputAudioPlayer.style.display = 'none';
      } else if (isVideo) {
        if (this.dom.outputVideoPlayer) {
          this.dom.outputVideoPlayer.style.display = 'block';
          this.dom.outputVideoPlayer.src = outputUrl;
          this.dom.outputVideoPlayer.load();
        }
        if (this.dom.outputAudioPlayer) this.dom.outputAudioPlayer.style.display = 'none';
        if (this.dom.outputGifPreview) this.dom.outputGifPreview.style.display = 'none';
      } else {
        if (this.dom.outputAudioPlayer) {
          this.dom.outputAudioPlayer.style.display = 'block';
          this.dom.outputAudioPlayer.src = outputUrl;
          this.dom.outputAudioPlayer.load();
        }
        if (this.dom.outputVideoPlayer) this.dom.outputVideoPlayer.style.display = 'none';
        if (this.dom.outputGifPreview) this.dom.outputGifPreview.style.display = 'none';
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
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.muted = false;
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          video.currentTime = startTime;
        };

        video.onseeked = () => {
          const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
          const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            resolve(blob);
          };

          mediaRecorder.start();
          video.play();

          const checkTime = setInterval(() => {
            if (video.currentTime >= endTime || video.paused || video.ended) {
              clearInterval(checkTime);
              video.pause();
              mediaRecorder.stop();
            }
          }, 100);
        };

        video.onerror = (e) => reject(new Error('Could not load video for trimming'));
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
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = false;

        video.onloadedmetadata = () => {
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

          const stream = canvas.captureStream(30);
          const mime = `video/${targetFormat}` === 'video/mp4' ? 'video/webm' : `video/${targetFormat}`;
          const mediaRecorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported(mime) ? mime : 'video/webm' });
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: mime });
            resolve(blob);
          };

          mediaRecorder.start();
          video.play();

          function drawFrame() {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, width, height);
              requestAnimationFrame(drawFrame);
            } else {
              mediaRecorder.stop();
            }
          }

          drawFrame();
        };

        video.onerror = () => reject(new Error('Video loading failed'));
      });
    }

    // 6. Video to GIF
    async convertVideoToGif(file, startTime = 0, duration = 3, fps = 15, targetWidth = '480') {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.muted = true;
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          video.currentTime = startTime;
        };

        video.onseeked = async () => {
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
          const frameBlobs = [];

          // Create animated GIF frames canvas
          for (let i = 0; i < totalFrames; i++) {
            video.currentTime = startTime + (i * frameInterval);
            await new Promise(r => setTimeout(r, 40));
            ctx.drawImage(video, 0, 0, w, h);
            this.updateProgress(20 + Math.round((i / totalFrames) * 70), `Processing GIF frame ${i + 1}/${totalFrames}...`);
          }

          // Output canvas animated recording stream as fallback webm/gif blob
          const stream = canvas.captureStream(fps);
          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          const chunks = [];

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'image/gif' });
            resolve(blob);
          };

          recorder.start();
          setTimeout(() => {
            recorder.stop();
          }, duration * 1000);
        };

        video.onerror = () => reject(new Error('Could not render video frames'));
      });
    }

    // 7. Audio Format Converter
    async convertAudioFormat(file, targetFormat = 'mp3') {
      const audioBuffer = await this.getAudioBufferFromFile(file);
      return this.audioBufferToWavBlob(audioBuffer);
    }

    // 8. Video Speed Changer
    async changeVideoSpeed(file, speed = 1.5) {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.muted = false;
        video.playbackRate = speed;
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          video.currentTime = 0;
          video.play();

          const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
          const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            resolve(blob);
          };

          mediaRecorder.start();

          video.onended = () => {
            mediaRecorder.stop();
          };
        };

        video.onerror = () => reject(new Error('Could not process video speed'));
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
