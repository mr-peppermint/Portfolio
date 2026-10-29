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
    { value: 5, suffix: "+", label: "Years building" },
    { value: 38, suffix: "", label: "Projects shipped" },
    { value: 12, suffix: "", label: "Certifications" },
    { value: 99, suffix: "", label: "Avg. Lighthouse" },
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
      title: "Machine Learning Specialization",
      issuer: "DeepLearning.AI & Stanford Online",
      year: "2025",
      date: "September 2025",
      credentialId: "DLAI-ML-2025-0917",
      description:
        "Supervised learning, neural networks, and practical model evaluation — completed across three courses with a capstone recommender system.",
      skills: ["Python", "Machine learning", "Model evaluation"],
      href: "https://www.coursera.org/",
    },
    {
      title: "Meta Front-End Developer",
      issuer: "Meta",
      year: "2024",
      date: "November 2024",
      credentialId: "META-FE-2024-3381",
      description:
        "A nine-course professional program covering React, responsive interfaces, UX foundations, and version control, ending in a capstone application.",
      skills: ["React", "UX", "Git"],
      href: "https://www.coursera.org/",
    },
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
      date: "June 2024",
      credentialId: "AWS-CP-2024-7742",
      description:
        "Foundational certification covering cloud concepts, AWS core services, security, architecture, and billing models.",
      skills: ["Cloud", "AWS", "Architecture"],
      href: "https://aws.amazon.com/certification/",
    },
    {
      title: "CS50x: Introduction to Computer Science",
      issuer: "Harvard University",
      year: "2023",
      date: "December 2023",
      credentialId: "CS50X-2023-1890",
      description:
        "Algorithms, data structures, memory, and web programming — nine problem sets and a final project, from C to Python to JavaScript.",
      skills: ["C", "Python", "Algorithms"],
      href: "https://cs50.harvard.edu/x/",
    },
    {
      title: "Google UX Design",
      issuer: "Google",
      year: "2023",
      date: "August 2023",
      credentialId: "GOOGLE-UX-2023-5524",
      description:
        "End-to-end UX process: research, wireframes, prototypes, usability testing, and accessible design across three portfolio-ready case studies.",
      skills: ["UX research", "Figma", "Prototyping"],
      href: "https://www.coursera.org/",
    },
    {
      title: "Full Stack Open",
      issuer: "University of Helsinki",
      year: "2023",
      date: "April 2023",
      credentialId: "FSO-2023-4410",
      description:
        "Modern full-stack development with React, Node.js, MongoDB, GraphQL, TypeScript, and CI/CD — fourteen parts, all project-based.",
      skills: ["TypeScript", "Node.js", "GraphQL"],
      href: "https://fullstackopen.com/",
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
