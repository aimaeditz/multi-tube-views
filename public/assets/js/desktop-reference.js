/**
 * Multi Tube Views (MTV) — Desktop Reference Design System Interactivity
 * Handles scroll reveals, number counting, and 3D card tilt effects (Desktop only).
 */

document.addEventListener('DOMContentLoaded', () => {
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
    if (isReducedMotion) {
      countElements.forEach(el => {
        const target = el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target + suffix;
      });
    } else {
      const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1000; // Snappy, fluid 1.0s timing
        let startTime = null;
        let lastVal = -1;

        function updateCounter(currentTime) {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Smooth Quartic Out: fast responsive ramp with seamless continuous landing
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentVal = Math.floor(easeProgress * target);

          if (currentVal !== lastVal) {
            el.textContent = currentVal + suffix;
            lastVal = currentVal;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
      };

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

  // 3. 3D Mouse Tilt on Hover for Desktop Cards
  const tiltCards = document.querySelectorAll('.tilt-card, .story-panel, .step-card-desk, .stat-card-desk');
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  if (supportsHover && !isReducedMotion && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
});
