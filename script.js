/* =====================================================
   ABHISHEK KUMAR — PORTFOLIO SCRIPT
   Features: Loader, Cursor, Nav, Reveal Animations,
             Skill Bars, Counters, Testimonials Slider,
             Form Validation, Theme Toggle, Back to Top
   ===================================================== */

'use strict';

/* ── DOM HELPERS ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  // Small buffer so the animation completes cleanly
  setTimeout(() => {
    const loader = $('#loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger entry animations
      triggerHeroReveal();
    }
  }, 1600);
});

function triggerHeroReveal() {
  $$('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 120);
  });
}

/* ══════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════ */
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .project-card, .service-card, .testi-card, .pill';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '0.4'; });
})();

/* ══════════════════════════════════════════════════
   3. STICKY NAV + ACTIVE SECTION HIGHLIGHT
══════════════════════════════════════════════════ */
(function initNav() {
  const nav      = $('#nav');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  // Scroll state
  function onScroll() {
    // Scrolled class
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    const backTop = $('#backTop');
    if (backTop) backTop.classList.toggle('show', window.scrollY > 400);

    // Active link
    let currentSection = '';
    sections.forEach(sec => {
      const offset = sec.offsetTop - 120;
      if (window.scrollY >= offset) currentSection = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();

/* ══════════════════════════════════════════════════
   4. MOBILE MENU (HAMBURGER)
══════════════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  });
})();

/* ══════════════════════════════════════════════════
   5. THEME TOGGLE (LIGHT / DARK)
══════════════════════════════════════════════════ */
(function initTheme() {
  const toggle   = $('#themeToggle');
  const icon     = $('#themeIcon');
  const html     = document.documentElement;

  // Read saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
})();

/* ══════════════════════════════════════════════════
   6. SCROLL REVEAL (INTERSECTION OBSERVER)
══════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    // Skip hero elements (animated by loader callback)
    if (!el.closest('.hero')) observer.observe(el);
  });
})();

/* ══════════════════════════════════════════════════
   7. ANIMATED SKILL BARS
══════════════════════════════════════════════════ */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        fills.forEach(fill => {
          const target = fill.getAttribute('data-width') + '%';
          // Small delay so the reveal animation plays first
          setTimeout(() => { fill.style.width = target; }, 300);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = $('#skills');
  if (skillsSection) observer.observe(skillsSection);
})();

/* ══════════════════════════════════════════════════
   8. COUNTER ANIMATION (STATS)
══════════════════════════════════════════════════ */
(function initCounters() {
  const counters = $$('[data-target]');
  let counted = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1600; // ms
          const step = target / (duration / 16);
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current).toLocaleString();
            }
          }, 16);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const hero = $('#hero');
  if (hero) observer.observe(hero);
})();

/* ══════════════════════════════════════════════════
   9. TESTIMONIALS SLIDER
══════════════════════════════════════════════════ */
(function initTestimonials() {
  const track   = $('#testiTrack');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  const dotsWrap = $('#testiDots');

  if (!track) return;

  const cards      = $$('.testi-card', track);
  const totalCards = cards.length;
  let perView      = window.innerWidth <= 768 ? 1 : 2;
  let currentIndex = 0;
  const totalSlides = Math.ceil(totalCards / perView);

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    $$('.testi-dot', dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth   = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${currentIndex * perView * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Auto-play
  let autoPlay = setInterval(() => {
    const next = (currentIndex + 1) >= totalSlides ? 0 : currentIndex + 1;
    goTo(next);
  }, 5000);

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      const next = (currentIndex + 1) >= totalSlides ? 0 : currentIndex + 1;
      goTo(next);
    }, 5000);
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
  });

  // Responsive recalculation
  window.addEventListener('resize', () => {
    const newPerView = window.innerWidth <= 768 ? 1 : 2;
    if (newPerView !== perView) {
      perView = newPerView;
      currentIndex = 0;
      buildDots();
      goTo(0);
    }
  });

  buildDots();
  goTo(0);
})();

/* ══════════════════════════════════════════════════
   10. CONTACT FORM VALIDATION
══════════════════════════════════════════════════ */
(function initForm() {
  const form        = $('#contactForm');
  if (!form) return;

  const fields = {
    fname:    { el: $('#fname'),    err: $('#fnameError'),    validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    femail:   { el: $('#femail'),   err: $('#femailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    fsubject: { el: $('#fsubject'), err: $('#fsubjectError'), validate: v => v.trim().length >= 3 ? '' : 'Please enter a subject.' },
    fmessage: { el: $('#fmessage'), err: $('#fmessageError'), validate: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.' },
  };

  // Real-time validation
  Object.values(fields).forEach(({ el, err, validate }) => {
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        err.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;

    Object.values(fields).forEach(({ el, err, validate }) => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) return;

    // Simulate submit (replace with real endpoint as needed)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

      const successMsg = $('#formSuccess');
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1800);
  });
})();

/* ══════════════════════════════════════════════════
   11. BACK TO TOP
══════════════════════════════════════════════════ */
(function initBackTop() {
  const btn = $('#backTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════
   12. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════
   13. SERVICE CARDS — STAGGER ON SCROLL
══════════════════════════════════════════════════ */
(function staggerServiceCards() {
  const cards = $$('.service-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // stagger each card slightly
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--delay')) || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.classList.add('reveal-up');
    observer.observe(card);
  });
})();

/* ══════════════════════════════════════════════════
   14. PROJECT CARDS — TILT EFFECT (SUBTLE)
══════════════════════════════════════════════════ */
(function initTilt() {
  // Only on non-touch devices
  if (!matchMedia('(hover: hover)').matches) return;

  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const midX  = rect.width  / 2;
      const midY  = rect.height / 2;
      const tiltX = ((y - midY) / midY) * 5;
      const tiltY = ((x - midX) / midX) * -5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });
})();

/* ══════════════════════════════════════════════════
   15. TYPING EFFECT — HERO TAGLINE
══════════════════════════════════════════════════ */
(function initTyping() {
  const titles = [
    'Digital Marketing Specialist',
    'Graphic Designer',
    'Brand Strategist',
    'Paid Advertising Expert',
  ];

  // Find the element that shows the first part of the title
  const el = document.querySelector('.hero-title');
  if (!el) return;

  // We'll insert a separate span after the page is ready
  // Only proceed if hero is visible (i.e. not during loading)
  let titleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typingTimeout;

  const typingSpan = document.createElement('span');
  typingSpan.id = 'typingText';
  typingSpan.style.borderRight = '2px solid var(--gold)';
  typingSpan.style.paddingRight = '2px';

  // Replace static first text with typed version
  const divider = el.querySelector('.title-divider');
  if (divider) {
    el.insertBefore(typingSpan, divider);
    el.childNodes[0].remove(); // remove old text node if any
  }

  function type() {
    const current = titles[titleIndex];
    if (isDeleting) {
      typingSpan.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingSpan.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingTimeout = setTimeout(type, 2200);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingTimeout = setTimeout(type, 400);
    } else {
      typingTimeout = setTimeout(type, isDeleting ? 50 : 85);
    }
  }

  // Start after loader
  setTimeout(type, 2200);
})();

/* ══════════════════════════════════════════════════
   16. INIT — Log ready state
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c AK Portfolio Loaded ✦ ', 'background:#c9a84c;color:#0d0f14;font-size:14px;padding:4px 8px;border-radius:4px;font-weight:bold;');
});
