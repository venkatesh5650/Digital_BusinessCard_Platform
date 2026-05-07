/**
 * urlUtils.ts
 * Smart URL normalization for social media and payment platforms.
 */

export function normalizeUrl(platform: string, input: string): string {
  if (!input) return "";

  const trimmed = input.trim();
  
  // If it already looks like a full URL, return it
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Handle-to-URL mapping
  const p = platform.toLowerCase();
  let clean = trimmed.replace(/^@/, ""); // Remove leading @ if present

  switch (p) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "twitter":
    case "x":
      return `https://twitter.com/${clean}`;
    case "linkedin":
      return `https://linkedin.com/in/${clean}`;
    case "facebook":
      return `https://facebook.com/${clean}`;
    case "github":
      return `https://github.com/${clean}`;
    case "youtube":
      return `https://youtube.com/@${clean}`;
    case "tiktok":
      return `https://tiktok.com/@${clean}`;
    case "threads":
      return `https://threads.net/@${clean}`;
    case "bluesky":
      return `https://bsky.app/profile/${clean}`;
    case "snapchat":
      return `https://snapchat.com/add/${clean}`;
    case "pinterest":
      return `https://pinterest.com/${clean}`;
    case "reddit":
      return `https://reddit.com/user/${clean}`;
    case "telegram":
      return `https://t.me/${clean}`;
    case "whatsapp":
      // Remove all non-digit characters for WhatsApp
      const digits = trimmed.replace(/\D/g, "");
      return `https://wa.me/${digits}`;
    case "paypal":
      return `https://paypal.me/${clean}`;
    case "buymeacoffee":
      return `https://buymeacoffee.com/${clean}`;
    case "patreon":
      return `https://patreon.com/${clean}`;
    case "kofi":
      return `https://ko-fi.com/${clean}`;
    case "calendly":
      return `https://calendly.com/${clean}`;
    default:
      // If no platform match, try to prepend https:// if it looks like a domain
      if (trimmed.includes(".") && !trimmed.includes(" ")) {
        return `https://${trimmed}`;
      }
      return trimmed;
  }
}
