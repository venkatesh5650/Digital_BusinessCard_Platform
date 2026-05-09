import styles from "./admin.module.css";

export default function AdminLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.skeleton} style={{ width: "240px", height: "32px", borderRadius: "8px", marginBottom: "8px" }} />
          <div className={styles.skeleton} style={{ width: "320px", height: "16px", borderRadius: "6px" }} />
        </div>
      </header>

      {/* Stats Skeleton */}
      <div className={styles.statsGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.statCard} style={{ borderStyle: "solid", opacity: 0.5 }}>
            <div className={styles.skeleton} style={{ width: "100px", height: "14px", borderRadius: "4px", marginBottom: "16px" }} />
            <div className={styles.skeleton} style={{ width: "140px", height: "36px", borderRadius: "8px", marginBottom: "12px" }} />
            <div className={styles.skeleton} style={{ width: "160px", height: "12px", borderRadius: "4px" }} />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "24px" }}>
        <div className={styles.statCard} style={{ height: "400px", opacity: 0.5 }}>
          <div className={styles.skeleton} style={{ width: "150px", height: "14px", borderRadius: "4px", marginBottom: "24px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3, 4].map((j) => (
              <div key={j} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div className={styles.skeleton} style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
                <div style={{ flex: 1 }}>
                  <div className={styles.skeleton} style={{ width: "120px", height: "14px", borderRadius: "4px", marginBottom: "6px" }} />
                  <div className={styles.skeleton} style={{ width: "180px", height: "10px", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.statCard} style={{ height: "400px", opacity: 0.5 }}>
          <div className={styles.skeleton} style={{ width: "180px", height: "14px", borderRadius: "4px", marginBottom: "24px" }} />
          <div className={styles.skeleton} style={{ width: "100%", height: "200px", borderRadius: "20px" }} />
        </div>
      </div>
    </div>
  );
}
