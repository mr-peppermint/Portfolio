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
    { value: "24", label: "Repositories" },
    { value: "186", label: "Followers" },
    { value: nf.format(stars), label: "Stars earned" },
  ];
}

export function demoProfile(): GithubProfileView {
  return {
    name: portfolio.name,
    bio: "Building small, sharp tools for the web.",
    handle: `@${gh.mockUsername || "yourhandle"}`,
    profileUrl: gh.profileUrl || "https://github.com/",
    avatarUrl: null,
    initials: portfolio.initials,
  };
}

/* ------------------------------------------------------------------ */
/* Heatmap                                                             */
/* ------------------------------------------------------------------ */

function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

function makeLevels(cells: HeatCell[]): { map: Record<string, number>; total: number; demo: boolean } {
  const rand = rng(seedFrom(username || gh.mockUsername || "monochrome"));
  const map: Record<string, number> = {};
  let streak = 0;
  let total = 0;

  cells.forEach((cell) => {
    if (cell.future) {
      map[cell.iso] = -1;
      return;
    }
    const weekday = cell.date.getDay();
    const r = rand();
    let level = 0;

    if (streak > 0) {
      level = rand() > 0.22 ? Math.min(4, streak > 5 ? 3 : 2) : 0;
      streak = level > 0 ? streak + 1 : 0;
    } else if (weekday === 0 || weekday === 6) {
      level = r > 0.68 ? 1 : 0;
    } else {
      level = r > 0.86 ? (r > 0.975 ? 4 : r > 0.94 ? 3 : 2) : r > 0.58 ? 1 : 0;
    }

    if (level >= 2 && rand() > 0.7) streak = 1;
    map[cell.iso] = level;
    total += levelCounts[level];
  });

  return { map, total, demo: true };
}

/** Date-dependent demo heatmap — run on the client after mount. */
export function demoHeatmap(): Heatmap {
  const cells = buildCalendar();
  const data = makeLevels(cells);
  return { cells, levels: data.map, total: data.total, demo: true };
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
  return portfolio.mockRepos.slice(0, 6).map((r) => ({ ...r }));
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
        bio: user.bio || "Building things on the web.",
        handle: `@${user.login}`,
        profileUrl: user.html_url || `https://github.com/${user.login}`,
        avatarUrl: user.avatar_url || null,
        initials: portfolio.initials,
      },
      stats: [
        { value: nf.format(user.public_repos || visible.length), label: "Repositories" },
        { value: nf.format(user.followers || 0), label: "Followers" },
        { value: nf.format(stars), label: "Stars earned" },
      ],
      repos: visible.slice(0, 6),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
