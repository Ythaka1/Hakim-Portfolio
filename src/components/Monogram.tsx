"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * The "hwc" monogram, drawn as SVG strokes so it can sketch itself in as
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
        d="M32 22 C30 60 27 100 26 140 M26 104 C34 90 56 82 64 94 C70 103 67 126 65 140"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* w */}
      <motion.path
        custom={1}
        variants={draw}
        d="M84 96 C88 116 92 130 97 140 C102 128 106 114 110 104 C114 118 119 132 123 140 C128 126 132 110 136 96"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* c */}
      <motion.path
        custom={2}
        variants={draw}
        d="M196 108 C190 98 176 93 167 100 C157 108 155 127 164 135 C173 142 188 138 196 130"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* underline flick */}
      <motion.path
        custom={3}
        variants={draw}
        d="M24 156 C80 148 152 148 200 152"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
