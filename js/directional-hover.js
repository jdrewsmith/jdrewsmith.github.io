(() => {
  function setOrigin(e, el) {
    const rect = el.getBoundingClientRect();
    const fromLeft = e.clientX - rect.left < rect.width / 2;
    el.style.setProperty('--origin-x', fromLeft ? '0%' : '100%');
  }

  document.querySelectorAll('.home-nav-item').forEach((item) => {
    item.addEventListener('pointerenter', (e) => setOrigin(e, item));
    item.addEventListener('pointerleave', (e) => setOrigin(e, item));
  });
})();
