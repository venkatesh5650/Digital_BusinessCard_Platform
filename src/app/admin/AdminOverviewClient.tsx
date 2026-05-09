"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  MousePointerClick, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  UserCheck 
} from "lucide-react";
import styles from "./admin.module.css";
import CyberGlassCard from "@/components/admin/CyberGlassCard";
import { useRouter } from "next/navigation";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

// ── Animated number with requestAnimationFrame count-up (Consistent with Dashboard) ──
function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;

    const startTime = performance.now();
    const duration = 1200;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 4; // Quartic ease out
      setDisplayed(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <>{displayed.toLocaleString()}</>;
}

type ActivityItem = {
  id: string;
  type: "CARD_CREATED" | "LEAD_CAPTURED";
  user: string;
  target: string;
  date: Date;
};

type AdminStats = {
  users: number;
  cards: number;
  leads: number;
  interactions: number;
};

export default function AdminOverviewClient({ 
  initialStats, 
  activity 
}: { 
  initialStats: AdminStats;
  activity: ActivityItem[];
}) {
  const router = useRouter();

  // Force a refresh on mount to clear any stale client-side router cache
  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ letterSpacing: "-0.03em" }}>Administrative Overview</h1>
          <p className={styles.subtitle}>Real-time platform performance and growth metrics</p>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.livePulse} />
          System Live
        </div>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <CyberGlassCard delay={0.1}>
          <div className={styles.statCard} style={{ background: "transparent", border: "none" }}>
            <div className={styles.statLabel}>
              <Users size={16} />
              Total Users
            </div>
            <div className={styles.statValue}>
              <AnimatedNumber value={initialStats.users} />
            </div>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} />
              Active platform members
            </div>
          </div>
        </CyberGlassCard>

        <CyberGlassCard delay={0.2}>
          <div className={styles.statCard} style={{ background: "transparent", border: "none" }}>
            <div className={styles.statLabel}>
              <CreditCard size={16} />
              Active Cards
            </div>
            <div className={styles.statValue}>
              <AnimatedNumber value={initialStats.cards} />
            </div>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} />
              Digital identities published
            </div>
          </div>
        </CyberGlassCard>

        <CyberGlassCard delay={0.3}>
          <div className={styles.statCard} style={{ background: "transparent", border: "none" }}>
            <div className={styles.statLabel}>
              <MousePointerClick size={16} />
              Total Interactions
            </div>
            <div className={styles.statValue}>
              <AnimatedNumber value={initialStats.interactions} />
            </div>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} />
              Combined profile engagement
            </div>
          </div>
        </CyberGlassCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "24px" }}>
        {/* Recent Activity */}
        <CyberGlassCard delay={0.4}>
          <div style={{ padding: "24px" }}>
            <div className={styles.statLabel} style={{ marginBottom: "24px", color: "var(--accent)" }}>
              <Clock size={16} />
              Live Activity Stream
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {activity.map((item) => (
                <div key={item.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px", 
                  padding: "14px", 
                  background: "rgba(255,255,255,0.02)", 
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: "10px", 
                    background: item.type === "CARD_CREATED" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.type === "CARD_CREATED" ? "#3b82f6" : "#10b981"
                  }}>
                    {item.type === "CARD_CREATED" ? <PlusCircle size={18} /> : <UserCheck size={18} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>
                      {item.user}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.type === "CARD_CREATED" ? "Created " : "Captured "}
                      <span style={{ color: "var(--accent)", fontWeight: 500 }}>{item.target}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600 }}>
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}

              {activity.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)" }}>
                  No recent activity recorded.
                </div>
              )}
            </div>
          </div>
        </CyberGlassCard>

        {/* Analytics Growth */}
        <CyberGlassCard delay={0.5}>
          <div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
            <div className={styles.statLabel} style={{ marginBottom: "20px" }}>
              <TrendingUp size={16} />
              Platform Growth Trend
            </div>
            
            <div style={{ flex: 1, minHeight: "140px" }}>
              <AnalyticsChart />
            </div>

            <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Projected User Growth</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981" }}>+24% Next Month</span>
              </div>
            </div>
          </div>
        </CyberGlassCard>
      </div>

      <style jsx global>{`
        .${styles.liveIndicator} {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #10b981;
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .${styles.livePulse} {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}
