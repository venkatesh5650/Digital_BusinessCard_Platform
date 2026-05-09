import styles from "../admin.module.css";

export default function UsersLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.skeleton} style={{ width: "240px", height: "32px", borderRadius: "8px", marginBottom: "8px" }} />
          <div className={styles.skeleton} style={{ width: "320px", height: "16px", borderRadius: "6px" }} />
        </div>
        <div className={styles.skeleton} style={{ width: "300px", height: "44px", borderRadius: "12px" }} />
      </header>

      <div className={styles.statCard} style={{ padding: 0, overflow: "hidden", borderStyle: "solid", opacity: 0.5 }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", gap: "20px" }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={styles.skeleton} style={{ width: "100px", height: "14px", borderRadius: "4px" }} />
          ))}
        </div>
        <div style={{ padding: "20px" }}>
          {[1, 2, 3, 4, 5, 6].map(j => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
              <div className={styles.skeleton} style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
                <div className={styles.skeleton} style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
                <div style={{ flex: 1 }}>
                  <div className={styles.skeleton} style={{ width: "140px", height: "14px", borderRadius: "4px", marginBottom: "6px" }} />
                  <div className={styles.skeleton} style={{ width: "200px", height: "10px", borderRadius: "4px" }} />
                </div>
              </div>
              <div className={styles.skeleton} style={{ width: "100px", height: "20px", borderRadius: "20px" }} />
              <div className={styles.skeleton} style={{ width: "80px", height: "14px", borderRadius: "4px" }} />
              <div className={styles.skeleton} style={{ width: "60px", height: "24px", borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
