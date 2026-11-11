'use client';

import { useEffect, useState } from 'react';
import TechText from './TechText';
import './Hero.css';

const FONT = "'Montserrat', 'Helvetica Neue', Arial, sans-serif";
const INK = '#0d0d0d';
const ACCENT = '#c1272d';

const ROLES = ['Certificates', 'GitHub projects', 'Codeforces rating'];

const NAV = [
  { label: 'Certificates', href: '#certificates' },
  { label: 'Projects', href: '#projects' },
  { label: 'Codeforces', href: '#codeforces' },
  { label: 'Contact', href: '#socials' }
];

const useTypewriter = (words, { type = 70, erase = 35, hold = 1400 } = {}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let delay = deleting ? erase : type;
    if (!deleting && text === word) delay = hold;
    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex(i => (i + 1) % words.length);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, words, type, erase, hold]);

  return text;
};

const Hero = ({ name = 'YOUR NAME', year = new Date().getFullYear() }) => {
  const [showSecond, setShowSecond] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const typed = useTypewriter(ROLES);

  useEffect(() => {
    const a = setTimeout(() => setShowSecond(true), 900);
    const b = setTimeout(() => setShowMeta(true), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const common = {
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 220,
    letterSpacing: -0.03,
    align: 'left',
    color: INK,
    accentColor: ACCENT,
    reveal: 'letter',
    dashLength: 4,
    dashGap: 2,
    specks: 15,
    intro: 'metrics',
    introDuration: 1.8,
    clickKick: true,
    guides: false
  };

  return (
    <section className="hero" id="home">
      <nav className="hero-nav" aria-label="Primary">
        <a className="hero-mark" href="#home">
          {name}
        </a>
        <ul>
          {NAV.map(item => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hero-body">
        <div className="hero-title">
          <div className="hero-line">
            <TechText {...common} text="PORT" />
          </div>
          <div className="hero-line">{showSecond && <TechText {...common} text="FOLIO" />}</div>
          <div className={`hero-meta ${showMeta ? 'is-in' : ''}`}>
            <span className="hero-name">
              {name} {year}
            </span>
            <span className="hero-typed" aria-live="polite">
              {typed}
              <i className="hero-caret" />
            </span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-ring" />
          <div className="hero-horn hero-horn--a" />
          <div className="hero-horn hero-horn--b" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
