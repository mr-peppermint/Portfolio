/**
 * PORTFOLIO CONFIGURATION
 * ------------------------------------------------------------------
 * Edit this file to make the site yours. No build step required.
 *
 * name        – shown in the hero, nav, title and footer
 * initials    – used for the particle monogram and favicon fallback
 * portrait    – optional path to an image. When set, particles form
 *               the image instead of the initials. e.g. "assets/portrait.png"
 * github      – leave username empty to use the demo repositories below.
 *               Add a username to fetch live repositories from GitHub.
 */
window.PORTFOLIO = {
  name: "Your Name",
  role: "Creative Developer",
  initials: "YN",
  tagline:
    "I design and build fast, tactile interfaces — where motion is a material, not decoration.",
  email: "hello@yourname.dev",
  location: "Remote — Worldwide",
  availability: "Open to select projects",

  // Optional. Transparent PNG works best. Opaque photographs are sampled by tone.
  portrait: "",

  github: {
    username: "", // e.g. "octocat" — enables the live GitHub API
    mockUsername: "yourhandle",
    profileUrl: "https://github.com/yourhandle",
    useContributionApi: true, // tries a public contributions API in live mode
  },

  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/yourhandle" },
    { label: "LinkedIn", short: "LI", href: "https://linkedin.com/in/yourhandle" },
    { label: "X / Twitter", short: "X", href: "https://x.com/yourhandle" },
    { label: "Email", short: "@", href: "mailto:hello@yourname.dev" },
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
      title: "Aperture",
      glyph: "AE",
      categories: ["creative", "web"],
      year: "2026",
      role: "Design & build",
      description:
        "A WebGL particle playground that turns any image into a living field of light. Sixty frames a second on a five-year-old phone.",
      tags: ["WebGL", "TypeScript", "GLSL"],
      href: "https://github.com/yourhandle",
    },
    {
      title: "Signal",
      glyph: "SI",
      categories: ["web", "ai"],
      year: "2026",
      role: "Product engineering",
      description:
        "Privacy-first meeting notes that summarise locally with an on-device model. No audio ever leaves the machine.",
      tags: ["Next.js", "AI", "IndexedDB"],
      href: "https://github.com/yourhandle",
    },
    {
      title: "Monolith",
      glyph: "MO",
      categories: ["web", "oss"],
      year: "2025",
      role: "Design systems",
      description:
        "A monochrome design system with sixty accessible components, zero runtime CSS, and documentation people actually read.",
      tags: ["React", "A11y", "Tokens"],
      href: "https://github.com/yourhandle",
    },
    {
      title: "Drift",
      glyph: "DR",
      categories: ["oss", "creative"],
      year: "2025",
      role: "Author",
      description:
        "A 3 kB spring-physics library for interfaces that move like they mean it. No dependencies, no opinions about your framework.",
      tags: ["JavaScript", "Motion", "OSS"],
      href: "https://github.com/yourhandle",
    },
    {
      title: "Atlas",
      glyph: "AT",
      categories: ["web"],
      year: "2024",
      role: "Full-stack",
      description:
        "A real-time analytics dashboard ingesting two million events a day without breaking a sweat — or the budget.",
      tags: ["Node.js", "WebSockets", "Postgres"],
      href: "https://github.com/yourhandle",
    },
    {
      title: "Verse",
      glyph: "VE",
      categories: ["creative"],
      year: "2024",
      role: "Generative design",
      description:
        "A generative typography experiment. Every scroll rearranges the letterforms; no two readings are the same.",
      tags: ["Canvas", "Generative", "Type"],
      href: "https://github.com/yourhandle",
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
   * Demo repositories shown when github.username is empty.
   * These are only placeholders — replace them or configure a username.
   */
  mockRepos: [
    {
      name: "particle-lab",
      description: "Experiments in generative particle systems, shaders, and image sampling.",
      language: "TypeScript",
      stars: 284,
      forks: 18,
      updated: "2026-09-18",
      url: "https://github.com/yourhandle",
      topics: ["webgl", "creative-coding"],
    },
    {
      name: "springlet",
      description: "A tiny spring-physics engine for interfaces. 3 kB, no dependencies.",
      language: "JavaScript",
      stars: 412,
      forks: 21,
      updated: "2026-08-02",
      url: "https://github.com/yourhandle",
      topics: ["animation", "physics"],
    },
    {
      name: "aurora-ui",
      description: "Monochrome component library built on CSS custom properties.",
      language: "CSS",
      stars: 96,
      forks: 7,
      updated: "2026-07-11",
      url: "https://github.com/yourhandle",
      topics: ["design-system", "css"],
    },
    {
      name: "signal-notes",
      description: "Local-first meeting notes with on-device summarisation.",
      language: "TypeScript",
      stars: 128,
      forks: 9,
      updated: "2026-05-29",
      url: "https://github.com/yourhandle",
      topics: ["local-first", "ai"],
    },
    {
      name: "edge-cache",
      description: "A small, dependency-free cache for serverless API routes.",
      language: "TypeScript",
      stars: 64,
      forks: 4,
      updated: "2026-03-14",
      url: "https://github.com/yourhandle",
      topics: ["serverless", "performance"],
    },
    {
      name: "type-atlas",
      description: "An interactive typography playground for variable fonts.",
      language: "JavaScript",
      stars: 51,
      forks: 3,
      updated: "2026-01-08",
      url: "https://github.com/yourhandle",
      topics: ["typography", "generative"],
    },
  ],
};
