"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createCard, deleteCard } from "@/lib/actions";
import {
  Eye,
  MousePointerClick,
  Users,
  CreditCard,
  Plus,
  Trash2,
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
  layout: string;
  colorPrimary: string;
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
  "linear-gradient(135deg, #ffffff 0%, #ff6b00 100%)",
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

import { motion, AnimatePresence } from "framer-motion";

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
  const [, setTick] = useState(0); 
  const [draftModalCard, setDraftModalCard] = useState<CardData | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"create" | "delete" | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    if (searchParams.get("create") === "true") {
      handleCreateNewCard();
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

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

  const handleCreateNewCard = () => {
    setActiveAction("create");
    startTransition(async () => {
      await createCard();
    });
  };

  const handleDeleteCard = async (id: string) => {
    setCardToDelete(null);
    setActiveAction("delete");
    startTransition(async () => {
      const result = await deleteCard(id);
      if (result?.error) {
        alert(result.error);
        setActiveAction(null);
      } else {
        setStats(prev => ({
          ...prev,
          cards: prev.cards.filter(c => c.id !== id),
          totalCards: prev.totalCards - 1
        }));
        setActiveAction(null);
      }
    });
  };

  useEffect(() => {
    const poll = setInterval(() => { if (!document.hidden) fetchStats(); }, 30_000);
    const onVisible = () => { if (!document.hidden) fetchStats(); };
    document.addEventListener("visibilitychange", onVisible);
    const tick = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchStats]);

  const statItems = [
    { label: "Active Assets", value: stats.totalCards, icon: CreditCard, color: "#ff6b00" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, color: "#ff6b00" },
    { label: "Total Clicks", value: stats.totalClicks, icon: MousePointerClick, color: "#ff6b00" },
    { label: "Leads Collected", value: stats.totalLeads, icon: Users, color: "#ff6b00" },
  ];

  return (
    <>
      {/* ── Page Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.pageHeader}
      >
        <h1 className={styles.pageTitle}>
          {mounted ? getGreeting() : "Welcome back"}, {firstName} <span className={styles.wave}>👋</span>
        </h1>
        <button 
          className={styles.btnPrimary}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '14px', 
            boxShadow: '0 10px 30px rgba(255, 107, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          onClick={handleCreateNewCard}
          disabled={isPending}
        >
          <Plus size={18} strokeWidth={3} /> 
          <span style={{ fontWeight: 800 }}>CREATE NEW DIGITAL CARD</span>
        </button>
      </motion.div>

      {/* ── Intelligence Grid (Industry Standard 4-Col) ── */}
      <div className={styles.intelligenceStage}>
          {statItems.map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.subInsightCard}
            >
                <div className={styles.subInsightIcon} style={{ background: `${item.color}15`, color: item.color }}>
                  <item.icon size={22} />
                </div>
                <div className={styles.subInsightContent}>
                  <div className={styles.subInsightValue}>
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className={styles.subInsightLabel}>{item.label}</div>
                </div>
            </motion.div>
          ))}
      </div>

      {/* ── Cards Section ── */}
      <div className={styles.cardsSection}>
        <div className={styles.cardsSectionHeader}>
           <h2 className={styles.cardsSectionTitle} style={{ fontSize: '24px', fontWeight: 800 }}>Your Collection</h2>
           <span className={styles.cardCountBadge}>{stats.totalCards} cards</span>
        </div>

        {stats.cards.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.emptyState}>
            <div className={styles.emptyIcon}>💳</div>
            <h3 className={styles.emptyTitle}>Your wallet is empty</h3>
            <p className={styles.emptyDesc}>Design your first professional identity in seconds.</p>
            <button className={styles.btnPrimary} onClick={handleCreateNewCard} disabled={isPending}>
              <Plus size={18} /> Start Designing
            </button>
          </motion.div>
        ) : (
          <div className={styles.cardsGrid}>
            <AnimatePresence mode="popLayout">
              {stats.cards.map((card, idx) => {
                const name = card.displayName ?? `${card.firstName} ${card.lastName}`;
                const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
                
                return (
                  <motion.div 
                    layout
                    key={card.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className={styles.vCardContainer}
                    style={{ "--vcard-glow": card.colorPrimary } as any}
                  >
                    <div className={styles.vCardTop}>
                       <div className={styles.vCardHeader}>
                          <div className={styles.vCardAvatar} style={{ background: `linear-gradient(135deg, ${card.colorPrimary}, #000)` }}>
                             {card.avatarUrl ? <img src={card.avatarUrl} alt="" /> : initials}
                          </div>
                          <div className={styles.vCardMeta}>
                             <div className={styles.vCardName}>{name}</div>
                             <div className={styles.vCardTitle}>{card.jobTitle || "Professional Identity"}</div>
                          </div>
                          <div className={styles.vCardStatusWrapper}>
                             <div className={`${styles.vCardStatus} ${card.isPublished ? styles.vCardLive : styles.vCardDraft}`}>
                                {card.isPublished ? "LIVE" : "DRAFT"}
                             </div>
                          </div>
                       </div>

                       <div className={styles.vCardStatsMini}>
                          <div className={styles.vCardStatMini}>
                             <span><AnimatedNumber value={card.totalViews} /></span>
                             <label>Views</label>
                          </div>
                          <div className={styles.vCardStatMini}>
                             <span><AnimatedNumber value={card.totalClicks} /></span>
                             <label>Clicks</label>
                          </div>
                          <div className={styles.vCardStatMini}>
                             <span><AnimatedNumber value={card.leadsCollected} /></span>
                             <label>Leads</label>
                          </div>
                       </div>
                    </div>

                    <div className={styles.vCardBottom}>
                       <div className={styles.vCardActions}>
                          <Link href={`/dashboard/card/${card.id}`} className={styles.vCardEditBtn}>
                             Edit Identity
                          </Link>
                          <ShareQRButton slug={card.slug} layout={card.layout} primaryColor={card.colorPrimary} />
                          <button 
                            className={styles.vCardDeleteBtn}
                            onClick={() => setCardToDelete(card.id)}
                            disabled={isPending}
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                    <div className={styles.vCardGlow} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals remain similarly styled but with framer-motion AnimatePresence for smoothness if needed */}
      <AnimatePresence>
        {cardToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.modalOverlay} onClick={() => setCardToDelete(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🗑️</div>
              <h2 className={styles.modalTitle} style={{ textAlign: 'center' }}>Permanently remove identity?</h2>
              <p className={styles.modalSubtitle} style={{ textAlign: 'center', marginTop: '12px' }}>This will destroy all analytics and leads for this card.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className={styles.btnSecondary} onClick={() => setCardToDelete(null)} style={{ flex: 1 }}>Keep it</button>
                <button className={styles.btnDanger} onClick={() => handleDeleteCard(cardToDelete)} style={{ flex: 1 }}>Confirm Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Modals */}
      {(isPending && activeAction) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ textAlign: "center", padding: "40px" }}>
            <div className={styles.loader} style={{ margin: "0 auto 20px" }}></div>
            <h2 className={styles.modalTitle}>
              {activeAction === "create" ? "Architecting your VCard..." : "Securely wiping data..."}
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
