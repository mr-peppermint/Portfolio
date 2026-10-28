"use client";

import { useState } from "react";
import { portfolio } from "@/lib/content";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "creative", label: "Creative" },
  { id: "ai", label: "AI" },
  { id: "oss", label: "Open source" },
];

export default function Work() {
  const [filter, setFilter] = useState("all");

  return (
    <section className="section section--work" id="work">
      <div className="wrap">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="section-index">02 / Selected work</p>
            <h2 className="section-title">
              Projects with
              <br />a <em>pulse</em>.
            </h2>
          </div>
          <div className="filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`chip${filter === f.id ? " is-active" : ""}`}
                type="button"
                aria-pressed={filter === f.id}
                data-filter={f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="project-grid" id="projectGrid">
          {portfolio.projects.map((p, i) => {
            const hidden = filter !== "all" && !p.categories.includes(filter);
            return (
              <article
                key={p.title}
                className={`project${hidden ? " is-hidden" : ""}`}
                data-category={p.categories.join(" ")}
                style={{ "--i": i } as React.CSSProperties}
              >
                <a
                  className="project-link"
                  href={p.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="project-visual" aria-hidden="true">
                    <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="project-glyph">{p.glyph || p.title.slice(0, 2).toUpperCase()}</span>
                    <span className="project-grid-lines" />
                    <span className="project-corner project-corner--tl" />
                    <span className="project-corner project-corner--br" />
                  </div>
                  <div className="project-body">
                    <div className="project-head">
                      <h3>{p.title}</h3>
                      <span className="project-arrow" aria-hidden="true">↗</span>
                    </div>
                    <p className="project-desc">{p.description}</p>
                    <ul className="project-tags">
                      {p.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <div className="project-meta">
                      <span>{p.year}</span>
                      <span>{p.role}</span>
                    </div>
                  </div>
                  <span className="sr-only">— view project, opens in a new tab</span>
                </a>
              </article>
            );
          })}
        </div>

        <div className="work-foot" data-reveal>
          <p className="muted-note">A few things I&apos;ve built. More experiments live on GitHub.</p>
          <a className="link-arrow" href="#github">
            <span>Explore the repositories</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
