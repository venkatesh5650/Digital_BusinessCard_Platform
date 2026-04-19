"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import {
  Phone, Mail, MapPin, Share2, Download, ChevronRight,
  Globe, FileText, Play, CreditCard,
  MessageCircle, Link as LinkIcon, Image as ImageIcon
} from "lucide-react";
import styles from "./card.module.css";
import SocialIcon from "./SocialIcon";
import LeadCapture from "./LeadCapture";
import type { VCard } from "@/types";
import {
  getDisplayName,
  getVisibleSocialLinks,
  getVisibleActionLinks,
  getVisiblePaymentLinks,
  getVisibleMediaEmbeds,
} from "@/data/dummyCard";

/* ─── Avatar Component ─── */
function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.avatarOuter}>
      <div className={styles.avatarInner}>
        {failed || !src ? (
          <div className={styles.avatarFallback}>{initials}</div>
        ) : (
          <img
            src={src}
            alt={name}
            className={styles.avatarImg}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── HEADER ─────────────────────────────────── */
function CardHeader({ card }: { card: VCard }) {
  const name = getDisplayName(card);
  const { profile } = card;

  return (
    <header className={styles.header}>
      <div 
        className={styles.headerBanner}
        style={{ 
          backgroundImage: card.theme.coverImageUrl ? `url(${card.theme.coverImageUrl})` : undefined,
        }}
      >
        {card.profile.company?.logoUrl && (
          <div className={styles.companyLogoOverlay}>
            <div className={styles.logoPillIcon}>
              <img src={card.profile.company.logoUrl} alt="Logo" />
            </div>
            <span className={styles.logoPillText}>
              {card.profile.company.name || "Company"}
            </span>
          </div>
        )}
      </div>
      
      <div className={styles.headerAlignmentWrap}>
        <div className={styles.avatarOverlay}>
          <Avatar src={profile.avatarUrl} name={name} />
        </div>

        <div className={styles.headerContent}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{profile.jobTitle}</p>
          {profile.company?.name && (
            <p className={styles.companySubtext}>{profile.company.name}</p>
          )}
          {profile.pronouns && (
            <div style={{ marginTop: "4px" }}>
              <span className={styles.pronounsBadge}>{profile.pronouns}</span>
            </div>
          )}
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        </div>
      </div>
    </header>
  );
}

/* ─── ACTION LINKS SECTIONS ───────────────────── */
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section>
      {title && <h2 className={styles.sectionLabel}>{title}</h2>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {children}
      </div>
    </section>
  );
}

function ContactList({ card, trackClick }: { card: VCard, trackClick: () => void }) {
  return (
    <Section title="Contact">
      {card.phones.map((phone) => (
        <a key={phone.id} href={`tel:${phone.number}`} className={styles.linkCard} onClick={trackClick}>
          <div className={styles.linkIcon}><Phone size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.linkTitle}>{phone.number}</div>
            <div className={styles.linkSub}>
              {phone.label || phone.type}
              {phone.isPrimary ? " · Primary" : ""}
              {phone.whatsapp ? " · WhatsApp" : ""}
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
        </a>
      ))}
      
      {card.emails.map((email) => (
        <a key={email.id} href={`mailto:${email.address}`} className={styles.linkCard} onClick={trackClick}>
          <div className={styles.linkIcon}><Mail size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.linkTitle}>{email.address}</div>
            <div className={styles.linkSub}>
              {email.label || email.type}
              {email.isPrimary ? " · Primary" : ""}
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
        </a>
      ))}

      {card.addresses.map((address) => (
        <a
          key={address.id}
          href={
            address.mapUrl ||
            `https://maps.google.com/?q=${encodeURIComponent(
              [address.street, address.city, address.state, address.country].filter(Boolean).join(", ")
            )}`
          }
          className={styles.linkCard}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
        >
          <div className={styles.linkIcon}><MapPin size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.linkTitle}>{address.label || address.city || "Address"}</div>
            <div className={styles.linkSub}>
              {[address.street, address.city, address.state, address.postalCode, address.country]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
        </a>
      ))}
    </Section>
  );
}

