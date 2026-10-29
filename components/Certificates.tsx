"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/lib/content";
import type { Certificate } from "@/types/portfolio";

const certs = portfolio.certificates;

function issuerMark(issuer: string): string {
  return issuer
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function CertCard({ cert, index, onOpen }: { cert: Certificate; index: number; onOpen: (i: number) => void }) {
  return (
    <button
      className="cert-card"
      type="button"
      data-cert={index}
      aria-haspopup="dialog"
      onClick={() => onOpen(index)}
    >
      <span className="cert-visual" aria-hidden="true">
        <span className="cert-top">
          <span>Certificate</span>
          <span>{cert.year}</span>
        </span>
        <span className="cert-emblem">
          <span>✦</span>
        </span>
        <span className="cert-issuer-mark">{issuerMark(cert.issuer)}</span>
        <span className="cert-bottom">
          <span>Verified</span>
          <span>{(cert.credentialId || "").slice(-8)}</span>
        </span>
      </span>
      <span className="cert-body">
        <span className="cert-issuer">{cert.issuer}</span>
        <span className="cert-title">{cert.title}</span>
        <span className="cert-foot">
          <span>View credential</span>
          <span aria-hidden="true">↗</span>
        </span>
        <span className="sr-only"> — opens details dialog</span>
      </span>
    </button>
  );
}

export default function Certificates() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Certificate | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove("dialog-open");
      setActive(null);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const open = (index: number) => {
    const cert = certs[index];
    const dialog = dialogRef.current;
    if (!cert || !dialog) return;
    setActive(cert);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      document.documentElement.classList.add("dialog-open");
    }
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) dialog.close();
    if (dialog) document.documentElement.classList.remove("dialog-open");
    setActive(null);
  };

  const cert = active;
  const rows: Array<[string, string]> = cert
    ? [
        ...(cert.date ? ([["Issued", cert.date]] as Array<[string, string]>) : []),
        ...(cert.credentialId ? ([["Credential ID", cert.credentialId]] as Array<[string, string]>) : []),
        ...(cert.skills && cert.skills.length
          ? ([["Skills", cert.skills.join(" · ")]] as Array<[string, string]>)
          : []),
      ]
    : [];

  return (
    <section className="section section--certs" id="achievements">
      <div className="wrap">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="section-index">03 / Credentials</p>
            <h2 className="section-title">
              Proof of
              <br />
              <em>practice</em>.
            </h2>
          </div>
          <p className="section-aside">
            Certifications and Programs I&apos;ve completed — the structured side of a mostly
            self-directed education. Select a card to view details.
          </p>
        </header>

        <div className="cert-grid">
          {certs.map((c, i) => (
            <CertCard key={c.title} cert={c} index={i} onOpen={open} />
          ))}
        </div>
      </div>

      <dialog className="cert-dialog" aria-labelledby="certDialogTitle" ref={dialogRef}>
        <div className="dialog-inner">
          <button
            className="dialog-close"
            type="button"
            aria-label="Close credential details"
            onClick={close}
          >
            ×
          </button>
          <p className="section-index">Credential</p>
          <h3 className="dialog-title">{cert ? cert.title : "—"}</h3>
          <p className="dialog-issuer">{cert ? cert.issuer : "—"}</p>
          <p className="dialog-desc">{cert ? cert.description : "—"}</p>
          <dl className="dialog-meta">
            {rows.map(([dt, dd]) => (
              <div key={dt}>
                <dt>{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>
          <div className="dialog-actions">
            {cert && cert.href && cert.href !== "#"
              ? (
                <a
                  className="btn btn-primary"
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${cert.title} (opens in a new tab)`}
                >
                  <span>Verify credential</span>
                  <span className="btn-ico" aria-hidden="true">↗</span>
                </a>
              )
              : null}
          </div>
        </div>
      </dialog>
    </section>
  );
}
