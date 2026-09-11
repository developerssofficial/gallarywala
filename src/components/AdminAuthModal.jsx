import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  Lock,
  KeyRound,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export const AdminAuthModal = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    verifyAdminPin
  } = usePins();

  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const ok = verifyAdminPin(pinInput.trim());
    if (ok) {
      setPinInput("");
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsAdminAuthModalOpen(false)}
    >
      <div
        className="modal-container admin-lock-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsAdminAuthModalOpen(false)}
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(121, 40, 202, 0.15)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto"
          }}
        >
          <Lock size={30} />
        </div>

        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 800, marginBottom: "6px" }}>
          GallaryWala Studio Access
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "24px" }}>
          Enter your secret Admin Passcode to manage uploads, rename images, and sync Cloudinary.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="Enter PIN (Default: 1234)"
              className="form-input"
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                letterSpacing: "4px",
                paddingRight: "44px"
              }}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "8px" }}
          >
            <KeyRound size={18} />
            <span>Unlock Admin Studio</span>
          </button>
        </form>

        <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          🔒 Protected owner portal • Default PIN is <code>1234</code>
        </div>
      </div>
    </div>
  );
};
