/**
 * ============================================================
 *  NeonGlass — Digital Business Card Platform
 *  Core Type Definitions (vCard Schema)
 * ============================================================
 */

/* -------------------------------------------------------
   1. ENUMS & UNION TYPES
   ------------------------------------------------------- */

/** All supported social / link platforms */
export type SocialPlatform =
  | "linkedin"
  | "twitter"
  | "instagram"
  | "facebook"
  | "github"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "pinterest"
  | "reddit"
  | "discord"
  | "twitch"
  | "behance"
  | "dribbble"
  | "medium"
  | "substack"
  | "dev"
  | "producthunt"
  | "telegram"
  | "whatsapp"
  | "signal"
  | "threads"
  | "bluesky"
  | "website"
  | "portfolio"
  | "custom";

/** Payment gateway types */
export type PaymentPlatform =
  | "paypal"
  | "venmo"
  | "cashapp"
  | "stripe"
  | "razorpay"
  | "gpay"
  | "upi"
  | "buymeacoffee"
  | "patreon"
  | "kofi";

/** Scheduling & action link types */
export type ActionPlatform =
  | "calendly"
  | "cal"
  | "tidycal"
  | "savvycal"
  | "zoom"
  | "meet"
  | "teams"
  | "booking"
  | "typeform"
  | "forms"
  | "shopify"
  | "etsy"
  | "amazon"
  | "custom";

/** Card background style */
export type BackgroundStyle =
  | "gradient"
  | "solid"
  | "glass"
  | "image"
  | "mesh"
  | "neon";

/** Card layout variant */
export type CardLayout = "classic" | "compact" | "bold" | "minimal" | "cyber";

/** Color theme preset names */
export type ThemePreset =
  | "cyber-violet"
  | "ocean-cyan"
  | "aurora"
  | "midnight"
  | "rose-gold"
  | "emerald"
  | "solar"
  | "custom";

/** Phone number type */
export type PhoneType = "mobile" | "work" | "home" | "fax" | "other";

/** Email type */
export type EmailType = "work" | "personal" | "other";

/** Address type */
export type AddressType = "work" | "home" | "other";

/* -------------------------------------------------------
   2. CONTACT DETAIL BLOCKS
   ------------------------------------------------------- */

export interface PhoneEntry {
  id: string;
  type: PhoneType;
  /** E.164 formatted phone number, e.g. "+91-9876543210" */
  number: string;
  /** Optional label override shown on card, e.g. "Direct Line" */
  label?: string;
  /** If true, show a WhatsApp quick-link for this number */
  whatsapp?: boolean;
  /** If true, show an SMS shortcut */
  sms?: boolean;
  isPrimary?: boolean;
}

export interface EmailEntry {
  id: string;
  type: EmailType;
  address: string;
  label?: string;
  isPrimary?: boolean;
}

export interface AddressEntry {
  id: string;
  type: AddressType;
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  /** Pre-filled Google Maps URL */
  mapUrl?: string;
}

export interface WebsiteEntry {
  id: string;
  label: string;
  url: string;
  /** If true, displays as a featured CTA button rather than a plain link */
  featured?: boolean;
}

/* -------------------------------------------------------
   3. SOCIAL LINKS
   ------------------------------------------------------- */

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  /** Full URL to the profile */
  url: string;
  /** Display handle / username, e.g. "@ravikumar" */
  handle?: string;
  /** Custom label override (for "custom" platform) */
  label?: string;
  /** Display order on the card */
  order: number;
  isVisible: boolean;
}

/* -------------------------------------------------------
   4. PAYMENT LINKS
   ------------------------------------------------------- */

export interface PaymentLink {
  id: string;
  platform: PaymentPlatform;
  url: string;
  /** Short label shown on the button, e.g. "Pay via PayPal" */
  label?: string;
  /** Optional note shown below the button */
  note?: string;
  order: number;
  isVisible: boolean;
}

/* -------------------------------------------------------
   5. ACTION LINKS (Booking, Forms, Shop, etc.)
   ------------------------------------------------------- */

