"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Editor Error Boundary Caught:", error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: "500px",
      padding: "20px",
      textAlign: "center",
      color: "var(--text-1, #fff)"
    }}>
      <div style={{
        background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
        backdropFilter: "blur(16px)",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
        borderRadius: "24px",
        padding: "40px",
        maxWidth: "400px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{ padding: "16px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)" }}>
          <AlertCircle size={32} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Oops! Editor crashed.</h2>
        <p style={{ color: "var(--text-2, #9ca3af)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
          We encountered an issue while loading the card editor. It might be a database or connection issue.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "12px",
            padding: "12px 24px",
            background: "var(--orange, #ff6b00)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s"
          }}
        >
          Try again
        </button>
        <Link href="/dashboard" style={{ color: "var(--text-2, #9ca3af)", fontSize: "0.9rem", marginTop: "8px", textDecoration: "none" }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
