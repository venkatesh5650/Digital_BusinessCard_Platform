"use client";

import React from "react";
import { Phone, Mail, MapPin, Globe, ChevronRight } from "lucide-react";
import styles from "../card.module.css";
import type { VCard } from "@/types";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      {title && <h2 className={styles.sectionLabel}>{title}</h2>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {children}
      </div>
    </section>
  );
}

export function ContactList({ card, trackClick }: { card: VCard; trackClick: () => void }) {
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

export function WebsiteList({ card, trackClick }: { card: VCard; trackClick: () => void }) {
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
