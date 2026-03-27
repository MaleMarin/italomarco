"use client";

import { useLocale } from "@/components/Providers";
import { messages, type Messages } from "@/lib/messages";

export function useTranslations(): Messages {
  const { locale } = useLocale();
  return messages[locale];
}
