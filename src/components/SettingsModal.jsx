import React, { useState, useEffect } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  User,
  Sparkles,
  Shield,
  Palette,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Check,
  Globe,
  Sliders,
  RefreshCw
} from "lucide-react";

const PRESET_AVATARS = [
  { name: "Cyber Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberBot" },
  { name: "Pixel Hero", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelHero" },
  { name: "Neon Vibes", url: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonVibes" },
  { name: "Creator 3D", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { name: "Minimalist", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { name: "Art Director", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
];

export const SettingsModal = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settingsTab,
    currentUser,
    handleSignUp,
    handleSignIn,
    handleGoogleSignIn,
    handleSignOut,
    handleUpdateProfile,
    theme,
    toggleTheme,
    showToast
  } = usePins();

  // Active Tab state
  const [activeTab, setActiveTab] = useState(settingsTab || "general"); // 'general' | 'creator' | 'account'

  // General Profile States
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Creator Preferences States
  const [defaultCategory, setDefaultCategory] = useState("Cyberpunk & Sci-Fi");
  const [downloadQuality, setDownloadQuality] = useState("original");
  const [enableAttribution, setEnableAttribution] = useState(true);
  const [autoTagging, setAutoTagging] = useState(true);

  // Account / Auth States
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Synchronize when settingsTab changes externally
  useEffect(() => {
    if (settingsTab) {
      setActiveTab(settingsTab);
    }
  }, [settingsTab]);

  // Load user info into form
  useEffect(() => {
    if (currentUser) {
      const meta = currentUser.user_metadata || {};
      const baseName = meta.full_name || currentUser.email?.split("@")[0] || "Creator";
      const baseUser = meta.username || currentUser.email?.split("@")[0] || "creator";
      const baseAvatar = meta.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || "user")}`;

      setDisplayName(baseName);
      setUsername(baseUser);
      setSelectedAvatar(baseAvatar);
      setBio(meta.bio || "");
      setWebsiteUrl(meta.website || "");
    } else {
      setDisplayName("");
      setUsername("");
      setSelectedAvatar(PRESET_AVATARS[0].url);
      setBio("");
      setWebsiteUrl("");
    }
  }, [currentUser, isSettingsOpen]);

  // Load creator preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gallarywala_creator_prefs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultCategory) setDefaultCategory(parsed.defaultCategory);
        if (parsed.downloadQuality) setDownloadQuality(parsed.downloadQuality);
        if (parsed.enableAttribution !== undefined) setEnableAttribution(parsed.enableAttribution);
        if (parsed.autoTagging !== undefined) setAutoTagging(parsed.autoTagging);
      }
    } catch {
      // ignore fallback
    }
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  // Handle General Profile Save
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast("Display Name cannot be empty.", "warning");
      return;
    }

    setSaveLoading(true);
    const cleanHandle = username.trim().replace(/^@/, "").toLowerCase().replace(/\s+/g, "_") || displayName.trim().toLowerCase().replace(/\s+/g, "_");
    const avatarFinal = customAvatarUrl.trim() || selectedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanHandle)}`;

    try {
      if (currentUser) {
        await handleUpdateProfile({
          fullName: displayName.trim(),
          username: cleanHandle,
          avatarUrl: avatarFinal,
          bio: bio.trim(),
          website: websiteUrl.trim()
        });
      } else {
        localStorage.setItem("gallarywala_guest_profile", JSON.stringify({
          displayName: displayName.trim(),
          username: cleanHandle,
          avatar: avatarFinal,
          bio: bio.trim(),
          website: websiteUrl.trim()
        }));
        showToast("Profile preferences saved locally! ✨", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to save profile.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle Creator Preferences Save
  const handleSaveCreator = (e) => {
    e.preventDefault();
    try {
      const prefs = {
        defaultCategory,
        downloadQuality,
        enableAttribution,
        autoTagging
      };
      localStorage.setItem("gallarywala_creator_prefs", JSON.stringify(prefs));
      showToast("Creator Studio preferences saved! 🎨", "success");
    } catch {
      showToast("Failed to save creator settings.", "error");
    }
  };

  // Handle Auth Form Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        await handleSignUp(authEmail.trim(), authPassword, authFullName.trim());
      } else {
        await handleSignIn(authEmail.trim(), authPassword);
      }
      setAuthEmail("");
      setAuthPassword("");
      setAuthFullName("");
      setActiveTab("general");
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google OAuth Sign In
  const handleGoogleClick = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await handleGoogleSignIn();
    } catch (err) {
      setAuthError(err.message || "Google authentication failed. Please check your Supabase Google Provider configuration.");
      setAuthLoading(false);
    }
  };

  const currentDisplay = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Guest Visitor";
  const currentHandle = currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "guest";
  const currentAvatar = currentUser?.user_metadata?.avatar_url || selectedAvatar || PRESET_AVATARS[0].url;

  return (
    <div
      className="modal-backdrop"
      onClick={() => !authLoading && !saveLoading && setIsSettingsOpen(false)}
    >
      <div
        className="modal-container"
        style={{
          width: "100%",
          maxWidth: "880px",
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-surface-elevated)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--brand-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "var(--brand-glow)"
              }}
            >
              <Sliders size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                GallaryWala Settings
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
                Manage your profile, creator studio preferences & account
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            style={{ position: "static" }}
            onClick={() => setIsSettingsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: "480px" }}>
          {/* Sidebar Navigation */}
          <div
            style={{
              width: "240px",
              borderRight: "1px solid var(--border-light)",
              padding: "16px 12px",
              background: "var(--bg-surface)",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            {/* User Quick Info */}
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <img
                src={currentAvatar}
                alt="Avatar"
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--color-primary)" }}
              />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {currentDisplay}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600 }}>
                  @{currentHandle}
                </div>
              </div>
            </div>

            {/* Tab 1: General */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                borderRadius: "var(--radius-md)",
                background: activeTab === "general" ? "var(--brand-gradient)" : "transparent",
                color: activeTab === "general" ? "#fff" : "var(--text-main)",
                fontWeight: activeTab === "general" ? 700 : 500,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                transition: "var(--transition-fast)"
              }}
              onClick={() => setActiveTab("general")}
            >
              <User size={18} />
              <span>General & Profile</span>
            </button>

            {/* Tab 2: Creator Studio */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                borderRadius: "var(--radius-md)",
                background: activeTab === "creator" ? "var(--brand-gradient)" : "transparent",
                color: activeTab === "creator" ? "#fff" : "var(--text-main)",
                fontWeight: activeTab === "creator" ? 700 : 500,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                transition: "var(--transition-fast)"
              }}
              onClick={() => setActiveTab("creator")}
            >
              <Palette size={18} />
              <span>Creator Studio</span>
            </button>

            {/* Tab 3: Account & Auth */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                borderRadius: "var(--radius-md)",
                background: activeTab === "account" ? "var(--brand-gradient)" : "transparent",
                color: activeTab === "account" ? "#fff" : "var(--text-main)",
                fontWeight: activeTab === "account" ? 700 : 500,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                transition: "var(--transition-fast)"
              }}
              onClick={() => setActiveTab("account")}
            >
              <Shield size={18} />
              <span>Account & Security</span>
            </button>

            <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
              {currentUser ? (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(239, 68, 68, 0.12)",
                    color: "#ef4444",
                    fontWeight: 600,
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    justifyContent: "center"
                  }}
                  onClick={async () => {
                    await handleSignOut();
                    setIsSettingsOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--brand-gradient)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    justifyContent: "center"
                  }}
                  onClick={() => {
                    setActiveTab("account");
                    setAuthMode("login");
                  }}
                >
                  <LogIn size={16} />
                  <span>Sign In / Sign Up</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Content Panel */}
          <div
            style={{
              flex: 1,
              padding: "24px 32px",
              overflowY: "auto",
              background: "var(--bg-main)"
            }}
          >
            {/* ================= TAB 1: GENERAL PROFILE ================= */}
            {activeTab === "general" && (
              <form onSubmit={handleSaveGeneral}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "4px" }}>
                    Profile & Identity
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Customize your public appearance, display name, handle, and avatar.
                  </p>
                </div>

                {/* Avatar Selection */}
                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label" style={{ marginBottom: "10px" }}>
                    Choose Avatar
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "68px",
                        height: "68px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid var(--color-primary)",
                        boxShadow: "var(--brand-glow)",
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={customAvatarUrl.trim() || selectedAvatar || PRESET_AVATARS[0].url}
                        alt="Current Avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                        Pick from presets or generate:
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {PRESET_AVATARS.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedAvatar(p.url);
                              setCustomAvatarUrl("");
                            }}
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              cursor: "pointer",
                              border: selectedAvatar === p.url && !customAvatarUrl ? "2px solid var(--color-primary)" : "2px solid var(--border-light)",
                              transform: selectedAvatar === p.url && !customAvatarUrl ? "scale(1.1)" : "scale(1)",
                              transition: "transform 0.15s ease"
                            }}
                            title={p.name}
                          >
                            <img src={p.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="nav-tab"
                          style={{ padding: "4px 10px", fontSize: "0.75rem", height: "38px", borderRadius: "var(--radius-full)" }}
                          onClick={() => {
                            const randomSeed = Math.random().toString(36).substring(7);
                            const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
                            setSelectedAvatar(newAvatar);
                            setCustomAvatarUrl("");
                          }}
                        >
                          <RefreshCw size={12} style={{ marginRight: "4px" }} />
                          Randomize
                        </button>
                      </div>
                    </div>
                  </div>

                  <input
                    type="url"
                    className="form-input"
                    placeholder="Or paste custom image / avatar URL (https://...)"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>

                {/* Display Name & Username */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Display Name / Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Rivera"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username / Handle (@)</label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--color-primary)",
                          fontWeight: 700
                        }}
                      >
                        @
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="username"
                        style={{ paddingLeft: "32px" }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bio / Description */}
                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Bio & Creator Tagline</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Tell other creators about your visual style, photography gear, or art..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                {/* Website / Portfolio link */}
                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label">Portfolio or Social Link</label>
                  <div style={{ position: "relative" }}>
                    <Globe size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="url"
                      className="form-input"
                      style={{ paddingLeft: "38px" }}
                      placeholder="https://instagram.com/yourhandle or https://portfolio.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="form-group" style={{ marginBottom: "28px" }}>
                  <label className="form-label">App Appearance / Theme</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div
                      onClick={() => theme !== "dark" && toggleTheme()}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        border: theme === "dark" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                        background: "#0d0f14",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      <Moon size={18} style={{ color: "#7928ca" }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Dark Studio</div>
                        <div style={{ fontSize: "0.75rem", color: "#888" }}>High contrast for photography</div>
                      </div>
                      {theme === "dark" && <Check size={16} style={{ marginLeft: "auto", color: "#7928ca" }} />}
                    </div>

                    <div
                      onClick={() => theme !== "light" && toggleTheme()}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        border: theme === "light" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                        background: "#f4f5f9",
                        color: "#111",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      <Sun size={18} style={{ color: "#f59e0b" }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Light Minimal</div>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>Clean bright aesthetic</div>
                      </div>
                      {theme === "light" && <Check size={16} style={{ marginLeft: "auto", color: "#7928ca" }} />}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "13px" }}
                  disabled={saveLoading}
                >
                  <Check size={18} />
                  <span>{saveLoading ? "Saving Changes..." : "Save Profile Settings"}</span>
                </button>
              </form>
            )}

            {/* ================= TAB 2: CREATOR STUDIO PREFERENCES ================= */}
            {activeTab === "creator" && (
              <form onSubmit={handleSaveCreator}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "4px" }}>
                    Creator Studio Preferences
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Configure default settings for your uploads, downloads, and copyright attributions.
                  </p>
                </div>

                {/* Default Category */}
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label className="form-label">Default Upload Category</label>
                  <select
                    className="form-select"
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                  >
                    <option value="Cyberpunk & Sci-Fi">Cyberpunk & Sci-Fi</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Nature & Travel">Nature & Travel</option>
                    <option value="Minimalist & 3D">Minimalist & 3D</option>
                    <option value="Anime & Gaming">Anime & Gaming</option>
                    <option value="Food & Lifestyle">Food & Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>

                {/* Download Quality Preference */}
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label className="form-label">Download Quality Preference</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div
                      onClick={() => setDownloadQuality("original")}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        border: downloadQuality === "original" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                        background: "var(--bg-surface)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
                        Original Full-HD / 4K
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Highest clarity, direct Cloudinary asset download
                      </div>
                    </div>

                    <div
                      onClick={() => setDownloadQuality("optimized")}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        border: downloadQuality === "optimized" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                        background: "var(--bg-surface)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
                        Optimized Fast WebP
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Bandwidth friendly, high speed download
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creator Attribution Toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    marginBottom: "16px"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>
                      Automatic Creator Attribution
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Automatically attach your @username and profile as creator for every image you upload.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAttribution}
                    onChange={(e) => setEnableAttribution(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-primary)", cursor: "pointer" }}
                  />
                </div>

                {/* AI Smart Tagging Toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    marginBottom: "28px"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>
                      Smart Auto-Tagging Helper
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Suggest relevant tags automatically when uploading artwork.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTagging}
                    onChange={(e) => setAutoTagging(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-primary)", cursor: "pointer" }}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "13px" }}
                >
                  <Check size={18} />
                  <span>Save Creator Preferences</span>
                </button>
              </form>
            )}

            {/* ================= TAB 3: ACCOUNT & SECURITY (SIGN IN / SIGN UP / SIGN OUT) ================= */}
            {activeTab === "account" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "4px" }}>
                    Account & Security
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Sign in with your Google or email account, register as a new creator, or sign out.
                  </p>
                </div>

                {currentUser ? (
                  /* Logged In View */
                  <div>
                    {/* User Card */}
                    <div
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "var(--radius-lg)",
                        padding: "24px",
                        textAlign: "center",
                        marginBottom: "24px",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
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
                          src={currentAvatar}
                          alt="Account Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <h4 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>
                        {currentDisplay}
                      </h4>
                      <div style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>
                        @{currentHandle}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
                        {currentUser.email}
                      </div>

                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#10b981",
                          fontSize: "0.8rem",
                          fontWeight: 700
                        }}
                      >
                        <Check size={14} />
                        <span>Active Supabase Member</span>
                      </div>
                    </div>

                    {/* Sign Out Action Card */}
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ef4444", marginBottom: "2px" }}>
                          Sign Out of GallaryWala
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          You can sign back in anytime to access your boards and creations.
                        </div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{
                          background: "#ef4444",
                          borderColor: "#ef4444",
                          padding: "10px 20px",
                          fontSize: "0.88rem"
                        }}
                        onClick={async () => {
                          await handleSignOut();
                          setIsSettingsOpen(false);
                        }}
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Not Logged In View: Google OAuth + Email Form */
                  <div>
                    {/* Continue with Google Button */}
                    <button
                      type="button"
                      onClick={handleGoogleClick}
                      disabled={authLoading}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "12px 18px",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-light)",
                        color: "var(--text-main)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.2s ease",
                        marginBottom: "18px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-light)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* OR Divider */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
                      <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
                      <span style={{ padding: "0 12px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                        OR WITH EMAIL
                      </span>
                      <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
                    </div>

                    {/* Tab Switcher */}
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
                        type="button"
                        className={`category-pill ${authMode === "login" ? "active" : ""}`}
                        style={{ flex: 1, textAlign: "center" }}
                        onClick={() => {
                          setAuthMode("login");
                          setAuthError("");
                        }}
                      >
                        <LogIn size={15} style={{ display: "inline", marginRight: "6px" }} />
                        Sign In
                      </button>
                      <button
                        type="button"
                        className={`category-pill ${authMode === "signup" ? "active" : ""}`}
                        style={{ flex: 1, textAlign: "center" }}
                        onClick={() => {
                          setAuthMode("signup");
                          setAuthError("");
                        }}
                      >
                        <UserPlus size={15} style={{ display: "inline", marginRight: "6px" }} />
                        Create Account
                      </button>
                    </div>

                    {/* Auth Error Notice */}
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

                    <form onSubmit={handleAuthSubmit}>
                      {authMode === "signup" && (
                        <div className="form-group" style={{ marginBottom: "14px" }}>
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Tanvir Ahmed"
                            value={authFullName}
                            onChange={(e) => setAuthFullName(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      <div className="form-group" style={{ marginBottom: "14px" }}>
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="your@email.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
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
                              cursor: "pointer",
                              background: "none",
                              border: "none"
                            }}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", padding: "13px" }}
                        disabled={authLoading}
                      >
                        <span>
                          {authLoading
                            ? "Processing..."
                            : authMode === "login"
                            ? "Sign In"
                            : "Create Account"}
                        </span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
