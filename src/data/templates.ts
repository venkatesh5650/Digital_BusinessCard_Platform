/**
 * templates.ts
 * Metadata for the digital business card layout templates.
 */

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: "Professional" | "Modern" | "Premium";
}

export const ATTR_TEMPLATES: CardTemplate[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Slanted header with clean contact rows — the HiHello standard.",
    category: "Professional",
  },
  {
    id: "wave",
    name: "Wave Gradient",
    description: "Smooth wave header with vibrant gradients for personal branding.",
    category: "Modern",
  },
  {
    id: "diagonal",
    name: "Diagonal Stripe",
    description: "Diagonal-patterned header with centered hierarchy and action bar.",
    category: "Premium",
  },
];
