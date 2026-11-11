import { ChromaItem } from './components/ChromaGrid/ChromaGrid';

// ===== EDIT YOUR DETAILS HERE =====
export interface ProfileConfig {
  lines: string[];
  tagline: string;
  githubUsername: string;
  githubUrl: string;
  codeforcesHandle: string;
  loopText: string;
  nav: { label: string; href: string }[];
  projects: ChromaItem[];
}

export const profile: ProfileConfig = {
  lines: ['Dixit', 'Dahiya'], // name, one entry per line
  tagline: '[ software engineer & creative developer ]',
  githubUsername: 'mr-peppermint',
  githubUrl: 'https://github.com/mr-peppermint',
  codeforcesHandle: 'mr-peppermint', // put your Codeforces handle
  loopText: 'Dixit Dahiya ✦ Full-Stack & Creative Developer ✦ Open Source Projects',
  nav: [
    { label: 'Projects', href: '#projects' },
    { label: 'GitHub', href: 'https://github.com/mr-peppermint' },
    { label: 'Codeforces', href: '#codeforces' },
    { label: 'Contact', href: 'mailto:dixit@example.com' }
  ],
  // GitHub projects shown in the ChromaGrid
  projects: [
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop',
      title: 'Loom',
      subtitle: 'AI writing workspace • Next.js & LLMs',
      accent: '#6366f1',
      url: 'https://github.com/mr-peppermint',
      alt: 'Loom AI workspace'
    },
    {
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop',
      title: 'Atlas Engine',
      subtitle: 'Interactive graphics suite • WebGL & React',
      accent: '#38bdf8',
      url: 'https://github.com/mr-peppermint',
      alt: 'Atlas Engine'
    },
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
      title: 'Rhythm',
      subtitle: 'Calm analytics platform • TypeScript & Go',
      accent: '#10b981',
      url: 'https://github.com/mr-peppermint',
      alt: 'Rhythm analytics'
    },
    {
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
      title: 'Groove',
      subtitle: 'Realtime scheduling flow • PostgreSQL & Node',
      accent: '#f59e0b',
      url: 'https://github.com/mr-peppermint',
      alt: 'Groove platform'
    },
    {
      image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80&auto=format&fit=crop',
      title: 'Fieldnote',
      subtitle: 'Field research toolkit • React & Canvas',
      accent: '#ec4899',
      url: 'https://github.com/mr-peppermint',
      alt: 'Fieldnote'
    },
    {
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop',
      title: 'Talkback',
      subtitle: 'Friendly conversational LLM runtime',
      accent: '#a855f7',
      url: 'https://github.com/mr-peppermint',
      alt: 'Talkback runtime'
    }
  ]
};
