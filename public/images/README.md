# Image drop zone

Drop the real assets here. Every visual has a **dark** and a **light**
variant that cross-fade with the theme toggle.

| File | Where it appears |
| --- | --- |
| `hero-cross-blur.jpg` / `hero-cross-blur-light.jpg` | Hero backdrop (heavily blurred, low contrast) |
| `about-portrait-suit.jpg` / `about-portrait-suit-light.jpg` | About — huge scroll-reveal portrait |
| `about-sitting.jpg` / `about-sitting-light.jpg` | About — second image |
| `project-01-preview.jpg` … `project-06-preview.jpg` | Works — carousel card fronts (video also fine; adjust `CylinderCarousel`) |

Until a file exists, the site shows a quiet neutral placeholder labelled
with the expected filename. Manifest lives in `src/lib/assets.ts` and
`src/lib/data.ts`.
