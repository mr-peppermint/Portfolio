"use client";

import { portfolio } from "@/lib/content";

const milestones = [
  {
    year: "2026",
    title: "TerraGuard",
    detail: "Built satellite forest-loss monitoring system using Google Earth Engine, FastAPI, and MapLibre.",
    tag: "Project",
  },
  {
    year: "2026",
    title: "Portfolio v1",
    detail: "Launched this portfolio with a WebGL particle portrait engine, live GitHub feed, and Codeforces integration.",
    tag: "Project",
  },
  {
    year: "2025",
    title: "Machine Learning Specialization",
    detail: "Completed DeepLearning.AI × Stanford 3-course ML Specialization — supervised learning, neural nets, and recommender systems.",
    tag: "Certification",
  },
  {
    year: "2024",
    title: "Meta Front-End Developer",
    detail: "Completed Meta's 9-course professional certificate covering React, UX, responsive design, and version control.",
    tag: "Certification",
  },
  {
    year: "2024",
    title: "AWS Cloud Practitioner",
    detail: "Earned foundational AWS certification covering cloud architecture, core services, security, and billing.",
    tag: "Certification",
  },
  {
    year: "2023",
    title: "CS50x — Harvard",
    detail: "Completed Harvard's Introduction to Computer Science — nine problem sets in C, Python, SQL, and JavaScript.",
    tag: "Education",
  },
  {
    year: "2023",
    title: "Google UX Design",
    detail: "Completed Google's 7-course UX Design certificate — research, wireframes, Figma prototypes, and usability testing.",
    tag: "Certification",
  },
  {
    year: "2023",
    title: "Full Stack Open — Helsinki",
    detail: "Finished 14-part full-stack curriculum covering React, Node.js, GraphQL, TypeScript, and CI/CD.",
    tag: "Education",
  },
];

const TAG_COLORS: Record<string, string> = {
  Project: "rgba(100,180,255,0.18)",
  Certification: "rgba(180,130,255,0.18)",
  Education: "rgba(100,220,160,0.18)",
};

export default function Achievements() {
  return (
    <section className="section section--achievements" id="milestones">
      <div className="wrap">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="section-index">03 / Achievements</p>
            <h2 className="section-title">
              Built through
              <br />
              <em>doing</em>.
            </h2>
          </div>
          <p className="section-aside">
            A timeline of projects shipped, certifications earned, and education completed —
            every entry represents real, verifiable work.
          </p>
        </header>

        <div className="milestone-timeline" data-reveal>
          {milestones.map((m, i) => (
            <div key={i} className="milestone-item">
              <div className="milestone-year">{m.year}</div>
              <div className="milestone-connector" aria-hidden="true">
                <span className="milestone-dot" />
                {i < milestones.length - 1 && <span className="milestone-line" />}
              </div>
              <div className="milestone-content">
                <div className="milestone-head">
                  <h3 className="milestone-title">{m.title}</h3>
                  <span
                    className="milestone-tag"
                    style={{ background: TAG_COLORS[m.tag] ?? "rgba(255,255,255,0.07)" }}
                  >
                    {m.tag}
                  </span>
                </div>
                <p className="milestone-detail">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick stats row */}
        <div className="achievement-stats" data-reveal>
          {portfolio.stats.map((s) => (
            <div key={s.label} className="achievement-stat">
              <span className="achievement-stat-value">
                {s.value}{s.suffix}
              </span>
              <span className="achievement-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
