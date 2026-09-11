import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Database
} from "lucide-react";

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    setIsSupabaseSettingsOpen,
    isSupabaseConfigured
  } = usePins();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await handleSignUp(email.trim(), password, fullName.trim());
      } else {
        await handleSignIn(email.trim(), password);
      }
      setIsAuthModalOpen(false);
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => !loading && setIsAuthModalOpen(false)}
    >
      <div
        className="modal-container"
        style={{ width: "100%", maxWidth: "460px", padding: "34px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => !loading && setIsAuthModalOpen(false)}
        >
          <X size={20} />
        </button>

        {/* If user is already logged in, show Account Profile view */}
        {currentUser ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 16px auto",
                border: "3px solid var(--color-primary)",
                boxShadow: "var(--brand-glow)"
              }}
            >
              <img
                src={currentUser.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
              {currentUser.user_metadata?.full_name || "GallaryWala Member"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
              {currentUser.email}
            </p>

            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", background: "#ef4444", marginBottom: "12px" }}
              onClick={async () => {
                await handleSignOut();
                setIsAuthModalOpen(false);
              }}
            >
              Log Out of Account
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--brand-gradient)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px auto",
                  boxShadow: "var(--brand-glow)"
                }}
              >
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800 }}>
                {mode === "login" ? "Welcome Back to GallaryWala" : "Join GallaryWala Studio"}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
                Powered by Supabase Auth & Cloudinary
              </p>
            </div>

            {/* Supabase connection indicator */}
            {!isSupabaseConfigured && (
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: "0.82rem",
                  color: "#f59e0b",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>Supabase API not connected yet</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsSupabaseSettingsOpen(true);
                  }}
                  style={{ textDecoration: "underline", color: "inherit", fontWeight: 700, cursor: "pointer" }}
                >
                  Configure
                </button>
              </div>
            )}

            {/* Tab switch */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-surface)",
                padding: "4px",
                borderRadius: "var(--radius-full)",
                marginBottom: "20px"
              }}
            >
              <button
                className={`category-pill ${mode === "login" ? "active" : ""}`}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => {
                  setMode("login");
                  setAuthError("");
                }}
              >
                <LogIn size={15} style={{ display: "inline", marginRight: "6px" }} />
                Log In
              </button>
              <button
                className={`category-pill ${mode === "signup" ? "active" : ""}`}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => {
                  setMode("signup");
                  setAuthError("");
                }}
              >
                <UserPlus size={15} style={{ display: "inline", marginRight: "6px" }} />
                Sign Up
              </button>
            </div>

            {/* Error banner */}
            {authError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: "0.85rem",
                  color: "#ef4444",
                  marginBottom: "16px"
                }}
              >
                {authError}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tanvir Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      cursor: "pointer"
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px", marginTop: "12px" }}
                disabled={loading}
              >
                <span>{loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
