"use client";

import { useEffect } from "react";

/**
 * Global pointer effects — magnetic buttons and the card spotlight
 * (`--mx`/`--my` custom properties on `.project`, `.cert-card`, `.repo`).
 */
export default function MotionEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !finePointer) return;

    const wired: Array<{ el: HTMLElement; onMove: (e: PointerEvent) => void; onLeave: () => void }> = [];

    document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
      let rafId = 0;
      let tx = 0;
      let ty = 0;

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        tx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        ty = (e.clientY - rect.top - rect.height / 2) * 0.22;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            el.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`;
            rafId = 0;
          });
        }
      };
      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        el.style.transform = "";
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      wired.push({ el, onMove, onLeave });
    });

    const onSpotlight = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target && target.closest(".project, .cert-card, .repo:not(.repo--skeleton)");
      if (!card) return;
      const el = card as HTMLElement;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", onSpotlight, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onSpotlight);
      wired.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.style.transform = "";
      });
    };
  }, []);

  return null;
}
