import { useEffect, useRef, useState } from 'react';
import TechText from './TechText/TechText';
import TextLoop from './TextLoop/TextLoop';
import AboutSection from './About/AboutSection';
import EducationSection from './Education/EducationSection';
import CertificatesSection from './Certificates/Certificates';
import GithubContributionGraph from './Github/GithubContributionGraph';
import CodeforcesSection from './Codeforces/CodeforcesSection';
import ProjectPreviewModal from './ProjectPreview/ProjectPreviewModal';
import BlurText from './BlurText/BlurText';
import GlareHover from './GlareHover/GlareHover';
import GradualBlur from './GradualBlur/GradualBlur';
import { useTheme } from '../context/ThemeContext';
import { profile, ProjectItem } from '../config';
import './Hero.css';

const useViewport = () => {
  const read = () => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? Math.max(window.innerHeight, 640) : 800
  });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = () => setV(read());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return v;
};

const Hero = () => {
  const { theme, toggleTheme } = useTheme();
  const { w, h } = useViewport();
  const [second, setSecond] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setSecond(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const size = Math.round(Math.max(38, Math.min(w * 0.065, h * 0.09, 82)));
  const boxW = size * 4.6;

  // Use browser-compatible H.264 encodes, with 4K only on displays that benefit from it.
  const [videoSrc] = useState(() => {
    if (typeof window === 'undefined') return '/videos/portfolio-flower-hero-1080p-compatible.mp4';

    const isUltraHighRes = window.innerWidth >= 2560 || (window.innerWidth >= 1920 && (window.devicePixelRatio || 1) >= 2);
    return isUltraHighRes
      ? '/videos/portfolio-flower-hero-4k-compatible.mp4'
      : '/videos/portfolio-flower-hero-1080p-compatible.mp4';
  });

  // Motion preference and playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.pause();
        setIsPlaying(false);
      } else {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    };

    if (mediaQuery.matches) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay rejected: retain poster fallback
            setIsPlaying(false);
          });
      }
    }

    mediaQuery.addEventListener('change', handleMotionPreference);
    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="portfolio-wrap" id="top">
      {/* 1. HERO VIEWPORT (Semantic section with decorative flower loop background) */}
      <section className="hero" aria-label="Introduction">
        {/* DECORATIVE 16:9 FLOWER ANIMATION VIDEO BACKGROUND */}
        <div className="hero-video-wrapper" aria-hidden="true">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/portfolio-flower-hero-poster.jpg"
            preload="metadata"
            className="hero-video"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Subtle dark translucent overlay to keep real HTML text legible */}
          <div className="hero-video-overlay" />
        </div>

        {/* TOP HEADER: BRAND, NAVIGATION, AND THEME TOGGLE */}
        <header className="hero-top">
          <a href="#top" className="hero-logo" aria-label="Scroll back to top">
            {profile.initials}<em>//</em>PORTFOLIO
          </a>
          <nav aria-label="Main Navigation">
            {profile.nav.map(n => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="hero-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'cream' : 'void'} theme`}
            title={`Switch to ${theme === 'dark' ? 'cream' : 'void'} theme`}
          >
            {theme === 'dark' ? '☼ CREAM' : '☾ VOID'}
          </button>
        </header>

        {/* HERO BOTTOM: ALL LEFT-SIDE ELEMENTS AT BOTTOM-LEFT, PLAYBACK ON BOTTOM-RIGHT */}
        <div className="hero-bottom">
          <div className="hero-bottom-left">
            <p className="hero-kicker">// CREATIVE DEVELOPER &amp; ALGORITHMIC ENGINEER</p>
            <h1 className="hero-headline" aria-label={profile.name}>
              <span className="sr-only">{profile.name}</span>
              <div className="hero-name" style={{ marginLeft: -boxW * 0.04 }}>
                {profile.lines.map((line, i) => (
                  <div
                    key={line}
                    style={{
                      width: boxW,
                      height: size * 1.3,
                      marginTop: i ? -size * 0.44 : 0,
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
              <span className="hero-tagline-sub">{profile.tagline}</span>
            </h1>

            <p className="hero-supporting-copy">
              Architecting high-velocity tactile interfaces and algorithmic systems at the convergence of
              fluid motion, low-latency performance, and mathematical clarity.
            </p>

            <div className="hero-bottom-actions">
              <div className="hero-actions">
                <a href="#projects" className="hero-btn-primary">
                  <span>EXPLORE WORK</span>
                  <span className="hero-btn-arrow" aria-hidden="true">↓</span>
                </a>
                <a href="#about" className="hero-btn-secondary">
                  <span>ABOUT &amp; PROFILE</span>
                  <span className="hero-btn-arrow" aria-hidden="true">→</span>
                </a>
              </div>

              <a href="#about" className="hero-scroll-cue" aria-label="Scroll down to about section">
                <span>SCROLL TO EXPLORE</span>
                <span className="hero-scroll-arrow" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-bottom-right">
            {/* ACCESSIBLE VIDEO PAUSE/PLAY CONTROL */}
            <button
              type="button"
              className="hero-playback-btn"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
              title={isPlaying ? 'Pause background video' : 'Play background video'}
            >
              <span className="playback-icon" aria-hidden="true">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </span>
              <span className="playback-label">{isPlaying ? 'PAUSE VIDEO' : 'PLAY VIDEO'}</span>
            </button>
          </div>
        </div>
        {/* GradualBlur at hero bottom — fades into the text loop strip */}
        <GradualBlur
          position="bottom"
          height="8rem"
          strength={3}
          layers={10}
          curve="ease-in-out"
          exponential
          tint={theme === 'dark' ? 'rgba(6,6,8,0.55)' : 'rgba(246,243,235,0.55)'}
          zIndex={5}
        />
      </section>

      {/* 2. COMPACT LOOPED TEXT STRIP */}
      <section className="scroll-loop-section" aria-hidden="true">
        <TextLoop
          text={profile.loopText}
          shape="line"
          tilt={-0.3}
          speed={55}
          separator="✦"
          fontSize={15}
          ribbon
          ribbonColor={theme === 'dark' ? '#f2f2f2' : '#1c1917'}
          color={theme === 'dark' ? '#0a0a0c' : '#f6f3eb'}
          ribbonWidth={34}
          scrollBoost={1.2}
          pauseOnHover
        />
      </section>

      {/* 3. ABOUT SECTION (Details on Left + Vector Particle Portrait on Right that Disassembles on Scroll Down) */}
      <AboutSection />

      {/* 4. EDUCATION SECTION */}
      <EducationSection />

      {/* 5. CERTIFICATES & ACHIEVEMENTS SECTION */}
      <CertificatesSection />

      {/* 6. GITHUB PROJECTS SECTION (Contribution Graph + ChromaGrid with AI Preview) */}
      <section id="projects" className="projects-section">
        <div className="projects-header">
          <div className="projects-tag">// 04 / OPEN SOURCE &amp; REPOSITORIES</div>
          <h2 className="projects-title">
            <BlurText
              text="BUILT IN PUBLIC"
              effect="blur"
              animateBy="words"
              direction="top"
              staggerFrom="start"
              trigger="view"
              delay={140}
              stepDuration={0.4}
              blur={12}
              distance={40}
            />
          </h2>
          <p className="projects-desc">
            All original repositories authored by {profile.name} (@{profile.githubUsername}). Select any project card to open its GPT-OSS 120B AI architectural breakdown, synthesized directly from the README.
          </p>
        </div>

        {/* GitHub Contribution Graph */}
        <GithubContributionGraph />

        {/* GlareHover project cards replacing ChromaGrid */}
        <div className="projects-grid-wrap">
          <div className="glare-projects-grid">
            {profile.projects.map((project) => (
              <button
                key={project.title}
                type="button"
                className="glare-project-btn"
                onClick={() => setSelectedProject(project as ProjectItem)}
                aria-label={`View ${project.title}`}
              >
                <GlareHover
                  width="100%"
                  height="100%"
                  borderRadius="18px"
                  borderColor={`${project.accent}44`}
                  mode="hover"
                  variant="twin"
                  glareColor={project.accent}
                  glareOpacity={0.55}
                  glareSize={32}
                  softness={0.65}
                  glareAngle={-40}
                  blendMode="screen"
                  rimGlint={true}
                  transitionDuration={600}
                  intro={true}
                  className="glare-project-card"
                >
                  {/* Background image */}
                  <img
                    src={project.image}
                    alt={project.alt ?? project.title}
                    className="glare-project-img"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Dark scrim for readability */}
                  <span className="glare-project-scrim" />

                  {/* Accent top-border line */}
                  <span className="glare-project-accent-line" style={{ background: project.accent }} />

                  {/* Content overlay */}
                  <div className="glare-project-content">
                    <span className="glare-project-title">{project.title}</span>
                    <span className="glare-project-subtitle">{project.subtitle}</span>
                    <span className="glare-project-cta">
                      VIEW PROJECT <span className="glare-project-arrow">↗</span>
                    </span>
                  </div>
                </GlareHover>
              </button>
            ))}
          </div>
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

        {/* Bottom edge blur — fades into Codeforces section */}
        <GradualBlur
          position="bottom"
          height="5rem"
          strength={2}
          layers={8}
          curve="ease-out"
          exponential
          tint={theme === 'dark' ? 'rgba(6,6,8,0.4)' : 'rgba(246,243,235,0.4)'}
          zIndex={2}
        />
      </section>

      {/* 7. CODEFORCES STATS SECTION */}
      <CodeforcesSection />

      {/* 8. CONTACT & SOCIALS SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <p className="contact-tag">// 06 / GET IN TOUCH</p>
          <h2 className="contact-title" aria-label="Let's build something tactile.">
            <BlurText
              text="Let's build something"
              effect="blur"
              animateBy="words"
              direction="top"
              staggerFrom="start"
              trigger="view"
              delay={120}
              stepDuration={0.38}
              blur={12}
              distance={40}
            />
            <BlurText
              text="tactile."
              effect="blur"
              animateBy="words"
              direction="top"
              staggerFrom="start"
              trigger="view"
              delay={150}
              stepDuration={0.4}
              blur={12}
              distance={40}
              className="contact-title-em"
            />
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

        {/* Top edge blur — softens entry from Codeforces section */}
        <GradualBlur
          position="top"
          height="4rem"
          strength={1.5}
          layers={8}
          curve="ease-out"
          exponential
          tint={theme === 'dark' ? 'rgba(6,6,8,0.3)' : 'rgba(246,243,235,0.3)'}
          zIndex={2}
        />
      </section>

      {/* 9. SITE FOOTER */}
      <footer className="portfolio-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <span className="footer-brand">{profile.initials} ✦ {profile.name}</span>
            <p className="footer-sub">Crafted with tactile precision. {new Date().getFullYear()}</p>
          </div>
          <div className="footer-links">
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>

      {/* 10. PROJECT PREVIEW MODAL */}
      <ProjectPreviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Hero;
