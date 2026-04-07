/**
 * cardMapper.ts
 * Converts a Prisma VCard DB row (with relations) into the frontend VCard type.
 */
import type { VCard as VCardType } from "@/types";

// Prisma's full return type from getCardBySlug
type DbCard = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  displayName: string | null;
  jobTitle: string;
  headline: string | null;
  bio: string | null;
  pronouns: string | null;
  avatarUrl: string | null;
  companyName: string | null;
  companyRole: string | null;
  companyLogoUrl: string | null;
  companyWebsite: string | null;
  companyIndustry: string | null;
  companyTagline: string | null;
  slug: string;
  isPublished: boolean;
  leadCaptureEnabled: boolean;
  vcfDownloadEnabled: boolean;
  showViewCount: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  language: string;
  themePreset: string;
  backgroundStyle: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  textColor: string;
  subtextColor: string;
  layout: string;
  headerGlass: boolean;
  avatarNeonRing: boolean;
  particles: boolean;
  coverImageUrl: string | null;
  backgroundImageUrl: string | null;
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
  leadsCollected: number;
  vcfDownloads: number;
  phones: {
    id: string;
    type: string;
    number: string;
    label: string | null;
    whatsapp: boolean;
    sms: boolean;
    isPrimary: boolean;
  }[];
  emails: {
    id: string;
    type: string;
    address: string;
    label: string | null;
    isPrimary: boolean;
  }[];
  addresses: {
    id: string;
    type: string;
    label: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    mapUrl: string | null;
  }[];
  websites: {
    id: string;
    label: string;
    url: string;
    featured: boolean;
  }[];
  socialLinks: {
    id: string;
    platform: string;
    url: string;
    handle: string | null;
    label: string | null;
    order: number;
    isVisible: boolean;
  }[];
  paymentLinks: {
    id: string;
    platform: string;
    url: string;
    label: string | null;
    note: string | null;
    order: number;
    isVisible: boolean;
  }[];
  actionLinks: {
    id: string;
    platform: string;
    url: string;
    label: string;
    subtitle: string | null;
    icon: string | null;
    color: string | null;
    order: number;
    isVisible: boolean;
  }[];
  mediaEmbeds: {
    id: string;
    type: string;
    url: string;
    title: string | null;
    thumbnailUrl: string | null;
    order: number;
    isVisible: boolean;
  }[];
};

export function dbCardToVCard(db: DbCard): VCardType {
  return {
    id: db.id,
    userId: db.userId,
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),

    profile: {
      firstName: db.firstName,
      lastName: db.lastName,
      displayName: db.displayName ?? undefined,
      jobTitle: db.jobTitle,
      headline: db.headline ?? undefined,
      bio: db.bio ?? undefined,
      pronouns: db.pronouns ?? undefined,
      avatarUrl: db.avatarUrl ?? "",
      company: db.companyName
        ? {
            name: db.companyName,
            role: db.companyRole ?? undefined,
            logoUrl: db.companyLogoUrl ?? undefined,
            website: db.companyWebsite ?? undefined,
            industry: db.companyIndustry ?? undefined,
            tagline: db.companyTagline ?? undefined,
          }
        : undefined,
    },

    phones: db.phones.map((p) => ({
      id: p.id,
      type: p.type as import("@/types").PhoneType,
      number: p.number,
      label: p.label ?? undefined,
      whatsapp: p.whatsapp,
      sms: p.sms,
      isPrimary: p.isPrimary,
    })),

    emails: db.emails.map((e) => ({
      id: e.id,
      type: e.type as import("@/types").EmailType,
      address: e.address,
      label: e.label ?? undefined,
      isPrimary: e.isPrimary,
    })),

    addresses: db.addresses.map((a) => ({
      id: a.id,
      type: a.type as import("@/types").AddressType,
      label: a.label ?? undefined,
      street: a.street ?? undefined,
      city: a.city ?? undefined,
      state: a.state ?? undefined,
      postalCode: a.postalCode ?? undefined,
      country: a.country ?? undefined,
      mapUrl: a.mapUrl ?? undefined,
    })),

    websites: db.websites.map((w) => ({
      id: w.id,
      label: w.label,
      url: w.url,
      featured: w.featured,
    })),

    socialLinks: db.socialLinks.map((s) => ({
      id: s.id,
      platform: s.platform as import("@/types").SocialPlatform,
      url: s.url,
      handle: s.handle ?? undefined,
      label: s.label ?? undefined,
      order: s.order,
      isVisible: s.isVisible,
    })),

    paymentLinks: db.paymentLinks.map((p) => ({
      id: p.id,
      platform: p.platform as import("@/types").PaymentPlatform,
      url: p.url,
      label: p.label ?? undefined,
      note: p.note ?? undefined,
      order: p.order,
      isVisible: p.isVisible,
    })),

    actionLinks: db.actionLinks.map((a) => ({
      id: a.id,
      platform: a.platform as import("@/types").ActionPlatform,
      url: a.url,
      label: a.label,
      subtitle: a.subtitle ?? undefined,
      icon: a.icon ?? undefined,
      color: a.color ?? undefined,
      order: a.order,
      isVisible: a.isVisible,
    })),

    mediaEmbeds: db.mediaEmbeds.map((m) => ({
      id: m.id,
      type: m.type as import("@/types").MediaEmbed["type"],
      url: m.url,
      title: m.title ?? undefined,
      thumbnailUrl: m.thumbnailUrl ?? undefined,
      order: m.order,
      isVisible: m.isVisible,
    })),

    theme: {
      preset: db.themePreset as import("@/types").ThemePreset,
      backgroundStyle: db.backgroundStyle as import("@/types").BackgroundStyle,
      colorPrimary: db.colorPrimary,
      colorSecondary: db.colorSecondary,
      colorAccent: db.colorAccent,
      textColor: db.textColor,
      subtextColor: db.subtextColor,
      layout: db.layout as import("@/types").CardLayout,
      headerGlass: db.headerGlass,
      avatarNeonRing: db.avatarNeonRing,
      particles: db.particles,
      coverImageUrl: db.coverImageUrl ?? undefined,
      backgroundImageUrl: db.backgroundImageUrl ?? undefined,
    },

    settings: {
      slug: db.slug,
      isPublished: db.isPublished,
      leadCaptureEnabled: db.leadCaptureEnabled,
      vcfDownloadEnabled: db.vcfDownloadEnabled,
      showViewCount: db.showViewCount,
      seoTitle: db.seoTitle ?? undefined,
      seoDescription: db.seoDescription ?? undefined,
      language: db.language,
    },

    analytics: {
      totalViews: db.totalViews,
      uniqueViews: db.uniqueViews,
      totalClicks: db.totalClicks,
      leadsCollected: db.leadsCollected,
      vcfDownloads: db.vcfDownloads,
    },
  };
}
