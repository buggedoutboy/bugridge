"use client"

import { Button } from "@/components/ui/button"

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-green-600 rounded-lg text-white max-w-md">
      {/* Pixel-inspired font for the logo */}
      <h1
        className="text-5xl font-bold text-yellow-300 tracking-wide"
        style={{
          fontFamily: "monospace",
          textShadow: "2px 2px 0 #2f6e14, 4px 4px 0 #1d4509",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          imageRendering: "pixelated",
        }}
      >
        Bugridge
      </h1>

      <div className="relative w-full h-32 bg-green-800 rounded-lg overflow-hidden">
        {/* Decorative background elements instead of characters */}
        <div className="absolute inset-0">
          {/* Grass tufts */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-green-500 rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 6 + 3}px`,
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}px`,
                opacity: 0.7,
              }}
            />
          ))}

          {/* Decorative bugs/butterflies */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`bug-${i}`}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 70 + 15}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
                color: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"][i % 5],
              }}
            >
              {["🦋", "🐞", "🐝", "🐛", "🦗"][i % 5]}
            </div>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-2xl w-full py-8"
        onClick={onStart}
      >
        Play
      </Button>
    </div>
  )
}
