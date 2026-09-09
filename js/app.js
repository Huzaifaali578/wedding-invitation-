/* ============================================
   APP.JS — Cinematic Wedding Experience
   Hero Entrance, IntersectionObserver, Gold Dust, Video
   ============================================ */

(function() {
  'use strict';

  // ===== Hero Entrance Sequence =====
  function triggerHeroAnimation() {
    const heroElements = document.querySelectorAll('.anim-hero');
    // Staggered reveals via css classes + visible trigger
    requestAnimationFrame(() => {
      heroElements.forEach((el) => {
        el.classList.add('visible');
      });
    });
  }

  // Run hero animation when fonts & DOM are ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setTimeout(triggerHeroAnimation, 150);
    });
  } else {
    window.addEventListener('load', () => {
      setTimeout(triggerHeroAnimation, 150);
    });
  }

  // Safety fallback
  setTimeout(triggerHeroAnimation, 1000);

  // ===== Scroll Reveal via IntersectionObserver =====
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-slow, .reveal-scale, .line-expand');
    
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  // ===== Video Player & Custom Play Overlay =====
  function initVideo() {
    const video = document.getElementById('wedding-video');
    const overlay = document.getElementById('video-play-btn');
    if (!video || !overlay) return;

    function playVideo() {
      if (video.paused) {
        video.play().then(() => {
          overlay.classList.add('hidden');
        }).catch(err => {
          console.log('Video play error:', err);
        });
      } else {
        video.pause();
      }
    }

    overlay.addEventListener('click', playVideo);
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });

    video.addEventListener('play', () => overlay.classList.add('hidden'));
    video.addEventListener('pause', () => overlay.classList.remove('hidden'));
    video.addEventListener('ended', () => overlay.classList.remove('hidden'));
  }

  // ===== Ambient Gold Dust (Subtle Canvas Particles) =====
  function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let isTabActive = true;

    // Mobile-optimized count: light and silky
    const count = window.innerWidth < 480 ? 14 : 22;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.6,
        vy: -(Math.random() * 0.25 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.45 + 0.1,
        dOpacity: (Math.random() - 0.5) * 0.006,
        hue: 38 + Math.random() * 12,
        sat: 65 + Math.random() * 20,
        light: 58 + Math.random() * 12
      };
    }

    function initPool() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;
        p.opacity += p.dOpacity;

        if (p.opacity <= 0.05 || p.opacity >= 0.55) {
          p.dOpacity = -p.dOpacity;
        }

        // Recycle off screen
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${p.opacity})`;
        ctx.fill();
      }

      if (isTabActive) {
        animId = requestAnimationFrame(draw);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabActive = false;
        cancelAnimationFrame(animId);
      } else {
        isTabActive = true;
        draw();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initPool();
      }, 200);
    });

    resize();
    initPool();
    draw();
  }

  // ===== Initialize =====
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initVideo();
    initParticles();
  });

})();
