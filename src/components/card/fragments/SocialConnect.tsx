"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import styles from "../card.module.css";
import SocialIcon, { PlatformIcon } from "../SocialIcon";
import { Section } from "./Sections";
import type { VCard } from "@/types";
import { getVisibleSocialLinks } from "@/data/dummyCard";

interface SocialConnectProps {
  card: VCard;
  trackClick: () => void;
  layout?: "grid" | "list";
}

export function SocialConnect({ card, trackClick, layout = "grid" }: SocialConnectProps) {
  const links = getVisibleSocialLinks(card);
  if (!links.length) return null;

  if (layout === "list") {
    return (
      <Section title="Connect">
        {links.map((link) => (
          <a 
            key={link.id} 
            href={link.url} 
            className={styles.linkCard} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={trackClick}
          >
            <div className={styles.linkIcon}>
              <PlatformIcon platform={link.platform} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.linkTitle} style={{ textTransform: link.label ? 'none' : 'capitalize' }}>
                {link.label || link.platform}
              </div>
              <div className={styles.linkSub} style={{ textTransform: 'capitalize' }}>
                {link.label ? (link.handle || link.platform) : (link.platform === "whatsapp" ? "WhatsApp" : (link.handle || link.platform))}
              </div>
            </div>
            <ChevronRight size={14} color="var(--text-3, #a0aec0)" />
          </a>
        ))}
      </Section>
    );
  }

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
