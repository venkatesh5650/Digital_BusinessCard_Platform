import { getAdminUsers, updateUserRole, deleteUserAccount } from "@/lib/admin-actions";
import styles from "../admin.module.css";
import { User, Shield, UserX, UserPlus, Mail, Calendar, CreditCard } from "lucide-react";

export default async function UserManagementPage() {
  const users = await getAdminUsers();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Control platform access and manage account privileges</p>
        </div>
      </header>

      {/* User Table Card */}
      <div className={styles.statCard} style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>User</th>
              <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Role</th>
              <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Cards</th>
              <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Joined</th>
              <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className={styles.logoIcon} style={{ width: 32, height: 32, fontSize: "12px" }}>
                      {(u.name?.[0] ?? u.email?.[0] ?? "U").toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>{u.name ?? "Anonymous"}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={12} />
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "11px", 
                    fontWeight: 700,
                    background: u.role === "ADMIN" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.05)",
                    color: u.role === "ADMIN" ? "#3b82f6" : "var(--text-2)",
                    border: "1px solid",
                    borderColor: u.role === "ADMIN" ? "rgba(59, 130, 246, 0.3)" : "transparent"
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-2)", fontSize: "14px" }}>
                    <CreditCard size={14} />
                    {u._count.cards}
                  </div>
                </td>
                <td style={{ padding: "16px 24px", fontSize: "13px", color: "var(--text-3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={14} />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    {u.role === "USER" ? (
                      <form action={async () => { "use server"; await updateUserRole(u.id, "ADMIN"); }}>
                        <button title="Promote to Admin" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
                          <Shield size={18} />
                        </button>
                      </form>
                    ) : (
                      <form action={async () => { "use server"; await updateUserRole(u.id, "USER"); }}>
                        <button title="Demote to User" style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}>
                          <User size={18} />
                        </button>
                      </form>
                    )}
                    <form action={async () => { "use server"; await deleteUserAccount(u.id); }}>
                      <button title="Delete User" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                        <UserX size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
