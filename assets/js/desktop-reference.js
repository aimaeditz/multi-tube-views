/**
 * Multi Tube Views (MTV) — Desktop Reference Design System Interactivity
 * Handles scroll reveals, number counting, 3D card tilt effects, and dynamic tool badge metrics.
 */

import { AI_TOOLS_DATA } from '../data/ai-tools-data.js';
import { BU_CATEGORIES } from '../data/browser-utilities-data.js';
import { CREATOR_TOOLS_DATA } from '../data/creator-tools-data.js';
import './media-tools-data.js';

export function getLiveWebsiteTotalTools() {
  const aiToolsCount = (typeof AI_TOOLS_DATA === 'object' && AI_TOOLS_DATA !== null)
    ? Object.keys(AI_TOOLS_DATA).length
    : 60;

  const creatorToolsCount = (typeof CREATOR_TOOLS_DATA === 'object' && CREATOR_TOOLS_DATA !== null)
    ? Object.keys(CREATOR_TOOLS_DATA).length
    : 20;

  let buToolsCount = 89;
  if (Array.isArray(BU_CATEGORIES) && BU_CATEGORIES.length > 0) {
    buToolsCount = BU_CATEGORIES.reduce((acc, cat) => acc + (cat.tools ? cat.tools.length : (cat.toolCount || 0)), 0);
  }

  let mediaToolsCount = 60;
  if (typeof window !== 'undefined' && window.MTV_ALL_TOOL_CONFIGS) {
    mediaToolsCount = Object.keys(window.MTV_ALL_TOOL_CONFIGS).length;
  }

  return aiToolsCount + creatorToolsCount + buToolsCount + mediaToolsCount;
}

export function updateHeroTotalBadge() {
  const badgeTextEl = document.getElementById('hero-total-tools-text') ||
                      document.querySelector('.float-chip.float-chip-4 span:last-child');
  if (badgeTextEl) {
    const total = getLiveWebsiteTotalTools();
    badgeTextEl.textContent = `${total} Instant Tools`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeroTotalBadge();

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 780 || window.matchMedia('(max-width: 780px)').matches;

  // 1. Scroll Reveal Animation (Desktop only; on mobile, sections are fully visible immediately with no observer)
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if (isReducedMotion || isMobile) {
      revealElements.forEach(el => el.classList.add('in'));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10px 0px',
        threshold: 0.08
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  // 2. Animated Stats Number Counters (Fast, Fluid & Continuous)
  const countElements = document.querySelectorAll('.stat-num-desk[data-count], .stat .num[data-count], .stat-num[data-count]');
  if (countElements.length > 0) {
    const renderStatValue = (el, val, suffix) => {
      if (suffix) {
        el.innerHTML = val + '<span class="stat-plus">' + suffix + '</span>';
      } else {
        el.textContent = val;
      }
    };

    if (isReducedMotion) {
      countElements.forEach(el => {
        const target = el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        renderStatValue(el, target, suffix);
      });
    } else {
      const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // Natural, gradual 2.0s duration (roughly 1.5-2.5s)
        let startTime = null;
        let lastVal = 0;

        function updateCounter(currentTime) {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Eased animation: smooth ease-out (starts with momentum and gently decelerates near the end)
          const easeProgress = Math.sin((progress * Math.PI) / 2);
          const currentVal = Math.round(easeProgress * target);

          if (currentVal !== lastVal) {
            renderStatValue(el, currentVal, suffix);
            lastVal = currentVal;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            renderStatValue(el, target, suffix);
          }
        }

        requestAnimationFrame(updateCounter);
      };

      // Initialize counter elements to 0 smoothly before scroll-into-view triggers
      countElements.forEach(el => {
        const suffix = el.getAttribute('data-suffix') || '';
        renderStatValue(el, 0, suffix);
      });

      if (!('IntersectionObserver' in window)) {
        countElements.forEach(el => animateCounter(el));
      } else {
        const countObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px 40px 0px'
        });

        countElements.forEach(el => countObserver.observe(el));
      }
    }
  }

  // 3. 3D Mouse Tilt on Hover for Desktop Cards
  const tiltCards = document.querySelectorAll('.tilt-card, .story-panel, .step-card-desk, .stat-card-desk');
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  if (supportsHover && !isReducedMotion && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      // Ignore if element is an output result box
      if (card.id === 'dedicated-tool-output' || card.id === 'dedicated-tool-output-wrap' || card.classList.contains('inline-tool-output') || card.classList.contains('ai-rendered-content')) return;

      let rect = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        // Prevent wobble/tilt if mouse is over tool output result box or controls inside card
        if (e.target.closest('#dedicated-tool-output-wrap, #dedicated-tool-output, .inline-tool-output, .ai-rendered-content')) {
          card.style.transform = 'none';
          return;
        }

        if (!rect) {
          rect = card.getBoundingClientRect();
        }
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        rect = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
});
