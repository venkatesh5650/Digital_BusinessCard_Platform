"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./landing.module.css";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>I</div>
            <span className={styles.logoText}>Imprint</span>
          </Link>
          <ul className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.navRight}>
          <ThemeToggle />
          <Link href="/auth/signin" className={styles.navLoginLink}>
            Log In
          </Link>
          <Link href="/auth/register" className={`btn btn-primary ${styles.navCta}`}>
            Create my card
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.navLink}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/auth/signin"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          Log In
        </Link>
        <Link
          href="/auth/register"
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={() => setMenuOpen(false)}
        >
          Create my card
        </Link>
      </div>
    </>
  );
}
