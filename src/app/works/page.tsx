"use client";

import { motion } from "motion/react";
import CylinderCarousel from "@/components/CylinderCarousel";
import { PROJECTS } from "@/lib/data";

/*
 * WORKS — full viewport stage for the 3D cylinder carousel. The stage
 * follows the theme (near-black in dark, warm off-white in light) while
 * the cards stay dark in both — see the --card-* tokens in globals.css.
 * Each card: front = project preview + label · back = role, stack, link.
 */
export default function Works() {
  return (
    <div className="relative h-[100dvh] overflow-hidden bg-bg text-fg">
      <motion.p
        className="eyebrow absolute left-1/2 top-20 z-10 -translate-x-1/2 md:top-24"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
      >
        selected works
      </motion.p>
      <CylinderCarousel projects={PROJECTS} />
    </div>
  );
}
