(() => {
  const canvas = document.getElementById('hero-grid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;

  const GAP = 32;
  const RADIUS = 160;
  const ARM_MIN = 3;
  const ARM_MAX = 6;
  const LINE_MIN = 1;
  const LINE_MAX = 1.75;
  const EASE = 0.12;
  const DOT_COLOR = [22, 22, 22];   // gray-100
  const GLOW_COLOR = [15, 98, 254]; // blue-60

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0, height = 0, dpr = 1;
  let points = [];
  let mouse = { x: -9999, y: -9999 };
  let running = false;

  function buildGrid() {
    points = [];
    const cols = Math.ceil(width / GAP) + 1;
    const rows = Math.ceil(height / GAP) + 1;
    const offsetX = (width - (cols - 1) * GAP) / 2;
    const offsetY = (height - (rows - 1) * GAP) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        points.push({ x: offsetX + c * GAP, y: offsetY + r * GAP, active: 0 });
      }
    }
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of points) {
      const t = p.active;
      const arm = ARM_MIN + (ARM_MAX - ARM_MIN) * t;
      const lineWidth = LINE_MIN + (LINE_MAX - LINE_MIN) * t;
      const rC = DOT_COLOR[0] + (GLOW_COLOR[0] - DOT_COLOR[0]) * t;
      const gC = DOT_COLOR[1] + (GLOW_COLOR[1] - DOT_COLOR[1]) * t;
      const bC = DOT_COLOR[2] + (GLOW_COLOR[2] - DOT_COLOR[2]) * t;
      const alpha = 0.12 + 0.55 * t;
      ctx.strokeStyle = `rgba(${rC | 0}, ${gC | 0}, ${bC | 0}, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(p.x - arm, p.y);
      ctx.lineTo(p.x + arm, p.y);
      ctx.moveTo(p.x, p.y - arm);
      ctx.lineTo(p.x, p.y + arm);
      ctx.stroke();
    }
  }

  function tick() {
    let anyActive = false;
    for (const p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const target = dist < RADIUS ? 1 - dist / RADIUS : 0;
      p.active += (target - p.active) * EASE;
      if (Math.abs(target - p.active) > 0.001 || p.active > 0.001) anyActive = true;
    }
    draw();
    if (anyActive) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function startLoop() {
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function setMouseFromEvent(e) {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  hero.addEventListener('pointermove', (e) => {
    setMouseFromEvent(e);
    if (reduceMotion) {
      draw(); // instant, no continuous animation
      for (const p of points) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.active = dist < RADIUS ? 1 - dist / RADIUS : 0;
      }
      draw();
    } else {
      startLoop();
    }
  });

  hero.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
    if (reduceMotion) {
      for (const p of points) p.active = 0;
      draw();
    } else {
      startLoop();
    }
  });

  window.addEventListener('resize', resize);
  resize();
})();
