import { ChromaItem } from './components/ChromaGrid/ChromaGrid';

export interface CertificateItem {
  title: string;
  issuer: string;
  year: string;
  date: string;
  description: string;
  skills: string[];
  credentialId?: string;
  href?: string;
}

export interface SocialItem {
  label: string;
  short: string;
  href: string;
}

export interface ProjectItem extends ChromaItem {
  title: string;
  subtitle: string;
  accent: string;
  url: string;
  liveUrl?: string;
  readmeDescription: string;
  aiSummary: {
    overview: string;
    features: string[];
    techStack: string[];
    highlight: string;
  };
}

export interface MilestoneItem {
  year: string;
  title: string;
  detail: string;
  tag: 'Project' | 'Certification' | 'Hackathon' | 'Competitive';
}

export interface ProfileConfig {
  name: string;
  lines: string[];
  role: string;
  initials: string;
  tagline: string;
  email: string;
  githubUsername: string;
  githubUrl: string;
  codeforcesHandle: string;
  codeforcesUrl: string;
  loopText: string;
  nav: { label: string; href: string }[];
  socials: SocialItem[];
  stats: { value: string | number; suffix?: string; label: string }[];
  skills: string[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  milestones: MilestoneItem[];
}

export const profile: ProfileConfig = {
  name: 'Dixit Dahiya',
  lines: ['Dixit', 'Dahiya'],
  role: 'Creative Developer',
  initials: 'DD',
  tagline: 'I design and build fast, tactile interfaces — where Perfection is a material, not decoration.',
  email: 'dixitdahiya77@gmail.com',
  githubUsername: 'mr-peppermint',
  githubUrl: 'https://github.com/mr-peppermint',
  codeforcesHandle: 'Dexter.1',
  codeforcesUrl: 'https://codeforces.com/profile/Dexter.1',
  loopText: 'Dixit Dahiya ✦ Creative Developer ✦ Competitive Programmer ✦ Open Source',
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Credentials', href: '#certificates' },
    { label: 'Projects', href: '#projects' },
    { label: 'Codeforces', href: '#codeforces' },
    { label: 'Contact', href: '#contact' }
  ],
  socials: [
    { label: 'GitHub', short: 'GH', href: 'https://github.com/mr-peppermint' },
    { label: 'LinkedIn', short: 'LI', href: 'https://www.linkedin.com/in/dixitdahiya01/' },
    { label: 'X / Twitter', short: 'X', href: 'https://x.com/DixitDahiya0' },
    { label: 'Email', short: '@', href: 'mailto:dixitdahiya77@gmail.com' }
  ],
  stats: [
    { value: 2, suffix: '+', label: 'Years building' },
    { value: 7, suffix: '', label: 'Original repos' },
    { value: 2, suffix: '', label: 'Certifications' },
    { value: '90+', suffix: '', label: 'Avg. Lighthouse' }
  ],
  skills: [
    'TypeScript',
    'React / Next.js',
    'Node.js',
    'WebGL / Three.js',
    'GSAP / Motion',
    'CSS architecture',
    'Python',
    'Figma'
  ],
  // All original repositories authored by Dixit (no forks)
  projects: [
    {
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80&auto=format&fit=crop',
      title: 'TerraGuard',
      subtitle: 'Satellite canopy loss • Python • FastAPI • MapLibre',
      accent: '#22c55e',
      url: 'https://github.com/mr-peppermint/TerraGuard',
      liveUrl: 'https://github.com/mr-peppermint/TerraGuard#demo',
      alt: 'TerraGuard Satellite Monitoring',
      readmeDescription:
        'Satellite forest-canopy loss detection from Copernicus Sentinel-2 imagery via Google Earth Engine, a FastAPI backend, and a React + MapLibre web app. Provides automated change-detection masks, temporal NDVI vegetation indices, and interactive geospatial mapping for deforestation alerts.',
      aiSummary: {
        overview:
          'TerraGuard is an environmental intelligence platform that processes multispectral satellite imagery in near real-time to detect deforestation and canopy depletion. Built on Google Earth Engine and Copernicus Sentinel-2 data.',
        features: [
          'Automated spectral change detection across multi-temporal Sentinel-2 passes',
          'FastAPI processing pipeline with tile-cache acceleration and Cloud-Optimized GeoTIFFs',
          'Interactive MapLibre GL frontend rendering temporal NDVI differential heatmaps',
          'Polygon boundary alerting with automated canopy loss percentage estimation'
        ],
        techStack: ['Python', 'FastAPI', 'Google Earth Engine', 'React', 'MapLibre GL', 'NumPy'],
        highlight:
          'Processes multi-band satellite data server-side and renders dynamic geospatial heatmaps with sub-second tile response times.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop',
      title: 'Portfolio',
      subtitle: 'Tactile monochrome portfolio • Vite • React 18 • WebGL',
      accent: '#38bdf8',
      url: 'https://github.com/mr-peppermint/Portfolio',
      liveUrl: 'https://github.com/mr-peppermint/Portfolio',
      alt: 'Portfolio Repository',
      readmeDescription:
        'Tactile single-page portfolio built with Vite, React 18, and TypeScript. Features dynamic Michelangelo dithered hands that touch on user interaction to illuminate warm cream mode, interactive Codeforces and GitHub trackers, disassembling vector particle portrait, and ChromaGrid showcase.',
      aiSummary: {
        overview:
          'A hyper-crafted personal portfolio engineered around high-DPI canvas stippling, tactile user feedback, and organic hand physics. Replaces generic web templates with bespoke canvas physics and tactile theme transitions.',
        features: [
          'Edge-to-edge canvas renderer drawing Michelangelo dithered hands with individual organic dynamics',
          'Interactive contact physics button making hands touch and illuminating warm cream mode',
          'React Bits ChromaGrid integration with soft cursor spotlight and glowing borders',
          'Live Codeforces contest ratings and GitHub 53-week contribution calendar integrations'
        ],
        techStack: ['React 18', 'TypeScript', 'Vite', 'HTML5 Canvas', 'GSAP', 'CSS Variables'],
        highlight:
          'Custom canvas engine renders 2048x2048 stippled graphics with zero downsampling and hardware-accelerated CRT scanline glitching.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop',
      title: 'MoonK',
      subtitle: 'React & Vite compiler suite • TypeScript • Oxlint',
      accent: '#a855f7',
      url: 'https://github.com/mr-peppermint/MoonK',
      liveUrl: 'https://github.com/mr-peppermint/MoonK#preview',
      alt: 'MoonK Vite App',
      readmeDescription:
        'A next-generation React + TypeScript + Vite application bootstrapped with Oxlint rules and React Compiler support for blazing-fast iteration, automated memoization, zero-cost component re-renders, and sub-millisecond HMR iteration.',
      aiSummary: {
        overview:
          'MoonK is a high-performance modern web application blueprint focused on bleeding-edge compiler tooling. Leverages the official React Compiler (Forget) for automatic memoization and Oxlint for Rust-powered static analysis.',
        features: [
          'React Compiler auto-memoization eliminating manual useMemo and useCallback boilerplate',
          'Oxlint static analysis running up to 50x faster than standard ESLint configurations',
          'Vite 5 module pipeline with instant hot module replacement and optimized tree shaking',
          'Strict TypeScript compilation with zero-runtime utility types and strict type-safety'
        ],
        techStack: ['React 19/18', 'TypeScript', 'Vite', 'React Compiler', 'Oxlint', 'Rust Tooling'],
        highlight:
          'Eliminates render churn and dependency arrays at build-time using compiler-driven semantic graph analysis.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80&auto=format&fit=crop',
      title: 'archies',
      subtitle: 'Hyprland & Quickshell environment • Arc Linux',
      accent: '#f59e0b',
      url: 'https://github.com/mr-peppermint/archies',
      liveUrl: 'https://github.com/mr-peppermint/archies#preview',
      alt: 'archies Hyprland config',
      readmeDescription:
        'A clean Hyprland + Quickshell desktop setup for Arc Linux. Focused on practical keybinds, productivity, and easy customisation. Includes custom Wayland status bars, floating scratchpads, and dynamic workspace navigation.',
      aiSummary: {
        overview:
          'archies is a complete tiling Wayland desktop environment for Arc Linux. Combines Hyprland compositor performance with custom Quickshell (QML) desktop widgets for a cohesive, tactile developer workstation.',
        features: [
          'Custom Quickshell status bars and system panels with reactive hardware monitoring',
          'Ergonomic modal keybindings inspired by Vim navigation and tiling window management',
          'Hardware-accelerated Wayland animations with smooth bezier curves and zero frame drops',
          'Self-contained setup script supporting one-command deployment on Arch Linux'
        ],
        techStack: ['Hyprland', 'Quickshell (QML)', 'Wayland', 'Bash', 'Linux Kernel', 'CSS'],
        highlight:
          'QML-based reactive desktop shell achieving sub-5ms input latency and sub-100MB idle memory consumption.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80&auto=format&fit=crop',
      title: 'Animus-XII',
      subtitle: 'Hyprland dotfiles & custom CSS theme suite',
      accent: '#ec4899',
      url: 'https://github.com/mr-peppermint/Animus-XII',
      liveUrl: 'https://github.com/mr-peppermint/Animus-XII#gallery',
      alt: 'Animus-XII desktop environment',
      readmeDescription:
        'Hyprland dotfiles and a custom CSS theme suite — a full desktop environment config built from scratch. Features customized Waybar styles, Rofi application launchers, Kitty terminal configurations, and unified dark monochrome styling.',
      aiSummary: {
        overview:
          'Animus-XII is an aesthetic dotfile suite designed to provide a cohesive visual hierarchy across command-line and graphical tools under Wayland.',
        features: [
          'Unified design tokens across Waybar, Rofi, Kitty, Neovim, and Dunst notifications',
          'Custom CSS animations for bar widgets, network status, and workspace badges',
          'Dynamic opacity and blur management via Hyprland layer-shell rules',
          'Scriptable wallpaper-driven accent generation with smooth transition effects'
        ],
        techStack: ['CSS', 'Hyprland', 'Waybar', 'Rofi', 'Kitty', 'Bash Scripting'],
        highlight:
          'Cohesive typography and token architecture unified across GUI and terminal environments.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop',
      title: 'Worksheets',
      subtitle: 'Structured practice sheets & DSA exercises',
      accent: '#6366f1',
      url: 'https://github.com/mr-peppermint/Worksheets',
      liveUrl: 'https://github.com/mr-peppermint/Worksheets',
      alt: 'Worksheets DSA exercises',
      readmeDescription:
        'A collection of practice sheets and structured coding exercises for building and reinforcing programming fundamentals. Covers data structures, dynamic programming, graph traversal, and mathematical algorithms with annotated solutions.',
      aiSummary: {
        overview:
          'Worksheets is an algorithmic repository containing rigorous problem solutions, time/space complexity proofs, and template implementations for competitive programming and technical interviews.',
        features: [
          'Annotated implementations of core graph algorithms (Dijkstra, Tarjan, Flow networks)',
          'Extensive dynamic programming patterns with memoization vs bottom-up benchmarks',
          'Modular test harnesses with automated testcase generators for stress testing',
          'Optimal C++ and Python templates built for sub-second competitive programming evaluation'
        ],
        techStack: ['Python', 'C++', 'Algorithms', 'Data Structures', 'Competitive Programming'],
        highlight:
          'Includes benchmarked test harnesses that verify edge-case coverage and runtime complexity limits.'
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop',
      title: 'mr-peppermint',
      subtitle: 'GitHub profile config • 3D metrics & showcase',
      accent: '#06b6d4',
      url: 'https://github.com/mr-peppermint/mr-peppermint',
      liveUrl: 'https://github.com/mr-peppermint',
      alt: 'Developer Profile Configuration',
      readmeDescription:
        'GitHub profile configuration with dynamic 3D contribution metrics, automated profile metrics updater, and developer showcase. Configures README workflows to track repository stats and daily programming streaks.',
      aiSummary: {
        overview:
          'The special GitHub profile repository for @mr-peppermint, featuring automated GitHub Actions workflows that track coding metrics, language breakdown, and isometric contribution activity.',
        features: [
          'GitHub Actions CI/CD workflows generating automated SVG metrics cards',
          '3D isometric contribution graph rendering via automated cron updates',
          'Dynamic language breakdown and commit streak aggregation',
          'Custom SVG aesthetic matching tactile monochrome design principles'
        ],
        techStack: ['GitHub Actions', 'SVG', 'Markdown', 'GitHub GraphQL API', 'Node.js'],
        highlight:
          'Automated daily cron pipeline updates metrics seamlessly without manual intervention.'
      }
    }
  ],
  certificates: [
    {
      title: 'Scratch Hackathon',
      issuer: 'Newton School Of Technology',
      year: '2026',
      date: 'September 2026',
      description:
        'Scratch based game development Hackathon. Organised as Speedrun of 3Hrs. The Hackathon was based on the theme of "Space".',
      skills: ['Mathematics', 'Scratch', 'Game Development']
    },
    {
      title: 'HyperNexis Hackathon',
      issuer: 'HyperNexis - Manipal University',
      year: '2026',
      date: 'October 2024',
      description:
        'A 36 Hours Non-stop hackathon based on the theme of societal development for building real-life applicable prototypes with React and Figma.',
      skills: ['React', 'UI', 'HTML', 'CSS', 'UX', 'Git']
    },
    {
      title: 'Meta Front-End Developer',
      issuer: 'Meta',
      year: '2024',
      date: 'June 2024',
      description:
        'Professional certificate covering React component hierarchies, UX principles, responsive CSS grid/flexbox, state management, and Git workflows.',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX', 'Version Control']
    },
    {
      title: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2024',
      date: 'August 2024',
      description:
        'Foundational AWS cloud architecture covering IAM permissions, ECS/Lambda serverless execution, S3 object storage, and VPC network configuration.',
      skills: ['AWS', 'Cloud Architecture', 'Serverless', 'Security']
    },
    {
      title: 'Google UX Design',
      issuer: 'Google',
      year: '2023',
      date: 'December 2023',
      description:
        'End-to-end design thinking: user journey mapping, low/high-fidelity Figma wireframing, heuristic usability testing, and accessibility WCAG standards.',
      skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping']
    }
  ],
  milestones: [
    {
      year: '2026',
      title: 'TerraGuard Platform Launch',
      detail: 'Engineered satellite forest-canopy loss detection platform with Google Earth Engine, FastAPI tile caching, and MapLibre GL.',
      tag: 'Project'
    },
    {
      year: '2026',
      title: 'Tactile Portfolio v2',
      detail: 'Engineered tactile portfolio featuring dynamic Michelangelo hands with contact physics, warm cream mode illumination, disassembling vector portrait, and live Codeforces telemetry.',
      tag: 'Project'
    },
    {
      year: '2026',
      title: 'Newton School Hackathon Winner',
      detail: 'Rapid prototype game engine implementation in 3-hour speedrun format under Space thematic requirements.',
      tag: 'Hackathon'
    },
    {
      year: '2025',
      title: 'Codeforces Active Competitor',
      detail: 'Achieved verified rating milestones and solved 400+ problems across dynamic programming, graph algorithms, and number theory.',
      tag: 'Competitive'
    },
    {
      year: '2024',
      title: 'HyperNexis 36hr Hackathon',
      detail: 'Shipped interactive prototype for societal impact under 36-hour non-stop sprint conditions using React and Figma.',
      tag: 'Hackathon'
    }
  ]
};
