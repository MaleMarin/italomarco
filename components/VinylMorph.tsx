"use client";

import { HomeIntro } from "@/components/HomeIntro";

export type VinylMorphProps = {
  onComplete: () => void;
};

export default function VinylMorph({ onComplete }: VinylMorphProps) {
  return <HomeIntro onPhraseComplete={onComplete} />;
}
