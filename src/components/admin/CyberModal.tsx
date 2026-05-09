"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, X } from "lucide-react";
import styles from "@/app/admin/admin.module.css";

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "DANGER" | "ACTION";
  isLoading?: boolean;
}

export default function CyberModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "ACTION",
  isLoading = false
}: CyberModalProps) {
  const isDanger = variant === "DANGER";

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{ 
              position: "relative", 
              width: "100%", 
              maxWidth: "440px", 
              background: "rgba(20, 20, 25, 0.95)", 
              border: `1px solid ${isDanger ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
              borderRadius: "24px",
              boxShadow: `0 32px 64px -16px rgba(0, 0, 0, 0.5), 0 0 40px ${isDanger ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
              overflow: "hidden"
            }}
          >
            {/* Header / Icon */}
            <div style={{ padding: "32px 32px 16px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ 
                width: "64px", 
                height: "64px", 
                borderRadius: "20px", 
                background: isDanger ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDanger ? "#ef4444" : "#3b82f6",
                marginBottom: "20px"
              }}>
                {isDanger ? <AlertTriangle size={32} /> : <Info size={32} />}
              </div>
              
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-3)", marginTop: "12px", lineHeight: "1.6" }}>{description}</p>
            </div>

            {/* Actions */}
            <div style={{ padding: "16px 32px 32px 32px", display: "flex", gap: "12px" }}>
              <button
                onClick={onClose}
                style={{ 
                  flex: 1, 
                  padding: "14px", 
                  borderRadius: "14px", 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid var(--border)", 
                  color: "var(--text-2)", 
                  fontSize: "14px", 
                  fontWeight: 600, 
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                style={{ 
                  flex: 1, 
                  padding: "14px", 
                  borderRadius: "14px", 
                  background: isDanger ? "#ef4444" : "var(--accent)", 
                  border: "none", 
                  color: "white", 
                  fontSize: "14px", 
                  fontWeight: 700, 
                  cursor: "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.2s",
                  boxShadow: isDanger ? "0 8px 16px rgba(239, 68, 68, 0.2)" : "0 8px 16px rgba(255, 107, 0, 0.2)"
                }}
              >
                {isLoading ? "Processing..." : confirmLabel}
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", padding: "8px" }}
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
