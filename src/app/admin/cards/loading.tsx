import styles from "../admin.module.css";

export default function CardsLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.skeleton} style={{ width: "240px", height: "32px", borderRadius: "8px", marginBottom: "8px" }} />
          <div className={styles.skeleton} style={{ width: "320px", height: "16px", borderRadius: "6px" }} />
        </div>
        <div className={styles.skeleton} style={{ width: "300px", height: "44px", borderRadius: "12px" }} />
      </header>

      <div className={styles.adminGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.statCard} style={{ borderStyle: "solid", opacity: 0.5, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div className={styles.skeleton} style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
                <div>
                  <div className={styles.skeleton} style={{ width: "120px", height: "16px", borderRadius: "4px", marginBottom: "6px" }} />
                  <div className={styles.skeleton} style={{ width: "80px", height: "12px", borderRadius: "4px" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className={styles.skeleton} style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
                <div className={styles.skeleton} style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              </div>
            </div>
            <div className={styles.skeleton} style={{ width: "100%", height: "1px", marginBottom: "20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className={styles.skeleton} style={{ width: "180px", height: "14px", borderRadius: "4px" }} />
              <div className={styles.skeleton} style={{ width: "150px", height: "14px", borderRadius: "4px" }} />
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                <div className={styles.skeleton} style={{ width: "60px", height: "12px", borderRadius: "4px" }} />
                <div className={styles.skeleton} style={{ width: "60px", height: "12px", borderRadius: "4px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
