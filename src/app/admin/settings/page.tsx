"use client";

import { useState, useEffect, useTransition } from "react";
import { Settings, Shield, Globe, Database, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import styles from "../admin.module.css";
import CyberGlassCard from "@/components/admin/CyberGlassCard";
import { getSystemSettings, updateSystemSettings } from "@/lib/admin-actions";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    async function load() {
      const data = await getSystemSettings();
      setSettings(data);
    }
    load();
  }, []);

  const handleToggle = (key: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    setSaveStatus("saving");
    startTransition(async () => {
      try {
        await updateSystemSettings(settings);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        setSaveStatus("error");
      }
    });
  };


  const sections = [
    {
      title: "Platform Configuration",
      description: "Manage global settings for the Imprint VCard engine.",
      icon: Globe,
      items: [
        { key: "defaultTemplate", label: "Default Template", type: "select", options: ["classic", "modern", "glass"] },
        { key: "customDomains", label: "Custom Domains", type: "toggle" },
        { key: "whiteLabel", label: "White-label Branding", type: "toggle" }
      ]
    },
    {
      title: "Security & Access",
      description: "Configure authentication providers and administrative permissions.",
      icon: Shield,
      items: [
        { key: "googleOAuth", label: "Google OAuth", type: "status", status: "Connected", color: "#3b82f6" },
        { key: "ipWhitelisting", label: "IP Whitelisting", type: "toggle" },
        { key: "maintenanceMode", label: "Maintenance Mode", type: "toggle" }
      ]
    },
    {
      title: "System Status",
      description: "Monitor database health and API performance.",
      icon: Database,
      items: [
        { label: "Prisma Connection", type: "status", status: "Operational", color: "#10b981" },
        { label: "Edge Runtime", type: "status", status: "Optimized", color: "#3b82f6" },
        { label: "Cache Layer", type: "status", status: "Hit (98%)", color: "#f59e0b" }
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ letterSpacing: "-0.03em" }}>System Settings</h1>
          <p className={styles.subtitle}>Configure platform-wide behavior and security protocols</p>
        </div>
        <button 
          className={styles.saveSettingsBtn}
          onClick={handleSave}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : saveStatus === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>
            {saveStatus === "saving" ? "Syncing..." : saveStatus === "success" ? "Changes Saved" : "Save Platform Config"}
          </span>
        </button>
      </header>

      <div className={styles.adminGrid}>
        {sections.map((section, idx) => (
          <CyberGlassCard key={idx} delay={idx * 0.1}>
            <div style={{ padding: "24px" }}>
              <div className={styles.statLabel} style={{ color: "var(--accent)" }}>
                <section.icon size={18} />
                {section.title}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: "12px 0 20px 0", lineHeight: "1.5" }}>
                {section.description}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.items.map((item: any, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "12px 16px", 
                      background: "var(--bg-muted)", 
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "var(--text-2)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{item.label}</span>
                    
                    {item.type === "toggle" && (
                      <button
                        onClick={() => handleToggle(item.key)}
                        style={{
                          width: "40px",
                          height: "22px",
                          borderRadius: "20px",
                          background: settings?.[item.key] ? "var(--accent)" : "var(--border-strong)",
                          border: "none",
                          position: "relative",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          opacity: settings ? 1 : 0.5
                        }}
                      >
                        <div style={{
                          width: "14px",
                          height: "14px",
                          background: "white",
                          borderRadius: "50%",
                          position: "absolute",
                          top: "4px",
                          left: settings?.[item.key] ? "22px" : "4px",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }} />
                      </button>
                    )}

                    {item.type === "select" && (
                      <select 
                        value={settings?.[item.key] || ""}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                        disabled={!settings}
                        style={{ 
                          background: "var(--bg-elevated)", 
                          border: "1px solid var(--border-strong)", 
                          color: "var(--text-1)", 
                          padding: "4px 8px", 
                          borderRadius: "6px",
                          fontSize: "12px",
                          outline: "none",
                          opacity: settings ? 1 : 0.5,
                          cursor: "pointer"
                        }}
                      >
                        {item.options.map((opt: string) => (
                          <option key={opt} value={opt} style={{ background: "var(--bg-elevated)", color: "var(--text-1)" }}>{opt.toUpperCase()}</option>
                        ))}
                      </select>
                    )}

                    {item.type === "status" && (
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        color: item.color || "var(--text-1)",
                        background: item.color ? `${item.color}15` : "var(--bg-hover)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        border: `1px solid ${item.color || "var(--border-strong)"}30`
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color || "var(--text-3)" }} />
                        {item.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CyberGlassCard>
        ))}
      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
