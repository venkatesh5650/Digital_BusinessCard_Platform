import { auth } from "@/lib/auth";
import { getCardsByUser } from "@/lib/db";
import Link from "next/link";
import { createCard } from "@/lib/actions";
import { Eye, MousePointerClick, Users, Plus } from "lucide-react";
import styles from "./dashboard.module.css";
import ShareQRButton from "./ShareQRButton";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const cards = await getCardsByUser(userId);

  const totalViews = cards.reduce((s, c) => s + c.totalViews, 0);
  const totalClicks = cards.reduce((s, c) => s + c.totalClicks, 0);
  const totalLeads = cards.reduce((s, c) => s + c.leadsCollected, 0);

  const firstName = session!.user!.name?.split(" ")[0] ?? "there";

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hey, {firstName} 👋</h1>
          <p className={styles.pageSubtitle}>
            Here&apos;s an overview of your digital cards performance.
          </p>
        </div>
        <form action={createCard}>
          <button id="btn-create-card" type="submit" className={styles.btnPrimary} style={{ whiteSpace: "nowrap" }}>
            <Plus size={16} /> Create Card
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Cards</div>
          <div className={styles.statValue}>{cards.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <Eye size={12} style={{ display: "inline", marginRight: 4 }} />
            Total Views
          </div>
          <div className={styles.statValue}>{totalViews.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <MousePointerClick size={12} style={{ display: "inline", marginRight: 4 }} />
            Total Clicks
          </div>
          <div className={styles.statValue}>{totalClicks.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <Users size={12} style={{ display: "inline", marginRight: 4 }} />
            Leads Collected
          </div>
          <div className={styles.statValue}>{totalLeads.toLocaleString()}</div>
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💳</div>
          <div className={styles.emptyTitle}>No cards yet</div>
          <div className={styles.emptyDesc}>
            Create your first digital business card and start sharing it instantly.
          </div>
          <form action={createCard}>
            <button id="btn-create-first-card" type="submit" className={styles.btnPrimary}>
              <Plus size={16} /> Create My First Card
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {cards.map((card) => {
            const name =
              card.displayName ?? `${card.firstName} ${card.lastName}`;
            const initials = name
              .split(" ")
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase();

            return (
              <div key={card.id} className={styles.cardItem}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardAvatar}>{initials}</div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardName}>{name}</div>
                    <div className={styles.cardTitle}>{card.jobTitle}</div>
                  </div>
                  <span className={`${styles.publishedBadge} ${card.isPublished ? styles.live : styles.draft}`}>
                    {card.isPublished ? "Live" : "Draft"}
                  </span>
                </div>

                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <div className={styles.cardStatValue}>{card.totalViews}</div>
                    <div className={styles.cardStatLabel}>Views</div>
                  </div>
                  <div className={styles.cardStat}>
                    <div className={styles.cardStatValue}>{card.totalClicks}</div>
                    <div className={styles.cardStatLabel}>Clicks</div>
                  </div>
                  <div className={styles.cardStat}>
                    <div className={styles.cardStatValue}>{card.leadsCollected}</div>
                    <div className={styles.cardStatLabel}>Leads</div>
                  </div>
                </div>

                <div className={styles.cardSlug}>
                  <a href={`/${card.slug}`} target="_blank">
                    neonglass.me/{card.slug}
                  </a>
                </div>

                <div className={styles.cardActions}>
                  <Link href={`/dashboard/card/${card.id}`} className={styles.btnPrimary}>
                    Edit Card
                  </Link>
                  <a href={`/${card.slug}`} target="_blank" className={styles.btnSecondary}>
                    Preview
                  </a>
                  <ShareQRButton slug={card.slug} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
