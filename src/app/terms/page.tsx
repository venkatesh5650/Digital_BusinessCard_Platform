"use client";

import { motion } from "framer-motion";
import { Scale, FileText, AlertCircle, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "User Conduct",
      icon: <Scale size={20} />,
      content: "Users are responsible for the content uploaded to their Digital Business Cards. Any use of the platform for spam, fraudulent activities, or hosting illegal content will result in immediate account termination."
    },
    {
      title: "Intellectual Property",
      icon: <FileText size={20} />,
      content: "The platform's design, technology, and branding (Imprint) are the intellectual property of the owners. Users retain ownership of their personal data but grant us a license to host and display it on their behalf."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertCircle size={20} />,
      content: "While we strive for 100% uptime, we are not liable for any business losses resulting from temporary service interruptions or data discrepancies."
    },
    {
      title: "Governing Law",
      icon: <HelpCircle size={20} />,
      content: "These terms are governed by the laws of Telangana, India. By using this service, you consent to the jurisdiction of the courts in Hyderabad for any legal proceedings."
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#fff", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-3)", textDecoration: "none", fontSize: "14px", marginBottom: "40px" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "16px", background: "linear-gradient(to right, #fff, rgba(255,255,255,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "60px", lineHeight: "1.6" }}>
            Version 1.0 — Effective as of May 09, 2026. Please read carefully.
          </p>
        </motion.div>

        <div style={{ display: "grid", gap: "32px" }}>
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                padding: "32px", 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.08)", 
                borderRadius: "24px",
                backdropFilter: "blur(12px)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--accent)", marginBottom: "16px" }}>
                {section.icon}
                <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>{section.title}</h2>
              </div>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <footer style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
          By using our platform, you acknowledge that you have read and understood these Terms.
        </footer>
      </div>
    </div>
  );
}
