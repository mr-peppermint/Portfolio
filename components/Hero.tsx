"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { ParticlePortraitHandle } from "@/lib/particles";
import { portfolio } from "@/lib/content";
import ParticleStage from "@/components/ParticleStage";
import DecryptedText from "@/components/DecryptedText";
import Socials from "@/components/Socials";

export default function Hero() {
  const [formed, setFormed] = useState(false);
  const [decryptKey, setDecryptKey] = useState(0); // bumped to re-trigger animation on replay
  const engineRef = useRef<ParticlePortraitHandle>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setFormed(true);
  }, []);

  const replay = () => {
    setFormed(false);
    setDecryptKey((k) => k + 1);
    engineRef.current?.replay();
  };

  const onEngine = useCallback((engine: ParticlePortraitHandle) => {
    engineRef.current = engine;
  }, []);

  const onFormed = useCallback(() => setFormed(true), []);

  const longest = portfolio.name
    .trim()
    .split(/\s+/)
    .reduce((max, w) => Math.max(max, w.length), 0);
  const nameClass =
    longest > 9 ? "hero-name--long" : longest > 6 ? "hero-name--mid" : undefined;

  return (
    <section className={`hero${formed ? " is-formed" : ""}`} id="top" aria-labelledby="hero-name">
      <ParticleStage onFormed={onFormed} onEngine={onEngine} />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1
            className={`hero-name${nameClass ? ` ${nameClass}` : ""}`}
            id="hero-name"
          >
            <DecryptedText
              key={decryptKey}
              text={portfolio.name}
              animateOn="view"
              effect="scramble"
              sequential
              revealDirection="start"
              speed={50}
              maxIterations={10}
              scrambleColor="rgba(255,255,255,0.82)"
              useOriginalCharsOnly={false}
              loop={false}
              className="decrypted-revealed"
              encryptedClassName="decrypted-encrypted"
            />
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
