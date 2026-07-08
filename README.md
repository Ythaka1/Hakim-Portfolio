# Hakimmy — Portfolio

Personal portfolio of **Hakim (Hakimmy)** — frontend developer & designer, 20, based in Nairobi, Kenya.

Dark, cinematic, and quiet-luxury: signature-script identity, paired dark/light imagery, sound design, and physics-driven interactions.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**
- **Motion** (`motion/react`) for animation
- **Lenis** for smooth inertia scroll
- **Web Audio API** sound layer (synthesized tick / click / chime — zero-lag, swappable for real samples)

## Pages

| Route | What happens |
| --- | --- |
| `/` | Full-viewport hero; vertical scroll hijacked into horizontal panels — signature, five mantras, intro + cue |
| `/about` | Opener, huge portrait reveal, "Shaped by …" one-line-at-a-time, the story with a self-drawing `hm` monogram, process words revealed word-by-word on scroll, mum appreciation, closing mantra marquee |
| `/works` | 3D cylinder card carousel — continuous circular scroll, inertia damping, mouse-parallax tilt, volumetric card thickness, perspective 1350px, pure black stage |
| `/contact` | Full-viewport magnetic email + social links (`#` placeholders) |

## Global layer

- Custom cursor (dot, scales over interactive elements)
- Route transitions: full-screen wipe + View Transitions API where supported
- Dark default · dark/light toggle with warm chime; images use the paired dark/light cross-fade pattern
- Film grain overlay, muted-gold single accent, Ephesis / Cormorant Garamond / Manrope type stack
- `prefers-reduced-motion` respected everywhere (static hero fallback, no autospin, native scroll)

## Develop

```sh
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```

## Environment variables

Copy `.env.example` → `.env` (gitignored). `DTTO_API_KEY` is reserved for an upcoming integration — set it in your host's env settings when deploying.

## Dropping in real content

- **Images** → `/public/images` (see the README there for exact filenames)
- **Projects** (titles, roles, stacks, links) → `src/lib/data.ts`
- **Social URLs** → `src/lib/data.ts` (`SOCIALS`)
- **Copy** (mantras, story, process) → `src/lib/data.ts`
