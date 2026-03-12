/* ============================================================
   CARIBE VILLAS — LUXURY VILLA IN PUNTA CANA
   Handles: Language Switch, Scroll Animations, Form Validation,
            Header Scroll Effect, Smooth Scrolling, Mobile Nav,
            Active Nav Tracking, Video Fallback
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. DOM READY WRAPPER
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Initialize Lucide Icons ── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }



  /* ──────────────────────────────────────────────
     2. LANGUAGE SWITCHER (EN / ES)
     ────────────────────────────────────────────── */

  /** Supported languages */
  const LANGUAGES = ['en', 'es'];

  /**
   * Detects the user's preferred language from the browser,
   * checks localStorage for a saved preference, and returns
   * a supported language code.
   * @returns {'en' | 'es'}
   */
  function detectLanguage() {
    // 1. Check localStorage for saved preference
    const saved = localStorage.getItem('caribe-lang');
    if (saved && LANGUAGES.includes(saved)) return saved;

    // 2. Auto-detect from browser
    const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
    return LANGUAGES.includes(browserLang) ? browserLang : 'en';
  }

  /** Current active language */
  let currentLang = detectLanguage();

  /** All translatable elements (those with both data-en and data-es) */
  const translatableEls = document.querySelectorAll('[data-en][data-es]');

  /** All inputs/textareas with placeholder translations */
  const translatableInputs = document.querySelectorAll('[data-placeholder-en][data-placeholder-es]');

  /** Language toggle buttons */
  const btnEN = document.getElementById('btn-en');
  const btnES = document.getElementById('btn-es');

  /**
   * Sets the active language across the entire page.
   * Updates text content, placeholders, html lang attribute,
   * button active states, and persists to localStorage.
   * @param {string} lang - 'en' or 'es'
   */
  function setLanguage(lang) {
    currentLang = lang;

    // Update <html> lang attribute for accessibility / SEO
    document.documentElement.lang = lang;

    // Update all translatable text nodes
    translatableEls.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });

    // Update input placeholders
    translatableInputs.forEach(input => {
      const placeholder = input.getAttribute(`data-placeholder-${lang}`);
      if (placeholder) input.placeholder = placeholder;
    });

    // Update button active states
    if (btnEN && btnES) {
      btnEN.classList.toggle('active', lang === 'en');
      btnES.classList.toggle('active', lang === 'es');
    }

    // Update document title based on language
    if (lang === 'es') {
      document.title = 'Villa de Lujo en Venta en Punta Cana | Townhouse Cerca de la Playa US$ 345,000 — Compra Directa del Propietario';
    } else {
      document.title = 'Luxury Villa for Sale in Punta Cana | Near-Beach Townhouse US$ 345,000 — Buy Direct from Owner';
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (lang === 'es') {
        metaDesc.setAttribute('content', 'Villa townhouse de lujo cerca de la playa en venta en Punta Cana, República Dominicana. 4 habitaciones, 3.5 baños, 245 m². Acabados en piedra coral, cocina italiana, jacuzzi para 8, terraza en azotea con minibar. A pasos de Playa Los Corales — top 10 playas del mundo. Venta directa del propietario, sin intermediarios. US$ 345,000. Propiedad ideal para inversión con alto potencial de alquiler en Airbnb. Elegible para exención fiscal Confotur.');
      } else {
        metaDesc.setAttribute('content', 'Luxury villa for sale near the beach in Punta Cana, Dominican Republic. 4 bedrooms, 3.5 baths, 245 sqm townhouse with coral stone finishes, Italian kitchen, jacuzzi for 8, rooftop terrace & minibar. Steps from Playa Los Corales — top 10 beach in the world. For sale by owner, no brokers. US$ 345,000. Ideal Caribbean investment property with high Airbnb rental income potential. Confotur tax exemption eligible.');
      }
    }

    // Update brochure link with current language
    const brochureLink = document.querySelector('a.btn-brochure');
    if (brochureLink) brochureLink.href = 'brochure.html?lang=' + lang;

    // Persist preference
    localStorage.setItem('caribe-lang', lang);
  }

  // Attach click handlers to language buttons
  if (btnEN) btnEN.addEventListener('click', () => setLanguage('en'));
  if (btnES) btnES.addEventListener('click', () => setLanguage('es'));

  // Apply the detected language on load
  setLanguage(currentLang);


  /* ──────────────────────────────────────────────
     3. MOBILE NAVIGATION MENU
     ────────────────────────────────────────────── */

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const siteNav = document.getElementById('site-nav');
  const body = document.body;

  if (mobileMenuBtn && siteNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenuBtn.classList.toggle('open');
      siteNav.classList.toggle('open', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    siteNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        siteNav.classList.remove('open');
        body.style.overflow = '';
      });
    });

    // Close menu when clicking on the dark overlay (not on a link)
    siteNav.addEventListener('click', (e) => {
      if (e.target === siteNav) {
        mobileMenuBtn.classList.remove('open');
        siteNav.classList.remove('open');
        body.style.overflow = '';
      }
    });
  }


  /* ──────────────────────────────────────────────
     4. SCROLL ANIMATIONS (Intersection Observer)
     ────────────────────────────────────────────── */

  /**
   * Uses IntersectionObserver to add the `.visible` class
   * when elements with `.animate-on-scroll` enter the viewport.
   */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once revealed
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }


  /* ──────────────────────────────────────────────
     5. HEADER SCROLL EFFECT (Glassmorphism)
     ────────────────────────────────────────────── */

  const header = document.getElementById('site-header');

  /**
   * Adds/removes the `.scrolled` class on the header
   * based on scroll position.
   */
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }


  /* ──────────────────────────────────────────────
     6. ACTIVE NAV LINK TRACKING
     ────────────────────────────────────────────── */

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];

  // Collect all sections referenced by nav links
  navLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const section = document.querySelector(targetId);
      if (section) sections.push({ el: section, link: link });
    }
  });

  /**
   * Highlights the nav link corresponding to the currently
   * visible section.
   */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    let activeIdx = 0;
    sections.forEach((s, i) => {
      if (s.el.offsetTop <= scrollPos) {
        activeIdx = i;
      }
    });

    navLinks.forEach(l => l.classList.remove('active'));
    if (sections[activeIdx]) {
      sections[activeIdx].link.classList.add('active');
    }
  }


  /* ──────────────────────────────────────────────
     UNIFIED SCROLL HANDLER
     ────────────────────────────────────────────── */

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleHeaderScroll();
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Run once on load
  handleHeaderScroll();
  updateActiveNav();


  /* ──────────────────────────────────────────────
     7. SMOOTH SCROLLING (Anchor Links)
     ────────────────────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      // Skip empty hashes
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  /* ──────────────────────────────────────────────
     8. CONTACT FORM VALIDATION
     ────────────────────────────────────────────── */

  const contactForm = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather fields
      const name = contactForm.querySelector('#form-name');
      const email = contactForm.querySelector('#form-email');
      const buyerConfirm = contactForm.querySelector('#form-buyer-confirm');

      // Reset error state
      formError.classList.remove('show');

      // Validation checks
      let isValid = true;

      if (!name.value.trim()) {
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        isValid = false;
      }

      if (!buyerConfirm.checked) {
        isValid = false;
      }

      if (!isValid) {
        formError.classList.add('show');
        return;
      }

      // ── Form is valid ──
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    });
  }

  /**
   * Simple email format validation using regex.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }


  /* ──────────────────────────────────────────────
     9. VIDEO FALLBACK
     ────────────────────────────────────────────── */

  /**
   * If the hero video fails to load, ensure the poster
   * image is visible by hiding the video element.
   * More lenient for GitHub Pages / slow connections.
   */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Listen for errors on sources
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
    }, true);

    // Attempt to play (required for some browsers)
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented - keep showing poster
        heroVideo.style.display = 'none';
      });
    }

    // Longer timeout for slower connections (e.g. GitHub Pages)
    setTimeout(() => {
      if (heroVideo.readyState < 2 && heroVideo.networkState !== 2) {
        heroVideo.style.display = 'none';
      }
    }, 8000);
  }


  /* ──────────────────────────────────────────────
     10. PARALLAX EFFECT — PROPERTY SHOWCASE IMAGE
     ────────────────────────────────────────────── */

  const showcaseImg = document.querySelector('.property-showcase-img');
  if (showcaseImg) {
    const showcaseContainer = showcaseImg.closest('.property-showcase');

    function handleParallax() {
      if (!showcaseContainer) return;
      const rect = showcaseContainer.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only animate when in viewport
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translateY = (progress - 0.5) * 60; // max ±30px movement
        showcaseImg.style.transform = `translateY(${translateY}px)`;
      }
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(handleParallax);
    }, { passive: true });

    handleParallax();
  }


  /* ──────────────────────────────────────────────
     11. INLINE FORM VALIDATION (Real-time)
     ────────────────────────────────────────────── */

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  function showFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  function showFieldValid(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  function clearField(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.remove('invalid', 'valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  // Name validation
  if (nameInput && nameError) {
    nameInput.addEventListener('blur', () => {
      const val = nameInput.value.trim();
      if (val.length === 0) {
        showFieldError(nameInput, nameError, currentLang === 'es' ? 'Por favor ingrese su nombre' : 'Please enter your name');
      } else if (val.length < 2) {
        showFieldError(nameInput, nameError, currentLang === 'es' ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters');
      } else {
        showFieldValid(nameInput, nameError);
      }
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('invalid') && nameInput.value.trim().length >= 2) {
        showFieldValid(nameInput, nameError);
      }
    });
  }

  // Email validation
  if (emailInput && emailError) {
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (val.length === 0) {
        showFieldError(emailInput, emailError, currentLang === 'es' ? 'Por favor ingrese su correo electrónico' : 'Please enter your email');
      } else if (!isValidEmail(val)) {
        showFieldError(emailInput, emailError, currentLang === 'es' ? 'Por favor ingrese un correo electrónico válido' : 'Please enter a valid email address');
      } else {
        showFieldValid(emailInput, emailError);
      }
    });
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('invalid') && isValidEmail(emailInput.value.trim())) {
        showFieldValid(emailInput, emailError);
      }
    });
  }

  // Phone validation
  if (phoneInput && phoneError) {
    phoneInput.addEventListener('blur', () => {
      const val = phoneInput.value.trim();
      if (val.length > 0 && !/^[+]?[0-9\s\-()]{7,20}$/.test(val)) {
        showFieldError(phoneInput, phoneError, currentLang === 'es' ? 'Por favor ingrese un número de teléfono válido' : 'Please enter a valid phone number');
      } else if (val.length > 0) {
        showFieldValid(phoneInput, phoneError);
      } else {
        clearField(phoneInput, phoneError);
      }
    });
    phoneInput.addEventListener('input', () => {
      if (phoneInput.classList.contains('invalid')) {
        const val = phoneInput.value.trim();
        if (/^[+]?[0-9\s\-()]{7,20}$/.test(val)) {
          showFieldValid(phoneInput, phoneError);
        }
      }
    });
  }


  /* ──────────────────────────────────────────────
     12. LIGHTBOX GALLERY
     ────────────────────────────────────────────── */

  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

  let currentLightboxIndex = 0;
  const galleryImages = [];

  // Collect gallery image data
  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxOverlay || !galleryImages[index]) return;
    currentLightboxIndex = index;
    updateLightboxImage();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    // Only restore overflow if mobile menu is not open
    if (!siteNav || !siteNav.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  function updateLightboxImage() {
    if (!lightboxImg || !galleryImages[currentLightboxIndex]) return;
    const data = galleryImages[currentLightboxIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    if (lightboxCaption) lightboxCaption.textContent = data.alt;
    if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  // Click gallery items to open lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-lightbox'), 10);
      openLightbox(idx);
    });
  });

  // Lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

  // Close on overlay click (not on image or buttons)
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // Touch/swipe support for lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextLightbox();
        else prevLightbox();
      }
    }, { passive: true });
  }


}); // end DOMContentLoaded
