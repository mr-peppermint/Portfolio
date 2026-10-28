"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/lib/content";

const SECTIONS = ["work", "about", "achievements", "github", "contact"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        nav.classList.toggle("is-scrolled", (window.scrollY || 0) > 16);
        if (linksRef.current && window.scrollY < 180) {
          linksRef.current.querySelectorAll("a").forEach((a) => a.classList.remove("is-active"));
        }
        queued = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const links = linksRef.current;
    if (!links) return;

    const navMap = new Map<string, Element>();
    links.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) navMap.set(href.slice(1), a);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = navMap.get(entry.target.id);
          if (!link) return;
          links.querySelectorAll("a").forEach((a) => a.classList.toggle("is-active", a === link));
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuCloseState();
    };
    const setMenuCloseState = () => setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    const onVisibility = () => {
      if (document.hidden) setMenuOpen(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <header className="site-nav" id="siteNav" ref={navRef}>
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark">{portfolio.initials}</span>
          <span className="brand-name">{portfolio.name}</span>
        </a>

        <nav
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          id="navLinks"
          aria-label="Primary"
          ref={linksRef}
        >
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#achievements" onClick={() => setMenuOpen(false)}>Credentials</a>
          <a href="#github" onClick={() => setMenuOpen(false)}>GitHub</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>

        <div className="nav-actions">
          <a className="nav-cta" href="#contact">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
          <button
            className={`nav-toggle${menuOpen ? " is-open" : ""}`}
            id="navToggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
