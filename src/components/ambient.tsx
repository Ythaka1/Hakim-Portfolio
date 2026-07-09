"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/*
 * Ambient background music — /public/ambient.mp3, looping.
 * Browsers block autoplay, so playback arms on the visitor's first
 * interaction (pointer or key). The mute preference persists across
 * visits; the toggle button lives in the nav next to the theme switch.
 */

const AmbientContext = createContext<{ muted: boolean; toggle: () => void }>({
  muted: false,
  toggle: () => {},
});

export function useAmbient() {
  return useContext(AmbientContext);
}

const STORAGE_KEY = "hakimmy-ambient-muted";
const TARGET_VOLUME = 0.35;

export function AmbientProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const fadeRef = useRef<number | null>(null);

  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    audio.volume = 0;
    fadeRef.current = window.setInterval(() => {
      audio.volume = Math.min(TARGET_VOLUME, audio.volume + 0.02);
      if (audio.volume >= TARGET_VOLUME && fadeRef.current) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 80);
  }, []);

  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    setMuted(stored);
    mutedRef.current = stored;

    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    // Autoplay policy: begin on the first real interaction, unless muted.
    const arm = () => {
      if (!mutedRef.current && audio.paused) {
        audio.play().then(() => fadeIn(audio)).catch(() => {});
      }
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
    window.addEventListener("pointerdown", arm, { passive: true });
    window.addEventListener("keydown", arm);

    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [fadeIn]);

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      const audio = audioRef.current;
      if (audio) {
        if (next) {
          audio.pause();
        } else {
          // the toggle click itself satisfies the user-gesture requirement
          audio.play().then(() => fadeIn(audio)).catch(() => {});
        }
      }
      return next;
    });
  }, [fadeIn]);

  return (
    <AmbientContext.Provider value={{ muted, toggle }}>{children}</AmbientContext.Provider>
  );
}
