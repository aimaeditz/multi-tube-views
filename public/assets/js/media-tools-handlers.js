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
      if (!file) return reject(new Error('No file provided to loadImageFromFile'));
      const blob = file instanceof Blob ? file : (file && file.blob instanceof Blob ? file.blob : new Blob([file]));
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        try { URL.revokeObjectURL(objectUrl); } catch (_) {}
        resolve(img);
      };
      img.onerror = (err) => {
        try { URL.revokeObjectURL(objectUrl); } catch (_) {}
        reject(new Error('Failed to load image file: ' + err));
      };
      img.src = objectUrl;
    });
  }

  // Dynamic Library Loader Cache
  const getAssetBase = () => {
    if (typeof window === 'undefined') return '/assets/js/';
    const path = window.location.pathname || '';
    if (path.includes('/media-converter-tools/') || path.includes('/browser-utilities/') || path.includes('/ai-tools/')) {
      return '../assets/js/';
    }
    return '/assets/js/';
  };

  const loadedScripts = new Map();
  function loadScriptAsync(src, checkFn, fallbackSrc) {
    if (checkFn && checkFn()) return Promise.resolve();
    if (loadedScripts.has(src)) return loadedScripts.get(src);
    const p = new Promise((resolve, reject) => {
      const tryLoad = (targetSrc, nextFallback) => {
        const s = document.createElement('script');
        s.src = targetSrc;
        s.async = true;
        s.onload = () => {
          setTimeout(() => {
            if (checkFn && !checkFn()) {
              if (nextFallback) {
                tryLoad(nextFallback, null);
              } else {
                reject(new Error('Failed to initialize: ' + targetSrc));
              }
            } else {
              resolve();
            }
          }, 15);
        };
        s.onerror = () => {
          if (nextFallback) {
            tryLoad(nextFallback, null);
          } else {
            reject(new Error('Failed to load library: ' + targetSrc));
          }
        };
        document.head.appendChild(s);
      };
      tryLoad(src, fallbackSrc);
    });
    loadedScripts.set(src, p);
    return p;
  }

  const ensureQrCode = () => loadScriptAsync(getAssetBase() + 'qrcode.min.js', () => window.QRCode, 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
  const ensurePdfJs = async () => {
    await loadScriptAsync(getAssetBase() + 'pdf.min.js', () => window.pdfjsLib, 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    ensurePdfJsWorker();
  };
  const ensurePdfLib = () => loadScriptAsync(getAssetBase() + 'pdf-lib.min.js', () => window.PDFLib && window.PDFLib.PDFDocument, 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
  const ensureJsPdf = async () => {
    await loadScriptAsync(getAssetBase() + 'jspdf.umd.min.js', () => (window.jspdf && window.jspdf.jsPDF) || window.jsPDF, 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    if (window.jspdf && window.jspdf.jsPDF && !window.jsPDF) {
      window.jsPDF = window.jspdf.jsPDF;
    }
  };
  const ensureJsZip = () => loadScriptAsync(getAssetBase() + 'jszip.min.js', () => window.JSZip, 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  const ensureHeic2Any = () => loadScriptAsync('https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js', () => typeof window.heic2any === 'function');
  const ensureGifshot = () => loadScriptAsync('https://cdn.jsdelivr.net/npm/gifshot@0.4.5/dist/gifshot.min.js', () => window.gifshot);
  const ensureLameJs = () => loadScriptAsync(getAssetBase() + 'lame.min.js', () => window.lamejs && window.lamejs.Mp3Encoder, 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js');

  // Helper: Guarantee PDF.js workerSrc points to the local same-origin worker
  function ensurePdfJsWorker() {
    if (window.pdfjsLib && (!window.pdfjsLib.GlobalWorkerOptions || !window.pdfjsLib.GlobalWorkerOptions.workerSrc)) {
      if (!window.pdfjsLib.GlobalWorkerOptions) window.pdfjsLib.GlobalWorkerOptions = {};
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = getAssetBase() + 'pdf.worker.min.js';
    }
  }

  // Helper: Read Video metadata and frames reliably from File
  function loadVideoFromFile(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      video.style.width = '160px';
      video.style.height = '90px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'auto';

      document.body.appendChild(video);

      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      let resolved = false;
      const onReady = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(video);
        }
      };

      const onError = (e) => {
        if (!resolved) {
          resolved = true;
          cleanup();
          if (video.parentNode) video.parentNode.removeChild(video);
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load video: ' + (e?.message || 'Unsupported format')));
        }
      };

      const cleanup = () => {
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onError);
      };

      video.addEventListener('loadeddata', onReady);
      video.addEventListener('loadedmetadata', onReady);
      video.addEventListener('canplay', onReady);
      video.addEventListener('error', onError);

      // Timeout safety fallback
      setTimeout(() => {
        if (!resolved && (video.readyState >= 1 || video.duration > 0)) {
          onReady();
        }
      }, 3000);
    });
  }

  // Helper: Seek video with guaranteed resolution
  function seekVideo(video, time) {
    return new Promise(resolve => {
      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          video.removeEventListener('seeked', finish);
          resolve();
        }
      };
      video.addEventListener('seeked', finish);
      const target = Math.max(0, Math.min(time, (video.duration || time) - 0.05));
      if (Math.abs(video.currentTime - target) < 0.01) {
        setTimeout(finish, 20);
      } else {
        video.currentTime = target;
        setTimeout(finish, 800); // 800ms fallback so frame operations never hang
      }
    });
  }

  // Define Handlers Namespace
  window.MTVMediaHandlers = {
    audioBufferToWavBlob,
    audioBufferToMp3Blob,
    ensurePdfJsWorker,
    loadImageFromFile,
    loadVideoFromFile,
    seekVideo,
    loadScriptAsync,
    ensureQrCode,
    ensurePdfJs,
    ensurePdfLib,
    ensureJsPdf,
    ensureJsZip,
    ensureHeic2Any,
    ensureGifshot,
    ensureLameJs,

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
      const maxDim = 240;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Group consecutive horizontal pixels with identical color into spans for 95% SVG optimization
      const rectPaths = [];
      const quant = (c) => Math.round(c / 16) * 16;

      for (let y = 0; y < canvas.height; y++) {
        let x = 0;
        while (x < canvas.width) {
          const idx = (y * canvas.width + x) * 4;
          const a = data[idx + 3];
          if (a < 32) {
            x++;
            continue;
          }
          const r = quant(data[idx]);
          const g = quant(data[idx + 1]);
          const b = quant(data[idx + 2]);

          let spanW = 1;
          while (x + spanW < canvas.width) {
            const nextIdx = (y * canvas.width + (x + spanW)) * 4;
            if (data[nextIdx + 3] < 32) break;
            if (quant(data[nextIdx]) !== r || quant(data[nextIdx + 1]) !== g || quant(data[nextIdx + 2]) !== b) break;
            spanW++;
          }

          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          rectPaths.push(`<rect x="${x}" y="${y}" width="${spanW}" height="1" fill="${hex}" />`);
          x += spanW;
        }
      }

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${img.naturalWidth}" height="${img.naturalHeight}" shape-rendering="crispEdges">
  ${rectPaths.join('\n  ')}
</svg>`;

      return new Blob([svgContent], { type: 'image/svg+xml' });
    },

    // 7. Favicon Generator
    async generateFaviconSuite(file) {
      const img = await loadImageFromFile(file);
      const sizes = [16, 32, 48, 180, 192, 512];

      if (typeof window.JSZip !== 'undefined') {
        const zip = new window.JSZip();
        for (const size of sizes) {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size, size);

          const b = await new Promise(r => canvas.toBlob(r, 'image/png'));
          const arrayBuf = await b.arrayBuffer();
          const filename = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
          zip.file(filename, arrayBuf);
          if (size === 32) {
            zip.file('favicon.ico', arrayBuf);
          }
        }

        const manifestJson = JSON.stringify({
          name: "My App",
          short_name: "App",
          icons: [
            { src: "favicon-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "favicon-512x512.png", sizes: "512x512", type: "image/png" }
          ],
          theme_color: "#1e1b4b",
          background_color: "#0f172a",
          display: "standalone"
        }, null, 2);
        zip.file('manifest.json', manifestJson);

        const htmlSnippet = `<!-- Add to your HTML <head> -->\n<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">\n<link rel="manifest" href="manifest.json">`;
        zip.file('html_instructions.txt', htmlSnippet);

        return await zip.generateAsync({ type: 'blob' });
      }

      // Fallback single 32x32 PNG blob
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 32, 32);
      return new Promise(r => canvas.toBlob(r, 'image/png'));
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
        reader.onload = () => {
          const dataUri = reader.result;
          const base64 = (dataUri && typeof dataUri === 'string') ? dataUri.split(',')[1] || '' : '';
          resolve({ dataUri, base64 });
        };
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

      if (typeof window.JSZip !== 'undefined') {
        const zip = new window.JSZip();
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement('canvas');
            canvas.width = tileW;
            canvas.height = tileH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH, 0, 0, tileW, tileH);
            const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.95));
            const arr = await blob.arrayBuffer();
            const tileIdx = r * cols + c + 1;
            zip.file(`tile_r${r + 1}_c${c + 1}_#${tileIdx}.jpg`, arr);
          }
        }
        return await zip.generateAsync({ type: 'blob' });
      }

      // Fallback first tile
      const canvas = document.createElement('canvas');
      canvas.width = tileW;
      canvas.height = tileH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, tileW, tileH, 0, 0, tileW, tileH);
      return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.95));
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

      const totalSamples = imgData.length / 16;
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      const palette = sorted.slice(0, maxColors).map(([rgb, count]) => {
        const [r, g, b] = rgb.split(',').map(Number);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const pct = Math.max(1, Math.round((count / totalSamples) * 100));
        return { r, g, b, hex, isLight: lum > 140, pct };
      });

      // Render high-res color swatch palette image
      const swatchCanvas = document.createElement('canvas');
      const cardW = 600;
      const cardH = 220;
      swatchCanvas.width = cardW;
      swatchCanvas.height = cardH;
      const sCtx = swatchCanvas.getContext('2d');
      sCtx.fillStyle = '#0f172a';
      sCtx.fillRect(0, 0, cardW, cardH);

      const numSwatches = palette.length || 1;
      const swatchW = cardW / numSwatches;
      palette.forEach((c, idx) => {
        sCtx.fillStyle = c.hex;
        sCtx.fillRect(idx * swatchW, 0, swatchW, cardH - 60);

        sCtx.fillStyle = '#ffffff';
        sCtx.font = 'bold 13px monospace';
        sCtx.textAlign = 'center';
        sCtx.fillText(c.hex.toUpperCase(), idx * swatchW + swatchW / 2, cardH - 34);

        sCtx.fillStyle = '#94a3b8';
        sCtx.font = '11px sans-serif';
        sCtx.fillText(`${c.pct}% Dominance`, idx * swatchW + swatchW / 2, cardH - 16);
      });

      const blob = await new Promise(r => swatchCanvas.toBlob(r, 'image/png'));
      return { palette, blob };
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
      let targetW = video.videoWidth || 640;
      let targetH = video.videoHeight || 360;

      if (targetRes === '480p') {
        targetW = 854; targetH = 480;
      } else if (targetRes === '720p') {
        targetW = 1280; targetH = 720;
      } else if (targetRes === '360p') {
        targetW = 640; targetH = 360;
      } else {
        targetW = Math.round(targetW * 0.8);
        targetH = Math.round(targetH * 0.8);
      }
      if (targetW % 2 !== 0) targetW--;
      if (targetH % 2 !== 0) targetH--;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(24);
      const mimeTypes = ['video/webm;codecs=vp8', 'video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
      const chosenMime = mimeTypes.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || 'video/webm';
      const bps = targetRes === '360p' ? 500000 : (targetRes === '480p' ? 900000 : (targetRes === '720p' ? 1600000 : 1000000));
      const recorder = new MediaRecorder(stream, {
        mimeType: chosenMime,
        videoBitsPerSecond: bps
      });

      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

      return new Promise((resolve, reject) => {
        let isDone = false;
        const cleanup = () => {
          if (!isDone) {
            isDone = true;
            if (video.parentNode) video.parentNode.removeChild(video);
            URL.revokeObjectURL(video.src);
          }
        };

        recorder.onstop = () => {
          cleanup();
          resolve(new Blob(chunks, { type: chosenMime }));
        };
        recorder.onerror = err => {
          cleanup();
          reject(err);
        };

        recorder.start(100);
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(e => console.warn('Video play warning:', e));

        const duration = Math.min(60, video.duration || 10);
        const renderFrame = () => {
          if (isDone) return;
          if (video.currentTime >= duration || video.ended) {
            video.pause();
            if (recorder.state === 'recording') recorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.min(99, Math.round((video.currentTime / duration) * 100)));
          requestAnimationFrame(renderFrame);
        };
        requestAnimationFrame(renderFrame);
      });
    },

    // 17. Video Reverser
    async reverseVideo(file, progressCb) {
      const video = await loadVideoFromFile(file);
      const canvas = document.createElement('canvas');
      let targetW = Math.min(640, video.videoWidth || 640);
      let targetH = Math.round(targetW * ((video.videoHeight || 360) / (video.videoWidth || 640)));
      if (targetW % 2 !== 0) targetW--;
      if (targetH % 2 !== 0) targetH--;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      // Capture frames into array (capped at 8 seconds for browser memory safety)
      const maxDuration = Math.min(8, video.duration || 4);
      const fps = 15;
      const totalFrames = Math.floor(maxDuration * fps);
      const frameBitmaps = [];

      for (let i = 0; i < totalFrames; i++) {
        const time = (i / fps);
        await seekVideo(video, time);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const bitmap = await createImageBitmap(canvas);
        frameBitmaps.push(bitmap);
        if (progressCb) progressCb(Math.round((i / totalFrames) * 50));
      }

      // Record in reverse order
      const stream = canvas.captureStream(fps);
      const mimeTypes = ['video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
      const chosenMime = mimeTypes.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType: chosenMime });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

      return new Promise((resolve, reject) => {
        let isDone = false;
        const cleanup = () => {
          if (!isDone) {
            isDone = true;
            if (video.parentNode) video.parentNode.removeChild(video);
            URL.revokeObjectURL(video.src);
            frameBitmaps.forEach(b => b.close && b.close());
          }
        };

        recorder.onstop = () => {
          cleanup();
          resolve(new Blob(chunks, { type: chosenMime }));
        };
        recorder.onerror = err => {
          cleanup();
          reject(err);
        };

        recorder.start();

        let frameIdx = frameBitmaps.length - 1;
        const interval = setInterval(() => {
          if (frameIdx < 0) {
            clearInterval(interval);
            if (recorder.state === 'recording') recorder.stop();
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
      let targetW = Math.min(640, video.videoWidth || 640);
      let targetH = Math.round(targetW * ((video.videoHeight || 360) / (video.videoWidth || 640)));
      if (targetW % 2 !== 0) targetW--;
      if (targetH % 2 !== 0) targetH--;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      const fps = 15;
      const clipDuration = Math.min(5, video.duration || 3);
      const totalFrames = Math.floor(clipDuration * fps);
      const frames = [];

      for (let i = 0; i < totalFrames; i++) {
        const time = (i / fps);
        await seekVideo(video, time);
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
      const mimeTypes = ['video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
      const chosenMime = mimeTypes.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType: chosenMime });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

      return new Promise((resolve, reject) => {
        let isDone = false;
        const cleanup = () => {
          if (!isDone) {
            isDone = true;
            if (video.parentNode) video.parentNode.removeChild(video);
            URL.revokeObjectURL(video.src);
            frames.forEach(b => b.close && b.close());
          }
        };

        recorder.onstop = () => {
          cleanup();
          resolve(new Blob(chunks, { type: chosenMime }));
        };
        recorder.onerror = err => {
          cleanup();
          reject(err);
        };

        recorder.start();

        let idx = 0;
        const interval = setInterval(() => {
          if (idx >= playSequence.length) {
            clearInterval(interval);
            if (recorder.state === 'recording') recorder.stop();
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
      const targetTime = Math.min(Math.max(0, timestamp), (video.duration || timestamp) - 0.05);
      await seekVideo(video, targetTime);

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (video.parentNode) video.parentNode.removeChild(video);
      URL.revokeObjectURL(video.src);

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
      let targetW = video.videoWidth || 640;
      let targetH = video.videoHeight || 360;
      if (targetW % 2 !== 0) targetW--;
      if (targetH % 2 !== 0) targetH--;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      let cssFilter = 'none';
      if (filterPreset === 'noir') cssFilter = 'grayscale(100%) contrast(150%)';
      else if (filterPreset === 'vintage') cssFilter = 'sepia(70%) contrast(110%) brightness(90%)';
      else if (filterPreset === 'cyberpunk') cssFilter = 'hue-rotate(280deg) saturate(180%) contrast(120%)';
      else if (filterPreset === 'teal') cssFilter = 'contrast(120%) hue-rotate(170deg) saturate(130%)';
      else if (filterPreset === 'vibrant') cssFilter = 'saturate(160%) contrast(115%)';

      const stream = canvas.captureStream(24);
      const mimeTypes = ['video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
      const chosenMime = mimeTypes.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType: chosenMime });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

      return new Promise((resolve, reject) => {
        let isDone = false;
        const cleanup = () => {
          if (!isDone) {
            isDone = true;
            if (video.parentNode) video.parentNode.removeChild(video);
            URL.revokeObjectURL(video.src);
          }
        };

        recorder.onstop = () => {
          cleanup();
          resolve(new Blob(chunks, { type: chosenMime }));
        };
        recorder.onerror = err => {
          cleanup();
          reject(err);
        };

        recorder.start(100);
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(e => console.warn('Video play warning:', e));

        const duration = Math.min(60, video.duration || 10);
        const render = () => {
          if (isDone) return;
          if (video.currentTime >= duration || video.ended) {
            video.pause();
            if (recorder.state === 'recording') recorder.stop();
            return;
          }
          ctx.filter = cssFilter;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (progressCb) progressCb(Math.min(99, Math.round((video.currentTime / duration) * 100)));
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    },

    // ==========================================
    // 10 AUDIO TOOLS IMPLEMENTATIONS
    // ==========================================

    // 26. Audio Compressor
    async compressAudio(file, targetBitrate = 128) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const channels = Math.min(2, Math.max(1, decodedBuffer.numberOfChannels));
      const targetSampleRate = targetBitrate <= 96 ? 22050 : 44100;
      const offlineCtx = new OfflineAudioContext(
        channels,
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
    async normalizeAudio(file, gainMultiplier = 1.0) {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Find true peak across all channels
      let maxPeak = 0.001;
      const numChannels = decodedBuffer.numberOfChannels;
      for (let ch = 0; ch < numChannels; ch++) {
        const d = decodedBuffer.getChannelData(ch);
        for (let i = 0; i < d.length; i += 10) {
          const v = Math.abs(d[i]);
          if (v > maxPeak) maxPeak = v;
        }
      }

      // Target peak: -0.5 dB (~0.94)
      const normRatio = 0.94 / maxPeak;
      const finalGain = Math.min(6.0, normRatio * (gainMultiplier || 1.0));

      const offlineCtx = new OfflineAudioContext(
        numChannels,
        decodedBuffer.length,
        decodedBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = finalGain;

      const compressor = offlineCtx.createDynamicsCompressor();
      compressor.threshold.value = -0.5;
      compressor.knee.value = 40;
      compressor.ratio.value = 16;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.2;

      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(offlineCtx.destination);
      source.start(0);

      const rendered = await offlineCtx.startRendering();
      return audioBufferToMp3Blob(rendered, 192);
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

      const data = decodedBuffer.getChannelData(0);
      const sampleRate = decodedBuffer.sampleRate;
      
      const maxSamples = Math.min(data.length, sampleRate * 60);
      const step = Math.floor(sampleRate / 100);
      const peaks = [];
      let totalEnergy = 0;
      for (let i = 0; i < maxSamples; i += step) {
        let max = 0;
        for (let j = 0; j < step && (i + j) < maxSamples; j++) {
          const val = Math.abs(data[i + j]);
          if (val > max) max = val;
        }
        peaks.push(max);
        totalEnergy += max;
      }

      const mean = peaks.length > 0 ? totalEnergy / peaks.length : 0;
      const minInterval = Math.floor((60 / 180) * 100); // 180 BPM
      const maxInterval = Math.floor((60 / 70) * 100);  // 70 BPM
      let bestInterval = minInterval;
      let maxCorr = -Infinity;

      for (let interval = minInterval; interval <= maxInterval; interval++) {
        let corr = 0;
        for (let i = 0; i < peaks.length - interval; i++) {
          corr += (peaks[i] - mean) * (peaks[i + interval] - mean);
        }
        if (corr > maxCorr) {
          maxCorr = corr;
          bestInterval = interval;
        }
      }

      let bpm = Math.max(60, Math.min(200, Math.round((60 * 100) / bestInterval)));
      if (bpm < 75) bpm *= 2;

      let tempoClass = 'Moderato';
      if (bpm < 80) tempoClass = 'Andante / Slow Groove';
      else if (bpm < 108) tempoClass = 'Moderato / Hip-Hop & Lo-Fi';
      else if (bpm < 128) tempoClass = 'Allegretto / Pop & House';
      else if (bpm < 145) tempoClass = 'Allegro / Dance & EDM';
      else tempoClass = 'Vivace / Drum & Bass / Techno';

      return { bpm, tempoClass, confidence: 'High' };
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

      const totalSeconds = decodedBuffer.duration;
      const steps = Math.min(2000, Math.floor(totalSeconds * 20));

      if (offlineCtx.createStereoPanner) {
        const panner = offlineCtx.createStereoPanner();
        for (let i = 0; i < steps; i++) {
          const t = (i / steps) * totalSeconds;
          const panValue = Math.sin(2 * Math.PI * rotationSpeedHz * t);
          panner.pan.setValueAtTime(panValue, t);
        }
        source.connect(panner);
        panner.connect(offlineCtx.destination);
      } else {
        const splitter = offlineCtx.createChannelSplitter(2);
        const merger = offlineCtx.createChannelMerger(2);
        const gainL = offlineCtx.createGain();
        const gainR = offlineCtx.createGain();
        source.connect(splitter);
        splitter.connect(gainL, 0);
        splitter.connect(gainR, 1 < decodedBuffer.numberOfChannels ? 1 : 0);
        gainL.connect(merger, 0, 0);
        gainR.connect(merger, 0, 1);
        merger.connect(offlineCtx.destination);

        for (let i = 0; i < steps; i++) {
          const t = (i / steps) * totalSeconds;
          const pan = Math.sin(2 * Math.PI * rotationSpeedHz * t);
          gainL.gain.setValueAtTime((1 - pan) * 0.5, t);
          gainR.gain.setValueAtTime((1 + pan) * 0.5, t);
        }
      }

      source.start(0);
      const rendered = await offlineCtx.startRendering();
      return audioBufferToMp3Blob(rendered, 192);
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
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
          } else if (type === 'brown') {
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = Math.max(-1, Math.min(1, lastOut * 3.0));
          } else {
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
      await ensurePdfLib();
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
      await ensurePdfLib();
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
      await ensurePdfLib();
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
      await ensurePdfLib();
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
      await ensurePdfLib();
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
      await ensurePdfJs();
      await ensureJsPdf();
      if (!window.pdfjsLib || (!window.jspdf && !window.jsPDF)) {
        throw new Error('PDF rendering engines initializing');
      }
      ensurePdfJsWorker();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      const outDoc = new jsPdfConstructor({ unit: 'pt', compress: true });

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

      const rawOut = outDoc.output('blob');
      return rawOut instanceof Blob ? rawOut : new Blob([rawOut], { type: 'application/pdf' });
    },

    // 42. Text to PDF Generator
    async generateTextToPdf(text, title = 'Document') {
      await ensureJsPdf();
      const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (jsPdfConstructor) {
        const doc = new jsPdfConstructor({ unit: 'pt', format: 'a4' });
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

        const rawOut = doc.output('blob');
        return rawOut instanceof Blob ? rawOut : new Blob([rawOut], { type: 'application/pdf' });
      }
      throw new Error('PDF generator library not loaded');
    },

    // 43. PDF Security & Metadata Inspector
    async inspectPdfSecurity(file) {
      await ensurePdfJs();
      const arrayBuffer = await file.arrayBuffer();
      let metaInfo = {};

      if (window.pdfjsLib) {
        ensurePdfJsWorker();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const meta = await pdf.getMetadata().catch(() => ({}));
        const info = meta.info || {};
        const title = info.Title || 'Untitled / Cleared';
        const author = info.Author || 'Not specified / Anonymous';
        const creator = info.Creator || 'Unknown application';
        const producer = info.Producer || 'Unknown engine';
        const creationDate = info.CreationDate || 'Unknown date';
        const isEncrypted = pdf.isEncrypted || false;

        metaInfo = {
          fileName: file.name,
          fileSizeBytes: file.size,
          pages: pdf.numPages,
          pageCount: pdf.numPages,
          title,
          author,
          creator,
          producer,
          creationDate,
          encrypted: isEncrypted,
          isEncrypted,
          metadata: {
            title,
            author,
            creator,
            producer,
            creationDate
          }
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
          isEncrypted: false,
          metadata: {
            title: file.name,
            author: 'Not specified',
            creator: 'Unknown application',
            producer: 'PDF.js Reader',
            creationDate: new Date(file.lastModified || Date.now()).toLocaleDateString()
          }
        };
      }

      return metaInfo;
    },

    // 44. PDF Page Remover
    async deletePdfPages(file, pagesToDeleteIndices) {
      await ensurePdfLib();
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
    async generateMarkdownToPdf(markdownText) {
      await ensureJsPdf();
      const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (jsPdfConstructor) {
        const doc = new jsPdfConstructor({ unit: 'pt', format: 'a4' });
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

        const rawOut = doc.output('blob');
        return rawOut instanceof Blob ? rawOut : new Blob([rawOut], { type: 'application/pdf' });
      }
      throw new Error('PDF generator not ready');
    },

    // ==========================================
    // 13 NEW CONVERTER TOOLS HANDLERS (BATCH EXPANSION)
    // ==========================================

    // 1. HEIC to JPG Converter
    async convertHeicToJpg(file, quality = 0.92, bgColor = '#FFFFFF') {
      await ensureHeic2Any();
      if (typeof window.heic2any === 'function') {
        try {
          const res = await window.heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: Math.max(0.1, Math.min(1.0, quality))
          });
          const blob = Array.isArray(res) ? res[0] : res;
          if (blob && blob.size > 0) return blob;
        } catch (e) {
          console.warn('heic2any decoding attempt failed, trying canvas fallback:', e);
        }
      }

      try {
        const img = await loadImageFromFile(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        return await new Promise((resolve, reject) => {
          canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Canvas export failed')), 'image/jpeg', quality);
        });
      } catch (err) {
        throw new Error('Unable to decode HEIC image. Please verify file format or use Safari/modern browser.');
      }
    },

    // 2. HEIC to PNG Converter
    async convertHeicToPng(file, scale = 1.0) {
      await ensureHeic2Any();
      if (typeof window.heic2any === 'function') {
        try {
          const res = await window.heic2any({
            blob: file,
            toType: 'image/png'
          });
          const blob = Array.isArray(res) ? res[0] : res;
          if (scale < 1.0 && blob) {
            const img = await loadImageFromFile(blob);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
            canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          }
          if (blob && blob.size > 0) return blob;
        } catch (e) {
          console.warn('heic2any decoding attempt failed, trying canvas fallback:', e);
        }
      }

      try {
        const img = await loadImageFromFile(file);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
        canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return await new Promise((resolve, reject) => {
          canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Canvas export failed')), 'image/png');
        });
      } catch (err) {
        throw new Error('Unable to decode HEIC image. Please verify file format.');
      }
    },

    // 3. WEBP to JPG Converter
    async convertWebpToJpg(file, quality = 0.9, bgColor = '#FFFFFF') {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to convert WebP to JPG')), 'image/jpeg', quality);
      });
    },

    // 4. WEBP to PNG Converter
    async convertWebpToPng(file) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to convert WebP to PNG')), 'image/png');
      });
    },

    // 5. AVIF to JPG Converter
    async convertAvifToJpg(file, quality = 0.9, bgColor = '#FFFFFF') {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to convert AVIF to JPG')), 'image/jpeg', quality);
      });
    },

    // 6. AVIF to PNG Converter
    async convertAvifToPng(file) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to convert AVIF to PNG')), 'image/png');
      });
    },

    // 7. SVG to PNG Converter (rasterize vector)
    async rasterizeSvgToPng(file, scale = 2, bgColor = 'transparent') {
      const svgText = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      
      let baseW = 800;
      let baseH = 600;
      if (svgEl) {
        const vb = svgEl.getAttribute('viewBox');
        if (vb) {
          const parts = vb.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            baseW = parts[2];
            baseH = parts[3];
          }
        } else {
          const wAttr = parseFloat(svgEl.getAttribute('width'));
          const hAttr = parseFloat(svgEl.getAttribute('height'));
          if (!isNaN(wAttr) && wAttr > 0) baseW = wAttr;
          if (!isNaN(hAttr) && hAttr > 0) baseH = hAttr;
        }
      }

      const outW = Math.max(1, Math.round(baseW * scale));
      const outH = Math.max(1, Math.round(baseH * scale));

      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(blobUrl);
          const canvas = document.createElement('canvas');
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext('2d');
          if (bgColor && bgColor !== 'transparent') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, outW, outH);
          }
          ctx.drawImage(img, 0, 0, outW, outH);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) resolve(pngBlob);
            else reject(new Error('Failed to export rasterized PNG'));
          }, 'image/png');
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Unable to render vector SVG. Please verify syntax.'));
        };
        img.src = blobUrl;
      });
    },

    // 8. PDF Password Protect
    async passwordProtectPdf(file, userPassword, ownerPassword = '', permissions = {}, algorithm = 'AES-256') {
      if (!userPassword) {
        throw new Error('Please enter a user password to lock the PDF.');
      }

      await ensurePdfJs();
      await ensureJsPdf();
      await ensurePdfLib();

      const arrayBuffer = await file.arrayBuffer();

      // If PDFEncrypt (from @pdfsmaller/pdf-encrypt) is available:
      if (window.PDFEncrypt && typeof window.PDFEncrypt.encryptPDF === 'function') {
        const uint8 = new Uint8Array(arrayBuffer);
        const encryptedBytes = await window.PDFEncrypt.encryptPDF(uint8, {
          userPassword: userPassword,
          ownerPassword: ownerPassword || userPassword,
          permissions: {
            printing: permissions.printing !== false ? 'highResolution' : 'none',
            modifying: permissions.modifying === true,
            copying: permissions.copying !== false,
            annotating: permissions.annotating !== false,
            fillingForms: permissions.fillingForms !== false,
            contentAccessibility: true,
            documentAssembly: permissions.assembly === true
          },
          algorithm: algorithm || 'AES-256'
        });
        return new Blob([encryptedBytes], { type: 'application/pdf' });
      }

      // Fallback using jsPDF encryption
      const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (jsPdfConstructor && window.pdfjsLib) {
        ensurePdfJsWorker();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        const outDoc = new jsPdfConstructor({
          encryption: {
            userPassword: userPassword,
            ownerPassword: ownerPassword || userPassword,
            userPermissions: permissions.copying === false ? ['print'] : ['print', 'copy']
          }
        });

        for (let i = 1; i <= totalPages; i++) {
          if (i > 1) outDoc.addPage();
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pW = outDoc.internal.pageSize.getWidth();
          const pH = outDoc.internal.pageSize.getHeight();
          outDoc.addImage(imgData, 'JPEG', 0, 0, pW, pH);
        }

        const rawOut = outDoc.output('blob');
        return rawOut instanceof Blob ? rawOut : new Blob([rawOut], { type: 'application/pdf' });
      }

      throw new Error('PDF encryption library not initialized. Please try again.');
    },

    // 9. PDF Password Remover (Unlock)
    async removePdfPassword(file, password) {
      await ensurePdfJs();
      await ensurePdfLib();
      if (!window.pdfjsLib) throw new Error('PDF viewer library not available.');
      ensurePdfJsWorker();

      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        const loadingTask = window.pdfjsLib.getDocument({
          data: arrayBuffer,
          password: password || ''
        });
        pdfDoc = await loadingTask.promise;
      } catch (err) {
        if (err && (err.name === 'PasswordException' || (err.message && err.message.toLowerCase().includes('password')))) {
          throw new Error('Incorrect password. Please verify the password and try again.');
        }
        throw new Error(`Failed to unlock PDF: ${err.message || err}`);
      }

      if (window.PDFLib) {
        const newDoc = await window.PDFLib.PDFDocument.create();
        const numPages = pdfDoc.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;

          const imgBlob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.95));
          const imgBytes = await imgBlob.arrayBuffer();
          const embeddedImg = await newDoc.embedJpg(imgBytes);

          const origViewport = page.getViewport({ scale: 1.0 });
          const newPage = newDoc.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height
          });
        }

        const unencryptedBytes = await newDoc.save();
        return new Blob([unencryptedBytes], { type: 'application/pdf' });
      }

      throw new Error('PDF reconstruction engine not available.');
    },

    // 10. PDF Image Extractor
    async extractPdfImages(file) {
      await ensurePdfJs();
      await ensureJsZip();
      if (!window.pdfjsLib) throw new Error('PDF viewer library not ready.');
      ensurePdfJsWorker();

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const extractedImages = [];

      for (let p = 1; p <= numPages; p++) {
        const page = await pdf.getPage(p);
        const ops = await page.getOperatorList();
        const fns = ops.fnArray;
        const args = ops.argsArray;

        for (let i = 0; i < fns.length; i++) {
          if (fns[i] === window.pdfjsLib.OPS.paintImageXObject || fns[i] === window.pdfjsLib.OPS.paintInlineImageXObject) {
            const imgName = args[i][0];
            try {
              let imgObj = page.objs.get(imgName);
              if (!imgObj && page.commonObjs) {
                imgObj = page.commonObjs.get(imgName);
              }

              if (imgObj && (imgObj.data || imgObj.bitmap)) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let w = imgObj.width;
                let h = imgObj.height;

                if (imgObj.bitmap) {
                  canvas.width = imgObj.bitmap.width;
                  canvas.height = imgObj.bitmap.height;
                  ctx.drawImage(imgObj.bitmap, 0, 0);
                } else if (imgObj.data) {
                  canvas.width = w;
                  canvas.height = h;
                  const imgData = ctx.createImageData(w, h);
                  const dataLen = imgObj.data.length;
                  if (dataLen === w * h * 4) {
                    imgData.data.set(imgObj.data);
                  } else if (dataLen === w * h * 3) {
                    let j = 0;
                    for (let k = 0; k < dataLen; k += 3) {
                      imgData.data[j] = imgObj.data[k];
                      imgData.data[j + 1] = imgObj.data[k + 1];
                      imgData.data[j + 2] = imgObj.data[k + 2];
                      imgData.data[j + 3] = 255;
                      j += 4;
                    }
                  } else {
                    let j = 0;
                    for (let k = 0; k < dataLen && j < imgData.data.length; k++) {
                      const v = imgObj.data[k];
                      imgData.data[j] = v;
                      imgData.data[j + 1] = v;
                      imgData.data[j + 2] = v;
                      imgData.data[j + 3] = 255;
                      j += 4;
                    }
                  }
                  ctx.putImageData(imgData, 0, 0);
                }

                if (canvas.width > 20 && canvas.height > 20) {
                  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
                  extractedImages.push({
                    name: `page-${p}-image-${extractedImages.length + 1}.png`,
                    pageNum: p,
                    width: canvas.width,
                    height: canvas.height,
                    blob: blob,
                    dataUrl: canvas.toDataURL('image/png')
                  });
                }
              }
            } catch (err) {
              console.warn('Could not extract image object:', err);
            }
          }
        }
      }

      if (extractedImages.length === 0) {
        for (let p = 1; p <= Math.min(numPages, 10); p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
          extractedImages.push({
            name: `page-${p}-snapshot.png`,
            pageNum: p,
            width: canvas.width,
            height: canvas.height,
            blob: blob,
            dataUrl: canvas.toDataURL('image/png')
          });
        }
      }

      let zipBlob = null;
      if (window.JSZip && extractedImages.length > 0) {
        const zip = new window.JSZip();
        for (const item of extractedImages) {
          zip.file(item.name, item.blob);
        }
        zipBlob = await zip.generateAsync({ type: 'blob' });
      }

      return {
        images: extractedImages,
        zipBlob: zipBlob || (extractedImages[0] ? extractedImages[0].blob : null),
        count: extractedImages.length
      };
    },

    // 11. PDF Page Reorganizer
    async reorganizePdfPages(file, newOrderIndices) {
      await ensurePdfLib();
      if (!window.PDFLib) throw new Error('PDF library is initializing.');
      const bytes = await file.arrayBuffer();
      const srcDoc = await window.PDFLib.PDFDocument.load(bytes);
      const newDoc = await window.PDFLib.PDFDocument.create();

      const totalPages = srcDoc.getPageCount();
      const validIndices = newOrderIndices.filter((idx) => idx >= 0 && idx < totalPages);
      if (validIndices.length === 0) {
        throw new Error('Invalid page order selection.');
      }

      const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    },

    // 12. PDF to Text Extractor
    async extractPdfText(file, options = { includeDividers: true, normalizeSpaces: true }) {
      await ensurePdfJs();
      if (!window.pdfjsLib) throw new Error('PDF text parser not ready.');
      ensurePdfJsWorker();

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pageTexts = [];

      for (let p = 1; p <= numPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        let lastY = null;
        let line = '';
        const lines = [];

        for (const item of textContent.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            lines.push(line.trim());
            line = '';
          }
          line += (line && !line.endsWith(' ') ? ' ' : '') + item.str;
          lastY = item.transform[5];
        }
        if (line) lines.push(line.trim());

        let pageStr = lines.join('\n');
        if (options.normalizeSpaces) {
          pageStr = pageStr.replace(/[ \t]+/g, ' ');
        }
        pageTexts.push(pageStr);
      }

      let combinedText = '';
      if (options.includeDividers) {
        combinedText = pageTexts
          .map((txt, idx) => `--- Page ${idx + 1} of ${numPages} ---\n\n${txt}\n`)
          .join('\n');
      } else {
        combinedText = pageTexts.join('\n\n');
      }

      const words = combinedText.trim().split(/\s+/).filter(Boolean).length;
      const chars = combinedText.length;
      const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });

      return {
        text: combinedText,
        pageCount: numPages,
        wordCount: words,
        charCount: chars,
        blob: blob
      };
    },

    // 13. Images to PDF Converter
    async convertImagesToPdf(fileList, options = { pageSize: 'fit', orientation: 'auto', margin: 0 }) {
      await ensurePdfLib();
      if (!window.PDFLib) throw new Error('PDF engine initializing.');
      const doc = await window.PDFLib.PDFDocument.create();

      const files = Array.from(fileList);
      if (files.length === 0) throw new Error('Please provide at least one image.');

      const margin = parseInt(options.margin, 10) || 0;

      for (const file of files) {
        const img = await loadImageFromFile(file);
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        const canvas = document.createElement('canvas');
        canvas.width = origW;
        canvas.height = origH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, origW, origH);
        ctx.drawImage(img, 0, 0);

        const imgBlob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
        const imgBytes = await imgBlob.arrayBuffer();
        const embedded = await doc.embedJpg(imgBytes);

        let pageW = origW + margin * 2;
        let pageH = origH + margin * 2;
        let drawW = origW;
        let drawH = origH;
        let drawX = margin;
        let drawY = margin;

        if (options.pageSize === 'a4') {
          const isLandscape = options.orientation === 'landscape' || (options.orientation === 'auto' && origW > origH);
          pageW = isLandscape ? 841.89 : 595.28;
          pageH = isLandscape ? 595.28 : 841.89;

          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;
          const scale = Math.min(availW / origW, availH / origH);

          drawW = origW * scale;
          drawH = origH * scale;
          drawX = margin + (availW - drawW) / 2;
          drawY = margin + (availH - drawH) / 2;
        } else if (options.pageSize === 'letter') {
          const isLandscape = options.orientation === 'landscape' || (options.orientation === 'auto' && origW > origH);
          pageW = isLandscape ? 792 : 612;
          pageH = isLandscape ? 612 : 792;

          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;
          const scale = Math.min(availW / origW, availH / origH);

          drawW = origW * scale;
          drawH = origH * scale;
          drawX = margin + (availW - drawW) / 2;
          drawY = margin + (availH - drawH) / 2;
        }

        const page = doc.addPage([pageW, pageH]);
        page.drawImage(embedded, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH
        });
      }

      const pdfBytes = await doc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }

  };

})();
