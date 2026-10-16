document.querySelectorAll('.navbar').forEach((navbar) => {
  const toggle = navbar.querySelector('.navbar-toggle');
  const menu = navbar.querySelector('.navbar-menu');
  const backdrop = navbar.querySelector('.nav-backdrop');
  const icon = toggle?.querySelector('i');

  if (!toggle || !menu || !backdrop) {
    return;
  }

  const closeMenu = () => {
    navbar.classList.remove('is-open');
    menu.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    menu.setAttribute('aria-hidden', String(window.innerWidth <= 768));
    backdrop.setAttribute('aria-hidden', 'true');
    menu.style.display = window.innerWidth <= 768 ? 'none' : '';
    if (icon) {
      icon.classList.replace('fa-xmark', 'fa-bars');
      icon.classList.replace('fa-times', 'fa-bars');
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('is-open');
    menu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menu.setAttribute('aria-hidden', String(!isOpen));
    backdrop.setAttribute('aria-hidden', String(!isOpen));
    menu.style.display = isOpen ? 'flex' : 'none';
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
    }
  });

  backdrop.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    closeMenu();
  });

  window.matchMedia('(max-width: 768px)').addEventListener('change', closeMenu);

  closeMenu();
});
