/* Central content — edit copy here, not inside components. */

/* Hero quote panels — framed portrait on top, quote, bracketed role label.
   label: null renders frame + quote only. */
export const HERO_QUOTES = [
  {
    text: "The oak tree grows slower than the weed, but it survives every storm.",
    label: "Software Developer",
  },
  {
    text: "If they put a cross on your back, carry it — and silently carry it to the top.",
    label: "AI Developer",
  },
  { text: "It's you vs you.", label: "Designer" },
  { text: "Not every closed door is locked. Push.", label: "Open for Collaborations" },
  { text: "Carpe diem.", label: null },
] as const;

export const MANTRAS = HERO_QUOTES.map((q) => q.text);

export const STORY = [
  "It started in 2024 — the year building and designing stopped being a curiosity and became the thing I couldn't put down. I began where everyone begins: buried in YouTube tutorials at 2 a.m. Then I took the leap and joined a software engineering bootcamp — not to start from scratch, but to sharpen what was already there. Turns out I had a feel for it. The feedback from mentors, peers, and family was enough to make me believe I might actually go somewhere with this.",
  "And I did. Past the coursework, I kept shipping — real projects, real problems, learning more from the building than any tutorial ever taught me. The practice quietly turned into products; the exercises turned into clients. Now I build with Claude and a sharp set of AI tools beside me — not as a crutch, but as leverage, closing the gap between an idea and the finished thing faster than I ever could alone.",
] as const;

export const PROCESS_WORDS = ["Research", "Concept", "Design", "Live", "Publish"] as const;

export const MOTHER_LINE =
  "And behind every risk on this page is the woman who made risk feel safe, my mother. Much love, Mum. 🤗";

export const EMAIL = "hakimcastro41@gmail.com";

/* Fill in real profile URLs later. */
export const SOCIALS = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
] as const;

export type Project = {
  title: string;
  year: string;
  role: string;
  stack: string[];
  href: string; // placeholder — point at the live project later
  /** Drop the real preview into /public/images with this exact name. */
  preview: string; // e.g. project-01-preview.jpg (or .mp4)
};

export const PROJECTS: Project[] = [
  { title: "Project One", year: "2025", role: "Design & Build", stack: ["Next.js", "Tailwind", "Motion"], href: "#", preview: "project-01-preview.jpg" },
  { title: "Project Two", year: "2025", role: "Frontend", stack: ["React", "TypeScript"], href: "#", preview: "project-02-preview.jpg" },
  { title: "Project Three", year: "2025", role: "Design & Build", stack: ["Next.js", "CMS"], href: "#", preview: "project-03-preview.jpg" },
  { title: "Project Four", year: "2024", role: "UI Design", stack: ["Figma", "Prototyping"], href: "#", preview: "project-04-preview.jpg" },
  { title: "Project Five", year: "2024", role: "Frontend", stack: ["React", "Motion"], href: "#", preview: "project-05-preview.jpg" },
  { title: "Project Six", year: "2024", role: "Design & Build", stack: ["Next.js", "Tailwind"], href: "#", preview: "project-06-preview.jpg" },
];
