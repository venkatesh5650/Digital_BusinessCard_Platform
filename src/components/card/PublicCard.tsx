"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Download, Share2, ImageIcon } from "lucide-react";
import styles from "./card.module.css";
import type { VCard } from "@/types";
import { getDisplayName } from "@/data/dummyCard";

// Templates
import ClassicTemplate from "./templates/ClassicTemplate";
import WaveTemplate from "./templates/WaveTemplate";
import DiagonalTemplate from "./templates/DiagonalTemplate";

export default function PublicCard({ card, isEditor = false }: { card: VCard, isEditor?: boolean }) {
  const [cardUrl, setCardUrl] = useState(`https://imprint.cards/${card?.settings?.slug || ""}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCardUrl(window.location.href);
    }
  }, []);

  const trackClick = () => {
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
        scale: 2,
        useCORS: true,
        backgroundColor: null,
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

  // ── Template Switching Logic ──
  const layout = card.theme.layout || "classic";
  
  const renderTemplate = () => {
    const props = { card, trackClick, handleDownloadImage };
    switch (layout) {
      case "wave":
        return <WaveTemplate {...props} />;
      case "diagonal":
        return <DiagonalTemplate {...props} />;
      case "classic":
      default:
        return <ClassicTemplate {...props} />;
    }
  };

  return (
    <div className={`${styles.wrapper} ${isEditor ? styles.editorWrapper : ""}`}>
      <div className={styles.cardContainer}>
        {/* QR Code — renders above the card on mobile */}
        {!isEditor && (
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
        )}

        {renderTemplate()}
      </div>

      {/* ── SHARED FOOTER BLOCKS (Hidden in Editor) ── */}
      {!isEditor && (
        <div className={styles.sharedElements}>
          <footer className={styles.footer}>
            <div className={styles.footerLabel}>Create your own digital card</div>
            <a href="/" className={styles.footerLogo} style={{ textDecoration: 'none', color: 'var(--text-1)' }}>Imprint</a>
          </footer>

          {/* Sticky Mobile CTA */}
          {card?.settings?.vcfDownloadEnabled && (
            <div className={styles.stickyCtaBar}>
              <a href={`/api/vcf/${card?.settings?.slug}`} className={styles.mainCta} onClick={trackClick}>
                <Download size={18} /> Save Contact
              </a>
              <button 
                className={styles.secondaryCta}
                onClick={() => {
                  trackClick();
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: getDisplayName(card), url: typeof window !== 'undefined' ? window.location.href : "" });
                  }
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
