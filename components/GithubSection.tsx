"use client";

import { useEffect, useState } from "react";
import type { GithubProfileView, GithubRepoView, GithubStat, Heatmap } from "@/types/portfolio";
import {
  demoProfile,
  demoRepos,
  demoStats,
  demoHeatmap,
  fetchGithub,
  loadLiveHeatmap,
  formatRelative,
  trim,
  LANG_OPACITY,
} from "@/lib/github";
import { portfolio } from "@/lib/content";

const username = (portfolio.github.username || "").trim();
const nf = new Intl.NumberFormat("en-US");

function Heatmap({ heat }: { heat: Heatmap | null }) {
  const cells = heat?.cells ?? [];
  const total = heat?.total ?? 0;

  return (
    <div className="gh-activity">
      <div className="activity-head">
        <span>Contribution activity</span>
        <span className="activity-total">{heat ? `${nf.format(total)} contributions` : "—"}</span>
      </div>
      <div className="heatmap-wrap">
        <div
          className="heatmap"
          role="img"
          aria-label={
            heat
              ? `${nf.format(total)} contributions in the last year${heat.demo ? " (sample data)" : ""}`
              : "Contribution activity over the last year"
          }
        >
          {heat
            ? cells.map((cell, i) => {
                if (cell.future) return <span className="cell cell--future" key={i} />;
                let level = heat.levels[cell.iso];
                if (level == null || level < 0) level = 0;
                const count = heat.demo
                  ? [0, 1, 2, 4, 7][level]
                  : heat.counts?.[cell.iso] || 0;
                const label =
                  cell.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) +
                  " — " +
                  (count === 1 ? "1 contribution" : `${count} contributions`);
                return <span className={`cell lvl-${level}`} title={label} key={i} />;
              })
            : null}
        </div>
      </div>
      <div className="heatmap-legend" aria-hidden="true">
        <span>Less</span>
        <i className="lvl-0" />
        <i className="lvl-1" />
        <i className="lvl-2" />
        <i className="lvl-3" />
        <i className="lvl-4" />
        <span>More</span>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="repo repo--skeleton" aria-hidden="true" key={i}>
          <span className="skeleton-line skeleton-line--short" />
          <span className="skeleton-line" />
          <span className="skeleton-line skeleton-line--mid" />
          <span className="skeleton-line skeleton-line--tiny" />
        </div>
      ))}
    </>
  );
}

function RelativeTime({ iso }: { iso: string }) {
  const [text, setText] = useState("");
  useEffect(() => setText(formatRelative(iso)), [iso]);
  return <span className="repo-updated">{text}</span>;
}

function RepoGrid({ repos }: { repos: GithubRepoView[] }) {
  return (
    <div className="repo-grid" id="repoGrid" aria-live="polite">
      {repos.map((repo) => {
        const lang = repo.language || "Code";
        const tone = LANG_OPACITY[(lang.charCodeAt(0) + lang.length) % LANG_OPACITY.length];
        return (
          <article className="repo" key={repo.name}>
            <a className="repo-link" href={repo.url} target="_blank" rel="noopener noreferrer">
              <div className="repo-head">
                <svg className="repo-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                <h3>{repo.name}</h3>
                <span className="repo-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="repo-desc">{trim(repo.description, 132)}</p>
              {repo.topics.length ? (
                <div className="repo-topics">
                  {repo.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              ) : null}
              <div className="repo-meta">
                <span className="repo-lang">
                  <i className="lang-dot" style={{ opacity: tone }} />
                  {lang}
                </span>
                <span className="repo-stat" title="Stars">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {nf.format(repo.stars)}
                </span>
                <span className="repo-stat" title="Forks">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                  </svg>
                  {nf.format(repo.forks)}
                </span>
                <RelativeTime iso={repo.updated} />
              </div>
            </a>
          </article>
        );
      })}
    </div>
  );
}

export default function GithubSection() {
  const [profile, setProfile] = useState<GithubProfileView>(() => demoProfile());
  const [stats, setStats] = useState<GithubStat[]>(() => demoStats());
  const [repos, setRepos] = useState<GithubRepoView[]>(() => demoRepos());
  const [loading, setLoading] = useState(() => username !== "");
  const [mode, setMode] = useState(username ? "Live" : "Demo data");
  const [heat, setHeat] = useState<Heatmap | null>(null);

  // Deterministic per session — the demo heatmap is date-dependent, so
  // generate it only after mount to avoid a hydration mismatch.
  useEffect(() => {
    setHeat((h) => h ?? demoHeatmap());
  }, []);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    let alive = true;

    fetchGithub(controller.signal).then((live) => {
      if (!alive) return;
      if (live) {
        setProfile(live.profile);
        setStats(live.stats);
        setRepos(live.repos);
        loadLiveHeatmap(controller.signal).then((h) => {
          if (!alive) return;
          if (h) setHeat((current) => ({ ...(current ?? h), ...h, demo: false }));
        });
      } else {
        setMode("Offline demo");
      }
      setLoading(false);
    });

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="section section--github" id="github">
      <div className="wrap">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="section-index">04 / Open source</p>
            <h2 className="section-title">
              Built in
              <br />
              <em>public</em>.
            </h2>
          </div>
          <p className="section-aside">
            Repositories, experiments, and the occasional utility that escaped the lab. Loaded from
            the GitHub API when a username is configured.
          </p>
        </header>

        <div className="gh-panel" data-reveal>
          <div className="gh-profile">
            <div className="gh-avatar" id="ghAvatar" aria-hidden="true">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              ) : (
                profile.initials
              )}
            </div>
            <div className="gh-identity">
              <div className="gh-name-row">
                <h3 id="ghName">{profile.name}</h3>
                <span className="badge" id="ghMode">
                  {mode}
                </span>
              </div>
              <p className="gh-bio" id="ghBio">
                {profile.bio}
              </p>
              <a
                className="gh-handle"
                id="ghLink"
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.handle} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <ul className="gh-stats" id="ghStats" aria-label="GitHub statistics">
              {stats.map((s) => (
                <li key={s.label}>
                  <span className="gh-stat-value">{s.value}</span>
                  <span className="gh-stat-label">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <Heatmap heat={heat} />
        </div>

        {loading ? <SkeletonGrid /> : <RepoGrid repos={repos} />}
      </div>
    </section>
  );
}
