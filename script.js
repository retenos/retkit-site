/* ═══════════════════════════════════════
   RETKIT V3 — Interactions
   60fps GPU compositing throughout
   ═══════════════════════════════════════ */

(() => {
  'use strict';

  // ─── Cursor glow (desktop only) ───
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ─── Intersection Observer for reveals ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-float, .ps-card, .tl-step, .bento-card--hero').forEach((el) => {
    revealObserver.observe(el);
  });

  // ─── Header + sticky CTA ───
  const header = document.getElementById('header');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('header--scrolled', y > 50);

      const stickyCta = document.getElementById('stickyCta');
      if (stickyCta) {
        stickyCta.classList.toggle('sticky-cta--visible', y > 500);
      }

      updateTimelineProgress();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── Timeline progress ───
  function updateTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    const bar = document.getElementById('timelineProgress');
    if (!timeline || !bar) return;

    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top >= vh || rect.bottom <= 0) {
      bar.style.height = '0%';
      return;
    }
    const pct = Math.min(Math.max((vh - rect.top) / rect.height, 0), 1) * 100;
    bar.style.height = pct + '%';
  }

  // ─── Counter animations ───
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

  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (target === 0) { el.textContent = '0'; return; }
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Phone screen switcher ───
  const dots = document.querySelectorAll('.phone-dot');
  const screens = document.querySelectorAll('.phone-screen');
  let currentScreen = 0;
  let autoplayTimer;

  function switchScreen(idx) {
    screens.forEach((s) => {
      s.classList.remove('active');
      s.style.transform = 'translateX(20px)';
    });
    dots.forEach((d) => d.classList.remove('active'));

    screens[idx].classList.add('active');
    screens[idx].style.transform = 'translateX(0)';
    dots[idx].classList.add('active');
    currentScreen = idx;
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.target, 10);
      switchScreen(target);
      resetAutoplay();
    });
  });

  function autoplay() {
    autoplayTimer = setInterval(() => {
      const next = (currentScreen + 1) % screens.length;
      switchScreen(next);
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplay();
  }

  if (screens.length > 0) autoplay();

  // ─── Tilt effect on bento cards (desktop) ───
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── Smooth anchor scrolling ───
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Init ───
  onScroll();
})();
