"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase cursor-pointer"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
