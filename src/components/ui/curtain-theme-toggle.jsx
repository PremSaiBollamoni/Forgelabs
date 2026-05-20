import { useState, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";

const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function ThemeToggle({
  duration = 550,
  className
}) {
  const { theme, setTheme } = useTheme();
  const [phase, setPhase] = useState("idle");
  const [curtainColor, setCurtainColor] = useState("");
  
  const isDark = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggle = useCallback(() => {
    if (phase !== "idle") return;
    
    // Determine the next theme accurately based on the current DOM state
    const currentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme = currentlyDark ? "light" : "dark";
    
    // We use the exact background colors of the ForgeLabs theme for the curtain
    setCurtainColor(nextTheme === "light" ? "#F7F7F5" : "#0A0A0A");
    
    setPhase("falling");

    setTimeout(() => {
      setTheme(nextTheme);
      setPhase("rising");
      setTimeout(() => setPhase("idle"), duration + 60);
    }, duration);
  }, [phase, duration, setTheme]);

  const curtainStyle = {
    position: "fixed",
    inset: 0,
    background: phase !== "idle" ? curtainColor : "transparent",
    transformOrigin: "top",
    transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition: phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex: 99999, // Ensure it covers everything including the navbar
    pointerEvents: "none",
  };

  return (
    <>
      <div aria-hidden="true" style={curtainStyle} />
      <button
        onClick={toggle}
        className={className || "p-2 text-tertiary hover:text-primary transition-colors rounded-full focus:outline-none"}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
}
