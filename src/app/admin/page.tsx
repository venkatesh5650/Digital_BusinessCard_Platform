import { Users, CreditCard, MousePointerClick, TrendingUp } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Administrative Overview</h1>
          <p className={styles.subtitle}>Platform-wide performance and user metrics</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <Users size={16} />
            Total Users
          </div>
          <div className={styles.statValue}>1,284</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <TrendingUp size={14} />
            +12% from last month
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <CreditCard size={16} />
            Active Cards
          </div>
          <div className={styles.statValue}>856</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <TrendingUp size={14} />
            +8% from last month
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <MousePointerClick size={16} />
            Card Interactions
          </div>
          <div className={styles.statValue}>42.5K</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <TrendingUp size={14} />
            +24% from last month
          </div>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className={styles.statCard} style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: "dashed" }}>
        <div style={{ textAlign: "center", color: "var(--text-3)" }}>
          <LayoutDashboard size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
          <p>Real-time activity stream and audit logs will appear here in Phase 3.</p>
        </div>
      </div>
    </div>
  );
}

// Reuse icon for placeholder
import { LayoutDashboard } from "lucide-react";
