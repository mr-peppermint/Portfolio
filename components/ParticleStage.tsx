"use client";

import { useEffect, useRef } from "react";
import { createParticlePortrait, type ParticlePortraitHandle } from "@/lib/particles";
import { portfolio } from "@/lib/content";

interface Props {
  onFormed: () => void;
  onEngine: (engine: ParticlePortraitHandle) => void;
}

/**
 * Mounts the particle engine over the hero and renders the centred
 * portrait zone the particles form into. The engine toggles the
 * canvas `is-live` class imperatively (as the original implementation
 * did), so React only carries the static markup.
 */
export default function ParticleStage({ onFormed, onEngine }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  const formedCbRef = useRef(onFormed);
  formedCbRef.current = onFormed;
  const engineCbRef = useRef(onEngine);
  engineCbRef.current = onEngine;

  useEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    const hero = canvas?.closest(".hero");
    if (!canvas || !zone || !(hero instanceof HTMLElement)) return;

    const engine = createParticlePortrait({
      canvas,
      zone,
      hero,
      initials: portfolio.initials,
      portrait: portfolio.portrait,
      onFormed: () => formedCbRef.current(),
    });
    engineCbRef.current(engine);

    return () => engine.destroy();
  }, []);

  return (
    <>
      <div className="hero-orb hero-orb--a" aria-hidden="true" />
      <div className="hero-orb hero-orb--b" aria-hidden="true" />

      <canvas id="particle-canvas" aria-hidden="true" ref={canvasRef} />

      <div className="portrait-zone" id="portrait-zone" aria-hidden="true" ref={zoneRef}>
        <span className="tick tick--tl" />
        <span className="tick tick--tr" />
        <span className="tick tick--bl" />
        <span className="tick tick--br" />
      </div>
    </>
  );
}
