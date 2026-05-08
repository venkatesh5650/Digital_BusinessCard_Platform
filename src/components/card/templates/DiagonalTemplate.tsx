"use client";

import React from "react";
import { Download, Share2, MessageCircle, Link as LinkIcon, Play, FileText, CreditCard, Image as ImageIcon, Phone, Mail, MapPin } from "lucide-react";
import styles from "../card.module.css";
import { Avatar } from "../fragments/Avatar";
import { Section, ContactList, WebsiteList } from "../fragments/Sections";
import { SocialConnect } from "../fragments/SocialConnect";
import LeadCapture from "../LeadCapture";
import type { VCard } from "@/types";
import { 
  getDisplayName, 
  getVisibleActionLinks, 
  getVisiblePaymentLinks, 
  getVisibleMediaEmbeds,
  getPrimaryPhone,
  getPrimaryEmail
} from "@/data/dummyCard";

interface TemplateProps {
  card: VCard;
  trackClick: () => void;
  handleDownloadImage: () => void;
}

export default function DiagonalTemplate({ card, trackClick, handleDownloadImage }: TemplateProps) {
  const name = getDisplayName(card);
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);
  
  const primaryPhone = getPrimaryPhone(card);
  const primaryEmail = getPrimaryEmail(card);
  const whatsappPhone = card.phones.find((p) => p.whatsapp);
  const primaryAddress = card.addresses[0]; // just grab the first address for the location icon

  return (
    <article 
      className={`${styles.card} ${styles.cardDiagonal}`} 
      id={`public-vcard-container-${card.id}`}
      style={{ "--diagonal-primary": card.theme?.colorPrimary || "#111827" } as React.CSSProperties}
    >
      {/* ── DIAGONAL HEADER ── */}
      <header className={styles.diagonalHeader}>
        <div className={styles.diagonalHeaderBg}></div>
        
        {/* Company Logo at top-center */}
        {card?.profile?.company?.logoUrl && (
          <div className={styles.diagonalCompanyLogo}>
            <img src={card.profile.company.logoUrl} alt={card.profile.company.name || "Company Logo"} />
          </div>
        )}
      </header>
      
      <div className={styles.diagonalAvatarSection}>
        <div className={styles.diagonalAvatarWrap}>
          <Avatar src={card?.profile?.avatarUrl} name={name} />
        </div>
      </div>

      <div className={styles.body}>
        {/* ── CENTERED TYPOGRAPHY ── */}
        <div className={styles.diagonalTextContent}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{card?.profile?.jobTitle}</p>
          {card?.profile?.company?.name && <p className={styles.companySubtext}>{card.profile.company.name}</p>}
        </div>

        {/* ── QUICK ACTION BAR ── */}
        <div className={styles.quickActionBar}>
          {primaryPhone && (
            <a href={`tel:${primaryPhone.number}`} className={styles.quickActionBtn} onClick={trackClick}>
              <div className={styles.quickActionIcon}><Phone size={20} /></div>
              <span>Call</span>
            </a>
          )}
          {primaryEmail && (
            <a href={`mailto:${primaryEmail.address}`} className={styles.quickActionBtn} onClick={trackClick}>
              <div className={styles.quickActionIcon}><Mail size={20} /></div>
              <span>Email</span>
            </a>
          )}
          {whatsappPhone && (
            <a href={`https://wa.me/${whatsappPhone.number?.replace(/\D/g, "") || ""}`} className={styles.quickActionBtn} target="_blank" rel="noreferrer" onClick={trackClick}>
              <div className={styles.quickActionIcon}><MessageCircle size={20} /></div>
              <span>Chat</span>
            </a>
          )}
          {primaryAddress && (
            <a href={primaryAddress.mapUrl || `https://maps.google.com/?q=${encodeURIComponent([primaryAddress.street, primaryAddress.city, primaryAddress.state, primaryAddress.country].filter(Boolean).join(", "))}`} className={styles.quickActionBtn} target="_blank" rel="noreferrer" onClick={trackClick}>
              <div className={styles.quickActionIcon}><MapPin size={20} /></div>
              <span>Map</span>
            </a>
          )}
        </div>

        {/* Bio */}
        {card?.profile?.bio && <p className={styles.diagonalBio}>{card.profile.bio}</p>}

        {/* ── MAIN ACTIONS ── */}
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
          </div>
        </div>

        {/* ── CONTACT CARD BLOCK ── */}
        {(card.phones.length > 0 || card.emails.length > 0 || card.addresses.length > 0) && (
          <div className={styles.contactCardBlock}>
            <div className={styles.contactCardPill}>Contact Us</div>
            <ContactList card={card} trackClick={trackClick} />
          </div>
        )}
        
        {/* ── SECTIONS ── */}
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
        
        <div className={styles.diagonalSocialWrap}>
          <SocialConnect card={card} trackClick={trackClick} layout="list" />
        </div>
      </div>
    </article>
  );
}
