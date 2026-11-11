import { useState } from 'react';
import { profile, CertificateItem } from '../../config';
import './Certificates.css';

function issuerMark(issuer: string): string {
  return issuer
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
}

export default function CertificatesSection() {
  const [active, setActive] = useState<CertificateItem | null>(null);

  const certs = profile.certificates;

  return (
    <section className="section-certs" id="certificates">
      <div className="certs-head">
        <div className="certs-tag">// CREDENTIALS &amp; HACKATHONS</div>
        <h2 className="certs-title">PROOF OF PRACTICE</h2>
        <p className="certs-desc">
          Hackathons, achievements, and programs completed — verified milestones in creative engineering and algorithms.
        </p>
      </div>

      <div className="certs-grid">
        {certs.map((cert, index) => (
          <button
            key={cert.title}
            className="cert-card"
            type="button"
            onClick={() => setActive(cert)}
            aria-label={`View details for ${cert.title}`}
          >
            <div className="cert-visual" aria-hidden="true">
              <div className="cert-visual-top">
                <span>CERTIFICATE</span>
                <span>{cert.year}</span>
              </div>
              <div className="cert-emblem">
                <span>✦</span>
              </div>
              <span className="cert-issuer-mark">{issuerMark(cert.issuer)}</span>
              <div className="cert-visual-bottom">
                <span>VERIFIED</span>
                <span>{cert.date}</span>
              </div>
            </div>

            <div className="cert-body">
              <span className="cert-issuer">{cert.issuer}</span>
              <h3 className="cert-name">{cert.title}</h3>
              <div className="cert-skills">
                {cert.skills.map(s => (
                  <span key={s} className="cert-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
              <div className="cert-foot">
                <span>VIEW DETAILS</span>
                <span className="cert-arrow">↗</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Dialog */}
      {active && (
        <div className="cert-modal-backdrop" onClick={() => setActive(null)}>
          <div
            className="cert-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-cert-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="cert-modal-close"
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close dialog"
            >
              ×
            </button>
            <div className="cert-modal-tag">// CREDENTIAL DETAILS</div>
            <h3 id="modal-cert-title" className="cert-modal-title">
              {active.title}
            </h3>
            <p className="cert-modal-issuer">{active.issuer}</p>
            <p className="cert-modal-desc">{active.description}</p>
            <div className="cert-modal-meta">
              <div>
                <dt>Issued</dt>
                <dd>{active.date}</dd>
              </div>
              <div>
                <dt>Skills</dt>
                <dd>{active.skills.join(' • ')}</dd>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
