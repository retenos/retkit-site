/* ═══════════════════════════════════════
   RETKIT V2 — Interactions
   All animations use transform/opacity
   for 60fps GPU compositing
   ═══════════════════════════════════════ */

(() => {
  'use strict';

  // --- Intersection Observer for reveals ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-float').forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Header background
        header.classList.toggle('header--scrolled', scrollY > 60);

        // Sticky CTA (mobile)
        const stickyCta = document.getElementById('stickyCta');
        if (stickyCta) {
          stickyCta.classList.toggle('sticky-cta--visible', scrollY > 600);
        }

        // Steps progress line
        updateStepsProgress();

        lastScroll = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Steps progress line ---
  function updateStepsProgress() {
    const stepsSection = document.querySelector('.steps');
    const progressBar = document.getElementById('stepsProgress');
    if (!stepsSection || !progressBar) return;

    const rect = stepsSection.getBoundingClientRect();
    const viewportH = window.innerHeight;

    if (rect.top >= viewportH || rect.bottom <= 0) {
      progressBar.style.height = '0%';
      return;
    }

    const total = rect.height;
    const scrolled = viewportH - rect.top;
    const pct = Math.min(Math.max(scrolled / total, 0), 1) * 100;
    progressBar.style.height = pct + '%';
  }

  // --- Counter animation ---
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Trigger initial state ---
  onScroll();
})();
