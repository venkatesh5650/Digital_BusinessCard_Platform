"use client";

import React from "react";
import Image from "next/image";
import { Download, Share2, MessageCircle, Link as LinkIcon, Play, FileText, CreditCard, Image as ImageIcon } from "lucide-react";
import styles from "../card.module.css";
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

export default function WaveTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);
  const avatarBg = card?.profile?.avatarUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <article 
      className={`${styles.card} ${styles.cardWave}`} 
      id={`public-vcard-container-${card.id}`}
      style={{ "--wave-primary": card.theme?.colorPrimary || "#ff6b00" } as React.CSSProperties}
    >
      {/* ── WAVE HEADER (FULL IMAGE BG) ── */}
      <header className={styles.waveHeader}>
        <Image 
          src={avatarBg} 
          alt={name} 
          fill 
          priority 
          quality={100}
          sizes="(max-width: 440px) 100vw, 440px"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          className={styles.waveHeaderImage}
        />
        <div className={styles.waveHeaderGradient} />
        
        {/* The Wave Separator */}
        <div className={styles.waveSeparator}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className={styles.waveSvg}>
            {/* The Green Border (Higher up on the left) */}
            <path 
              fill="var(--wave-primary)" 
              d="M0,120 C480,120 960,320 1440,200 L1440,320 L0,320 Z"
            ></path>
            {/* The White Body (Lower down on the left, converging on the right) */}
            <path 
              fill="#ffffff" 
              d="M0,220 C480,220 960,320 1440,205 L1440,320 L0,320 Z"
            ></path>
          </svg>
          
          {/* Company Logo placed overlapping the white body & green wave */}
          {card?.profile?.company?.logoUrl && (
            <div className={styles.waveCompanyLogo}>
              <img src={card.profile.company.logoUrl} alt={card.profile.company.name || "Company Logo"} />
            </div>
          )}
        </div>
      </header>
      
      <div className={styles.body}>
        {/* ── TYPOGRAPHY ── */}
        <div className={styles.waveTextContent}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
          {card?.profile?.company?.name && (
             <p className={styles.companySubtext}>
               <span className={styles.companyRoleText}>{card.profile.company.role || "Support"}</span>
               <br />
               {card.profile.company.name}
             </p>
          )}
          
          {/* Bio */}
          {card?.profile?.bio && <p className={styles.waveBio}>{card.profile.bio}</p>}
          
          {card?.profile?.pronouns && <p className={styles.pronounText}>Goes by {card.profile.firstName} ({card.profile.pronouns})</p>}
        </div>

        {/* ── ACTIONS ── */}
        <div className={styles.quickRow}>
          {card?.settings?.vcfDownloadEnabled && (
            <a href={`/api/vcf/${card.settings.slug}`} className={styles.mainCta} onClick={trackClick}>
              <Download size={18} /> Save Contact
            </a>
          )}
          {card?.settings?.leadCaptureEnabled && <LeadCapture vcardId={card.id} trackClick={trackClick} />}
          <div className={styles.secondaryRow}>
            <button className={styles.secondaryCta} onClick={handleDownloadImage}><ImageIcon size={16} /> Save Image</button>
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
        
        <SocialConnect card={card} trackClick={trackClick} layout="list" />
      </div>
    </article>
  );
}
