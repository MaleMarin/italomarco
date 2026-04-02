"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Locale = "es" | "en";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within Providers");
  }
  return ctx;
}

type HeaderIntroContextValue = {
  homeIntroComplete: boolean;
  setHomeIntroComplete: (v: boolean) => void;
};

const HeaderIntroContext = createContext<HeaderIntroContextValue | null>(null);

export function useHeaderIntro() {
  const ctx = useContext(HeaderIntroContext);
  if (!ctx) {
    throw new Error("useHeaderIntro must be used within Providers");
  }
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");
  /** false en "/" hasta que termine el vinilo (o timeout); si empieza en true, el header tapa el intro y el cuerpo parece vacío. */
  const [homeIntroComplete, setHomeIntroComplete] = useState(false);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <HeaderIntroContext.Provider
        value={{ homeIntroComplete, setHomeIntroComplete }}
      >
        {children}
      </HeaderIntroContext.Provider>
    </LocaleContext.Provider>
  );
}
