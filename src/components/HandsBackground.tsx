import { useEffect, useRef } from 'react';

export const IMG_W = 1024;
export const IMG_H = 1024;

// In the source artwork:
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
      // Proportional terminal width locked to hands meeting point
      const exeWidth = Math.max(250, Math.min(350, Math.min(w * 0.34, dw * 0.22)));
      parent.style.setProperty('--exe-left', `${exeLeft.toFixed(1)}px`);
      parent.style.setProperty('--exe-top', `${exeTop.toFixed(1)}px`);
      parent.style.setProperty('--exe-width', `${exeWidth.toFixed(1)}px`);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!imgLoaded) return;

      // Scale arms to fit the full width of the screen!
      // Arms stretch across the entire viewport width from left edge (x=0) to right edge (x=w)
      const dw = Math.max(w, 720);
      const dh = dw; // 1:1 aspect ratio
      const dx = (w - dw) / 2; // dx = 0 on any screen >= 720px wide!
      // Center the hands vertically within the viewport
      const dy = (h - dh) * 0.48;

      updateStageVars(dx, dy, dw, dh);

      // Intro reveal
      const reveal = still ? 1 : Math.min(1, time / 1.0);
      ctx.globalAlpha = reveal;

      // High-detail dither rendering with high quality bicubic filtering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, dx, dy, dw, dh);

      // Subtle retro CRT glitch effect
      if (!still && time > glitchAt) {
        glitchAt = time + 3.0 + Math.random() * 5.0;
        glitchEnd = time + 0.12;
        glitchY = Math.random() * h;
        glitchH = 8 + Math.random() * 32;
        glitchDx = (Math.random() - 0.5) * 24;
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
          // ignore if bounds edge
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
