import type { MouseEvent } from "react";

/** Tiny event bus from page components to the particle engine. */
export function emitParticles(type: `particles:${"attract" | "expand" | "focus" | "ripple" | "flow" | "stretch" | "ring" | "progress"}`, detail: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function attractToCard(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  emitParticles("particles:attract", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
}
export const releaseAttract = () => emitParticles("particles:attract", null);

export const PAUSE_KEY = "eioz-particles-paused";
export function readPaused() {
  try {
    return localStorage.getItem(PAUSE_KEY) === "1";
  } catch {
    return false;
  }
}
export function writePaused(v: boolean) {
  try {
    localStorage.setItem(PAUSE_KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent("particles:pause", { detail: v }));
}

export function rippleAt(e: { clientX: number; clientY: number }, amp = 1) {
  emitParticles("particles:ripple", { x: e.clientX, y: e.clientY, amp });
}
export function rippleFromEl(el: Element, amp = 0.6) {
  const r = el.getBoundingClientRect();
  emitParticles("particles:ripple", { x: r.left + r.width / 2, y: r.top + r.height / 2, amp });
}
