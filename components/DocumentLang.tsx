"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/Providers";

export function DocumentLang() {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "es";
  }, [locale]);

  return null;
}
