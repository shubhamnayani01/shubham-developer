/* ════════════════════════════════════════════
   SHUBHAM NAYANI — main.js
   All interactivity and animations
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM Ready ───────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavLinks();
    initContactForm();
    initWAFabPulse();
  }

  /* ═════════════════════════════════════════
     NAVBAR — scroll shadow + active state
  ═════════════════════════════════════════ */
  function initNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = throttle(function () {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, 50);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ═════════════════════════════════════════
     MOBILE MENU
  ═════════════════════════════════════════ */
  function initMobileMenu() {
    const hamburger   = document.getElementById('hamburger');
    const overlay     = document.getElementById('mobileOverlay');
    const closeBtn    = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!hamburger || !overlay) return;

    function openMenu() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on backdrop click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });

    // Close when link clicked
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
    });
  }

  /* ═════════════════════════════════════════
     SCROLL ANIMATIONS (IntersectionObserver)
  ═════════════════════════════════════════ */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ═════════════════════════════════════════
     ACTIVE NAV LINK on scroll
  ═════════════════════════════════════════ */
  function initActiveNavLinks() {
    const sections  = document.querySelectorAll('section[id], div[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
              link.classList.toggle('active', href === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ═════════════════════════════════════════
     SMOOTH SCROLL for anchor links
  ═════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

/*=====================
            FAQ
======================*/

document.querySelectorAll(".faq-question").forEach(btn=>{
  btn.addEventListener("click",()=>{
    btn.parentElement.classList.toggle("active");
  });
});


  /*========================
  social
  ========================*/
  // card logic
   const cards = document.querySelectorAll(".card");
    const container = document.getElementById("cards");

    container.addEventListener("mousemove", (e) => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        card.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      });
    });

    container.addEventListener("mouseleave", () => {
      cards.forEach(card => {
        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");
      });
    });
  /* ═════════════════════════════════════════
     CONTACT FORM → WhatsApp
  ═════════════════════════════════════════ */
  function initContactForm() {
    const submitBtn   = document.getElementById('cfSubmit');
    const formEl      = document.getElementById('contactForm');
    const successEl   = document.getElementById('formSuccess');

    if (!submitBtn || !formEl || !successEl) return;

    submitBtn.addEventListener('click', function () {
      const name    = getValue('fname');
      const phone   = getValue('fphone');
      const btype   = getValue('fbtype');
      const pkg     = getValue('fpackage');
      const msg     = getValue('fmsg');

      // Basic validation
      if (!name || !phone) {
        shakeField(!name ? 'fname' : 'fphone');
        return;
      }
      if (phone.replace(/\D/g, '').length < 10) {
        shakeField('fphone');
        return;
      }

      // Show loading state
      const btnText    = submitBtn.querySelector('.cf-submit-text');
      const btnLoading = submitBtn.querySelector('.cf-submit-loading');
      if (btnText)    btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      submitBtn.disabled = true;

      const waMessage = encodeURIComponent(
        'Hi Shubham! I\'m interested in a website.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Business: ' + (btype || 'Not specified') + '\n' +
        'Package: ' + (pkg || 'Not specified') + '\n\n' +
        'Message: ' + (msg || 'Please contact me.')
      );

      // Short delay for UX, then show success & open WhatsApp
      setTimeout(function () {
        formEl.style.display = 'none';
        successEl.hidden = false;
        window.open('https://wa.me/919427209737?text=' + waMessage, '_blank');
      }, 900);
    });
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function shakeField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#f87171';
    el.focus();
    el.classList.add('shake');
    setTimeout(function () {
      el.classList.remove('shake');
    }, 500);
  }

  /* ═════════════════════════════════════════
     WA FAB — subtle entrance
  ═════════════════════════════════════════ */
  function initWAFabPulse() {
    const fab = document.querySelector('.wa-fab');
    if (!fab) return;
    // Delay entrance
    fab.style.opacity = '0';
    fab.style.transform = 'scale(0.5) translateY(20px)';
    fab.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(function () {
      fab.style.opacity = '1';
      fab.style.transform = 'scale(1) translateY(0)';
    }, 2000);
  }

  /* ═════════════════════════════════════════
     UTILITY — throttle
  ═════════════════════════════════════════ */
  function throttle(fn, delay) {
    let last = 0;
    return function () {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

})();

/* ─── CSS Shake keyframe (injected) ──────── */
(function injectShakeCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.4s ease !important; }
  `;
  document.head.appendChild(style);
})();
