/** Shared interactions for the portfolio homepage. */
(() => {
  'use strict';

  const select = (selector, all = false) => (
    all ? [...document.querySelectorAll(selector)] : document.querySelector(selector)
  );
  const scrollToSection = (selector) => select(selector)?.scrollIntoView({ behavior: 'smooth' });
  const navigationLinks = select('#navbar .scrollto', true);
  const backToTop = select('.back-to-top');

  const updatePageState = () => {
    const position = window.scrollY + 200;
    navigationLinks.forEach((link) => {
      const section = link.hash && select(link.hash);
      const isActive = section && position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', Boolean(isActive));
    });
    backToTop?.classList.toggle('active', window.scrollY > 100);
  };

  navigationLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!select(link.hash)) return;
    event.preventDefault();
    document.body.classList.remove('mobile-nav-active');
    select('.mobile-nav-toggle')?.classList.replace('bi-x', 'bi-list');
    scrollToSection(link.hash);
  }));

  select('.mobile-nav-toggle')?.addEventListener('click', (event) => {
    document.body.classList.toggle('mobile-nav-active');
    event.currentTarget.classList.toggle('bi-list');
    event.currentTarget.classList.toggle('bi-x');
  });

  window.addEventListener('scroll', updatePageState, { passive: true });
  window.addEventListener('load', () => {
    select('#preloader')?.remove();
    updatePageState();
    if (window.location.hash) scrollToSection(window.location.hash);
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true, mirror: false });
  });

  const typedElement = select('.typed');
  if (typedElement) {
    new Typed('.typed', {
      strings: typedElement.dataset.typedItems.split(','),
      loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000,
    });
  }

  window.openTab = (tabName) => {
    select('.tab-content', true).forEach((tab) => tab.classList.remove('active'));
    select('.tab', true).forEach((button) => button.classList.remove('active'));
    document.getElementById(tabName)?.classList.add('active');
    select(`button[data-tab="${tabName}"]`)?.classList.add('active');
  };

  select('.video-container', true).forEach((container) => {
    const spinner = container.querySelector('.spinner');
    const media = container.querySelector('iframe, video, img');
    if (!spinner || !media) return;
    const hideSpinner = () => { spinner.hidden = true; };
    media.addEventListener(media.tagName === 'VIDEO' ? 'loadeddata' : 'load', hideSpinner, { once: true });
    media.addEventListener('error', hideSpinner, { once: true });
    if (media.tagName === 'IMG' && media.complete) hideSpinner();
  });

})();
