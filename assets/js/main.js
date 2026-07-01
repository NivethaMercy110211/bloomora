/**
 * BLOOMORA - Main JavaScript
 * Handles: Navbar, Dark Mode, RTL, Animations, Mobile Menu, FAQ, Gallery Filter
 */

(function () {
  'use strict';

  // --- Theme ----------------------------------------------------------
  const themeKey = 'bloomora-theme';
  const dirKey   = 'bloomora-dir';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(themeKey, theme);
    document.querySelectorAll('.theme-icon-moon').forEach(el => {
      el.style.display = theme === 'dark' ? 'none' : '';
    });
    document.querySelectorAll('.theme-icon-sun').forEach(el => {
      el.style.display = theme === 'dark' ? '' : 'none';
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(dirKey, dir);
    document.querySelectorAll('.dir-label').forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  // Apply saved preferences on load
  const savedTheme = localStorage.getItem(themeKey) || 'light';
  const savedDir   = localStorage.getItem(dirKey) || 'ltr';
  applyTheme(savedTheme);
  applyDir(savedDir);

  // Bind theme/dir toggle buttons
  document.addEventListener('click', function (e) {
    if (e.target.closest('.toggle-theme-btn')) toggleTheme();
    if (e.target.closest('.toggle-dir-btn')) toggleDir();
  });

  // --- Navbar ---------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // --- Mobile Menu ----------------------------------------------------
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);

      // Reset and re-trigger animations
      const links = mobileMenu.querySelectorAll('.mobile-nav-link');
      links.forEach(link => {
        link.style.animation = 'none';
        link.offsetHeight; // reflow
        link.style.animation = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // --- Active Nav Link ------------------------------------------------
  (function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  // --- Scroll Animations ----------------------------------------------
  function initAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));

    // Image reveal
    const imgReveals = document.querySelectorAll('.img-reveal');
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    imgReveals.forEach(el => revealObserver.observe(el));
  }

  // --- FAQ Accordion --------------------------------------------------
  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', function () {
        const item = this.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // --- Gallery Filter -------------------------------------------------
  function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('[data-category]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.filter;
        filterItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          if (show) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
              item.style.pointerEvents = '';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.pointerEvents = 'none';
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // --- Password Toggle ------------------------------------------------
  function initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const field = this.previousElementSibling;
        if (!field) return;
        const isPassword = field.type === 'password';
        field.type = isPassword ? 'text' : 'password';
        const icon = this.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        }
      });
    });
  }

  // --- Smooth Counter (Stats) ------------------------------------------
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.count;
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const duration = 1800;
          const step = target / (duration / 16);
          const interval = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = Math.floor(start).toLocaleString() + suffix;
            if (start >= target) clearInterval(interval);
          }, 16);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // --- Newsletter Form -------------------------------------------------
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        if (!btn) return;
        const original = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Sent!';
          form.reset();
          setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
          }, 2500);
        }, 1200);
      });
    });
  }

  // --- Init ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initAnimations();
    initFaq();
    initGalleryFilter();
    initPasswordToggle();
    initCounters();
    initForms();
  });

})();
