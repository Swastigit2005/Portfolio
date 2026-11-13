/* ==========================================================
   Stretchy portrait
   - The photo is drawn on a WebGL mesh; grab it and pull to stretch it like rubber.
   - Let go and it wobbles back (spring physics per vertex).
   - Pull hard enough and my tech stack spills out as physics-driven icons.
   - Optional expression photos: drop these into /assets and they cross-fade in
       assets/swasti-pull.jpg     (shown while being pulled, e.g. surprised / "ouch")
       assets/swasti-release.jpg  (shown for a moment after letting go, e.g. laughing)
   ========================================================== */
(() => {
  const shell = document.getElementById('heroShell');
  const canvas = document.getElementById('faceCanvas');
  const anchor = document.getElementById('faceAnchor');
  const layer = document.getElementById('iconLayer');
  const sayEl = document.getElementById('faceSay');
  const hint = document.getElementById('pullHint');
  const shadow = document.getElementById('faceShadow');
  if (!shell || !canvas || !anchor) return;

  const IMG_IDLE = 'assets/swasti.jpg';
  const IMG_PULL = 'assets/swasti-pull.jpg';
  const IMG_RELEASE = 'assets/swasti-release.jpg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- speech bubble ---------------- */
  const LINES = {
    idle: ["Hi, I'm Swasti 👋", 'Go on, pull my face.', 'I build agents. Pull to see with what.'],
    light: ['Hey!', 'Ouch!', "That's my face!", 'Gently…'],
    medium: ["Okay okay, here's my stack!", 'Fine, take my tools!', 'FastAPI incoming!'],
    hard: ["That's everything I know!", "Careful, I'm load-bearing.", 'Shipping it all at once!'],
    release: ['Boing.', "Hire me and I'll stop wobbling.", 'Still in one piece ✨', 'Again?'],
    done: ['You found my whole stack! 🎉 Now see what I built with it ↓'],
  };
  let sayLevel = '';
  let sayTimer;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function say(level, force) {
    if (!sayEl || (level === sayLevel && !force)) return;
    sayLevel = level;
    sayEl.textContent = pick(LINES[level]);
    sayEl.classList.remove('pop'); void sayEl.offsetWidth; sayEl.classList.add('pop');
    clearTimeout(sayTimer);
    if (level !== 'idle' && level !== 'done') sayTimer = setTimeout(() => { if (!dragging) say('idle', true); }, 3200);
  }

  /* ---------------- WebGL setup ---------------- */
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true });
  const N = 36;                       // grid segments per side
  const V = (N + 1) * (N + 1);
  const rest = new Float32Array(V * 2);   // rest offsets in units of R (-1..1)
  const pos = new Float32Array(V * 2);    // current offsets in px
  const vel = new Float32Array(V * 2);
  const kmul = new Float32Array(V);
  const draw = new Float32Array(V * 2);   // absolute px for the GPU
  const uvs = new Float32Array(V * 2);
  for (let j = 0, n = 0; j <= N; j++) {
    for (let i = 0; i <= N; i++, n++) {
      rest[n * 2] = (i / N) * 2 - 1;
      rest[n * 2 + 1] = (j / N) * 2 - 1;
      uvs[n * 2] = i / N;
      uvs[n * 2 + 1] = j / N;
      // smooth variation across the face so it wobbles like jelly without folding over itself
      kmul[n] = 0.9 + 0.12 * Math.sin(rest[n * 2] * 1.7 + rest[n * 2 + 1] * 1.1);
    }
  }
  const idx = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }

  let prog, posBuf, texIdle, texAlt, uRes, uMix, uRing, uCrop, uCrop2, ok = false;
  const alt = { pull: null, release: null };
  let cropIdle = [0, 0, 1, 1];
  let cropAlt = [0, 0, 1, 1];

  function cropFor(img) {
    // square "cover" crop, biased slightly upward like object-position: center 30%
    const w = img.naturalWidth, h = img.naturalHeight;
    if (w >= h) { const s = h / w; return [(1 - s) / 2, 0, s, 1]; }
    const s = w / h; return [0, (1 - s) * 0.3, 1, s];
  }

  function makeTex(img) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  function initGL(img) {
    const vs = `
      attribute vec2 a_pos; attribute vec2 a_uv;
      uniform vec2 u_res; varying vec2 v_uv;
      void main() { v_uv = a_uv; gl_Position = vec4(a_pos.x / u_res.x * 2.0 - 1.0, 1.0 - a_pos.y / u_res.y * 2.0, 0.0, 1.0); }`;
    const fs = `
      precision mediump float;
      uniform sampler2D u_tex; uniform sampler2D u_tex2; uniform float u_mix;
      uniform vec4 u_crop; uniform vec4 u_crop2; uniform vec3 u_ring; varying vec2 v_uv;
      void main() {
        float d = distance(v_uv, vec2(0.5));
        float a = 1.0 - smoothstep(0.494, 0.5, d);
        if (a <= 0.0) discard;
        vec3 c1 = texture2D(u_tex, u_crop.xy + v_uv * u_crop.zw).rgb;
        vec3 c2 = texture2D(u_tex2, u_crop2.xy + v_uv * u_crop2.zw).rgb;
        vec3 col = mix(c1, c2, u_mix);
        float ring = smoothstep(0.472, 0.478, d);
        col = mix(col, u_ring, ring);
        gl_FragColor = vec4(col * a, a);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);

    posBuf = gl.createBuffer();
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, draw, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    const aUv = gl.getAttribLocation(prog, 'a_uv');
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    const ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    uRes = gl.getUniformLocation(prog, 'u_res');
    uMix = gl.getUniformLocation(prog, 'u_mix');
    uRing = gl.getUniformLocation(prog, 'u_ring');
    uCrop = gl.getUniformLocation(prog, 'u_crop');
    uCrop2 = gl.getUniformLocation(prog, 'u_crop2');
    gl.uniform1i(gl.getUniformLocation(prog, 'u_tex'), 0);
    gl.uniform1i(gl.getUniformLocation(prog, 'u_tex2'), 1);

    texIdle = makeTex(img);
    texAlt = texIdle;
    cropIdle = cropFor(img);
    cropAlt = cropIdle;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    ok = true;
    shell.classList.add('face-ready');
  }

  function loadImg(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  if (gl) {
    loadImg(IMG_IDLE).then((img) => {
      try { initGL(img); } catch (e) { console.warn('face: WebGL init failed, using static photo', e); }
      // optional expression photos
      [['pull', IMG_PULL], ['release', IMG_RELEASE]].forEach(([k, src]) =>
        loadImg(src).then((i) => { if (ok) alt[k] = { tex: makeTex(i), crop: cropFor(i) }; }).catch(() => {}));
    });
  }

  /* ---------------- ring colour follows the theme ---------------- */
  let ringRGB = [1, 1, 1];
  function readRing() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
    const m = v.match(/^#([0-9a-f]{6})$/i);
    if (m) { const n = parseInt(m[1], 16); ringRGB = [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  }
  readRing();
  new MutationObserver(readRing).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', readRing);

  /* ---------------- geometry ---------------- */
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 1;
  function measure() {
    const s = shell.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    cx = a.left - s.left + a.width / 2;
    cy = a.top - s.top + a.height / 2;
    R = a.width / 2;
    if (s.width !== W || s.height !== H) {
      W = s.width; H = s.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
  }

  /* ---------------- interaction ---------------- */
  let dragging = false;
  let grabX = 0, grabY = 0;          // grab point, offset from centre in px (at rest)
  let startX = 0, startY = 0, nowX = 0, nowY = 0;
  let pullX = 0, pullY = 0, stretch = 0, maxStretch = 0;
  let hoverX = 0, hoverY = 0, hovering = false;
  let mix = 0, mixTarget = 0, releaseUntil = 0;
  let spawnAcc = 0;

  const local = (e) => { const s = shell.getBoundingClientRect(); return [e.clientX - s.left, e.clientY - s.top]; };

  anchor.addEventListener('pointerdown', (e) => {
    measure();
    const [x, y] = local(e);
    const dx = x - cx, dy = y - cy;
    if (Math.hypot(dx, dy) > R) return;
    e.preventDefault();
    try { anchor.setPointerCapture(e.pointerId); } catch (_) {}
    dragging = true;
    anchor.classList.add('is-grabbing');
    const k = Math.min(1, (R * 0.85) / Math.hypot(dx, dy || 1e-6));
    grabX = dx * k; grabY = dy * k;
    startX = nowX = x; startY = nowY = y;
    maxStretch = 0;
    hint && hint.classList.add('is-gone');
  });
  anchor.addEventListener('pointermove', (e) => {
    const [x, y] = local(e);
    if (dragging) { nowX = x; nowY = y; }
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) return;
    const [x, y] = local(e);
    hoverX = x - cx; hoverY = y - cy;
    hovering = Math.hypot(hoverX, hoverY) < R * 1.25;
  }, { passive: true });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    anchor.classList.remove('is-grabbing');
    if (maxStretch > 0.6) {
      burst(Math.round(2 + Math.min(maxStretch, 2) * 2));
      say('release', true);
      if (alt.release) { setAlt('release'); mixTarget = 1; releaseUntil = performance.now() + 900; }
    } else if (maxStretch > 0.2) {
      say('release', true);
    }
    if (!alt.release || maxStretch <= 0.6) mixTarget = 0;
  };
  anchor.addEventListener('pointerup', end);
  anchor.addEventListener('pointercancel', end);
  anchor.addEventListener('lostpointercapture', end);

  // keyboard: Enter / Space gives it a random tug
  anchor.tabIndex = 0;
  anchor.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    measure();
    const ang = Math.random() * Math.PI * 2;
    for (let n = 0; n < V; n++) {
      const w = Math.exp(-((rest[n * 2] - Math.cos(ang) * 0.6) ** 2 + (rest[n * 2 + 1] - Math.sin(ang) * 0.6) ** 2) / 0.5);
      vel[n * 2] += Math.cos(ang) * R * 0.09 * w;
      vel[n * 2 + 1] += Math.sin(ang) * R * 0.09 * w;
    }
    grabX = Math.cos(ang) * R * 0.8; grabY = Math.sin(ang) * R * 0.8;
    pullX = Math.cos(ang) * R; pullY = Math.sin(ang) * R;
    burst(4);
    say('release', true);
    hint && hint.classList.add('is-gone');
  });

  function setAlt(k) {
    if (!alt[k]) return;
    texAlt = alt[k].tex; cropAlt = alt[k].crop;
  }

  /* ---------------- tech icons ---------------- */
  const ICONS = (window.TECH_ICONS || []).slice();
  const found = new Set();
  const live = [];
  const foundEl = document.getElementById('stackFound');
  const totalEl = document.getElementById('stackTotal');
  const barEl = document.getElementById('stackBar');
  const meter = document.getElementById('stackMeter');
  if (totalEl) totalEl.textContent = ICONS.length;
  let deck = [];
  function nextIcon() {
    if (!deck.length) {
      const unseen = ICONS.filter((i) => !found.has(i.name));
      const seen = ICONS.filter((i) => found.has(i.name));
      deck = [...shuffle(unseen), ...shuffle(seen)];
    }
    return deck.shift();
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function iconEl(ic) {
    const d = document.createElement('div');
    d.className = 'ticon is-new';
    d.innerHTML = `<img src="${ic.src}" alt="" draggable="false" /><span class="ticon__label">${ic.name}</span>`;
    d.title = ic.name;
    return d;
  }

  function spawn(x, y, vx, vy) {
    if (!ICONS.length) return;
    const ic = nextIcon();
    const el = iconEl(ic);
    layer.appendChild(el);
    const p = { el, x, y, vx, vy, r: (Math.random() - 0.5) * 40, vr: (Math.random() - 0.5) * 12, born: performance.now(), life: 6000 + Math.random() * 2500, s: 0.2 };
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      p.vy = -10 - Math.random() * 6; p.vx = (Math.random() - 0.5) * 10; p.vr = (Math.random() - 0.5) * 30;
      p.born = performance.now(); el.classList.add('is-new');
      setTimeout(() => el.classList.remove('is-new'), 1200);
    });
    setTimeout(() => el.classList.remove('is-new'), 1100);
    live.push(p);
    if (live.length > 40) { const o = live.shift(); o.el.remove(); }
    if (!found.has(ic.name)) {
      found.add(ic.name);
      if (foundEl) foundEl.textContent = found.size;
      if (barEl) barEl.style.width = `${(found.size / ICONS.length) * 100}%`;
      if (found.size === ICONS.length) { meter && meter.classList.add('is-complete'); setTimeout(() => say('done', true), 600); }
    }
  }

  function pulledPoint() { return [cx + grabX + pullX, cy + grabY + pullY]; }

  function burst(n) {
    const [px, py] = pulledPoint();
    const len = Math.hypot(pullX, pullY) || 1;
    const ux = pullX / len, uy = pullY / len;
    for (let i = 0; i < n; i++) {
      const sp = 7 + Math.random() * 8;
      const spread = (Math.random() - 0.5) * 1.4;
      const vx = (ux * Math.cos(spread) - uy * Math.sin(spread)) * sp;
      const vy = (ux * Math.sin(spread) + uy * Math.cos(spread)) * sp - 6;
      spawn(px, py, vx, vy);
    }
  }

  meter && meter.addEventListener('click', () => {
    measure();
    const ang = -Math.PI / 2 + (Math.random() - 0.5);
    pullX = Math.cos(ang) * R; pullY = Math.sin(ang) * R; grabX = 0; grabY = -R * 0.6;
    burst(3);
    hint && hint.classList.add('is-gone');
  });

  /* ---------------- simulation ---------------- */
  for (let n = 0; n < V; n++) { pos[n * 2] = rest[n * 2]; pos[n * 2 + 1] = rest[n * 2 + 1]; }
  let lastR = 1;
  let last = performance.now();
  let acc = 0;
  let visible = true;
  let running = false;
  const start = () => { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(shell);

  function step(t) {
    // pull vector with a soft cap so it never tears
    if (dragging) {
      const dx = nowX - startX, dy = nowY - startY;
      const len = Math.hypot(dx, dy);
      const L = R * 1.4;
      const capped = len ? L * Math.tanh(len / L) : 0;
      pullX = len ? (dx / len) * capped : 0;
      pullY = len ? (dy / len) * capped : 0;
      stretch = capped / R;
      maxStretch = Math.max(maxStretch, stretch);
    } else {
      stretch *= 0.9;
    }

    const sig2 = 2 * (R * 0.55) ** 2;
    const breathe = reduce ? 1 : 1 + Math.sin(t / 900) * 0.006;
    const k = dragging ? 0.22 : 0.045;
    const c = dragging ? 0.32 : 0.075;
    for (let n = 0; n < V; n++) {
      const rx = rest[n * 2] * R, ry = rest[n * 2 + 1] * R;
      let tx = rx * breathe, ty = ry * breathe;
      if (dragging) {
        const w = Math.exp(-((rx - grabX) ** 2 + (ry - grabY) ** 2) / sig2);
        tx += pullX * w; ty += pullY * w;
      } else if (hovering) {
        const hx = rx - hoverX, hy = ry - hoverY;
        const d2 = hx * hx + hy * hy;
        const w = Math.exp(-d2 / (2 * (R * 0.3) ** 2));
        const d = Math.sqrt(d2) || 1;
        tx -= (hx / d) * R * 0.05 * w; ty -= (hy / d) * R * 0.05 * w; // a gentle dent under the cursor
      }
      const km = dragging ? k : k * kmul[n];
      let vx = vel[n * 2] + (tx - pos[n * 2]) * km;
      let vy = vel[n * 2 + 1] + (ty - pos[n * 2 + 1]) * km;
      vx *= 1 - c; vy *= 1 - c;
      vel[n * 2] = vx; vel[n * 2 + 1] = vy;
      pos[n * 2] += vx; pos[n * 2 + 1] += vy;
    }
  }

  function frame(now) {
    if (!visible) { running = false; return; }
    const dtMs = Math.min(64, now - last);
    last = now;
    measure();
    // rescale stored offsets if the portrait changed size (responsive)
    if (Math.abs(R - lastR) > 0.5) {
      const f = R / lastR;
      if (lastR > 1) for (let i = 0; i < pos.length; i++) { pos[i] *= f; vel[i] *= f; }
      else for (let n = 0; n < V; n++) { pos[n * 2] = rest[n * 2] * R; pos[n * 2 + 1] = rest[n * 2 + 1] * R; }
      lastR = R;
    }

    acc += dtMs;
    let steps = 0;
    while (acc >= 1000 / 120 && steps < 8) { step(now); acc -= 1000 / 120; steps++; }

    // speech + icon spawning while pulled
    if (dragging) {
      if (stretch > 1.2) say('hard'); else if (stretch > 0.65) say('medium'); else if (stretch > 0.25) say('light');
      if (stretch > 0.55) {
        spawnAcc += stretch * 0.05 * (dtMs / 16.7);
        while (spawnAcc >= 1) {
          spawnAcc -= 1;
          const [px, py] = pulledPoint();
          const len = Math.hypot(pullX, pullY) || 1;
          const ux = pullX / len, uy = pullY / len;
          const sp = 5 + Math.random() * 6;
          spawn(px, py, ux * sp + (Math.random() - 0.5) * 5, uy * sp - 4 - Math.random() * 4);
        }
      }
      if (alt.pull) { setAlt('pull'); mixTarget = Math.min(1, Math.max(0, (stretch - 0.25) * 2.5)); }
    } else if (releaseUntil && now > releaseUntil) {
      releaseUntil = 0; mixTarget = 0;
    }
    mix += (mixTarget - mix) * 0.18;

    // shadow follows the stretch
    if (shadow) shadow.style.transform = `translateX(calc(-50% + ${pullX * 0.15}px)) scaleX(${1 + stretch * 0.25})`;

    // icons
    const floor = H - 28;
    for (let i = live.length - 1; i >= 0; i--) {
      const p = live[i];
      const f = dtMs / 16.7;
      p.vy += 0.42 * f;
      p.vx *= Math.pow(0.995, f);
      p.x += p.vx * f; p.y += p.vy * f; p.r += p.vr * f;
      if (p.y > floor) { p.y = floor; p.vy *= -0.5; p.vx *= 0.8; p.vr *= 0.7; if (Math.abs(p.vy) < 1.2) p.vy = 0; }
      if (p.x < 30) { p.x = 30; p.vx = Math.abs(p.vx) * 0.6; }
      if (p.x > W - 30) { p.x = W - 30; p.vx = -Math.abs(p.vx) * 0.6; }
      p.s += (1 - p.s) * 0.25;
      const age = now - p.born;
      let o = 1;
      if (age > p.life) { o = 1 - (age - p.life) / 600; if (o <= 0) { p.el.remove(); live.splice(i, 1); continue; } }
      p.el.style.opacity = o;
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.r}deg) scale(${p.s * (0.9 + 0.1 * o)})`;
    }

    // draw
    if (ok) {
      for (let n = 0; n < V; n++) { draw[n * 2] = cx + pos[n * 2]; draw[n * 2 + 1] = cy + pos[n * 2 + 1]; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uMix, mix);
      gl.uniform3f(uRing, ringRGB[0], ringRGB[1], ringRGB[2]);
      gl.uniform4f(uCrop, ...cropIdle);
      gl.uniform4f(uCrop2, ...cropAlt);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texIdle);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texAlt);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, draw);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
    requestAnimationFrame(frame);
  }
  start();

  // a friendly first line
  setTimeout(() => say('idle', true), 300);
})();
