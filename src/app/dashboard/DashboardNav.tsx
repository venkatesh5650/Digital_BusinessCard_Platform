"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Users, LogOut, ExternalLink } from "lucide-react";
import styles from "./dashboard.module.css";

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/cards", label: "My Cards", icon: CreditCard },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
  ];

  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarLogo}>
        <div className={styles.logoIcon}>N</div>
        <span className={styles.logoText}>Imprint</span>
      </div>

      <Link href="/dashboard/cards?create=true" className={styles.createCardBtn}>
        <CreditCard size={18} />
        Create New Card
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
            title={label}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <a
          href="/"
          target="_blank"
          className={styles.navItem}
          title="View public site"
        >
          <ExternalLink size={18} />
          View Public Site
        </a>

        {/* User section */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name ?? "User"}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
          <button
            id="btn-signout"
            className={styles.signOutBtn}
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
