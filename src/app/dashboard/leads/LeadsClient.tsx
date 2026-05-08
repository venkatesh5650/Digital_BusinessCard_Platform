"use client";

import { useState, useMemo } from "react";
import { Search, Download, Mail, Phone, Building2, Briefcase, StickyNote, CalendarDays, CreditCard, Users } from "lucide-react";
import styles from "../dashboard.module.css";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  note: string | null;
  createdAt: string;
  cardName: string;
  cardSlug: string;
};

type CardOption = { id: string; name: string; slug: string };

export default function LeadsClient({ leads, cards }: { leads: Lead[]; cards: CardOption[] }) {
  const [search, setSearch] = useState("");
  const [cardFilter, setCardFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchesCard = cardFilter === "all" || l.cardSlug === cardFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        l.name.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.company?.toLowerCase().includes(q);
      return matchesCard && matchesSearch;
    });
  }, [leads, search, cardFilter]);

  function exportCSV() {
    const header = "Name,Email,Phone,Company,Job Title,Note,Card,Date\n";
    const rows = filtered.map(l =>
      [l.name, l.email || "", l.phone || "", l.company || "", l.jobTitle || "", (l.note || "").replace(/,/g, ";"), l.cardName, new Date(l.createdAt).toLocaleDateString()].join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neonglass-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Leads <span style={{ fontSize: 16, fontWeight: 400, color: "rgba(232,238,255,0.4)", marginLeft: 8 }}>{leads.length} total</span>
          </h1>
          <p className={styles.pageSubtitle}>People who shared their contact info through your cards.</p>
        </div>
        <div className={styles.headerActions}>
          {filtered.length > 0 && (
            <button className={styles.btnSecondary} onClick={exportCSV} style={{ gap: 6 }}>
              <Download size={15} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.leadsFilterBar}>
        <div className={styles.leadsSearchWrap}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(107, 114, 128, 0.5)" }} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.leadsSearchInput}
          />
        </div>
        {cards.length > 1 && (
          <select
            value={cardFilter}
            onChange={e => setCardFilter(e.target.value)}
            className={styles.leadsSelect}
          >
            <option value="all">All Cards</option>
            {cards.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <div className={styles.emptyTitle}>{leads.length === 0 ? "No leads yet" : "No matching leads"}</div>
          <p className={styles.emptyDesc}>
            {leads.length === 0
              ? "When someone fills out the 'Exchange Contacts' form on your card, they'll appear here instantly."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((lead) => {
            const isExpanded = expandedId === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                className={`${styles.leadCard} ${isExpanded ? styles.leadCardActive : ""}`}
              >
                {/* Main row */}
                <div className={styles.leadMainRow}>
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: "linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#ffffff", fontSize: 16, fontWeight: 800, fontFamily: "var(--font-d)",
                    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.2)"
                  }}>
                    {lead.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                  </div>
 
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-1)", fontFamily: "var(--font-d)" }}>
                      {lead.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      {lead.email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={12} /> {lead.email}</span>}
                      {lead.company && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>· <Building2 size={12} /> {lead.company}</span>}
                    </div>
                  </div>
 
                  {/* Card badge + time */}
                  <div className={styles.leadMeta}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: "var(--orange-dim)", color: "var(--orange)",
                      border: "1.5px solid rgba(255, 107, 0, 0.15)",
                      fontFamily: "var(--font-d)"
                    }}>
                      <CreditCard size={11} /> {lead.cardName}
                    </div>
                    <div className={styles.leadMetaTime} style={{ fontSize: 11, color: "var(--text-3)", marginTop: 8, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                      <CalendarDays size={12} /> {formatDate(lead.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)",
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
                    gap: "20px 24px",
                    animation: "fadeIn 0.2s ease"
                  }}>
                    {lead.email && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Mail size={16} color="#a855f7" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Email</div>
                          <a href={`mailto:${lead.email}`} style={{ color: "var(--text-1)", fontSize: 13, textDecoration: "none", fontWeight: 600, wordBreak: "break-all" }}>{lead.email}</a>
                        </div>
                      </div>
                    )}
                    {lead.phone && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Phone size={16} color="#3b82f6" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Phone</div>
                          <a href={`tel:${lead.phone}`} style={{ color: "var(--text-1)", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>{lead.phone}</a>
                        </div>
                      </div>
                    )}
                    {lead.company && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Building2 size={16} color="#10b981" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Company</div>
                          <div style={{ color: "var(--text-1)", fontSize: 14, fontWeight: 600 }}>{lead.company}</div>
                        </div>
                      </div>
                    )}
                    {lead.jobTitle && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Briefcase size={16} color="#f59e0b" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Job Title</div>
                          <div style={{ color: "var(--text-1)", fontSize: 14, fontWeight: 600 }}>{lead.jobTitle}</div>
                        </div>
                      </div>
                    )}
                    {lead.note && (
                      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(236, 72, 153, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <StickyNote size={16} color="#ec4899" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Note from User</div>
                          <div style={{ color: "var(--text-1)", fontSize: 13, lineHeight: 1.5, background: "var(--bg-hover)", padding: "10px 14px", borderRadius: 10, marginTop: 4 }}>
                            {lead.note}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
