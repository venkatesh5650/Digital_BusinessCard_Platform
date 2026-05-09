"use client";

import { Settings, Shield, Globe, Bell, Database, Lock } from "lucide-react";
import styles from "../admin.module.css";
import CyberGlassCard from "@/components/admin/CyberGlassCard";

export default function AdminSettings() {
  const settingsSections = [
    {
      title: "Platform Configuration",
      description: "Manage global settings for the Imprint VCard engine.",
      icon: Globe,
      items: ["Default Template", "Custom Domains", "White-label Branding"]
    },
    {
      title: "Security & Access",
      description: "Configure authentication providers and administrative permissions.",
      icon: Shield,
      items: ["Google OAuth", "Admin Roles", "IP Whitelisting"]
    },
    {
      title: "System Status",
      description: "Monitor database health and API performance.",
      icon: Database,
      items: ["Prisma Connection", "Edge Runtime Logs", "Cache Purge"]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ letterSpacing: "-0.03em" }}>System Settings</h1>
          <p className={styles.subtitle}>Configure platform-wide behavior and security protocols</p>
        </div>
      </header>

      <div className={styles.adminGrid}>
        {settingsSections.map((section, idx) => (
          <CyberGlassCard key={idx} delay={idx * 0.1}>
            <div style={{ padding: "24px" }}>
              <div className={styles.statLabel} style={{ color: "var(--accent)" }}>
                <section.icon size={18} />
                {section.title}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: "12px 0 20px 0", lineHeight: "1.5" }}>
                {section.description}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.items.map((item, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "10px 14px", 
                      background: "rgba(255,255,255,0.03)", 
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "var(--text-2)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    {item}
                    <Lock size={12} style={{ opacity: 0.3 }} />
                  </div>
                ))}
              </div>
            </div>
          </CyberGlassCard>
        ))}
      </div>

      {/* Development Notice */}
      <CyberGlassCard delay={0.4}>
        <div 
          style={{ 
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <div style={{ padding: "12px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", color: "var(--accent)" }}>
            <Settings className="animate-spin-slow" size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>Feature in Development</div>
            <p style={{ fontSize: "12px", color: "var(--text-3)" }}>
              The settings engine is currently being finalized. Full configuration capabilities will be available in Phase 4.
            </p>
          </div>
        </div>
      </CyberGlassCard>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
