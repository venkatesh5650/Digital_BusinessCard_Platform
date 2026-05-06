"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { createCard } from "@/lib/actions";
import {
  Eye,
  MousePointerClick,
  Users,
  CreditCard,
  Plus,
} from "lucide-react";
import styles from "./dashboard.module.css";
import ShareQRButton from "./ShareQRButton";
import SubmitButton from "@/components/SubmitButton";

// ── Types ─────────────────────────────────────────────────────────────────────

type CardData = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
  totalViews: number;
  totalClicks: number;
  leadsCollected: number;
};

export type DashboardStats = {
  cards: CardData[];
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  totalCards: number;
  lastUpdated: string;
};

// ── Avatar palette ─────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #ff6b00 0%, #000000 100%)",
  "linear-gradient(135deg, #ff8c3a 0%, #ff6b00 100%)",
  "linear-gradient(135deg, #000000 0%, #333333 100%)",
  "linear-gradient(135deg, #ff5c00 0%, #ff8c3a 100%)",
  "linear-gradient(135deg, #111111 0%, #444444 100%)",
];

// ── Greeting by time of day ────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Animated number with requestAnimationFrame count-up ────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;

    const startTime = performance.now();
    const duration = 900;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
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

// ── Time ago util ──────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DashboardClient({
  firstName,
  initialStats,
}: {
  firstName: string;
  initialStats: DashboardStats;
}) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0); // forces re-render for timeAgo display
  const [draftModalCard, setDraftModalCard] = useState<CardData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handlePreviewClick(e: React.MouseEvent<HTMLAnchorElement>, card: CardData) {
    if (!card.isPublished) {
      e.preventDefault();
      setDraftModalCard(card);
    }
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) return;
      const data = (await res.json()) as DashboardStats;
      setStats(data);
      setLastRefreshed(new Date());
    } catch {
      // silently show stale data
    }
  }, []);

  useEffect(() => {
    // Poll every 30 seconds (only when tab is visible)
    const poll = setInterval(() => {
      if (!document.hidden) fetchStats();
    }, 30_000);

    // Re-fetch on tab focus
    const onVisible = () => {
      if (!document.hidden) fetchStats();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Tick every 10s so timeAgo display updates
    const tick = setInterval(() => setTick((t) => t + 1), 10_000);

    return () => {
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchStats]);

  const statItems = [
    {
      label: "Total Cards",
      value: stats.totalCards,
      color: "#ff6b00",
      dimColor: "rgba(255, 107, 0, 0.10)",
      Icon: CreditCard,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      color: "#ff6b00",
      dimColor: "rgba(255, 107, 0, 0.10)",
      Icon: Eye,
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      color: "#ff6b00",
      dimColor: "rgba(255, 107, 0, 0.10)",
      Icon: MousePointerClick,
    },
    {
      label: "Leads Collected",
      value: stats.totalLeads,
      color: "#ff6b00",
      dimColor: "rgba(255, 107, 0, 0.10)",
      Icon: Users,
    },
  ];

  return (
    <>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {mounted ? getGreeting() : "Welcome back"}, {firstName} 👋
          </h1>
          <p className={styles.pageSubtitle}>
            Real-time overview of your digital card performance.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.liveIndicator}>
            <span className={styles.livePulse} />
            Live
            <span className={styles.refreshTime} suppressHydrationWarning>
              · {timeAgo(lastRefreshed)}
            </span>
          </div>
          <form action={createCard}>
            <SubmitButton
              id="btn-create-card"
              className={styles.btnPrimary}
              style={{ flex: "none", whiteSpace: "nowrap" }}
              loadingText="Creating..."
            >
              <Plus size={15} strokeWidth={2.5} /> Create Card
            </SubmitButton>
          </form>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        {statItems.map((item, i) => (
          <div
            key={item.label}
            className={styles.statCard}
            data-delay={i}
            style={{ "--card-accent": item.color } as React.CSSProperties}
          >
            <div
              className={styles.statIconWrap}
              style={{ background: item.dimColor }}
            >
              <item.Icon size={20} color={item.color} strokeWidth={2} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                <AnimatedNumber value={item.value} />
              </div>
              <div className={styles.statLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cards Section ── */}
      <div className={styles.cardsSection}>
        <div className={styles.cardsSectionHeader}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className={styles.cardsSectionTitle}>Your Cards</span>
            <span className={styles.cardCount}>{stats.totalCards}</span>
          </div>
        </div>

        {stats.cards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💳</span>
            <div className={styles.emptyTitle}>No cards yet</div>
            <p className={styles.emptyDesc}>
              Create your first digital business card and start sharing it instantly.
            </p>
            <form action={createCard}>
              <SubmitButton
                id="btn-create-first-card"
                className={styles.btnPrimary}
                style={{ flex: "none", display: "inline-flex" }}
                loadingText="Creating..."
              >
                <Plus size={15} strokeWidth={2.5} /> Create My First Card
              </SubmitButton>
            </form>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {stats.cards.map((card, idx) => {
              const name =
                card.displayName ?? `${card.firstName} ${card.lastName}`;
              const initials = name
                .split(" ")
                .slice(0, 2)
                .map((w: string) => w[0])
                .join("")
                .toUpperCase();
              const avatarGradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

              return (
                <div key={card.id} className={styles.cardItem}>
                  {/* Header row */}
                  <div className={styles.cardItemHeader}>
                    <div
                      className={styles.cardAvatar}
                      style={{ background: avatarGradient }}
                    >
                      {initials}
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName}>{name}</div>
                      <div className={styles.cardTitle}>
                        {card.jobTitle || "No title set"}
                      </div>
                    </div>
                    <span
                      className={`${styles.publishedBadge} ${
                        card.isPublished ? styles.live : styles.draft
                      }`}
                    >
                      {card.isPublished ? "● Live" : "Draft"}
                    </span>
                  </div>

                  {/* Per-card analytics */}
                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <Eye size={16} color="#ff6b00" />
                      <div className={styles.cardStatValue}>
                        <AnimatedNumber value={card.totalViews} />
                      </div>
                      <div className={styles.cardStatLabel}>Views</div>
                    </div>
                    <div className={styles.cardStat}>
                      <MousePointerClick size={16} color="#ff6b00" />
                      <div className={styles.cardStatValue}>
                        <AnimatedNumber value={card.totalClicks} />
                      </div>
                      <div className={styles.cardStatLabel}>Clicks</div>
                    </div>
                    <div className={styles.cardStat}>
                      <Users size={16} color="#ff6b00" />
                      <div className={styles.cardStatValue}>
                        <AnimatedNumber value={card.leadsCollected} />
                      </div>
                      <div className={styles.cardStatLabel}>Leads</div>
                    </div>
                  </div>

                  {/* Public URL */}
                  <div className={styles.cardSlug}>
                    <a
                      href={`/${card.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handlePreviewClick(e, card)}
                    >
                      imprint.cards/{card.slug}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <Link
                      href={`/dashboard/card/${card.id}`}
                      className={styles.btnPrimary}
                    >
                      Edit Card
                    </Link>
                    <a
                      href={`/${card.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handlePreviewClick(e, card)}
                      className={styles.btnSecondary}
                    >
                      Preview
                    </a>
                    <ShareQRButton slug={card.slug} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Draft Modal ── */}
      {draftModalCard && (
        <div className={styles.modalOverlay} onClick={() => setDraftModalCard(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDraftModalCard(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 className={styles.modalTitle}>Card is Not Live!</h2>
              <p className={styles.modalSubtitle} style={{ marginTop: 12, lineHeight: 1.5 }}>
                <strong>{draftModalCard.displayName ?? draftModalCard.firstName}</strong> is currently set to <strong>Draft</strong>. 
                You must publish it in the Editor before it can be viewed by others!
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              <Link 
                href={`/dashboard/card/${draftModalCard.id}`}
                className={styles.btnPrimary} 
                style={{ width: "100%", padding: "14px", textDecoration: 'none' }}
              >
                Open Editor to Publish 🚀
              </Link>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setDraftModalCard(null)} 
                style={{ width: "100%", padding: "14px" }}
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
