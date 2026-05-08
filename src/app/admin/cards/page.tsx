import { getAdminCards, deleteAdminCard } from "@/lib/admin-actions";
import styles from "../admin.module.css";
import { CreditCard, ExternalLink, Trash2, User, Globe, Activity } from "lucide-react";
import Link from "next/link";

export default async function CardDirectoryPage() {
  const cards = await getAdminCards();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Card Directory</h1>
          <p className={styles.subtitle}>Oversight of all active digital business cards on the platform</p>
        </div>
      </header>

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {cards.map((c) => (
          <div key={c.id} className={styles.statCard}>
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
                <form action={async () => { "use server"; await deleteAdminCard(c.id); }}>
                  <button 
                    title="Delete Card" 
                    style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
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
        ))}
      </div>
    </div>
  );
}

// Support imports
import { Users } from "lucide-react";
