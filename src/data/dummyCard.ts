/**
 * ============================================================
 *  Imprint — Digital Business Card Platform
 *  Dummy Card Data — exercises every field in the VCard schema
 * ============================================================
 *
 *  This is used as the seed / mock data for:
 *   • Step 4: Public Card Renderer smoke test
 *   • Step 5: .vcf export engine testing
 *   • Future: seeding the dev database
 * ============================================================
 */

import type { VCard } from "@/types";

export const DUMMY_CARD: VCard = {
  /* ---- Identity ---- */
  id: "vcard-001-ravi-kumar",
  userId: "user-001",
  createdAt: "2026-01-15T08:00:00Z",
  updatedAt: "2026-04-03T16:00:00Z",

  /* ---- Profile ---- */
  profile: {
    firstName: "Ravi",
    lastName: "Kumar",
    displayName: "Ravi Kumar Tenneti",
    jobTitle: "Founder & CEO",
    headline: "Building the future of IT Infrastructure",
    bio: "Passionate technologist and entrepreneur with 12+ years of experience in IT solutions, cloud infrastructure, and digital transformation. I help businesses grow smarter with cutting-edge technology.",
    pronouns: "he/him",
    avatarUrl: "/profile.png",
    company: {
      name: "Computer Port",
      role: "Founder",
      logoUrl: "/globe.svg",
      website: "https://computerport.in",
      industry: "Information Technology",
      tagline: "Smart IT Solutions for Smart Businesses",
    },
  },

  /* ---- Phones ---- */
  phones: [
    {
      id: "ph-001",
      type: "mobile",
      number: "+91-9876543210",
      label: "Mobile",
      whatsapp: true,
      sms: true,
      isPrimary: true,
    },
    {
      id: "ph-002",
      type: "work",
      number: "+91-4027998877",
      label: "Office",
      whatsapp: false,
      sms: false,
      isPrimary: false,
    },
  ],

  /* ---- Emails ---- */
  emails: [
    {
      id: "em-001",
      type: "work",
      address: "ravi@computerport.in",
      label: "Work",
      isPrimary: true,
    },
    {
      id: "em-002",
      type: "personal",
      address: "ravikumar.tenneti@gmail.com",
      label: "Personal",
      isPrimary: false,
    },
  ],

  /* ---- Addresses ---- */
  addresses: [
    {
      id: "addr-001",
      type: "work",
      label: "Head Office",
      street: "Plot 45, Hitech City Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
      mapUrl:
        "https://maps.google.com/?q=Hitech+City+Hyderabad+Telangana+India",
    },
  ],

  /* ---- Websites ---- */
  websites: [
    {
      id: "web-001",
      label: "Company Website",
      url: "https://computerport.in",
      featured: true,
    },
    {
      id: "web-002",
      label: "Personal Blog",
      url: "https://ravikumar.dev",
      featured: false,
    },
  ],

  /* ---- Social Links ---- */
  socialLinks: [
    {
      id: "soc-001",
      platform: "linkedin",
      url: "https://www.linkedin.com/in/ravikumartenneti",
      handle: "ravikumartenneti",
      order: 1,
      isVisible: true,
    },
    {
      id: "soc-002",
      platform: "twitter",
      url: "https://twitter.com/ravikumar_dev",
      handle: "@ravikumar_dev",
      order: 2,
      isVisible: true,
    },
    {
      id: "soc-003",
      platform: "instagram",
      url: "https://www.instagram.com/ravikumar.tenneti",
      handle: "@ravikumar.tenneti",
      order: 3,
      isVisible: true,
    },
    {
      id: "soc-004",
      platform: "github",
      url: "https://github.com/ravikumartenneti",
      handle: "ravikumartenneti",
      order: 4,
      isVisible: true,
    },
    {
      id: "soc-005",
      platform: "youtube",
      url: "https://www.youtube.com/@computerport",
      handle: "@computerport",
      order: 5,
      isVisible: true,
    },
    {
      id: "soc-006",
      platform: "facebook",
      url: "https://www.facebook.com/computerportIN",
      handle: "computerportIN",
      order: 6,
      isVisible: true,
    },
    {
      id: "soc-007",
      platform: "telegram",
      url: "https://t.me/ravikumar_tech",
      handle: "ravikumar_tech",
      order: 7,
      isVisible: false,
    },
    {
      id: "soc-008",
      platform: "threads",
      url: "https://www.threads.net/@ravikumar.tenneti",
      handle: "@ravikumar.tenneti",
      order: 8,
      isVisible: true,
    },
  ],

  /* ---- Payment Links ---- */
  paymentLinks: [
    {
      id: "pay-001",
      platform: "razorpay",
      url: "https://rzp.io/l/computerport",
      label: "Pay via Razorpay",
      note: "For invoices & quick payments",
      order: 1,
      isVisible: true,
    },
    {
      id: "pay-002",
      platform: "upi",
      url: "upi://pay?pa=ravi@ybl&pn=RaviKumar",
      label: "UPI Payment",
      note: "ravi@ybl",
      order: 2,
      isVisible: true,
    },
    {
      id: "pay-003",
      platform: "paypal",
      url: "https://paypal.me/ravikumartenneti",
      label: "PayPal",
      order: 3,
      isVisible: false,
    },
  ],

  /* ---- Action Links ---- */
  actionLinks: [
    {
      id: "act-001",
      platform: "calendly",
      url: "https://calendly.com/ravikumar/30min",
      label: "Book a Free Consultation",
      subtitle: "30 min • Google Meet",
      icon: "📅",
      color: "#7c3aed",
      order: 1,
      isVisible: true,
    },
    {
      id: "act-002",
      platform: "zoom",
      url: "https://zoom.us/j/1234567890",
      label: "Join Zoom Call",
      subtitle: "Instant meeting room",
      icon: "📹",
      color: "#2563eb",
      order: 2,
      isVisible: true,
    },
    {
      id: "act-003",
      platform: "typeform",
      url: "https://forms.typeform.com/to/xyz123",
      label: "Request a Quote",
      subtitle: "IT services & solutions pricing",
      icon: "💼",
      color: "#06b6d4",
      order: 3,
      isVisible: true,
    },
    {
      id: "act-004",
      platform: "custom",
      url: "https://computerport.in/case-studies",
      label: "View Our Work",
      subtitle: "Explore case studies & portfolio",
      icon: "🚀",
      color: "#f59e0b",
      order: 4,
      isVisible: true,
    },
  ],

  /* ---- Media Embeds ---- */
  mediaEmbeds: [
    {
      id: "med-001",
      type: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Company Overview — Computer Port",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      order: 1,
      isVisible: true,
    },
    {
      id: "med-002",
      type: "pdf",
      url: "https://computerport.in/assets/company-profile.pdf",
      title: "Download Company Brochure",
      order: 2,
      isVisible: true,
    },
  ],

  /* ---- Theme ---- */
  theme: {
    preset: "cyber-violet",
    backgroundStyle: "gradient",
    colorPrimary: "#7c3aed",
    colorSecondary: "#06b6d4",
    colorAccent: "#f59e0b",
    textColor: "#f1f5f9",
    subtextColor: "#94a3b8",
    layout: "diagonal",
    headerGlass: true,
    avatarNeonRing: true,
    particles: false,
    coverImageUrl: undefined,
    backgroundImageUrl: undefined,
  },

  /* ---- Settings ---- */
  settings: {
    slug: "ravikumar",
    isPublished: true,
    leadCaptureEnabled: true,
    vcfDownloadEnabled: true,
    showViewCount: false,
    seoTitle: "Ravi Kumar Tenneti — Founder & CEO at Computer Port",
    seoDescription:
      "Connect with Ravi Kumar Tenneti, Founder & CEO of Computer Port — IT Solutions, Cloud Infrastructure & Digital Transformation specialist based in Hyderabad, India.",
    language: "en",
  },

  /* ---- Analytics (mock) ---- */
  analytics: {
    totalViews: 3841,
    uniqueViews: 2109,
    totalClicks: 964,
    leadsCollected: 57,
    vcfDownloads: 312,
  },
};

