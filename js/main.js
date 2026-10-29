/**
 * DATWEB SISTEMAS - CORE APPLICATION SCRIPT
 * 3D Parallax, Mouse Tilt, Acessibilidade (WCAG), Micro-interações e Alta Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer
  const mobileToggleBtn = document.getElementById('mobile-menu-btn');
  const mainNavMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && mainNavMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      mainNavMenu.classList.toggle('open');
      const isExpanded = mainNavMenu.classList.contains('open');
      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close on navigation click
    mainNavMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNavMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Sticky Header Elevation
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Smooth Back to Top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Product Ecosystem Tabs
  const productTabBtns = document.querySelectorAll('.tab-btn');
  const productPanels = document.querySelectorAll('.tab-content-panel');

  productTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      productTabBtns.forEach(b => b.classList.remove('active'));
      productPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // Product and content cards remain stationary for comfortable reading.

  // 5. Hero Parallax Mouse Motion & 3D Orbit Physics
  const heroSection = document.querySelector('.hero-full-section');
  const heroStage = document.getElementById('hero-stage');

  if (heroSection && heroStage) {
    const cardTop = heroStage.querySelector('.orbit-card-top');
    const cardMid = heroStage.querySelector('.orbit-card-mid');
    const cardBot = heroStage.querySelector('.orbit-card-bot');
    const orbitPill = heroStage.querySelector('.hero-orbit-pill');
    const aura = heroStage.querySelector('.hero-blue-aura');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5;
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;

      if (cardTop) cardTop.style.transform = `translate3d(${xRel * -26}px, ${yRel * -20}px, 15px)`;
      if (cardMid) cardMid.style.transform = `translate3d(${xRel * 28}px, ${yRel * -24}px, 25px)`;
      if (cardBot) cardBot.style.transform = `translate3d(${xRel * -20}px, ${yRel * 24}px, 20px)`;
      if (orbitPill) orbitPill.style.transform = `translate3d(${xRel * 14}px, ${yRel * 14}px, 10px)`;
      if (aura) aura.style.transform = `translate(${xRel * 35}px, ${yRel * 35}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      if (cardTop) cardTop.style.transform = 'translate3d(0, 0, 0)';
      if (cardMid) cardMid.style.transform = 'translate3d(0, 0, 0)';
      if (cardBot) cardBot.style.transform = 'translate3d(0, 0, 0)';
      if (orbitPill) orbitPill.style.transform = 'translate3d(0, 0, 0)';
      if (aura) aura.style.transform = 'translate(0, 0)';
    });
  }

  // Helper: Highlight product in hero
  window.highlightHeroProduct = function(productName) {
    const chips = document.querySelectorAll('.product-chip');
    chips.forEach(chip => chip.classList.remove('active'));

    const targetChip = Array.from(chips).find(c => c.getAttribute('onclick')?.includes(productName));
    if (targetChip) targetChip.classList.add('active');

    const orbitCards = document.querySelectorAll('.hero-orbit-card');
    orbitCards.forEach(c => c.classList.remove('highlighted'));

    const activeOrbit = document.querySelector(`.hero-orbit-card[data-product="${productName}"]`);
    if (activeOrbit) {
      activeOrbit.classList.add('highlighted');
      setTimeout(() => {
        activeOrbit.classList.remove('highlighted');
      }, 2600);
    }
  };

  // 6. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 7. Number Counter Animation (RequestAnimationFrame)
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 2200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * ease;

        if (decimals > 0) {
          counter.textContent = prefix + currentVal.toFixed(decimals) + suffix;
        } else {
          counter.textContent = prefix + Math.floor(currentVal).toLocaleString('pt-BR') + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (decimals > 0) {
            counter.textContent = prefix + target.toFixed(decimals) + suffix;
          } else {
            counter.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
          }
        }
      }
      requestAnimationFrame(update);
    });
  }

  // 8. Scroll-Triggered Animations (IntersectionObserver)
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        if (entry.target.classList.contains('metrics-strip') || entry.target.closest('.metrics-strip')) {
          runCounters();
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-on-scroll, .metrics-strip').forEach(el => {
    scrollObserver.observe(el);
  });

  // 9. Modal Management
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  };

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.classList.remove('modal-open');
    }
  });

  // 10. LGPD Cookie Consent
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAcceptCookies = document.getElementById('btn-accept-cookies');

  if (cookieBanner && btnAcceptCookies) {
    if (!localStorage.getItem('datweb_cookies_accepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1200);
    }

    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('datweb_cookies_accepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }
});
