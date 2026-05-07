"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode, X, Download, Link as LinkIcon, ArrowLeft } from "lucide-react";
import styles from "./dashboard.module.css";

export default function ShareQRButton({ 
  slug, 
  layout = "classic", 
  primaryColor = "#ff6b00" 
}: { 
  slug: string;
  layout?: string;
  primaryColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://imprint.cards/${slug}`;

  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-code-${slug}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
      }
      const link = document.createElement("a");
      link.download = `QR_${slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // ── Template-specific aesthetics ──
  const isWave = layout === 'wave';
  const isDiagonal = layout === 'diagonal';
  
  // Use a subtle version of primary color for backgrounds
  const glassBg = isWave ? "rgba(255, 255, 255, 0.95)" : isDiagonal ? "#0a0a0a" : "#0c1628";
  const textColor = isWave ? "#1a1a1a" : "#ffffff";
  const subTextColor = isWave ? "#64748b" : "rgba(232,238,255,0.55)";
  const modalBorder = isWave ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.13)";
  const borderRadius = isWave ? "32px" : "24px";

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.btnSecondary}>
        <QrCode size={14} /> Share
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: isWave ? "rgba(241, 245, 249, 0.85)" : "rgba(2, 6, 18, 0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "40px 20px",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: glassBg,
              border: modalBorder,
              borderRadius: borderRadius,
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
              position: "relative",
              margin: "auto 0",
              flexShrink: 0,
              boxShadow: isWave 
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
                : "0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)",
              overflow: "hidden"
            }}
          >
            {/* Template-specific Accent (Diagonal Slant) */}
            {isDiagonal && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "6px",
                background: primaryColor
              }} />
            )}

            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: isWave ? "rgba(0,0,0,0.05)" : "rgba(255, 255, 255, 0.10)",
                border: "none",
                color: textColor,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <h2
                style={{
                  fontFamily: isWave ? "'Plus Jakarta Sans', sans-serif" : "'Syne', sans-serif",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: textColor,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Share Card
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: subTextColor,
                  marginTop: "6px",
                }}
              >
                Scan or copy the link below
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
                boxShadow: isWave ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "0 4px 20px rgba(0,0,0,0.3)",
                border: isWave ? "1px solid #f1f5f9" : "none"
              }}
            >
              <QRCode
                id={`qr-code-${slug}`}
                value={cardUrl}
                size={220}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor={isDiagonal ? primaryColor : "#0a0f1e"}
              />
            </div>

            <div
              style={{
                background: isWave ? "#f8fafc" : "rgba(255, 255, 255, 0.05)",
                border: isWave ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "20px",
                fontSize: "12px",
                color: isWave ? primaryColor : "#ffffff",
                fontWeight: 600,
                textAlign: "center",
                wordBreak: "break-all"
              }}
            >
              {cardUrl}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleDownloadQR}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: primaryColor,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: `0 4px 14px ${primaryColor}44`
                }}
              >
                <Download size={18} />
                Download QR
              </button>

              <button
                onClick={copyLink}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "transparent",
                  color: textColor,
                  border: isWave ? "1px solid #e2e8f0" : "1.5px solid rgba(255,255,255,0.18)",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <LinkIcon size={18} color={copied ? primaryColor : (isWave ? "#64748b" : "#e8eeff")} />
                {copied ? "Link Copied!" : "Copy Link"}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  color: subTextColor,
                  border: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
