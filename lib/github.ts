import type {
  GithubProfileView,
  GithubRepoView,
  GithubStat,
  Heatmap,
  HeatCell,
} from "@/types/portfolio";
import { portfolio } from "@/lib/content";

const gh = portfolio.github;
const username = (gh.username || "").trim();

const nf = new Intl.NumberFormat("en-US");
const levelCounts = [0, 1, 2, 4, 7];

export const LANG_OPACITY = [0.32, 0.48, 0.66, 0.88];

export function encodeURIComponentSafe(value: string): string {
  return encodeURIComponent(value);
}

export function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export function demoStats(): GithubStat[] {
  const stars = portfolio.mockRepos.reduce((sum, r) => sum + (r.stars || 0), 0);
  return [
    { value: nf.format(portfolio.mockRepos.length), label: "Repositories" },
    { value: "0", label: "Followers" },
    { value: nf.format(stars), label: "Stars earned" },
  ];
}

export function demoProfile(): GithubProfileView {
  return {
    name: portfolio.name,
    bio: "Full-Stack Developer & Open Source Enthusiast · Building Scalable & Performant Apps",
    handle: `@${gh.username || "mr-peppermint"}`,
    profileUrl: gh.profileUrl || "https://github.com/mr-peppermint",
    avatarUrl: "https://avatars.githubusercontent.com/u/161361481?v=4",
    initials: portfolio.initials,
  };
}

/* ------------------------------------------------------------------ */
/* Heatmap                                                             */
/* ------------------------------------------------------------------ */

export const REAL_CONTRIBUTIONS: Record<string, { count: number; level: number }> = {
  "2026-04-10": { count: 2, level: 1 },
  "2026-06-25": { count: 18, level: 4 },
  "2026-06-26": { count: 22, level: 4 },
  "2026-06-27": { count: 11, level: 2 },
  "2026-06-28": { count: 3, level: 1 },
  "2026-07-07": { count: 5, level: 1 },
  "2026-07-13": { count: 1, level: 1 },
  "2026-08-27": { count: 1, level: 1 },
  "2026-09-15": { count: 1, level: 1 },
  "2026-09-21": { count: 2, level: 1 },
  "2026-09-22": { count: 23, level: 4 },
  "2026-09-23": { count: 3, level: 1 },
  "2026-09-27": { count: 1, level: 1 },
  "2026-09-28": { count: 2, level: 1 },
  "2026-09-29": { count: 7, level: 2 },
  "2026-09-30": { count: 6, level: 2 },
  "2026-10-01": { count: 9, level: 2 },
  "2026-10-05": { count: 2, level: 1 },
  "2026-10-06": { count: 8, level: 2 },
  "2026-10-07": { count: 1, level: 1 },
  "2026-10-09": { count: 1, level: 1 },
  "2026-10-24": { count: 18, level: 4 },
  "2026-10-25": { count: 6, level: 2 },
  "2026-10-27": { count: 1, level: 1 },
  "2026-10-28": { count: 5, level: 1 },
};

/**
 * Build the 53-week date grid used by both demo and live modes.
 * Cells are chronological, which maps cleanly to a column-flow grid.
 */
export function buildCalendar(): HeatCell[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const endDay = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - (52 * 7 + endDay));

  function isoDate(date: Date): string {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  const cells: HeatCell[] = [];
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      cells.push({
        date,
        iso: isoDate(date),
        future: date > today,
      });
    }
  }
  return cells;
}

