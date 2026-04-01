"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const ROOT_ID = "vinyl-intro-root";

/**
 * Monta el intro del vinilo en un nodo bajo <body> con z-index por encima del header (z-210).
 * Si el hero vive solo dentro de <main z-10>, el vinilo queda siempre detrás del navbar aunque tenga z-240.
 */
export function VinylIntroPortal({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setRoot(document.getElementById(ROOT_ID));
  }, []);

  if (!root) return null;

  return createPortal(children, root);
}
