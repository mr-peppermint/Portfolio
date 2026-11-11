import { useEffect, useRef } from 'react';

export const IMG_W = 1024;
export const IMG_H = 1024;

// In the 1024x1024 source artwork:
// Center where the fingers meet / terminal center:
export const HANDS_CENTER_X_RATIO = 536.5 / 1024; // 0.5239
export const HANDS_CENTER_Y_RATIO = 511.0 / 1024; // 0.4990
export const TERMINAL_WIDTH_RATIO = 315.0 / 1024; // 0.3076

interface HandsBackgroundProps {
  src?: string;
  className?: string;
}

const HandsBackground = ({ src = '/hands.png', className = '' }: HandsBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let w = 1;
    let h = 1;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let time = 0;
    let visible = true;
    let alive = true;

    // Glitch timing
    let glitchAt = 3.0;
    let glitchEnd = 0;
    let glitchY = 0;
    let glitchH = 0;
    let glitchDx = 0;

    const img = new Image();
    let imgLoaded = false;

    const updateStageVars = (dx: number, dy: number, dw: number, dh: number) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const exeLeft = dx + dw * HANDS_CENTER_X_RATIO;
      const exeTop = dy + dh * HANDS_CENTER_Y_RATIO;
      const exeWidth = Math.max(260, Math.min(380, dw * TERMINAL_WIDTH_RATIO * 1.05));
      parent.style.setProperty('--exe-left', `${exeLeft.toFixed(1)}px`);
      parent.style.setProperty('--exe-top', `${exeTop.toFixed(1)}px`);
      parent.style.setProperty('--exe-width', `${exeWidth.toFixed(1)}px`);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!imgLoaded) return;

      // Fit hands image within stage while keeping it prominent
      const imgAspect = IMG_W / IMG_H;
      let dw = Math.min(w * 0.98, 1180);
      let dh = dw / imgAspect;

      // Keep within reasonable height
      if (dh > h * 1.35) {
        dh = h * 1.35;
        dw = dh * imgAspect;
      }

      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      updateStageVars(dx, dy, dw, dh);

      // Intro reveal
      const reveal = still ? 1 : Math.min(1, time / 1.2);
      ctx.globalAlpha = reveal;

      // Render high-definition hands with crisp pixel quality
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, dx, dy, dw, dh);

      // Subtle retro CRT glitch effect (horizontal slice displacement)
      if (!still && time > glitchAt) {
        glitchAt = time + 2.8 + Math.random() * 4.5;
        glitchEnd = time + 0.12;
        glitchY = Math.random() * h;
        glitchH = 8 + Math.random() * 32;
        glitchDx = (Math.random() - 0.5) * 28;
      }

      if (!still && time < glitchEnd) {
        try {
          ctx.drawImage(
            canvas,
            0,
            glitchY * dpr,
            w * dpr,
            glitchH * dpr,
            glitchDx,
            glitchY,
            w,
            glitchH
          );
        } catch {
          // Ignore if bounds edge
        }
      }

      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;

      draw();

      if (visible && alive && !still) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      if (imgLoaded) {
        if (still) draw();
        else wake();
      }
    };

    img.onload = () => {
      imgLoaded = true;
      resize();
      wake();
    };
    img.src = src;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(canvas);

    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={`hero-bg ${className}`} aria-hidden="true" />;
};

export default HandsBackground;
