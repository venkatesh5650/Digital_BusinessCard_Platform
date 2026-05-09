import { PrismaClient } from '@prisma/client';
import { Pool, PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Bumping Prisma Singleton for HMR (reloads generated models)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Extremely resilient connection for Vercel Serverless
const connectionString = process.env.NODE_ENV === 'development' 
  ? (process.env.DATABASE_URL || process.env.POSTGRES_URL)
  : (process.env.POSTGRES_URL || process.env.DATABASE_URL);

const poolConfig: PoolConfig = {
  connectionString,
  ssl: process.env.NODE_ENV !== 'development' ? { rejectUnauthorized: false } : undefined,
  max: 1, // Keep local connection pool microscopic since Supabase pooler handles the rest
  allowExitOnIdle: true, // Let Lambdas die gracefully
};

console.log("[DB] Initializing Prisma with connection string:", connectionString?.split('@')[1] || "UNDEFINED");

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error("[DB][Pool] Unexpected error on idle client", err);
});

const adapter = new PrismaPg(pool);

const db = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
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
    where: { userId, layout: { not: "draft" } },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      firstName: true,
      lastName: true,
      displayName: true,
      jobTitle: true,
      avatarUrl: true,
      companyLogoUrl: true,
      coverImageUrl: true,
      isPublished: true,
      totalViews: true,
      totalClicks: true,
      leadsCollected: true,
      updatedAt: true,
      layout: true,
      colorPrimary: true,
    },
  });
}