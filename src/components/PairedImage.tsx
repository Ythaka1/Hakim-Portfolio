"use client";

import { useState } from "react";
import { useTheme } from "./theme";

/*
 * Paired dark/light image swap (Kalinsky pattern): both variants are
 * stacked and cross-fade when the theme toggles.
 *
 * Real assets are not committed yet — drop them into /public/images with
 * the names from src/lib/assets.ts. Until a file exists, a quiet neutral
 * placeholder renders instead, labelled with the expected filename so it's
 * obvious what goes where.
 */
export default function PairedImage({
  dark,
  light,
  alt,
  className = "",
  imgClassName = "",
}: {
  dark: string;
  light: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const { theme } = useTheme();
  const [darkMissing, setDarkMissing] = useState(false);
  const [lightMissing, setLightMissing] = useState(false);

  const placeholder = theme === "dark" ? darkMissing : lightMissing;
  const label = (theme === "dark" ? dark : light).replace("/images/", "");

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {placeholder ? (
        <div
          className="absolute inset-0 border border-faint"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 20%, var(--faint) 0%, transparent 60%)",
          }}
          data-asset={label}
        >
          <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-wide text-muted opacity-40 select-none">
            {label}
          </span>
        </div>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt={alt}
        onError={() => setDarkMissing(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          theme === "dark" && !darkMissing ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light}
        alt=""
        aria-hidden
        onError={() => setLightMissing(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          theme === "light" && !lightMissing ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
}
