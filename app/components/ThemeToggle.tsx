"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const THEME_COOKIE_KEY = "ecommerce_theme";
const THEME_LOCALSTORAGE_KEY = "ecommerce_theme";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = 
      (typeof window !== "undefined" && localStorage.getItem(THEME_LOCALSTORAGE_KEY)) ||
      Cookies.get(THEME_COOKIE_KEY) ||
      "system";
    setTheme(savedTheme as Theme);
    applyTheme(savedTheme as Theme);
  }, []);

  // Listen for system theme changes when theme is set to "system"
  useEffect(() => {
    if (theme !== "system" || !mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove dark class first
    root.classList.remove("dark");
    
    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      }
    } else if (newTheme === "dark") {
      root.classList.add("dark");
    }
    // If light, dark class is already removed above
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Persist preference
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_LOCALSTORAGE_KEY, newTheme);
    }
    Cookies.set(THEME_COOKIE_KEY, newTheme, { expires: 365 });
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-zinc-300 bg-transparent dark:border-zinc-700" />
    );
  }

  return (
    <div className="relative inline-flex items-center rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => handleThemeChange("light")}
        className={`rounded-md px-2 py-1 text-xs font-medium transition ${
          theme === "light"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
        aria-label="Light mode"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`rounded-md px-2 py-1 text-xs font-medium transition ${
          theme === "dark"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
        aria-label="Dark mode"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`rounded-md px-2 py-1 text-xs font-medium transition ${
          theme === "system"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
        aria-label="System theme"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}

