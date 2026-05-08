"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, ExternalLink, Moon, Sun, Plus, Shield } from "lucide-react";
import styles from "./dashboard.module.css";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("Initializing intelligence...");
  const { toggleTheme } = useTheme();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
  ];

  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* ── Mobile Top Header ── */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderLeft}>
          <div className={styles.logoIcon}>I</div>
          <span className={styles.logoText}>Imprint</span>
        </div>
        
        <div className={styles.mobileHeaderRight}>
          <nav className={styles.mobileQuickNav}>
            {navItems.map(({ href, icon: Icon }) => (
              <button
                key={href}
                onClick={() => {
                  if (href === "/dashboard/leads") {
                    setIsLeadsLoading(true);
                    setLoadingProgress(0);
                    setTimeout(() => { setLoadingProgress(30); setLoadingStage("Analyzing contact flow..."); }, 400);
                    setTimeout(() => { setLoadingProgress(65); setLoadingStage("Syncing lead intelligence..."); }, 1000);
                    setTimeout(() => {
                      setLoadingProgress(100);
                      setLoadingStage("Preparing dashboard...");
                      router.push(href);
                      setTimeout(() => setIsLeadsLoading(false), 800);
                    }, 2000);
                  } else {
                    router.push(href);
                  }
                }}
                className={`${styles.mobileQuickNavItem} ${pathname === href ? styles.mobileQuickNavItemActive : ""}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Icon size={20} />
              </button>
            ))}
            <ThemeToggle className={styles.mobileQuickNavItem} />
          </nav>
          
          <div 
            className={styles.userAvatar} 
            style={{ width: 32, height: 32, fontSize: 12, cursor: 'pointer' }}
            onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
          >
            {initials}
          </div>

          {/* ── Mobile User Dropdown Menu ── */}
          {isMobileUserMenuOpen && (
            <>
              <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileUserMenuOpen(false)} />
              <div className={styles.mobileUserDropdown}>
                <div className={styles.mobileDropdownHeader}>
                  <div className={styles.mobileDropdownAvatar}>{initials}</div>
                  <div className={styles.mobileDropdownInfo}>
                    <div className={styles.mobileDropdownName}>{user.name ?? "User"}</div>
                    <div className={styles.mobileDropdownEmail}>{user.email}</div>
                  </div>
                </div>
                <div className={styles.mobileDropdownDivider} />
                {user.role === "ADMIN" && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className={styles.mobileLogoutBtn}
                      style={{ color: "var(--accent)" }}
                      onClick={() => setIsMobileUserMenuOpen(false)}
                    >
                      <Shield size={18} />
                      <span>Admin Portal</span>
                    </Link>
                    <div className={styles.mobileDropdownDivider} />
                  </>
                )}
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={() => {
                    setIsMobileUserMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarLogo}>
        <div className={styles.logoIcon}>I</div>
        <span className={styles.logoText}>Imprint</span>
      </div>

      <Link href="/dashboard?create=true" className={styles.createCardBtn}>
        <Plus size={18} strokeWidth={2.5} />
        Create New Card
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            onClick={() => {
              if (href === "/dashboard/leads") {
                setIsLeadsLoading(true);
                setLoadingProgress(0);
                
                // Simulate progressive loading stages
                setTimeout(() => {
                  setLoadingProgress(30);
                  setLoadingStage("Analyzing contact flow...");
                }, 400);
                
                setTimeout(() => {
                  setLoadingProgress(65);
                  setLoadingStage("Syncing lead intelligence...");
                }, 1000);

                setTimeout(() => {
                  setLoadingProgress(100);
                  setLoadingStage("Preparing dashboard...");
                  router.push(href);
                  setTimeout(() => {
                    setIsLeadsLoading(false);
                  }, 800);
                }, 2000);
              } else {
                router.push(href);
              }
            }}
            className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
            title={label}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}

        <div 
          className={styles.navItem} 
          onClick={toggleTheme}
          style={{ cursor: 'pointer' }}
          title="Toggle Theme"
        >
          <div style={{ pointerEvents: 'none', display: 'flex' }}>
            <ThemeToggle />
          </div>
          <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 500 }}>Switch Theme</span>
        </div>

        {user.role === "ADMIN" && (
          <>
            <div className={styles.navDivider} />
            <Link 
              href="/admin/dashboard" 
              className={styles.navItem}
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              <Shield size={20} />
              Admin Portal
            </Link>
          </>
        )}
      </nav>

      <div className={styles.sidebarFooter}>
        <a
          href="https://digital-business-card-platform-gdam.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
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

      {/* Premium Leads Loading Modal - Rendered via Portal for safety */}
      {isLeadsLoading && typeof document !== 'undefined' && createPortal(
        <div className={styles.leadsLoaderOverlay}>
          <div className={styles.leadsLoaderContent}>
            <div className={styles.leadsLoaderIconWrap}>
              <div className={styles.leadsSpinner} />
              <Users size={32} className={styles.leadsPulseIcon} />
            </div>
            <h2 className={styles.leadsLoaderTitle}>Generating Leads</h2>
            <p className={styles.leadsLoaderSubtitle}>{loadingStage}</p>
            
            <div className={styles.leadsProgressBarWrap}>
              <div 
                className={styles.leadsProgressBarFill} 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className={styles.leadsProgressLabel}>{loadingProgress}%</div>
          </div>
        </div>,
        document.body
      )}
      </aside>
    </>
  );
}
