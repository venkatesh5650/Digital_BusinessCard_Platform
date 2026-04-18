"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import styles from "./landing.module.css";

const FAQ_ITEMS = [
  {
    q: "How do I create a digital business card?",
    a: "Creating your Imprint card takes less than a minute. Sign up for free, add your contact details, profile photo, and company info. Customize the design with your brand colors and logo, then you're ready to start sharing instantly.",
  },
  {
    q: "Is Imprint free to use?",
    a: "Yes! Imprint is free for everyone. You get a fully customizable digital business card, QR code sharing, lead capture, and real-time analytics — all at no cost.",
  },
  {
    q: "How do I share my card with someone?",
    a: "Share your card by letting someone scan your QR code, sending them your unique link, or sharing a downloadable VCF contact file. Recipients don't need the app — your card opens beautifully in any web browser.",
  },
  {
    q: "Can I capture leads from my card?",
    a: "Absolutely. When someone views your card, they can share their details back with you using the built-in lead capture form. All leads flow directly to your dashboard in real-time.",
  },
  {
    q: "Can I customize the look of my card?",
    a: "Yes — you can customize your profile photo, company logo, brand colors, headline, bio, social links, and more. Your card is designed to look like you and represent your professional identity.",
  },
  {
    q: "What happens when I update my card info?",
    a: "Updates happen instantly. Anyone who opens your card link will always see your latest information — no need to reprint or redistribute. Your QR code and link stay the same.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
        <p className={styles.sectionSubtitle}>
          Everything you need to know about Imprint.
        </p>
      </div>

      <div className={styles.faqList}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {item.q}
                <Plus
                  size={20}
                  className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ""}`}
                />
              </button>
              <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ""}`}>
                <div className={styles.faqAnswerInner}>{item.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
