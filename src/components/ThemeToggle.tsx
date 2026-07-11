"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="glass-panel hover-scale"
      aria-label="Toggle Theme"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        cursor: "pointer",
        border: "1px solid var(--border-color)",
        background: "var(--bg-surface-glass)",
        color: "var(--text-primary)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ position: "relative", width: "20px", height: "20px" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: theme === "light" ? "rotate(0) scale(1)" : "rotate(90deg) scale(0)",
            opacity: theme === "light" ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Sun size={20} style={{ color: "#eab308" }} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: theme === "dark" ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0)",
            opacity: theme === "dark" ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Moon size={20} style={{ color: "#a855f7" }} />
        </div>
      </div>
    </button>
  );
}
