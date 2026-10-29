/**
 * Particle portrait
 * ------------------------------------------------------------------
 * Factory port of the original vanilla engine. A lightweight canvas
 * field that:
 *   1. drifts as dust while the name reveals,
 *   2. swirls in from across the screen,
 *   3. assembles into a monogram (or a portrait image when configured).
 *
 * Particles are batched into colour buckets so a few thousand points
 * can run at 60fps on modest hardware.
 */

export interface ParticlePortraitHandle {
  replay: () => void;
  refresh: () => void;
  destroy: () => void;
}

export interface ParticlePortraitOptions {
  canvas: HTMLCanvasElement;
  zone: HTMLElement;
  hero: HTMLElement;
  initials: string;
  portrait: string;
  /** Called once the field has settled into its target shape. */
  onFormed: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  jx: number;
  jy: number;
  shade: number;
  bucket: number;
  color: string;
  size: number;
  k: number;
  damp: number;
  swirl: number;
  delay: number;
  seed: number;
  dx: number;
  dy: number;
}

interface TargetPoint {
  x: number;
  y: number;
  shade: number;
  color: string;
}

interface Targets {
  points: TargetPoint[];
  center: { x: number; y: number };
}

const COLORS = [
  "rgba(255,255,255,0.92)",
  "rgba(216,216,216,0.68)",
  "rgba(158,158,158,0.55)",
  "rgba(104,104,104,0.46)",
];

function bucketFor(shade: number): number {
  if (shade > 220) return 0;
  if (shade > 170) return 1;
  if (shade > 120) return 2;
  return 3;
}

