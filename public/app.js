(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'vxcv-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- Theme switch: system (default) / light / dark ----

  function readChoice() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function applyChoice(choice) {
    if (choice === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', choice);

    try {
      if (choice === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, choice);
    } catch (e) {}

    document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === choice));
    });

    // Explicit choice pins both theme-color metas; system restores the media-matched pair.
    var colors = { light: '#F4F5F7', dark: '#0B0D12' };
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      var scheme = meta.media.indexOf('dark') !== -1 ? 'dark' : 'light';
      meta.content = colors[choice === 'system' ? scheme : choice];
    });
  }

  document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyChoice(btn.dataset.themeChoice); });
  });
  applyChoice(readChoice());

  // ---- Heading decode: scrambles into "Welcome" once on load ----

  var glyphs = document.querySelector('.welcome-glyphs');
  if (glyphs && !reduceMotion.matches) {
    var target = glyphs.textContent;
    var pool = 'vxcVXC01<>/#_';
    var frame = 0;
    var timer = setInterval(function () {
      frame++;
      var out = '';
      for (var i = 0; i < target.length; i++) {
        // Each letter settles a couple of frames after the one before it.
        out += frame > 6 + i * 2 ? target[i] : pool[Math.floor(Math.random() * pool.length)];
      }
      glyphs.textContent = out;
      if (out === target) clearInterval(timer);
    }, 40);
  }

  // ---- Lit tiles: occasional accent flicker on x tiles ----
  // Must match the SVG pattern: 72px cells, 60px tiles inset 6px,
  // letter at column i / row j is "vxc"[(i + j) % 3].

  var layer = document.querySelector('.lit-layer');
  var pattern = document.getElementById('tile-pattern');
  var CELL = 72;
  var MAX_LIT = 5;
  var originX = 0;
  var originY = 0;

  // Center the grid so both edges clip evenly. The origin starts one cell
  // off-screen, so column/row 0 is always the partially visible edge cell.
  function centerGrid() {
    originX = (window.innerWidth % CELL) / 2 - CELL;
    originY = (window.innerHeight % CELL) / 2 - CELL;
    pattern.setAttribute('x', originX);
    pattern.setAttribute('y', originY);
  }
  centerGrid();
  window.addEventListener('resize', centerGrid);

  function spawn() {
    if (document.hidden || reduceMotion.matches || layer.childElementCount >= MAX_LIT) return;
    var cols = Math.ceil((window.innerWidth - originX) / CELL);
    var rows = Math.ceil((window.innerHeight - originY) / CELL);
    var j = Math.floor(Math.random() * rows);
    var i = Math.floor(Math.random() * cols);
    i += (1 - ((i + j) % 3) + 3) % 3; // nudge right to the nearest x column in this row
    if (i >= cols) i -= 3;
    if (i < 0) return;

    var tile = document.createElement('div');
    tile.className = 'lit';
    tile.textContent = 'x';
    tile.style.left = originX + i * CELL + 6 + 'px';
    tile.style.top = originY + j * CELL + 6 + 'px';
    tile.addEventListener('animationend', function () { tile.remove(); });
    layer.appendChild(tile);
  }

  if (layer) setInterval(spawn, 900);
})();
