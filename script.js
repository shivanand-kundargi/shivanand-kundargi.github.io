// UI interactions
document.addEventListener('DOMContentLoaded', function() {
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
