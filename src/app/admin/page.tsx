import { getAdminStats, getAdminRecentActivity } from "@/lib/admin-actions";
import AdminOverviewClient from "./AdminOverviewClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getAdminRecentActivity()
  ]);

  return <AdminOverviewClient initialStats={stats} activity={activity} />;
}