export function buildRealHeatmap(): Heatmap {
  const cells = buildCalendar();
  const levels: Record<string, number> = {};
  const counts: Record<string, number> = {};
  let total = 0;

  cells.forEach((cell) => {
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

  return { cells, levels, counts, total: total || 159, demo: false };
}

/** Baseline heatmap with mr-peppermint's real contributions. */
export function demoHeatmap(): Heatmap {
  return buildRealHeatmap();
}

interface LiveDay {
  date: string;
  level: number;
  count: number;
}

/** Client-side only; keeps the demo heatmap on failure. */
export async function loadLiveHeatmap(signal: AbortSignal): Promise<Heatmap | null> {
  if (gh.useContributionApi === false || !username) return null;

  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { signal }
  );
  if (!res.ok) throw new Error("contributions unavailable");
  const data = (await res.json()) as { contributions?: LiveDay[] };
  const list = data.contributions || [];
  const map: Record<string, number> = {};
  const counts: Record<string, number> = {};
  let total = 0;

  list.forEach((day) => {
    if (!day || !day.date) return;
    map[day.date] = typeof day.level === "number" ? day.level : 0;
    counts[day.date] = day.count || 0;
    total += day.count || 0;
  });

  return { cells: buildCalendar(), levels: map, counts, total, demo: false };
}

/* ------------------------------------------------------------------ */
/* Repositories                                                        */
/* ------------------------------------------------------------------ */

interface RawRepo extends Record<string, unknown> {
  name?: string;
  description?: string | null;
  language?: string | null;
  stars?: number;
  forks?: number;
  stargazers_count?: number;
  forks_count?: number;
  pushed_at?: string;
  updated_at?: string;
  html_url?: string;
  url?: string;
  topics?: string[];
}

function normalizeRepo(repo: RawRepo): GithubRepoView {
  return {
    name: repo.name || "untitled",
    description: repo.description || "No description provided.",
    language: repo.language || "",
    stars: repo.stargazers_count != null ? repo.stargazers_count : repo.stars || 0,
    forks: repo.forks_count != null ? repo.forks_count : repo.forks || 0,
    updated: repo.pushed_at || repo.updated_at || "2026-01-01",
    url: repo.html_url || repo.url || "#",
    topics: (repo.topics || []).slice(0, 3),
  };
}

export function trim(value: string, length: number): string {
  const s = String(value || "");
  return s.length > length ? s.slice(0, length - 1).trimEnd() + "…" : s;
}

export function liveReposFrom(repos: Record<string, unknown>[]): GithubRepoView[] {
  return repos.filter((repo) => !repo.fork && !repo.archived).map((repo) => normalizeRepo(repo));
}

export function demoRepos(): GithubRepoView[] {
  return portfolio.mockRepos.map((r) => ({ ...r }));
}

/**
 * Static-fetch profile + repos. Returns null when demo mode is active
 * or the request fails (callers fall back to demo content).
 */
export async function fetchGithub(signal?: AbortSignal): Promise<{
  profile: GithubProfileView;
  stats: GithubStat[];
  repos: GithubRepoView[];
} | null> {
  if (!username) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const urls = [
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
    ];
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, { signal: signal || controller.signal, headers: { Accept: "application/vnd.github+json" } })
      )
    );
    if (!responses[0].ok || !responses[1].ok) throw new Error("GitHub unavailable");

    const user = (await responses[0].json()) as {
      name?: string;
      login: string;
      bio?: string;
      html_url: string;
      avatar_url?: string;
      public_repos?: number;
      followers?: number;
    };
    const repos = (await responses[1].json()) as Record<string, unknown>[];
    if (!Array.isArray(repos)) throw new Error("Unexpected payload");

    const visible = liveReposFrom(repos);
    const stars = visible.reduce((sum, repo) => sum + (repo.stars || 0), 0);

    visible.sort((a, b) => (b.stars || 0) - (a.stars || 0));

    return {
      profile: {
        name: user.name || user.login,
        bio: user.bio || "Full-Stack Developer & Open Source Enthusiast · Building Scalable & Performant Apps",
        handle: `@${user.login}`,
        profileUrl: user.html_url || `https://github.com/${user.login}`,
        avatarUrl: user.avatar_url || "https://avatars.githubusercontent.com/u/161361481?v=4",
        initials: portfolio.initials,
      },
      stats: [
        { value: nf.format(user.public_repos || visible.length), label: "Repositories" },
        { value: nf.format(user.followers || 0), label: "Followers" },
        { value: nf.format(stars), label: "Stars earned" },
      ],
      repos: visible,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
