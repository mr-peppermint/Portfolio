"use client";

import { useEffect } from "react";

/**
 * Global reveal behaviour — attaches the `.reveal` class and an
 * IntersectionObserver to every `[data-reveal]` element once mounted.
 */
export default function RevealProvider() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = window.Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    els.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
