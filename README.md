# Hakim Waithaka Castro — Portfolio

Personal portfolio of **Hakim Waithaka Castro**, creative designer & developer, originally from Kenya. Open for any collaborations.

## Stack

Pure HTML / CSS / vanilla JavaScript — no frameworks, no build step. Deploy the folder as-is to GitHub Pages, Netlify, Vercel, or any static host.

## Pages

- `index.html` — hero, marquee, intro, contact footer
- `works.html` — scroll-animated placeholder panels (real projects drop in later)
- `about.html` — bio, capabilities, collaboration CTA

## Features

- "Hakimmy" signature logo (Mrs Saint Delafield)
- Custom cursor: orbiting star + lagging ring (hidden on touch devices)
- Preloader with letter animation (shown once per session)
- Page-transition veil, scroll reveals, film grain overlay
- Works page: parallax drift + scroll-velocity skew on CSS-only art panels
- Live Nairobi clock in the footer
- Respects `prefers-reduced-motion`

## Environment variables

Copy `.env.example` to `.env` and fill in the values. `.env` is gitignored — never commit real keys.

| Variable | Purpose |
| --- | --- |
| `DTTO_API_KEY` | Reserved for upcoming integration (not used by the static site yet). Set it in your hosting provider's environment settings when the integration lands. |

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Still to come

- Real projects on the Works page
- Background music toggle
