(() => {
  const el = document.getElementById('rotating-headline');
  if (!el) return;

  // Dummy placeholder statements — swap for real positioning copy later.
  const statements = [
    'Designing <span class="accent">systems</span>, not just screens.',
    '<span class="accent">12 years</span> turning ambiguity into shipped product.',
    'I build the frameworks <span class="accent">other designers</span> build within.',
    '<span class="accent">Enterprise-scale</span> thinking, startup-speed execution.',
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || statements.length <= 1) return;

  const INTERVAL_MS = 4200;
  const FADE_MS = 240; // matches --duration-moderate

  let index = 0;

  function next() {
    index = (index + 1) % statements.length;
    el.classList.add('is-changing');
    window.setTimeout(() => {
      el.innerHTML = statements[index];
      el.classList.remove('is-changing');
    }, FADE_MS);
  }

  window.setInterval(next, INTERVAL_MS);
})();
