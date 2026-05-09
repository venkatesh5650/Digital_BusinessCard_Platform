"use client";

import { motion } from "framer-motion";
import { Shield, Scale, ArrowUpRight, Clock, FileText } from "lucide-react";
import Link from "next/link";
import styles from "../dashboard.module.css";

export default function UserLegalPage() {
  const documents = [
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your digital identity data.",
      href: "/privacy",
      icon: <Shield size={24} className={styles.accentIcon} />
    },
    {
      title: "Terms & Conditions",
      description: "The rules, guidelines, and legal agreements for using our platform.",
      href: "/terms",
      icon: <Scale size={24} className={styles.accentIcon} />
    }
  ];

  return (
    <div style={{ padding: "40px 20px" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>Legal & Compliance</h1>
        <p style={{ color: "var(--text-3)", fontSize: "16px" }}>Review the agreements and policies that govern your account.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {documents.map((doc, idx) => (
          <motion.div
            key={doc.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ 
              padding: "32px", 
              background: "rgba(255,255,255,0.02)", 
              border: "1px solid var(--border)", 
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255, 107, 0, 0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--accent)"
            }}>
              {doc.icon}
            </div>

            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>{doc.title}</h3>
              <p style={{ color: "var(--text-3)", fontSize: "14px", lineHeight: "1.6" }}>{doc.description}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "auto" }}>
              <Link 
                href={doc.href} 
                className={styles.createCardBtn} 
                style={{ flex: 1, textDecoration: "none", display: "flex", justifyContent: "center", gap: "8px" }}
              >
                View Full Document <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ 
        marginTop: "40px", 
        padding: "24px", 
        background: "rgba(255,255,255,0.01)", 
        border: "1px dashed var(--border)", 
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{ color: "var(--text-3)" }}><Clock size={20} /></div>
        <div style={{ fontSize: "14px", color: "var(--text-3)" }}>
          Your current agreements are based on the **May 09, 2026** version. Any future updates will be notified via email.
        </div>
      </div>
    </div>
  );
}
