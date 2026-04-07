import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardNav from "./DashboardNav";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className={styles.root}>
      <DashboardNav user={session.user} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
