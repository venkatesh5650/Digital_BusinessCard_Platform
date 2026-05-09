"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import styles from "./admin.module.css";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

export default function AdminNav({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/cards", label: "Card Directory", icon: CreditCard },
    { href: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  const handleNavClick = () => {
    // Explicitly purge the router cache to ensure fresh data on navigation
    router.refresh();
  };

  const initials = (user?.name ?? user?.email ?? "A")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* ── Mobile Header ── */}
      <header className={styles.mobileHeader}>
        <div className={styles.sidebarLogo} style={{ marginBottom: 0 }}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={20} />
          </div>
          <span className={styles.logoText}>Imprint Admin</span>
        </div>
        <button 
          className={styles.hamburger} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div 
          className={styles.drawerOverlay} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        {/* Admin Branding */}
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={20} />
          </div>
          <span className={styles.logoText}>Imprint Admin</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          <div className={styles.navDivider} />
          
          <Link href="/dashboard" onClick={handleNavClick} className={styles.navItem}>
            <ExternalLink size={18} />
            Switch to User View
          </Link>

          <div className={styles.navItem} onClick={toggleTheme} style={{ cursor: 'pointer' }}>
            <ThemeToggle />
            <span style={{ marginLeft: "4px" }}>Switch Theme</span>
          </div>
        </nav>

        {/* Admin Identity */}
        <div className={styles.sidebarFooter}>
          <div className={styles.navItem} style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", borderRadius: 0 }}>
            <div className={styles.logoIcon} style={{ width: 32, height: 32, fontSize: 12 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name ?? "Administrator"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-3)" }}>Admin Portal</div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
