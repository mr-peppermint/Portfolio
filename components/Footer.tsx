"use client";

import { useEffect, useState } from "react";
import { portfolio } from "@/lib/content";

export default function Footer() {
  // Deferred to keep the static export deterministic.
  const [year, setYear] = useState<string>("");
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">{portfolio.initials}</span>
          <span>
            Designed &amp; built by <span>{portfolio.name}</span>
          </span>
        </div>
        <p className="footer-meta">
          Monochrome by choice. <span id="year">{year || "2026"}</span>
        </p>
        <a className="footer-top" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
