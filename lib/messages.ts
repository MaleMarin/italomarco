import type { Locale } from "@/components/Providers";
import content from "@/content.json";

export const messages = content;

export type Messages = (typeof content)[Locale];
