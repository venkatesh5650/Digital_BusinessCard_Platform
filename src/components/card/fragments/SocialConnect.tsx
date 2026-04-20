"use client";

import styles from "../card.module.css";
import SocialIcon from "../SocialIcon";
import type { VCard } from "@/types";
import { getVisibleSocialLinks } from "@/data/dummyCard";

export function SocialConnect({ card, trackClick }: { card: VCard; trackClick: () => void }) {
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
