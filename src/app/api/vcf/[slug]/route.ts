import { NextRequest, NextResponse } from "next/server";
import { getCardBySlug } from "@/lib/db";

function escapeVCardValue(value: string | undefined | null): string {
  // Convert null or undefined to empty string immediately
  if (value == null) return ""; // This catches both null and undefined

  // Ensure it's a string (in case someone passes number, boolean, etc.)
  const str = String(value);

  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card || !card.isPublished || !card.vcfDownloadEnabled) {
    return new NextResponse("Not Found or Disabled", { status: 404 });
  }

  const vcfLines: string[] = [];
  vcfLines.push("BEGIN:VCARD");
  vcfLines.push("VERSION:3.0");

  const lastName = escapeVCardValue(card.lastName);
  const firstName = escapeVCardValue(card.firstName);
  vcfLines.push(`N:${lastName};${firstName};;;`);

  const formattedName = escapeVCardValue(
    card.displayName ?? `${card.firstName} ${card.lastName}`,
  );
  vcfLines.push(`FN:${formattedName}`);

  if (card.jobTitle) vcfLines.push(`TITLE:${escapeVCardValue(card.jobTitle)}`);
  if (card.companyName)
    vcfLines.push(`ORG:${escapeVCardValue(card.companyName)}`);
  if (card.bio || card.headline)
    vcfLines.push(`NOTE:${escapeVCardValue(card.bio ?? card.headline)}`);

  for (const phone of card.phones) {
    const typeArgs: string[] = [];
    if (phone.type === "work") typeArgs.push("type=WORK");
    else if (phone.type === "mobile") typeArgs.push("type=CELL");
    else if (phone.type === "home") typeArgs.push("type=HOME");
    else if (phone.type === "fax") typeArgs.push("type=FAX");
    if (phone.isPrimary) typeArgs.push("type=PREF");
    typeArgs.push("type=VOICE");
    const prefix = typeArgs.length > 0 ? `;${typeArgs.join(";")}` : "";
    vcfLines.push(`TEL${prefix}:${escapeVCardValue(phone.number)}`);
  }

  for (const email of card.emails) {
    const typeArgs: string[] = [];
    if (email.type === "work") typeArgs.push("type=WORK");
    else if (email.type === "personal") typeArgs.push("type=HOME");
    if (email.isPrimary) typeArgs.push("type=PREF");
    const prefix = typeArgs.length > 0 ? `;${typeArgs.join(";")}` : "";
    vcfLines.push(
      `EMAIL;type=INTERNET${prefix}:${escapeVCardValue(email.address)}`,
    );
  }

  for (const addr of card.addresses) {
    const typeArgs: string[] = [];
    if (addr.type === "work") typeArgs.push("type=WORK");
    else if (addr.type === "home") typeArgs.push("type=HOME");
    const val = `;;${escapeVCardValue(addr.street)};${escapeVCardValue(addr.city)};${escapeVCardValue(addr.state)};${escapeVCardValue(addr.postalCode)};${escapeVCardValue(addr.country)}`;
    const prefix = typeArgs.length > 0 ? `;${typeArgs.join(";")}` : "";
    vcfLines.push(`ADR${prefix}:${val}`);
  }

  for (const web of card.websites) {
    vcfLines.push(`URL:${escapeVCardValue(web.url)}`);
  }

  const visibleSocials = card.socialLinks
    .filter((l) => l.isVisible)
    .sort((a, b) => a.order - b.order);
  for (const social of visibleSocials) {
    vcfLines.push(`URL:${escapeVCardValue(social.url)}`);
  }

  vcfLines.push("END:VCARD");
  const vcfString = vcfLines.join("\n") + "\n";

  // Increment VCF download count (non-blocking)
  const { db } = await import("@/lib/db");
  db.vCard
    .update({
      where: { id: card.id },
      data: { vcfDownloads: { increment: 1 } },
    })
    .catch(console.error);

  const filename =
    `${card.firstName}_${card.lastName}`.replace(/\s+/g, "_") + ".vcf";
  return new NextResponse(vcfString, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
