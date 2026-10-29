/**
 * Codeforces integration
 * ------------------------------------------------------------------
 * Fetches live profile data and recent contest history from the
 * public Codeforces API. All calls are client-side only.
 *
 * API docs: https://codeforces.com/apiHelp
 */

import type { CodeforcesProfile, CodeforcesContest } from "@/types/portfolio";
import { portfolio } from "@/lib/content";

const cf = portfolio.codeforces;

export const RANK_COLORS: Record<string, string> = {
  newbie: "rgba(128,128,128,0.9)",
  pupil: "rgba(0,128,0,0.9)",
  specialist: "rgba(0,128,128,0.9)",
  expert: "rgba(0,0,255,0.9)",
  "candidate master": "rgba(170,0,170,0.9)",
  master: "rgba(255,140,0,0.9)",
  "international master": "rgba(255,140,0,0.9)",
  grandmaster: "rgba(255,0,0,0.9)",
  "international grandmaster": "rgba(255,0,0,0.9)",
  "legendary grandmaster": "rgba(255,0,0,0.9)",
};

function rankColor(rank: string | null): string {
  if (!rank) return "rgba(255,255,255,0.5)";
  return RANK_COLORS[rank.toLowerCase()] ?? "rgba(255,255,255,0.5)";
}

export { rankColor };

interface RawUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  titlePhoto?: string;
  avatar?: string;
}

interface RawRatingChange {
  contestName: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  ratingUpdateTimeSeconds: number;
}

interface RawSubmission {
  verdict?: string;
  problem: { id?: number; contestId?: number; index?: string };
}

function isoDate(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export async function fetchCodeforcesProfile(
  signal?: AbortSignal
): Promise<{ profile: CodeforcesProfile; contests: CodeforcesContest[] } | null> {
  const handle = cf.handle;
  if (!handle) return null;

  const enc = encodeURIComponent(handle);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  const sig = signal ?? controller.signal;

  try {
    const [userRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${enc}`, { signal: sig }),
      fetch(`https://codeforces.com/api/user.rating?handle=${enc}`, { signal: sig }),
      fetch(`https://codeforces.com/api/user.status?handle=${enc}&from=1&count=1000`, { signal: sig }),
    ]);

    if (!userRes.ok) throw new Error("Codeforces unavailable");

    const userJson = (await userRes.json()) as { status: string; result?: RawUser[] };
    if (userJson.status !== "OK" || !userJson.result?.length) throw new Error("User not found");

    const user = userJson.result[0];

    // Rating history
    let contests: CodeforcesContest[] = [];
    if (ratingRes.ok) {
      const ratingJson = (await ratingRes.json()) as { status: string; result?: RawRatingChange[] };
      if (ratingJson.status === "OK" && Array.isArray(ratingJson.result)) {
        contests = ratingJson.result.slice(-10).reverse().map((c) => ({
          contestName: c.contestName,
          rank: c.rank,
          ratingChange: c.ratingChange,
          newRating: c.newRating,
          date: isoDate(c.ratingUpdateTimeSeconds),
        }));
      }
    }

    // Solve count (unique problems with OK verdict)
    let solveCount = 0;
    if (statusRes.ok) {
      const statusJson = (await statusRes.json()) as { status: string; result?: RawSubmission[] };
      if (statusJson.status === "OK" && Array.isArray(statusJson.result)) {
        const solved = new Set<string>();
        for (const sub of statusJson.result) {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId ?? ""}-${sub.problem.index ?? ""}`;
            solved.add(key);
          }
        }
        solveCount = solved.size;
      }
    }

    return {
      profile: {
        handle: user.handle,
        rating: user.rating ?? null,
        maxRating: user.maxRating ?? null,
        rank: user.rank ?? null,
        maxRank: user.maxRank ?? null,
        solveCount,
        profileUrl: cf.profileUrl,
        avatarUrl: user.titlePhoto ?? user.avatar ?? null,
      },
      contests,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
