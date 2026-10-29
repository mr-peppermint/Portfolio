import type { PortfolioContent } from "@/types/portfolio";

/**
 * Edit this file to make the site yours.
 *
 * name        – shown in the hero, nav, title and footer
 * initials    – used for the particle monogram and favicon fallback
 * portrait    – optional path to an image in `public/`. When set, particles
 *               form the image instead of the initials, e.g. "/portrait.png".
 * github      – leave `username` empty to use `mockRepos` below. Add a
 *               username to fetch live repositories from the GitHub API.
 */
export const portfolio: PortfolioContent = {
  name: "Dixit Dahiya",
  role: "Creative Developer",
  initials: "DD",
  tagline:
    "I design and build fast, tactile interfaces — where Perfection is a material, not decoration.",
  email: "dixitdahiya77@gmail.com",
  location: "Remote — Worldwide",
  availability: "",

  // Optional. Transparent PNG works best. Opaque photographs are sampled by tone.
  portrait: "/cvr.png",

  github: {
    username: "mr-peppermint",
    mockUsername: "mr-peppermint",
    profileUrl: "https://github.com/mr-peppermint",
    useContributionApi: true,
  },

  codeforces: {
    handle: "Dexter.1",
    profileUrl: "https://codeforces.com/profile/Dexter.1",
  },

  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/mr-peppermint" },
    { label: "LinkedIn", short: "LI", href: "https://www.linkedin.com/in/dixitdahiya01/" },
    { label: "X / Twitter", short: "X", href: "https://x.com/DixitDahiya0" },
    { label: "Email", short: "@", href: "mailto:dixitdahiya77@gmail.com" },
  ],

  stats: [
    { value: 2, suffix: "+", label: "Years building" },
    { value: 4, suffix: "", label: "Projects shipped" },
    { value: 2, suffix: "", label: "Certifications" },
    { value: '90+', suffix: "", label: "Avg. Lighthouse" },
  ],

  skills: [
    "TypeScript",
    "React / Next.js",
    "Node.js",
    "WebGL / Three.js",
    "GSAP / Motion",
    "CSS architecture",
    "Python",
    "Figma",
  ],

  projects: [
    {
      title: "TerraGuard",
      glyph: "TG",
      categories: ["web", "ai"],
      year: "2026",
      role: "Full-stack & ML",
      description:
        "Satellite forest-canopy loss detection from Copernicus Sentinel-2 imagery via Google Earth Engine, a FastAPI backend, and a React + MapLibre web app.",
      tags: ["Python", "React", "FastAPI"],
      href: "https://github.com/mr-peppermint/TerraGuard",
    },
    {
      title: "Portfolio",
      glyph: "PF",
      categories: ["web", "creative"],
      year: "2026",
      role: "Design & build",
      description:
        "This very site — a fast, single-page monochrome portfolio with a particle portrait engine, live GitHub feed, and Codeforces integration.",
      tags: ["Next.js", "TypeScript", "WebGL"],
      href: "https://github.com/mr-peppermint/Portfolio",
    },
    {
      title: "MoonK",
      glyph: "MK",
      categories: ["web"],
      year: "2026",
      role: "Frontend",
      description:
        "A React + TypeScript + Vite application bootstrapped with Oxlint rules and React Compiler support for blazing-fast iteration.",
      tags: ["React", "Vite", "TypeScript"],
      href: "https://github.com/mr-peppermint/MoonK",
    },
    {
      title: "archies",
      glyph: "AR",
      categories: ["oss", "creative"],
      year: "2026",
      role: "Author",
      description:
        "A clean Hyprland + Quickshell desktop setup for Arc Linux. Focused on practical keybinds, productivity, and easy customisation.",
      tags: ["QML", "Hyprland", "Linux"],
      href: "https://github.com/mr-peppermint/archies",
    },
    {
      title: "Animus-XII",
      glyph: "AX",
      categories: ["oss"],
      year: "2026",
      role: "Config & CSS",
      description:
        "Hyprland dotfiles and a custom CSS theme suite — a full desktop environment config built from scratch.",
      tags: ["CSS", "Hyprland", "Dotfiles"],
      href: "https://github.com/mr-peppermint/Animus-XII",
    },
    {
      title: "Worksheets",
      glyph: "WS",
      categories: ["web"],
      year: "2026",
      role: "Tooling",
      description:
        "A collection of practice sheets and structured coding exercises for building and reinforcing programming fundamentals.",
      tags: ["Practice", "Algorithms", "DSA"],
      href: "https://github.com/mr-peppermint/Worksheets",
    },
  ],

  certificates: [
    {
      title: "Scratch Hackathon",
      issuer: "Newton School Of Technology",
      year: "2026",
      date: "September 2026",
      description:
        "Scratch based game development Hackathon. Organised as Speedrun of 3Hrs. The Hackathon was based on the theme of 'Space'.",
      skills: ["Mathematics", "Scratch", "Game Development"],
    },
    {
      title: "HyperNexis Hackathon",
      issuer: "HyperNexis - Manipal University",
      year: "2026",
      date: "October 2024",
      description:
        "A 36 Hours No stop hackathon baesd on theme of societal development.For builing real life applicable prototypes. For building we used React, Figma for designing the UI.",
      skills: ["React", "UI", "HTML", "CSS", "UX", "Git"],
    },
  ],

  /**
   * Fallback repositories shown when the GitHub API is unavailable.
   * These match the real public repos of mr-peppermint.
   */
  mockRepos: [
    {
      name: "TerraGuard",
      description: "Satellite forest-loss monitoring using Sentinel-2, Google Earth Engine, FastAPI and React + MapLibre.",
      language: "Python",
      stars: 0,
      forks: 0,
      updated: "2026-10-24",
      url: "https://github.com/mr-peppermint/TerraGuard",
      topics: ["earth-engine", "python", "react"],
    },
    {
      name: "Portfolio",
      description: "Monochrome Next.js portfolio with a WebGL particle portrait engine and live GitHub feed.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      updated: "2026-10-28",
      url: "https://github.com/mr-peppermint/Portfolio",
      topics: ["nextjs", "typescript", "webgl"],
    },
    {
      name: "MoonK",
      description: "React + TypeScript + Vite starter with Oxlint and React Compiler.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      updated: "2026-09-27",
      url: "https://github.com/mr-peppermint/MoonK",
      topics: ["react", "vite", "typescript"],
    },
    {
      name: "archies",
      description: "Hyprland + Quickshell setup for Arc — clean keybinds, productivity-first.",
      language: "QML",
      stars: 0,
      forks: 0,
      updated: "2026-10-07",
      url: "https://github.com/mr-peppermint/archies",
      topics: ["hyprland", "linux", "dotfiles"],
    },
    {
      name: "Animus-XII",
      description: "Hyprland config dotfiles and custom CSS desktop theme.",
      language: "CSS",
      stars: 0,
      forks: 0,
      updated: "2026-09-15",
      url: "https://github.com/mr-peppermint/Animus-XII",
      topics: ["hyprland", "dotfiles", "css"],
    },
    {
      name: "Worksheets",
      description: "Structured programming practice sheets and DSA exercises.",
      language: "Python",
      stars: 0,
      forks: 0,
      updated: "2026-10-28",
      url: "https://github.com/mr-peppermint/Worksheets",
      topics: ["dsa", "practice", "algorithms"],
    },
    {
      name: "mr-peppermint",
      description: "GitHub profile configuration with dynamic 3D contribution metrics and developer showcase.",
      language: "Markdown",
      stars: 0,
      forks: 0,
      updated: "2026-10-28",
      url: "https://github.com/mr-peppermint/mr-peppermint",
      topics: ["github", "profile", "metrics"],
    },
  ],
};
