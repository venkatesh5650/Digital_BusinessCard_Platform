"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ─── AUTH ─────────────────────────────────────────────────────────
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await db.user.create({ data: { name, email, password: hashed } });

  redirect("/auth/signin?registered=1");
}

// ─── CARD CRUD ────────────────────────────────────────────────────
function normalizeSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "my-card";
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = normalizeSlug(name);
  let candidate = base;
  let suffix = 2;

  while (await db.vCard.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createCard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = session.user;
  const slug = await generateUniqueSlug(user.name ?? "my-card");

  const card = await db.vCard.create({
    data: {
      userId: user.id!,
      firstName: user.name?.split(" ")[0] ?? "Your",
      lastName: user.name?.split(" ").slice(1).join(" ") ?? "Name",
      jobTitle: "Your Job Title",
      slug,
      isPublished: false,
    },
  });

  redirect(`/dashboard/card/${card.id}`);
}

export async function updateCard(cardId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) {
    return { error: "Card not found." };
  }

  const newSlug = (formData.get("slug") as string)?.toLowerCase().replace(/[^a-z0-9-]/g, "");
  
  // Check slug uniqueness (ignoring current card)
  if (newSlug && newSlug !== card.slug) {
    const conflict = await db.vCard.findUnique({ where: { slug: newSlug } });
    if (conflict) return { error: "This URL slug is already taken. Please choose another." };
  }

  await db.vCard.update({
    where: { id: cardId },
    data: {
      firstName: (formData.get("firstName") as string) || card.firstName,
      lastName: (formData.get("lastName") as string) || card.lastName,
      displayName: (formData.get("displayName") as string) || null,
      jobTitle: (formData.get("jobTitle") as string) || card.jobTitle,
      headline: (formData.get("headline") as string) || null,
      bio: (formData.get("bio") as string) || null,
      pronouns: (formData.get("pronouns") as string) || null,
      avatarUrl: (formData.get("avatarUrl") as string) || null,
      companyName: (formData.get("companyName") as string) || null,
      companyRole: (formData.get("companyRole") as string) || null,
      companyWebsite: (formData.get("companyWebsite") as string) || null,
      companyTagline: (formData.get("companyTagline") as string) || null,
      companyLogoUrl: (formData.get("companyLogoUrl") as string) || null,
      coverImageUrl: (formData.get("coverImageUrl") as string) || null,
      slug: newSlug || card.slug,
      isPublished: formData.get("isPublished") === "true",
      leadCaptureEnabled: formData.get("leadCaptureEnabled") === "true",
      vcfDownloadEnabled: formData.get("vcfDownloadEnabled") === "true",
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
    },
  });

  revalidatePath(`/dashboard/card/${cardId}`);
  revalidatePath(`/${newSlug || card.slug}`);
  return { success: true };
}

export async function togglePublish(cardId: string, isPublished: boolean) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  await db.vCard.update({ where: { id: cardId }, data: { isPublished } });
  revalidatePath("/dashboard");
  revalidatePath(`/${card.slug}`);
  return { success: true };
}

