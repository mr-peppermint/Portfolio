import { useEffect, useState } from 'react';
import HandsBackground from './HandsBackground';
import TechText from './TechText/TechText';
import TextLoop from './TextLoop/TextLoop';
import ChromaGrid from './ChromaGrid/ChromaGrid';
import GithubContributionGraph from './Github/GithubContributionGraph';
import CertificatesSection from './Certificates/Certificates';
import CodeforcesSection from './Codeforces/CodeforcesSection';
import ProjectPreviewModal from './ProjectPreview/ProjectPreviewModal';
import { profile, ProjectItem } from '../config';
import './Hero.css';

type CfUser = { rating?: number; maxRating?: number; rank?: string };

const useViewport = () => {
  const read = () => ({ w: window.innerWidth, h: Math.max(window.innerHeight, 640) });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = () => setV(read());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return v;
};

const ExeWindow = () => {
  const [user, setUser] = useState<CfUser | null>(null);
  const handle = profile.codeforcesHandle;

  useEffect(() => {
    if (!handle) return undefined;
    let dead = false;
    fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`)
      .then(r => r.json())
      .then(d => {
        if (!dead && d.status === 'OK' && d.result?.[0]) setUser(d.result[0]);
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [handle]);

  const val = (v?: number | string) => (v === undefined ? '—' : String(v));

  return (
    <div className="exe" role="region" aria-label="Terminal Status Window">
      <div className="exe-bar">
        <span>PROJECT .EXE</span>
        <span className="exe-btns" aria-hidden="true">
          <i>_</i>
          <i>□</i>
          <i>×</i>
        </span>
      </div>
      <div className="exe-body">
        <div className="exe-row">
          <b>CODEFORCES</b>
          <span>{handle ? `@${handle}` : '@Dexter.1'}</span>
        </div>
        <div className="exe-row">
          <span>RATING</span>
          <span>{val(user?.rating)}</span>
        </div>
        <div className="exe-row">
          <span>MAX</span>
          <span>{val(user?.maxRating)}</span>
        </div>
        <div className="exe-row">
          <span>RANK</span>
          <span>{val(user?.rank)}</span>
        </div>
        <div className="exe-cursor">&gt;_</div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { w, h } = useViewport();
  const [second, setSecond] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setSecond(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const size = Math.round(Math.max(48, Math.min(w * 0.08, h * 0.12, 120)));
  const boxW = size * 4.6;

  return (
    <div className="portfolio-wrap" id="top">
      {/* 1. HERO VIEWPORT (100vh) */}
      <section className="hero" style={{ minHeight: h }}>
        <header className="hero-top">
          <a href="#top" className="hero-logo">
            {profile.initials}<em>//</em>PORTFOLIO
          </a>
          <nav>
            {profile.nav.map(n => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </header>

        {/* FULL-SCREEN CENTER STAGE: ARMS FIT TO SCREEN + TRANSPARENT TERMINAL */}
        <div className="hero-stage">
          <HandsBackground />
          <ExeWindow />
        </div>

        {/* BOTTOM HERO: NAME & TAGLINE */}
        <div className="hero-bottom">
          <div className="hero-left">
            <p className="hero-tag">{profile.tagline}</p>
            <div className="hero-name" style={{ marginLeft: -boxW * 0.04 }}>
              {profile.lines.map((line, i) => (
                <div
                  key={line}
                  style={{
                    width: boxW,
                    height: size * 1.35,
                    marginTop: i ? -size * 0.45 : 0,
                    position: 'relative'
                  }}
                >
                  {(i === 0 || second) && (
                    <TechText
                      text={line}
                      fontFamily="'Space Grotesk', sans-serif"
                      fontWeight={700}
                      fontSize={size}
                      align="left"
                      color="#ffffff"
                      accentColor="#c0c0c0"
                      reveal="letter"
                      dashLength={4}
                      dashGap={2}
                      specks={15}
                      intro="assemble"
                      introDuration={2.2}
                      clickKick
                      guides={false}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <a href="#projects" className="hero-scroll-cue" aria-label="Scroll down to projects">
            <span>SCROLL TO EXPLORE</span>
            <span className="hero-scroll-arrow">↓</span>
          </a>
        </div>
      </section>

      {/* 2. LOOPED TEXT BANNER (Appears when scrolled) */}
      <section className="scroll-loop-section" aria-hidden="true">
        <TextLoop
          text={profile.loopText}
          shape="line"
          tilt={-2.0}
          speed={85}
          separator="✦"
          fontSize={44}
          ribbon
          ribbonColor="#f2f2f2"
          color="#0a0a0c"
          ribbonWidth={90}
          scrollBoost={1.4}
          pauseOnHover
        />
      </section>

      {/* 3. GITHUB PROJECTS SECTION (Contribution Graph + ChromaGrid with AI Preview) */}
      <section id="projects" className="projects-section">
        <div className="projects-header">
          <div className="projects-tag">// 01 / OPEN SOURCE &amp; REPOSITORIES</div>
          <h2 className="projects-title">BUILT IN PUBLIC</h2>
          <p className="projects-desc">
            All original repositories authored by {profile.name} (@{profile.githubUsername}). Select any project card to open its GPT-OSS 120B AI architectural breakdown, synthesized directly from the README.
          </p>
        </div>

        {/* GitHub Contribution Graph */}
        <GithubContributionGraph />

        {/* ChromaGrid showing all original repositories with preview trigger */}
        <div className="projects-grid-wrap">
          <ChromaGrid
            items={profile.projects}
            columns={3}
            radius={280}
            gap={16}
            minCardWidth={240}
            aspectRatio="16 / 10"
            cardRadius={18}
            softness={0.65}
            damping={0.4}
            glow={0.55}
            borderGlow={1}
            reveal="spotlight"
            theme="dark"
            frame={true}
            onItemClick={item => setSelectedProject(item as ProjectItem)}
          />
        </div>

        <div className="projects-footer">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta-btn"
          >
            <span>VIEW ALL REPOSITORIES ON GITHUB</span>
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </section>

      {/* 4. CREDENTIALS & HACKATHONS SECTION */}
      <CertificatesSection />

      {/* 5. CODEFORCES STATS SECTION */}
      <CodeforcesSection />

      {/* 6. CONTACT & SOCIALS SECTION (Matching main branch style) */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <p className="contact-tag">// 04 / GET IN TOUCH</p>
          <h2 className="contact-title">
            Let&apos;s build something
            <br />
            <em>tactile</em>.
          </h2>
          <p className="contact-desc">
            Interested in collaboration, creative engineering, or competitive programming discussions? Drop a message.
          </p>

          <a
            className="contact-email-btn"
            href={`mailto:${profile.email}`}
            aria-label={`Email ${profile.email}`}
          >
            <span>{profile.email}</span>
            <span className="email-arrow">↗</span>
          </a>

          {/* Social Links from main branch */}
          <ul className="socials-list" aria-label="Social links">
            {profile.socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <span className="social-short">{s.short}</span>
                  <span>{s.label}</span>
                  <span className="social-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. SITE FOOTER */}
      <footer className="portfolio-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <span className="footer-brand">{profile.initials} ✦ {profile.name}</span>
            <p className="footer-sub">Monochrome by choice. {new Date().getFullYear()}</p>
          </div>
          <div className="footer-links">
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>

      {/* 8. PROJECT PREVIEW MODAL (GPT-OSS 120B AI README SYNTHESIS) */}
      <ProjectPreviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Hero;
