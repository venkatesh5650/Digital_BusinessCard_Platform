"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateCard,
  upsertPhone,
  deletePhone,
  upsertEmail,
  deleteEmail,
  upsertAddress,
  deleteAddress,
  upsertWebsite,
  deleteWebsite,
  upsertSocial,
  deleteSocial,
  upsertPayment,
  deletePayment,
  upsertAction,
  deleteAction,
  togglePublish,
  deleteCard,
} from "@/lib/actions";
import { Trash2, Plus, Eye, EyeOff, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "../../dashboard.module.css";
import PublicCard from "@/components/card/PublicCard";
import type { VCard } from "@/types";

type Phone = { id: string; type: string; number: string; label: string | null; whatsapp: boolean; sms: boolean; isPrimary: boolean };
type Email = { id: string; type: string; address: string; label: string | null; isPrimary: boolean };
type Address = { id: string; type: string; label: string | null; street: string | null; city: string | null; state: string | null; postalCode: string | null; country: string | null; mapUrl: string | null };
type Website = { id: string; label: string; url: string; featured: boolean };
type Social = { id: string; platform: string; url: string; handle: string | null; order: number; isVisible: boolean };
type Payment = { id: string; platform: string; url: string; label: string | null; note: string | null; order: number; isVisible: boolean };
type Action = { id: string; platform: string; url: string; label: string; subtitle: string | null; icon: string | null; color: string | null; order: number; isVisible: boolean };

type Card = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  jobTitle: string;
  headline: string | null;
  bio: string | null;
  pronouns: string | null;
  avatarUrl: string | null;
  companyName: string | null;
  companyRole: string | null;
  companyWebsite: string | null;
  companyTagline: string | null;
  isPublished: boolean;
  leadCaptureEnabled: boolean;
  vcfDownloadEnabled: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  phones: Phone[];
  emails: Email[];
  addresses: Address[];
  websites: Website[];
  socialLinks: Social[];
  paymentLinks: Payment[];
  actionLinks: Action[];
};

// ── Toggle Component ──────────────────────────────────────────────
function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className={styles.toggleSlider} />
    </label>
  );
}

