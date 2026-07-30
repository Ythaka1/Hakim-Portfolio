"use client";

import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import PairedImage from "@/components/PairedImage";
import { TransitionLink } from "@/components/transition";
import { ASSETS } from "@/lib/assets";
import { HERO_QUOTES } from "@/lib/data";

/*
 * HERO — full viewport, scroll-hijacked horizontal movement.
 * Vertical scroll drives the panel row sideways; each panel parallaxes and
 * fades as it enters and exits. Reduced-motion users get a simple vertical
 * stack instead.
 */

type Panel =
  | { kind: "signature" }
  | { kind: "quote"; text: string; label: string }
  | { kind: "outro" };

/* Signature, then the five labelled roles back-to-back, then the intro. */
const PANELS: Panel[] = [
  { kind: "signature" },
  ...HERO_QUOTES.map((q) => ({
    kind: "quote" as const,
    text: q.text,
    label: q.label,
  })),
  { kind: "outro" },
];

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export default function Home() {
  const reduced = useReducedMotion();
  return reduced ? <HeroStatic /> : <HeroHorizontal />;
}

function HeroHorizontal() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const n = PANELS.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(n - 1) * 100}vw`]);

  return (
    <div ref={trackRef} style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <HeroBackdrop progress={scrollYProgress} />
        <motion.div className="relative z-10 flex h-full" style={{ x }}>
          {PANELS.map((panel, i) => (
            <HeroPanel key={i} index={i} count={n} progress={scrollYProgress}>
              <PanelContent panel={panel} />
            </HeroPanel>
          ))}
        </motion.div>
        <ScrollCue progress={scrollYProgress} />
      </div>
    </div>
  );
}

/* hero-cross-blur.jpg — heavily blurred, low-contrast backdrop that drifts
   slowly against the panels for depth. */
function HeroBackdrop({ progress }: { progress: MotionValue<number> }) {
  const drift = useTransform(progress, [0, 1], ["0%", "-12%"]);
  return (
    <motion.div className="absolute inset-[-8%]" style={{ x: drift }} aria-hidden>
      <PairedImage
        {...ASSETS.heroCross}
        className="h-full w-full"
        imgClassName="blur-3xl scale-110 opacity-25 saturate-50"
      />
      {/* vignette so type always sits on quiet ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 50% 50%, transparent 40%, var(--bg) 100%)",
        }}
      />
    </motion.div>
  );
}

function HeroPanel({
  index,
  count,
  progress,
  children,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const center = index / (count - 1);
  const half = 1 / (count - 1) / 1.15;
  // WAAPI scroll offsets must stay inside [0, 1] and strictly increase
  const lo = Math.max(0, center - half);
  const hi = Math.min(1, center + half);
  const opacity = useTransform(
    progress,
    index === 0 ? [center, hi] : index === count - 1 ? [lo, center] : [lo, center, hi],
    index === 0 ? [1, 0] : index === count - 1 ? [0, 1] : [0, 1, 0],
  );
  // inner counter-drift = parallax against the track
  const shift = useTransform(progress, [lo, hi], [60, -60]);

  return (
    <div className="flex h-full w-screen shrink-0 items-center justify-center px-8">
      <motion.div style={{ opacity, x: shift }} className="max-w-[46ch] text-center">
        {children}
      </motion.div>
    </div>
  );
}

function PanelContent({ panel }: { panel: Panel }) {
  if (panel.kind === "signature") {
    return (
      <motion.h1
        className="font-signature text-[clamp(4rem,14vw,11rem)] leading-none -rotate-2"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
      >
        Hakimmy
      </motion.h1>
    );
  }
  if (panel.kind === "outro") {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="space-y-3">
          <h2 className="font-display text-[clamp(1.5rem,3.2vw,2.7rem)] leading-[1.2] [text-wrap:balance]">
            My name is Hakim Waithaka Castro
          </h2>
          <p className="text-sm md:text-base text-muted tracking-wide">
            English &amp; Swahili by root, <span className="text-fg">German by design.</span>
          </p>
        </div>
        <TransitionLink
          href="/about"
          className="group flex items-center gap-4 rounded-full border border-faint py-3 pl-6 pr-2 text-[11px] uppercase tracking-[0.3em] transition-colors duration-500 hover:border-accent"
        >
          step inside
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fg/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </TransitionLink>
      </div>
    );
  }
  return <QuoteCard text={panel.text} label={panel.label} />;
}

/* Shared panel geometry — a fixed text well below each frame keeps the
   portrait anchored while the role and quote swap beneath it. */
const FRAME_BOX = "h-28 w-24 md:h-36 md:w-[7.5rem]";
const TEXT_WELL = "mt-7 min-h-[9.5rem] md:mt-8 md:min-h-[12rem]";

/* The SAME portrait in all five labelled panels — the repetition is the
   point, so there is deliberately no per-panel image.
   Drop the real photo at public/portrait-front.jpg → served at /portrait-front.jpg.
   Until then a quiet neutral fill stands in (no broken-image alt text). */
function PortraitFrame() {
  const [missing, setMissing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The <img> starts loading while the HTML parses, so a failure can land
  // before React attaches onError. Re-check the real state after mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div className="mx-auto w-fit rounded-xl border border-faint bg-fg/5 p-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
      <div
        className={`relative ${FRAME_BOX} overflow-hidden rounded-[calc(0.75rem-0.25rem)] border border-fg/15`}
        style={
          missing
            ? { background: "radial-gradient(120% 90% at 30% 20%, var(--faint) 0%, transparent 65%)" }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/portrait-front.jpg"
          alt={missing ? "" : "Hakim"}
          onError={() => setMissing(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            missing ? "hidden" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}

/* Portrait frame on top, the ROLE as the display headline — spaced serif
   with a gold hairline beneath it — then the quote in smaller breathing type. */
function QuoteCard({ text, label }: { text: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <PortraitFrame />
      <div className={`flex flex-col items-center ${TEXT_WELL}`}>
        <h2 className="font-display text-[clamp(1.05rem,1.75vw,1.5rem)] font-normal uppercase leading-[1.3] tracking-[0.22em] [text-indent:0.22em] [text-wrap:balance]">
          {label}
        </h2>
        {/* hairline rule separating the role from the quote */}
        <span aria-hidden className="mt-4 block h-px w-10 bg-accent" />
        <p className="breathe mt-6 max-w-[38ch] text-[clamp(0.9rem,1.25vw,1.05rem)] leading-[1.65] text-muted [text-wrap:balance] md:mt-7">
          {text}
        </p>
      </div>
    </div>
  );
}

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-muted"
      style={{ opacity }}
      aria-hidden
    >
      scroll
    </motion.div>
  );
}

/* Reduced motion: same content, plain vertical flow. */
function HeroStatic() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-20 px-8 py-32 text-center">
      <h1 className="font-signature text-[clamp(4rem,14vw,11rem)] leading-none -rotate-2">
        Hakimmy
      </h1>
      {HERO_QUOTES.map((q) => (
        <div key={q.label} className="max-w-[46ch]">
          <QuoteCard text={q.text} label={q.label} />
        </div>
      ))}
      <div className="space-y-3">
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          My name is Hakim Waithaka Castro
        </h2>
        <p className="text-muted">
          English &amp; Swahili by root, <span className="text-fg">German by design.</span>
        </p>
      </div>
      <TransitionLink
        href="/about"
        className="rounded-full border border-faint px-6 py-3 text-[11px] uppercase tracking-[0.3em]"
      >
        step inside ↗
      </TransitionLink>
    </div>
  );
}
