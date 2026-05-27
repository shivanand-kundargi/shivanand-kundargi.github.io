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
        // active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          if (filter === '*' || card.matches(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Simple scroll effect for navbar
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', function() {
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
  });
});
