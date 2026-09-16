import React, { useState, useEffect } from "react";
import { usePins } from "../context/PinContext";
import {
  Lock,
  KeyRound,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Sparkles,
  UserCheck,
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";
import { ROLES, ROLE_CONFIG } from "../services/security";

export const AdminAuthModal = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    verifyAdminPin,
    getBruteForceStatus
  } = usePins();

  const [selectedRole, setSelectedRole] = useState(ROLES.SUPER_ADMIN);
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [lockoutStatus, setLockoutStatus] = useState({ isLocked: false, remainingSeconds: 0 });

  // Poll brute force lock timer
  useEffect(() => {
    if (!isAdminAuthModalOpen) return;
    
    const checkLock = () => {
      if (getBruteForceStatus) {
        const status = getBruteForceStatus();
        setLockoutStatus(status);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [isAdminAuthModalOpen, getBruteForceStatus]);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutStatus.isLocked) return;
    if (!pinInput.trim()) return;
    const ok = verifyAdminPin(pinInput.trim(), selectedRole);
    if (ok) {
      setPinInput("");
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsAdminAuthModalOpen(false)}
      style={{ backdropFilter: "blur(12px)", zIndex: 9999 }}
    >
      <div
        className="modal-container admin-lock-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "520px",
          width: "92%",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-light)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 35px rgba(121, 40, 202, 0.2)",
          padding: "32px 28px",
          position: "relative"
        }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsAdminAuthModalOpen(false)}
          style={{ top: "16px", right: "16px" }}
        >
          <X size={20} />
        </button>

        {/* Top Header Badge */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: lockoutStatus.isLocked
                ? "rgba(239, 68, 68, 0.15)"
                : "linear-gradient(135deg, rgba(121, 40, 202, 0.25) 0%, rgba(0, 223, 216, 0.2) 100%)",
              color: lockoutStatus.isLocked ? "#ef4444" : "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px auto",
              border: `1px solid ${lockoutStatus.isLocked ? "rgba(239,68,68,0.4)" : "rgba(121,40,202,0.4)"}`
            }}
          >
            {lockoutStatus.isLocked ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
          </div>

          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "4px" }}>
            GallaryWala Staff Portal
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Select your role and authenticate with your secure passkey.
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutStatus.isLocked && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#ef4444"
            }}
          >
            <Clock size={22} className="animate-spin" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Brute Force Defense Active</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                Account temporarily frozen. Retry in <strong>{formatTimer(lockoutStatus.remainingSeconds)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 3-Role Selection Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
          {/* 1. Super Admin */}
          <button
            type="button"
            onClick={() => setSelectedRole(ROLES.SUPER_ADMIN)}
            style={{
              padding: "12px 8px",
              borderRadius: "var(--radius-lg)",
              background: selectedRole === ROLES.SUPER_ADMIN ? "rgba(255, 65, 108, 0.15)" : "var(--bg-surface)",
              border: selectedRole === ROLES.SUPER_ADMIN ? "1.5px solid #ff416c" : "1px solid var(--border-light)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all var(--transition-fast)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Crown size={20} color={selectedRole === ROLES.SUPER_ADMIN ? "#ff416c" : "var(--text-secondary)"} />
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: selectedRole === ROLES.SUPER_ADMIN ? "#fff" : "var(--text-primary)" }}>
              Super Admin
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Owner</div>
          </button>

          {/* 2. GallaryWala Official */}
          <button
            type="button"
            onClick={() => setSelectedRole(ROLES.OFFICIAL)}
            style={{
              padding: "12px 8px",
              borderRadius: "var(--radius-lg)",
              background: selectedRole === ROLES.OFFICIAL ? "rgba(0, 223, 216, 0.15)" : "var(--bg-surface)",
              border: selectedRole === ROLES.OFFICIAL ? "1.5px solid #00dfd8" : "1px solid var(--border-light)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all var(--transition-fast)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={20} color={selectedRole === ROLES.OFFICIAL ? "#00dfd8" : "var(--text-secondary)"} />
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: selectedRole === ROLES.OFFICIAL ? "#fff" : "var(--text-primary)" }}>
              Official
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Platform</div>
          </button>

          {/* 3. Sub-Admin Moderator */}
          <button
            type="button"
            onClick={() => setSelectedRole(ROLES.SUB_ADMIN)}
            style={{
              padding: "12px 8px",
              borderRadius: "var(--radius-lg)",
              background: selectedRole === ROLES.SUB_ADMIN ? "rgba(121, 40, 202, 0.18)" : "var(--bg-surface)",
              border: selectedRole === ROLES.SUB_ADMIN ? "1.5px solid #7928ca" : "1px solid var(--border-light)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all var(--transition-fast)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Shield size={20} color={selectedRole === ROLES.SUB_ADMIN ? "#7928ca" : "var(--text-secondary)"} />
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: selectedRole === ROLES.SUB_ADMIN ? "#fff" : "var(--text-primary)" }}>
              Sub-Admin
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Moderator</div>
          </button>
        </div>

        {/* Active Role Privilege Summary */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              background: ROLE_CONFIG[selectedRole]?.badgeColor || "var(--bg-pill-active)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.7rem",
              whiteSpace: "nowrap"
            }}
          >
            {ROLE_CONFIG[selectedRole]?.name}
          </span>
          <span style={{ flex: 1 }}>{ROLE_CONFIG[selectedRole]?.description}</span>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: "relative", marginBottom: "14px" }}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="Enter Security Passcode / PIN"
              className="form-input"
              style={{
                textAlign: "center",
                fontSize: "1.05rem",
                letterSpacing: "2px",
                paddingRight: "44px",
                opacity: lockoutStatus.isLocked ? 0.5 : 1
              }}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              disabled={lockoutStatus.isLocked}
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
            disabled={lockoutStatus.isLocked}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "13px",
              marginTop: "4px",
              background: ROLE_CONFIG[selectedRole]?.badgeColor || "var(--brand-gradient)",
              opacity: lockoutStatus.isLocked ? 0.5 : 1
            }}
          >
            <KeyRound size={18} />
            <span>Unlock {ROLE_CONFIG[selectedRole]?.name}</span>
          </button>
        </form>

        {/* Cyber Security Footer */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            flexWrap: "wrap",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>256-Bit Cryptographic Hash Guard</span>
          </div>
          <div>🛡️ Anti-Brute Force (5 Max Attempts)</div>
        </div>
      </div>
    </div>
  );
};
