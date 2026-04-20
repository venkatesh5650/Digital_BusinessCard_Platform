/**
 * coverPresets.ts
 * Curated list of professional cover banner designs.
 */

export interface CoverPreset {
  id: string;
  name: string;
  url: string;
  category: "Professional" | "Creative" | "Tech" | "Abstract";
}

export const COVER_PRESETS: CoverPreset[] = [
  {
    id: "corporate-minimal",
    name: "Corporate Minimalist",
    url: "/images/covers/corporate-minimal.png",
    category: "Professional",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    url: "/images/covers/cyber-neon.png",
    category: "Tech",
  },
  {
    id: "creative-vibrant",
    name: "Creative Vibrant",
    url: "/images/covers/creative-vibrant.png",
    category: "Creative",
  },
  {
    id: "tech-infrastructure",
    name: "Tech Infrastructure",
    url: "/images/covers/tech-infrastructure.png",
    category: "Tech",
  },
];
