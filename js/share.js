/* ============================================
   SHARE.JS — Sharing & Progressive RSVP Flow
   Web Share API + WhatsApp + Interactive RSVP
   ============================================ */

(function() {
  'use strict';

  // ===== Web Share / WhatsApp Share =====
  const shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Husain & Fatema — Wedding Invitation',
        text: 'You are cordially invited to the wedding celebration of Husain & Fatema on Friday, 23rd October 2026 at Hussaini Baug Camp, Pune. 8:00 PM onwards. 🌙✨',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log('Share error:', err);
          }
        }
      } else {
        const text = encodeURIComponent(
          `You are cordially invited to the wedding celebration of Husain & Fatema on Friday, 23rd October 2026 at Hussaini Baug Camp, Pune. 8:00 PM onwards. 🌙✨\n\n${window.location.href}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // ===== Progressive RSVP Flow =====
  const btnAccept = document.getElementById('btn-accept');
  const btnDecline = document.getElementById('btn-decline');
  const choiceBtns = document.getElementById('rsvp-choice-btns');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpAccepted = document.getElementById('rsvp-accepted');
  const rsvpDeclined = document.getElementById('rsvp-declined');
  const btnDeclineWhatsapp = document.getElementById('btn-decline-whatsapp');

  if (btnAccept && choiceBtns && rsvpForm) {
    btnAccept.addEventListener('click', () => {
      choiceBtns.style.display = 'none';
      rsvpForm.classList.add('show');
      const nameInput = document.getElementById('rsvp-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 150);
    });
  }

  if (btnDecline && choiceBtns && rsvpDeclined) {
    btnDecline.addEventListener('click', () => {
      choiceBtns.style.display = 'none';
      rsvpDeclined.classList.add('show');
    });
  }

  // RSVP Target Phone Number (Nisreen Ben)
  const RSVP_PHONE = '919890504752';

  if (btnDeclineWhatsapp) {
    btnDeclineWhatsapp.addEventListener('click', () => {
      const text = encodeURIComponent(
        `🌙 *Wedding Greetings for Husain & Fatema*\n\n` +
        `Warmest congratulations to both families on this blessed union. Regretfully I may not be able to attend in person, but my heartfelt prayers and best wishes are with the couple!`
      );
      window.open(`https://wa.me/${RSVP_PHONE}?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('rsvp-name');
      const guestsInput = document.getElementById('rsvp-guests');
      const name = nameInput ? nameInput.value.trim() : '';
      const guests = guestsInput ? guestsInput.value : '1';

      if (!name) {
        if (nameInput) {
          nameInput.style.borderColor = 'var(--burgundy)';
          nameInput.focus();
          setTimeout(() => {
            nameInput.style.borderColor = '';
          }, 2000);
        }
        return;
      }

      // Format elegant WhatsApp message
      const msg = encodeURIComponent(
        `🌙 *Wedding RSVP — Husain & Fatema*\n\n` +
        `Name: ${name}\n` +
        `Guests Attending: ${guests}\n` +
        `Attendance: Joyfully Accept ✨\n\n` +
        `_Sent via wedding invitation_`
      );

      // Open WhatsApp directly to +91 98905 04752
      window.open(`https://wa.me/${RSVP_PHONE}?text=${msg}`, '_blank', 'noopener,noreferrer');

      // Update UI to accepted state
      rsvpForm.classList.remove('show');
      rsvpForm.style.display = 'none';
      if (rsvpAccepted) {
        rsvpAccepted.classList.add('show');
      }
    });
  }

})();
