"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Ensures the current requester is an authenticated Administrator.
 */
async function ensureAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Administrative access required.");
  }
  return session.user;
}

/**
 * Fetches all users for the management table.
 */
export async function getAdminUsers() {
  await ensureAdmin();
  return await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { cards: true }
      }
    }
  });
}

/**
 * Fetches all virtual cards across the entire platform.
 */
export async function getAdminCards() {
  await ensureAdmin();
  return await db.vCard.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });
}

/**
 * Updates a user's role (Promote/Demote).
 */
export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  await ensureAdmin();
  await db.user.update({
    where: { id: userId },
    data: { role }
  });
  revalidatePath("/admin", "layout");
}

/**
 * Deletes a user and all their associated cards/leads.
 */
export async function deleteUserAccount(userId: string) {
  const admin = await ensureAdmin();
  
  // Safety: Prevent admin from deleting themselves
  if (admin.id === userId) {
    throw new Error("Self-deletion is not permitted.");
  }

  await db.user.delete({
    where: { id: userId }
  });
  revalidatePath("/admin", "layout");
}

/**
 * Deletes a specific card from the platform.
 */
export async function deleteAdminCard(cardId: string) {
  await ensureAdmin();
  await db.vCard.delete({
    where: { id: cardId }
  });
  revalidatePath("/admin", "layout");
}

/**
 * Aggregates platform-wide statistics for the Admin Overview.
 */
export async function getAdminStats() {
  await ensureAdmin();
  
  const [userCount, cardCount, leadCount, totalInteractions] = await Promise.all([
    db.user.count(),
    db.vCard.count(),
    db.lead.count(),
    db.vCard.aggregate({
      _sum: {
        totalViews: true
      }
    })
  ]);

  return {
    users: userCount,
    cards: cardCount,
    leads: leadCount,
    interactions: totalInteractions._sum.totalViews ?? 0
  };
}

/**
 * Fetches recent platform activity (latest cards and leads).
 */
export async function getAdminRecentActivity() {
  await ensureAdmin();

  const [recentCards, recentLeads] = await Promise.all([
    db.vCard.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } }
      }
    }),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        vcard: { select: { firstName: true, lastName: true } }
      }
    })
  ]);

  // Merge and sort by date
  const activity = [
    ...recentCards.map(c => ({
      id: c.id,
      type: "CARD_CREATED" as const,
      user: c.user.name ?? c.user.email ?? "Anonymous",
      target: `${c.firstName} ${c.lastName}`,
      date: c.createdAt
    })),
    ...recentLeads.map(l => ({
      id: l.id,
      type: "LEAD_CAPTURED" as const,
      user: l.name,
      target: `for ${l.vcard.firstName} ${l.vcard.lastName}`,
      date: l.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);

  return activity;
}

export async function bulkDeleteUsers(userIds: string[]) {
  await ensureAdmin();

  await db.user.deleteMany({
    where: { id: { in: userIds } }
  });
  
  revalidatePath("/admin", "layout");
}


export async function bulkUpdateUserRoles(userIds: string[], role: "ADMIN" | "USER") {
  await ensureAdmin();

  await db.user.updateMany({
    where: { id: { in: userIds } },
    data: { role }
  });
  
  revalidatePath("/admin", "layout");
}

/**
 * Fetches the global platform settings.
 */
export async function getSystemSettings() {
  await ensureAdmin();
  
  let settings = await db.systemSettings.findUnique({
    where: { id: "global" }
  });

  // Initialize if not exists
  if (!settings) {
    settings = await db.systemSettings.create({
      data: { id: "global" }
    });
  }

  return settings;
}

/**
 * Updates global platform settings.
 */
export async function updateSystemSettings(data: any) {
  await ensureAdmin();

  const settings = await db.systemSettings.upsert({
    where: { id: "global" },
    update: data,
    create: { id: "global", ...data }
  });

  revalidatePath("/admin/settings");
  return settings;
}
