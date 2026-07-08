"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * The "hm" monogram, drawn as SVG strokes so it can sketch itself in as
 * the story section enters view. Replace with the real logo SVG later —
 * keep the <motion.path> structure so the draw-on animation survives.
 */
export default function Monogram({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  const draw = {
    hidden: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.55, duration: 1.4, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] },
        opacity: { delay: i * 0.55, duration: 0.25 },
      },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 220 170"
      fill="none"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      aria-hidden
    >
      {/* h */}
      <motion.path
        custom={0}
        variants={draw}
        d="M42 22 C40 60 37 100 36 140 M36 104 C44 90 66 82 74 94 C80 103 77 126 75 140"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* m */}
      <motion.path
        custom={1}
        variants={draw}
        d="M104 96 C104 110 102 126 101 140 M102 112 C108 100 124 92 131 100 C136 106 134 126 133 140 M133 112 C139 100 155 92 162 100 C167 106 165 126 164 140"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* underline flick */}
      <motion.path
        custom={2}
        variants={draw}
        d="M30 156 C80 148 150 148 190 152"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
