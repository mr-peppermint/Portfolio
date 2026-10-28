"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/lib/content";

function StatNumber({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = String(Math.round(value));
      return;
    }

    let raf = 0;
    let start = 0;
    const duration = 1400;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(step);
      else el.textContent = String(Math.round(value));
    };

    // Trigger once the stats panel scrolls into view.
    const parent = el.closest(".stats");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        raf = requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    if (parent) io.observe(parent);
    else raf = requestAnimationFrame(step);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value]);

  return (
    <span className="stat-number">
      <span className="stat-value" ref={ref}>
        0
      </span>
      {suffix ? <span className="stat-suffix">{suffix}</span> : null}
    </span>
  );
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <header className="section-head" data-reveal>
          <p className="section-index">01 / About</p>
          <h2 className="section-title">
            Designing with <em>restraint</em>.
            <br />
            Building with intent.
          </h2>
        </header>

        <div className="about-grid">
          <div className="about-copy" data-reveal style={{ "--delay": "120ms" } as React.CSSProperties}>
            <p className="about-lead">
              I&apos;m a developer and designer working where{" "}
              <strong>motion, performance, and clarity</strong> meet. I build interfaces that feel
              alive without getting in the way.
            </p>
            <p>
              My process starts with the boring questions: what is this for, what can be removed, and
              how fast can it feel? What&apos;s left gets treated with care — considered type, honest
              materials, and movement that explains rather than decorates.
            </p>
            <p>
              Currently exploring generative visuals, creative coding, and the small details that turn
              a good product into one people remember.
            </p>
            <a className="link-arrow" href="#contact">
              <span>Start a conversation</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <aside className="about-side" data-reveal style={{ "--delay": "220ms" } as React.CSSProperties}>
            <ul className="stats" id="stats" aria-label="Quick facts">
              {portfolio.stats.map((s) => (
                <li className="stat" key={s.label}>
                  <StatNumber value={s.value} suffix={s.suffix} />
                  <span className="stat-label">{s.label}</span>
                </li>
              ))}
            </ul>
            <div className="skills">
              <h3 className="mini-title">Toolkit</h3>
              <ul className="skill-list">
                {portfolio.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
