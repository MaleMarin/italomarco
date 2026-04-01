"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { HOME_PATH } from "@/lib/routes";

export function RouteAmbient() {
  const pathname = usePathname();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 transition-[opacity,background] duration-[1.55s] ease-out",
        pathname === "/proyectos" &&
          "opacity-100 bg-[radial-gradient(ellipse_85%_55%_at_18%_12%,rgba(255,122,77,0.2),transparent_46%),radial-gradient(ellipse_70%_50%_at_85%_70%,rgba(180,95,60,0.1),transparent_48%)]",
        pathname === "/store" &&
          "opacity-100 bg-[radial-gradient(ellipse_80%_50%_at_72%_8%,rgba(195,205,215,0.2),transparent_44%),radial-gradient(ellipse_60%_45%_at_20%_80%,rgba(120,130,145,0.12),transparent_50%)]",
        pathname === "/services" &&
          "opacity-100 bg-[radial-gradient(ellipse_75%_48%_at_40%_15%,rgba(0,82,255,0.12),transparent_44%),radial-gradient(ellipse_60%_50%_at_90%_75%,rgba(255,255,255,0.068),transparent_50%)]",
        pathname === "/contact" &&
          "opacity-100 bg-[radial-gradient(ellipse_70%_50%_at_55%_20%,rgba(255,255,255,0.1),transparent_44%),radial-gradient(ellipse_55%_45%_at_15%_70%,rgba(0,82,255,0.095),transparent_48%)]",
        pathname === HOME_PATH &&
          "opacity-100 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(0,82,255,0.11),transparent_40%),radial-gradient(ellipse_70%_55%_at_80%_60%,rgba(255,255,255,0.055),transparent_48%)]",
        pathname !== HOME_PATH &&
          pathname !== "/proyectos" &&
          pathname !== "/store" &&
          pathname !== "/services" &&
          pathname !== "/contact" &&
          "opacity-100 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(255,255,255,0.072),transparent_48%)]",
      )}
    />
  );
}