export async function deleteCard(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  await db.vCard.delete({ where: { id: cardId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ─── PHONE ENTRIES ────────────────────────────────────────────────
export async function upsertPhone(
  cardId: string,
  data: { id?: string; type: string; number: string; label?: string; whatsapp?: boolean; sms?: boolean; isPrimary?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.phoneEntry.update({
      where: { id: data.id },
      data: { type: data.type, number: data.number, label: data.label, whatsapp: data.whatsapp ?? false, sms: data.sms ?? true, isPrimary: data.isPrimary ?? false },
    });
  } else {
    await db.phoneEntry.create({
      data: { vcardId: cardId, type: data.type, number: data.number, label: data.label, whatsapp: data.whatsapp ?? false, sms: data.sms ?? true, isPrimary: data.isPrimary ?? false },
    });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deletePhone(cardId: string, phoneId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.phoneEntry.delete({ where: { id: phoneId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── EMAIL ENTRIES ────────────────────────────────────────────────
export async function upsertEmail(
  cardId: string,
  data: { id?: string; type: string; address: string; label?: string; isPrimary?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.emailEntry.update({ where: { id: data.id }, data: { type: data.type, address: data.address, label: data.label, isPrimary: data.isPrimary ?? false } });
  } else {
    await db.emailEntry.create({ data: { vcardId: cardId, type: data.type, address: data.address, label: data.label, isPrimary: data.isPrimary ?? false } });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deleteEmail(cardId: string, emailId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.emailEntry.delete({ where: { id: emailId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── SOCIAL LINKS ──────────────────────────────────────────────────
export async function upsertSocial(
  cardId: string,
  data: { id?: string; platform: string; url: string; handle?: string; order?: number; isVisible?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.socialLink.update({ where: { id: data.id }, data: { platform: data.platform, url: data.url, handle: data.handle, order: data.order ?? 0, isVisible: data.isVisible ?? true } });
  } else {
    await db.socialLink.create({ data: { vcardId: cardId, platform: data.platform, url: data.url, handle: data.handle, order: data.order ?? 0, isVisible: data.isVisible ?? true } });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deleteSocial(cardId: string, socialId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.socialLink.delete({ where: { id: socialId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── ADDRESS ENTRIES ──────────────────────────────────────────────
export async function upsertAddress(
  cardId: string,
  data: { id?: string; type: string; label?: string; street?: string; city?: string; state?: string; postalCode?: string; country?: string; mapUrl?: string }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.addressEntry.update({
      where: { id: data.id },
      data: {
        type: data.type,
        label: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        mapUrl: data.mapUrl,
      },
    });
  } else {
    await db.addressEntry.create({
      data: {
        vcardId: cardId,
        type: data.type,
        label: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        mapUrl: data.mapUrl,
      },
    });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deleteAddress(cardId: string, addressId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.addressEntry.delete({ where: { id: addressId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── WEBSITE ENTRIES ──────────────────────────────────────────────
export async function upsertWebsite(
  cardId: string,
  data: { id?: string; label: string; url: string; featured?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.websiteEntry.update({
      where: { id: data.id },
      data: { label: data.label, url: data.url, featured: data.featured ?? false },
    });
  } else {
    await db.websiteEntry.create({
      data: { vcardId: cardId, label: data.label, url: data.url, featured: data.featured ?? false },
    });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deleteWebsite(cardId: string, websiteId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.websiteEntry.delete({ where: { id: websiteId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── PAYMENT LINKS ────────────────────────────────────────────────
export async function upsertPayment(
  cardId: string,
  data: { id?: string; platform: string; url: string; label?: string; note?: string; order?: number; isVisible?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.paymentLink.update({
      where: { id: data.id },
      data: {
        platform: data.platform,
        url: data.url,
        label: data.label,
        note: data.note,
        order: data.order ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  } else {
    await db.paymentLink.create({
      data: {
        vcardId: cardId,
        platform: data.platform,
        url: data.url,
        label: data.label,
        note: data.note,
        order: data.order ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deletePayment(cardId: string, paymentId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.paymentLink.delete({ where: { id: paymentId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── ACTION LINKS ─────────────────────────────────────────────────
export async function upsertAction(
  cardId: string,
  data: { id?: string; platform: string; url: string; label: string; subtitle?: string; icon?: string; color?: string; order?: number; isVisible?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };

  if (data.id) {
    await db.actionLink.update({
      where: { id: data.id },
      data: {
        platform: data.platform,
        url: data.url,
        label: data.label,
        subtitle: data.subtitle,
        icon: data.icon,
        color: data.color,
        order: data.order ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  } else {
    await db.actionLink.create({
      data: {
        vcardId: cardId,
        platform: data.platform,
        url: data.url,
        label: data.label,
        subtitle: data.subtitle,
        icon: data.icon,
        color: data.color,
        order: data.order ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

export async function deleteAction(cardId: string, actionId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const card = await db.vCard.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== session.user.id) return { error: "Not found." };
  await db.actionLink.delete({ where: { id: actionId } });
  revalidatePath(`/dashboard/card/${cardId}`);
  return { success: true };
}

// ─── LEAD CAPTURE ─────────────────────────────────────────────────
export async function captureLead(vcardId: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return { error: "Name is required." };

  await db.lead.create({
    data: {
      vcardId,
      name,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      company: formData.get("company") as string | null,
      jobTitle: formData.get("jobTitle") as string | null,
      note: formData.get("note") as string | null,
    }
  });

  await db.vCard.update({
    where: { id: vcardId },
    data: { leadsCollected: { increment: 1 } }
  });

  return { success: true };
}
