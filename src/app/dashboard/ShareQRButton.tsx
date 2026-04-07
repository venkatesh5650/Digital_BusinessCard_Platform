"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode, X, Download, Link as LinkIcon } from "lucide-react";
import styles from "./dashboard.module.css";

export default function ShareQRButton({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const cardUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://neonglass.me/${slug}`;

  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-code-${slug}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${slug}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    alert("Link copied!");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.btnSecondary}>
        <QrCode size={14} /> Share
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Your Card QR</h2>
              <p className={styles.modalSubtitle}>Scan to view your digital card</p>
            </div>

            <div className={styles.qrContainer}>
              <QRCode
                id={`qr-code-${slug}`}
                value={cardUrl}
                size={220}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor="#111111"
              />
            </div>

            <div className={styles.qrActions}>
              <button
                onClick={handleDownloadQR}
                className={styles.btnPrimary}
                style={{ width: "100%", padding: "12px" }}
              >
                <Download size={16} /> Download High-Res QR
              </button>
              <button
                onClick={copyLink}
                className={styles.btnSecondary}
                style={{ width: "100%", padding: "12px" }}
              >
                <LinkIcon size={16} /> Copy Direct Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
