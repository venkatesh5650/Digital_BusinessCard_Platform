import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardBySlug } from "@/lib/db";
import PublicCard from "@/components/card/PublicCard";
import { dbCardToVCard } from "@/lib/cardMapper";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbCard = await getCardBySlug(slug);
  if (!dbCard || !dbCard.isPublished) {
    return { title: "Card Not Found" };
  }
  const name = dbCard.displayName ?? `${dbCard.firstName} ${dbCard.lastName}`;
  return {
    title: `${name} — ${dbCard.jobTitle}`,
    description: dbCard.seoDescription ?? dbCard.bio ?? undefined,
    openGraph: {
      title: dbCard.seoTitle ?? `${name} — ${dbCard.jobTitle}`,
      description: dbCard.seoDescription ?? dbCard.bio ?? undefined,
      type: "profile",
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;
  const dbCard = await getCardBySlug(slug);

  if (!dbCard || !dbCard.isPublished) {
    notFound();
  }


  const card = dbCardToVCard(dbCard);
  return <PublicCard card={card} />;
}
