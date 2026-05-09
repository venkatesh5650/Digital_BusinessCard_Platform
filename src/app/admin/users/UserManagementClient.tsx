"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Trash2, 
  ShieldAlert, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  CreditCard, 
  Calendar,
  Shield,
  User,
  UserX,
  ChevronDown,
  CheckSquare,
  Square
} from "lucide-react";
import styles from "../admin.module.css";
import CyberGlassCard from "@/components/admin/CyberGlassCard";
import CyberModal from "@/components/admin/CyberModal";
import { bulkDeleteUsers, bulkUpdateUserRoles } from "@/lib/admin-actions";

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "DELETE" | "ROLE_UP" | "ROLE_DOWN";
    userIds: string[];
    userName?: string;
  }>({
    isOpen: false,
    type: "DELETE",
    userIds: [],
  });

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(u => 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, initialUsers]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u.id));
    }
  };

  const executeAction = async () => {
    setIsProcessing(true);
    try {
      if (modalConfig.type === "DELETE") {
        await bulkDeleteUsers(modalConfig.userIds);
      } else if (modalConfig.type === "ROLE_UP") {
        await bulkUpdateUserRoles(modalConfig.userIds, "ADMIN");
      } else if (modalConfig.type === "ROLE_DOWN") {
        await bulkUpdateUserRoles(modalConfig.userIds, "USER");
      }
      setSelectedIds([]);
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (type: "DELETE" | "ROLE_UP" | "ROLE_DOWN", ids: string[], name?: string) => {
    setModalConfig({
      isOpen: true,
      type,
      userIds: ids,
      userName: name
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ letterSpacing: "-0.03em" }}>User Management</h1>
          <p className={styles.subtitle}>Control platform access and manage account privileges</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 14px 12px 42px", 
              background: "var(--bg-surface)", 
              border: "1px solid var(--border)", 
              borderRadius: "12px",
              color: "var(--text-1)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>
      </header>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div style={{ 
          marginBottom: "20px", 
          padding: "12px 24px", 
          background: "var(--accent)", 
          borderRadius: "16px", 
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(255, 107, 0, 0.2)",
          animation: "slideDown 0.3s ease-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontWeight: 700 }}>{selectedIds.length} Selected</span>
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.3)" }} />
            <button 
              onClick={() => openModal("DELETE", selectedIds)}
              disabled={isProcessing}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}
            >
              <Trash2 size={16} /> Delete
            </button>
            <button 
              onClick={() => openModal("ROLE_UP", selectedIds)}
              disabled={isProcessing}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}
            >
              <Shield size={16} /> Promote
            </button>
          </div>
          <button 
            onClick={() => setSelectedIds([])}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* User Table Card */}
      <CyberGlassCard delay={0.1}>
        <div className={styles.tableContainer} style={{ padding: 0, overflow: "hidden" }}>
          <table className={styles.responsiveTable} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ width: "60px", textAlign: "center", padding: "16px" }}>
                  <button onClick={toggleSelectAll} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}>
                    {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? <CheckSquare size={20} color="var(--accent)" /> : <Square size={20} />}
                  </button>
                </th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>User</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Role</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Cards</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Joined</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "12px", color: "var(--text-3)", textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr 
                  key={u.id} 
                  style={{ 
                    borderBottom: "1px solid var(--border)",
                    background: selectedIds.includes(u.id) ? "rgba(255, 107, 0, 0.03)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    <button onClick={() => toggleSelect(u.id)} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}>
                      {selectedIds.includes(u.id) ? <CheckSquare size={20} color="var(--accent)" /> : <Square size={20} />}
                    </button>
                  </td>
                  <td data-label="User" style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className={styles.logoIcon} style={{ width: 32, height: 32, fontSize: "12px" }}>
                        {(u.name?.[0] ?? u.email?.[0] ?? "U").toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name ?? "Anonymous"}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          <Mail size={12} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Role" style={{ padding: "16px 24px" }}>
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
                  <td data-label="Cards" style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-2)", fontSize: "14px" }}>
                      <CreditCard size={14} />
                      {u._count.cards}
                    </div>
                  </td>
                  <td data-label="Joined" style={{ padding: "16px 24px", fontSize: "13px", color: "var(--text-3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td data-label="Actions" style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button 
                        onClick={() => {
                          const action = u.role === "ADMIN" ? "ROLE_DOWN" : "ROLE_UP";
                          openModal(action, [u.id], u.name || u.email);
                        }}
                        style={{ background: "none", border: "none", color: u.role === "ADMIN" ? "var(--text-3)" : "var(--accent)", cursor: "pointer" }}
                      >
                        {u.role === "ADMIN" ? <User size={18} /> : <Shield size={18} />}
                      </button>
                      <button 
                        onClick={() => openModal("DELETE", [u.id], u.name || u.email)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                      >
                        <UserX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
                    <Search size={48} style={{ opacity: 0.1, marginBottom: "16px" }} />
                    <p>No users found matching "{search}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CyberGlassCard>

      {/* Premium Confirmation Modal */}
      <CyberModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeAction}
        isLoading={isProcessing}
        variant={modalConfig.type === "DELETE" ? "DANGER" : "ACTION"}
        title={
          modalConfig.type === "DELETE" ? "Delete User Account" :
          modalConfig.type === "ROLE_UP" ? "Promote to Admin" : "Demote to User"
        }
        description={
          modalConfig.type === "DELETE" 
            ? `Are you sure you want to permanently delete ${modalConfig.userIds.length > 1 ? `${modalConfig.userIds.length} users` : modalConfig.userName}? This action is irreversible.`
            : `Confirm updating role for ${modalConfig.userIds.length > 1 ? `${modalConfig.userIds.length} users` : modalConfig.userName}. They will receive ${modalConfig.type === "ROLE_UP" ? "full administrative access" : "standard user permissions"}.`
        }
        confirmLabel={
          modalConfig.type === "DELETE" ? "Delete Permanently" :
          modalConfig.type === "ROLE_UP" ? "Promote Now" : "Demote Now"
        }
      />
      
      <style jsx global>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
