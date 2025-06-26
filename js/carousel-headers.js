(function() {
  const navLinks = document.querySelectorAll('.nav__link');
  const headers = [
    document.getElementById('about-header'),
    document.getElementById('projects-header'),
    document.getElementById('writing-header'),
    document.getElementById('contact-header')
  ];
  let current = 0;
  const ANIMATION_DURATION = 600;
  let isTransitioning = false;

  function showHeader(targetIdx) {
    if (targetIdx === current || isTransitioning) return;
    isTransitioning = true;
    headers.forEach((header) => {
      header.classList.remove('active', 'slide-left', 'slide-right');
    });
    const direction = targetIdx > current ? 'right' : 'left';
    const outClass = direction === 'right' ? 'slide-left' : 'slide-right';
    const inClass = direction === 'right' ? 'slide-right' : 'slide-left';
    headers[targetIdx].classList.add(inClass);
    headers[targetIdx].style.display = 'block';
    void headers[targetIdx].offsetWidth;
    headers[current].classList.remove('active');
    headers[current].classList.add(outClass);
    headers[targetIdx].classList.remove(inClass);
    headers[targetIdx].classList.add('active');
    headers[targetIdx].style.display = 'block';
    setTimeout(() => {
      headers.forEach((header, idx) => {
        if (idx !== targetIdx) {
          header.classList.remove('active', 'slide-left', 'slide-right');
          header.style.display = 'none';
        }
      });
      current = targetIdx;
      isTransitioning = false;
    }, ANIMATION_DURATION);
  }

  navLinks.forEach((link, idx) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (idx !== current) showHeader(idx);
    });
  });
  headers[0].classList.add('active');
  headers[0].style.display = 'block';

  // Vim-like keybindings: h (left), l (right)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'h' && current > 0) {
      showHeader(current - 1);
    } else if (e.key === 'l' && current < headers.length - 1) {
      showHeader(current + 1);
    }
  });
})();
