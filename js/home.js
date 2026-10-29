/* Accessible campaign carousel with interruptible transitions. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.dw-hero');
  if (!root) return;
  const slides = [...root.querySelectorAll('.dw-slide')];
  const tabs = [...root.querySelectorAll('[data-slide]')];
  const count = root.querySelector('#dw-slide-count');
  const pause = root.querySelector('#dw-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;
  let transitionTimer;
  slides.forEach((slide, index) => {
    slide.inert = index !== 0;
    slide.setAttribute('aria-hidden', String(index !== 0));
  });
  slides[0].classList.add('is-entering');
  const show = (index) => {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;
    clearTimeout(transitionTimer);
    const outgoing = slides[current];
    slides.forEach((slide, i) => {
      slide.classList.remove('is-entering', 'is-leaving');
      slide.hidden = i !== next;
      slide.inert = i !== next;
      slide.setAttribute('aria-hidden', String(i !== next));
    });
    if (!reducedMotion) {
      outgoing.hidden = false;
      outgoing.classList.add('is-leaving');
      transitionTimer = setTimeout(() => {
        outgoing.hidden = true;
        outgoing.classList.remove('is-leaving');
      }, 560);
    }
    current = next;
    slides[current].classList.add('is-entering');
    tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === current)));
    count.textContent = `${String(current + 1).padStart(2, '0')} / 03`;
  };
  let autoplayEnabled = !reducedMotion;
  let focusWithinSlide = false;
  const syncAutoplay = () => {
    clearInterval(timer);
    timer = undefined;
    const running = autoplayEnabled && !document.hidden && !focusWithinSlide;
    if (running) timer = setInterval(() => show(current + 1), 6500);
    root.classList.toggle('has-autoplay', running);
    pause.textContent = autoplayEnabled ? 'Ⅱ' : '▶';
    pause.setAttribute('aria-label', autoplayEnabled ? 'Pausar rotação automática' : 'Iniciar rotação automática');
    pause.setAttribute('aria-pressed', String(autoplayEnabled));
    count.setAttribute('aria-live', running ? 'off' : 'polite');
  };
  const navigate = (index) => {
    show(index);
    syncAutoplay();
  };
  tabs.forEach((tab, index) => tab.addEventListener('click', () => navigate(index)));
  root.querySelector('#dw-next').addEventListener('click', () => navigate(current + 1));
  root.querySelector('#dw-prev').addEventListener('click', () => navigate(current - 1));
  pause.addEventListener('click', () => {
    autoplayEnabled = !autoplayEnabled;
    syncAutoplay();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(current + (event.key === 'ArrowRight' ? 1 : -1));
      tabs[current].focus();
    }
  });
  // Preserve keyboard focus while interacting with product links in a slide.
  root.addEventListener('focusin', (event) => {
    if (event.target.closest('.dw-slide')) {
      focusWithinSlide = true;
      syncAutoplay();
    }
  });
  root.addEventListener('focusout', (event) => {
    if (!event.relatedTarget?.closest('.dw-slide')) {
      focusWithinSlide = false;
      syncAutoplay();
    }
  });
  document.addEventListener('visibilitychange', syncAutoplay);
  syncAutoplay();
  const activateHashProduct = () => {
    const target = window.location.hash.slice(1);
    if (['tab-promobank', 'tab-lukro', 'tab-vizage'].includes(target)) {
      document.querySelector(`.tab-btn[data-target="${target}"]`)?.click();
    }
  };
  activateHashProduct();
  window.addEventListener('hashchange', activateHashProduct);
  document.querySelectorAll('[data-product]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector(`.tab-btn[data-target="${link.dataset.product}"]`)?.click();
    });
  });
});
