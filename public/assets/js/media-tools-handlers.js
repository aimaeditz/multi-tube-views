/**
 * Multi Tube Views (MTV) — Media Tools Handlers & Processing Engines
 * 100% Client-Side Processing for:
 * - 15 New Image Tools
 * - 10 New Video Tools
 * - 10 New Audio Tools
 * - 10 New PDF & Document Tools
 */

(function() {
  'use strict';

  // Helper: Convert AudioBuffer to WAV Blob
  function audioBufferToWavBlob(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let interleaved;
    if (numChannels === 2) {
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      const length = left.length + right.length;
      interleaved = new Float32Array(length);
      let inputIndex = 0;
      for (let index = 0; index < length; index += 2) {
        interleaved[index] = left[inputIndex];
        interleaved[index + 1] = right[inputIndex];
        inputIndex++;
      }
    } else {
      interleaved = buffer.getChannelData(0);
    }

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = interleaved.length * bytesPerSample;
    const bufferLength = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    function writeString(offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    /* RIFF identifier */
    writeString(0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + dataSize, true);
    /* RIFF type */
    writeString(8, 'WAVE');
    /* format chunk identifier */
    writeString(12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(36, 'data');
    /* data chunk length */
    view.setUint32(40, dataSize, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < interleaved.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Helper: Convert AudioBuffer to MP3 Blob using lamejs (if loaded) or fallback to WAV
  function audioBufferToMp3Blob(audioBuffer, bitrateKbps = 128) {
    if (typeof window.lamejs !== 'undefined' && window.lamejs.Mp3Encoder) {
      try {
        const channels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const mp3encoder = new window.lamejs.Mp3Encoder(channels, sampleRate, bitrateKbps);
        const mp3Data = [];

        const left = audioBuffer.getChannelData(0);
        const right = channels > 1 ? audioBuffer.getChannelData(1) : left;

        const leftInt16 = new Int16Array(left.length);
        const rightInt16 = channels > 1 ? new Int16Array(right.length) : leftInt16;

        for (let i = 0; i < left.length; i++) {
          const sLeft = Math.max(-1, Math.min(1, left[i]));
          leftInt16[i] = sLeft < 0 ? sLeft * 0x8000 : sLeft * 0x7FFF;
          if (channels > 1) {
            const sRight = Math.max(-1, Math.min(1, right[i]));
            rightInt16[i] = sRight < 0 ? sRight * 0x8000 : sRight * 0x7FFF;
          }
        }

        const sampleBlockSize = 1152;
        for (let i = 0; i < left.length; i += sampleBlockSize) {
          const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
          let mp3buf;
          if (channels === 1) {
            mp3buf = mp3encoder.encodeBuffer(leftChunk);
          } else {
            const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
            mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
          }
          if (mp3buf && mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
        }

        const mp3buf = mp3encoder.flush();
        if (mp3buf && mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        return new Blob(mp3Data, { type: 'audio/mp3' });
      } catch (err) {
        console.warn('lamejs encoding error, falling back to WAV:', err);
        return audioBufferToWavBlob(audioBuffer);
      }
    }
    return audioBufferToWavBlob(audioBuffer);
  }

  // Helper: Read Image element from File
  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to load image file: ' + err));
      img.src = URL.createObjectURL(file);
    });
  }

  // Helper: Read Video metadata from File
  function loadVideoFromFile(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => resolve(video);
      video.onerror = (err) => reject(new Error('Failed to load video file: ' + err));
    });
  }

  // Define Handlers Namespace
  window.MTVMediaHandlers = {
    audioBufferToWavBlob,
    loadImageFromFile,
    loadVideoFromFile,

    // ==========================================
    // 15 IMAGE TOOLS IMPLEMENTATIONS
    // ==========================================

    // 1. Image Compressor
    async compressImage(file, qualityPct, maxDim, targetFormat) {
      const img = await loadImageFromFile(file);
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (maxDim > 0 && (w > maxDim || h > maxDim)) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      const mime = targetFormat === 'png' ? 'image/png' : (targetFormat === 'webp' ? 'image/webp' : 'image/jpeg');
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image compression failed'));
        }, mime, qualityPct / 100);
      });
    },

    // 2. Image Resizer
    async resizeImage(file, targetW, targetH, maintainAspect, preset) {
      const img = await loadImageFromFile(file);
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (preset && preset !== 'custom') {
        const factor = parseFloat(preset);
        w = Math.round(w * factor);
        h = Math.round(h * factor);
      } else {
        if (maintainAspect) {
          if (targetW && !targetH) {
            h = Math.round((h * targetW) / w);
            w = targetW;
          } else if (targetH && !targetW) {
            w = Math.round((w * targetH) / h);
            h = targetH;
          } else if (targetW && targetH) {
            w = targetW;
            h = targetH;
          }
        } else {
          w = targetW || w;
          h = targetH || h;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image resize failed'));
        }, file.type || 'image/png', 0.92);
      });
    },

    // 3. Image Watermark Adder
    async addImageWatermark(file, text, position, opacity, fontSizePx, textColor) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = textColor || '#ffffff';
      ctx.font = `bold ${fontSizePx}px sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const metrics = ctx.measureText(text);
      const textW = metrics.width;
      const padding = 24;

      let x = padding;
      let y = padding + fontSizePx / 2;

      switch(position) {
        case 'top-left':
          x = padding;
          y = padding + fontSizePx / 2;
          break;
        case 'top-right':
          x = canvas.width - textW - padding;
          y = padding + fontSizePx / 2;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding - fontSizePx / 2;
          break;
        case 'bottom-right':
          x = canvas.width - textW - padding;
          y = canvas.height - padding - fontSizePx / 2;
          break;
        case 'center':
        default:
          x = (canvas.width - textW) / 2;
          y = canvas.height / 2;
          break;
      }

      ctx.fillText(text, x, y);
      ctx.restore();

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Watermark stamping failed'));
        }, 'image/jpeg', 0.95);
      });
    },

    // 4. Color Inverter
    async invertImageColors(file, mode) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (mode === 'solarize') {
          data[i] = data[i] > 128 ? 255 - data[i] : data[i];
          data[i + 1] = data[i + 1] > 128 ? 255 - data[i + 1] : data[i + 1];
          data[i + 2] = data[i + 2] > 128 ? 255 - data[i + 2] : data[i + 2];
        } else if (mode === 'mono') {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const inverted = 255 - gray;
          data[i] = inverted;
          data[i + 1] = inverted;
          data[i + 2] = inverted;
        } else {
          // Standard Negative
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
      }

      ctx.putImageData(imgData, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Color inversion failed'));
        }, 'image/png');
      });
    },

    // 5. Image Filters & Color Grading
    async applyImageFilters(file, brightness, contrast, saturate, sepia, grayscale, hueRotate) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg)`;
      ctx.drawImage(img, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Photo filter application failed'));
        }, 'image/jpeg', 0.95);
      });
    },

    // 6. Raster to SVG Vectorizer
    async rasterToSvg(file) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      const maxW = 320;
      const scale = Math.min(1, maxW / img.naturalWidth);
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Scan rows into SVG rect paths for pixel/contour vector representation
      let rects = '';
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const a = data[idx + 3];
          if (a > 32) {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${hex}" />`;
          }
        }
      }

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${img.naturalWidth}" height="${img.naturalHeight}" shape-rendering="crispEdges">
  ${rects}
