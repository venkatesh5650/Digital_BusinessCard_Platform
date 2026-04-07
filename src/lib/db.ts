import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let db: PrismaClient;

if (globalForPrisma.prisma) {
  db = globalForPrisma.prisma;
} else {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('❌ DATABASE_URL is not defined in .env');
  }

  const dbPath = databaseUrl.startsWith('file:')
    ? databaseUrl
    : `file:${path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ''))}`;

  const adapter = new PrismaBetterSqlite3({ url: dbPath });

  db = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
  }
}

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