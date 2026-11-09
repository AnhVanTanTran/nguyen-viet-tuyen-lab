/**
 * Decorative SERS background, drawn entirely in code.
 *
 * Gold spheres and dimers, ZnO nanorods decorated with gold, CuO nanowires with a
 * beaded gold shell, and urchin-like or star-shaped particles drift slowly behind
 * the page. Hot spots glow in the gaps between gold particles and brighten near
 * the pointer, which acts like a probe laser.
 *
 * It is a stylised illustration. It contains no microscopy images or measured data.
 */
const TAU = Math.PI * 2;
const MARGIN = 240;
const HOVER_RADIUS = 210;

type Ctx = CanvasRenderingContext2D;
type Rng = () => number;

interface Sprite {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
}

interface Shape {
  sprite: Sprite;
  spots: { x: number; y: number }[];
  halo: number;
}

interface Item extends Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  phase: number;
  layer: Layer;
}

interface Layer {
  parallax: number;
  scale: number;
  alpha: number;
  drift: number;
  blur: number;
}

const FAR: Layer = { parallax: 0.05, scale: 0.62, alpha: 0.5, drift: 4, blur: 0.7 };
const MID: Layer = { parallax: 0.12, scale: 1, alpha: 0.82, drift: 7, blur: 0 };
const NEAR: Layer = { parallax: 0.24, scale: 1.75, alpha: 0.36, drift: 11, blur: 3.2 };

