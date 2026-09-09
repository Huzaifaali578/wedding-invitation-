/* ============================================
   NAVIGATION.JS — Floating Toggle & Overlay
   Smooth scrolling, toggle morph, active section
   ============================================ */

(function() {
  'use strict';

  const navToggle = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('[data-nav]');

  if (!navToggle || !navOverlay) return;

  // ===== Reveal Toggle after scrolling past initial view =====
  let isToggleVisible = false;

  function handleScrollVisibility() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = 160;

    if (scrollY > threshold && !isToggleVisible) {
      navToggle.classList.add('visible');
      isToggleVisible = true;
    } else if (scrollY <= threshold && !navToggle.classList.contains('active')) {
      navToggle.classList.remove('visible');
      isToggleVisible = false;
    }
  }

  window.addEventListener('scroll', handleScrollVisibility, { passive: true });
  handleScrollVisibility();

  // ===== Open / Close Navigation Menu =====
  function openNav() {
    navToggle.classList.add('active', 'visible');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('active');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    handleScrollVisibility();
  }

  function toggleNav() {
    if (navOverlay.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  navToggle.addEventListener('click', toggleNav);

  // Close when clicking outside of nav-inner content
  navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
      closeNav();
    }
  });

  // ===== Smooth Scroll on Nav Link Click =====
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      closeNav();

      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 250);
      }
    });
  });

  // ===== Active Section Highlighting =====
  function initActiveTracking() {
    const scenes = document.querySelectorAll('section[id], footer[id]');
    if (!('IntersectionObserver' in window) || scenes.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '-10% 0px -50% 0px'
    });

    scenes.forEach(scene => observer.observe(scene));
  }

  document.addEventListener('DOMContentLoaded', initActiveTracking);

})();
