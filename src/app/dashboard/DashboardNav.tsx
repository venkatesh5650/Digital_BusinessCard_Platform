"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, ExternalLink, Moon, Sun, Plus, Shield, Scale } from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
    { href: "/dashboard/legal", label: "Legal", icon: Scale },
  ];

  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleLeadsClick = () => {
    setIsLeadsLoading(true);
    setLoadingProgress(0);
    setTimeout(() => { setLoadingProgress(30); setLoadingStage("Analyzing contact flow..."); }, 400);
    setTimeout(() => { setLoadingProgress(65); setLoadingStage("Syncing lead intelligence..."); }, 1000);
    setTimeout(() => {
      setLoadingProgress(100);
      setLoadingStage("Preparing dashboard...");
      router.push("/dashboard/leads");
      setTimeout(() => setIsLeadsLoading(false), 800);
    }, 2000);
  };

  return (
    <>
      {/* ── Bottom Hub (Mobile Navigation) ── */}
      <nav className={styles.bottomHub}>
        <Link href="/dashboard" className={`${styles.hubItem} ${pathname === "/dashboard" ? styles.hubItemActive : ""}`}>
          <LayoutDashboard size={22} />
          <span>Overview</span>
        </Link>
        <button 
          onClick={handleLeadsClick} 
          className={`${styles.hubItem} ${pathname === "/dashboard/leads" ? styles.hubItemActive : ""}`}
          style={{ background: 'none', border: 'none' }}
        >
          <Users size={22} />
          <span>Leads</span>
        </button>
        
        <button 
          onClick={() => router.push(`/dashboard?create=${Date.now()}`)} 
          className={styles.hubCreateBtn}
          style={{ background: 'var(--orange)', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={24} strokeWidth={3} color="white" />
        </button>

        <Link href="/dashboard/legal" className={`${styles.hubItem} ${pathname === "/dashboard/legal" ? styles.hubItemActive : ""}`}>
          <Scale size={22} />
          <span>Legal</span>
        </Link>
        <button 
          onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)} 
          className={styles.hubItem}
          style={{ background: 'none', border: 'none' }}
        >
          <div className={styles.userAvatar} style={{ width: 24, height: 24, fontSize: 10 }}>{initials}</div>
          <span>Menu</span>
        </button>

        {/* Mobile Menu Dropdown (Shared logic) */}
        {isMobileUserMenuOpen && (
          <div className={styles.mobileUserDropdown} style={{ bottom: '80px', top: 'auto', right: '10px' }}>
            <div className={styles.mobileDropdownHeader}>
              <div className={styles.mobileDropdownAvatar}>{initials}</div>
              <div className={styles.mobileDropdownInfo}>
                <div className={styles.mobileDropdownName}>{user.name ?? "User"}</div>
                <div className={styles.mobileDropdownEmail}>{user.email}</div>
              </div>
            </div>
            <div className={styles.mobileDropdownDivider} />
            {user.role === "ADMIN" && (
              <Link href="/admin" className={styles.mobileLogoutBtn} style={{ color: "var(--accent)" }}>
                <Shield size={18} /> <span>Admin Portal</span>
              </Link>
            )}
            <button onClick={toggleTheme} className={styles.mobileLogoutBtn}>
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               <span>Switch Theme</span>
            </button>
            <div className={styles.mobileDropdownDivider} />
            <button className={styles.mobileLogoutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut size={18} /> <span>Sign Out</span>
            </button>
          </div>
        )}
      </nav>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>I</div>
          <span className={styles.logoText}>Imprint</span>
        </div>

        <button 
          onClick={() => router.push(`/dashboard?create=${Date.now()}`)} 
          className={styles.createCardBtn}
          style={{ background: '#000', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Create New Card</span>
        </button>

        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${pathname === "/dashboard" ? styles.navItemActive : ""}`}>
            <LayoutDashboard size={20} /> <span>Overview</span>
          </Link>
          <button onClick={handleLeadsClick} className={`${styles.navItem} ${pathname === "/dashboard/leads" ? styles.navItemActive : ""}`} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <Users size={20} /> <span>Leads Intelligence</span>
          </button>
          <Link href="/dashboard/legal" className={`${styles.navItem} ${pathname === "/dashboard/legal" ? styles.navItemActive : ""}`}>
            <Scale size={20} /> <span>Legal & Compliance</span>
          </Link>

          <div className={styles.navDivider} />
          
          <button onClick={toggleTheme} className={styles.navItem} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <Moon size={20} /> <span>Appearance</span>
          </button>

          {user.role === "ADMIN" && (
            <Link href="/admin" className={styles.navItem} style={{ color: "var(--accent)", marginTop: '12px' }}>
              <Shield size={20} /> <span>Admin Command</span>
            </Link>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name ?? "User"}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
            <button className={styles.signOutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Leads Loader Portal */}
      {isLeadsLoading && typeof document !== 'undefined' && createPortal(
        <div className={styles.leadsLoaderOverlay}>
          <div className={styles.leadsLoaderContent}>
            <div className={styles.leadsLoaderIconWrap}>
              <div className={styles.leadsSpinner} />
              <Users size={32} className={styles.leadsPulseIcon} />
            </div>
            <h2 className={styles.leadsLoaderTitle}>Syncing Intelligence</h2>
            <p className={styles.leadsLoaderSubtitle}>{loadingStage}</p>
            <div className={styles.leadsProgressBarWrap}>
              <div className={styles.leadsProgressBarFill} style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