function seeded(a: number): Rng {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sprite(w: number, h: number, layer: Layer, draw: (c: Ctx) => void): Sprite {
  const res = (layer.blur > 1 ? 0.75 : 1.6) * layer.scale;
  const pad = Math.ceil(layer.blur * 3) + 8;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil((w + pad * 2) * res);
  canvas.height = Math.ceil((h + pad * 2) * res);
  const c = canvas.getContext('2d')!;
  c.scale(res, res);
  c.translate(pad, pad);
  if (layer.blur) c.filter = `blur(${layer.blur}px)`;
  draw(c);
  return { canvas, w: (w + pad * 2) * layer.scale, h: (h + pad * 2) * layer.scale };
}

const GOLD = ['#fff6d2', '#f2cf70', '#cb9a2f', '#94701f'];
const SILVER = ['#ffffff', '#e4ebf2', '#b3c0ce', '#8695a6'];

function ball(c: Ctx, x: number, y: number, r: number, tone = GOLD) {
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  g.addColorStop(0, tone[0]);
  g.addColorStop(0.28, tone[1]);
  g.addColorStop(0.72, tone[2]);
  g.addColorStop(1, tone[3]);
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fill();
}

function sphere(r: number, layer: Layer, tone = GOLD): Shape {
  const d = r * 2;
  return { sprite: sprite(d, d, layer, (c) => ball(c, r, r, r, tone)), spots: [], halo: tone === GOLD ? 1 : 0 };
}

function cluster(r: number, count: 2 | 3, layer: Layer): Shape {
  const gap = r * 0.14;
  const a = r + gap / 2;
  const centres =
    count === 2
      ? [{ x: -a, y: 0 }, { x: a, y: 0 }]
      : [{ x: -a, y: a * 0.58 }, { x: a, y: a * 0.58 }, { x: 0, y: -a * 1.15 }];
  const size = (a + r) * 2;
  const mid = size / 2;
  const spots =
    count === 2
      ? [{ x: 0, y: 0 }]
      : [
          { x: 0, y: a * 0.58 },
          { x: -a / 2, y: -a * 0.29 },
          { x: a / 2, y: -a * 0.29 },
        ];
  return {
    sprite: sprite(size, size, layer, (c) => centres.forEach((p) => ball(c, mid + p.x, mid + p.y, r))),
    spots: spots.map((s) => ({ x: s.x * layer.scale, y: s.y * layer.scale })),
    halo: 1,
  };
}

function rod(length: number, width: number, layer: Layer, rng: Rng, gold: boolean): Shape {
  const w = length + 24;
  const h = width + 26;
  return {
    sprite: sprite(w, h, layer, (c) => {
      const x0 = 12;
      const y0 = (h - width) / 2;
      const shoulder = x0 + length - width * 0.75;
      const g = c.createLinearGradient(0, y0, 0, y0 + width);
      g.addColorStop(0, '#e9f0f6');
      g.addColorStop(0.34, '#e9f0f6');
      g.addColorStop(0.34, '#c0cfdd');
      g.addColorStop(0.72, '#c0cfdd');
      g.addColorStop(0.72, '#97abbe');
      g.addColorStop(1, '#97abbe');
      c.fillStyle = g;
      c.lineJoin = 'round';
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(shoulder, y0);
      c.lineTo(x0 + length, y0 + width / 2);
      c.lineTo(shoulder, y0 + width);
      c.lineTo(x0, y0 + width);
      c.closePath();
      c.fill();
      if (gold) {
        const n = Math.round(length / 15);
        for (let i = 0; i < n; i++) {
          const x = x0 + 6 + rng() * (length - width - 6);
          const edge = rng() < 0.5 ? y0 + 1 : y0 + width - 1;
          ball(c, x, edge + (rng() - 0.5) * 5, 2.2 + rng() * 2.2);
        }
      }
    }),
    spots: [],
    halo: 0,
  };
}

function wire(length: number, amp: number, layer: Layer, rng: Rng, gold: boolean): Shape {
  const w = length + 24;
  const h = amp * 2 + 34;
  const m = h / 2;
  const p = [12, m + amp * 0.4, length * 0.32, m - amp, length * 0.66, m + amp, length + 12, m - amp * 0.5];
  const at = (t: number) => {
    const u = 1 - t;
    return [
      u ** 3 * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t ** 3 * p[6],
      u ** 3 * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t ** 3 * p[7],
    ];
  };
  return {
    sprite: sprite(w, h, layer, (c) => {
      const trace = () => {
        c.beginPath();
        c.moveTo(p[0], p[1]);
        c.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
        c.stroke();
      };
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, '#94613a');
      g.addColorStop(0.5, '#b57f50');
      g.addColorStop(1, '#8a5a36');
      c.lineCap = 'round';
      c.strokeStyle = g;
      c.lineWidth = 5.4;
      trace();
      c.translate(0, -1.3);
      c.strokeStyle = 'rgba(255, 236, 214, 0.7)';
      c.lineWidth = 1.5;
      trace();
      c.translate(0, 1.3);
      if (gold) {
        for (let t = 0.04; t < 0.98; t += 0.035 + rng() * 0.03) {
          const [x, y] = at(t);
          ball(c, x + (rng() - 0.5) * 3, y + (rng() - 0.5) * 5, 2.4 + rng() * 1.6);
        }
      }
    }),
    spots: [],
    halo: 0,
  };
}

function spiky(r: number, spikes: number, layer: Layer, rng: Rng, tone: 'urchin' | 'star'): Shape {
  const size = r * 2 + 8;
  const mid = size / 2;
  const core = tone === 'urchin' ? r * 0.42 : r * 0.34;
  const base = tone === 'urchin' ? ['#8ca2b8', '#e1eaf2'] : ['#b98a26', '#f5d57d'];
  const half = tone === 'urchin' ? 0.075 : 0.2;
  return {
    sprite: sprite(size, size, layer, (c) => {
      for (let i = 0; i < spikes; i++) {
        const a = (i / spikes) * TAU + rng() * (tone === 'urchin' ? 0.4 : 0.15);
        const len = r * (tone === 'urchin' ? 0.72 + rng() * 0.28 : 0.82 + rng() * 0.18);
        const g = c.createLinearGradient(mid, mid, mid + Math.cos(a) * len, mid + Math.sin(a) * len);
        g.addColorStop(0, base[0]);
        g.addColorStop(1, base[1]);
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(mid + Math.cos(a - half) * core, mid + Math.sin(a - half) * core);
        c.lineTo(mid + Math.cos(a) * len, mid + Math.sin(a) * len);
        c.lineTo(mid + Math.cos(a + half) * core, mid + Math.sin(a + half) * core);
        c.closePath();
        c.fill();
      }
      ball(c, mid, mid, core * 1.08, tone === 'urchin' ? SILVER : GOLD);
    }),
    spots: [],
    halo: tone === 'star' ? 1 : 0,
  };
}

