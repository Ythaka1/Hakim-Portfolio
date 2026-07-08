"use client";

import { motion } from "motion/react";
import CylinderCarousel from "@/components/CylinderCarousel";
import { PROJECTS } from "@/lib/data";

/*
 * WORKS — full viewport, pure black stage for the 3D cylinder carousel.
 * Each card: front = project preview + label · back = role, stack, link.
 */
export default function Works() {
  return (
    <div className="relative h-[100dvh] overflow-hidden bg-black text-white">
      <motion.p
        className="eyebrow absolute left-1/2 top-24 z-10 -translate-x-1/2"
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
