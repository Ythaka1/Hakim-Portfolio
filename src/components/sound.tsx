"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";

/*
 * Sound layer — Web Audio API.
 * The three UI sounds (tick / click / chime) are synthesized on the fly, so
 * there is nothing to download and zero playback lag. To use recorded
 * samples instead, decode them into AudioBuffers here and swap the
 * oscillator graphs for buffer sources — the public API stays the same.
 */

type SoundApi = {
  tick: () => void;
  click: () => void;
  chime: () => void;
};

const SoundContext = createContext<SoundApi>({
  tick: () => {},
  click: () => {},
  chime: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);

  // Browsers only allow audio after a user gesture — arm the context on the
  // first interaction so every later sound plays instantly.
  useEffect(() => {
    const arm = () => {
      if (!ctxRef.current) {
        try {
          ctxRef.current = new AudioContext();
        } catch {
          /* audio unavailable — sounds become no-ops */
        }
      }
      ctxRef.current?.resume();
    };
    window.addEventListener("pointerdown", arm, { passive: true });
    window.addEventListener("keydown", arm);
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  const tone = useCallback(
    (
      freq: number,
      opts: {
        type?: OscillatorType;
        gain?: number;
        duration?: number;
        delay?: number;
        glideTo?: number;
        lowpass?: number;
      } = {},
    ) => {
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;
      const { type = "sine", gain = 0.06, duration = 0.12, delay = 0, glideTo, lowpass } = opts;
      const t0 = ctx.currentTime + delay;

      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      let head: AudioNode = g;
      if (lowpass) {
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = lowpass;
        g.connect(f);
        head = f;
      }
      osc.connect(g);
      head.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    },
    [],
  );

  /** Soft tick — nav hover. */
  const tick = useCallback(() => tone(1250, { gain: 0.035, duration: 0.05 }), [tone]);

  /** Click — navigation. */
  const click = useCallback(() => {
    tone(340, { type: "triangle", gain: 0.09, duration: 0.09, glideTo: 150 });
  }, [tone]);

  /** Warm chime — theme toggle. C5 · E5 · G5, gently staggered. */
  const chime = useCallback(() => {
    tone(523.25, { gain: 0.05, duration: 1.0, lowpass: 2600 });
    tone(659.25, { gain: 0.045, duration: 1.1, delay: 0.05, lowpass: 2600 });
    tone(783.99, { gain: 0.04, duration: 1.25, delay: 0.1, lowpass: 2600 });
  }, [tone]);

  return <SoundContext.Provider value={{ tick, click, chime }}>{children}</SoundContext.Provider>;
}
