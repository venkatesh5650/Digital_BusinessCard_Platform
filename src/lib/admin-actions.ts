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
  revalidatePath("/admin/users");
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
  revalidatePath("/admin/users");
}

/**
 * Deletes a specific card from the platform.
 */
export async function deleteAdminCard(cardId: string) {
  await ensureAdmin();
  await db.vCard.delete({
    where: { id: cardId }
  });
  revalidatePath("/admin/cards");
}
