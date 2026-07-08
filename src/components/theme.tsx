"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSound } from "./sound";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Dark is the default. A tiny inline script in layout.tsx sets
 * document.documentElement.dataset.theme before first paint (no flash);
 * this provider takes over from there.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const { chime } = useSound();

  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    if (initial === "light") setTheme("light");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("hakimmy-theme", next);
      } catch {}
      return next;
    });
    chime();
  }, [chime]);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
