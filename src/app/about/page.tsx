"use client";

import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import Monogram from "@/components/Monogram";
import PairedImage from "@/components/PairedImage";
import { ASSETS } from "@/lib/assets";
import { MANTRAS, MOTHER_LINE, PROCESS_WORDS, STORY } from "@/lib/data";

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

/* Gentle fade-up used across the page. */
function Rise({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="overflow-x-clip">
      <Opener />
      <Portrait />
      <ShapedBy />
      <Story />
      <SecondImage />
      <Process />
      <Mother />
      <MantraMarquee />
    </div>
  );
}

/* ---------- opener ---------- */
function Opener() {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.h1
        className="font-display text-[clamp(1.9rem,7vw,6rem)] font-light italic leading-[1.15] pb-2 [text-wrap:balance]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
      >
        So — you stayed a while.
      </motion.h1>
      <motion.p
        className="text-[12px] uppercase tracking-[0.35em] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        20 y.o &nbsp;·&nbsp; based in Nairobi, Kenya
      </motion.p>
    </section>
  );
}

/* ---------- huge portrait: portrait-profile.jpg ---------- */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-24 md:py-40">
      <Rise>
        <div className="overflow-hidden rounded-[2rem] border border-faint p-1.5 bg-fg/5">
          <motion.div
            style={{ scale, y }}
            className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.375rem)]"
          >
            <PairedImage {...ASSETS.portraitProfile} className="absolute inset-0" />
          </motion.div>
        </div>
      </Rise>
    </section>
  );
}

/* ---------- Shaped by … one line at a time ---------- */
const SHAPED = ["Mistakes", "Failure", "Rejection"] as const;

function ShapedBy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center gap-3 md:gap-5 px-6">
        {SHAPED.map((word, i) => (
          <ShapedLine key={word} word={word} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function ShapedLine({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.12 + index * 0.26;
  const opacity = useTransform(progress, [start, start + 0.14], [0.08, 1]);
  const y = useTransform(progress, [start, start + 0.14], [26, 0]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="font-display text-[clamp(1.5rem,7vw,6.5rem)] leading-[1.1] [text-wrap:balance]"
    >
      Shaped by <em className="italic text-accent">{word}</em>
    </motion.p>
  );
}

/* ---------- the story + self-drawing monogram ---------- */
function Story() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:py-40">
      <Rise className="mb-16 flex justify-center">
        <Monogram className="w-36 md:w-44 text-fg" />
      </Rise>
      <div className="space-y-10">
        {STORY.map((para, i) => (
          <Rise key={i} delay={i * 0.08}>
            <p className="font-display text-xl md:text-[1.55rem] leading-[1.7] text-fg/90">
              {para}
            </p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/* ---------- second profile: the SAME portrait-profile.jpg, CSS-mirrored
   so it faces the other way. One file, one download, two directions. ---------- */
function SecondImage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 md:py-24">
      <Rise>
        <div className="overflow-hidden rounded-[2rem] border border-faint p-1.5 bg-fg/5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(2rem-0.375rem)]">
            <PairedImage
              {...ASSETS.portraitProfile}
              alt=""
              className="absolute inset-0 [transform:scaleX(-1)]"
            />
          </div>
        </div>
      </Rise>
    </section>
  );
}

/* ---------- process — word-by-word scroll reveal (bymonolog style) ---------- */
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center px-6">
        <p className="eyebrow mb-10">the process</p>
        <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 md:gap-x-8">
          {PROCESS_WORDS.map((word, i) => (
            <ProcessWord
              key={word}
              word={word}
              index={i}
              total={PROCESS_WORDS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = 0.1 + (index / total) * 0.7;
  // words surface out of the background: dim → full foreground
  const opacity = useTransform(progress, [start, start + 0.12], [0.13, 1]);
  return (
    <span className="flex items-baseline gap-x-5 md:gap-x-8">
      <motion.span
        style={{ opacity }}
        className="font-display text-[clamp(1.35rem,5.2vw,4.6rem)] leading-[1.2]"
      >
        {word}
      </motion.span>
      {index < total - 1 && <span className="text-accent/60 text-xl select-none">·</span>}
    </span>
  );
}

/* ---------- mum ---------- */
function Mother() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:py-36 text-center">
      <Rise>
        <p className="font-display italic text-lg md:text-2xl leading-[1.8] text-muted pb-2">
          {MOTHER_LINE.split("my mother")[0]}
          <span className="text-accent">my mother</span>
          {MOTHER_LINE.split("my mother")[1]}
        </p>
      </Rise>
    </section>
  );
}

/* ---------- closing loop: the mantras, back toward the hero ----------
   Desktop drifts them past horizontally; small screens stack them
   vertically instead, since a marquee of long sentences is unreadable
   on a phone. */
function MantraMarquee() {
  const reduced = useReducedMotion();
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setStacked(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (stacked) {
    return (
      <section className="border-t border-faint px-6 py-14">
        <ul className="mx-auto flex max-w-lg flex-col gap-7">
          {MANTRAS.map((m) => (
            <li key={m}>
              <Rise>
                <p className="font-display text-lg font-light leading-snug text-muted [text-wrap:balance]">
                  {m}
                </p>
                <span aria-hidden className="mt-3 block text-sm text-accent/70">
                  ✦
                </span>
              </Rise>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const row = (
    <div className="flex shrink-0 items-center gap-16 pr-16">
      {MANTRAS.map((m) => (
        <span
          key={m}
          className="whitespace-nowrap font-display text-xl md:text-3xl font-light text-muted"
        >
          {m} <span className="text-accent/70 ml-10 select-none">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-t border-faint py-16 md:py-24">
      <motion.div
        className="flex w-max"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </section>
  );
}
