"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data Collection",
      icon: <Eye size={20} />,
      content: "We collect information you provide directly to us when you create a Digital Business Card, including your name, contact details, professional history, and social media links. We also collect analytics data such as view counts and lead capture information."
    },
    {
      title: "Administrative Oversight",
      icon: <Shield size={20} />,
      content: "To maintain platform integrity and provide technical support, authorized platform administrators have the ability to view all digital cards and user-provided data. This oversight is used strictly for content moderation, security auditing, and solving technical issues."
    },
    {
      title: "Data Security",
      icon: <Lock size={20} />,
      content: "We implement industry-standard security measures including encryption and secure socket layers (SSL) to protect your data. Your cards are stored in secure cloud environments with strictly controlled access."
    },
    {
      title: "Governing Law",
      icon: <Server size={20} />,
      content: "This Privacy Policy and your use of the platform are governed by the laws of the State of Telangana and the Republic of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad."
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "60px", lineHeight: "1.6" }}>
            Last updated: May 09, 2026. Your privacy and trust are our top priorities.
          </p>
        </motion.div>

        <div style={{ display: "grid", gap: "32px" }}>
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
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
          © 2026 Imprint. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
