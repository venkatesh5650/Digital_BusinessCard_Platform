import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs"; // SQLite requires Node.js runtime

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await db.vCard.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
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
    },
  });

  const totalViews = cards.reduce((s, c) => s + c.totalViews, 0);
  const totalClicks = cards.reduce((s, c) => s + c.totalClicks, 0);
  const totalLeads = cards.reduce((s, c) => s + c.leadsCollected, 0);

  return NextResponse.json({
    cards,
    totalViews,
    totalClicks,
    totalLeads,
    totalCards: cards.length,
    lastUpdated: new Date().toISOString(),
  });
}
