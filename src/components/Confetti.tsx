"use client";

import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  delay: number;
  duration: number;
  angle: number;
}

export default function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ["#f43f5e", "#ec4899", "#8b5cf6", "#6366f1", "#06b6d4", "#10b981", "#eab308"];
    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
    
    const newParticles: Particle[] = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: 5 + Math.random() * 90, // percentage from left
      y: -20 - Math.random() * 30, // start above screen
      size: 6 + Math.random() * 10, // size in px
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      delay: Math.random() * 0.6, // stagger start times
      duration: 1.8 + Math.random() * 2.2, // speed
      angle: Math.random() * 360,
    }));

    setParticles(newParticles);
  }, [active]);

  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {particles.map((p) => {
        const shapeStyle =
          p.shape === "circle"
            ? { borderRadius: "50%" }
            : p.shape === "triangle"
            ? {
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderLeft: `${p.size / 2}px solid transparent`,
                borderRight: `${p.size / 2}px solid transparent`,
                borderBottom: `${p.size}px solid ${p.color}`,
              }
            : {};

        return (
          <div
            key={p.id}
            className="confetti-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}px`,
              width: p.shape === "triangle" ? undefined : `${p.size}px`,
              height: p.shape === "triangle" ? undefined : `${p.size}px`,
              backgroundColor: p.shape === "triangle" ? undefined : p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.angle}deg)`,
              ...shapeStyle,
            }}
          />
        );
      })}
    </div>
  );
}
