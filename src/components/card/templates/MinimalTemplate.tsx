"use client";

import React from "react";
import { Download, Share2, MessageCircle, Link as LinkIcon, Play, FileText, CreditCard, ChevronRight, Image as ImageIcon } from "lucide-react";
import styles from "../card.module.css";
import { Avatar } from "../fragments/Avatar";
import { Section, ContactList, WebsiteList } from "../fragments/Sections";
import { SocialConnect } from "../fragments/SocialConnect";
import LeadCapture from "../LeadCapture";
import type { VCard } from "@/types";
import { getDisplayName, getVisibleActionLinks, getVisiblePaymentLinks, getVisibleMediaEmbeds } from "@/data/dummyCard";

interface TemplateProps {
  card: VCard;
  trackClick: () => void;
  handleDownloadImage: () => void;
}

export default function MinimalTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);

  return (
    <article className={`${styles.card} ${styles.cardMinimal}`} id={`public-vcard-container-${card?.id}`}>
      {/* ── MINIMAL HEADER ── */}
      <header className={styles.minimalHeader}>
        <div className={styles.minimalAvatarWrap}>
          <Avatar src={card?.profile?.avatarUrl} name={name} />
          {card?.profile?.company?.logoUrl && (
            <div className={styles.minimalBadgeLogo}>
              <img src={card.profile.company.logoUrl} alt="Logo" />
            </div>
          )}
        </div>
        
        <div className={styles.minimalInfo}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
          {card?.profile?.company?.name && <p className={styles.companySubtext}>{card.profile.company.name}</p>}
        </div>
      </header>
      
      <div className={styles.body}>
        <div className={styles.minimalActions}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card?.settings?.slug}`} className={styles.minimalCtaPrimary} onClick={trackClick}>
              <Download size={18} /> Save Contact
            </a>
          )}
          {card?.settings?.leadCaptureEnabled && <LeadCapture vcardId={card.id} trackClick={trackClick} />}
        </div>
        
        {card?.profile?.bio && <p className={styles.bio} style={{ borderLeft: "2px solid var(--orange)", paddingLeft: "16px", marginBottom: "32px" }}>{card.profile.bio}</p>}

        <ContactList card={card} trackClick={trackClick} />
        <SocialConnect card={card} trackClick={trackClick} />
        <WebsiteList card={card} trackClick={trackClick} />

        {/* ── MINIMAL ACTIONS (Inline) ── */}
        <div className={styles.quickRow} style={{ marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card?.settings?.slug}`} className={styles.mainCta} style={{ background: "#000", borderRadius: "0" }} onClick={trackClick}>
              <Download size={18} /> Save Contact
            </a>
          )}
          <div className={styles.secondaryRow}>
            <button className={styles.secondaryCta} style={{ border: "none" }} onClick={handleDownloadImage}><ImageIcon size={16} /></button>
            <button className={styles.secondaryCta} style={{ border: "none" }} onClick={() => {
              trackClick();
              if (navigator.share) navigator.share({ title: name, url: window.location.href });
            }}><Share2 size={16} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
