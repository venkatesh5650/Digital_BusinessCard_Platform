import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardBySlug } from "@/lib/db";
import PublicCard from "@/components/card/PublicCard";
import { dbCardToVCard } from "@/lib/cardMapper";
import { auth } from "@/lib/auth";
import { ShieldCheck } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbCard = await getCardBySlug(slug);
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (!dbCard || (!dbCard.isPublished && !isAdmin)) {
    return { title: "Card Not Found" };
  }
  const name = dbCard.displayName ?? `${dbCard.firstName} ${dbCard.lastName}`;
  return {
    title: `${name} — ${dbCard.jobTitle} ${!dbCard.isPublished ? "(Admin Preview)" : ""}`,
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
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (!dbCard || (!dbCard.isPublished && !isAdmin)) {
    notFound();
  }

  const card = dbCardToVCard(dbCard);
  
  return (
    <>
      <PublicCard card={card} />
      
      {/* Admin Preview Indicator */}
      {!dbCard.isPublished && isAdmin && (
        <div style={{ 
          position: "fixed", 
          bottom: "24px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          zIndex: 9999,
          background: "rgba(20, 20, 25, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          padding: "10px 20px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#3b82f6",
          fontSize: "13px",
          fontWeight: 700,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.2)",
          pointerEvents: "none",
          animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <ShieldCheck size={18} />
          ADMIN PREVIEW: UNPUBLISHED CARD
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideUp {
              from { transform: translate(-50%, 40px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}} />
        </div>
      )}
    </>
  );
}