export interface ActionLink {
  id: string;
  platform: ActionPlatform;
  url: string;
  /** CTA text on the button, e.g. "Book a Free Call" */
  label: string;
  /** Optional subtitle below the button */
  subtitle?: string;
  /** Optional emoji or icon name */
  icon?: string;
  /** Highlight color override (hex) */
  color?: string;
  order: number;
  isVisible: boolean;
}

/* -------------------------------------------------------
   6. MEDIA EMBED BLOCKS
   ------------------------------------------------------- */

export interface MediaEmbed {
  id: string;
  type: "youtube" | "vimeo" | "spotify" | "soundcloud" | "pdf" | "image" | "tweet";
  /** Raw URL to the media */
  url: string;
  /** Title shown above the embed */
  title?: string;
  /** Thumbnail override */
  thumbnailUrl?: string;
  order: number;
  isVisible: boolean;
}

/* -------------------------------------------------------
   7. CARD THEME & VISUAL CONFIG
   ------------------------------------------------------- */

export interface CardTheme {
  preset: ThemePreset;
  backgroundStyle: BackgroundStyle;

  /** Primary gradient / background color start */
  colorPrimary: string;
  /** Gradient end color */
  colorSecondary: string;
  /** Accent color (buttons, highlights) */
  colorAccent: string;
  /** Text on dark backgrounds */
  textColor: string;
  /** Subtext color */
  subtextColor: string;

  layout: CardLayout;

  /** Whether to show a frosted glass overlay on the header */
  headerGlass: boolean;
  /** Show/hide the animated neon ring on the avatar */
  avatarNeonRing: boolean;
  /** Show/hide animated background particles */
  particles: boolean;

  /** Custom cover image URL (banner at the top of the card) */
  coverImageUrl?: string;
  /** Custom background image URL (full card background) */
  backgroundImageUrl?: string;
}

/* -------------------------------------------------------
   8. PROFILE / COMPANY INFO
   ------------------------------------------------------- */

export interface CompanyInfo {
  name: string;
  role?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  tagline?: string;
}

export interface CardProfile {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Preferred display name override, e.g. "Ravi Kumar" */
  displayName?: string;
  /** Primary job title */
  jobTitle: string;
  /** One-liner headline */
  headline?: string;
  /** Short bio visible on card (max ~300 chars recommended) */
  bio?: string;
  /** Pronouns e.g. "he/him" */
  pronouns?: string;
  /** Profile photo URL */
  avatarUrl: string;
  company?: CompanyInfo;
}

/* -------------------------------------------------------
   9. CARD METADATA & SETTINGS
   ------------------------------------------------------- */

export interface CardSettings {
  /** Public URL slug, e.g. "ravikumar" → neonglass.me/ravikumar */
  slug: string;
  isPublished: boolean;
  /** Allow viewers to exchange their contact info (lead capture) */
  leadCaptureEnabled: boolean;
  /** Allow viewers to download a .vcf file */
  vcfDownloadEnabled: boolean;
  /** Show view count on the card */
  showViewCount: boolean;
  /** Custom page title for SEO */
  seoTitle?: string;
  /** Custom meta description */
  seoDescription?: string;
  language: string;
}

/* -------------------------------------------------------
   10. ANALYTICS SNAPSHOT (for card display)
   ------------------------------------------------------- */

export interface CardAnalytics {
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
  leadsCollected: number;
  vcfDownloads: number;
}

/* -------------------------------------------------------
   11. ROOT VCARD TYPE
   ------------------------------------------------------- */

export interface VCard {
  /** UUID */
  id: string;
  /** User account this card belongs to */
  userId: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601

  /** Core identity */
  profile: CardProfile;

  /** Contact details */
  phones: PhoneEntry[];
  emails: EmailEntry[];
  addresses: AddressEntry[];
  websites: WebsiteEntry[];

  /** Links */
  socialLinks: SocialLink[];
  paymentLinks: PaymentLink[];
  actionLinks: ActionLink[];

  /** Media */
  mediaEmbeds: MediaEmbed[];

  /** Appearance */
  theme: CardTheme;

  /** Behaviour */
  settings: CardSettings;

  /** Analytics (read-only, populated by backend) */
  analytics?: CardAnalytics;
}
