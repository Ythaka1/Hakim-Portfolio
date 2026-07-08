"use client";

import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import PairedImage from "@/components/PairedImage";
import { TransitionLink } from "@/components/transition";
import { ASSETS } from "@/lib/assets";
import { MANTRAS } from "@/lib/data";

/*
 * HERO — full viewport, scroll-hijacked horizontal movement.
 * Vertical scroll drives the panel row sideways; each panel parallaxes and
 * fades as it enters and exits. Reduced-motion users get a simple vertical
 * stack instead.
 */

const PANELS: { kind: "signature" | "mantra" | "outro"; text?: string }[] = [
  { kind: "signature" },
  ...MANTRAS.map((m) => ({ kind: "mantra" as const, text: m })),
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
      <motion.div style={{ opacity, x: shift }} className="max-w-[26ch] text-center">
        {children}
      </motion.div>
    </div>
  );
}

function PanelContent({ panel }: { panel: (typeof PANELS)[number] }) {
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
        <p className="text-base md:text-lg text-muted tracking-wide">
          Frontend developer &amp; designer.{" "}
          <span className="text-fg">Nairobi.</span>
        </p>
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
  return (
    <p className="font-display text-[clamp(1.6rem,4.2vw,3.4rem)] leading-[1.15] [text-wrap:balance]">
      {panel.text}
    </p>
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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-16 px-8 py-32 text-center">
      <h1 className="font-signature text-[clamp(4rem,14vw,11rem)] leading-none -rotate-2">
        Hakimmy
      </h1>
      {MANTRAS.map((m) => (
        <p key={m} className="font-display max-w-[28ch] text-2xl md:text-4xl leading-snug">
          {m}
        </p>
      ))}
      <p className="text-muted">
        Frontend developer &amp; designer. <span className="text-fg">Nairobi.</span>
      </p>
      <TransitionLink
        href="/about"
        className="rounded-full border border-faint px-6 py-3 text-[11px] uppercase tracking-[0.3em]"
      >
        step inside ↗
      </TransitionLink>
    </div>
  );
}
