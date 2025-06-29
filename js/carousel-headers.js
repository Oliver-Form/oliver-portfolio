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
  let keyQueue = [];
  let keyTimeout = null;
  const KEY_DELAY = 60; // ms

  function processKeyQueue() {
    if (keyQueue.length === 0) return;
    if (isTransitioning) {
      setTimeout(processKeyQueue, 8); // check more frequently for snappier feel
      return;
    }
    const next = keyQueue.shift();
    if ((next === 'h' || next === 'ArrowLeft') && current > 0) {
      showHeader(current - 1, true);
    } else if ((next === 'l' || next === 'ArrowRight') && current < headers.length - 1) {
      showHeader(current + 1, true);
    }
    if (keyQueue.length > 0) {
      setTimeout(processKeyQueue, ANIMATION_DURATION * 0.7); // overlap transitions for smoother feel
    }
  }

  // Accepts an optional 'fast' param to reduce animation duration for rapid nav
  function showHeader(targetIdx, fast) {
    if (targetIdx === current || isTransitioning) return;
    isTransitioning = true;
    headers.forEach((header) => {
      header.classList.remove('active', 'slide-left', 'slide-right');
    });
    // Update nav active state and aria-current
    navLinks.forEach((link, idx) => {
      if (idx === targetIdx) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
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
    }, fast ? ANIMATION_DURATION * 0.7 : ANIMATION_DURATION);
  }

  navLinks.forEach((link, idx) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (idx !== current) showHeader(idx);
    });
  });
  headers[0].classList.add('active');
  headers[0].style.display = 'block';

  // Set initial nav active state and aria-current
  navLinks.forEach((link, idx) => {
    if (idx === 0) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // Vim-like keybindings: h (left), l (right)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'h' && current > 0) || (e.key === 'l' && current < headers.length - 1)
        || (e.key === 'ArrowLeft' && current > 0) || (e.key === 'ArrowRight' && current < headers.length - 1)) {
      // Support h/l and arrow keys for tab switching
      keyQueue.push(e.key);
      if (!keyTimeout) {
        keyTimeout = setTimeout(() => {
          keyTimeout = null;
          processKeyQueue();
        }, KEY_DELAY);
      }
    } else if (['1','2','3','4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < headers.length && idx !== current && !isTransitioning) {
        showHeader(idx);
      }
    }
  });

  // Make entire <li> clickable for nav
  const navItems = document.querySelectorAll('.nav__list li');
  navItems.forEach((item, idx) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', e => {
      // Prevent double event if <a> is clicked
      if (e.target.closest('a')) return;
      if (idx !== current) showHeader(idx);
    });
  });
})();
 