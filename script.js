// UI interactions
document.addEventListener('DOMContentLoaded', function() {
  const root = document.documentElement;

  // ── Theme & Accessibility Controller ────────────────────────
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const a11yToggleBtn = document.getElementById('a11y-toggle-btn');
  const a11yMenu = document.getElementById('a11y-menu');
  const a11yResetBtn = document.getElementById('a11y-reset-btn');
  const contrastChk = document.getElementById('a11y-contrast-chk');
  const underlineChk = document.getElementById('a11y-underline-chk');
  const motionChk = document.getElementById('a11y-motion-chk');
  const themeOptBtns = document.querySelectorAll('[data-theme-set]');
  const textSizeBtns = document.querySelectorAll('[data-text-size]');

  function getTheme() {
    return root.getAttribute('data-theme') || 'night';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}

    if (themeToggleBtn) {
      const isDay = theme === 'day';
      themeToggleBtn.setAttribute('aria-label', isDay ? 'Switch to Night mode' : 'Switch to Day mode');
      themeToggleBtn.setAttribute('title', isDay ? 'Switch to Night mode' : 'Switch to Day mode');
    }

    themeOptBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-set') === theme);
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const nextTheme = getTheme() === 'day' ? 'night' : 'day';
      setTheme(nextTheme);
    });
  }

  themeOptBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      setTheme(this.getAttribute('data-theme-set'));
    });
  });

  // Text Scaling
  function setTextScale(scale) {
    if (scale === 'normal') {
      root.removeAttribute('data-text-scale');
    } else {
      root.setAttribute('data-text-scale', scale);
    }
    try {
      localStorage.setItem('portfolio-text-scale', scale);
    } catch (e) {}

    textSizeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-text-size') === scale);
    });
  }

  textSizeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      setTextScale(this.getAttribute('data-text-size'));
    });
  });

  // High Contrast
  if (contrastChk) {
    contrastChk.addEventListener('change', function() {
      const active = this.checked;
      if (active) {
        root.setAttribute('data-contrast', 'high');
      } else {
        root.removeAttribute('data-contrast');
      }
      try {
        localStorage.setItem('portfolio-contrast', active ? 'high' : 'normal');
      } catch (e) {}
    });
  }

  // Underline Links
  if (underlineChk) {
    underlineChk.addEventListener('change', function() {
      const active = this.checked;
      if (active) {
        root.setAttribute('data-underline', 'true');
      } else {
        root.removeAttribute('data-underline');
      }
      try {
        localStorage.setItem('portfolio-underline', active ? 'true' : 'false');
      } catch (e) {}
    });
  }

  // Reduce Motion
  if (motionChk) {
    motionChk.addEventListener('change', function() {
      const active = this.checked;
      if (active) {
        root.setAttribute('data-reduce-motion', 'true');
      } else {
        root.removeAttribute('data-reduce-motion');
      }
      try {
        localStorage.setItem('portfolio-reduce-motion', active ? 'true' : 'false');
      } catch (e) {}
    });
  }

  // Accessibility Dropdown Menu Toggle
  if (a11yToggleBtn && a11yMenu) {
    a11yToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isHidden = a11yMenu.hasAttribute('hidden');
      if (isHidden) {
        a11yMenu.removeAttribute('hidden');
        a11yToggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        a11yMenu.setAttribute('hidden', '');
        a11yToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function(e) {
      if (!a11yMenu.contains(e.target) && !a11yToggleBtn.contains(e.target)) {
        a11yMenu.setAttribute('hidden', '');
        a11yToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !a11yMenu.hasAttribute('hidden')) {
        a11yMenu.setAttribute('hidden', '');
        a11yToggleBtn.setAttribute('aria-expanded', 'false');
        a11yToggleBtn.focus();
      }
    });
  }

  // Reset to Defaults
  if (a11yResetBtn) {
    a11yResetBtn.addEventListener('click', function() {
      setTheme('night');
      setTextScale('normal');
      if (contrastChk) contrastChk.checked = false;
      if (underlineChk) underlineChk.checked = false;
      if (motionChk) motionChk.checked = false;
      root.removeAttribute('data-contrast');
      root.removeAttribute('data-underline');
      root.removeAttribute('data-reduce-motion');
      try {
        localStorage.removeItem('portfolio-theme');
        localStorage.removeItem('portfolio-text-scale');
        localStorage.removeItem('portfolio-contrast');
        localStorage.removeItem('portfolio-underline');
        localStorage.removeItem('portfolio-reduce-motion');
      } catch (e) {}
    });
  }

  // Sync initial UI with active state
  const initialTheme = root.getAttribute('data-theme') || 'night';
  themeOptBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-set') === initialTheme);
  });
  const initialScale = root.getAttribute('data-text-scale') || 'normal';
  textSizeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-text-size') === initialScale);
  });
  if (contrastChk) contrastChk.checked = root.getAttribute('data-contrast') === 'high';
  if (underlineChk) underlineChk.checked = root.getAttribute('data-underline') === 'true';
  if (motionChk) motionChk.checked = root.getAttribute('data-reduce-motion') === 'true';

  // ── Existing Navigation & Interactions ──────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const active = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    });

    // Close mobile menu when clicking on a link
    const navLinkElements = document.querySelectorAll('.nav-links a');
    navLinkElements.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Project filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (filterButtons.length && cards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          card.style.display = (filter === '*' || card.matches(filter)) ? '' : 'none';
        });
      });
    });
  }

  // Navbar scroll effect — add .scrolled class for enhanced glassmorphism
  const nav = document.querySelector('.nav');
  if (nav) {
    function updateNav() {
      if (window.scrollY > 32) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // Scroll-driven entrance animations via IntersectionObserver
  const animatedElements = document.querySelectorAll('.animate-in');
  if (animatedElements.length && 'IntersectionObserver' in window) {
    // Track how many elements have been revealed so we can stagger
    let revealDelay = 0;

    const observer = new IntersectionObserver(
      function(entries) {
        // Sort entries by their position in the DOM for consistent staggering
        const visibleEntries = entries.filter(e => e.isIntersecting);

        visibleEntries.forEach(function(entry, index) {
          // Small stagger: each element in the same batch gets a slight delay
          const delay = index * 80; // 80ms between each
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: make everything visible immediately
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }
});
