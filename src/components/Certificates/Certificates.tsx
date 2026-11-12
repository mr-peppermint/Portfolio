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

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  Project: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
  Certification: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
  Hackathon: { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' },
  Competitive: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }
};

export default function CertificatesSection() {
  const [active, setActive] = useState<CertificateItem | null>(null);

  const certs = profile.certificates;
  const milestones = profile.milestones || [];

  return (
    <section className="section-certs" id="certificates">
      <div className="certs-head">
        <div className="certs-tag">// 03 / CREDENTIALS &amp; ACHIEVEMENTS</div>
        <h2 className="certs-title">PROOF OF PRACTICE &amp; MILESTONES</h2>
        <p className="certs-desc">
          Hackathons, accredited technical certifications, and engineering milestones — verified accomplishments in creative engineering and algorithms.
        </p>
      </div>

      {/* 1. Verified Credentials & Hackathons */}
      <div className="certs-grid">
        {certs.map(cert => (
          <button
            key={cert.title}
            className="cert-card"
            type="button"
            onClick={() => setActive(cert)}
            aria-label={`View details for ${cert.title}`}
          >
            <div className="cert-visual" aria-hidden="true">
              <div className="cert-visual-top">
                <span>CREDENTIAL</span>
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

      {/* 2. Key Achievements & Engineering Milestones Timeline */}
      {milestones.length > 0 && (
        <div className="milestones-block">
          <div className="milestones-header">
            <span className="milestones-tag">// KEY ACHIEVEMENTS TIMELINE</span>
            <h3 className="milestones-title">VERIFIED MILESTONES</h3>
          </div>

          <div className="milestones-list">
            {milestones.map((m, idx) => {
              const tagStyle = TAG_STYLES[m.tag] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--ink)' };
              return (
                <div key={`${m.title}-${idx}`} className="milestone-row">
                  <div className="milestone-year-col">
                    <span className="milestone-year">{m.year}</span>
                  </div>
                  <div className="milestone-line-col" aria-hidden="true">
                    <span className="milestone-dot" />
                    {idx < milestones.length - 1 && <span className="milestone-line" />}
                  </div>
                  <div className="milestone-info-col">
                    <div className="milestone-top">
                      <h4 className="milestone-name">{m.title}</h4>
                      <span
                        className="milestone-badge"
                        style={{ backgroundColor: tagStyle.bg, color: tagStyle.color }}
                      >
                        {m.tag}
                      </span>
                    </div>
                    <p className="milestone-desc">{m.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
