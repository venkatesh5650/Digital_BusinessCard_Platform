import { auth } from "@/lib/auth";
import { getCardsByUser } from "@/lib/db";
import DashboardClient, { type DashboardStats } from "./DashboardClient";

export const metadata = { title: "Dashboard | Imprint" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const cards = await getCardsByUser(userId);

  const firstName = session!.user!.name?.split(" ")[0] ?? "there";

  // Explicit serialization — Prisma Dates → ISO strings for client boundary
  const initialStats: DashboardStats = {
    cards: cards.map((c) => ({
      id: c.id,
      slug: c.slug,
      firstName: c.firstName,
      lastName: c.lastName,
      displayName: c.displayName,
      jobTitle: c.jobTitle,
      avatarUrl: c.avatarUrl,
      isPublished: c.isPublished,
      totalViews: c.totalViews,
      totalClicks: c.totalClicks,
      leadsCollected: c.leadsCollected,
      layout: c.layout,
      colorPrimary: c.colorPrimary,
    })),
    totalViews: cards.reduce((s, c) => s + c.totalViews, 0),
    totalClicks: cards.reduce((s, c) => s + c.totalClicks, 0),
    totalLeads: cards.reduce((s, c) => s + c.leadsCollected, 0),
    totalCards: cards.length,
    lastUpdated: new Date().toISOString(),
  };

  return <DashboardClient firstName={firstName} initialStats={initialStats} />;
}
