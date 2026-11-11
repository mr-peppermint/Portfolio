import { useEffect, useState } from 'react';
import { profile } from '../../config';
import './GithubContributionGraph.css';

interface HeatCell {
  date: Date;
  iso: string;
  future: boolean;
}

interface HeatmapData {
  cells: HeatCell[];
  levels: Record<string, number>;
  counts: Record<string, number>;
  total: number;
}

const REAL_CONTRIBUTIONS: Record<string, { count: number; level: number }> = {
  '2026-04-10': { count: 2, level: 1 },
  '2026-06-25': { count: 18, level: 4 },
  '2026-06-26': { count: 22, level: 4 },
  '2026-06-27': { count: 11, level: 2 },
  '2026-06-28': { count: 3, level: 1 },
  '2026-07-07': { count: 5, level: 1 },
  '2026-07-13': { count: 1, level: 1 },
  '2026-08-27': { count: 1, level: 1 },
  '2026-09-15': { count: 1, level: 1 },
  '2026-09-21': { count: 2, level: 1 },
  '2026-09-22': { count: 23, level: 4 },
  '2026-09-23': { count: 3, level: 1 },
  '2026-09-27': { count: 1, level: 1 },
  '2026-09-28': { count: 2, level: 1 },
  '2026-09-29': { count: 7, level: 2 },
  '2026-09-30': { count: 6, level: 2 },
  '2026-10-01': { count: 9, level: 2 },
  '2026-10-05': { count: 2, level: 1 },
  '2026-10-06': { count: 8, level: 2 },
  '2026-10-07': { count: 1, level: 1 },
  '2026-10-09': { count: 1, level: 1 },
  '2026-10-24': { count: 18, level: 4 },
  '2026-10-25': { count: 6, level: 2 },
  '2026-10-27': { count: 1, level: 1 },
  '2026-10-28': { count: 5, level: 1 }
};

function buildCalendar(): HeatCell[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const endDay = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - (52 * 7 + endDay));

  function isoDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  const cells: HeatCell[] = [];
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      cells.push({
        date,
        iso: isoDate(date),
        future: date > today
      });
    }
  }
  return cells;
}

function buildDefaultHeatmap(): HeatmapData {
  const cells = buildCalendar();
  const levels: Record<string, number> = {};
  const counts: Record<string, number> = {};
  let total = 0;

  cells.forEach(cell => {
    if (cell.future) {
      levels[cell.iso] = -1;
      return;
    }
    const hit = REAL_CONTRIBUTIONS[cell.iso];
    if (hit) {
      levels[cell.iso] = hit.level;
      counts[cell.iso] = hit.count;
      total += hit.count;
    } else {
      levels[cell.iso] = 0;
      counts[cell.iso] = 0;
    }
  });

  return { cells, levels, counts, total: total || 159 };
}

export default function GithubContributionGraph() {
  const [heat, setHeat] = useState<HeatmapData>(buildDefaultHeatmap);
  const [stats, setStats] = useState({ repos: 7, followers: 0, stars: 0 });
  const [bio, setBio] = useState('Full-Stack Developer & Open Source Enthusiast');
  const [avatar, setAvatar] = useState('https://avatars.githubusercontent.com/u/161361481?v=4');
  const username = profile.githubUsername;

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();

    // 1. Try to fetch live contribution activity
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      signal: controller.signal
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.contributions)) {
          const map: Record<string, number> = {};
          const counts: Record<string, number> = {};
          let total = 0;

          data.contributions.forEach((day: { date: string; level: number; count: number }) => {
            if (!day?.date) return;
            map[day.date] = typeof day.level === 'number' ? day.level : 0;
            counts[day.date] = day.count || 0;
            total += day.count || 0;
          });

          setHeat({ cells: buildCalendar(), levels: map, counts, total: total || 159 });
        }
      })
      .catch(() => {});

    // 2. Fetch live profile stats
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(u => {
        if (u.login) {
          if (u.bio) setBio(u.bio);
          if (u.avatar_url) setAvatar(u.avatar_url);
          setStats(s => ({
            ...s,
            repos: u.public_repos ?? s.repos,
            followers: u.followers ?? s.followers
          }));
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [username]);

  return (
    <div className="gh-panel">
      {/* Profile info column */}
      <div className="gh-profile">
        <div className="gh-avatar">
          <img src={avatar} alt={profile.name} loading="lazy" />
        </div>
        <div className="gh-identity">
          <div className="gh-name-row">
            <h3 className="gh-name">{profile.name}</h3>
            <span className="gh-badge">AUTHOR</span>
          </div>
          <p className="gh-bio">{bio}</p>
          <a
            className="gh-handle"
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{username} <span>↗</span>
          </a>
        </div>

        <ul className="gh-stats" aria-label="GitHub statistics">
          <li>
            <span className="gh-stat-value">{stats.repos}</span>
            <span className="gh-stat-label">ORIGINAL REPOSITORIES</span>
          </li>
          <li>
            <span className="gh-stat-value">{heat.total}+</span>
            <span className="gh-stat-label">CONTRIBUTIONS</span>
          </li>
          <li>
            <span className="gh-stat-value">{stats.followers}</span>
            <span className="gh-stat-label">FOLLOWERS</span>
          </li>
        </ul>
      </div>

      {/* Heatmap column */}
      <div className="gh-activity">
        <div className="activity-head">
          <span>CONTRIBUTION GRAPH (PAST YEAR)</span>
          <span className="activity-total">{heat.total} contributions</span>
        </div>

        <div className="heatmap-wrap">
          <div
            className="heatmap"
            role="img"
            aria-label={`${heat.total} contributions in the last year`}
          >
            {heat.cells.map((cell, i) => {
              if (cell.future) return <span className="cell cell--future" key={i} />;
              let level = heat.levels[cell.iso];
              if (level == null || level < 0) level = 0;
              const count = heat.counts[cell.iso] || 0;
              const dateStr = cell.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const label = `${dateStr} — ${count} ${count === 1 ? 'contribution' : 'contributions'}`;
              return <span className={`cell lvl-${level}`} title={label} key={i} />;
            })}
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
    </div>
  );
}
