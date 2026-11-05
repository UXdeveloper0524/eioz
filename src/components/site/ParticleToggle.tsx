"use client";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { readPaused, writePaused } from "@/lib/particles/bus";

export function ParticleToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => setPaused(readPaused()), []);
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => {
        writePaused(!paused);
        setPaused(!paused);
      }}
      className="inline-flex items-center gap-1.5 hover:text-primary"
    >
      {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      {paused ? "Play animation" : "Pause animation"}
    </button>
  );
}
