/* ============================================
   APP.JS — Cinematic Video Intro & Experience
   Video Lifecycle, Audio Toggle, Ambient Dust, Scroll Reveals
   ============================================ */

(function() {
  'use strict';

  // ===== Elements =====
  const video = document.getElementById('hero-video');
  const poster = document.getElementById('hero-video-poster');
  const soundToggle = document.getElementById('sound-toggle');
  const soundLabel = document.getElementById('sound-label-text');
  const progressBar = document.getElementById('hero-video-progress-bar');
  const replayBtn = document.getElementById('replay-btn');
  const enterBtn = document.getElementById('enter-btn');

  // ===== 1. Cinematic Video Hero Lifecycle =====
  function initHeroVideo() {
    if (!video) return;

    let isVideoReady = false;

    // Smooth reveal: poster -> video crossfade
    function revealVideo() {
      if (isVideoReady) return;
      isVideoReady = true;

      // Make video visible with smooth opacity transition
      video.classList.add('visible');

      // Softly fade out poster
      setTimeout(() => {
        if (poster) poster.classList.add('fade-out');
      }, 350);
    }

    // Try autoplay muted (required for mobile browser permission)
    video.muted = true;

    // Listen to video loading states
    video.addEventListener('loadeddata', () => {
      // Ensure video plays
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          revealVideo();
        }).catch(() => {
          // Autoplay was blocked (e.g. Low Power Mode): poster remains visible as graceful fallback
          console.log('Autoplay muted deferred — poster active');
        });
      }
    });

    video.addEventListener('playing', revealVideo);
    video.addEventListener('canplay', revealVideo);

    // Fallback: if video takes too long or fails, keep poster and allow full interaction
    video.addEventListener('error', () => {
      console.log('Video load notice: falling back to high-res poster artwork.');
      if (poster) poster.classList.remove('fade-out');
    });

    // ===== Sound On / Off Control =====
    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        if (video.muted) {
          video.muted = false;
          soundToggle.classList.add('unmuted');
          soundToggle.setAttribute('aria-pressed', 'true');
          if (soundLabel) soundLabel.textContent = 'Sound On';

          // If paused, ensure it's playing
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          video.muted = true;
          soundToggle.classList.remove('unmuted');
          soundToggle.setAttribute('aria-pressed', 'false');
          if (soundLabel) soundLabel.textContent = 'Sound';
        }
      });
    }

    // ===== Progress Bar & Video Timeline =====
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const progress = (video.currentTime / video.duration) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress.toFixed(1)}%`;
      }

      // Smooth transition preparation near video ending (last 1.2 seconds)
      if (video.currentTime >= video.duration - 1.2 && !video.classList.contains('fade-transition')) {
        video.classList.add('fade-transition');
      }
    });

    // ===== Video Natural Ending Transition =====
    video.addEventListener('ended', () => {
      // Show replay option
      if (replayBtn) {
        replayBtn.style.display = 'inline-flex';
      }

      // If user hasn't scrolled yet after 1.8s, smoothly hint to next section
      setTimeout(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY < 80) {
          const invSection = document.getElementById('invitation');
          if (invSection) {
            invSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 1600);
    });

    // ===== Replay Action =====
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        video.currentTime = 0;
        video.classList.remove('fade-transition');
        video.play().then(() => {
          replayBtn.style.display = 'none';
        }).catch(() => {});
      });
    }

    // ===== Resource Conservation: Pause video when scrolled past hero =====
    let wasPlayingBeforeScroll = false;
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = window.innerHeight;

      if (scrollY > heroHeight * 1.1) {
        if (!video.paused) {
          wasPlayingBeforeScroll = true;
          video.pause();
        }
      } else {
        if (video.paused && wasPlayingBeforeScroll && !video.ended) {
          video.play().catch(() => {});
          wasPlayingBeforeScroll = false;
        }
      }
    }, { passive: true });
  }

  // ===== 2. Hero Text Reveals =====
  function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.anim-hero');
    requestAnimationFrame(() => {
      heroElements.forEach(el => el.classList.add('visible'));
    });
  }

  // ===== 3. Scroll Reveal via IntersectionObserver =====
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

  // ===== 4. Ambient Gold Dust Canvas =====
  function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let isTabActive = true;

    // Lightweight count for silky 60fps on mobile
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
        vy: -(Math.random() * 0.22 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.45 + 0.1,
        dOpacity: (Math.random() - 0.5) * 0.005,
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

  // ===== Initialize Everything =====
  document.addEventListener('DOMContentLoaded', () => {
    initHeroVideo();
    initScrollReveal();
    initParticles();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(triggerHeroAnimations, 150);
      });
    } else {
      setTimeout(triggerHeroAnimations, 300);
    }
  });

})();
