# Crescendo

A dark, modern music-editorial website — reviews, interviews, charts and curated
playlists. Plain static HTML + [Tailwind CSS (Play CDN)](https://tailwindcss.com/docs/installation/play-cdn) + vanilla JS.

## File layout

```bash
index.html      Home            — hero + Playlists / Artists / Reviews / Interviews / Latest
music.html      Playlists       — alternating rows with Apple Music embeds
reviews.html    Reviews         — card grid + sidebar, working "Sort by" dropdown
charts.html     Charts overview — Hot 100 / Top 100 Artists / Top 100 Playlists + Genre grid
chart.html      Hot 100         — ranked table, heart-to-like toggles
single.html     Article         — floating article card, tags, share row, related
author.html     Author profile  — contributor panel + "Posts by" grid

styles.css      Design tokens (:root CSS variables) + a few helper classes
tw-config.js    Tailwind Play CDN theme config (maps utilities to the :root tokens)
main.js         Shared header/footer/overlays injection + all interactions
images/         herobackground.png, logo.png
.nojekyll       Tells GitHub Pages to serve files as-is (no Jekyll processing)
```

### How it fits together

+ **Design tokens live in one place.** All colours, gradients and radii are CSS
  variables in `:root` (`styles.css`). `tw-config.js` maps Tailwind utilities
  (`bg-cyan`, `text-muted`, `bg-art-1`, `bg-signature`, …) to those variables, so
  there is no hardcoded hex outside `:root`.
+ **The header, footer, search overlay, subscribe modal and back-to-top button are
  injected by `main.js`** so they stay identical across every page. Each page just
  sets `<body data-page="…">` (e.g. `music`, `reviews`, `charts`) and `main.js` marks
  the matching nav item active. Pages with no nav match use `data-page=""`.
+ **Interactions** (search overlay + focus trap, subscribe success state, mobile nav,
  reviews sort reorder, chart like toggles, scroll-reveal, back-to-top) all live in
  `main.js` and attach only when their target elements are present.
