import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "./AdminNav";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // High-level redundancy check (Middleware already handles this, but layout adds extra safety)
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className={styles.root}>
      <AdminNav user={session.user} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