// ── Avatar Uploader Component ─────────────────────────────────────
function AvatarUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct Base64 compression on the client
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width = Math.round((width * MAX_HEIGHT) / height); height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          onChange(canvas.toDataURL("image/jpeg", 0.8)); // Output standard lightweight format
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      {value ? (
        <img src={value} alt="Avatar Preview" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #e1e4e8", flexShrink: 0 }} />
      ) : (
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f1f3f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px dashed #ccc" }}>
          <span style={{ fontSize: 24, color: "#9ca3af" }}>👤</span>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" onClick={() => setMode("upload")} style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, background: mode === "upload" ? "#171717" : "#f1f3f4", color: mode === "upload" ? "#fff" : "#70757a", border: "none", cursor: "pointer" }}>Upload File</button>
          <button type="button" onClick={() => setMode("url")} style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, background: mode === "url" ? "#171717" : "#f1f3f4", color: mode === "url" ? "#fff" : "#70757a", border: "none", cursor: "pointer" }}>Web URL</button>
        </div>
        
        {mode === "url" ? (
          <input 
            value={value || ""} 
            onChange={e => onChange(e.target.value)} 
            placeholder="https://example.com/photo.jpg" 
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e1e4e8", fontSize: "0.9rem" }}
          />
        ) : (
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            style={{ width: "100%", fontSize: "0.85rem", color: "#70757a", padding: "4px 0" }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Editor Component ─────────────────────────────────────────
export default function CardEditorClient({ card }: { card: Card }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Profile fields
  const [firstName, setFirstName] = useState(card.firstName);
  const [lastName, setLastName] = useState(card.lastName);
  const [displayName, setDisplayName] = useState(card.displayName ?? "");
  const [jobTitle, setJobTitle] = useState(card.jobTitle);
  const [headline, setHeadline] = useState(card.headline ?? "");
  const [bio, setBio] = useState(card.bio ?? "");
  const [pronouns, setPronouns] = useState(card.pronouns ?? "");
  const [avatarUrl, setAvatarUrl] = useState(card.avatarUrl ?? "");

  // Company fields
  const [companyName, setCompanyName] = useState(card.companyName ?? "");
  const [companyRole, setCompanyRole] = useState(card.companyRole ?? "");
  const [companyWebsite, setCompanyWebsite] = useState(card.companyWebsite ?? "");
  const [companyTagline, setCompanyTagline] = useState(card.companyTagline ?? "");

  // Settings
  const [slug, setSlug] = useState(card.slug);
  const [isPublished, setIsPublished] = useState(card.isPublished);
  const [leadCapture, setLeadCapture] = useState(card.leadCaptureEnabled);
  const [vcfDownload, setVcfDownload] = useState(card.vcfDownloadEnabled);
  const [seoTitle, setSeoTitle] = useState(card.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(card.seoDescription ?? "");

  // Sub-lists
  const [phones, setPhones] = useState<Phone[]>(card.phones);
  const [emails, setEmails] = useState<Email[]>(card.emails);
  const [addresses, setAddresses] = useState<Address[]>(card.addresses);
  const [websites, setWebsites] = useState<Website[]>(card.websites);
  const [socials, setSocials] = useState<Social[]>(card.socialLinks);
  const [payments, setPayments] = useState<Payment[]>(card.paymentLinks);
  const [actions, setActions] = useState<Action[]>(card.actionLinks);

  // New entry temp state
  const [newPhone, setNewPhone] = useState({ type: "mobile", number: "", label: "", whatsapp: false });
  const [newEmail, setNewEmail] = useState({ type: "work", address: "", label: "" });
  const [newAddress, setNewAddress] = useState({ type: "work", label: "", street: "", city: "", state: "", postalCode: "", country: "", mapUrl: "" });
  const [newWebsite, setNewWebsite] = useState({ label: "", url: "", featured: false });
  const [newSocial, setNewSocial] = useState({ platform: "linkedin", url: "", handle: "" });
  const [newPayment, setNewPayment] = useState({ platform: "paypal", url: "", label: "", note: "" });
  const [newAction, setNewAction] = useState({ platform: "calendly", url: "", label: "", subtitle: "" });

  function showFeedback(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  }

  // ── Save profile ──
  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("firstName", firstName);
      fd.append("lastName", lastName);
      fd.append("displayName", displayName);
      fd.append("jobTitle", jobTitle);
      fd.append("headline", headline);
      fd.append("bio", bio);
      fd.append("pronouns", pronouns);
      fd.append("avatarUrl", avatarUrl);
      fd.append("companyName", companyName);
      fd.append("companyRole", companyRole);
      fd.append("companyWebsite", companyWebsite);
      fd.append("companyTagline", companyTagline);
      fd.append("slug", slug);
      fd.append("isPublished", isPublished.toString());
      fd.append("leadCaptureEnabled", leadCapture.toString());
      fd.append("vcfDownloadEnabled", vcfDownload.toString());
      fd.append("seoTitle", seoTitle);
      fd.append("seoDescription", seoDescription);

      const result = await updateCard(card.id, fd);
      if (result?.error) {
        showFeedback("error", result.error);
      } else {
        showFeedback("success", "Card saved successfully!");
        setIsPublished(isPublished);
      }
    });
  }

  // ── Publish toggle ──
  function handlePublishToggle(val: boolean) {
    setIsPublished(val);
    startTransition(async () => {
      const result = await togglePublish(card.id, val);
      if (result?.error) showFeedback("error", result.error);
      else showFeedback("success", val ? "Card is now Live! 🚀" : "Card set to Draft.");
    });
  }

  // ── Delete card ──
  function handleDelete() {
    if (!confirm("Are you sure you want to delete this card? This cannot be undone.")) return;
    startTransition(async () => { await deleteCard(card.id); });
  }

  function handlePreviewClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isPublished) {
      e.preventDefault();
      setShowDraftModal(true);
    }
  }

  // ── Phone handlers ──
  function handleAddPhone() {
    if (!newPhone.number) return;
    startTransition(async () => {
      const result = await upsertPhone(card.id, newPhone);
      if (result?.error) { showFeedback("error", result.error); return; }
      setPhones(prev => [...prev, { id: Date.now().toString(), ...newPhone, sms: true, isPrimary: prev.length === 0, label: newPhone.label || null }]);
      setNewPhone({ type: "mobile", number: "", label: "", whatsapp: false });
      router.refresh();
    });
  }

  function handleDeletePhone(phoneId: string) {
    startTransition(async () => {
      await deletePhone(card.id, phoneId);
      setPhones(prev => prev.filter(p => p.id !== phoneId));
    });
  }

  // ── Email handlers ──
  function handleAddEmail() {
    if (!newEmail.address) return;
    startTransition(async () => {
      const result = await upsertEmail(card.id, newEmail);
      if (result?.error) { showFeedback("error", result.error); return; }
      setEmails(prev => [...prev, { id: Date.now().toString(), ...newEmail, isPrimary: prev.length === 0, label: newEmail.label || null }]);
      setNewEmail({ type: "work", address: "", label: "" });
      router.refresh();
    });
  }

  function handleDeleteEmail(emailId: string) {
    startTransition(async () => {
      await deleteEmail(card.id, emailId);
      setEmails(prev => prev.filter(e => e.id !== emailId));
    });
  }

  // ── Social handlers ──
  function handleAddSocial() {
    if (!newSocial.url) return;
    startTransition(async () => {
      const result = await upsertSocial(card.id, { ...newSocial, order: socials.length, isVisible: true });
      if (result?.error) { showFeedback("error", result.error); return; }
      setSocials(prev => [...prev, { id: Date.now().toString(), ...newSocial, order: prev.length, isVisible: true, handle: newSocial.handle || null }]);
      setNewSocial({ platform: "linkedin", url: "", handle: "" });
      router.refresh();
    });
  }

  function handleDeleteSocial(socialId: string) {
    startTransition(async () => {
      await deleteSocial(card.id, socialId);
      setSocials(prev => prev.filter(s => s.id !== socialId));
    });
  }

  // ── Address handlers ──
  function handleAddAddress() {
    if (!newAddress.city && !newAddress.street && !newAddress.mapUrl) return;
    startTransition(async () => {
      const payload = { ...newAddress };
      const result = await upsertAddress(card.id, payload);
      if (result?.error) { showFeedback("error", result.error); return; }
      setAddresses(prev => [...prev, { id: Date.now().toString(), ...payload, label: payload.label || null, street: payload.street || null, city: payload.city || null, state: payload.state || null, postalCode: payload.postalCode || null, country: payload.country || null, mapUrl: payload.mapUrl || null }]);
      setNewAddress({ type: "work", label: "", street: "", city: "", state: "", postalCode: "", country: "", mapUrl: "" });
      router.refresh();
    });
  }

  function handleDeleteAddress(addressId: string) {
    startTransition(async () => {
      await deleteAddress(card.id, addressId);
      setAddresses(prev => prev.filter(a => a.id !== addressId));
    });
  }

  // ── Website handlers ──
  function handleAddWebsite() {
    if (!newWebsite.label || !newWebsite.url) return;
    startTransition(async () => {
      const result = await upsertWebsite(card.id, newWebsite);
      if (result?.error) { showFeedback("error", result.error); return; }
      setWebsites(prev => [...prev, { id: Date.now().toString(), ...newWebsite }]);
      setNewWebsite({ label: "", url: "", featured: false });
      router.refresh();
    });
  }

  function handleDeleteWebsite(websiteId: string) {
    startTransition(async () => {
      await deleteWebsite(card.id, websiteId);
      setWebsites(prev => prev.filter(w => w.id !== websiteId));
    });
  }

  // ── Payment handlers ──
  function handleAddPayment() {
    if (!newPayment.url) return;
    startTransition(async () => {
      const result = await upsertPayment(card.id, { ...newPayment, order: payments.length, isVisible: true });
      if (result?.error) { showFeedback("error", result.error); return; }
      setPayments(prev => [...prev, { id: Date.now().toString(), ...newPayment, label: newPayment.label || null, note: newPayment.note || null, order: prev.length, isVisible: true }]);
      setNewPayment({ platform: "paypal", url: "", label: "", note: "" });
      router.refresh();
    });
  }

  function handleDeletePayment(paymentId: string) {
    startTransition(async () => {
      await deletePayment(card.id, paymentId);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
    });
  }

  // ── Action handlers ──
  function handleAddAction() {
    if (!newAction.url || !newAction.label) return;
    startTransition(async () => {
      const result = await upsertAction(card.id, { ...newAction, order: actions.length, isVisible: true });
      if (result?.error) { showFeedback("error", result.error); return; }
      setActions(prev => [...prev, { id: Date.now().toString(), ...newAction, subtitle: newAction.subtitle || null, icon: null, color: null, order: prev.length, isVisible: true }]);
      setNewAction({ platform: "calendly", url: "", label: "", subtitle: "" });
      router.refresh();
    });
  }

  function handleDeleteAction(actionId: string) {
    startTransition(async () => {
      await deleteAction(card.id, actionId);
      setActions(prev => prev.filter(a => a.id !== actionId));
    });
  }

  const SOCIAL_PLATFORMS = ["linkedin", "twitter", "instagram", "github", "youtube", "facebook", "telegram", "threads", "tiktok", "pinterest", "snapchat", "discord"];
  const PAYMENT_PLATFORMS = ["paypal", "stripe", "venmo", "gpay", "upi", "buymeacoffee", "patreon"];
  const ACTION_PLATFORMS = ["calendly", "zoom", "meet", "booking", "typeform", "shopify", "custom"];
  const livePreviewCard: VCard = {
    id: card.id,
    userId: "preview-user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: firstName || "Your",
      lastName: lastName || "Name",
      displayName: displayName || undefined,
      jobTitle: jobTitle || "Your Job Title",
      headline: headline || undefined,
      bio: bio || undefined,
      pronouns: pronouns || undefined,
      avatarUrl: avatarUrl || "",
      company: companyName
        ? {
            name: companyName,
            role: companyRole || undefined,
            website: companyWebsite || undefined,
            tagline: companyTagline || undefined,
          }
        : undefined,
    },
    phones: phones.map((p) => ({
      id: p.id,
      type: p.type as VCard["phones"][number]["type"],
      number: p.number,
      label: p.label || undefined,
      whatsapp: p.whatsapp,
      sms: p.sms,
      isPrimary: p.isPrimary,
    })),
    emails: emails.map((e) => ({
      id: e.id,
      type: e.type as VCard["emails"][number]["type"],
      address: e.address,
      label: e.label || undefined,
      isPrimary: e.isPrimary,
    })),
    addresses: addresses.map((a) => ({
      id: a.id,
      type: a.type as VCard["addresses"][number]["type"],
      label: a.label || undefined,
      street: a.street || undefined,
      city: a.city || undefined,
      state: a.state || undefined,
      postalCode: a.postalCode || undefined,
      country: a.country || undefined,
      mapUrl: a.mapUrl || undefined,
    })),
    websites: websites.map((w) => ({
      id: w.id,
      label: w.label,
      url: w.url,
      featured: w.featured,
    })),
    socialLinks: socials.map((s, idx) => ({
      id: s.id,
      platform: s.platform as VCard["socialLinks"][number]["platform"],
      url: s.url,
      handle: s.handle || undefined,
      order: s.order ?? idx,
      isVisible: s.isVisible,
    })),
    paymentLinks: payments.map((p, idx) => ({
      id: p.id,
      platform: p.platform as VCard["paymentLinks"][number]["platform"],
      url: p.url,
      label: p.label || undefined,
      note: p.note || undefined,
      order: p.order ?? idx,
      isVisible: p.isVisible,
    })),
    actionLinks: actions.map((a, idx) => ({
      id: a.id,
      platform: a.platform as VCard["actionLinks"][number]["platform"],
      url: a.url,
      label: a.label,
      subtitle: a.subtitle || undefined,
      icon: a.icon || undefined,
      color: a.color || undefined,
      order: a.order ?? idx,
      isVisible: a.isVisible,
    })),
    mediaEmbeds: [],
    theme: {
      preset: "ocean-cyan",
      backgroundStyle: "gradient",
      colorPrimary: "#171717",
      colorSecondary: "#3b82f6",
      colorAccent: "#2563eb",
      textColor: "#171717",
      subtextColor: "#52525b",
      layout: "classic",
      headerGlass: false,
      avatarNeonRing: false,
      particles: false,
    },
    settings: {
      slug: slug || card.slug,
      isPublished,
      leadCaptureEnabled: leadCapture,
      vcfDownloadEnabled: vcfDownload,
      showViewCount: false,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      language: "en",
    },
    analytics: {
      totalViews: 0,
      uniqueViews: 0,
      totalClicks: 0,
      leadsCollected: 0,
      vcfDownloads: 0,
    },
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className={styles.btnSecondary} style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Editing: {displayName || `${firstName} ${lastName}`}</h1>
            <p className={styles.pageSubtitle}>
              {isPublished
                ? `🟢 Live at neonglass.me/${slug}`
                : `⚫ Draft · not publicly visible`}
            </p>
          </div>
        </div>
        <a
          href={`/${slug}`}
          target="_blank"
          onClick={handlePreviewClick}
          className={styles.btnSecondary}
          style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <ExternalLink size={15} /> View Card
        </a>
      </div>

      <div className={styles.editorLayout}>
      {/* ── Left: Editor Panels ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Feedback */}
        {feedback && (
          <div className={feedback.type === "success" ? styles.formSuccess : styles.formError}>
            {feedback.type === "success" ? <CheckCircle size={16} /> : "⚠️"}
            {feedback.msg}
          </div>
        )}

        {/* Publish Status Banner */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 700, color: "#111", fontSize: 15 }}>
                  {isPublished ? "🟢 Live" : "⚫ Draft"}
                </div>
                <div className={styles.toggleDesc}>
                  {isPublished
                    ? `Your card is publicly visible at neonglass.me/${slug}`
                    : "Your card is hidden. Toggle to make it live."}
                </div>
              </div>
              <Toggle id="toggle-publish" checked={isPublished} onChange={handlePublishToggle} />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>👤 Profile</div>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label>First Name *</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" />
              </div>
              <div className={styles.formField}>
                <label>Last Name *</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Kumar" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Jane Doe (optional)" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Job Title *</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Founder & CEO" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Headline</label>
                <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Building the future of IT Infrastructure" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A short description about yourself..." rows={3} />
              </div>
              <div className={styles.formField}>
                <label>Pronouns</label>
                <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="he/him" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Profile Picture / Avatar</label>
                <AvatarUploader value={avatarUrl} onChange={setAvatarUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>🏢 Company</div>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label>Company Name</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Computer Port" />
              </div>
              <div className={styles.formField}>
                <label>Your Role</label>
                <input value={companyRole} onChange={e => setCompanyRole(e.target.value)} placeholder="Founder" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Company Website</label>
                <input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="https://computerport.in" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Tagline</label>
                <input value={companyTagline} onChange={e => setCompanyTagline(e.target.value)} placeholder="Smart IT Solutions for Smart Businesses" />
              </div>
            </div>
          </div>
        </div>

        {/* Phones */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>📞 Phone Numbers</div>
            <div className={styles.entryList}>
              {phones.map(p => (
                <div key={p.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{p.number}</div>
                    <div className={styles.entryMeta}>{p.label || p.type}{p.whatsapp ? " · WhatsApp" : ""}{p.isPrimary ? " · Primary" : ""}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeletePhone(p.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Type</label>
                <select value={newPhone.type} onChange={e => setNewPhone(p => ({ ...p, type: e.target.value }))}>
                  <option value="mobile">Mobile</option>
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                  <option value="fax">Fax</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label>Number</label>
                <input value={newPhone.number} onChange={e => setNewPhone(p => ({ ...p, number: e.target.value }))} placeholder="+91-9876543210" />
              </div>
              <div className={styles.formField}>
                <label>Label (optional)</label>
                <input value={newPhone.label} onChange={e => setNewPhone(p => ({ ...p, label: e.target.value }))} placeholder="Mobile" />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddPhone} disabled={isPending || !newPhone.number}>
                  <Plus size={14} /> Add Phone
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emails */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>✉️ Email Addresses</div>
            <div className={styles.entryList}>
              {emails.map(em => (
                <div key={em.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{em.address}</div>
                    <div className={styles.entryMeta}>{em.label || em.type}{em.isPrimary ? " · Primary" : ""}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteEmail(em.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Type</label>
                <select value={newEmail.type} onChange={e => setNewEmail(em => ({ ...em, type: e.target.value }))}>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label>Email</label>
                <input value={newEmail.address} onChange={e => setNewEmail(em => ({ ...em, address: e.target.value }))} placeholder="you@company.com" type="email" />
              </div>
              <div className={styles.formField}>
                <label>Label (optional)</label>
                <input value={newEmail.label} onChange={e => setNewEmail(em => ({ ...em, label: e.target.value }))} placeholder="Work" />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddEmail} disabled={isPending || !newEmail.address}>
                  <Plus size={14} /> Add Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>🔗 Social Links</div>
            <div className={styles.entryList}>
              {socials.map(s => (
                <div key={s.id} className={styles.entryItem}>
                  {s.isVisible ? <Eye size={14} color="#2563eb" /> : <EyeOff size={14} color="#9ca3af" />}
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{s.platform}</div>
                    <div className={styles.entryMeta}>{s.handle || s.url}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteSocial(s.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Platform</label>
                <select value={newSocial.platform} onChange={e => setNewSocial(s => ({ ...s, platform: e.target.value }))}>
                  {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className={styles.formField}>
                <label>Profile URL</label>
                <input value={newSocial.url} onChange={e => setNewSocial(s => ({ ...s, url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className={styles.formField}>
                <label>Handle (optional)</label>
                <input value={newSocial.handle} onChange={e => setNewSocial(s => ({ ...s, handle: e.target.value }))} placeholder="@yourhandle" />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddSocial} disabled={isPending || !newSocial.url}>
                  <Plus size={14} /> Add Social
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>📍 Addresses</div>
            <div className={styles.entryList}>
              {addresses.map(a => (
                <div key={a.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{a.label || a.city || a.street || "Address"}</div>
                    <div className={styles.entryMeta}>{[a.street, a.city, a.country].filter(Boolean).join(", ")}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteAddress(a.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Type</label>
                <select value={newAddress.type} onChange={e => setNewAddress(v => ({ ...v, type: e.target.value }))}>
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label>Label (optional)</label>
                <input value={newAddress.label} onChange={e => setNewAddress(v => ({ ...v, label: e.target.value }))} placeholder="Head Office" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Street</label>
                <input value={newAddress.street} onChange={e => setNewAddress(v => ({ ...v, street: e.target.value }))} placeholder="Street address" />
              </div>
              <div className={styles.formField}>
                <label>City</label>
                <input value={newAddress.city} onChange={e => setNewAddress(v => ({ ...v, city: e.target.value }))} placeholder="Hyderabad" />
              </div>
              <div className={styles.formField}>
                <label>Country</label>
                <input value={newAddress.country} onChange={e => setNewAddress(v => ({ ...v, country: e.target.value }))} placeholder="India" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Map URL</label>
                <input value={newAddress.mapUrl} onChange={e => setNewAddress(v => ({ ...v, mapUrl: e.target.value }))} placeholder="https://maps.google.com/..." />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddAddress} disabled={isPending}>
                  <Plus size={14} /> Add Address
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Websites */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>🌐 Websites & Custom URLs</div>
            <div className={styles.entryList}>
              {websites.map(w => (
                <div key={w.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{w.label}</div>
                    <div className={styles.entryMeta}>{w.url}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteWebsite(w.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Label</label>
                <input value={newWebsite.label} onChange={e => setNewWebsite(v => ({ ...v, label: e.target.value }))} placeholder="Portfolio" />
              </div>
              <div className={styles.formField}>
                <label>URL</label>
                <input value={newWebsite.url} onChange={e => setNewWebsite(v => ({ ...v, url: e.target.value }))} placeholder="https://..." />
              </div>
              <div className={styles.formField}>
                <label style={{ opacity: 0 }}>feature</label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                  <input type="checkbox" checked={newWebsite.featured} onChange={e => setNewWebsite(v => ({ ...v, featured: e.target.checked }))} />
                  Mark as featured
                </label>
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddWebsite} disabled={isPending || !newWebsite.label || !newWebsite.url}>
                  <Plus size={14} /> Add Website
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Links */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>💳 Payment Links</div>
            <div className={styles.entryList}>
              {payments.map(p => (
                <div key={p.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{p.label || p.platform}</div>
                    <div className={styles.entryMeta}>{p.url}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeletePayment(p.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Platform</label>
                <select value={newPayment.platform} onChange={e => setNewPayment(v => ({ ...v, platform: e.target.value }))}>
                  {PAYMENT_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.formField}>
                <label>Label (optional)</label>
                <input value={newPayment.label} onChange={e => setNewPayment(v => ({ ...v, label: e.target.value }))} placeholder="Pay via UPI" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Payment URL</label>
                <input value={newPayment.url} onChange={e => setNewPayment(v => ({ ...v, url: e.target.value }))} placeholder="https://..." />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Note (optional)</label>
                <input value={newPayment.note} onChange={e => setNewPayment(v => ({ ...v, note: e.target.value }))} placeholder="For quick consulting payment" />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddPayment} disabled={isPending || !newPayment.url}>
                  <Plus size={14} /> Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>🚀 Action Links</div>
            <div className={styles.entryList}>
              {actions.map(a => (
                <div key={a.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{a.label}</div>
                    <div className={styles.entryMeta}>{a.url}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteAction(a.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 8 }}>
              <div className={styles.formField}>
                <label>Platform</label>
                <select value={newAction.platform} onChange={e => setNewAction(v => ({ ...v, platform: e.target.value }))}>
                  {ACTION_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.formField}>
                <label>Label</label>
                <input value={newAction.label} onChange={e => setNewAction(v => ({ ...v, label: e.target.value }))} placeholder="Book a Call" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Action URL</label>
                <input value={newAction.url} onChange={e => setNewAction(v => ({ ...v, url: e.target.value }))} placeholder="https://calendly.com/..." />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Subtitle (optional)</label>
                <input value={newAction.subtitle} onChange={e => setNewAction(v => ({ ...v, subtitle: e.target.value }))} placeholder="15-minute intro call" />
              </div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
                <button className={styles.btnPrimary} onClick={handleAddAction} disabled={isPending || !newAction.label || !newAction.url}>
                  <Plus size={14} /> Add Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>⚙️ Card Settings</div>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Card URL Slug</label>
                <input
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="ravi-kumar"
                />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>neonglass.me/{slug}</span>
              </div>
            </div>
            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Lead Capture</div>
                <div className={styles.toggleDesc}>Show a contact form to capture visitor info</div>
              </div>
              <Toggle id="lead-capture" checked={leadCapture} onChange={setLeadCapture} />
            </div>
            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>VCF Download</div>
                <div className={styles.toggleDesc}>Allow visitors to save contact to phone</div>
              </div>
              <Toggle id="vcf-download" checked={vcfDownload} onChange={setVcfDownload} />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className={styles.editorPanel}>
          <div className={styles.editorSection}>
            <div className={styles.editorSectionTitle}>🔍 SEO</div>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>SEO Title</label>
                <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Jane Doe — Marketing Director" />
              </div>
              <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Meta Description</label>
                <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} placeholder="A short description for search engines..." rows={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            id="btn-save-card"
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={isPending}
            style={{ flex: 1, padding: "14px" }}
          >
            {isPending ? "Saving…" : "💾 Save Card"}
          </button>
          <button
            id="btn-delete-card"
            className={styles.btnDanger}
            onClick={handleDelete}
            disabled={isPending}
            style={{ padding: "14px 20px" }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Right: Live Preview ── */}
      <div className={styles.previewPanel}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
          Live Preview
        </div>
        <div className={styles.previewPhoneFrame}>
          <div className={styles.previewIframe} style={{ overflow: "auto", background: "#070c17" }}>
            <PublicCard card={livePreviewCard} />
          </div>
        </div>
        <a
          href={`/${slug || card.slug}`}
          target="_blank"
          onClick={handlePreviewClick}
          className={styles.btnSecondary}
          style={{ display: "block", textAlign: "center", marginTop: 12 }}
        >
          Open in New Tab ↗
        </a>
      </div>
      </div>

      {/* ── Draft Modal ── */}
      {showDraftModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDraftModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowDraftModal(false)}>✕</button>
            <div className={styles.modalHeader}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 className={styles.modalTitle}>Card is Not Live!</h2>
              <p className={styles.modalSubtitle} style={{ marginTop: 12, lineHeight: 1.5 }}>
                Your card is currently set to <strong>Draft</strong>. You must publish it before you or anyone else can view the live link in a browser!
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              <button 
                className={styles.btnPrimary} 
                onClick={() => {
                  handlePublishToggle(true);
                  setShowDraftModal(false);
                }} 
                style={{ width: "100%", padding: "14px" }}
              >
                Make Card Live Now 🟢
              </button>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setShowDraftModal(false)} 
                style={{ width: "100%", padding: "14px" }}
              >
                Keep Editing in Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
