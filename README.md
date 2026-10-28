# Monochrome Portfolio

A fast, responsive, single-page portfolio built with plain HTML, CSS, and JavaScript.
No frameworks, no build step, no runtime dependencies.

- Particle intro: your name lands, then thousands of points swirl in from across the
  screen and assemble into a large centred portrait behind the name — your initials,
  or a photo once you add one.
- Monochrome design system: black, grey, and white with editorial typography.
- Tactile UI: magnetic buttons, sweeps, spotlight cards, scroll reveals, custom cursor,
  animated filters, and a reduced-motion fallback.
- Content sections: about, selected work, certifications (with detail dialogs),
  live-or-demo GitHub repositories and contribution graph, contact.
- GitHub integration without a token: public profile and repositories come from the
  GitHub REST API; contribution data optionally comes from a public contributions API.
- Everything degrades gracefully offline: repositories and activity use demo data when
  no username is configured or the network is unavailable.

## Run it

Any static server works:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

You can also open `index.html` directly, although a local server is recommended for
`fetch`, `clipboard`, and consistent file loading.

## Make it yours

### 1. Identity

Edit `assets/js/config.js`:

```js
name: "Your Name",
role: "Creative Developer",
initials: "YN",
email: "hello@example.com",
location: "Remote — Worldwide",
```

The hero name, nav, footer, page title, meta description, and monogram all update from
this config.

### 2. Particle portrait

The intro currently forms your initials. To use a photo instead:

1. Drop the image at `assets/portrait.png` (transparent PNG works best).
2. Set `portrait: "assets/portrait.png"` in `assets/js/config.js`.

Opaque photographs are sampled by tone and cropped into the canvas. Transparent images
are sampled by alpha, so cutouts keep their silhouette. If the file is missing, the site
quietly falls back to the initials monogram.

### 3. Projects and certifications

Edit the `projects` and `certificates` arrays in `assets/js/config.js`. Each certificate
card opens a native `<dialog>` with the issuer, date, credential ID, skills, and a verify
link. Replace the placeholder URLs and credential IDs with your own.

### 4. GitHub

Add your handle:

```js
github: {
  username: "yourhandle",
  ...
}
```

The GitHub section then fetches your public profile and up to 100 repositories, filters
out forks and archived repos, sorts by stars, and renders the top six. If the request
fails, the demo content stays on screen and the badge reads “Offline demo”.

Contribution activity is fetched from
`github-contributions-api.jogruber.de` when `useContributionApi` is true. That endpoint
is not part of GitHub’s official API; if it is unavailable, the demo graph remains.
For full control, you can replace `loadLiveHeatmap()` with your own GraphQL endpoint.

### 5. Social links

Update the `socials` array. The short labels (`GH`, `LI`, `X`) are used in the contact
pills; the hero shows text links.

## Performance notes

- No external fonts, images, or CSS frameworks; the only network requests are the
  optional GitHub API calls.
- Particle count scales with viewport and is capped at 5,200 (desktop) / 2,800 (mobile).
- Canvas resolution is capped at 2× DPR, drawing is batched into four colour buckets,
  and the loop pauses when the hero scrolls out of view or the tab is hidden.
- Animations respect `prefers-reduced-motion`; the static monogram is rendered instantly.
- Content uses `IntersectionObserver` for reveals, counters, and nav highlighting.
- `aria-label`s, a skip link, focus-visible styles, keyboard-operable dialogs, and
  semantic landmarks are included.

## Deployment

Works on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static host.

For GitHub Pages: push the repository, then set **Settings → Pages → Deploy from a
branch** to the branch and root folder. No build command is required.

## File map

```
index.html               structure and content shells
assets/css/style.css     design tokens, layout, components, responsive rules
assets/js/config.js      all editable content (start here)
assets/js/particles.js   canvas particle engine and intro sequence
assets/js/github.js      GitHub profile, repos, and contribution graph
assets/js/app.js         navigation, reveals, magnetic UI, dialogs, filters
assets/favicon.svg       monogram favicon
```

## Placeholder content

The name, email, social links, projects, certificates, and repositories are deliberately
fictional placeholders. Replace them before publishing.
