"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { createPortal } from "react-dom";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ 
  theme: Theme; 
  toggleTheme: () => void;
  isThemeChanging: boolean;
  nextTheme: Theme;
}>({
  theme: "light",
  toggleTheme: () => {},
  isThemeChanging: false,
  nextTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [nextTheme, setNextTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored || "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setNextTheme(next);
    setIsThemeChanging(true);

    // Beautiful delay for modal visibility
    setTimeout(() => {
      setTheme(next);
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 1000);
    }, 1200);
  }, [theme]);

  // Prevent flash: render children immediately but context is ready after mount
  return (
    <ThemeContext.Provider value={{ 
      theme: mounted ? theme : "light", 
      toggleTheme,
      isThemeChanging,
      nextTheme
    }}>
      {children}
      
      {/* ── Theme Transition Modal ── */}
      {isThemeChanging && mounted && typeof document !== 'undefined' && createPortal(
        <div className="theme-loader-overlay">
          <div className="theme-loader-content">
            <div className="theme-loader-icon-wrap">
              <div className="theme-loader-glow" />
              {nextTheme === 'dark' ? (
                <Moon size={48} className="theme-loader-icon" />
              ) : (
                <Sun size={48} className="theme-loader-icon" />
              )}
            </div>
            <h2 className="theme-loader-title">
              {nextTheme === 'dark' ? 'Embracing the Dark' : 'Bringing the Light'}
            </h2>
            <p className="theme-loader-subtitle">
              Optimizing interface for {nextTheme} mode...
            </p>
            <div className="theme-loader-progress-wrap">
              <div className="theme-loader-progress-fill" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </ThemeContext.Provider>
  );
}
