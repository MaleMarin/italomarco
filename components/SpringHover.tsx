"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";

type SpringHoverProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function SpringHover({
  children,
  className,
  y = SPRING_LIFT.y,
}: SpringHoverProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      whileHover={reduce ? undefined : { y }}
      transition={SPRING_LIFT_TRANSITION}
    >
      {children}
    </motion.span>
  );
}

const MotionLink = motion.create(Link);

type SpringLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  prefetch?: boolean;
};

export function SpringLink({
  href,
  className,
  children,
  onClick,
  prefetch,
}: SpringLinkProps) {
  const reduce = useReducedMotion();

  return (
    <MotionLink
      href={href}
      className={className}
      onClick={onClick}
      prefetch={prefetch}
      style={{ display: "inline-block" }}
      whileHover={reduce ? undefined : SPRING_LIFT}
      transition={SPRING_LIFT_TRANSITION}
    >
      {children}
    </MotionLink>
  );
}
