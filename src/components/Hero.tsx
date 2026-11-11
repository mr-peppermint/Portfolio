import { useEffect, useState } from 'react';
import HandsBackground from './HandsBackground';
import TechText from './TechText/TechText';
import TextLoop from './TextLoop/TextLoop';
import ChromaGrid from './ChromaGrid/ChromaGrid';
import { profile } from '../config';
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
        if (!dead && d.status === 'OK') setUser(d.result[0]);
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
          <span>{handle ? `@${handle}` : '@user'}</span>
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

  useEffect(() => {
    const t = window.setTimeout(() => setSecond(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const size = Math.round(Math.max(48, Math.min(w * 0.08, h * 0.13, 130)));
  const boxW = size * 4.6;

  return (
    <div className="portfolio-wrap">
      {/* 1. HERO VIEWPORT */}
      <section className="hero" style={{ minHeight: h }}>
        <header className="hero-top">
          <a href="#" className="hero-logo">
            DD<em>//</em>PORTFOLIO
          </a>
          <nav>
            {profile.nav.map(n => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </header>

        {/* CENTER STAGE: HANDS + TRANSPARENT TERMINAL */}
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
          tilt={-2.2}
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

      {/* 3. GITHUB PROJECTS SECTION (ChromaGrid) */}
      <section id="projects" className="projects-section">
        <div className="projects-header">
          <div className="projects-tag">// REPOSITORIES &amp; OPEN SOURCE</div>
          <h2 className="projects-title">FEATURED GITHUB PROJECTS</h2>
          <p className="projects-desc">
            An overview of open-source libraries, systems, and creative experiments built with modern stacks.
          </p>
        </div>

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
          />
        </div>

        <div className="projects-footer">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta-btn"
          >
            <span>VIEW ALL ON GITHUB</span>
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="portfolio-footer" id="contact">
        <div className="footer-inner">
          <span className="footer-brand">DIXIT DAHIYA ✦ {new Date().getFullYear()}</span>
          <div className="footer-links">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
            <a
              href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              CODEFORCES
            </a>
            <a href="#">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
