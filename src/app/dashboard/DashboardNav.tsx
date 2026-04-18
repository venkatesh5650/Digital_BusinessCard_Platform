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

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Public site link */}
      <a
        href="/"
        target="_blank"
        className={styles.navItem}
        style={{ marginTop: "auto", color: "#6b7280" }}
      >
        <ExternalLink size={18} />
        View Site
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
    </aside>
  );
}
