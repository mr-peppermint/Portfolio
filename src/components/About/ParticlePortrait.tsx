import { useEffect, useRef, useState, ChangeEvent, DragEvent } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ParticlePortrait.css';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  colorDark: string;
  colorLight: string;
  size: number;
  dispAngle: number;
  dispSpeed: number;
  seed: number;
}

interface ParticlePortraitProps {
  initialSrc?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

export const ParticlePortrait = ({ initialSrc = '/portrait-hd.png', containerRef }: ParticlePortraitProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [activeSrc, setActiveSrc] = useState<string>(initialSrc);
  const [particleCount, setParticleCount] = useState<number>(0);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Particles array stored in a ref so RAF can update without React re-render lag
  const particlesRef = useRef<Particle[]>([]);
  const scrollProgressRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  // 1. Process and sample an image into vector particles
  const sampleImage = (img: HTMLImageElement) => {
    const offCanvas = document.createElement('canvas');
    const targetSize = 280;
    offCanvas.width = targetSize;
    offCanvas.height = targetSize;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    // Draw image centered and contained
    const aspect = img.width / img.height;
    let dw = targetSize;
    let dh = targetSize;
    let dx = 0;
    let dy = 0;
    if (aspect > 1) {
      dh = targetSize / aspect;
      dy = (targetSize - dh) / 2;
    } else {
      dw = targetSize * aspect;
      dx = (targetSize - dw) / 2;
    }

    offCtx.clearRect(0, 0, targetSize, targetSize);
    offCtx.drawImage(img, dx, dy, dw, dh);

    const imgData = offCtx.getImageData(0, 0, targetSize, targetSize);
    const data = imgData.data;

    const newParticles: Particle[] = [];
    const step = 4; // High density sampling grid

    for (let y = 0; y < targetSize; y += step) {
      for (let x = 0; x < targetSize; x += step) {
        const idx = (y * targetSize + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a > 40) {
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const tone = Math.round(lum * 255);

          // Vector particle size based on tone
          const size = 1.0 + (1 - lum) * 0.8;

          // Compute angle from center for natural radial explosion
          const cdx = x - targetSize / 2;
          const cdy = y - targetSize / 2;
          const angle = Math.atan2(cdy, cdx) + (Math.random() - 0.5) * 0.8;
          const speed = 0.8 + Math.random() * 1.6;

          newParticles.push({
            baseX: x,
            baseY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            colorDark: `rgba(${tone > 160 ? 255 : 210}, ${tone > 160 ? 255 : 215}, ${tone > 160 ? 255 : 230}, ${Math.max(0.45, a / 255)})`,
            colorLight: `rgba(${Math.min(38, Math.round((255 - tone) * 0.2 + 28))}, ${Math.min(34, Math.round((255 - tone) * 0.18 + 25))}, ${Math.min(30, Math.round((255 - tone) * 0.15 + 23))}, ${Math.max(0.6, a / 255)})`,
            size,
            dispAngle: angle,
            dispSpeed: speed,
            seed: Math.random() * 100
          });
        }
      }
    }

    particlesRef.current = newParticles;
    setParticleCount(newParticles.length);
  };

  // 2. Load the active image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sampleImage(img);
    };
    img.src = activeSrc;
  }, [activeSrc]);

  // 3. Scroll listener to calculate disassembly factor
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef?.current || canvasRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Disassembly starts as the about section scrolls up past the middle of the screen
      // When the top of about section is at 100px from top, progress = 0
      // As it scrolls further up, progress increases from 0 to 1
      const startY = viewportH * 0.35;
      const endY = -rect.height * 0.5;

      let progress = (startY - rect.top) / (startY - endY);
      progress = Math.max(0, Math.min(1.0, progress));

      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  // 4. Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let alive = true;

    const canvasWidth = 280;
    const canvasHeight = 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const isDark = themeRef.current === 'dark';
      const progress = scrollProgressRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // If disassembled heavily, fade alpha slightly
      const globalAlpha = Math.max(0.15, 1 - progress * 0.65);
      ctx.globalAlpha = globalAlpha;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Target position based on disassembly progress
        let targetX = p.baseX;
        let targetY = p.baseY;

        if (progress > 0.005) {
          // Outward explosion + turbulence drift as you scroll down
          const dist = Math.pow(progress, 1.3) * 160 * p.dispSpeed;
          const wobble = Math.sin(time * 2 + p.seed) * 8 * progress;
          targetX += Math.cos(p.dispAngle) * dist + wobble;
          targetY += Math.sin(p.dispAngle) * dist + (progress * 60) + Math.cos(time * 2 + p.seed) * 8 * progress;
        } else if (mouse.active) {
          // Interactive cursor repulsion when assembled
          const mdx = p.baseX - mouse.x;
          const mdy = p.baseY - mouse.y;
          const distSq = mdx * mdx + mdy * mdy;
          const maxRepel = 45;
          if (distSq < maxRepel * maxRepel && distSq > 0.1) {
            const d = Math.sqrt(distSq);
            const force = (1 - d / maxRepel) * 14;
            targetX += (mdx / d) * force;
            targetY += (mdy / d) * force;
          }
        }

        // Spring dampening
        p.vx = (p.vx + (targetX - p.x) * 0.18) * 0.72;
        p.vy = (p.vy + (targetY - p.y) * 0.18) * 0.72;
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle dot
        ctx.fillStyle = isDark ? p.colorDark : p.colorLight;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (alive) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mouse hover handlers for interactive deflection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 280 / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  };

  // Image upload handling
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') {
        setActiveSrc(ev.target.result);
        setIsCustom(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') {
        setActiveSrc(ev.target.result);
        setIsCustom(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetToDefault = () => {
    setActiveSrc(initialSrc);
    setIsCustom(false);
  };

  return (
    <div
      className={`particle-portrait-card ${isDragging ? 'portrait-dragging' : ''}`}
      onDragOver={e => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="portrait-header">
        <span className="portrait-tag">// VECTOR PARTICLES</span>
        <span className="portrait-count">{particleCount} PTS</span>
      </div>

      <div className="portrait-stage">
        <canvas
          ref={canvasRef}
          className="portrait-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          title="Hover to deflect particles • Scroll down to disassemble"
        />
        <div className="portrait-grid-overlay" aria-hidden="true" />
      </div>

      <div className="portrait-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          type="button"
          className="portrait-btn portrait-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Upload or drop any image to vectorize"
        >
          <span>⇪ CHOOSE PHOTO</span>
        </button>

        {isCustom && (
          <button
            type="button"
            className="portrait-btn portrait-reset-btn"
            onClick={resetToDefault}
            title="Reset to Dixit's portrait"
          >
            <span>⟲ RESET TO DIXIT</span>
          </button>
        )}
      </div>

      <div className="portrait-status-bar">
        <span className="status-live-dot" />
        <span>SCROLL DOWN TO DISASSEMBLE</span>
      </div>
    </div>
  );
};

export default ParticlePortrait;
