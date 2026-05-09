"use client";

import { useState, useMemo } from "react";
import { 
  CreditCard, 
  ExternalLink, 
  Trash2, 
  User, 
  Globe, 
  Activity, 
  Users,
  Search
} from "lucide-react";
import Link from "next/link";
import styles from "../admin.module.css";
import CyberGlassCard from "@/components/admin/CyberGlassCard";
import CyberModal from "@/components/admin/CyberModal";
import { deleteAdminCard } from "@/lib/admin-actions";

export default function CardDirectoryClient({ initialCards }: { initialCards: any[] }) {
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    cardId: string;
    cardName: string;
  }>({
    isOpen: false,
    cardId: "",
    cardName: "",
  });

  const filteredCards = useMemo(() => {
    return initialCards.filter(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.user.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, initialCards]);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteAdminCard(modalConfig.cardId);
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      cardId: id,
      cardName: name,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ letterSpacing: "-0.03em" }}>Card Directory</h1>
          <p className={styles.subtitle}>Oversight of all active digital business cards on the platform</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input 
            type="text" 
            placeholder="Search cards..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 14px 12px 42px", 
              background: "var(--bg-surface)", 
              border: "1px solid var(--border)", 
              borderRadius: "12px",
              color: "var(--text-1)",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
      </header>

      {/* Cards Grid */}
      <div className={styles.adminGrid}>
        {filteredCards.map((c, idx) => (
          <CyberGlassCard key={c.id} delay={idx * 0.05}>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className={styles.logoIcon} style={{ width: 40, height: 40, borderRadius: "10px" }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)" }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-3)" }}>{c.jobTitle}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link 
                    href={`/${c.slug}`} 
                    target="_blank" 
                    className={styles.navItem} 
                    style={{ padding: "8px", borderRadius: "8px" }}
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <button 
                    onClick={() => openDeleteModal(c.id, `${c.firstName} ${c.lastName}`)}
                    title="Delete Card" 
                    style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.navDivider} style={{ margin: "16px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)" }}>
                  <User size={14} style={{ color: "var(--text-3)" }} />
                  <span>Owner: <strong>{c.user.name ?? "Anonymous"}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)" }}>
                  <Globe size={14} style={{ color: "var(--text-3)" }} />
                  <span>Slug: <code style={{ color: "var(--accent)" }}>/{c.slug}</code></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-3)" }}>
                    <Activity size={14} />
                    {c.totalViews} Views
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-3)" }}>
                    <Users size={14} />
                    {c.leadsCollected} Leads
                  </div>
                </div>
              </div>
            </div>
          </CyberGlassCard>
        ))}
        
        {filteredCards.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
            <Search size={48} style={{ opacity: 0.1, marginBottom: "16px" }} />
            <p>No cards found matching your search</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <CyberModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDelete}
        isLoading={isProcessing}
        variant="DANGER"
        title="Delete Digital Card"
        description={`Are you sure you want to permanently delete the card for "${modalConfig.cardName}"? This will also remove all associated analytics and leads.`}
        confirmLabel="Delete Card"
      />
    </div>
  );
}