function glow(stops: [number, string][]) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const c = canvas.getContext('2d')!;
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  return canvas;
}

export interface NanoScene {
  setIntensity(value: number): void;
  destroy(): void;
}

export function createNanoScene(canvas: HTMLCanvasElement, initial: number): NanoScene {
  const ctx = canvas.getContext('2d')!;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = window.matchMedia('(hover: hover)').matches;
  const hotSpot = glow([
    [0, 'rgba(255, 244, 200, 0.95)'],
    [0.18, 'rgba(247, 176, 62, 0.62)'],
    [0.55, 'rgba(207, 31, 58, 0.15)'],
    [1, 'rgba(207, 31, 58, 0)'],
  ]);
  const plasmon = glow([
    [0, 'rgba(236, 188, 72, 0.5)'],
    [0.5, 'rgba(236, 188, 72, 0.14)'],
    [1, 'rgba(236, 188, 72, 0)'],
  ]);
  const probe = glow([
    [0, 'rgba(207, 31, 58, 0.16)'],
    [1, 'rgba(207, 31, 58, 0)'],
  ]);

  let W = 0;
  let H = 0;
  let dpr = 1;
  let items: Item[] = [];
  let builtWidth = -1;
  let target = initial;
  let intensity = initial;
  let raf = 0;
  let last = 0;
  let px = -9999;
  let py = -9999;
  let tx = -9999;
  let ty = -9999;
  let timer = 0;

  function build() {
    const rng = seeded(632);
    const k = Math.max(0.4, Math.min(1.5, (W * Math.max(H, 700)) / 1_300_000));
    const n = (v: number) => Math.max(1, Math.round(v * k));
    const r = (a: number, b: number) => a + rng() * (b - a);
    const recipes: [Layer, () => Shape][] = [];
    const add = (count: number, layer: Layer, make: () => Shape) => {
      for (let i = 0; i < count; i++) recipes.push([layer, make]);
    };
    add(n(8), FAR, () => sphere(r(9, 20), FAR));
    add(n(4), FAR, () => sphere(r(9, 18), FAR, SILVER));
    add(n(3), FAR, () => rod(r(90, 150), r(14, 20), FAR, rng, false));
    add(n(5), MID, () => cluster(r(13, 22), rng() < 0.65 ? 2 : 3, MID));
    add(n(5), MID, () => sphere(r(10, 24), MID));
    add(n(3), MID, () => rod(r(120, 200), r(18, 27), MID, rng, true));
    add(n(2), MID, () => rod(r(90, 150), r(14, 22), MID, rng, false));
    add(n(2), MID, () => wire(r(320, 500), r(24, 50), MID, rng, true));
    add(n(2), MID, () => wire(r(260, 420), r(18, 44), MID, rng, false));
    add(n(2), MID, () => spiky(r(30, 44), 62, MID, rng, 'urchin'));
    add(n(2), MID, () => spiky(r(20, 30), 9, MID, rng, 'star'));
    add(n(2), NEAR, () => sphere(r(22, 34), NEAR));
    add(1, NEAR, () => rod(r(120, 170), r(22, 30), NEAR, rng, false));
    add(1, NEAR, () => cluster(r(18, 24), 2, NEAR));

    const placed: { x: number; y: number }[] = [];
    const fieldW = W + MARGIN * 2;
    const fieldH = H + MARGIN * 2;
    items = recipes.map(([layer, make]) => {
      let best = { x: 0, y: 0 };
      let bestD = -1;
      for (let t = 0; t < 14; t++) {
        const c = { x: rng() * fieldW, y: rng() * fieldH };
        const d = placed.reduce((m, p) => Math.min(m, (p.x - c.x) ** 2 + (p.y - c.y) ** 2), Infinity);
        if (d > bestD) {
          bestD = d;
          best = c;
        }
      }
      placed.push(best);
      const a = rng() * TAU;
      return {
        ...make(),
        x: best.x,
        y: best.y,
        vx: Math.cos(a) * layer.drift * r(0.6, 1.2),
        vy: Math.sin(a) * layer.drift * r(0.6, 1.2),
        rot: rng() * TAU,
        vr: r(-0.09, 0.09),
        phase: rng() * TAU,
        layer,
      };
    });
  }

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    if (W !== builtWidth) {
      builtWidth = W;
      build();
    }
  }

  const wrap = (v: number, size: number) => ((v % size) + size) % size;

  function draw(time: number, dt: number) {
    const fieldW = W + MARGIN * 2;
    const fieldH = H + MARGIN * 2;
    const scroll = window.scrollY;
    const small = W < 1024 ? 0.34 : 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const it of items) {
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      const x = wrap(it.x, fieldW) - MARGIN;
      const y = wrap(it.y - scroll * it.layer.parallax, fieldH) - MARGIN;
      const dist = Math.hypot(x - px, y - py);
      const near = Math.max(0, 1 - dist / HOVER_RADIUS);
      const cos = Math.cos(it.rot) * dpr;
      const sin = Math.sin(it.rot) * dpr;
      ctx.setTransform(cos, sin, -sin, cos, x * dpr, y * dpr);
      const strength = intensity * small;
      if (it.halo) {
        const size = it.sprite.w * 2;
        ctx.globalAlpha = Math.min(1, it.layer.alpha * strength * (0.32 + 0.14 * Math.sin(time * 0.0009 + it.phase) + near * 0.7));
        ctx.drawImage(plasmon, -size / 2, -size / 2, size, size);
      }
      ctx.globalAlpha = Math.min(1, it.layer.alpha * strength * (1 + near * 0.7));
      ctx.drawImage(it.sprite.canvas, -it.sprite.w / 2, -it.sprite.h / 2, it.sprite.w, it.sprite.h);
      for (const s of it.spots) {
        const size = 46 * it.layer.scale * (1 + near * 0.9);
        ctx.globalAlpha = Math.min(1, strength * (0.42 + 0.3 * Math.sin(time * 0.0016 + it.phase + s.x) + near));
        ctx.drawImage(hotSpot, s.x - size / 2, s.y - size / 2, size, size);
      }
    }
    if (hover && px > -999) {
      const size = 300;
      ctx.setTransform(dpr, 0, 0, dpr, px * dpr, py * dpr);
      ctx.globalAlpha = 0.8 * intensity;
      ctx.drawImage(probe, -size / 2, -size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  function frame(time: number) {
    raf = requestAnimationFrame(frame);
    if (time - last < 33) return;
    const dt = Math.min((time - last) / 1000, 0.08);
    last = time;
    intensity += (target - intensity) * 0.06;
    if (tx > -999) {
      px = px < -999 ? tx : px + (tx - px) * 0.18;
      py = py < -999 ? ty : py + (ty - py) * 0.18;
    }
    draw(time, dt);
  }

  const onResize = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      resize();
      if (still) draw(0, 0);
    }, 120);
  };
  const onMove = (e: PointerEvent) => {
    tx = e.clientX;
    ty = e.clientY;
  };
  const onLeave = () => {
    tx = ty = px = py = -9999;
  };
  const onScroll = () => draw(0, 0);

  resize();
  window.addEventListener('resize', onResize);
  if (still) {
    draw(0, 0);
    window.addEventListener('scroll', onScroll, { passive: true });
  } else {
    raf = requestAnimationFrame(frame);
    if (hover) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
  }

  return {
    setIntensity(value) {
      target = value;
      if (still) {
        intensity = value;
        draw(0, 0);
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    },
  };
}
