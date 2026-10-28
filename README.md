# Monochrome Portfolio — Next.js

A fast, single-page, responsive monochrome portfolio. Your name lands first, then thousands of particles swirl in from across the screen and assemble into a large centred portrait behind the name — displaying your initials, or a photo once configured.

Built with **Next.js 16 (App Router, TypeScript, React 19)** configured for **static export (`output: "export"`)** — generates pure HTML/CSS/JS in `out/` with zero runtime server required.

---

## Table of Contents

1. [Local Development](#local-development)
2. [Hosting & Deployment Guide](#hosting--deployment-guide)
   - [Option 1: Vercel (Recommended & Easiest)](#option-1-vercel-recommended--easiest)
   - [Option 2: GitHub Pages](#option-2-github-pages)
   - [Option 3: Netlify](#option-3-netlify)
   - [Option 4: Cloudflare Pages](#option-4-cloudflare-pages)
   - [Option 5: Traditional VPS / Docker / Static Web Server (Nginx, Apache, Caddy)](#option-5-traditional-vps--static-web-server)
3. [Configuration & Customization](#configuration--customization)
4. [Project Structure](#project-structure)
5. [Features](#features)

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or later)
- npm, pnpm, or yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server (with Turbopack)
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## Hosting & Deployment Guide

This project is configured as a **static export** (`output: "export"` in `next.config.ts`). Running `npm run build` generates a standalone `out/` directory containing all HTML, CSS, JavaScript, and assets. You can deploy it to any static web hosting platform for free.

### Option 1: Vercel (Recommended & Easiest)

Vercel natively supports Next.js applications and handles static builds automatically.

#### Method A: Via Web UI (Easiest)
1. Push your repository to GitHub: `git push origin main`.
2. Visit [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import your repository (`mr-peppermint/Portfolio`).
5. Vercel automatically detects Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (or `npm run build`)
   - **Output Directory**: `out` (Next.js static export default)
6. Click **Deploy**. Any future commits to `main` will automatically trigger a new deployment.

#### Method B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# For production deployment:
vercel --prod
```

---

### Option 2: GitHub Pages

Since your repository is on GitHub (`mr-peppermint/Portfolio`), you can host it using GitHub Pages.

#### 1. Important: Base Path Configuration
If hosting at a subpath URL like `https://mr-peppermint.github.io/Portfolio/`, update [`next.config.ts`](./next.config.ts):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? "/Portfolio" : "",
};

export default nextConfig;
```
*(If deploying to a custom domain like `portfolio.yourname.com` or a user page `username.github.io`, you can omit `basePath`)*.

#### 2. Automated Deployment via GitHub Actions
Create `.github/workflows/deploy.yml` in your project:

```yaml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Detect package manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/package-lock.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            echo "runner=npx --no-install" >> $GITHUB_OUTPUT
            exit 0
          else
            echo "Unable to determine package manager"
            exit 1
          fi
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          static_site_generator: next
      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}
      - name: Build with Next.js
        run: ${{ steps.detect-package-manager.outputs.runner }} next build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

In your GitHub repository settings:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Push your changes to `main` and the site will deploy automatically.

---

### Option 3: Netlify

#### Method A: Via Git Integration
1. Log in to [netlify.com](https://www.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select your GitHub repository.
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. Click **Deploy Site**.

#### Method B: Netlify CLI / Drag and Drop
1. Run local build:
   ```bash
   npm run build
   ```
2. You can drag and drop the generated `out/` folder directly onto [app.netlify.com/drop](https://app.netlify.com/drop).

---

### Option 4: Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set build settings:
   - **Framework preset**: None / Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Click **Save and Deploy**.

---

### Option 5: Traditional VPS / Static Web Server

If you are hosting on your own Linux server (Ubuntu/Debian, VPS, AWS EC2, DigitalOcean Droplet):

#### 1. Build the static assets:
```bash
npm run build
```
This outputs all pre-rendered HTML, JavaScript, and CSS into the `out/` directory.

#### 2. Nginx Configuration
Copy the contents of `out/` to `/var/www/portfolio`:
```bash
sudo mkdir -p /var/www/portfolio
sudo cp -r out/* /var/www/portfolio/
sudo chown -R www-data:www-data /var/www/portfolio
```

Add an Nginx server block in `/etc/nginx/sites-available/portfolio`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # Enable gzip compression for fast delivery
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Cache static assets
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. Preview locally with a lightweight HTTP server:
```bash
npx serve out
```

---

## Configuration & Customization

Everything content-related lives in [`lib/content.ts`](./lib/content.ts) — edit this file to personalize the site:

```ts
export const portfolio = {
  name: "Dixit Dahiya",     // Hero headline, nav title, footer
  role: "Creative Developer",
  initials: "DD",           // Particle monogram & fallback avatar
  portrait: "",             // Path to image in public/, e.g. "/portrait.png"
  email: "hello@yourname.dev",
  location: "Remote — Worldwide",
  availability: "Open to select projects",

  github: {
    username: "",           // Set your username (e.g. "octocat") for live GitHub data & heatmap
    mockUsername: "yourhandle",
    profileUrl: "https://github.com/yourhandle",
    useContributionApi: true,
  },

  socials: [ ... ],
  stats: [ ... ],
  skills: [ ... ],
  projects: [ ... ],
  certificates: [ ... ],
  mockRepos: [ ... ],
};
```

### Portrait image:
Add a transparent PNG to `public/portrait.png` and set `portrait: "/portrait.png"` in `lib/content.ts`. The particle system will sample the image and reassemble particles to recreate your photo!

---

## Project Structure

```
Portfolio/
├── app/                  # Next.js App Router (layout, page, metadata, globals.css)
├── components/           # UI Components
│   ├── Navbar.tsx        # Scroll-aware navigation bar
│   ├── Hero.tsx          # Headline, call to action, particle intro trigger
│   ├── ParticleStage.tsx # Canvas wrapper for WebGL/2D particle system
│   ├── Work.tsx          # Project showcase with category filters
│   ├── Certificates.tsx  # Credential grid with modal dialog
│   ├── GithubSection.tsx # GitHub profile, activity heatmap, repo cards
│   ├── Contact.tsx       # Direct contact form / copy-email toast
│   ├── Footer.tsx        # Site footer
│   ├── Chrome.tsx        # Cursor, progress bar, skip link, grain texture
│   ├── MotionEffects.tsx # Magnetic buttons & cursor spotlight
│   ├── RevealProvider.tsx# Scroll-triggered entrance animations
│   ├── Socials.tsx       # Social links list
│   └── Ticker.tsx        # Infinite marquee ticker
├── lib/
│   ├── content.ts        # Single source of truth for portfolio data
│   ├── particles.ts      # Canvas-based spring particle physics engine
│   └── github.ts         # GitHub API integration & contribution calendar generator
├── public/               # Static assets (favicons, portrait, etc.)
├── styles/               # Modular CSS partials preserving style cascade
├── types/                # TypeScript interfaces (Portfolio, GitHub, Heatmap)
├── next.config.ts        # Next.js static export configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

---

## Features

- **Dynamic Particle System**: Interactive 2D canvas particle field with spring physics, mouse avoidance/repulsion, and custom monogram or photo reconstruction.
- **Accessible & Performance-focused**: Pre-rendered static HTML, zero JavaScript layout shifts, reduced-motion fallbacks (`prefers-reduced-motion`), keyboard accessibility, and ARIA dialogs.
- **GitHub Live Sync**: Optional live integration with GitHub API for repositories, follower/star stats, and contribution activity heatmap (falls back gracefully to offline demo data).
- **Interactive Micro-interactions**: Magnetic buttons, cursor spotlights, smooth category filtering, custom cursor (fine pointers only), and copy-to-clipboard toast notifications.
- **Zero Server Costs**: Fully pre-rendered static export compatible with any free static CDN or hosting provider.
