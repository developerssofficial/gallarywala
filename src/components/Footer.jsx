import React from "react";
import { usePins } from "../context/PinContext";
import { Lock } from "lucide-react";

export const Footer = () => {
  const { setIsAdminAuthModalOpen, isAdminAuthenticated, setActiveView } = usePins();

  const handleSecretTrigger = () => {
    if (isAdminAuthenticated) {
      setActiveView("admin");
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  return (
    <footer style={{ borderTop: "1px solid var(--border-light)", marginTop: "auto", background: "var(--bg-card)" }}>
      <div
        className="footer-inner"
        style={{
          maxWidth: "1720px",
          margin: "0 auto",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}
      >
        <div>
          © {new Date().getFullYear()} <strong style={{ color: "var(--text-main)" }}>GallaryWala</strong>. All rights reserved.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Privacy Policy
          </a>
          <span style={{ opacity: 0.3 }}>•</span>
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Terms of Service
          </a>
          <span style={{ opacity: 0.3 }}>•</span>
          <a
            href="mailto:xparrowdev@gmail.com?subject=[GallaryWala%20Copyright%20Claim]&body=Please%20provide%20asset%20details%20and%20original%20proof..."
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            title="Submit Copyright Claims directly to xparrowdev@gmail.com"
          >
            DMCA & Copyright Claim
          </a>
        </div>

        {/* Discreet hidden lock trigger */}
        <div
          onClick={handleSecretTrigger}
          className="secret-footer-trigger"
          title="System Console"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Lock size={12} />
          <span>System Console</span>
        </div>
      </div>
    </footer>
  );
};
