/**
 * Husain & Fatema — Wedding RSVP
 * Clean, modularized interactive experience
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    phone: '919890504752', // Direct RSVP destination phone number
    weddingDetails: {
      groomAndBride: 'Husain & Fatema',
      date: 'Friday, 23rd October 2026',
      time: '8:00 PM Onwards',
      venue: 'Hussaini Baug Camp, Pune'
    }
  };

  // ==========================================
  // 1. AMBIENT GOLD PARTICLES
  // ==========================================
  function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let active = true;
    const count = window.innerWidth < 480 ? 16 : 24;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.2 + 0.05),
        vx: (Math.random() - 0.5) * 0.14,
        o: Math.random() * 0.4 + 0.05,
        do: (Math.random() - 0.5) * 0.005,
        h: 36 + Math.random() * 14,
        s: 60 + Math.random() * 25,
        l: 55 + Math.random() * 18
      };
    }

    function init() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.o += p.do;

        if (p.o <= 0.03 || p.o >= 0.5) p.do = -p.do;
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.o = 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${p.o})`;
        ctx.fill();
      }

      if (active) animId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(animId);
      } else {
        active = true;
        draw();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        init();
      }, 200);
    });

    resize();
    init();
    draw();
  }

  // ==========================================
  // 2. VIDEO HERO & SOUND CONTROLLER
  // ==========================================
  function initVideoController() {
    const video = document.getElementById('hero-video');
    const soundToggle = document.getElementById('sound-toggle');
    const soundLabel = document.getElementById('sound-label-text');
    const progressBar = document.getElementById('hero-progress-bar');
    const replayBtn = document.getElementById('replay-btn');

    if (!video) return;

    video.muted = true;

    function revealVideo() {
      video.classList.add('visible');
    }

    // Video playback & reveal
    video.addEventListener('loadeddata', () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.then(revealVideo).catch(() => {});
      }
    });
    video.addEventListener('playing', revealVideo, { once: true });

    // Sound toggle control
    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted) {
          video.muted = false;
          soundToggle.classList.add('unmuted');
          soundToggle.setAttribute('aria-pressed', 'true');
          if (soundLabel) soundLabel.textContent = 'On';
          if (video.paused) video.play().catch(() => {});
        } else {
          video.muted = true;
          soundToggle.classList.remove('unmuted');
          soundToggle.setAttribute('aria-pressed', 'false');
          if (soundLabel) soundLabel.textContent = 'Sound';
        }
      });
    }

    // Progress bar and fade-out near end
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
      if (video.currentTime >= video.duration - 1.2 && !video.classList.contains('fade-transition')) {
        video.classList.add('fade-transition');
      }
    });

    // Auto-scroll to RSVP on video completion
    video.addEventListener('ended', () => {
      if (replayBtn) replayBtn.style.display = 'inline-flex';
      setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop < 80) {
          const rsvpSection = document.getElementById('rsvp');
          if (rsvpSection) rsvpSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    });

    // Replay button
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

    // Pause video when scrolled out of view to preserve resources
    let wasPlaying = false;
    window.addEventListener('scroll', () => {
      const sy = window.scrollY || document.documentElement.scrollTop;
      if (sy > window.innerHeight * 1.1) {
        if (!video.paused) {
          wasPlaying = true;
          video.pause();
        }
      } else if (video.paused && wasPlaying && !video.ended) {
        video.play().catch(() => {});
        wasPlaying = false;
      }
    }, { passive: true });
  }

  // ==========================================
  // 3. UI REVEALS & SCROLL ANIMATIONS
  // ==========================================
  function revealHero() {
    ['hero-names', 'hero-date', 'hero-actions', 'hero-progress'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('visible');
    });
  }

  function initCardReveal() {
    const card = document.getElementById('rsvp-card');
    if (!card) return;

    if (!('IntersectionObserver' in window)) {
      card.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(card);
  }

  // ==========================================
  // 4. CONFETTI CELEBRATION
  // ==========================================
  function fireConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#D4AF37', '#F3DC94', '#B38F28', '#8C1D40', '#A82848', '#FFF9F2'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      const x = 50 + (Math.random() - 0.5) * 30;
      const y = 50;
      piece.style.left = x + '%';
      piece.style.top = y + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (4 + Math.random() * 6) + 'px';
      piece.style.height = (4 + Math.random() * 6) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 400;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 300;
      const rot = Math.random() * 720 - 360;

      piece.animate([
        { opacity: 1, transform: 'translate(0, 0) rotate(0deg)' },
        { opacity: 0, transform: `translate(${dx}px, ${dy + 600}px) rotate(${rot}deg)` }
      ], {
        duration: 1200 + Math.random() * 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 2500);
  }

  // ==========================================
  // 5. RSVP FLOW & WHATSAPP ROUTING
  // ==========================================
  function initRsvpController() {
    const btnAccept = document.getElementById('btn-accept');
    const btnDecline = document.getElementById('btn-decline');
    const choices = document.getElementById('rsvp-choices');
    const form = document.getElementById('rsvp-form');
    const accepted = document.getElementById('rsvp-accepted');
    const declined = document.getElementById('rsvp-declined');
    const btnDeclineWa = document.getElementById('btn-decline-wa');

    // Click "Joyfully Accept" -> Show guest input form
    if (btnAccept && choices && form) {
      btnAccept.addEventListener('click', () => {
        choices.style.display = 'none';
        form.classList.add('show');
        const nameInput = document.getElementById('rsvp-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 150);
      });
    }

    // Click "Regretfully Decline" -> Show gentle message & WhatsApp wish option
    if (btnDecline && choices && declined) {
      btnDecline.addEventListener('click', () => {
        choices.style.display = 'none';
        declined.classList.add('show');
      });
    }

    // Send wishes via WhatsApp on decline
    if (btnDeclineWa) {
      btnDeclineWa.addEventListener('click', () => {
        const text = encodeURIComponent(
          `💥 *Wedding Greetings for ${CONFIG.weddingDetails.groomAndBride}*\n\n` +
          `Warmest congratulations! Regretfully I cannot attend, but my heartfelt wishes and prayers are with you both!`
        );
        window.open(`https://wa.me/${CONFIG.phone}?text=${text}`, '_blank');
      });
    }

    // Form submit -> Validate, send details via WhatsApp, show accepted state
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('rsvp-name');
        const guestsInput = document.getElementById('rsvp-guests');
        const name = nameInput ? nameInput.value.trim() : '';
        const guests = guestsInput ? guestsInput.value : '1';

        if (!name) {
          if (nameInput) {
            nameInput.style.borderColor = '#C4836A';
            nameInput.focus();
            setTimeout(() => { nameInput.style.borderColor = ''; }, 2000);
          }
          return;
        }

        const msg = encodeURIComponent(
          `💥 *Wedding RSVP — ${CONFIG.weddingDetails.groomAndBride}*\n\n` +
          `*Name:* ${name}\n` +
          `*Guests:* ${guests}\n` +
          `*Status:* Joyfully Accept ✨\n\n` +
          `_Sent via wedding invitation_`
        );

        window.open(`https://wa.me/${CONFIG.phone}?text=${msg}`, '_blank');

        form.classList.remove('show');
        form.style.display = 'none';
        if (accepted) accepted.classList.add('show');

        fireConfetti();
      });
    }
  }

  // Helper: Get clean canonical URL without any hash (#rsvp) or query params
  function getCleanUrl() {
    return window.location.href.split('#')[0].split('?')[0];
  }

  // ==========================================
  // 6. SHARE INVITATION
  // ==========================================
  function initShareController() {
    const shareBtn = document.getElementById('share-btn');
    const waShareBtn = document.getElementById('whatsapp-share-btn');
    const cleanUrl = getCleanUrl();
    const shareText = `Please RSVP for the wedding of ${CONFIG.weddingDetails.groomAndBride}. ${CONFIG.weddingDetails.date}, 8PM, ${CONFIG.weddingDetails.venue}. 💥✨`;

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: `${CONFIG.weddingDetails.groomAndBride} — Wedding RSVP`,
          text: shareText,
          url: cleanUrl
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            // User cancelled or dismissed share sheet
          }
        } else {
          const text = encodeURIComponent(`${shareText}\n${cleanUrl}`);
          window.open(`https://wa.me/?text=${text}`, '_blank');
        }
      });
    }

    if (waShareBtn) {
      waShareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = encodeURIComponent(`${shareText}\n${cleanUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      });
    }
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initVideoController();
    initCardReveal();
    initRsvpController();
    initShareController();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(revealHero, 150));
    } else {
      setTimeout(revealHero, 300);
    }
  });
})();
