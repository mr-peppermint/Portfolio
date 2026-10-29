"use client";

import { useEffect, useState } from "react";
import type { CodeforcesProfile, CodeforcesContest } from "@/types/portfolio";
import { fetchCodeforcesProfile, rankColor } from "@/lib/codeforces";
import { portfolio } from "@/lib/content";

const cf = portfolio.codeforces;

function RatingBar({ change, max }: { change: number; max: number }) {
  const w = max ? Math.min(100, (Math.abs(change) / max) * 100) : 0;
  const positive = change >= 0;
  return (
    <span
      className="cf-bar-track"
      aria-hidden="true"
      style={{ justifyContent: positive ? "flex-start" : "flex-end" }}
    >
      <span
        className="cf-bar-fill"
        style={{
          width: `${w}%`,
          background: positive
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,80,80,0.45)",
        }}
      />
    </span>
  );
}

function SkeletonPanel() {
  return (
    <div className="cf-panel cf-panel--skeleton" aria-hidden="true">
      <div className="cf-profile">
        <span className="cf-avatar" />
        <div className="cf-identity">
          <span className="skeleton-line skeleton-line--short" />
          <span className="skeleton-line skeleton-line--mid" style={{ marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function CodeforcesSection() {
  const [profile, setProfile] = useState<CodeforcesProfile | null>(null);
  const [contests, setContests] = useState<CodeforcesContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchCodeforcesProfile(controller.signal).then((data) => {
      if (data) {
        setProfile(data.profile);
        setContests(data.contests);
      } else {
        setError(true);
      }
      setLoading(false);
    });
    return () => controller.abort();
  }, []);

  const maxChange = contests.reduce((m, c) => Math.max(m, Math.abs(c.ratingChange)), 1);

  return (
    <section className="section section--cf" id="codeforces">
      <div className="wrap">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="section-index">05 / Competitive programming</p>
            <h2 className="section-title">
              Solving in
              <br />
              <em>public</em>.
            </h2>
          </div>
          <p className="section-aside">
            Codeforces profile for{" "}
            <a
              href={cf.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
            >
              {cf.handle}
            </a>
            . Contest history, rating, and solve count loaded live from the Codeforces API.
          </p>
        </header>

        {loading ? (
          <SkeletonPanel />
        ) : error || !profile ? (
          <div className="cf-panel cf-panel--error" data-reveal>
            <p className="muted-note">
              Could not reach the Codeforces API right now.{" "}
              <a
                href={cf.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                View profile directly ↗
              </a>
            </p>
          </div>
        ) : (
          <div className="cf-panel" data-reveal>
            {/* Profile card */}
            <div className="cf-profile-card">
              <div
                className="cf-avatar"
                aria-hidden="true"
                style={{
                  borderColor: rankColor(profile.rank),
                }}
              >
                {profile.avatarUrl &&
                !profile.avatarUrl.includes("no-avatar") &&
                !profile.avatarUrl.includes("no-title") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{profile.handle.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="cf-identity">
                <div className="cf-name-row">
                  <h3>{profile.handle}</h3>
                  {profile.rank ? (
                    <span
                      className="cf-rank-badge"
                      style={{ color: rankColor(profile.rank) }}
                    >
                      {profile.rank}
                    </span>
                  ) : (
                    <span className="cf-rank-badge" style={{ color: "var(--dim)" }}>
                      Unrated
                    </span>
                  )}
                </div>
                <a
                  className="gh-handle"
                  href={cf.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  codeforces.com/profile/{profile.handle}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <ul className="cf-stats" aria-label="Codeforces statistics">
                <li>
                  <span className="gh-stat-value">
                    {profile.rating !== null ? profile.rating : "—"}
                  </span>
                  <span className="gh-stat-label">Current rating</span>
                </li>
                <li>
                  <span className="gh-stat-value">
                    {profile.maxRating !== null ? profile.maxRating : "—"}
                  </span>
                  <span className="gh-stat-label">Max rating</span>
                </li>
                <li>
                  <span className="gh-stat-value">{profile.solveCount}</span>
                  <span className="gh-stat-label">Problems solved</span>
                </li>
                <li>
                  <span className="gh-stat-value">{contests.length > 0 ? contests.length : "0"}</span>
                  <span className="gh-stat-label">Contests</span>
                </li>
              </ul>
            </div>

            {/* Contest history */}
            {contests.length > 0 ? (
              <div className="cf-contests">
                <p className="cf-contests-title">Recent contests</p>
                <ul className="cf-contest-list">
                  {contests.map((c, i) => (
                    <li key={i} className="cf-contest-row">
                      <span className="cf-contest-name">{c.contestName}</span>
                      <RatingBar change={c.ratingChange} max={maxChange} />
                      <span
                        className="cf-contest-delta"
                        style={{
                          color:
                            c.ratingChange > 0
                              ? "rgba(160,255,160,0.85)"
                              : c.ratingChange < 0
                              ? "rgba(255,100,100,0.85)"
                              : "var(--dim)",
                        }}
                      >
                        {c.ratingChange > 0 ? "+" : ""}
                        {c.ratingChange}
                      </span>
                      <span className="cf-contest-rating">{c.newRating}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="cf-no-contests">
                <p className="muted-note">
                  No rated contests yet —{" "}
                  <a
                    href="https://codeforces.com/contests"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-link"
                  >
                    upcoming contests ↗
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
