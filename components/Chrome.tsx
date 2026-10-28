"use client";

import { useEffect, useRef } from "react";

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to content
    </a>
  );
}

export function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, y / max) : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
        queued = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} id="scrollBar" />
    </div>
  );
}

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cursor || !finePointer || reduced) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let targetX = cx;
    let targetY = cy;
    let cursorRaf = 0;
    let started = false;

    const cursorLoop = () => {
      cursorRaf = 0;
      cx += (targetX - cx) * 0.18;
      cy += (targetY - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      if (Math.abs(targetX - cx) > 0.2 || Math.abs(targetY - cy) > 0.2) {
        cursorRaf = requestAnimationFrame(cursorLoop);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) {
        started = true;
        cx = targetX;
        cy = targetY;
        cursor.classList.add("is-active");
      }
      if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorLoop);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("a, button, .chip")) cursor.classList.add("is-hover");
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("a, button, .chip")) cursor.classList.remove("is-hover");
    };
    const onLeave = () => cursor.classList.remove("is-active");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="cursor" id="cursor" aria-hidden="true" ref={ref} />
  );
}