function WebsiteList({ card, trackClick }: { card: VCard, trackClick: () => void }) {
  if (!card.websites.length) return null;

  const websites = [...card.websites].sort((a, b) => Number(b.featured) - Number(a.featured));
  return (
    <Section title="Websites">
      {websites.map((website) => (
        <a
          key={website.id}
          href={website.url}
          className={styles.linkCard}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
        >
          <div className={styles.linkIcon}><Globe size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.linkTitle}>{website.label}</div>
            <div className={styles.linkSub}>
              {website.url.replace(/^https?:\/\//, "")}
              {website.featured ? " · Featured" : ""}
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
        </a>
      ))}
    </Section>
  );
}

function SocialConnect({ card, trackClick }: { card: VCard, trackClick: () => void }) {
  const links = getVisibleSocialLinks(card);
  if (!links.length) return null;

  return (
    <section>
      <h2 className={styles.sectionLabel}>Connect</h2>
      <div className={styles.socialGrid} onClick={trackClick}>
        {links.map((link) => (
          <SocialIcon
            key={link.id}
            platform={link.platform}
            url={link.url}
            handle={link.handle}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── PUBLIC CARD (ROOT EXPORT) ───────────────── */
export default function PublicCard({ card }: { card: VCard }) {
  const actionLinks = getVisibleActionLinks(card);
  const paymentLinks = getVisiblePaymentLinks(card);
  const mediaEmbeds = getVisibleMediaEmbeds(card);

  const [cardUrl, setCardUrl] = useState(`https://imprint.com/${card.settings.slug}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCardUrl(window.location.href);
    }
  }, []);

  const trackClick = () => {
    // Fire-and-forget analytics API call
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id }),
    }).catch(console.error);
  };

  const handleDownloadImage = async () => {
    trackClick();
    const cardElement = document.getElementById(`public-vcard-container-${card.id}`);
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: null, // Keep transparent or computed
      });
      const imageUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${getDisplayName(card).replace(/\s+/g, "_")}_BusinessCard.png`;
      downloadLink.href = imageUrl;
      downloadLink.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  };

  const whatsappPhone = card.phones.find((p) => p.whatsapp);

  return (
    <div className={styles.wrapper}>
      <article className={styles.card} id={`public-vcard-container-${card.id}`}>
        <CardHeader card={card} />
        
        <div className={styles.body}>
          
          <div className={styles.quickRow}>
            {card.settings.vcfDownloadEnabled && (
              <a href={`/api/vcf/${card.settings.slug}`} className={styles.mainCta} onClick={trackClick}>
                <Download size={18} /> Save Contact
              </a>
            )}
            
            {card.settings.leadCaptureEnabled && (
              <LeadCapture vcardId={card.id} trackClick={trackClick} />
            )}

            <div className={styles.secondaryRow}>
              <button 
                className={styles.secondaryCta}
                onClick={handleDownloadImage}
              >
                <ImageIcon size={16} /> Save as Image
              </button>

              <button 
                className={styles.secondaryCta}
                onClick={() => {
                  trackClick();
                  if (navigator.share) {
                    navigator.share({ title: getDisplayName(card), url: window.location.href });
                  }
                }}
              >
                <Share2 size={16} /> Share
              </button>
              
              {whatsappPhone?.whatsapp && (
                <a 
                  href={`https://wa.me/${whatsappPhone.number?.replace(/\D/g, "") || ""}`}
                  className={styles.secondaryCta}
                  style={{ gridColumn: "span 2" }}
                  target="_blank"
                  onClick={trackClick}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
            </div>
          </div>

          <ContactList card={card} trackClick={trackClick} />
          <SocialConnect card={card} trackClick={trackClick} />
          <WebsiteList card={card} trackClick={trackClick} />

          {/* Featured Links */}
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

          {/* Payment Section */}
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

          {/* Media Section */}
          {mediaEmbeds.length > 0 && (
            <Section title="Media">
              {mediaEmbeds.map(embed => (
                <a key={embed.id} href={embed.url} className={styles.linkCard} target="_blank" onClick={trackClick}>
                  <div className={styles.linkIcon}>
                    {embed.type === 'youtube' ? <Play size={18} /> : <FileText size={18} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.linkTitle}>{embed.title || embed.type}</div>
                    <div className={styles.linkSub}>Tap to open</div>
                  </div>
                  <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
                </a>
              ))}
            </Section>
          )}

        </div>

        {/* QR Code Section */}
        <div className={styles.publicQrSection} suppressHydrationWarning>
          <div className={styles.publicQrBox}>
            <QRCode 
              value={cardUrl} 
              size={136} 
              style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
              fgColor="#000000" 
            />
          </div>
          <p className={styles.publicQrText}>Scan with phone camera</p>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLabel}>Create your own digital card</div>
          <a href="/" className={styles.footerLogo} style={{ textDecoration: 'none', color: 'var(--text-1)' }}>Imprint</a>
        </footer>
      </article>

      {/* Sticky Mobile CTA */}
      {card.settings.vcfDownloadEnabled && (
        <div className={styles.stickyCtaBar}>
          <a href={`/api/vcf/${card.settings.slug}`} className={styles.mainCta} onClick={trackClick}>
            <Download size={18} /> Save Contact
          </a>
          <button 
            className={styles.secondaryCta}
            onClick={() => {
              trackClick();
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: getDisplayName(card), url: window.location.href });
              }
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
