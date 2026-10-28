/**
 * Particle portrait
 * ------------------------------------------------------------------
 * A lightweight canvas field that:
 *   1. drifts as dust while the name reveals,
 *   2. swirls in from across the screen,
 *   3. assembles into a monogram (or assets/portrait.png when configured).
 *
 * No libraries. Particles are batched into colour buckets so a few
 * thousand points can run at 60fps on modest hardware.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("particle-canvas");
  var zone = document.getElementById("portrait-zone");
  var hero = document.querySelector(".hero");
  if (!canvas || !zone || !hero) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  var config = window.PORTFOLIO || {};
  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = reduceQuery.matches;

  var W = 0;
  var H = 0;
  var dpr = 1;
  var particles = [];
  var buckets = [[], [], [], []];
  var offscreen = null;
  var formStart = 0;
  var formTimer = 0;
  var settled = false;
  var running = false;
  var inView = true;
  var raf = 0;
  var zoneCenter = { x: 0, y: 0 };
  var pointer = { x: -9999, y: -9999, active: false };
  var resizeTimer = 0;
  var initTries = 0;

  var COLORS = [
    "rgba(255,255,255,0.92)",
    "rgba(216,216,216,0.68)",
    "rgba(158,158,158,0.55)",
    "rgba(104,104,104,0.46)",
  ];

  function bucketFor(shade) {
    if (shade > 220) return 0;
    if (shade > 170) return 1;
    if (shade > 120) return 2;
    return 3;
  }

  /* ------------------------------------------------------------------ */
  /* Canvas sizing                                                       */
  /* ------------------------------------------------------------------ */

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, hero.clientWidth);
    H = Math.max(1, hero.clientHeight);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ------------------------------------------------------------------ */
  /* Sampling helpers                                                    */
  /* ------------------------------------------------------------------ */

  function newOffscreen(w, h) {
    if (!offscreen) offscreen = document.createElement("canvas");
    offscreen.width = Math.max(1, Math.round(w));
    offscreen.height = Math.max(1, Math.round(h));
    return offscreen;
  }

  function drawMonogram(c, w, h) {
    var size = Math.min(w, h);
    var cx = w / 2;
    var cy = h / 2;
    var initials = String(config.initials || "YN").slice(0, 2).toUpperCase();

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
    for (var i = 0; i < 4; i++) {
      var angle = (i * Math.PI) / 2;
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
    var fs = size * (initials.length > 1 ? 0.3 : 0.38);
    var font = '600 ' + fs + "px ui-sans-serif, -apple-system, 'Helvetica Neue', Arial, sans-serif";
    c.font = font;
    if ("letterSpacing" in c) c.letterSpacing = fs * 0.02 + "px";
    c.fillText(initials, cx, cy + fs * 0.02);
    if ("letterSpacing" in c) c.letterSpacing = "0px";
  }

  function drawPortrait(c, w, h, img) {
    var pad = Math.min(w, h) * 0.055;
    var maxW = w - pad * 2;
    var maxH = h - pad * 2;
    var scale = Math.min(maxW / img.width, maxH / img.height);
    var dw = img.width * scale;
    var dh = img.height * scale;

    c.clearRect(0, 0, w, h);
    c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  /**
   * Sample the offscreen canvas into target points.
   * Transparent images use alpha. Opaque images use a luminance
   * threshold relative to their average, then invert for light photos
   * so the result always glows against the dark background.
   */
  function sample(draw, w, h, gap) {
    var off = newOffscreen(w, h);
    var c = off.getContext("2d", { willReadFrequently: true });
    c.clearRect(0, 0, off.width, off.height);
    draw(c, off.width, off.height);

    var data;
    try {
      data = c.getImageData(0, 0, off.width, off.height).data;
    } catch (err) {
      return { points: [], width: off.width, height: off.height };
    }

    var total = off.width * off.height;
    var opaque = 0;
    var lumSum = 0;
    var lumCount = 0;
    var i;
    var r;
    var g;
    var b;
    var a;
    var lum;

    // Coarse pass to decide alpha vs. luminance sampling.
    for (var y = 0; y < off.height; y += 3) {
      for (var x = 0; x < off.width; x += 3) {
        i = (y * off.width + x) * 4;
        a = data[i + 3];
        if (a > 24) {
          opaque++;
          r = data[i];
          g = data[i + 1];
          b = data[i + 2];
          lumSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
          lumCount++;
        }
      }
    }

    var sampled = Math.ceil(total / 9);
    var useAlpha = opaque < sampled * 0.9;
    var avg = lumCount ? lumSum / lumCount : 128;
    var lightImage = avg > 128;
    var threshold = 18;

    var points = [];
    var shade = 255;
    for (var yy = 0; yy < off.height; yy += gap) {
      for (var xx = 0; xx < off.width; xx += gap) {
        i = (yy * off.width + xx) * 4;
        a = data[i + 3];
        if (!a || a < 60) continue;

        if (!useAlpha) {
          r = data[i];
          g = data[i + 1];
          b = data[i + 2];
          lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (lightImage ? lum > avg - threshold : lum < avg + threshold) continue;
          shade = lightImage ? 255 - lum : lum;
        } else {
          shade = 255;
        }

        points.push({ x: xx, y: yy, shade: shade });
      }
    }

    return { points: points, width: off.width, height: off.height };
  }

  function getTargets() {
    var zr = zone.getBoundingClientRect();
    var cr = canvas.getBoundingClientRect();
    if (!zr.width || !zr.height) return null;

    var zw = zr.width;
    var zh = zr.height;
    var gap = 2;
    var data;

    if (state.portrait) {
      data = sample(
        function (c, w, h) {
          drawPortrait(c, w, h, state.portrait);
        },
        zw,
        zh,
        gap
      );
    } else {
      data = sample(drawMonogram, zw, zh, gap);
    }

    if (!data || !data.points || data.points.length < 40) {
      if (state.portrait) {
        // Sampling failed (missing/tainted image) — fall back to the monogram.
        state.portrait = null;
        return getTargets();
      }
      return null;
    }

    var sx = zw / data.width;
    var sy = zh / data.height;
    var ox = zr.left - cr.left;
    var oy = zr.top - cr.top;

    return {
      points: data.points.map(function (p) {
        return { x: ox + p.x * sx, y: oy + p.y * sy, shade: p.shade };
      }),
      center: { x: ox + zw / 2, y: oy + zh / 2 },
    };
  }

  /* ------------------------------------------------------------------ */
  /* Build                                                               */
  /* ------------------------------------------------------------------ */

  var state = { portrait: null };

  function particleCount(points) {
    var max = W < 700 ? 2800 : 5200;
    var min = W < 700 ? 700 : 1000;
    var target = Math.round(points * 1.15);
    return Math.max(min, Math.min(max, target));
  }

  function targetIndex(i, count, length) {
    if (!length) return 0;
    return Math.min(length - 1, Math.floor((i * length) / Math.max(1, count)));
  }

  function createParticle(i, targets, count) {
    var t = targets.points[targetIndex(i, count, targets.points.length)];
    var jx = (Math.random() * 2 - 1) * 1.15;
    var jy = (Math.random() * 2 - 1) * 1.15;

    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      tx: t.x + jx,
      ty: t.y + jy,
      jx: jx,
      jy: jy,
      shade: t.shade,
      bucket: bucketFor(t.shade),
      size: 1.15 + Math.random() * 1.15,
      k: 0.0028 + Math.random() * 0.0032,
      damp: 0.9 + Math.random() * 0.022,
      swirl: 0.55 + Math.random() * 1.0,
      delay: Math.random() * 0.55,
      seed: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.55,
      dy: (Math.random() - 0.5) * 0.55,
    };
  }

  function rebuild(targets, keepPositions) {
    var count = particleCount(targets.points.length);
    if (buckets.some(function (b) { return b.length; })) {
      // Reuse the existing field when possible to avoid a visual jump.
      if (particles.length !== count) {
        particles = [];
        buckets = [[], [], [], []];
        for (var i = 0; i < count; i++) {
          var p = createParticle(i, targets, count);
          particles.push(p);
          buckets[p.bucket].push(p);
        }
      } else {
        buckets = [[], [], [], []];
        for (var j = 0; j < particles.length; j++) {
          var q = particles[j];
          var t = targets.points[targetIndex(j, particles.length, targets.points.length)];
          q.tx = t.x + q.jx;
          q.ty = t.y + q.jy;
          q.shade = t.shade;
          var nb = bucketFor(t.shade);
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
    } else {
      for (var n = 0; n < count; n++) {
        var np = createParticle(n, targets, count);
        particles.push(np);
        buckets[np.bucket].push(np);
      }
    }

    zoneCenter = targets.center;
  }

  function startFormation(reset) {
    if (reduced) {
      drawStatic();
      return;
    }

    if (reset) {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        // Enter from all over the viewport, weighted toward the edges.
        if (Math.random() < 0.6) {
          var angle = Math.random() * Math.PI * 2;
          var radius = Math.max(W, H) * (0.55 + Math.random() * 0.35);
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

  function scheduleFormed() {
    clearTimeout(formTimer);
    var maxDelay = 600;
    var wait = Math.max(0, formStart - performance.now()) + maxDelay + 2500;
    formTimer = setTimeout(function () {
      settled = true;
      document.dispatchEvent(new CustomEvent("particles:formed"));
    }, wait);
  }

  function drawStatic() {
    resizeCanvas();
    var targets = getTargets();
    if (!targets) return;
    rebuild(targets, false);
    for (var i = 0; i < particles.length; i++) {
      particles[i].x = particles[i].tx;
      particles[i].y = particles[i].ty;
    }
    ctx.clearRect(0, 0, W, H);
    paint(0);
    canvas.classList.add("is-live");
    settled = true;
    document.dispatchEvent(new CustomEvent("particles:formed"));
  }

  function paint(time) {
    ctx.globalCompositeOperation = "lighter";
    for (var b = 0; b < 4; b++) {
      var group = buckets[b];
      if (!group.length) continue;
      ctx.fillStyle = COLORS[b];
      ctx.beginPath();
      for (var i = 0; i < group.length; i++) {
        var p = group[i];
        var s = p.size;
        // A whisper of shimmer once formed.
        if (settled) {
          s += Math.sin(time * 1.2 + p.seed) * 0.14;
        }
        ctx.rect(p.x, p.y, s, s);
      }
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* ------------------------------------------------------------------ */
  /* Animation                                                           */
  /* ------------------------------------------------------------------ */

  function tick(now) {
    if (!running) return;
    raf = requestAnimationFrame(tick);

    var time = now / 1000;
    var since = now - formStart;
    var cx = zoneCenter.x;
    var cy = zoneCenter.y;

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

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

      var dx = p.tx - p.x;
      var dy = p.ty - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      // Spring toward the sampled target.
      p.vx += dx * p.k;
      p.vy += dy * p.k;

      // Tangential swirl around the portrait, decaying over time.
      if (p.swirl > 0.015) {
        var rx = p.x - cx;
        var ry = p.y - cy;
        var r = Math.sqrt(rx * rx + ry * ry) || 1;
        var force = p.swirl * Math.min(1, 0.3 + dist / 320);
        p.vx += (-ry / r) * force;
        p.vy += (rx / r) * force;
        p.swirl *= 0.972;
      }

      // Barely-there ambient movement keeps the image alive.
      p.vx += Math.sin(time * 0.85 + p.seed) * 0.0025;
      p.vy += Math.cos(time * 0.7 + p.seed) * 0.0025;

      // Pointer repulsion.
      if (pointer.active) {
        var px = p.x - pointer.x;
        var py = p.y - pointer.y;
        var pd = Math.sqrt(px * px + py * py);
        if (pd < 90 && pd > 0.01) {
          var push = (1 - pd / 90) * 0.9;
          p.vx += (px / pd) * push;
          p.vy += (py / pd) * push;
        }
      }

      p.vx *= p.damp;
      p.vy *= p.damp;

      // Speed guard so resize/teleport never explodes.
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 18) {
        p.vx = (p.vx / speed) * 18;
        p.vy = (p.vy / speed) * 18;
      }

      p.x += p.vx;
      p.y += p.vy;
    }

    paint(time);
  }

  function start() {
    if (running || reduced) return;
    if (!inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */

  function refresh() {
    resizeCanvas();
    var targets = getTargets();
    if (!targets) return;
    rebuild(targets, true);
    if (reduced) {
      for (var i = 0; i < particles.length; i++) {
        particles[i].x = particles[i].tx;
        particles[i].y = particles[i].ty;
      }
      ctx.clearRect(0, 0, W, H);
      paint(0);
    }
  }

  hero.addEventListener(
    "pointermove",
    function (e) {
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        pointer.active = false;
        return;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    },
    { passive: true }
  );

  hero.addEventListener(
    "pointerleave",
    function () {
      pointer.active = false;
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 140);
  });

  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 160);
    });
    ro.observe(hero);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    io.observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener("change", function (e) {
      reduced = e.matches;
      if (reduced) {
        stop();
        drawStatic();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function boot() {
    resizeCanvas();

    if (config.portrait) {
      var img = new Image();
      img.decoding = "async";
      var booted = false;
      var finish = function () {
        if (booted) return;
        booted = true;
        init();
      };
      img.onload = function () {
        state.portrait = img;
        finish();
      };
      img.onerror = finish;
      setTimeout(finish, 1800);
      img.src = config.portrait;
    } else {
      init();
    }
  }

  function init() {
    var targets = getTargets();
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
    ctx.clearRect(0, 0, W, H);
    paint(0);
    canvas.classList.add("is-live");
    formStart = performance.now() + 1200;
    scheduleFormed();
    start();
  }

  window.ParticlePortrait = {
    replay: function () {
      if (reduced) return;
      startFormation(true);
    },
    refresh: refresh,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
