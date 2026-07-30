# Image drop zone

Drop the real assets here. Every visual has a **dark** and a **light**
variant that cross-fade with the theme toggle.

| File | Where it appears |
| --- | --- |
| `hero-cross-blur.jpg` / `hero-cross-blur-light.jpg` | Hero backdrop (heavily blurred, low contrast) |
| `portrait-front.png` | Hero — the framed portrait above every role panel (same image on all five, single plain file, no dark/light pair) |
| `portrait-profile.jpg` / `portrait-profile-light.jpg` | About — **both** profiles. One graded portrait; the second one is the same file CSS-mirrored (`scaleX(-1)`) so it faces the other way. Do not add a separate mirrored file. |
| `project-01-preview.jpg` … `project-06-preview.jpg` | Works — carousel card fronts (video also fine; adjust `CylinderCarousel`) |

Until a file exists, the site shows a quiet neutral placeholder labelled
with the expected filename. Manifest lives in `src/lib/assets.ts` and
`src/lib/data.ts`.
