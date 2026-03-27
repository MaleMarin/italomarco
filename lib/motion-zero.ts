import { motionValue, type MotionValue } from "framer-motion";

let zero: MotionValue<number> | null = null;

export function zeroMotion(): MotionValue<number> {
  if (!zero) zero = motionValue(0);
  return zero;
}
