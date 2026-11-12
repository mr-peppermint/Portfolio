import { useRef } from 'react';
import ParticlePortrait from './ParticlePortrait';
import { profile } from '../../config';
import './AboutSection.css';

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-inner">
        {/* Left Side: Details & Biography */}
        <div className="about-content">
          <div className="about-tag">// 01 / PROFILE &amp; BIOGRAPHY</div>
          <h2 className="about-title">
            Architecting high-velocity
            <br />
            <em>tactile interfaces</em>.
          </h2>

          <div className="about-text">
            <p className="about-lead">
              I am <strong>{profile.name}</strong> — a creative developer and competitive programmer operating where
              motion graphics, low-latency performance, and algorithmic rigor converge.
            </p>
            <p>
              I believe great interfaces treat physical response and render budgets as core design constraints.
              From high-DPI canvas vector particle engines and satellite canopy loss pipelines to Wayland desktop
              compositors and compiler-driven web suites, every project represents production-grade craftsmanship.
            </p>
          </div>

          {/* Core Technical Pillars */}
          <div className="about-skills-block">
            <h3 className="about-subhead">CORE PILLARS</h3>
            <div className="about-skill-chips">
              <span className="skill-chip">Canvas 2D &amp; WebGL</span>
              <span className="skill-chip">Data Structures &amp; Algorithms</span>
              <span className="skill-chip">High-DPI Particle Shaders</span>
              <span className="skill-chip">FastAPI &amp; Python</span>
              <span className="skill-chip">TypeScript Architecture</span>
              <span className="skill-chip">Competitive Programming</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="about-stats-grid">
            {profile.stats.map(s => (
              <div key={s.label} className="about-stat-item">
                <span className="about-stat-value">
                  {s.value}
                  {s.suffix}
                </span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="about-cta-row">
            <a href="#education" className="about-cta-btn">
              <span>EXPLORE EDUCATION &amp; CREDENTIALS</span>
              <span className="cta-arrow">↓</span>
            </a>
            <a href="#contact" className="about-cta-sub">
              <span>GET IN TOUCH ↗</span>
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Vector Particle Portrait (Disassembles on scroll down) */}
        <div className="about-portrait-wrap">
          <ParticlePortrait initialSrc="/portrait-hd.png" containerRef={sectionRef} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
