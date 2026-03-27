export const FLUID_CURSOR_PULSE_EVENT = "fluid-cursor-pulse";

export function dispatchCursorPulse() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FLUID_CURSOR_PULSE_EVENT));
}
