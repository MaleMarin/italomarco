import type { Transition } from "framer-motion";

/** Shared lift for links / buttons (sonic console tactility). */
export const SPRING_LIFT = { y: -2 as const };

export const SPRING_LIFT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 22,
  mass: 0.55,
};
