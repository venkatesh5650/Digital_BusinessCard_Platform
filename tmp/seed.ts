
import { db } from '../src/lib/db';
import { DUMMY_CARD } from '../src/data/dummyCard';

async function seed() {
  console.log('Starting seed...');
  
  // Create user
  await db.user.upsert({
    where: { email: 'ravi@computerport.in' },
    update: {},
    create: {
      id: 'user-001',
      name: 'Ravi Kumar',
      email: 'ravi@computerport.in'
    }
  });

  // Create VCard with flattened fields as per schema.prisma
  await db.vCard.upsert({
    where: { slug: DUMMY_CARD.settings.slug },
    update: {},
    create: {
      id: DUMMY_CARD.id,
      userId: 'user-001',
      firstName: DUMMY_CARD.profile.firstName,
      lastName: DUMMY_CARD.profile.lastName,
      displayName: DUMMY_CARD.profile.displayName || null,
      jobTitle: DUMMY_CARD.profile.jobTitle,
      headline: DUMMY_CARD.profile.headline || null,
      bio: DUMMY_CARD.profile.bio || null,
      pronouns: DUMMY_CARD.profile.pronouns || null,
      avatarUrl: DUMMY_CARD.profile.avatarUrl || null,
      
      companyName: DUMMY_CARD.profile.company?.name || null,
      companyRole: DUMMY_CARD.profile.company?.role || null,
      companyLogoUrl: DUMMY_CARD.profile.company?.logoUrl || null,
      companyWebsite: DUMMY_CARD.profile.company?.website || null,
      companyIndustry: DUMMY_CARD.profile.company?.industry || null,
      companyTagline: DUMMY_CARD.profile.company?.tagline || null,

      slug: DUMMY_CARD.settings.slug,
      isPublished: DUMMY_CARD.settings.isPublished,
      leadCaptureEnabled: DUMMY_CARD.settings.leadCaptureEnabled,
      vcfDownloadEnabled: DUMMY_CARD.settings.vcfDownloadEnabled,
      showViewCount: DUMMY_CARD.settings.showViewCount,
      seoTitle: DUMMY_CARD.settings.seoTitle || null,
      seoDescription: DUMMY_CARD.settings.seoDescription || null,
      language: DUMMY_CARD.settings.language,

      themePreset: DUMMY_CARD.theme.preset,
      backgroundStyle: DUMMY_CARD.theme.backgroundStyle,
      colorPrimary: DUMMY_CARD.theme.colorPrimary,
      colorSecondary: DUMMY_CARD.theme.colorSecondary,
      colorAccent: DUMMY_CARD.theme.colorAccent,
      textColor: DUMMY_CARD.theme.textColor,
      subtextColor: DUMMY_CARD.theme.subtextColor,
      layout: DUMMY_CARD.theme.layout,
      headerGlass: DUMMY_CARD.theme.headerGlass,
      avatarNeonRing: DUMMY_CARD.theme.avatarNeonRing,
      particles: DUMMY_CARD.theme.particles,

      totalViews: DUMMY_CARD.analytics?.totalViews || 0,
      uniqueViews: DUMMY_CARD.analytics?.uniqueViews || 0,
      totalClicks: DUMMY_CARD.analytics?.totalClicks || 0,
      leadsCollected: DUMMY_CARD.analytics?.leadsCollected || 0,
      vcfDownloads: DUMMY_CARD.analytics?.vcfDownloads || 0,

      // Relations
      phones: {
        create: DUMMY_CARD.phones.map(p => ({
          type: p.type,
          number: p.number,
          label: p.label || null,
          whatsapp: p.whatsapp || false,
          sms: p.sms || true,
          isPrimary: p.isPrimary || false
        }))
      },
      emails: {
        create: DUMMY_CARD.emails.map(e => ({
          type: e.type,
          address: e.address,
          label: e.label || null,
          isPrimary: e.isPrimary || false
        }))
      },
      addresses: {
        create: DUMMY_CARD.addresses.map(a => ({
          type: a.type,
          label: a.label || null,
          street: a.street || null,
          city: a.city || null,
          state: a.state || null,
          postalCode: a.postalCode || null,
          country: a.country || null,
          mapUrl: a.mapUrl || null
        }))
      },
      websites: {
        create: DUMMY_CARD.websites.map(w => ({
          label: w.label,
          url: w.url,
          featured: w.featured || false
        }))
      },
      socialLinks: {
        create: DUMMY_CARD.socialLinks.map(s => ({
          platform: s.platform,
          url: s.url,
          handle: s.handle || null,
          label: s.label || null,
          order: s.order || 0,
          isVisible: s.isVisible !== false
        }))
      },
      paymentLinks: {
        create: DUMMY_CARD.paymentLinks.map(p => ({
          platform: p.platform,
          url: p.url,
          label: p.label || null,
          note: p.note || null,
          order: p.order || 0,
          isVisible: p.isVisible !== false
        }))
      },
      actionLinks: {
        create: DUMMY_CARD.actionLinks.map(a => ({
          platform: a.platform,
          url: a.url,
          label: a.label,
          subtitle: a.subtitle || null,
          icon: a.icon || null,
          color: a.color || null,
          order: a.order || 0,
          isVisible: a.isVisible !== false
        }))
      },
      mediaEmbeds: {
        create: DUMMY_CARD.mediaEmbeds.map(m => ({
          type: m.type,
          url: m.url,
          title: m.title || null,
          thumbnailUrl: m.thumbnailUrl || null,
          order: m.order || 0,
          isVisible: m.isVisible !== false
        }))
      }
    }
  });

  console.log('Seed success!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
