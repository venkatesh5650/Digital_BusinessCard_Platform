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
import { Trash2, Plus, Eye, EyeOff, CheckCircle, ArrowLeft, ExternalLink, Image as ImageIcon, User, Briefcase, Mail, Phone as PhoneIcon, Link2, MapPin, Share2, Search, Settings, Building2, FileText, Medal, X, MessageSquare, Camera, Globe, Video } from "lucide-react";
import Link from "next/link";
import styles from "../../dashboard.module.css";
import PublicCard from "@/components/card/PublicCard";
import { PlatformIcon } from "@/components/card/SocialIcon";
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
  companyLogoUrl: string | null;
  coverImageUrl: string | null;
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
function AvatarUploader({ value, onChange, isBanner = false }: { value: string; onChange: (v: string) => void, isBanner?: boolean }) {
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
        // Higher resolution for banners
        const targetW = isBanner ? 1200 : 400;
        const targetH = isBanner ? 600 : 400;
        
        let width = img.width;
        let height = img.height;
        const ratio = width / height;

        if (isBanner) {
          // Fixed wide aspect for banners
          canvas.width = 1200;
          canvas.height = 600;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const scale = Math.max(1200 / width, 600 / height);
            const x = (1200 - width * scale) / 2;
            const y = (600 - height * scale) / 2;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, 1200, 600);
            ctx.drawImage(img, x, y, width * scale, height * scale);
            onChange(canvas.toDataURL("image/jpeg", 0.9));
          }
          return;
        }

        // Standard square for avatars/logos
        if (width > height) {
          if (width > targetW) { height = Math.round((height * targetW) / width); width = targetW; }
        } else {
          if (height > targetH) { width = Math.round((width * targetH) / height); height = targetH; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          onChange(canvas.toDataURL("image/jpeg", 0.9));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center", padding: "12px", background: "rgba(255,107,0,0.03)", borderRadius: "16px", border: "1px solid rgba(255,107,0,0.1)" }}>
      <div style={{ position: "relative" }}>
        {value ? (
          <img src={value} alt="Preview" style={{ width: 80, height: 80, borderRadius: "12px", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: "12px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #d1d5db" }}>
            <Camera size={24} color="#9ca3af" />
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button type="button" onClick={() => setMode("upload")} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, background: mode === "upload" ? "#000" : "#fff", color: mode === "upload" ? "#fff" : "#4b5563", border: "1px solid " + (mode === "upload" ? "#000" : "#e5e7eb"), cursor: "pointer", transition: "all 0.2s" }}>Upload File</button>
          <button type="button" onClick={() => setMode("url")} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, background: mode === "url" ? "#000" : "#fff", color: mode === "url" ? "#fff" : "#4b5563", border: "1px solid " + (mode === "url" ? "#000" : "#e5e7eb"), cursor: "pointer", transition: "all 0.2s" }}>Web URL</button>
          {value && (
            <button 
              type="button" 
              onClick={() => onChange("")} 
              style={{ 
                padding: "6px 14px", 
                borderRadius: "8px", 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                background: "rgba(239, 68, 68, 0.1)", 
                color: "#ef4444", 
                border: "1px solid rgba(239, 68, 68, 0.2)", 
                cursor: "pointer", 
                transition: "all 0.2s",
                marginLeft: "auto"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
            >
              Remove
            </button>
          )}
        </div>
        
        {mode === "url" ? (
          <input 
            value={value || ""} 
            onChange={e => onChange(e.target.value)} 
            placeholder="https://images.com/photo.jpg" 
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "0.85rem", background: "#fff" }}
          />
        ) : (
          <div style={{ position: "relative", width: "100%" }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ width: "100%", fontSize: "0.8rem", color: "#6b7280", cursor: "pointer" }}
            />
          </div>
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Additional Image States
  const [companyLogoUrl, setCompanyLogoUrl] = useState(card.companyLogoUrl ?? "");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(card.coverImageUrl ?? "");

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
  const [newAction, setNewAction] = useState({ platform: "calendly", url: "", label: "", subtitle: "" });
  const [newPayment, setNewPayment] = useState({ platform: "paypal", url: "", label: "", note: "" });

  // Helper to open modal with platform pre-selected
  const openPlatformModal = (modalType: "social" | "payment" | "action", platform: string) => {
    setActiveModal(modalType);
    if (modalType === "social") setNewSocial(prev => ({ ...prev, platform }));
    if (modalType === "payment") setNewPayment(prev => ({ ...prev, platform }));
    if (modalType === "action") setNewAction(prev => ({ ...prev, platform }));
  };

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
      fd.append("companyLogoUrl", companyLogoUrl);
      fd.append("coverImageUrl", coverPhotoUrl);
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

  const SOCIAL_PLATFORMS = ["linkedin", "twitter", "instagram", "facebook", "github", "youtube", "tiktok", "whatsapp", "telegram", "discord", "twitch", "signal", "skype", "threads", "bluesky", "pinterest", "snapchat", "reddit", "yelp"];
  const PAYMENT_PLATFORMS = ["paypal", "stripe", "venmo", "cashapp", "gpay", "whatsapppay", "wise", "upi", "razorpay", "bank_transfer", "buymeacoffee", "patreon", "kofi"];
  const ACTION_PLATFORMS = ["calendly", "cal", "zoom", "meet", "teams", "booking", "typeform", "shopify", "custom"];
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
      company: (companyName || companyLogoUrl)
        ? {
            name: companyName || "",
            role: companyRole || undefined,
            logoUrl: companyLogoUrl || undefined,
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
      coverImageUrl: coverPhotoUrl || undefined,
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

  const renderActiveModal = () => {
    if (!activeModal) return null;

    let modalTitle = "";
    let modalContent = null;

    switch (activeModal) {
      case "companyLogo":
        modalTitle = "Company Logo";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}>
              <label>Logo Preview</label>
              <AvatarUploader value={companyLogoUrl} onChange={setCompanyLogoUrl} />
            </div>
          </div>
        );
        break;
      case "profilePicture":
        modalTitle = "Profile Picture";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}>
              <label>Avatar / Photo</label>
              <AvatarUploader value={avatarUrl} onChange={setAvatarUrl} />
            </div>
          </div>
        );
        break;
      case "coverPhoto":
        modalTitle = "Cover Photo";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}>
              <label>Cover Banner</label>
              <AvatarUploader value={coverPhotoUrl} onChange={setCoverPhotoUrl} isBanner={true} />
            </div>
          </div>
        );
        break;
      case "name":
        modalTitle = "Personal Identity";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={styles.formField}><label>First Name *</label><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" /></div>
            <div className={styles.formField}><label>Last Name *</label><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Kumar" /></div>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Display Name</label><input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Jane Doe (optional)" /></div>
            <div className={styles.formField}><label>Pronouns</label><input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="he/him" /></div>
          </div>
        );
        break;
      case "jobTitle":
        modalTitle = "Job Title";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Job Title *</label><input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Founder & CEO" /></div>
          </div>
        );
        break;
      case "department":
        modalTitle = "Department & Role";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Department / Your Role</label><input value={companyRole} onChange={e => setCompanyRole(e.target.value)} placeholder="Marketing Department" /></div>
          </div>
        );
        break;
      case "company":
        modalTitle = "Company Details";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Computer Port" /></div>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Tagline</label><input value={companyTagline} onChange={e => setCompanyTagline(e.target.value)} placeholder="Smart Solutions" /></div>
          </div>
        );
        break;
      case "accreditations":
        modalTitle = "Accreditations (Bio)";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Bio / Accreditations</label><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Certifications, degrees..." rows={3} /></div>
          </div>
        );
        break;
      case "headline":
        modalTitle = "Headline";
        modalContent = (
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formGridFull}`}><label>Headline</label><input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Building the future of IT" /></div>
          </div>
        );
        break;
      case "email":
        modalTitle = "Email Addresses";
        modalContent = (
          <div>
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
            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.formField}><label>Type</label><select value={newEmail.type} onChange={e => setNewEmail(em => ({ ...em, type: e.target.value }))}><option value="work">Work</option><option value="personal">Personal</option></select></div>
              <div className={styles.formField}><label>Email</label><input value={newEmail.address} onChange={e => setNewEmail(em => ({ ...em, address: e.target.value }))} placeholder="you@company.com" type="email" /></div>
              <div className={styles.formField}><label>Label</label><input value={newEmail.label} onChange={e => setNewEmail(em => ({ ...em, label: e.target.value }))} placeholder="Work" /></div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}><button className={styles.btnPrimary} onClick={handleAddEmail} disabled={isPending || !newEmail.address}><Plus size={14} /> Add</button></div>
            </div>
          </div>
        );
        break;
      case "phone":
        modalTitle = "Phone Numbers";
        modalContent = (
          <div>
            <div className={styles.entryList}>
              {phones.map(p => (
                <div key={p.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{p.number}</div>
                    <div className={styles.entryMeta}>{p.label || p.type}{p.whatsapp ? " · WhatsApp" : ""}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeletePhone(p.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.formField}><label>Type</label><select value={newPhone.type} onChange={e => setNewPhone(p => ({ ...p, type: e.target.value }))}><option value="mobile">Mobile</option><option value="work">Work</option><option value="home">Home</option></select></div>
              <div className={styles.formField}><label>Number</label><input value={newPhone.number} onChange={e => setNewPhone(p => ({ ...p, number: e.target.value }))} placeholder="+1..." /></div>
              <div className={styles.formField}><label>Label</label><input value={newPhone.label} onChange={e => setNewPhone(p => ({ ...p, label: e.target.value }))} placeholder="Mobile" /></div>
              <div className={styles.formField} style={{ justifyContent: "flex-end" }}><button className={styles.btnPrimary} onClick={handleAddPhone} disabled={isPending || !newPhone.number}><Plus size={14} /> Add</button></div>
            </div>
          </div>
        );
        break;
      case "companyUrl":
      case "link":
        modalTitle = "Websites & Links";
        modalContent = (
          <div>
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
            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.formField}><label>Label</label><input value={newWebsite.label} onChange={e => setNewWebsite(v => ({ ...v, label: e.target.value }))} placeholder="My Site" /></div>
              <div className={styles.formField}><label>URL</label><input value={newWebsite.url} onChange={e => setNewWebsite(v => ({ ...v, url: e.target.value }))} placeholder="https://..." /></div>
              <div className={`${styles.formField} ${styles.formGridFull}`} style={{ alignItems: "flex-end" }}><button className={styles.btnPrimary} onClick={handleAddWebsite} disabled={isPending || !newWebsite.label || !newWebsite.url}><Plus size={14} /> Add</button></div>
            </div>
          </div>
        );
        break;
      case "address":
        modalTitle = "Addresses";
        modalContent = (
          <div>
            <div className={styles.entryList}>
              {addresses.map(a => (
                <div key={a.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel}>{a.label || a.city || "Address"}</div>
                    <div className={styles.entryMeta}>{[a.street, a.city, a.country].filter(Boolean).join(", ")}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteAddress(a.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.formField}><label>Type</label><select value={newAddress.type} onChange={e => setNewAddress(v => ({...v, type: e.target.value}))}><option value="work">Work</option><option value="home">Home</option></select></div>
              <div className={styles.formField}><label>City</label><input value={newAddress.city} onChange={e => setNewAddress(v => ({...v, city: e.target.value}))} placeholder="City" /></div>
              <div className={`${styles.formField} ${styles.formGridFull}`}><label>Street</label><input value={newAddress.street} onChange={e => setNewAddress(v => ({...v, street: e.target.value}))} placeholder="Street" /></div>
              <div className={`${styles.formField} ${styles.formGridFull}`} style={{ alignItems: "flex-end" }}><button className={styles.btnPrimary} onClick={handleAddAddress} disabled={isPending}><Plus size={14} /> Add</button></div>
            </div>
          </div>
        );
        break;
      case "social":
        modalTitle = "Social Links";
        modalContent = (
          <div>
            <div className={styles.entryList}>
              {socials.map(s => (
                <div key={s.id} className={styles.entryItem}>
                  <div className={styles.entryInfo}>
                    <div className={styles.entryLabel} style={{ textTransform: "capitalize" }}>{s.platform}</div>
                    <div className={styles.entryMeta}>{s.url}</div>
                  </div>
                  <button className={styles.btnDanger} onClick={() => handleDeleteSocial(s.id)} disabled={isPending} title="Delete"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.formField}><label>Platform</label><select value={newSocial.platform} onChange={e => setNewSocial(s => ({ ...s, platform: e.target.value }))}>{SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div className={styles.formField}><label>URL</label><input value={newSocial.url} onChange={e => setNewSocial(s => ({ ...s, url: e.target.value }))} placeholder="https://..." /></div>
              <div className={`${styles.formField} ${styles.formGridFull}`} style={{ alignItems: "flex-end" }}><button className={styles.btnPrimary} onClick={handleAddSocial} disabled={isPending || !newSocial.url}><Plus size={14} /> Add</button></div>
            </div>
          </div>
        );
        break;
      case "settings":
        modalTitle = "Card Settings";
        modalContent = (
           <div className={styles.formGrid}>
             <div className={`${styles.formField} ${styles.formGridFull}`}>
                <label>Card URL Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
             </div>
             <div className={`${styles.formField} ${styles.formGridFull}`}>
                <div className={styles.toggleRow}>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>Lead Capture</div><div className={styles.toggleDesc}>Show contact form</div></div>
                  <Toggle id="lead-capture" checked={leadCapture} onChange={setLeadCapture} />
                </div>
             </div>
             <div className={`${styles.formField} ${styles.formGridFull}`}>
                <div className={styles.toggleRow}>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>VCF Download</div><div className={styles.toggleDesc}>Allow contact download</div></div>
                  <Toggle id="vcf-download" checked={vcfDownload} onChange={setVcfDownload} />
                </div>
             </div>
           </div>
        );
        break;
    }

    return (
      <div className={styles.modalOverlay} onClick={() => { handleSave(); setActiveModal(null); }}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={() => { handleSave(); setActiveModal(null); }}>
            <X size={18} />
          </button>
          <div className={styles.modalHeader} style={{ textAlign: "left", marginBottom: 20 }}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
          </div>
          {modalContent}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
             <button className={styles.btnPrimary} onClick={() => { handleSave(); setActiveModal(null); }}>Done</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.editorPage}>
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" className={styles.btnSecondary} style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Editing: {displayName || `${firstName} ${lastName}`}</h1>
            <p className={styles.pageSubtitle}>
              {isPublished ? `🟢 Live at neonglass.me/${slug}` : `⚫ Draft · not publicly visible`}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
           <button onClick={() => setActiveModal('settings')} className={styles.btnSecondary}><Settings size={15}/> Settings</button>
           <a href={`/${slug}`} target="_blank" onClick={handlePreviewClick} className={styles.btnSecondary} style={{ display: "flex", gap: 6 }}>
             <ExternalLink size={15} /> View
           </a>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* ── Left: Grid Builder ── */}
        <div className={styles.builderContainer}>
          {feedback && (
             <div className={feedback.type === "success" ? styles.formSuccess : styles.formError}>
                {feedback.type === "success" ? <CheckCircle size={16} /> : "⚠️"} {feedback.msg}
             </div>
          )}

          <div className={styles.builderHeader}>
            <h2>Create your first card</h2>
            <p>Ready to design your card? Pick a field below to get started!</p>
          </div>

          {/* Add Images Section */}
          <div className={styles.builderSection}>
            <div className={styles.builderSectionTitle}>Add images</div>
            <div className={styles.builderGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}>
                <div className={styles.builderGridImageItem} onClick={() => setActiveModal("companyLogo")} style={{ position: "relative", border: companyLogoUrl ? "1px solid var(--orange)" : undefined, background: companyLogoUrl ? "rgba(255,107,0,0.02)" : undefined }}>
                   {companyLogoUrl && (
                     <button 
                       className={styles.gridItemQuickRemove} 
                       onClick={(e) => { e.stopPropagation(); setCompanyLogoUrl(""); }}
                       title="Remove Logo"
                     >
                       <X size={14} />
                     </button>
                   )}
                   <div className={styles.builderGridImageItemIcon}>
                     {companyLogoUrl ? <img src={companyLogoUrl} alt="Logo" style={{ width: 44, height: 44, borderRadius: "8px", objectFit: "cover" }} /> : <Plus size={24} />}
                   </div>
                   <div className={styles.builderGridImageItemLabel}>Company Logo</div>
                   {companyLogoUrl && <div style={{ fontSize: 10, color: "var(--orange)", fontWeight: 700, marginTop: -4 }}>SET</div>}
                </div>
                <div className={styles.builderGridImageItem} onClick={() => setActiveModal("profilePicture")} style={{ position: "relative", border: avatarUrl ? "1px solid var(--orange)" : undefined, background: avatarUrl ? "rgba(255,107,0,0.02)" : undefined }}>
                   {avatarUrl && (
                     <button 
                       className={styles.gridItemQuickRemove} 
                       onClick={(e) => { e.stopPropagation(); setAvatarUrl(""); }}
                       title="Remove Avatar"
                     >
                       <X size={14} />
                     </button>
                   )}
                   <div className={styles.builderGridImageItemIcon}>
                     {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : <Plus size={24} />}
                   </div>
                   <div className={styles.builderGridImageItemLabel}>Profile Picture</div>
                   {avatarUrl && <div style={{ fontSize: 10, color: "var(--orange)", fontWeight: 700, marginTop: -4 }}>SET</div>}
                </div>
                <div className={styles.builderGridImageItem} onClick={() => setActiveModal("coverPhoto")} style={{ position: "relative", border: coverPhotoUrl ? "1px solid var(--orange)" : undefined, background: coverPhotoUrl ? "rgba(255,107,0,0.02)" : undefined }}>
                   {coverPhotoUrl && (
                     <button 
                       className={styles.gridItemQuickRemove} 
                       onClick={(e) => { e.stopPropagation(); setCoverPhotoUrl(""); }}
                       title="Remove Cover"
                     >
                       <X size={14} />
                     </button>
                   )}
                   <div className={styles.builderGridImageItemIcon}>
                     {coverPhotoUrl ? <img src={coverPhotoUrl} alt="Cover" style={{ width: 44, height: 44, borderRadius: "6px", objectFit: "cover" }} /> : <Plus size={24} />}
                   </div>
                   <div className={styles.builderGridImageItemLabel}>Cover Photo</div>
                   {coverPhotoUrl && <div style={{ fontSize: 10, color: "var(--orange)", fontWeight: 700, marginTop: -4 }}>SET</div>}
                </div>
            </div>
          </div>

           {/* Add your details Section */}
           <div className={styles.builderSection} style={{ marginTop: 24 }}>
             <div className={styles.builderSectionTitle}>Customize your card</div>
             
             <div className={styles.builderSectionSubtitle}>Messaging</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "whatsapp")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(37, 211, 102, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="whatsapp" />
                   </div>
                   <div className={styles.builderGridItemLabel}>WhatsApp</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "telegram")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(34, 158, 217, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="telegram" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Telegram</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "signal")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(58, 118, 240, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="signal" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Signal</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "discord")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(88, 101, 242, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="discord" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Discord</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "skype")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 175, 240, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="skype" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Skype</div>
                </div>
             </div>

             <div className={styles.builderSectionSubtitle} style={{ marginTop: 20 }}>Identity</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("name")}>
                   <div className={styles.builderGridItemIcon}><User size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Name</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("jobTitle")}>
                   <div className={styles.builderGridItemIcon}><Medal size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Job title</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("department")}>
                   <div className={styles.builderGridItemIcon}><Briefcase size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Department</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("company")}>
                   <div className={styles.builderGridItemIcon}><Building2 size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Company</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("accreditations")}>
                   <div className={styles.builderGridItemIcon}><FileText size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Bio</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("headline")}>
                   <div className={styles.builderGridItemIcon}><MessageSquare size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Headline</div>
                </div>
             </div>

             <div className={styles.builderSectionSubtitle} style={{ marginTop: 20 }}>Communication</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("email")}>
                   <div className={styles.builderGridItemIcon}><Mail size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Email</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("phone")}>
                   <div className={styles.builderGridItemIcon}><PhoneIcon size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Phone</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("address")}>
                   <div className={styles.builderGridItemIcon}><MapPin size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Address</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("link")}>
                   <div className={styles.builderGridItemIcon}><Link2 size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>Website</div>
                </div>
             </div>

             <div className={styles.builderSectionSubtitle} style={{ marginTop: 20 }}>Professional</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "linkedin")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(10, 102, 194, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="linkedin" />
                   </div>
                   <div className={styles.builderGridItemLabel}>LinkedIn</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "github")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(36, 41, 46, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="github" />
                   </div>
                   <div className={styles.builderGridItemLabel}>GitHub</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("action", "calendly")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 107, 255, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="calendly" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Calendly</div>
                </div>
             </div>

             <div className={styles.builderSectionSubtitle} style={{ marginTop: 20 }}>Payments</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "paypal")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 48, 135, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="paypal" />
                   </div>
                   <div className={styles.builderGridItemLabel}>PayPal</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "venmo")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(61, 149, 206, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="venmo" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Venmo</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "cashapp")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 214, 79, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="cashapp" />
                   </div>
                   <div className={styles.builderGridItemLabel}>CashApp</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "gpay")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(66, 133, 244, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="gpay" />
                   </div>
                   <div className={styles.builderGridItemLabel}>GPay</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "whatsapppay")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(37, 211, 102, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="whatsapppay" />
                   </div>
                   <div className={styles.builderGridItemLabel}>WA Pay</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "wise")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 185, 255, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="wise" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Wise</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("payment", "bank_transfer")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(113, 128, 150, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="bank_transfer" />
                   </div>
                   <div className={styles.builderGridItemLabel}>NEFT/IMPS</div>
                </div>
             </div>

             <div className={styles.builderSectionSubtitle} style={{ marginTop: 20 }}>Social & Entertainment</div>
             <div className={styles.builderGrid}>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "instagram")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(228, 64, 95, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="instagram" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Instagram</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "twitter")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 0, 0, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="twitter" />
                   </div>
                   <div className={styles.builderGridItemLabel}>X</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "facebook")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(24, 119, 242, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="facebook" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Facebook</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "youtube")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(255, 0, 0, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="youtube" />
                   </div>
                   <div className={styles.builderGridItemLabel}>YouTube</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "tiktok")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(0, 0, 0, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="tiktok" />
                   </div>
                   <div className={styles.builderGridItemLabel}>TikTok</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => openPlatformModal("social", "twitch")}>
                   <div className={styles.builderGridItemIcon} style={{ background: "rgba(145, 70, 255, 0.1)", borderRadius: "12px", padding: "12px" }}>
                      <PlatformIcon platform="twitch" />
                   </div>
                   <div className={styles.builderGridItemLabel}>Twitch</div>
                </div>
                <div className={styles.builderGridItem} onClick={() => setActiveModal("social")}>
                   <div className={styles.builderGridItemIcon}><Plus size={24} strokeWidth={1.5} /></div>
                   <div className={styles.builderGridItemLabel}>More</div>
                </div>
             </div>
           </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
             <div className={styles.toggleRow} style={{ flex: 1, paddingRight: 40 }}>
                <div>
                   <div style={{ fontWeight: 700, color: "var(--text-1)", fontSize: 14 }}>{isPublished ? "🟢 Live" : "⚫ Draft"}</div>
                   <div className={styles.toggleDesc}>
                     {isPublished ? `Publicly visible at neonglass.me/${slug}` : "Hidden from public. Toggle to make live."}
                   </div>
                </div>
                <Toggle id="toggle-publish" checked={isPublished} onChange={handlePublishToggle} />
             </div>
             <button id="btn-save-card" className={styles.btnPrimary} onClick={handleSave} disabled={isPending} style={{ padding: "12px 32px" }}>
                {isPending ? "Saving…" : "Save & Next"}
             </button>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className={styles.previewPanel}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
            Live Preview
          </div>
          <div className={styles.previewPhoneFrame}>
            <div className={styles.previewIframe} style={{ overflow: "auto", background: "#ffffff" }}>
              <PublicCard card={livePreviewCard} />
            </div>
          </div>
        </div>
      </div>

      {renderActiveModal()}

      {/* ── Draft Modal ── */}
      {showDraftModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDraftModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowDraftModal(false)}><X size={18} /></button>
            <div className={styles.modalHeader}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 className={styles.modalTitle}>Card is Not Live!</h2>
              <p className={styles.modalSubtitle} style={{ marginTop: 12, lineHeight: 1.5 }}>
                Your card is currently set to <strong>Draft</strong>. You must publish it before you or anyone else can view the live link in a browser!
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              <button className={styles.btnPrimary} onClick={() => { handlePublishToggle(true); setShowDraftModal(false); }} style={{ width: "100%", padding: "14px" }}>
                Make Card Live Now 🟢
              </button>
              <button className={styles.btnSecondary} onClick={() => setShowDraftModal(false)} style={{ width: "100%", padding: "14px" }}>
                Keep Editing in Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
