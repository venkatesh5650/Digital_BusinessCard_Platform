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
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(232,238,255,0.3)" }} />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.03)",
              color: "#e8eeff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none"
            }}
          />
        </div>
        {cards.length > 1 && (
          <select
            value={cardFilter}
            onChange={e => setCardFilter(e.target.value)}
            style={{
              padding: "12px 16px", borderRadius: 12, minWidth: 180,
              border: "1.5px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.03)",
              color: "#e8eeff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none"
            }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((lead) => {
            const isExpanded = expandedId === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                style={{
                  background: "rgba(255,255,255,0.042)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${isExpanded ? "rgba(0,245,212,0.25)" : "rgba(255,255,255,0.075)"}`,
                  borderRadius: 16, padding: "18px 22px", cursor: "pointer",
                  transition: "all 220ms ease",
                }}
              >
                {/* Main row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "linear-gradient(135deg, #00f5d4 0%, #0ea5e9 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#040b18", fontSize: 15, fontWeight: 800, fontFamily: "'Syne', sans-serif"
                  }}>
                    {lead.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#e8eeff", fontFamily: "'Syne', sans-serif" }}>
                      {lead.name}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(232,238,255,0.45)", marginTop: 2, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {lead.email && <span>{lead.email}</span>}
                      {lead.company && <span>· {lead.company}</span>}
                    </div>
                  </div>

                  {/* Card badge + time */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: "rgba(0,245,212,0.07)", color: "#00f5d4",
                      border: "1px solid rgba(0,245,212,0.18)"
                    }}>
                      <CreditCard size={11} /> {lead.cardName}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,238,255,0.30)", marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                      <CalendarDays size={11} /> {formatDate(lead.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px"
                  }}>
                    {lead.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Mail size={15} color="#a855f7" />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,238,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</div>
                          <a href={`mailto:${lead.email}`} style={{ color: "#e8eeff", fontSize: 14, textDecoration: "none" }}>{lead.email}</a>
                        </div>
                      </div>
                    )}
                    {lead.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Phone size={15} color="#60a5fa" />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,238,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</div>
                          <a href={`tel:${lead.phone}`} style={{ color: "#e8eeff", fontSize: 14, textDecoration: "none" }}>{lead.phone}</a>
                        </div>
                      </div>
                    )}
                    {lead.company && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Building2 size={15} color="#34d399" />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,238,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Company</div>
                          <div style={{ color: "#e8eeff", fontSize: 14 }}>{lead.company}</div>
                        </div>
                      </div>
                    )}
                    {lead.jobTitle && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Briefcase size={15} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,238,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Title</div>
                          <div style={{ color: "#e8eeff", fontSize: 14 }}>{lead.jobTitle}</div>
                        </div>
                      </div>
                    )}
                    {lead.note && (
                      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <StickyNote size={15} color="#ec4899" style={{ marginTop: 2 }} />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,238,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Note</div>
                          <div style={{ color: "#e8eeff", fontSize: 14, lineHeight: 1.5 }}>{lead.note}</div>
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
