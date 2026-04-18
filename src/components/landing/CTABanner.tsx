"use client";

import Link from "next/link";
import styles from "./landing.module.css";

export default function CTABanner() {
  return (
    <section className={styles.ctaBanner}>
      <h2 className={styles.ctaTitle}>Ready to make your Imprint?</h2>
      <p className={styles.ctaSubtitle}>
        Create your free digital business card and start sharing your
        professional identity in seconds.
      </p>
      <div className={styles.ctaActions}>
        <Link href="/auth/register" className="btn btn-primary">
          Create my card
        </Link>
        <a href="#features" className="btn btn-outline">
          Learn more
        </a>
      </div>
    </section>
  );
}
