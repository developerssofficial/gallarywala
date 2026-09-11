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