export function createParticlePortrait(options: ParticlePortraitOptions): ParticlePortraitHandle {
  const { canvas, zone, hero, onFormed } = options;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return { replay: () => {}, refresh: () => {}, destroy: () => {} };
  }

  const initials = String(options.initials || "DD").slice(0, 2).toUpperCase();

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reduceQuery.matches;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let particles: Particle[] = [];
  let buckets: Particle[][] = [[], [], [], []];
  let colorGroups = new Map<string, Particle[]>();
  let isColorMode = false;
  const offscreen = document.createElement("canvas");
  let formStart = 0;
  let formTimer = 0;
  let settled = false;
  let running = false;
  let inView = true;
  let raf = 0;
  let zoneCenter = { x: 0, y: 0 };
  const pointer = { x: -9999, y: -9999, active: false };
  let resizeTimer = 0;
  let initTries = 0;
  let portrait: HTMLImageElement | null = null;
  let destroyed = false;

  /* ------------------------------------------------------------------ */
  /* Canvas sizing                                                       */
  /* ------------------------------------------------------------------ */

  function resizeCanvas(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, hero.clientWidth);
    H = Math.max(1, hero.clientHeight);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ------------------------------------------------------------------ */
  /* Sampling helpers                                                    */
  /* ------------------------------------------------------------------ */

  function newOffscreen(w: number, h: number): HTMLCanvasElement {
    offscreen.width = Math.max(1, Math.round(w));
    offscreen.height = Math.max(1, Math.round(h));
    return offscreen;
  }

  function drawMonogram(c: CanvasRenderingContext2D, w: number, h: number): void {
    const size = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2;

    c.clearRect(0, 0, w, h);

    // Outer orbit
    c.save();
    c.translate(cx, cy);
    c.strokeStyle = "rgb(150,150,150)";
    c.lineWidth = Math.max(2, size * 0.006);
    c.beginPath();
    c.arc(0, 0, size * 0.455, 0, Math.PI * 2);
    c.stroke();

    // Dashed inner ring
    c.strokeStyle = "rgb(92,92,92)";
    c.lineWidth = 1;
    c.setLineDash([2, size * 0.022]);
    c.beginPath();
    c.arc(0, 0, size * 0.405, 0, Math.PI * 2);
    c.stroke();
    c.setLineDash([]);

    // Cardinal ticks
    c.strokeStyle = "rgb(215,215,215)";
    c.lineWidth = Math.max(1.5, size * 0.005);
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      c.beginPath();
      c.moveTo(Math.cos(angle) * size * 0.455, Math.sin(angle) * size * 0.455);
      c.lineTo(Math.cos(angle) * size * 0.49, Math.sin(angle) * size * 0.49);
      c.stroke();
    }
    c.restore();

    // Initials
    c.fillStyle = "rgb(255,255,255)";
    c.textAlign = "center";
    c.textBaseline = "middle";
    const fs = size * (initials.length > 1 ? 0.3 : 0.38);
    c.font = `600 ${fs}px ui-sans-serif, -apple-system, 'Helvetica Neue', Arial, sans-serif`;
    if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${fs * 0.02}px`;
    c.fillText(initials, cx, cy + fs * 0.02);
    if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  }

  function drawPortrait(c: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement): void {
    const pad = Math.min(w, h) * 0.055;
    const maxW = w - pad * 2;
    const maxH = h - pad * 2;
    const iw = img.naturalWidth || img.width || 1;
    const ih = img.naturalHeight || img.height || 1;
    const scale = Math.min(maxW / iw, maxH / ih);
    const dw = iw * scale;
    const dh = ih * scale;

    c.clearRect(0, 0, w, h);
    c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  /**
   * Sample the offscreen canvas into target points.
   * Transparent images use alpha. Opaque images use a luminance
   * threshold relative to their average, then invert for light photos
   * so the result always glows against the dark background.
   */
  function sample(
    draw: (c: CanvasRenderingContext2D, w: number, h: number) => void,
    w: number,
    h: number,
    gap: number,
    isPortrait: boolean
  ): { points: TargetPoint[]; width: number; height: number } {
    const off = newOffscreen(w, h);
    const c = off.getContext("2d", { willReadFrequently: true });
    if (!c) return { points: [], width: off.width, height: off.height };
    c.clearRect(0, 0, off.width, off.height);
    draw(c, off.width, off.height);

    let data: Uint8ClampedArray;
    try {
      data = c.getImageData(0, 0, off.width, off.height).data;
    } catch {
      return { points: [], width: off.width, height: off.height };
    }

    const total = off.width * off.height;
    let opaque = 0;
    let lumSum = 0;
    let lumCount = 0;

    // Coarse pass to decide alpha vs. luminance sampling.
    for (let y = 0; y < off.height; y += 3) {
      for (let x = 0; x < off.width; x += 3) {
        const i = (y * off.width + x) * 4;
        if (data[i + 3] > 24) {
          opaque++;
          lumSum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          lumCount++;
        }
      }
    }

    const sampled = Math.ceil(total / 9);
    const useAlpha = opaque < sampled * 0.9;
    const avg = lumCount ? lumSum / lumCount : 128;
    const lightImage = avg > 128;
    const threshold = 18;

    const points: TargetPoint[] = [];
    const step = isPortrait ? 3 : gap;
    for (let yy = 0; yy < off.height; yy += step) {
      for (let xx = 0; xx < off.width; xx += step) {
        const i = (yy * off.width + xx) * 4;
        const a = data[i + 3];
        if (!a || a < 35) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        let shade: number;
        if (!useAlpha && !isPortrait) {
          if (lightImage ? lum > avg - threshold : lum < avg + threshold) continue;
          shade = lightImage ? 255 - lum : lum;
        } else {
          shade = 255;
        }

        let color: string;
        if (isPortrait) {
          if (lum < 40) {
            color = "rgb(150, 160, 178)";
          } else {
            const qr = Math.min(255, Math.round(r / 28) * 28);
            const qg = Math.min(255, Math.round(g / 28) * 28);
            const qb = Math.min(255, Math.round(b / 28) * 28);
            color = `rgb(${qr},${qg},${qb})`;
          }
        } else {
          color = COLORS[bucketFor(shade)];
        }

        points.push({ x: xx, y: yy, shade, color });
      }
    }

    return { points, width: off.width, height: off.height };
  }

  function getTargets(): Targets | null {
    const zr = zone.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    if (!zr.width || !zr.height) return null;

    const zw = zr.width;
    const zh = zr.height;
    const gap = 2;
    let data;

    if (portrait) {
      data = sample((c, w, h) => drawPortrait(c, w, h, portrait!), zw, zh, gap, true);
      isColorMode = true;
    } else {
      data = sample(drawMonogram, zw, zh, gap, false);
      isColorMode = false;
    }

    if (!data || !data.points || data.points.length < 40) {
      if (portrait) {
        // Sampling failed (missing/tainted image) — fall back to the monogram.
        portrait = null;
        isColorMode = false;
        return getTargets();
      }
      return null;
    }

    const sx = zw / data.width;
    const sy = zh / data.height;
    const ox = zr.left - cr.left;
    const oy = zr.top - cr.top;

    return {
      points: data.points.map((p) => ({
        x: ox + p.x * sx,
        y: oy + p.y * sy,
        shade: p.shade,
        color: p.color,
      })),
      center: { x: ox + zw / 2, y: oy + zh / 2 },
    };
  }

  /* ------------------------------------------------------------------ */
  /* Build                                                               */
  /* ------------------------------------------------------------------ */

  function particleCount(points: number): number {
    const max = W < 700 ? 3200 : 5500;
    const min = W < 700 ? 1000 : 1800;
    const target = Math.round(points * 1.15);
    return Math.max(min, Math.min(max, target));
  }

  function targetIndex(i: number, count: number, length: number): number {
    if (!length) return 0;
    return Math.min(length - 1, Math.floor((i * length) / Math.max(1, count)));
  }

  function createParticle(i: number, targets: Targets, count: number): Particle {
    const t = targets.points[targetIndex(i, count, targets.points.length)];
    const jx = (Math.random() * 2 - 1) * 1.15;
    const jy = (Math.random() * 2 - 1) * 1.15;

    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      tx: t.x + jx,
      ty: t.y + jy,
      jx,
      jy,
      shade: t.shade,
      bucket: bucketFor(t.shade),
      color: t.color,
      size: 1.25 + Math.random() * 1.25,
      k: 0.0028 + Math.random() * 0.0032,
      damp: 0.9 + Math.random() * 0.022,
      swirl: 0.55 + Math.random() * 1.0,
      delay: Math.random() * 0.55,
      seed: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.55,
      dy: (Math.random() - 0.5) * 0.55,
    };
  }

  function rebuild(targets: Targets, keepPositions: boolean): void {
    const count = particleCount(targets.points.length);
    let reused = false;
    if (buckets.some((b) => b.length)) {
      if (particles.length !== count) {
        reused = false;
      } else {
        // Reuse the existing field to avoid a visual jump.
        reused = true;
        buckets = [[], [], [], []];
        for (let j = 0; j < particles.length; j++) {
          const q = particles[j];
          const t = targets.points[targetIndex(j, particles.length, targets.points.length)];
          q.tx = t.x + q.jx;
          q.ty = t.y + q.jy;
          q.shade = t.shade;
          q.color = t.color;
          const nb = bucketFor(t.shade);
          if (nb !== q.bucket) q.bucket = nb;
          buckets[q.bucket].push(q);
          if (settled && keepPositions) {
            q.x = q.tx;
            q.y = q.ty;
            q.vx = 0;
            q.vy = 0;
          }
        }
      }
    }

    if (!reused) {
      particles = [];
      buckets = [[], [], [], []];
      for (let i = 0; i < count; i++) {
        const p = createParticle(i, targets, count);
        particles.push(p);
        buckets[p.bucket].push(p);
      }
    }

    colorGroups = new Map<string, Particle[]>();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let g = colorGroups.get(p.color);
      if (!g) {
        g = [];
        colorGroups.set(p.color, g);
      }
      g.push(p);
    }

    zoneCenter = targets.center;
  }

  function startFormation(reset: boolean): void {
    if (reduced) {
      drawStatic();
      return;
    }

    if (reset) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Enter from all over the viewport, weighted toward the edges.
        if (Math.random() < 0.6) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.max(W, H) * (0.55 + Math.random() * 0.35);
          p.x = zoneCenter.x + Math.cos(angle) * radius;
          p.y = zoneCenter.y + Math.sin(angle) * radius;
        } else {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
        }
        p.vx = (Math.random() - 0.5) * 2;
        p.vy = (Math.random() - 0.5) * 2;
        p.swirl = 0.55 + Math.random() * 1.05;
        p.delay = Math.random() * 0.6;
      }
    }

    settled = false;
    formStart = performance.now() + (reset ? 80 : 1150);
    canvas.classList.add("is-live");
    scheduleFormed();
    start();
  }

  function scheduleFormed(): void {
    window.clearTimeout(formTimer);
    const maxDelay = 600;
    const wait = Math.max(0, formStart - performance.now()) + maxDelay + 2500;
    formTimer = window.setTimeout(() => {
      settled = true;
      onFormed();
    }, wait);
  }

  function drawStatic(): void {
    resizeCanvas();
    const targets = getTargets();
    if (!targets) return;
    rebuild(targets, false);
    for (let i = 0; i < particles.length; i++) {
      particles[i].x = particles[i].tx;
      particles[i].y = particles[i].ty;
    }
    ctx!.clearRect(0, 0, W, H);
    paint(0);
    canvas.classList.add("is-live");
    settled = true;
    onFormed();
  }

  function paint(time: number): void {
    if (isColorMode && colorGroups.size > 0) {
      ctx!.globalCompositeOperation = "source-over";
      for (const [color, group] of colorGroups) {
        if (!group.length) continue;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        for (let i = 0; i < group.length; i++) {
          const p = group[i];
          let s = p.size;
          if (settled) {
            s += Math.sin(time * 1.2 + p.seed) * 0.14;
          }
          ctx!.rect(p.x, p.y, s, s);
        }
        ctx!.fill();
      }
    } else {
      ctx!.globalCompositeOperation = "lighter";
      for (let b = 0; b < 4; b++) {
        const group = buckets[b];
        if (!group.length) continue;
        ctx!.fillStyle = COLORS[b];
        ctx!.beginPath();
        for (let i = 0; i < group.length; i++) {
          const p = group[i];
          let s = p.size;
          // A whisper of shimmer once formed.
          if (settled) {
            s += Math.sin(time * 1.2 + p.seed) * 0.14;
          }
          ctx!.rect(p.x, p.y, s, s);
        }
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Animation                                                           */
  /* ------------------------------------------------------------------ */

  function tick(now: number): void {
    if (!running) return;
    raf = requestAnimationFrame(tick);

    const time = now / 1000;
    const since = now - formStart;
    const cx = zoneCenter.x;
    const cy = zoneCenter.y;

    ctx!.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (since < p.delay * 1000) {
        // Free drift before this particle is released.
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
        continue;
      }

      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spring toward the sampled target.
      p.vx += dx * p.k;
      p.vy += dy * p.k;

      // Tangential swirl around the portrait, decaying over time.
      if (p.swirl > 0.015) {
        const rx = p.x - cx;
        const ry = p.y - cy;
        const r = Math.sqrt(rx * rx + ry * ry) || 1;
        const force = p.swirl * Math.min(1, 0.3 + dist / 320);
        p.vx += (-ry / r) * force;
        p.vy += (rx / r) * force;
        p.swirl *= 0.972;
      }

      // Barely-there ambient movement keeps the image alive.
      p.vx += Math.sin(time * 0.85 + p.seed) * 0.0025;
      p.vy += Math.cos(time * 0.7 + p.seed) * 0.0025;

      // Pointer repulsion.
      if (pointer.active) {
        const px = p.x - pointer.x;
        const py = p.y - pointer.y;
        const pd = Math.sqrt(px * px + py * py);
        if (pd < 90 && pd > 0.01) {
          const push = (1 - pd / 90) * 0.9;
          p.vx += (px / pd) * push;
          p.vy += (py / pd) * push;
        }
      }

      p.vx *= p.damp;
      p.vy *= p.damp;

      // Speed guard so resize/teleport never explodes.
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 18) {
        p.vx = (p.vx / speed) * 18;
        p.vy = (p.vy / speed) * 18;
      }

      p.x += p.vx;
      p.y += p.vy;
    }

    paint(time);
  }

  function start(): void {
    if (running || reduced || destroyed) return;
    if (!inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function stop(): void {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */

  function refresh(): void {
    resizeCanvas();
    const targets = getTargets();
    if (!targets) return;
    rebuild(targets, true);
    if (reduced) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].x = particles[i].tx;
        particles[i].y = particles[i].ty;
      }
      ctx!.clearRect(0, 0, W, H);
      paint(0);
    }
  }

  const onPointerMove = (e: PointerEvent): void => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) {
      pointer.active = false;
      return;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  };
  const onPointerLeave = (): void => {
    pointer.active = false;
  };
  const onWindowResize = (): void => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 140);
  };

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 160);
  }) : null;

  const io = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting;
          if (inView) start();
          else stop();
        },
        { threshold: 0.02 }
      )
    : null;

  const onVisibility = (): void => {
    if (document.hidden) stop();
    else start();
  };
  const onReduceChange = (e: MediaQueryListEvent): void => {
    reduced = e.matches;
    if (reduced) {
      stop();
      drawStatic();
    }
  };

  hero.addEventListener("pointermove", onPointerMove, { passive: true });
  hero.addEventListener("pointerleave", onPointerLeave, { passive: true });
  window.addEventListener("resize", onWindowResize);
  ro?.observe(hero);
  io?.observe(hero);
  document.addEventListener("visibilitychange", onVisibility);
  if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", onReduceChange);

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function init(): void {
    if (destroyed) return;
    const targets = getTargets();
    if (!targets) {
      // Layout not ready — retry briefly, then give up quietly.
      if (initTries++ < 90) requestAnimationFrame(init);
      return;
    }

    initTries = 0;
    rebuild(targets, false);

    if (reduced) {
      drawStatic();
      return;
    }

    // Draw the dust immediately, then let the name land before forming.
    ctx!.clearRect(0, 0, W, H);
    paint(0);
    canvas.classList.add("is-live");
    formStart = performance.now() + 1200;
    settled = false;
    scheduleFormed();
    start();
  }

  function boot(): void {
    resizeCanvas();

    if (options.portrait) {
      const img = new Image();
      let booted = false;
      const finish = (loaded: boolean) => {
        if (booted || destroyed) return;
        booted = true;
        if (!loaded) portrait = null;
        init();
      };
      img.onload = () => {
        portrait = img;
        finish(true);
      };
      img.onerror = () => {
        finish(false);
      };
      window.setTimeout(() => finish(false), 2000);
      const src = options.portrait.startsWith("/") || options.portrait.startsWith("http")
        ? options.portrait
        : `/${options.portrait}`;
      img.src = src;

      if (img.complete && (img.naturalWidth || img.width)) {
        portrait = img;
        finish(true);
      }
    } else {
      init();
    }
  }

  boot();

  return {
    replay: () => {
      if (reduced) return;
      startFormation(true);
    },
    refresh,
    destroy: () => {
      destroyed = true;
      stop();
      window.clearTimeout(formTimer);
      window.clearTimeout(resizeTimer);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onWindowResize);
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (reduceQuery.removeEventListener) reduceQuery.removeEventListener("change", onReduceChange);
    },
  };
}
