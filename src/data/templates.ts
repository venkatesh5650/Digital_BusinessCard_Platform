/**
 * templates.ts
 * Metadata for the digital business card layout templates.
 */

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: "Professional" | "Modern" | "Premium" | "Minimal";
}

export const ATTR_TEMPLATES: CardTemplate[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "The standard trusted layout for corporate roles.",
    category: "Professional",
  },
  {
    id: "bold",
    name: "Modern & Bold",
    description: "Centered layout with large typography for personal branding.",
    category: "Modern",
  },
  {
    id: "cyber",
    name: "Cyber Glass",
    description: "Premium glassmorphism and neon effects for tech founders.",
    category: "Premium",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Ultra-clean layout with refined typography and whitespace.",
    category: "Minimal",
  },
];
