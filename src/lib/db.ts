import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Antigravity: Pure Prisma Rust Engine. Zero Node `pg` Pool constraints.
// Let Prisma natively utilize process.env.DATABASE_URL defined securely in Vercel.
const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export { db };

// Keep your helper functions unchanged
export async function getCardBySlug(slug: string) {
  return db.vCard.findUnique({
    where: { slug },
    include: {
      phones: true,
      emails: true,
      addresses: true,
      websites: true,
      socialLinks: { orderBy: { order: 'asc' } },
      paymentLinks: { orderBy: { order: 'asc' } },
      actionLinks: { orderBy: { order: 'asc' } },
      mediaEmbeds: { orderBy: { order: 'asc' } },
    },
  });
}

export async function getCardsByUser(userId: string) {
  return db.vCard.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      firstName: true,
      lastName: true,
      displayName: true,
      jobTitle: true,
      avatarUrl: true,
      isPublished: true,
      totalViews: true,
      totalClicks: true,
      leadsCollected: true,
      updatedAt: true,
    },
  });
}