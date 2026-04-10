"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode, X, Download, Link as LinkIcon, ArrowLeft } from "lucide-react";
import styles from "./dashboard.module.css";

export default function ShareQRButton({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
      // 2× for high-res
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

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setIsOpen(true)} className={styles.btnSecondary}>
        <QrCode size={14} /> Share
      </button>

      {/* Modal — inline styles guarantee visibility regardless of CSS variable scope */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(2, 6, 18, 0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0c1628",
              border: "1px solid rgba(255, 255, 255, 0.13)",
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
              position: "relative",
              margin: "auto 0",
              flexShrink: 0,
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* ── X close button — always white ── */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.10)",
                border: "1.5px solid rgba(255, 255, 255, 0.28)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 150ms",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.20)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.10)";
              }}
            >
              <X size={18} color="#ffffff" strokeWidth={2.5} />
            </button>

            {/* ── Header ── */}
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.4px",
                }}
              >
                Share Your Card
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(232,238,255,0.55)",
                  marginTop: "6px",
                  fontWeight: 300,
                }}
              >
                Scan to open · or copy the link below
              </p>
            </div>

            {/* ── QR Code ── */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <QRCode
                id={`qr-code-${slug}`}
                value={cardUrl}
                size={220}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor="#0a0f1e"
              />
            </div>

            {/* ── URL chip ── */}
            <div
              style={{
                background: "rgba(0, 245, 212, 0.07)",
                border: "1px solid rgba(0, 245, 212, 0.18)",
                borderRadius: "10px",
                padding: "9px 14px",
                marginBottom: "16px",
                fontSize: "12px",
                color: "#00f5d4",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "0.2px",
              }}
            >
              {cardUrl}
            </div>

            {/* ── Action buttons ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Download */}
              <button
                onClick={handleDownloadQR}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  background: "linear-gradient(135deg, #00f5d4 0%, #0ea5e9 100%)",
                  color: "#040b18",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  letterSpacing: "0.1px",
                }}
              >
                <Download size={16} color="#040b18" strokeWidth={2.5} />
                Download QR Code
              </button>

              {/* Copy link */}
              <button
                onClick={copyLink}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  background: "rgba(255,255,255,0.07)",
                  color: "#e8eeff",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 150ms",
                }}
              >
                <LinkIcon size={16} color={copied ? "#00f5d4" : "#e8eeff"} />
                {copied ? "✓ Link Copied!" : "Copy Link"}
              </button>

              {/* ── Back / Close ── */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  background: "transparent",
                  color: "rgba(232,238,255,0.65)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  transition: "color 150ms, border-color 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(232,238,255,0.65)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                }}
              >
                <ArrowLeft size={15} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
