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

export default function ClassicTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);

  return (
    <article 
      className={`${styles.card} ${styles.cardClassic}`} 
      id={`public-vcard-container-${card.id}`}
      style={{ "--classic-primary": card.theme?.colorPrimary || "#157e70" } as React.CSSProperties}
    >
      {/* ── HEADER ── */}
      <header className={styles.classicHeader}>
        {/* Slanted green background */}
        <div className={styles.classicHeaderBg}></div>
        
        <div className={styles.classicHeaderContent}>
          {/* Left-aligned text */}
          <div className={styles.classicHeaderText}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
            {card?.profile?.company?.role && <p className={styles.jobTitle}>{card.profile.company.role}</p>}
            {card?.profile?.company?.name && <p className={styles.jobTitle}>{card.profile.company.name}</p>}
          </div>
          
          {/* Right-aligned avatar overlapping the slant */}
          <div className={styles.classicAvatarWrap}>
            <Avatar src={card?.profile?.avatarUrl} name={name} />
          </div>
        </div>
      </header>
      
      <div className={styles.body}>
        {/* Bio */}
        {card?.profile?.bio && <p className={styles.classicBio}>{card.profile.bio}</p>}

        {/* ── ACTIONS ── */}
        <div className={styles.quickRow}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card.settings.slug}`} className={styles.mainCta} onClick={trackClick}>
              <Download size={18} /> Save Contact
            </a>
          )}
          {card?.settings?.leadCaptureEnabled && <LeadCapture vcardId={card.id} trackClick={trackClick} />}
          <div className={styles.secondaryRow}>
            <button className={styles.secondaryCta} onClick={handleDownloadImage}><ImageIcon size={16} /> Save as Image</button>
            <button className={styles.secondaryCta} onClick={() => {
              trackClick();
              if (navigator.share) navigator.share({ title: name, url: window.location.href });
            }}><Share2 size={16} /> Share</button>
            {whatsappPhone?.whatsapp && (
              <a href={`https://wa.me/${whatsappPhone.number?.replace(/\D/g, "") || ""}`} className={styles.secondaryCta} style={{ gridColumn: "span 2" }} target="_blank" onClick={trackClick}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <ContactList card={card} trackClick={trackClick} />
        
        {actionLinks.length > 0 && (
          <Section title="Featured">
            {actionLinks.map(link => (
              <a key={link.id} href={link.url} className={styles.linkCard} target="_blank" onClick={trackClick}>
                <div className={styles.linkIcon}><LinkIcon size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.linkTitle}>{link.label}</div>
                  {link.subtitle && <div className={styles.linkSub}>{link.subtitle}</div>}
                </div>
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
              </a>
            ))}
          </Section>
        )}

        {mediaEmbeds.length > 0 && (
          <Section title="Media">
            {mediaEmbeds.map(embed => (
              <a key={embed.id} href={embed.url} className={styles.linkCard} target="_blank" onClick={trackClick}>
                <div className={styles.linkIcon}>{embed.type === 'youtube' ? <Play size={18} /> : <FileText size={18} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.linkTitle}>{embed.title || embed.type}</div>
                  <div className={styles.linkSub}>Tap to open</div>
                </div>
              </a>
            ))}
          </Section>
        )}

        <WebsiteList card={card} trackClick={trackClick} />
        
        {/* Moved Social Connect to the bottom for this design */}
        <SocialConnect card={card} trackClick={trackClick} layout="list" />
      </div>
    </article>
  );
}
