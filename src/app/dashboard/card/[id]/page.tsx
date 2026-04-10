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

  return <CardEditorClient card={card} />;
}
