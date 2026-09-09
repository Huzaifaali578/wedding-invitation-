/* ============================================
   COUNTDOWN.JS — Wedding Countdown Timer
   Target: October 23, 2026 at 8:00 PM IST
   ============================================ */

(function() {
  'use strict';

  // Wedding date: October 23, 2026, 8:00 PM IST (UTC+5:30)
  const WEDDING_DATE = new Date('2026-10-23T20:00:00+05:30');

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');
  const messageEl = document.getElementById('countdown-message');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  let lastVals = { days: null, hours: null, mins: null, secs: null };

  function padZero(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function popEl(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'countdownPop 0.3s ease-out';
  }

  function tick() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';

      if (messageEl) {
        messageEl.textContent = '🌙 The auspicious celebration has commenced! ✨';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dStr = String(days);
    const hStr = padZero(hours);
    const mStr = padZero(mins);
    const sStr = padZero(secs);

    if (lastVals.days !== dStr) {
      daysEl.textContent = dStr;
      popEl(daysEl);
      lastVals.days = dStr;
    }
    if (lastVals.hours !== hStr) {
      hoursEl.textContent = hStr;
      popEl(hoursEl);
      lastVals.hours = hStr;
    }
    if (lastVals.mins !== mStr) {
      minsEl.textContent = mStr;
      popEl(minsEl);
      lastVals.mins = mStr;
    }
    if (lastVals.secs !== sStr) {
      secsEl.textContent = sStr;
      lastVals.secs = sStr;
    }

    if (messageEl) {
      if (days > 30) {
        const months = Math.floor(days / 30);
        messageEl.textContent = `${months} month${months > 1 ? 's' : ''} until the blessed union`;
      } else if (days > 0) {
        messageEl.textContent = `${days} day${days > 1 ? 's' : ''} to go · Alhamdulillah`;
      } else if (hours > 0) {
        messageEl.textContent = 'Tonight is the blessed celebration! 🌙';
      } else {
        messageEl.textContent = 'Just moments away ✨';
      }
    }
  }

  tick();
  setInterval(tick, 1000);

})();