</svg>`;

      return new Blob([svgContent], { type: 'image/svg+xml' });
    },

    // 7. Favicon Generator
    async generateFaviconSuite(file) {
      const img = await loadImageFromFile(file);
      const sizes = [16, 32, 48, 192, 512];
      const blobs = [];

      for (const size of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        const b = await new Promise(r => canvas.toBlob(r, 'image/png'));
        blobs.push({ size, blob: b });
      }

      // Return main 32x32 for primary output
      return blobs;
    },

    // 8. Meme Generator
    async generateMeme(file, topText, bottomText, fontSize) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const size = Math.round((fontSize / 100) * (canvas.width * 0.08));
      ctx.font = `900 ${size}px Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(3, size / 8);
      ctx.lineJoin = 'round';

      if (topText) {
        const text = topText.toUpperCase();
        ctx.textBaseline = 'top';
        ctx.strokeText(text, canvas.width / 2, 20);
        ctx.fillText(text, canvas.width / 2, 20);
      }

      if (bottomText) {
        const text = bottomText.toUpperCase();
        ctx.textBaseline = 'bottom';
        ctx.strokeText(text, canvas.width / 2, canvas.height - 20);
        ctx.fillText(text, canvas.width / 2, canvas.height - 20);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Meme generation failed'));
        }, 'image/jpeg', 0.95);
      });
    },

    // 9. Base64 Image
    async imageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    // 10. Image Blur Redactor
    async blurImage(file, blurRadius) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      ctx.filter = `blur(${blurRadius}px)`;
      ctx.drawImage(img, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image blur failed'));
        }, 'image/jpeg', 0.92);
      });
    },

    // 11. Image Border Frame
    async addImageBorder(file, borderWidth, borderColor, radius) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      const bw = parseInt(borderWidth, 10) || 20;
      canvas.width = img.naturalWidth + bw * 2;
      canvas.height = img.naturalHeight + bw * 2;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = borderColor || '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (radius > 0) {
        ctx.save();
        ctx.beginPath();
        const r = Math.min(radius, img.naturalWidth / 2, img.naturalHeight / 2);
        ctx.roundRect(bw, bw, img.naturalWidth, img.naturalHeight, r);
        ctx.clip();
        ctx.drawImage(img, bw, bw);
        ctx.restore();
      } else {
        ctx.drawImage(img, bw, bw);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Border framing failed'));
        }, 'image/png');
      });
    },

    // 12. Image Splitter
    async splitImage(file, cols, rows) {
      const img = await loadImageFromFile(file);
      const tileW = Math.floor(img.naturalWidth / cols);
      const tileH = Math.floor(img.naturalHeight / rows);
      const tiles = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const canvas = document.createElement('canvas');
          canvas.width = tileW;
          canvas.height = tileH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH, 0, 0, tileW, tileH);
          const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.95));
          tiles.push({ row: r + 1, col: c + 1, index: r * cols + c + 1, blob });
        }
      }

      return tiles;
    },

    // 13. Color Palette Extractor
    async extractColorPalette(file, maxColors = 6) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 100, 100);

      const imgData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts = {};

      for (let i = 0; i < imgData.length; i += 16) {
        const r = Math.round(imgData[i] / 32) * 32;
        const g = Math.round(imgData[i + 1] / 32) * 32;
        const b = Math.round(imgData[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      const palette = sorted.slice(0, maxColors).map(([rgb]) => {
        const [r, g, b] = rgb.split(',').map(Number);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return { r, g, b, hex };
      });

      return palette;
    },

    // 14. Image Pixelator
    async pixelateImage(file, blockSize) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      const size = Math.max(2, parseInt(blockSize, 10) || 16);
      const smallW = Math.max(1, Math.floor(canvas.width / size));
      const smallH = Math.max(1, Math.floor(canvas.height / size));

      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = smallW;
      smallCanvas.height = smallH;
      const smallCtx = smallCanvas.getContext('2d');

      smallCtx.drawImage(img, 0, 0, smallW, smallH);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(smallCanvas, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Pixelation failed'));
        }, 'image/png');
      });
    },

    // 15. Image Rotate & Flip
    async rotateFlipImage(file, rotationDeg, flipH, flipV) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      const rad = (rotationDeg * Math.PI) / 180;
      const is90or270 = rotationDeg === 90 || rotationDeg === 270;

      canvas.width = is90or270 ? img.naturalHeight : img.naturalWidth;
      canvas.height = is90or270 ? img.naturalWidth : img.naturalHeight;
      const ctx = canvas.getContext('2d');

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Rotate/flip failed'));
        }, file.type || 'image/png');
      });
    },

    // ==========================================
    // 10 VIDEO TOOLS IMPLEMENTATIONS
    // ==========================================

    // 16. Video Compressor
    async compressVideo(file, targetRes, progressCb) {
      const video = await loadVideoFromFile(file);
      let targetW = video.videoWidth;
      let targetH = video.videoHeight;

      if (targetRes === '480p') {
        targetW = 854; targetH = 480;
      } else if (targetRes === '720p') {
        targetW = 1280; targetH = 720;
      } else if (targetRes === '360p') {
        targetW = 640; targetH = 360;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm',
        videoBitsPerSecond: 1000000 // 1 Mbps
      });

      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      return new Promise((resolve, reject) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.onerror = reject;

        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const renderFrame = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(renderFrame);
        };
        requestAnimationFrame(renderFrame);
      });
    },

    // 17. Video Reverser
    async reverseVideo(file, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(640, video.videoWidth);
      canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));
      const ctx = canvas.getContext('2d');

      // Capture frames into array (capped at 6 seconds for browser memory safety)
      const maxDuration = Math.min(6, video.duration || 4);
      const fps = 15;
      const totalFrames = Math.floor(maxDuration * fps);
      const frameBitmaps = [];

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / fps);
        await new Promise(r => { video.onseeked = r; });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const bitmap = await createImageBitmap(canvas);
        frameBitmaps.push(bitmap);
        if (progressCb) progressCb(Math.round((i / totalFrames) * 50));
      }

      // Record in reverse order
      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start();

        let frameIdx = frameBitmaps.length - 1;
        const interval = setInterval(() => {
          if (frameIdx < 0) {
            clearInterval(interval);
            recorder.stop();
            return;
          }
          ctx.drawImage(frameBitmaps[frameIdx], 0, 0);
          if (progressCb) progressCb(50 + Math.round(((frameBitmaps.length - frameIdx) / frameBitmaps.length) * 50));
          frameIdx--;
        }, 1000 / fps);
      });
    },

    // 18. Video Watermark Adder
    async addVideoWatermark(file, watermarkText, position, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Watermark overlay
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          const fontSize = Math.max(18, Math.round(canvas.width * 0.035));
          ctx.font = `bold ${fontSize}px sans-serif`;

          const metrics = ctx.measureText(watermarkText);
          let x = 24, y = fontSize + 24;
          if (position === 'top-right') {
            x = canvas.width - metrics.width - 24;
          } else if (position === 'bottom-right') {
            x = canvas.width - metrics.width - 24;
            y = canvas.height - 24;
          } else if (position === 'center') {
            x = (canvas.width - metrics.width) / 2;
            y = canvas.height / 2;
          }
          ctx.fillText(watermarkText, x, y);
          ctx.restore();

          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // 19. Video Muter / Audio Remover
    async muteVideo(file, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Video-only canvas stream (audio stripped)
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // 20. Video Rotator
    async rotateVideo(file, degrees, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      const is90or270 = degrees === 90 || degrees === 270;
      canvas.width = is90or270 ? video.videoHeight : video.videoWidth;
      canvas.height = is90or270 ? video.videoWidth : video.videoHeight;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const rad = (degrees * Math.PI) / 180;
        const duration = Math.min(30, video.duration || 10);

        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rad);
          ctx.drawImage(video, -video.videoWidth / 2, -video.videoHeight / 2);
          ctx.restore();

          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // 21. Video Looper & Boomerang
    async loopVideo(file, loopCount, isBoomerang, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(720, video.videoWidth);
      canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));
      const ctx = canvas.getContext('2d');

      const fps = 18;
      const clipDuration = Math.min(4, video.duration || 3);
      const totalFrames = Math.floor(clipDuration * fps);
      const frames = [];

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / fps);
        await new Promise(r => { video.onseeked = r; });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(await createImageBitmap(canvas));
        if (progressCb) progressCb(Math.round((i / totalFrames) * 40));
      }

      // Compile loop sequence
      let playSequence = [];
      const count = parseInt(loopCount, 10) || 2;
      for (let c = 0; c < count; c++) {
        playSequence.push(...frames);
        if (isBoomerang) {
          playSequence.push(...frames.slice().reverse());
        }
      }

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start();

        let idx = 0;
        const interval = setInterval(() => {
          if (idx >= playSequence.length) {
            clearInterval(interval);
            recorder.stop();
            return;
          }
          ctx.drawImage(playSequence[idx], 0, 0);
          if (progressCb) progressCb(40 + Math.round((idx / playSequence.length) * 60));
          idx++;
        }, 1000 / fps);
      });
    },

    // 22. Video Frame Rate (FPS) Changer
    async changeVideoFps(file, targetFps, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(targetFps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // 23. Video Frame Snapshot Extractor
    async extractVideoSnapshot(file, timestamp) {
      const video = await loadVideoFromFile(file);
      video.currentTime = Math.min(timestamp, video.duration || 0);
      await new Promise(r => { video.onseeked = r; });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Frame snapshot extraction failed'));
        }, 'image/png');
      });
    },

    // 24. Video Aspect Ratio Resizer
    async resizeVideoAspectRatio(file, targetRatio, progressCb) {
      const video = await loadVideoFromFile(file);
      let targetW = 720;
      let targetH = 1280; // Default 9:16 vertical

      if (targetRatio === '1:1') {
        targetW = 720; targetH = 720;
      } else if (targetRatio === '16:9') {
        targetW = 1280; targetH = 720;
      } else if (targetRatio === '4:5') {
        targetW = 720; targetH = 900;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          // Fill background (blurred video)
          ctx.save();
          ctx.filter = 'blur(16px) brightness(0.7)';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Centered letterbox
          const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
          const drawW = video.videoWidth * scale;
          const drawH = video.videoHeight * scale;
          const x = (canvas.width - drawW) / 2;
          const y = (canvas.height - drawH) / 2;
          ctx.drawImage(video, x, y, drawW, drawH);

          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // 25. Video Color Filters & Grading
    async applyVideoColorFilter(file, filterPreset, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      let cssFilter = 'none';
      if (filterPreset === 'noir') cssFilter = 'grayscale(100%) contrast(150%)';
      else if (filterPreset === 'vintage') cssFilter = 'sepia(70%) contrast(110%) brightness(90%)';
      else if (filterPreset === 'cyberpunk') cssFilter = 'hue-rotate(280deg) saturate(180%) contrast(120%)';
      else if (filterPreset === 'teal') cssFilter = 'contrast(120%) hue-rotate(170deg) saturate(130%)';
      else if (filterPreset === 'vibrant') cssFilter = 'saturate(160%) contrast(115%)';

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      return new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        recorder.start(100);
        video.currentTime = 0;
        video.play();

        const duration = Math.min(30, video.duration || 10);
        const render = () => {
          if (video.currentTime >= duration || video.ended) {
            recorder.stop();
            video.pause();
            return;
          }
          ctx.filter = cssFilter;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.round((video.currentTime / duration) * 100));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // ==========================================
    // 10 AUDIO TOOLS IMPLEMENTATIONS
    // ==========================================

    // 26. Audio Compressor
    async compressAudio(file, targetBitrate) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Downsample to 22.05kHz if lower bitrate
      const targetSampleRate = targetBitrate <= 96 ? 22050 : 44100;
      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        Math.ceil(decodedBuffer.duration * targetSampleRate),
        targetSampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      return audioBufferToMp3Blob(renderedBuffer, targetBitrate);
    },

    // 27. Audio Merger & Joiner
    async joinAudioFiles(fileList) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const buffers = [];

      for (const file of fileList) {
        const arr = await file.arrayBuffer();
        const buf = await audioCtx.decodeAudioData(arr);
        buffers.push(buf);
      }

      const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
      const numChannels = Math.max(...buffers.map(b => b.numberOfChannels));
      const sampleRate = buffers[0].sampleRate;

      const mergedBuffer = audioCtx.createBuffer(numChannels, totalLength, sampleRate);

      for (let ch = 0; ch < numChannels; ch++) {
        const channelData = mergedBuffer.getChannelData(ch);
        let offset = 0;
        for (const buf of buffers) {
          const srcData = buf.numberOfChannels > ch ? buf.getChannelData(ch) : buf.getChannelData(0);
          channelData.set(srcData, offset);
          offset += buf.length;
        }
      }

      return audioBufferToWavBlob(mergedBuffer);
    },

    // 28. Audio Normalizer & Booster
    async normalizeAudio(file, gainMultiplier = 1.5) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        decodedBuffer.length,
        decodedBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      // Dynamic Gain + Soft Limiter
      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = gainMultiplier;

      const compressor = offlineCtx.createDynamicsCompressor();
      compressor.threshold.value = -1;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(offlineCtx.destination);
      source.start(0);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToWavBlob(rendered);
    },

    // 29. Audio Reverser
    async reverseAudio(file) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const numChannels = decodedBuffer.numberOfChannels;
      const reversedBuffer = audioCtx.createBuffer(numChannels, decodedBuffer.length, decodedBuffer.sampleRate);

      for (let ch = 0; ch < numChannels; ch++) {
        const src = decodedBuffer.getChannelData(ch);
        const dst = reversedBuffer.getChannelData(ch);
        for (let i = 0; i < src.length; i++) {
          dst[i] = src[src.length - 1 - i];
        }
      }

      return audioBufferToWavBlob(reversedBuffer);
    },

    // 30. Audio Pitch Shifter
    async shiftAudioPitch(file, semitones) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const pitchFactor = Math.pow(2, semitones / 12);
      const newLength = Math.round(decodedBuffer.length / pitchFactor);

      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        newLength,
        decodedBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;
      source.playbackRate.value = pitchFactor;
      source.connect(offlineCtx.destination);
      source.start(0);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToWavBlob(rendered);
    },

    // 31. Bass Booster & 3-Band Equalizer
    async bassBoostAudio(file, bassGainDb, midGainDb, trebleGainDb) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        decodedBuffer.length,
        decodedBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      // Bass Lowshelf
      const bassFilter = offlineCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 120;
      bassFilter.gain.value = bassGainDb || 10;

      // Mid Peaking
      const midFilter = offlineCtx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.gain.value = midGainDb || 0;

      // Treble Highshelf
      const trebleFilter = offlineCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 6000;
      trebleFilter.gain.value = trebleGainDb || 0;

      source.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(offlineCtx.destination);
      source.start(0);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToWavBlob(rendered);
    },

    // 32. Audio BPM & Tempo Detector
    async detectAudioBpm(file) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Low-pass filter to isolate kick/bass transients
      const data = decodedBuffer.getChannelData(0);
      const sampleRate = decodedBuffer.sampleRate;
      
      // Calculate energy peaks
      const step = Math.floor(sampleRate / 100);
      const peaks = [];
      for (let i = 0; i < data.length; i += step) {
        let max = 0;
        for (let j = 0; j < step && (i + j) < data.length; j++) {
          const val = Math.abs(data[i + j]);
          if (val > max) max = val;
        }
        peaks.push(max);
      }

      // Autocorrelation over BPM range 70 - 180
      const minInterval = Math.floor((60 / 180) * 100);
      const maxInterval = Math.floor((60 / 70) * 100);
      let bestInterval = minInterval;
      let maxCorr = 0;

      for (let interval = minInterval; interval <= maxInterval; interval++) {
        let corr = 0;
        for (let i = 0; i < peaks.length - interval; i++) {
          corr += peaks[i] * peaks[i + interval];
        }
        if (corr > maxCorr) {
          maxCorr = corr;
          bestInterval = interval;
        }
      }

      const bpm = Math.max(60, Math.min(200, Math.round((60 * 100) / bestInterval)));
      return { bpm, confidence: 'Detected Rhythm' };
    },

    // 33. Audio Stereo Panner & 8D Audio
    async applyStereo8D(file, rotationSpeedHz = 0.25) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        2, // Stereo output
        decodedBuffer.length,
        decodedBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      const panner = offlineCtx.createStereoPanner();
      // Animate pan across time
      const totalSeconds = decodedBuffer.duration;
      const steps = Math.floor(totalSeconds * 20);
      for (let i = 0; i < steps; i++) {
        const t = (i / steps) * totalSeconds;
        const panValue = Math.sin(2 * Math.PI * rotationSpeedHz * t);
        panner.pan.setValueAtTime(panValue, t);
      }

      source.connect(panner);
      panner.connect(offlineCtx.destination);
      source.start(0);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToWavBlob(rendered);
    },

    // 34. Ambient Noise Generator
    generateAmbientNoise(type = 'white', durationSeconds = 30) {
      const sampleRate = 44100;
      const totalSamples = sampleRate * durationSeconds;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const buffer = audioCtx.createBuffer(2, totalSamples, sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        let lastOut = 0;

        for (let i = 0; i < totalSamples; i++) {
          const white = Math.random() * 2 - 1;

          if (type === 'pink') {
            // Paul Kellet's filtered pink noise algorithm
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
          } else if (type === 'brown') {
            // Brownian / Red 1/f^2 noise
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.5;
          } else {
            // Pure White Noise
            data[i] = white * 0.25;
          }
        }
      }

      return audioBufferToWavBlob(buffer);
    },

    // 35. Ringtone Maker
    async createRingtone(file, startTime = 0, duration = 30) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const sampleRate = decodedBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const lengthSamples = Math.min(Math.floor(duration * sampleRate), decodedBuffer.length - startSample);

      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        lengthSamples,
        sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      // Fade-in (1s) and Fade-out (2s)
      const gainNode = offlineCtx.createGain();
      const clipDuration = lengthSamples / sampleRate;

      gainNode.gain.setValueAtTime(0, 0);
      gainNode.gain.linearRampToValueAtTime(1, Math.min(1.0, clipDuration / 2));
      gainNode.gain.setValueAtTime(1, Math.max(0, clipDuration - 2.0));
      gainNode.gain.linearRampToValueAtTime(0, clipDuration);

      source.connect(gainNode);
      gainNode.connect(offlineCtx.destination);
      source.start(0, startTime, duration);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToWavBlob(rendered);
    },

    // ==========================================
    // 10 PDF & DOCUMENT TOOLS IMPLEMENTATIONS
    // ==========================================

    // 36. PDF Merger
    async mergePdfFiles(fileList) {
      if (window.PDFLib) {
        const mergedPdf = await window.PDFLib.PDFDocument.create();
        for (const file of fileList) {
          const bytes = await file.arrayBuffer();
          const doc = await window.PDFLib.PDFDocument.load(bytes);
          const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
          pages.forEach(p => mergedPdf.addPage(p));
        }
        const pdfBytes = await mergedPdf.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library is initializing, please try again.');
    },

    // 37. PDF Splitter
    async splitPdfPages(file, pageRangesStr) {
      if (window.PDFLib) {
        const bytes = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const totalPages = doc.getPageCount();

        // Parse range like "1-3, 5"
        const selectedIndices = [];
        const parts = pageRangesStr.split(',').map(s => s.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n, 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
                if (!selectedIndices.includes(p - 1)) selectedIndices.push(p - 1);
              }
            }
          } else {
            const p = parseInt(part, 10);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
              if (!selectedIndices.includes(p - 1)) selectedIndices.push(p - 1);
            }
          }
        }

        if (selectedIndices.length === 0) {
          throw new Error('No valid pages specified in range.');
        }

        const newDoc = await window.PDFLib.PDFDocument.create();
        const copiedPages = await newDoc.copyPages(doc, selectedIndices);
        copiedPages.forEach(page => newDoc.addPage(page));
        const newBytes = await newDoc.save();
        return new Blob([newBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library not ready');
    },

    // 38. PDF Page Rotator
    async rotatePdfPages(file, degrees) {
      if (window.PDFLib) {
        const bytes = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const pages = doc.getPages();
        pages.forEach(p => {
          const current = p.getRotation().angle;
          p.setRotation(window.PDFLib.degrees((current + degrees) % 360));
        });
        const pdfBytes = await doc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library not ready');
    },

    // 39. PDF Watermark Adder
    async addPdfWatermark(file, watermarkText, opacity = 0.3) {
      if (window.PDFLib) {
        const bytes = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const pages = doc.getPages();
        const helvetica = await doc.embedFont(window.PDFLib.StandardFonts.HelveticaBold);

        pages.forEach(page => {
          const { width, height } = page.getSize();
          const textSize = Math.round(width * 0.08);
          page.drawText(watermarkText, {
            x: width * 0.2,
            y: height * 0.4,
            size: textSize,
            font: helvetica,
            color: window.PDFLib.rgb(0.7, 0.7, 0.7),
            opacity: parseFloat(opacity) || 0.3,
            rotate: window.PDFLib.degrees(45)
          });
        });

        const pdfBytes = await doc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library not ready');
    },

    // 40. PDF Page Numberer
    async numberPdfPages(file, formatStr = 'Page {n} of {total}', position = 'bottom-center') {
      if (window.PDFLib) {
        const bytes = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const pages = doc.getPages();
        const total = pages.length;
        const font = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);

        pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          const text = formatStr.replace('{n}', (idx + 1).toString()).replace('{total}', total.toString());
          const textW = font.widthOfTextAtSize(text, 10);

          let x = (width - textW) / 2;
          let y = 25;
          if (position === 'bottom-right') x = width - textW - 30;
          else if (position === 'top-right') { x = width - textW - 30; y = height - 25; }

          page.drawText(text, {
            x, y,
            size: 10,
            font,
            color: window.PDFLib.rgb(0.3, 0.3, 0.3)
          });
        });

        const pdfBytes = await doc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library not ready');
    },

    // 41. PDF Compressor (Re-render at optimized DPI)
    async compressPdf(file, qualityPct = 70) {
      if (!window.pdfjsLib || !window.jspdf) {
        throw new Error('PDF rendering engines initializing');
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const { jsPDF } = window.jspdf;
      const outDoc = new jsPDF({ unit: 'pt', compress: true });

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const imgData = canvas.toDataURL('image/jpeg', qualityPct / 100);

        if (i > 1) outDoc.addPage([viewport.width, viewport.height]);
        outDoc.setPage(i);
        outDoc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
      }

      return outDoc.output('blob');
    },

    // 42. Text to PDF Generator
    generateTextToPdf(text, title = 'Document') {
      if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxTextWidth = pageWidth - margin * 2;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, margin, margin + 20);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(text, maxTextWidth);

        let y = margin + 50;
        const lineHeight = 16;
        const pageHeight = doc.internal.pageSize.getHeight();

        for (let i = 0; i < splitText.length; i++) {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin + 20;
          }
          doc.text(splitText[i], margin, y);
          y += lineHeight;
        }

        return doc.output('blob');
      }
      throw new Error('PDF generator library not loaded');
    },

    // 43. PDF Security & Metadata Inspector
    async inspectPdfSecurity(file) {
      const arrayBuffer = await file.arrayBuffer();
      let metaInfo = {};

      if (window.pdfjsLib) {
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const meta = await pdf.getMetadata().catch(() => ({}));
        metaInfo = {
          fileName: file.name,
          fileSizeBytes: file.size,
          pages: pdf.numPages,
          pageCount: pdf.numPages,
          title: meta.info?.Title || 'Untitled',
          author: meta.info?.Author || 'Not specified',
          creator: meta.info?.Creator || 'Unknown application',
          producer: meta.info?.Producer || 'Unknown engine',
          creationDate: meta.info?.CreationDate || 'Unknown date',
          encrypted: pdf.isEncrypted || false,
          isEncrypted: pdf.isEncrypted || false
        };
      } else {
        metaInfo = {
          fileName: file.name,
          fileSizeBytes: file.size,
          pages: 1,
          pageCount: 1,
          title: file.name,
          author: 'Not specified',
          creator: 'Unknown application',
          producer: 'PDF.js Reader',
          creationDate: new Date(file.lastModified || Date.now()).toLocaleDateString(),
          encrypted: false,
          isEncrypted: false
        };
      }

      return metaInfo;
    },

    // 44. PDF Page Remover
    async deletePdfPages(file, pagesToDeleteIndices) {
      if (window.PDFLib) {
        const bytes = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();

        const keepIndices = [];
        for (let i = 0; i < total; i++) {
          if (!pagesToDeleteIndices.includes(i)) {
            keepIndices.push(i);
          }
        }

        if (keepIndices.length === 0) {
          throw new Error('Cannot delete all pages of the document.');
        }

        const newDoc = await window.PDFLib.PDFDocument.create();
        const copied = await newDoc.copyPages(doc, keepIndices);
        copied.forEach(p => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      }
      throw new Error('PDF library not ready');
    },

    // 45. Markdown to PDF Exporter
    generateMarkdownToPdf(markdownText) {
      if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxTextWidth = pageWidth - margin * 2;
        const pageHeight = doc.internal.pageSize.getHeight();

        const lines = markdownText.split('\n');
        let y = margin + 20;

        function checkPageBreak(neededHeight) {
          if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            y = margin + 20;
          }
        }

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            y += 10;
            continue;
          }

          if (trimmed.startsWith('# ')) {
            checkPageBreak(28);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(18);
            doc.text(trimmed.substring(2), margin, y);
            y += 24;
          } else if (trimmed.startsWith('## ')) {
            checkPageBreak(22);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(trimmed.substring(3), margin, y);
            y += 20;
          } else if (trimmed.startsWith('### ')) {
            checkPageBreak(18);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(trimmed.substring(4), margin, y);
            y += 16;
          } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            checkPageBreak(16);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`•  ${trimmed.substring(2)}`, margin + 10, y);
            y += 14;
          } else {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            const wrapped = doc.splitTextToSize(trimmed, maxTextWidth);
            checkPageBreak(wrapped.length * 14);
            doc.text(wrapped, margin, y);
            y += wrapped.length * 14;
          }
        }

        return doc.output('blob');
      }
      throw new Error('PDF generator not ready');
    }

  };

})();