/**
 * Helper: returns the card's full display name
 */
export function getDisplayName(card: VCard): string {
  return (
    card.profile.displayName ||
    `${card.profile.firstName} ${card.profile.lastName}`
  );
}

/**
 * Helper: returns all visible social links sorted by order
 */
export function getVisibleSocialLinks(card: VCard) {
  return card.socialLinks
    .filter((l) => l.isVisible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Helper: returns all visible action links sorted by order
 */
export function getVisibleActionLinks(card: VCard) {
  return card.actionLinks
    .filter((l) => l.isVisible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Helper: returns all visible payment links sorted by order
 */
export function getVisiblePaymentLinks(card: VCard) {
  return card.paymentLinks
    .filter((l) => l.isVisible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Helper: returns all visible media embeds sorted by order
 */
export function getVisibleMediaEmbeds(card: VCard) {
  return card.mediaEmbeds
    .filter((m) => m.isVisible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Helper: returns the primary phone, or first phone if none marked primary
 */
export function getPrimaryPhone(card: VCard) {
  return (
    card.phones.find((p) => p.isPrimary) ?? card.phones[0] ?? null
  );
}

/**
 * Helper: returns the primary email, or first email if none marked primary
 */
export function getPrimaryEmail(card: VCard) {
  return (
    card.emails.find((e) => e.isPrimary) ?? card.emails[0] ?? null
  );
}
