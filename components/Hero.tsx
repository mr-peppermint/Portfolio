"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ParticlePortraitHandle } from "@/lib/particles";
import { portfolio } from "@/lib/content";
import ParticleStage from "@/components/ParticleStage";
import Socials from "@/components/Socials";

interface WordChar {
  ch: string;
  d: number;
  key: string;
}

function splitName(name: string): { words: WordChar[][]; longest: number } {
  const words = name.trim().split(/\s+/);
  const longest = words.reduce((max, w) => Math.max(max, w.length), 0);
  return {
    longest,
    words: words.map((word, wi) =>
      Array.from(word).map((ch, ci) => ({
        ch,
        d: 180 + (wi * 2 + ci) * 46,
        key: `${wi}-${ci}`,
      }))
    ),
  };
}

export default function Hero() {
  const [formed, setFormed] = useState(false);
  const engineRef = useRef<ParticlePortraitHandle>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setFormed(true);
  }, []);

  const replay = () => {
    setFormed(false);
    engineRef.current?.replay();
  };

  const onEngine = useCallback((engine: ParticlePortraitHandle) => {
    engineRef.current = engine;
  }, []);

  const onFormed = useCallback(() => setFormed(true), []);

  const { words, longest } = splitName(portfolio.name);
  const nameClass =
    longest > 9 ? "hero-name--long" : longest > 6 ? "hero-name--mid" : undefined;

  return (
    <section className={`hero${formed ? " is-formed" : ""}`} id="top" aria-labelledby="hero-name">
      <ParticleStage onFormed={onFormed} onEngine={onEngine} />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className={`hero-name${nameClass ? ` ${nameClass}` : ""}`} id="hero-name">
            {words.map((word, wi) => (
              <span className="word" key={wi}>
                {word.map(({ ch, d, key }) => (
                  <span key={key} className="char" aria-hidden="true" style={{ "--d": `${d}ms` } as React.CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
            <span className="sr-only">{portfolio.name}</span>
          </h1>

          <p className="hero-role" data-reveal style={{ "--delay": "620ms" } as React.CSSProperties}>
            <span>{portfolio.role}</span>
            <span className="hero-role-line" aria-hidden="true" />
            <span className="hero-location">{portfolio.location}</span>
          </p>

          <p className="hero-lede" data-reveal style={{ "--delay": "760ms" } as React.CSSProperties}>
            <span>{portfolio.tagline}</span>
          </p>

          <div className="hero-actions" data-reveal style={{ "--delay": "900ms" } as React.CSSProperties}>
            <a className="btn btn-primary magnetic" href="#work">
              <span>View selected work</span>
              <span className="btn-ico" aria-hidden="true">↗</span>
            </a>
            <a className="btn btn-ghost magnetic" href="#contact">
              <span>Get in touch</span>
            </a>
          </div>

          <Socials compact className="hero-socials" reveal delay={1040} />
        </div>
      </div>

      <div className="wrap hero-foot">
        <a className="scroll-cue" href="#work" aria-label="Scroll to explore work">
          <span className="scroll-line" aria-hidden="true" />
          <span>Scroll to explore</span>
        </a>
        <button className="replay" id="replay" type="button" onClick={replay}>
          <span className="replay-ico" aria-hidden="true">↻</span>
          <span>Replay intro</span>
        </button>
      </div>
    </section>
  );
}
