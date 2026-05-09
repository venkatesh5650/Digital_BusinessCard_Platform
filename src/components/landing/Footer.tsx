"use client";

import Link from "next/link";
import styles from "./landing.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>I</div>
            <span className={styles.logoText}>Imprint</span>
          </Link>
          <p className={styles.footerTagline}>
            The modern digital business card platform. Share who you are,
            capture contacts, and track your networking impact.
          </p>
        </div>

        <div className={styles.footerColumn}>
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><Link href="/auth/register">Create my card</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Support</h4>
          <ul>
            <li><a href="#faq">Help Center</a></li>
            <li><a href="mailto:support@imprint.cards">Contact Us</a></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Legal</h4>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} Imprint. All rights reserved.
      </div>
    </footer>
  );
}
