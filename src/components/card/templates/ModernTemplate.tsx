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

export default function ModernTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);

  return (
    <article className={`${styles.card} ${styles.cardModern}`} id={`public-vcard-container-${card.id}`}>
      {/* ── MODERN HEADER (Centered) ── */}
      <header className={styles.header}>
        <div 
          className={styles.headerBanner}
          style={{ backgroundImage: card?.theme?.coverImageUrl ? `url(${card.theme.coverImageUrl})` : undefined }}
        >
          {card?.profile?.company?.logoUrl && (
            <div className={styles.companyLogoOverlay}>
              <div className={styles.logoPillIcon}>
                <img src={card.profile.company.logoUrl} alt="Logo" />
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.headerAlignmentWrap}>
          <div className={styles.avatarOverlay}>
            <Avatar src={card?.profile?.avatarUrl} name={name} />
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
            {card?.profile?.company?.name && <p className={styles.companySubtext}>{card?.profile?.company.name}</p>}
            
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
              {card?.profile?.pronouns && <span className={styles.pronounsBadge}>{card.profile.pronouns}</span>}
              {card?.profile?.company?.role && <span className={styles.pronounsBadge} style={{ background: "rgba(0,0,0,0.05)" }}>{card.profile.company.role}</span>}
            </div>
            
            {card?.profile?.bio && <p className={styles.bio}>{card.profile.bio}</p>}
          </div>
        </div>
      </header>
      
      <div className={styles.body}>
        {/* ── MODERN ACTIONS (Main CTA focus) ── */}
        <div className={styles.quickRow} style={{ marginTop: "10px" }}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card.settings.slug}`} className={styles.mainCta} style={{ padding: "16px", fontSize: "1rem" }} onClick={trackClick}>
              <Download size={20} /> Save Contact
            </a>
          )}
          {card?.settings?.leadCaptureEnabled && <LeadCapture vcardId={card.id} trackClick={trackClick} />}
          
          <div className={styles.secondaryRow}>
            <button className={styles.secondaryCta} onClick={handleDownloadImage}><ImageIcon size={16} /> Image</button>
            <button className={styles.secondaryCta} onClick={() => {
              trackClick();
              if (navigator.share) navigator.share({ title: name, url: window.location.href });
            }}><Share2 size={16} /> Share</button>
            {whatsappPhone?.whatsapp && (
              <a href={`https://wa.me/${whatsappPhone.number?.replace(/\D/g, "") || ""}`} className={styles.secondaryCta} style={{ gridColumn: "span 2" }} target="_blank" onClick={trackClick}>
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>

        <ContactList card={card} trackClick={trackClick} />
        <SocialConnect card={card} trackClick={trackClick} />
        <WebsiteList card={card} trackClick={trackClick} />

        {/* ... Rest of sections share Classic logic but styling comes from .cardModern wrapper ... */}
        {actionLinks.length > 0 && (
          <Section title="Featured">
            {actionLinks.map(link => (
              <a key={link.id} href={link.url} className={styles.linkCard} target="_blank" onClick={trackClick}>
                <div className={styles.linkIcon}><LinkIcon size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.linkTitle}>{link.label}</div>
                  {link.subtitle && <div className={styles.linkSub}>{link.subtitle}</div>}
                </div>
                <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
              </a>
            ))}
          </Section>
        )}

        {paymentLinks.length > 0 && (
          <Section title="Payments">
            {paymentLinks.map(pay => (
              <a key={pay.id} href={pay.url} className={styles.linkCard} target="_blank" onClick={trackClick}>
                <div className={styles.linkIcon}><CreditCard size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.linkTitle}>{pay.label || pay.platform}</div>
                  {pay.note && <div className={styles.linkSub}>{pay.note}</div>}
                </div>
                <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
              </a>
            ))}
          </Section>
        )}
      </div>
    </article>
  );
}
