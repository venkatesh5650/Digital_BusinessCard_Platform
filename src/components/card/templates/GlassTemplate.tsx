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

export default function GlassTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);

  return (
    <article className={`${styles.card} ${styles.cardGlass}`} id={`public-vcard-container-${card.id}`}>
      {/* ── GLASS HEADER ── */}
      <header 
        className={styles.glassHeader}
        style={{ backgroundImage: card?.theme?.coverImageUrl ? `url(${card.theme.coverImageUrl})` : undefined }}
      >
        <div className={styles.glassAvatarWrap}>
          <div className={styles.glassAvatarDecoration} />
          <Avatar src={card?.profile?.avatarUrl} name={name} />
          {card?.profile?.company?.logoUrl && (
            <div className={styles.glassCompanyLogo}>
              <img src={card.profile.company.logoUrl} alt="Logo" />
            </div>
          )}
        </div>
        
        <div className={styles.glassHeaderMeta}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
          {card?.profile?.company?.name && <p className={styles.companySubtext}>{card.profile.company.name}</p>}
          
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
            {card?.profile?.pronouns && <span className={styles.glassBadge}>{card.profile.pronouns}</span>}
            {card?.profile?.company?.role && <span className={styles.glassBadge} style={{ background: "rgba(255,255,255,0.1)" }}>{card.profile.company.role}</span>}
          </div>
        </div>
      </header>
      
      <div className={styles.body}>
        {/* ── GLASS ACTIONS ── */}
        <div className={styles.glassMainActions}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card.settings.slug}`} className={styles.glassCta} onClick={trackClick}>
              <Download size={18} /> Add Contact
            </a>
          )}
          {card?.settings?.leadCaptureEnabled && <LeadCapture vcardId={card.id} trackClick={trackClick} />}
          <div className={styles.secondaryRow}>
            <button className={styles.secondaryCta} onClick={handleDownloadImage}><ImageIcon size={16} /></button>
            <button className={styles.secondaryCta} onClick={() => {
              trackClick();
              if (navigator.share) navigator.share({ title: name, url: window.location.href });
            }}><Share2 size={16} /></button>
            {whatsappPhone?.whatsapp && (
              <a href={`https://wa.me/${whatsappPhone.number?.replace(/\D/g, "") || ""}`} className={styles.secondaryCta} style={{ gridColumn: "span 2" }} target="_blank" onClick={trackClick}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <ContactList card={card} trackClick={trackClick} />
        <SocialConnect card={card} trackClick={trackClick} />
        
        {actionLinks.length > 0 && (
          <Section title="Featured">
            {actionLinks.map(link => (
              <a key={link.id} href={link.url} className={styles.linkCard} target="_blank" style={{ borderRadius: "16px" }} onClick={trackClick}>
                <div className={styles.linkIcon}><LinkIcon size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.linkTitle}>{link.label}</div>
                </div>
                <ChevronRight size={14} />
              </a>
            ))}
          </Section>
        )}
      </div>
    </article>
  );
}
