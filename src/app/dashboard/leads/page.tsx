import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import LeadsClient from "./LeadsClient";

export const metadata = { title: "Leads — NeonGlass" };

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Fetch all leads for all cards owned by this user
  const leads = await db.lead.findMany({
    where: { vcard: { userId: session.user.id } },
    include: { vcard: { select: { firstName: true, lastName: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Fetch card names for filter dropdown
  const cards = await db.vCard.findMany({
    where: { userId: session.user.id },
    select: { id: true, firstName: true, lastName: true, slug: true },
  });

  const serialized = leads.map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    company: l.company,
    jobTitle: l.jobTitle,
    note: l.note,
    createdAt: l.createdAt.toISOString(),
    cardName: `${l.vcard.firstName} ${l.vcard.lastName}`,
    cardSlug: l.vcard.slug,
  }));

  const cardOptions = cards.map(c => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    slug: c.slug,
  }));

  return <LeadsClient leads={serialized} cards={cardOptions} />;
}
