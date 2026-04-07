import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import CardEditorClient from "./CardEditorClient";
import styles from "../../dashboard.module.css";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const card = await db.vCard.findUnique({ where: { id }, select: { firstName: true, lastName: true } });
  if (!card) return { title: "Card Not Found" };
  return { title: `Editing ${card.firstName} ${card.lastName}` };
}

export default async function CardEditorPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;
  const card = await db.vCard.findUnique({
    where: { id },
    include: {
      phones: true,
      emails: true,
      addresses: true,
      websites: true,
      socialLinks: { orderBy: { order: "asc" } },
      paymentLinks: { orderBy: { order: "asc" } },
      actionLinks: { orderBy: { order: "asc" } },
    },
  });

  if (!card || card.userId !== session.user.id) notFound();

  const displayName = card.displayName ?? `${card.firstName} ${card.lastName}`;

  return (
    <>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className={styles.btnSecondary} style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Editing: {displayName}</h1>
            <p className={styles.pageSubtitle}>
              {card.isPublished
                ? `🟢 Live at neonglass.me/${card.slug}`
                : `⚫ Draft · not publicly visible`}
            </p>
          </div>
        </div>
        <a
          href={`/${card.slug}`}
          target="_blank"
          className={styles.btnSecondary}
          style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <ExternalLink size={15} /> View Card
        </a>
      </div>

      <CardEditorClient card={card} />
    </>
  );
}
