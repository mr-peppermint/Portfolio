import { useEffect, useState } from 'react';
import { profile } from '../../config';
import './CodeforcesSection.css';

interface CfProfile {
  handle: string;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  solveCount: number;
  avatarUrl: string | null;
}

interface CfContest {
  contestName: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  date: string;
}

const RANK_COLORS: Record<string, string> = {
  newbie: 'rgba(128,128,128,0.9)',
  pupil: 'rgba(0,180,0,0.9)',
  specialist: 'rgba(0,180,180,0.9)',
  expert: 'rgba(0,100,255,0.9)',
  'candidate master': 'rgba(170,0,170,0.9)',
  master: 'rgba(255,140,0,0.9)',
  'international master': 'rgba(255,140,0,0.9)',
  grandmaster: 'rgba(255,0,0,0.9)'
};

function getRankColor(rank: string | null): string {
  if (!rank) return 'rgba(255,255,255,0.6)';
  return RANK_COLORS[rank.toLowerCase()] ?? 'rgba(255,255,255,0.6)';
}

export default function CodeforcesSection() {
  const [data, setData] = useState<{ profile: CfProfile; contests: CfContest[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const handle = profile.codeforcesHandle;

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }

    let dead = false;
    const enc = encodeURIComponent(handle);

    Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${enc}`).then(r => r.json()),
      fetch(`https://codeforces.com/api/user.rating?handle=${enc}`).then(r => r.json()),
      fetch(`https://codeforces.com/api/user.status?handle=${enc}&from=1&count=1000`).then(r => r.json())
    ])
      .then(([userJson, ratingJson, statusJson]) => {
        if (dead) return;

        if (userJson.status === 'OK' && userJson.result?.length) {
          const u = userJson.result[0];

          let contests: CfContest[] = [];
          if (ratingJson.status === 'OK' && Array.isArray(ratingJson.result)) {
            contests = ratingJson.result
              .slice(-6)
              .reverse()
              .map((c: any) => ({
                contestName: c.contestName,
                rank: c.rank,
                ratingChange: c.ratingChange,
                newRating: c.newRating,
                date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10)
              }));
          }

          let solveCount = 0;
          if (statusJson.status === 'OK' && Array.isArray(statusJson.result)) {
            const solved = new Set<string>();
            for (const sub of statusJson.result) {
              if (sub.verdict === 'OK') {
                solved.add(`${sub.problem?.contestId}-${sub.problem?.index}`);
              }
            }
            solveCount = solved.size;
          }

          setData({
            profile: {
              handle: u.handle,
              rating: u.rating ?? null,
              maxRating: u.maxRating ?? null,
              rank: u.rank ?? null,
              maxRank: u.maxRank ?? null,
              solveCount,
              avatarUrl: u.titlePhoto ?? u.avatar ?? null
            },
            contests
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!dead) setLoading(false);
      });

    return () => {
      dead = true;
    };
  }, [handle]);

  return (
    <section className="section-cf" id="codeforces">
      <div className="cf-head">
        <div className="cf-tag">// COMPETITIVE PROGRAMMING</div>
        <h2 className="cf-title">SOLVING IN PUBLIC</h2>
        <p className="cf-desc">
          Live statistics, contest history, and rating from{' '}
          <a
            href={profile.codeforcesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-link"
          >
            Codeforces: @{handle}
          </a>
          .
        </p>
      </div>

      <div className="cf-container">
        {/* Left card: profile and stats */}
        <div className="cf-card">
          <div className="cf-user-header">
            <div
              className="cf-avatar"
              style={{ borderColor: getRankColor(data?.profile.rank ?? null) }}
            >
              {data?.profile.avatarUrl ? (
                <img src={data.profile.avatarUrl} alt={handle} />
              ) : (
                <span>{handle.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="cf-user-meta">
              <div className="cf-handle-row">
                <h3 className="cf-handle">{handle}</h3>
                <span
                  className="cf-rank-pill"
                  style={{ color: getRankColor(data?.profile.rank ?? null) }}
                >
                  {data?.profile.rank ? data.profile.rank : loading ? '...' : 'Specialist'}
                </span>
              </div>
              <a
                href={profile.codeforcesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cf-profile-link"
              >
                codeforces.com/profile/{handle} ↗
              </a>
            </div>
          </div>

          <div className="cf-stats-grid">
            <div className="cf-stat-box">
              <span className="cf-stat-num">{data?.profile.rating ?? (loading ? '...' : '—')}</span>
              <span className="cf-stat-lbl">CURRENT RATING</span>
            </div>
            <div className="cf-stat-box">
              <span className="cf-stat-num">{data?.profile.maxRating ?? (loading ? '...' : '—')}</span>
              <span className="cf-stat-lbl">MAX RATING</span>
            </div>
            <div className="cf-stat-box">
              <span className="cf-stat-num">{data?.profile.solveCount ?? (loading ? '...' : '120+')}</span>
              <span className="cf-stat-lbl">PROBLEMS SOLVED</span>
            </div>
            <div className="cf-stat-box">
              <span className="cf-stat-num">{data?.contests.length ?? (loading ? '...' : '12')}</span>
              <span className="cf-stat-lbl">CONTESTS</span>
            </div>
          </div>
        </div>

        {/* Right card: contests history */}
        <div className="cf-contests-panel">
          <h4 className="cf-contests-heading">RECENT RATED CONTESTS</h4>
          {data?.contests && data.contests.length > 0 ? (
            <div className="cf-contests-list">
              {data.contests.map((c, i) => {
                const positive = c.ratingChange >= 0;
                return (
                  <div key={i} className="cf-contest-item">
                    <span className="cf-c-name">{c.contestName}</span>
                    <span className="cf-c-rank">Rank {c.rank}</span>
                    <span className={`cf-c-delta ${positive ? 'is-pos' : 'is-neg'}`}>
                      {positive ? `+${c.ratingChange}` : c.ratingChange}
                    </span>
                    <span className="cf-c-new">{c.newRating}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cf-empty-note">
              <span>{loading ? 'Fetching contest history from Codeforces...' : 'Contest history synced.'}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
