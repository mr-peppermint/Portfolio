export interface Social {
  label: string;
  short: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface Project {
  title: string;
  glyph?: string;
  categories: string[];
  year: string;
  role: string;
  description: string;
  tags: string[];
  href: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  date: string;
  credentialId: string;
  description: string;
  skills: string[];
  href: string;
}

export interface DemoRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  url: string;
  topics: string[];
}

export interface GithubConfig {
  username: string;
  mockUsername: string;
  profileUrl: string;
  useContributionApi: boolean;
}

export interface CodeforcesConfig {
  handle: string;
  profileUrl: string;
}

export interface CodeforcesProfile {
  handle: string;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  solveCount: number;
  profileUrl: string;
  avatarUrl: string | null;
}

export interface CodeforcesContest {
  contestName: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  date: string;
}

export interface PortfolioContent {
  name: string;
  role: string;
  initials: string;
  tagline: string;
  email: string;
  location: string;
  availability: string;
  portrait: string;
  github: GithubConfig;
  codeforces: CodeforcesConfig;
  socials: Social[];
  stats: Stat[];
  skills: string[];
  projects: Project[];
  certificates: Certificate[];
  mockRepos: DemoRepo[];
}

export interface GithubProfileView {
  name: string;
  bio: string;
  handle: string;
  profileUrl: string;
  avatarUrl: string | null;
  initials: string;
}

export interface GithubStat {
  value: string;
  label: string;
}

export interface GithubRepoView {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  url: string;
  topics: string[];
}

export interface HeatCell {
  iso: string;
  date: Date;
  future: boolean;
}

export interface Heatmap {
  cells: HeatCell[];
  levels: Record<string, number>;
  /** Live-mode contribution counts keyed by ISO date. Demo uses levelCounts. */
  counts?: Record<string, number>;
  total: number;
  demo: boolean;
}
