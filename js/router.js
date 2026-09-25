(() => {
  const panels = ['home', 'work', 'about', 'contact'];
  const appShell = document.getElementById('app-shell');
  const track = document.getElementById('panel-track');
  if (!appShell || !track) return;

  function panelFromHash() {
    const name = location.hash.replace('#', '');
    return panels.includes(name) ? name : 'home';
  }

  function goTo(name, { skipHistory = false } = {}) {
    const idx = Math.max(0, panels.indexOf(name));
    track.style.transform = `translateX(-${idx * 25}%)`;
    appShell.dataset.panel = name;

    if (!skipHistory) {
      const url = name === 'home' ? location.pathname + location.search : '#' + name;
      history.pushState({ panel: name }, '', url);
    }

    const target = document.getElementById('panel-' + name);
    const heading = target && target.querySelector('h1, h2');
    if (heading) heading.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-panel]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(el.dataset.panel);
    });
  });

  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', () => goTo('home'));

  window.addEventListener('popstate', () => goTo(panelFromHash(), { skipHistory: true }));

  // Initial paint: jump to the right panel with no animation, then re-enable transitions.
  track.classList.add('no-transition');
  goTo(panelFromHash(), { skipHistory: true });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => track.classList.remove('no-transition'));
  });
})();
