"use client";

import { useState, useTransition } from "react";
import { captureLead } from "@/lib/actions";
import { X, CheckCircle, Users } from "lucide-react";
import styles from "./card.module.css";

export default function LeadCapture({ vcardId, trackClick }: { vcardId: string; trackClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackClick();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await captureLead(vcardId, formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <>
      <button 
        className={styles.mainCta} 
        style={{ 
          marginTop: 12, 
          background: "var(--bg-elevated)", 
          color: "var(--text-1)", 
          border: "2px solid var(--text-1)" 
        }}
        onClick={() => { trackClick(); setIsOpen(true); }}
      >
        <Users size={20} /> Exchange Contacts
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center"
        }} onClick={() => setIsOpen(false)}>
          <div style={{
            background: "var(--bg-card)", width: "100%", maxWidth: 440,
            borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
            padding: "32px 24px", paddingBottom: "max(32px, env(safe-area-inset-bottom))",
            position: "relative", animation: "slideUp 0.3s ease-out"
          }} onClick={e => e.stopPropagation()}>
            <button 
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", padding: 8, cursor: "pointer", color: "var(--text-secondary)" }}
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            {success ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <CheckCircle size={56} color="#ff6b00" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>Info Sent!</h3>
                <p style={{ color: "#6b7280", fontSize: "15px" }}>Your details were successfully shared.</p>
                <button 
                  className={styles.mainCta} 
                  style={{ marginTop: 24, background: "var(--text-1)", color: "var(--bg-page)" }}
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 8px", color: "var(--text-primary)" }}>Share your info</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 24px" }}>Exchange contact details seamlessly.</p>
                
                {error && <div style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <input type="text" name="name" placeholder="Full Name *" required className="lead-input" style={inputStyle} />
                  <input type="email" name="email" placeholder="Email Address" className="lead-input" style={inputStyle} />
                  <input type="tel" name="phone" placeholder="Phone Number" className="lead-input" style={inputStyle} />
                  <div style={{ display: "flex", gap: 12 }}>
                    <input type="text" name="company" placeholder="Company" className="lead-input" style={inputStyle} />
                    <input type="text" name="jobTitle" placeholder="Job Title" className="lead-input" style={inputStyle} />
                  </div>
                  <textarea name="note" placeholder="Add a note (optional)..." className="lead-input" style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
                  
                  <button type="submit" className={styles.mainCta} disabled={isPending} style={{ marginTop: 8, opacity: isPending ? 0.7 : 1 }}>
                    {isPending ? "Sending..." : "Connect"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .lead-input:focus { border-color: #ff6b00 !important; box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1) !important; }
      `}} />
    </>
  );
}

const inputStyle = {
  width: "100%", 
  padding: "14px 16px", 
  borderRadius: "12px", 
  border: "1px solid var(--border)",
  background: "var(--bg-muted)", 
  fontSize: "15px", 
  fontFamily: "inherit", 
  outline: "none", 
  color: "var(--text-1)"
};
