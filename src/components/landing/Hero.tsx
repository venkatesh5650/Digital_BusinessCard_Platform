"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./landing.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <h1 className={styles.heroTitle}>
          Turn first connections into real opportunity
        </h1>
        <p className={styles.heroSubtitle}>
          Share who you are in seconds, capture contacts and remember
          conversations — all synced to where you work best.
        </p>
        <div className={styles.heroActions}>
          <Link href="/auth/register" className="btn btn-primary">
            Create my card
          </Link>
          <Link href="/auth/signin" className="btn btn-outline">
            Log In
          </Link>
        </div>
      </motion.div>

      <motion.div
        className={styles.heroMedia}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className={styles.phoneFrame}>
          {/* Video slot — swap src when user provides hero-share.mp4 */}
          <video
            src="/videos/hero-share.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-mockup.png"
            style={{ width: "100%", display: "block" }}
            onError={(e) => {
              // If video not found, hide it so poster/fallback shows
              (e.target as HTMLVideoElement).style.display = "none";
              const img = document.createElement("img");
              img.src = "/images/hero-mockup.png";
              img.alt = "Imprint digital business card preview";
              img.style.width = "100%";
              (e.target as HTMLVideoElement).parentElement?.appendChild(img);
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
