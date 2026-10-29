"use client";

/**
 * DecryptedText
 * ─────────────────────────────────────────────────────────────────────────────
 * A React-Bits-style scramble/decrypt text animation implemented with pure
 * React + rAF – no external animation library required.
 *
 * Props match the ReactBits DecryptedText API:
 *   text               – the final string to reveal
 *   speed              – ms between each scramble flip (default 50)
 *   maxIterations      – scramble cycles per un-revealed char before it locks (default 10)
 *   sequential         – reveal chars one-by-one from revealDirection (default true)
 *   revealDirection    – "start" | "end" | "center" (default "start")
 *   useOriginalCharsOnly – restrict glyphs to chars that appear in `text` (default false)
 *   effect             – "scramble" | "fade" (default "scramble")
 *   animateOn          – "view" | "hover" | "mount" (default "view")
 *   loop               – repeat after finishing (default false)
 *   scrambleColor      – CSS color for un-revealed chars (default "#00FF9C")
 *   className          – class on each revealed char span
 *   encryptedClassName – class on each scrambled char span
 *
 * Accessibility: a visually-hidden <span> always contains the real text.
 * Respects prefers-reduced-motion by skipping straight to revealed state.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const DEFAULT_CHARS =
  "0123456789qwertyuiopasdfghjklzxcvbnm!?></\\a`~+*=@#$%".split("");

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  effect?: "scramble" | "fade";
  animateOn?: "view" | "hover" | "mount";
  loop?: boolean;
  scrambleColor?: string;
  className?: string;
  encryptedClassName?: string;
  style?: CSSProperties;
}

interface CharState {
  char: string;
  revealed: boolean;
  iterCount: number;
}

function buildPool(text: string, useOriginalCharsOnly: boolean): string[] {
  if (useOriginalCharsOnly) {
    const uniq = Array.from(new Set(text.replace(/\s/g, "").split("")));
    return uniq.length > 0 ? uniq : DEFAULT_CHARS;
  }
  return DEFAULT_CHARS;
}

function randomFrom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Returns indices in the order they should be revealed for the given direction. */
function revealOrder(
  length: number,
  direction: "start" | "end" | "center"
): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (direction === "end") return indices.reverse();
  if (direction === "center") {
    const mid = Math.floor(length / 2);
    const result: number[] = [];
    for (let i = 0; i <= mid; i++) {
      if (mid - i >= 0) result.push(mid - i);
      if (mid + i + 1 < length) result.push(mid + i + 1);
    }
    return result;
  }
  return indices; // "start"
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  animateOn = "view",
  loop = false,
  scrambleColor = "#00FF9C",
  className = "",
  encryptedClassName = "",
  style,
}: DecryptedTextProps) {
  const chars = Array.from(text); // unicode-aware split
  const pool = buildPool(text, useOriginalCharsOnly);

  const [displayChars, setDisplayChars] = useState<CharState[]>(() =>
    chars.map((c) => ({ char: c, revealed: false, iterCount: 0 }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);

  const reduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const revealAll = useCallback(() => {
    setDisplayChars(chars.map((c) => ({ char: c, revealed: true, iterCount: 0 })));
    setIsDone(true);
    setIsAnimating(false);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const startAnimation = useCallback(() => {
    if (reduced) {
      revealAll();
      return;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setIsDone(false);
    setIsAnimating(true);
    lastTickRef.current = 0;

    // Reset
    setDisplayChars(
      chars.map((c) => ({
        char: c === " " ? " " : randomFrom(pool),
        revealed: c === " ",
        iterCount: 0,
      }))
    );

    const order = revealOrder(chars.length, revealDirection);
    let orderIdx = 0; // pointer into order[] for sequential mode

    const tick = (now: number) => {
      const delta = now - lastTickRef.current;
      if (delta < speed) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTickRef.current = now;

      setDisplayChars((prev) => {
        const next = prev.map((cs) => ({ ...cs }));
        let anyUnresolved = false;

        if (sequential) {
          // Advance pointer if current target is already revealed
          while (
            orderIdx < order.length &&
            (next[order[orderIdx]].revealed ||
              chars[order[orderIdx]] === " ")
          ) {
            orderIdx++;
          }

          if (orderIdx < order.length) {
            const target = order[orderIdx];
            const cs = next[target];

            if (cs.iterCount >= maxIterations) {
              next[target] = { char: chars[target], revealed: true, iterCount: 0 };
              orderIdx++;
            } else {
              next[target] = {
                ...cs,
                char: randomFrom(pool),
                iterCount: cs.iterCount + 1,
              };
              anyUnresolved = true;
            }

            // Still have more chars waiting
            if (orderIdx < order.length) anyUnresolved = true;
          }
        } else {
          // Non-sequential: scramble all un-revealed
          for (let i = 0; i < next.length; i++) {
            if (chars[i] === " ") continue;
            if (next[i].revealed) continue;

            if (next[i].iterCount >= maxIterations) {
              next[i] = { char: chars[i], revealed: true, iterCount: 0 };
            } else {
              next[i] = {
                ...next[i],
                char: randomFrom(pool),
                iterCount: next[i].iterCount + 1,
              };
              anyUnresolved = true;
            }
          }
        }

        if (!anyUnresolved) {
          // Ensure all are truly revealed
          for (let i = 0; i < next.length; i++) {
            next[i] = { char: chars[i], revealed: true, iterCount: 0 };
          }
        }

        return next;
      });

      // Schedule next frame OR finish
      rafRef.current = requestAnimationFrame((nextNow) => {
        setDisplayChars((snapshot) => {
          const allDone = snapshot.every(
            (cs, i) => chars[i] === " " || cs.revealed
          );
          if (!allDone) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setIsAnimating(false);
            setIsDone(true);
            if (loop) {
              setTimeout(startAnimation, 1200);
            }
          }
          return snapshot;
        });
      });
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [text, speed, maxIterations, sequential, revealDirection, pool, loop, reduced, revealAll]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount trigger
  useEffect(() => {
    if (animateOn === "mount") {
      startAnimation();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // View trigger via IntersectionObserver
  useEffect(() => {
    if (animateOn !== "view") return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      startAnimation();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          startAnimation();
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [animateOn, startAnimation]);

  // Hover trigger
  const handleMouseEnter = useCallback(() => {
    if (animateOn === "hover") startAnimation();
  }, [animateOn, startAnimation]);

  return (
    <span
      ref={containerRef}
      aria-label={text}
      onMouseEnter={handleMouseEnter}
      style={{ display: "inline", ...style }}
    >
      {/* Screen-reader only real text */}
      <span className="sr-only">{text}</span>

      {/* Visual chars */}
      <span aria-hidden="true" style={{ display: "inline" }}>
        {displayChars.map((cs, i) =>
          cs.char === " " ? (
            <span key={i} style={{ display: "inline-block", width: "0.28em" }} />
          ) : (
            <span
              key={i}
              className={cs.revealed ? className : encryptedClassName}
              style={
                !cs.revealed
                  ? { color: scrambleColor, display: "inline-block" }
                  : { display: "inline-block" }
              }
            >
              {cs.char}
            </span>
          )
        )}
      </span>

      {/* Invisible text to hold layout width stable */}
      <span
        aria-hidden="true"
        style={{
          visibility: "hidden",
          position: "absolute",
          pointerEvents: "none",
          whiteSpace: "pre",
        }}
      >
        {isDone || !isAnimating ? "" : text}
      </span>
    </span>
  );
}
