/**
 * Multi Tube Views (MTV) — Media Converter Tools Registry
 * 60 In-Browser Client-Side Media Tools across 4 Categories:
 * - Image Tools (19 tools)
 * - Video Tools (15 tools)
 * - Audio Tools (15 tools)
 * - PDF & Document Tools (11 tools)
 *
 * 100% Client-Side — Zero Server Uploads — Maximum Privacy
 */

(function() {
  'use strict';

  const ALL_TOOL_CONFIGS = {
    // ==========================================
    // EXISTING 15 TOOLS
    // ==========================================
    'video-to-audio': {
      title: 'Video to Audio Converter',
      desc: 'Extract MP3, WAV, or AAC audio tracks directly from video files with custom bitrate selection.',
      icon: '🎵',
      category: 'video',
      accept: 'video/*',
      actionText: 'Extract Audio Track',
      about: 'Converts any input video (MP4, WebM, MOV, AVI) into high-fidelity standalone audio. Processing is executed 100% locally inside your browser.'
    },
    'video-trimmer': {
      title: 'Video Trimmer',
      desc: 'Cut and trim video clips to precise start and end timestamps with live preview.',
      icon: '✂️',
      category: 'video',
      accept: 'video/*',
      actionText: 'Trim Video Clip',
      about: 'Trim unwanted video intros/outros with precision timing. The trimmed video is generated directly in your browser.'
    },
    'slow-reverb': {
      title: 'Slow + Reverb Generator',
      desc: 'Apply aesthetic slowed playback speed and atmospheric ambient reverb effect to audio/video.',
      icon: '🌊',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Generate Slow + Reverb',
      about: 'Slows down media playback and applies a multi-tap delay & acoustic convolution reverb filter for aesthetic viral audio tracks.'
    },
    'audio-trimmer': {
      title: 'Audio Trimmer',
      desc: 'Trim audio files with exact start/end points and optional smooth fade-in and fade-out effects.',
      icon: '🎧',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Trim Audio File',
      about: 'Slice MP3, WAV, AAC, or OGG tracks down to specific timestamps with configurable fade-in and fade-out envelope curves.'
    },
    'video-converter': {
      title: 'Video Format Converter',
      desc: 'Convert video files between MP4, WebM, and MKV formats with resolution options.',
      icon: '🎥',
      category: 'video',
      accept: 'video/*',
      actionText: 'Convert Video Format',
      about: 'Transcodes video streams locally using HTML5 canvas and browser codecs to change containers and scale resolutions.'
    },
    'video-to-gif': {
      title: 'Video to GIF Converter',
      desc: 'Convert short video clips into animated GIF files with custom frame rate and width.',
      icon: '🖼️',
      category: 'video',
      accept: 'video/*',
      actionText: 'Generate Animated GIF',
      about: 'Extracts video frames and packs them into a lightweight animated GIF file suitable for social media sharing.'
    },
    'audio-converter': {
      title: 'Audio Format Converter',
      desc: 'Convert audio files between MP3, WAV, AAC, OGG, M4A, and FLAC formats.',
      icon: '📻',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Convert Audio Format',
      about: 'Re-encodes audio tracks into different audio file formats with customizable bitrate quality settings.'
    },
    'video-speed': {
      title: 'Video Speed Changer',
      desc: 'Speed up or slow down video clips (0.25x to 2.0x) with optional pitch preservation.',
      icon: '⚡',
      category: 'video',
      accept: 'video/*',
      actionText: 'Change Video Speed',
      about: 'Adjusts video frame rate and audio sample rate to create time-lapse or slow-motion clips right inside your browser.'
    },
    'voice-to-text': {
      title: 'Voice-to-Text (Multi-language)',
      desc: 'Speak and instantly convert your voice into text, in multiple languages with one-click copy and export.',
      icon: '🎙️',
      category: 'audio',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Converts speech to text in real time using the browser SpeechRecognition Web API. Supports English, Hindi, Urdu, Spanish, French, Arabic, German, Japanese, and 10+ languages.'
    },
    'text-to-speech': {
      title: 'Text-to-Speech',
      desc: 'Type any text and hear it read aloud in different languages and voices with pitch and speed control.',
      icon: '🔊',
      category: 'audio',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Generates spoken speech from written text using the client-side Web SpeechSynthesis API. Choose from all available installed system voices and adjust playback speed and vocal pitch.'
    },
    'qr-generator': {
      title: 'QR Code Generator',
      desc: 'Turn any link or text into a scannable QR code image instantly with custom colors and HD export.',
      icon: '🔲',
      category: 'image',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Creates crisp, high-resolution QR codes completely inside your browser. Customize resolution, error correction level, foreground color, and background color.'
    },
    'pdf-image-converter': {
      title: 'PDF ↔ Image Converter',
      desc: 'Convert PDF pages into images, or combine multiple images into a clean PDF document.',
      icon: '📄',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Render PDF documents into high-DPI PNG or JPG image files page by page, or merge multiple photos into a formatted multi-page PDF document.'
    },
    'image-format-converter': {
      title: 'File Format Converter',
      desc: 'Convert images between PNG, JPG, and WebP formats with quality and resizing controls.',
      icon: '🔄',
      category: 'image',
      accept: 'image/*',
      actionText: 'Convert Image Format',
      about: 'Converts image formats client-side using HTML5 Canvas. Supports WebP for maximum compression, PNG for transparency, and JPEG for universal compatibility.'
    },
    'metadata-remover': {
      title: 'Metadata / EXIF Remover',
      desc: 'Strip hidden location, device, and camera data from your photos before sharing, for privacy.',
      icon: '🛡️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Clean & Download Image',
      about: 'Inspects and strips all embedded EXIF tags, GPS location coordinates, camera models, lens details, and software tags to safeguard your personal privacy.'
    },
    'image-cropper': {
      title: 'Image Cropper (Ratio Presets)',
      desc: 'Crop any photo to the perfect size for YouTube thumbnails (16:9), Instagram posts (1:1, 4:5), or Stories/TikTok (9:16).',
      icon: '✂️🖼️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Crop & Export Image',
      about: 'Interactive canvas cropper with standard aspect ratio presets for YouTube thumbnails, Instagram posts, TikTok shorts, and freeform bounding box.'
    },

    // ==========================================
    // 15 NEW IMAGE TOOLS
    // ==========================================
    'image-compressor': {
      title: 'Image Compressor',
      desc: 'Reduce image file size dramatically without visible quality loss using smart canvas re-encoding.',
      icon: '🗜️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Compress Image',
      about: 'Compresses JPEG, PNG, and WebP images by optimizing color tables and quantization matrices locally without uploading anything to a server.'
    },
    'image-resizer': {
      title: 'Image Resizer',
      desc: 'Enlarge or shrink photos to exact pixel dimensions or percentage ratios.',
      icon: '📐',
      category: 'image',
      accept: 'image/*',
      actionText: 'Resize Image',
      about: 'Resizes any photo with high-quality bicubic interpolation. Maintain aspect ratio lock or specify custom width and height in pixels.'
    },
    'image-watermark': {
      title: 'Image Watermark Adder',
      desc: 'Stamp custom text watermarks onto photos with custom transparency, position, and font size.',
      icon: '💧',
      category: 'image',
      accept: 'image/*',
      actionText: 'Add Watermark',
      about: 'Protects your creative photography and promotional graphics by burning customizable semi-transparent watermarks directly onto images.'
    },
    'color-inverter': {
      title: 'Image Color Inverter',
      desc: 'Invert colors to create negative film effects or high-contrast monochrome visuals.',
      icon: '🌓',
      category: 'image',
      accept: 'image/*',
      actionText: 'Invert Image Colors',
      about: 'Flips RGB pixel color channels to create negative photographic prints, solarized effects, or inverted dark-mode visuals.'
    },
    'image-filters': {
      title: 'Photo Filters & Color Grading',
      desc: 'Enhance photos with vintage sepia, vibrant saturation, high contrast, and retro cinema filters.',
      icon: '🎨',
      category: 'image',
      accept: 'image/*',
      actionText: 'Apply Photo Filters',
      about: 'Fine-tunes brightness, contrast, saturation, sepia, grayscale, and hue-rotation with real-time canvas pixel rendering.'
    },
    'png-to-svg': {
      title: 'Raster to SVG Vectorizer',
      desc: 'Trace raster logos and graphics into clean, scalable SVG vector markup.',
      icon: '✒️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Convert to Vector SVG',
      about: 'Scans high-contrast pixel boundaries, silhouettes, and color contours to generate resolution-independent scalable vector graphics (SVG).'
    },
    'favicon-generator': {
      title: 'Favicon & App Icon Generator',
      desc: 'Generate multi-size web favicons and PWA touch icons from any logo or picture.',
      icon: '⭐',
      category: 'image',
      accept: 'image/*',
      actionText: 'Generate Favicon Suite',
      about: 'Creates a complete suite of browser icons: 16x16, 32x32, 48x48, 192x192, 512x512, and Apple Touch Icon with one-click download.'
    },
    'meme-generator': {
      title: 'Meme Generator',
      desc: 'Create viral memes in seconds with classic Impact typography and custom text styling.',
      icon: '🎭',
      category: 'image',
      accept: 'image/*',
      actionText: 'Generate Meme',
      about: 'Add bold top and bottom captions to any photo with classic black-outlined Impact typography for social media memes.'
    },
    'base64-image': {
      title: 'Image to Base64 Data URI',
      desc: 'Convert any graphic into an inline Base64 data string for direct embedding in HTML and CSS.',
      icon: '🔡',
      category: 'image',
      accept: 'image/*',
      actionText: 'Encode to Base64',
      about: 'Encodes images into Base64 strings, complete with Data URI headers, ready to paste directly into web markup or stylesheet backgrounds.'
    },
    'image-blur': {
      title: 'Image Blur & Privacy Redactor',
      desc: 'Blur photos or sensitive regions to protect privacy and conceal confidential information.',
      icon: '🌫️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Apply Blur Redaction',
      about: 'Applies smooth Gaussian blur across images to redact faces, license plates, passwords, or background clutter.'
    },
    'image-border': {
      title: 'Image Border & Frame Adder',
      desc: 'Add colored borders, rounded margins, and drop-shadow frames to screenshots and graphics.',
      icon: '🖼️',
      category: 'image',
      accept: 'image/*',
      actionText: 'Add Border Frame',
      about: 'Styles screenshots with clean canvas padding, colored outlines, rounded corners, and soft drop shadows for professional mockups.'
    },
    'image-splitter': {
      title: 'Image Grid Splitter',
      desc: 'Split photos into seamless multi-tile grids for Instagram carousel and grid layouts.',
      icon: '▦',
      category: 'image',
      accept: 'image/*',
      actionText: 'Split Image Grid',
      about: 'Slices single images into 3x1 banners, 3x3 grids, or 2x2 multi-tile panels with instant individual tile downloads or ZIP export.'
    },
    'color-palette-image': {
      title: 'Image Palette Extractor',
      desc: 'Sample dominant color schemes and hex palettes directly from uploaded photography.',
      icon: '🎨',
      category: 'image',
      accept: 'image/*',
      actionText: 'Extract Color Palette',
      about: 'Analyzes color histograms across images to extract 5 to 10 dominant color swatches with one-click Hex and RGB copying.'
    },
    'pixelate-image': {
      title: 'Image Pixelator (8-Bit & Censor)',
      desc: 'Turn graphics into retro 8-bit pixel art or obscure faces and details with mosaic pixelation.',
      icon: '👾',
      category: 'image',
      accept: 'image/*',
      actionText: 'Pixelate Image',
      about: 'Creates stylized retro arcade pixel art or mosaic censorship blocks with adjustable block sizes from 4px to 64px.'
    },
    'image-rotate-flip': {
      title: 'Image Rotate & Flip',
      desc: 'Rotate images to any 90-degree angle or mirror horizontally and vertically with zero quality loss.',
      icon: '🔄',
      category: 'image',
      accept: 'image/*',
      actionText: 'Rotate & Flip Image',
      about: 'Quickly reorients images with 90° clockwise, 90° counter-clockwise, 180° rotation, and horizontal/vertical mirroring.'
    },

    // ==========================================
    // 10 NEW VIDEO TOOLS
    // ==========================================
    'video-compressor': {
      title: 'Video Compressor',
      desc: 'Downscale resolution and re-encode video to reduce video file sizes for WhatsApp and email.',
      icon: '🗜️',
      category: 'video',
      accept: 'video/*',
      actionText: 'Compress Video',
      about: 'Downscales video dimensions and re-encodes frames locally through HTML5 Canvas and MediaRecorder to cut file weight.'
    },
    'video-reverse': {
      title: 'Video Reverser',
      desc: 'Play video sequences backwards to produce captivating reverse-motion effects.',
      icon: '⏪',
      category: 'video',
      accept: 'video/*',
      actionText: 'Reverse Video',
      about: 'Extracts video frames sequentially and records them in backwards order for mesmerizing rewind and reverse-motion video clips.'
    },
    'video-watermark': {
      title: 'Video Watermark Adder',
      desc: 'Burn branded watermarks and channel identifiers directly onto video frames.',
      icon: '💧',
      category: 'video',
      accept: 'video/*',
      actionText: 'Add Watermark to Video',
      about: 'Overlays your custom logo or channel handle onto video streams with selectable corner placements, transparency, and typography.'
    },
    'video-mute': {
      title: 'Video Audio Remover (Mute Video)',
      desc: 'Strip background music and audio tracks from videos cleanly and instantaneously.',
      icon: '🔇',
      category: 'video',
      accept: 'video/*',
      actionText: 'Remove Audio from Video',
      about: 'Removes the audio track from video files, rendering a clean, silent video stream for background loops or re-dubbing.'
    },
    'video-rotate': {
      title: 'Video Rotator',
      desc: 'Fix sideways and upside-down smartphone videos by rotating 90°, 180°, or 270 degrees.',
      icon: '🔄',
      category: 'video',
      accept: 'video/*',
      actionText: 'Rotate Video',
      about: 'Corrects orientation tags and rotates video frames 90° clockwise, 180°, or 270° with proper canvas aspect re-fitting.'
    },
    'video-loop': {
      title: 'Video Looper & Boomerang',
      desc: 'Repeat short clips multiple times or generate an Instagram-style back-and-forth boomerang video.',
      icon: '🔁',
      category: 'video',
      accept: 'video/*',
      actionText: 'Create Looping Video',
      about: 'Duplicates clip sequences 2x, 3x, or 4x, or compiles a forward-and-reverse boomerang bounce for dynamic social posts.'
    },
    'video-framerate': {
      title: 'Video Frame Rate Changer (FPS)',
      desc: 'Convert video frame rates to achieve cinematic 24fps or ultra-lightweight 15fps clips.',
      icon: '⏱️',
      category: 'video',
      accept: 'video/*',
      actionText: 'Convert Frame Rate',
      about: 'Re-samples video streams at target frame rates (15, 24 cinematic, 30 standard, 60 smooth) directly in the browser.'
    },
    'video-snapshot': {
      title: 'Video Frame Snapshot Extractor',
      desc: 'Extract pristine high-definition still frames from any moment in your video files.',
      icon: '📸',
      category: 'video',
      accept: 'video/*',
      actionText: 'Capture Snapshot Frame',
      about: 'Grabs full-resolution still pictures from exact video timestamps and exports them as crystal-clear PNG or JPEG images.'
    },
    'video-aspect-ratio': {
      title: 'Video Aspect Ratio Resizer',
      desc: 'Format landscape videos into vertical 9:16 Shorts or square 1:1 feeds with letterboxing.',
      icon: '📱',
      category: 'video',
      accept: 'video/*',
      actionText: 'Resize Video Aspect Ratio',
      about: 'Converts 16:9 landscape videos to 9:16 TikTok/Reels, 1:1 Square, or 4:5 Instagram formats with clean letterboxing or blur fills.'
    },
    'video-color-filter': {
      title: 'Video Color Filters & Grading',
      desc: 'Grade and colorize video clips with real-time browser canvas color matrices.',
      icon: '🌈',
      category: 'video',
      accept: 'video/*',
      actionText: 'Apply Video Color Filter',
      about: 'Applies vintage film grain, high-contrast monochrome, cyberpunk neon, warm sepia, or saturated grades to video clips.'
    },

    // ==========================================
    // 10 NEW AUDIO TOOLS
    // ==========================================
    'audio-compressor': {
      title: 'Audio Compressor',
      desc: 'Compress heavy audio files to compact MP3 or WAV formats for faster streaming and sharing.',
      icon: '🗜️',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Compress Audio File',
      about: 'Re-samples audio bitrates (64k, 96k, 128k, 192k) and sample frequencies locally to shrink voice notes and podcasts.'
    },
    'audio-joiner': {
      title: 'Audio Merger & Joiner',
      desc: 'Stitch multiple audio tracks and voice notes together into one continuous audio track.',
      icon: '🔗',
      category: 'audio',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Combines multiple audio files sequentially with optional crossfade transitions into a single unified MP3 or WAV recording.'
    },
    'audio-normalizer': {
      title: 'Audio Volume Booster & Normalizer',
      desc: 'Amplify quiet audio recordings and equalize fluctuating volume levels without distortion.',
      icon: '📢',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Normalize & Boost Volume',
      about: 'Analyzes peak amplitude and boosts gain up to 300% with a smart soft-knee peak limiter to eliminate audio clipping.'
    },
    'audio-reverse': {
      title: 'Audio Reverser (Backwards Audio)',
      desc: 'Invert audio waveforms to play songs and voice clips backwards for subliminal and creative sound effects.',
      icon: '⏪',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Reverse Audio File',
      about: 'Reverses audio sample buffers in memory with zero quality degradation, producing backwards speech and retro rewind sweeps.'
    },
    'audio-pitch': {
      title: 'Audio Pitch Shifter',
      desc: 'Transpose audio pitch up or down without speeding up or slowing down playback.',
      icon: '🎶',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Shift Audio Pitch',
      about: 'Shifts pitch up or down across semitones and octaves, with fun chipmunk, deep radio-host, and musical key adjustments.'
    },
    'audio-bass-boost': {
      title: 'Bass Booster & 3-Band EQ',
      desc: 'Pump up low-end sub frequencies and sculpt treble with a high-fidelity Web Audio equalizer.',
      icon: '🎛️',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Apply Bass Boost & EQ',
      about: 'Employs 3-band parametric biquad filters (Low-shelf Bass, Peaking Mid, High-shelf Treble) to pump up sub-bass response.'
    },
    'audio-bpm': {
      title: 'Audio BPM & Tempo Detector',
      desc: 'Analyze beats per minute (BPM) and rhythmic cadence of any audio track automatically.',
      icon: '🥁',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Detect Audio BPM',
      about: 'Executes rhythmic peak-energy analysis over audio tracks to calculate accurate tempo (BPM) with manual tap-tempo assist.'
    },
    'audio-stereo-panner': {
      title: 'Audio Stereo Panner & 8D Audio',
      desc: 'Create immersive 8D headphone experiences with rotating binaural left-right spatial audio.',
      icon: '🎧',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Apply 8D Panning Effect',
      about: 'Oscillates stereo soundstage in a continuous 360-degree rotation curve, creating viral 8D audio effects for headphones.'
    },
    'audio-noise-generator': {
      title: 'Ambient Noise Generator (White, Pink, Brown)',
      desc: 'Synthesize pure acoustic white, pink, and brown noise for deep focus, sleep, and tinnitus masking.',
      icon: '📻',
      category: 'audio',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Synthesizes pure white noise, 1/f pink noise, and 1/f² brown noise waveforms in real time with custom length export.'
    },
    'audio-cutter-ringtone': {
      title: 'Ringtone Maker (Custom Audio Cut)',
      desc: 'Cut catchy 30-second ringtone snippets from songs with smooth fade transitions.',
      icon: '📱',
      category: 'audio',
      accept: 'audio/*',
      actionText: 'Export Ringtone',
      about: 'Snips exact 30-second chorus or hook segments with seamless 1-second fade-in and 2-second fade-out for smartphone ringtones.'
    },

    // ==========================================
    // 10 NEW PDF & DOCUMENT TOOLS
    // ==========================================
    'pdf-merger': {
      title: 'PDF Merger',
      desc: 'Merge multiple PDF documents together in any custom sequence completely offline.',
      icon: '📑',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Combines multiple PDF documents into one unified file directly in your browser. Reorder pages and files with total privacy.'
    },
    'pdf-splitter': {
      title: 'PDF Splitter',
      desc: 'Extract selected pages or split multi-page PDF files into independent documents.',
      icon: '✂️',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Extract individual pages, page ranges (e.g. 1-3, 5, 8-10), or split a multi-chapter PDF into standalone files.'
    },
    'pdf-page-rotator': {
      title: 'PDF Page Rotator',
      desc: 'Permanently reorient sideways or inverted PDF documents into readable portrait/landscape.',
      icon: '🔄',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Rotates all pages or specific pages by 90°, 180°, or 270° degrees, permanently correcting scanned paperwork.'
    },
    'pdf-watermark': {
      title: 'PDF Watermark Adder',
      desc: 'Stamp prominent diagonal or horizontal text watermarks across every page of your PDF.',
      icon: '💧',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Applies prominent text watermarks (e.g. "CONFIDENTIAL", "DRAFT", "COPY") diagonally across PDF documents.'
    },
    'pdf-page-numberer': {
      title: 'PDF Page Numberer',
      desc: 'Stamp sequential page numbers onto existing PDF documents automatically.',
      icon: '🔢',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Adds sequential page numbers ("Page X of Y", "1, 2, 3") to headers or footers of PDF documents with custom font sizes.'
    },
    'pdf-compressor': {
      title: 'PDF Compressor & Optimizer',
      desc: 'Reduce PDF file sizes by optimizing embedded imagery and rendering raster layers.',
      icon: '🗜️',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Optimizes embedded graphics and compresses visual layers to make large PDFs email-ready and web-friendly.'
    },
    'text-to-pdf': {
      title: 'Text to PDF Generator',
      desc: 'Type or paste plain text and generate a formatted, printable PDF document instantly.',
      icon: '📝',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Converts typed or pasted text into a formatted PDF document with customizable margins, typography, and page sizing.'
    },
    'pdf-protect': {
      title: 'PDF Inspector & Security Checker',
      desc: 'Inspect embedded document metadata, encryption status, and security permissions.',
      icon: '🔒',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Audits PDF documents for sensitive metadata (author, creation date, software generator) and security encryption settings.'
    },
    'pdf-page-delete': {
      title: 'PDF Page Remover',
      desc: 'Delete unwanted cover sheets, blank pages, or outdated appendixes from PDF files.',
      icon: '🗑️',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Renders visual page thumbnails, allowing you to select and remove blank, redundant, or unwanted pages with one click.'
    },
    'markdown-to-pdf': {
      title: 'Markdown to PDF Exporter',
      desc: 'Render formatted Markdown documents into clean, typography-rich PDF files.',
      icon: '📄',
      category: 'pdf-document',
      hideMainDropzone: true,
      hideActionBtn: true,
      about: 'Parses Markdown text with headings, lists, blockquotes, and code blocks into beautifully styled, printable PDF documents.'
    }
  };

  // Attach to window
  window.MTV_ALL_TOOL_CONFIGS = ALL_TOOL_CONFIGS;
  window.MTV_VALID_TOOLS = Object.keys(ALL_TOOL_CONFIGS);

})();
