"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/lib/content";
import Socials from "@/components/Socials";

function fallbackCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export default function Contact() {
  const [toast, setToast] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(""), 2400);
  };

  const copyEmail = () => {
    const email = portfolio.email;
    const done = () => {
      showToast(`Email copied — ${email}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    };

    const onError = () => {
      if (fallbackCopy(email)) done();
      else showToast(`Couldn't copy — ${email}`);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(onError);
    } else if (fallbackCopy(email)) {
      done();
    } else {
      showToast(`Couldn't copy — ${email}`);
    }
  };

  return (
    <section className="section section--contact" id="contact">
      <div className="wrap contact-inner">
        <p className="section-index" data-reveal>
          05 / Contact
        </p>
        <h2 className="contact-title" data-reveal style={{ "--delay": "80ms" } as React.CSSProperties}>
          Have something
          <br />
          <em>strange</em> in mind?
        </h2>
        <p className="contact-lede" data-reveal style={{ "--delay": "160ms" } as React.CSSProperties}>
          Let&apos;s make it real. I take on a small number of projects at a time — tell me what
          you&apos;re building and where it hurts.
        </p>

        <div className="contact-actions" data-reveal style={{ "--delay": "240ms" } as React.CSSProperties}>
          <a className="contact-email magnetic" href={`mailto:${portfolio.email}`}>
            <span>{portfolio.email}</span>
            <span className="email-arrow" aria-hidden="true">↗</span>
          </a>
          <button className="btn btn-ghost magnetic" id="copyEmail" type="button" onClick={copyEmail}>
            <span>{copied ? "Copied" : "Copy email"}</span>
            <span className="btn-ico" aria-hidden="true">⧉</span>
          </button>
        </div>

        <Socials className="socials" reveal delay={320} />

        <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite" id="toast">
          {toast}
        </div>
      </div>
    </section>
  );
}
