import React, { useState, useRef, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { uploadToCloudinary, readFileAsDataURL } from "../services/cloudinary";
import { validateSafeText, scanImageForAdultContent } from "../services/moderation";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  X,
  Cloud,
  Search,
  Layers,
  Heart,
  Eye,
  Lock,
  KeyRound,
  Database,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Award,
  CheckCircle2,
  UserCheck,
  Users,
  PlusCircle,
  BadgePercent,
  Flame,
  UserX
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";

export const AdminPanel = () => {
  const {
    pins,
    addPin,
    updatePin,
    deletePin,
    cloudinaryConfig,
    setIsCloudinarySettingsOpen,
    setIsSupabaseSettingsOpen,
    isSupabaseConfigured,
    showToast,
    setActivePin,
    setActiveView,
    lockAdminPanel,
    updateAdminPin,
    currentUser,
    verifiedUsers,
    isUserVerified,
    toggleUserVerification,
    grantVerifiedBadge,
    revokeVerifiedBadge,
    adminTab,
    setAdminTab
  } = usePins();

  const fileInputRef = useRef(null);

  // Uploader State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[1] || "Cyberpunk & Sci-Fi");
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Management State
  const [adminSearch, setAdminSearch] = useState("");
  const [editingPinId, setEditingPinId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState("");

  // Change PIN State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState("");

  // Badge Panel States
  const [badgeSearch, setBadgeSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("all"); // 'all' | 'verified' | 'unverified'
  const [customBadgeName, setCustomBadgeName] = useState("");

  const isCloudinaryActive = Boolean(
    cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset
  );

  const totalLikes = pins.reduce((acc, p) => acc + (p.likes || 0), 0);

  // Aggregated list of all creators and registered members
  const allCreatorsList = useMemo(() => {
    const map = new Map();

    // 1. System Defaults & Seeds
    const defaultSeeds = [
      { name: "GallaryWala Official", role: "Platform Official", handle: "gallarywala", avatarSeed: "gallarywala" },
      { name: "Admin", role: "Super Administrator", handle: "admin", avatarSeed: "admin" },
      { name: "NeonArtist", role: "Cyberpunk Creator", handle: "neonartist", avatarSeed: "neonartist" },
      { name: "CyberCreator", role: "3D Specialist", handle: "cybercreator", avatarSeed: "cybercreator" },
      { name: "TokyoVisuals", role: "Visual Artist", handle: "tokyovisuals", avatarSeed: "tokyovisuals" }
    ];

    defaultSeeds.forEach((item) => {
      map.set(item.name.toLowerCase(), {
        name: item.name,
        handle: item.handle,
        role: item.role,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.avatarSeed)}`,
        pinsCount: pins.filter((p) => p.author?.name?.toLowerCase() === item.name.toLowerCase()).length,
        likesCount: pins
          .filter((p) => p.author?.name?.toLowerCase() === item.name.toLowerCase())
          .reduce((sum, p) => sum + (p.likes || 0), 0)
      });
    });

    // 2. Active Logged in User
    if (currentUser) {
      const name = currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "My Account";
      const handle = currentUser.user_metadata?.username || currentUser.email?.split("@")[0] || "user";
      const avatar = currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || name)}`;
      map.set(name.toLowerCase(), {
        name,
        handle,
        role: "Registered User",
        avatar,
        pinsCount: pins.filter((p) => p.author?.name?.toLowerCase() === name.toLowerCase()).length,
        likesCount: pins
          .filter((p) => p.author?.name?.toLowerCase() === name.toLowerCase())
          .reduce((sum, p) => sum + (p.likes || 0), 0)
      });
    }

    // 3. Authors from all uploaded pins
    pins.forEach((pin) => {
      if (pin.author?.name) {
        const authorName = pin.author.name.trim();
        const lower = authorName.toLowerCase();
        if (!map.has(lower)) {
          map.set(lower, {
            name: authorName,
            handle: pin.author.username?.replace("@", "") || authorName.toLowerCase().replace(/\s+/g, ""),
            role: "Creator",
            avatar: pin.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
            pinsCount: pins.filter((p) => p.author?.name?.toLowerCase() === lower).length,
            likesCount: pins
              .filter((p) => p.author?.name?.toLowerCase() === lower)
              .reduce((sum, p) => sum + (p.likes || 0), 0)
          });
        }
      }
    });

    // 4. Manually Verified Users
    verifiedUsers.forEach((vName) => {
      const lower = String(vName).trim().toLowerCase();
      if (!map.has(lower)) {
        map.set(lower, {
          name: vName,
          handle: lower.replace(/\s+/g, "_"),
          role: "Verified Creator",
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(vName)}`,
          pinsCount: pins.filter((p) => p.author?.name?.toLowerCase() === lower).length,
          likesCount: pins
            .filter((p) => p.author?.name?.toLowerCase() === lower)
            .reduce((sum, p) => sum + (p.likes || 0), 0)
        });
      }
    });

    return Array.from(map.values());
  }, [pins, currentUser, verifiedUsers]);

  // Filtered creators for Badge Panel
  const filteredCreators = useMemo(() => {
    return allCreatorsList.filter((creator) => {
      const isVer = isUserVerified(creator.name);
      const matchesFilter =
        badgeFilter === "all" ? true : badgeFilter === "verified" ? isVer : !isVer;
      const matchesSearch =
        creator.name.toLowerCase().includes(badgeSearch.toLowerCase()) ||
        creator.handle.toLowerCase().includes(badgeSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allCreatorsList, badgeFilter, badgeSearch, isUserVerified]);

  const handleGrantCustomBadge = (e) => {
    e.preventDefault();
    if (!customBadgeName.trim()) {
      showToast("Please enter a creator or user name", "error");
      return;
    }
    grantVerifiedBadge(customBadgeName.trim());
    setCustomBadgeName("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }

    setScanning(true);
    showToast("🔍 AI Scanning image for safety...", "info");

    try {
      // 1. AI 18+ Image Scan Check
      const moderationResult = await scanImageForAdultContent(file);
      if (!moderationResult.isSafe) {
        showToast("Adult or NSFW content is strictly prohibited.", "error");
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      const url = await readFileAsDataURL(file);
      setPreviewUrl(url);

      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } finally {
      setScanning(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) {
      showToast("Please select an image to upload.", "error");
      return;
    }
    if (!title.trim()) {
      showToast("Please enter a title for your image.", "error");
      return;
    }

    // Bad words check
    const titleCheck = validateSafeText(title);
    const descCheck = validateSafeText(description);
    const tagsCheck = validateSafeText(tagsInput);

    if (!titleCheck.isValid || !descCheck.isValid || !tagsCheck.isValid) {
      showToast("Inappropriate language detected. Please revise your text.", "error");
      return;
    }

    if (selectedFile) {
      const reScan = await scanImageForAdultContent(selectedFile);
      if (!reScan.isSafe) {
        showToast("Adult or NSFW content is strictly prohibited.", "error");
        return;
      }
    }

    setUploading(true);
    setProgress(15);

    try {
      let finalImageUrl = previewUrl;

      if (isCloudinaryActive && selectedFile) {
        showToast("Uploading to Cloudinary...", "info");
        const res = await uploadToCloudinary(selectedFile, {
          cloudName: cloudinaryConfig.cloudName,
          uploadPreset: cloudinaryConfig.uploadPreset,
          onProgress: (p) => setProgress(p)
        });
        finalImageUrl = res.url;
      } else {
        setProgress(100);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      addPin({
        title: title.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase()]
      });

      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setTagsInput("");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleStartEdit = (pin) => {
    setEditingPinId(pin.id);
    setEditTitleValue(pin.title);
  };

  const handleSaveEdit = (pinId) => {
    if (!editTitleValue.trim()) return;
    const check = validateSafeText(editTitleValue);
    if (!check.isValid) {
      showToast("Inappropriate language detected. Please revise your text.", "error");
      return;
    }
    updatePin(pinId, { title: editTitleValue.trim() });
    setEditingPinId(null);
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    if (!newPinInput || newPinInput.trim().length < 4) {
      showToast("Admin PIN must be at least 4 digits.", "error");
      return;
    }
    updateAdminPin(newPinInput.trim());
    setIsChangingPin(false);
    setNewPinInput("");
  };

  const filteredPins = pins.filter((p) =>
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="admin-page-container" style={{ padding: "28px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "28px"
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.1rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <span>GallaryWala Studio</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--brand-gradient)",
                color: "#fff",
                fontWeight: 800
              }}
            >
              OWNER CONSOLE
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.95rem" }}>
            Verified Badges, AI Moderation, Cloudinary Sync, Supabase & Creator Management
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Cloudinary Setup */}
          <button
            className="icon-btn"
            style={{ width: "auto", padding: "10px 18px", borderRadius: "var(--radius-full)", gap: "8px" }}
            onClick={() => setIsCloudinarySettingsOpen(true)}
          >
            <Cloud size={18} color={isCloudinaryActive ? "#00dfd8" : "currentColor"} />
            <span>
              {isCloudinaryActive
                ? `Cloudinary: ${cloudinaryConfig.cloudName}`
                : "Cloudinary Setup"}
            </span>
          </button>

          {/* Supabase Setup */}
          <button
            className="icon-btn"
            style={{ width: "auto", padding: "10px 18px", borderRadius: "var(--radius-full)", gap: "8px" }}
            onClick={() => setIsSupabaseSettingsOpen(true)}
          >
            <Database size={18} color={isSupabaseConfigured ? "#10b981" : "currentColor"} />
            <span>
              {isSupabaseConfigured ? "Supabase: Connected" : "Supabase Setup"}
            </span>
          </button>

          {/* Change PIN */}
          <button
            className="icon-btn"
            style={{ width: "auto", padding: "10px 18px", borderRadius: "var(--radius-full)", gap: "8px" }}
            onClick={() => setIsChangingPin(!isChangingPin)}
          >
            <KeyRound size={16} />
            <span>Change PIN</span>
          </button>

          {/* View Public Gallery */}
          <button
            className="btn-primary"
            onClick={() => {
              window.history.replaceState(null, "", "/");
              setActiveView("gallery");
            }}
          >
            <Eye size={18} />
            <span>View Public Gallery</span>
          </button>

          <button
            className="icon-btn"
            style={{ width: "42px", height: "42px", color: "#ef4444" }}
            onClick={lockAdminPanel}
            title="Lock Admin Session"
          >
            <Lock size={18} />
          </button>
        </div>
      </div>

      {/* Change PIN Form */}
      {isChangingPin && (
        <form
          onSubmit={handleSaveNewPin}
          style={{
            background: "var(--bg-surface)",
            padding: "16px 20px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-light)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Set New Admin PIN:</div>
          <input
            type="text"
            placeholder="Enter new 4+ digit PIN"
            className="form-input"
            style={{ maxWidth: "220px" }}
            value={newPinInput}
            onChange={(e) => setNewPinInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ padding: "8px 18px" }}>
            Save PIN
          </button>
          <button
            type="button"
            className="nav-tab"
            onClick={() => setIsChangingPin(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Top Admin Tabs Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-light)",
          paddingBottom: "12px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => {
            setAdminTab("catalog");
            window.history.replaceState(null, "", "/admin");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            background: adminTab === "catalog" ? "var(--bg-pill-active)" : "var(--bg-surface)",
            color: adminTab === "catalog" ? "#fff" : "var(--text-secondary)",
            border: "1px solid var(--border-light)",
            transition: "all var(--transition-fast)"
          }}
        >
          <ImageIcon size={18} />
          <span>Media Catalog & Uploader</span>
          <span
            style={{
              fontSize: "0.75rem",
              background: adminTab === "catalog" ? "rgba(255,255,255,0.25)" : "var(--bg-card)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)"
            }}
          >
            {pins.length}
          </span>
        </button>

        <button
          onClick={() => {
            setAdminTab("badges");
            window.history.replaceState(null, "", "/badge-panel");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            background: adminTab === "badges" ? "linear-gradient(135deg, #0095f6 0%, #00dfd8 100%)" : "var(--bg-surface)",
            color: adminTab === "badges" ? "#fff" : "var(--text-secondary)",
            border: adminTab === "badges" ? "none" : "1px solid var(--border-light)",
            boxShadow: adminTab === "badges" ? "0 4px 18px rgba(0, 149, 246, 0.4)" : "none",
            transition: "all var(--transition-fast)"
          }}
        >
          <VerifiedBadge size={18} />
          <span>Verified Badge Panel</span>
          <span
            style={{
              fontSize: "0.75rem",
              background: adminTab === "badges" ? "rgba(255,255,255,0.25)" : "rgba(0, 149, 246, 0.15)",
              color: adminTab === "badges" ? "#fff" : "#0095f6",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              fontWeight: 800
            }}
          >
            {verifiedUsers.length} Verified
          </span>
        </button>

        <button
          type="button"
          className="icon-btn"
          style={{
            marginLeft: "auto",
            width: "auto",
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.82rem",
            gap: "6px",
            color: "#0095f6"
          }}
          onClick={() => {
            const secretUrl = `${window.location.origin}/badge-panel`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(secretUrl);
              showToast("Secret Badge URL copied! 📋", "success");
            } else {
              showToast(`Secret URL: ${secretUrl}`, "info");
            }
          }}
          title="Copy direct secret URL to this Verified Badge Panel"
        >
          <VerifiedBadge size={14} />
          <span>Copy Secret Badge URL</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: MEDIA CATALOG & UPLOADER
          ======================================================== */}
      {adminTab === "catalog" && (
        <>
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginBottom: "32px"
            }}
          >
            <div
              style={{
                background: "var(--bg-card)",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(121, 40, 202, 0.15)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Layers size={26} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  TOTAL IMAGES
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>{pins.length}</div>
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-card)",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Database size={26} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  SUPABASE DATABASE
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {isSupabaseConfigured ? "Connected" : "Local Sync"}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-card)",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(0, 223, 216, 0.15)",
                  color: "#00dfd8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  AI 18+ MODERATION
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  Active & Protected
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "32px",
              alignItems: "start"
            }}
          >
            {/* Upload Form Box */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "28px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--card-glow)"
              }}
            >
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <UploadCloud size={24} color="var(--color-primary)" />
                <span>Upload Photo to Cloudinary & Supabase</span>
              </div>

              <form onSubmit={handleUploadSubmit} className="upload-grid">
                {/* Dropzone */}
                <div>
                  <div
                    className="dropzone-container"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const url = await readFileAsDataURL(file);
                        setSelectedFile(file);
                        setPreviewUrl(url);
                        if (!title) {
                          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
                        }
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {scanning ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <Loader2
                          size={40}
                          className="animate-spin"
                          color="var(--color-primary)"
                          style={{ margin: "0 auto 12px auto" }}
                        />
                        <div style={{ fontWeight: 700 }}>Scanning with AI Safety Filter...</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                          Checking for 18+ adult, NSFW & safety compliance
                        </div>
                      </div>
                    ) : previewUrl ? (
                      <div style={{ position: "relative", width: "100%", height: "260px" }}>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "var(--radius-md)" }}
                        />
                        <button
                          type="button"
                          className="modal-close-btn"
                          style={{ top: "8px", right: "8px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "24px" }}>
                        <UploadCloud size={44} color="var(--color-primary)" style={{ margin: "0 auto 14px auto" }} />
                        <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                          Click or drag high quality photo here
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "6px" }}>
                          JPG, PNG, WebP up to 25MB • Auto-synced to Cloudinary & Supabase
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="form-label">Image Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Cyberpunk Alley Sunset"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Tags / Keywords (comma separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="neon, city, futuristic, 4k"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-input"
                      rows="2"
                      placeholder="Describe the mood, lighting or concept..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={uploading || scanning}
                    style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "8px" }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Uploading & Syncing ({progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Publish Image to GallaryWala</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Manage Images Table */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "28px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--card-glow)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px"
                }}
              >
                <div style={{ fontSize: "1.3rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" }}>
                  <ImageIcon size={22} color="var(--color-primary)" />
                  <span>Manage Platform Catalog ({filteredPins.length})</span>
                </div>

                <div className="search-input-container" style={{ maxWidth: "320px", padding: "8px 14px" }}>
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by title or category..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                  {adminSearch && (
                    <button onClick={() => setAdminSearch("")} style={{ color: "var(--text-muted)" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "12px 8px" }}>PREVIEW</th>
                      <th style={{ padding: "12px 8px" }}>TITLE</th>
                      <th style={{ padding: "12px 8px" }}>CREATOR</th>
                      <th style={{ padding: "12px 8px" }}>CATEGORY</th>
                      <th style={{ padding: "12px 8px" }}>LIKES</th>
                      <th style={{ padding: "12px 8px", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPins.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                          No images found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredPins.map((pin) => (
                        <tr
                          key={pin.id}
                          style={{
                            borderBottom: "1px solid var(--border-light)",
                            transition: "background var(--transition-fast)"
                          }}
                        >
                          <td style={{ padding: "10px 8px" }}>
                            <img
                              src={pin.imageUrl}
                              alt={pin.title}
                              style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                            />
                          </td>

                          <td style={{ padding: "10px 8px", fontWeight: 600 }}>
                            {editingPinId === pin.id ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                                  value={editTitleValue}
                                  onChange={(e) => setEditTitleValue(e.target.value)}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveEdit(pin.id)}
                                  style={{ color: "#10b981", cursor: "pointer", padding: "4px" }}
                                  title="Save"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingPinId(null)}
                                  style={{ color: "#ef4444", cursor: "pointer", padding: "4px" }}
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>{pin.title}</span>
                                <button
                                  onClick={() => handleStartEdit(pin)}
                                  style={{ color: "var(--text-muted)", cursor: "pointer", opacity: 0.7 }}
                                  title="Rename photo"
                                >
                                  <Edit2 size={13} />
                                </button>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: "10px 8px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem" }}>
                              {pin.author?.name || "Anonymous"}
                              {isUserVerified(pin.author?.name) && <VerifiedBadge size={13} />}
                            </span>
                          </td>

                          <td style={{ padding: "10px 8px" }}>
                            <span className="tag-badge">{pin.category}</span>
                          </td>

                          <td style={{ padding: "10px 8px", color: "var(--text-muted)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Heart size={14} fill="#ff0080" color="#ff0080" />
                              <span>{pin.likes || 0}</span>
                            </div>
                          </td>

                          <td style={{ padding: "10px 8px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                              <button
                                className="icon-btn"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => setActivePin(pin)}
                                title="Preview photo"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                className="icon-btn"
                                style={{ width: "32px", height: "32px", color: "#ef4444" }}
                                onClick={() => {
                                  if (window.confirm(`Delete "${pin.title}"?`)) {
                                    deletePin(pin.id);
                                  }
                                }}
                                title="Delete photo"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          TAB 2: VERIFIED BADGE MANAGEMENT (BLUE TICK CONSOLE)
          ======================================================== */}
      {adminTab === "badges" && (
        <div>
          {/* Top Badge Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginBottom: "28px"
            }}
          >
            {/* Stat 1: Total Verified */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(0, 149, 246, 0.12) 0%, rgba(0, 223, 216, 0.08) 100%)",
                padding: "22px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(0, 149, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(0, 149, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(0, 149, 246, 0.4)"
                }}
              >
                <VerifiedBadge size={28} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#0095f6", fontWeight: 800, letterSpacing: "0.5px" }}>
                  VERIFIED CREATORS
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-main)" }}>
                  {verifiedUsers.length}
                </div>
              </div>
            </div>

            {/* Stat 2: Total Creators & Members */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "22px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(121, 40, 202, 0.15)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Users size={26} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  REGISTERED & CREATORS
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                  {allCreatorsList.length}
                </div>
              </div>
            </div>

            {/* Stat 3: Authority Status */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "22px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  BADGE GOVERNANCE
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#10b981" }}>
                  Admin Authorization Only
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grant Custom User Box */}
          <div
            style={{
              background: "var(--bg-card)",
              padding: "24px 28px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid rgba(0, 149, 246, 0.3)",
              boxShadow: "0 8px 30px rgba(0, 149, 246, 0.08)",
              marginBottom: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Sparkles size={20} color="#0095f6" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Grant Verified Badge to Any Creator</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "16px" }}>
              Type any creator, artist, or username below to immediately issue an official Blue Tick Verified seal across all their artwork and profile.
            </p>

            <form
              onSubmit={handleGrantCustomBadge}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Creator or User Name (e.g. CyberQueen, NeonArtist)..."
                  value={customBadgeName}
                  onChange={(e) => setCustomBadgeName(e.target.value)}
                  style={{
                    paddingLeft: "42px",
                    border: "1px solid rgba(0, 149, 246, 0.3)"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <VerifiedBadge size={18} />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  background: "linear-gradient(135deg, #0095f6 0%, #00dfd8 100%)",
                  boxShadow: "0 0 20px rgba(0, 149, 246, 0.4)",
                  gap: "8px",
                  padding: "11px 24px"
                }}
              >
                <Award size={18} />
                <span>Issue Blue Tick Badge</span>
              </button>
            </form>
          </div>

          {/* Creators Directory & Filter Panel */}
          <div
            style={{
              background: "var(--bg-card)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--card-glow)"
            }}
          >
            {/* Header + Search + Filter Pills */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "24px"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                  <UserCheck size={22} color="#0095f6" />
                  <span>Platform Creators Directory ({filteredCreators.length})</span>
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                  Click "Grant" or "Revoke" to instantly manage official verified status.
                </p>
              </div>

              {/* Filter Pills + Search */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                {/* Search */}
                <div className="search-input-container" style={{ maxWidth: "260px", padding: "7px 12px" }}>
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search creators..."
                    value={badgeSearch}
                    onChange={(e) => setBadgeSearch(e.target.value)}
                  />
                  {badgeSearch && (
                    <button onClick={() => setBadgeSearch("")} style={{ color: "var(--text-muted)" }}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filter Buttons */}
                <div style={{ display: "flex", gap: "6px", background: "var(--bg-surface)", padding: "4px", borderRadius: "var(--radius-full)" }}>
                  <button
                    onClick={() => setBadgeFilter("all")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: badgeFilter === "all" ? "var(--color-primary)" : "transparent",
                      color: badgeFilter === "all" ? "#fff" : "var(--text-muted)"
                    }}
                  >
                    All ({allCreatorsList.length})
                  </button>
                  <button
                    onClick={() => setBadgeFilter("verified")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: badgeFilter === "verified" ? "#0095f6" : "transparent",
                      color: badgeFilter === "verified" ? "#fff" : "var(--text-muted)"
                    }}
                  >
                    Verified ({allCreatorsList.filter((c) => isUserVerified(c.name)).length})
                  </button>
                  <button
                    onClick={() => setBadgeFilter("unverified")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: badgeFilter === "unverified" ? "var(--bg-card)" : "transparent",
                      color: badgeFilter === "unverified" ? "var(--text-main)" : "var(--text-muted)"
                    }}
                  >
                    Unverified
                  </button>
                </div>
              </div>
            </div>

            {/* Creators Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "16px"
              }}
            >
              {filteredCreators.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--text-muted)"
                  }}
                >
                  <Users size={40} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
                  <div style={{ fontWeight: 700 }}>No creators match your filter.</div>
                  <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                    Try searching for another name or issue a new badge above.
                  </div>
                </div>
              ) : (
                filteredCreators.map((creator) => {
                  const verified = isUserVerified(creator.name);
                  return (
                    <div
                      key={creator.name}
                      style={{
                        background: verified
                          ? "linear-gradient(135deg, rgba(0, 149, 246, 0.08) 0%, var(--bg-surface) 100%)"
                          : "var(--bg-surface)",
                        border: verified
                          ? "1px solid rgba(0, 149, 246, 0.4)"
                          : "1px solid var(--border-light)",
                        borderRadius: "var(--radius-lg)",
                        padding: "18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        transition: "all var(--transition-fast)",
                        boxShadow: verified ? "0 4px 18px rgba(0, 149, 246, 0.12)" : "none"
                      }}
                    >
                      {/* Creator Info Row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {/* High-Tech Vector Avatar */}
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: verified
                              ? "2px solid #0095f6"
                              : "2px solid var(--border-light)",
                            boxShadow: verified ? "0 0 12px rgba(0, 149, 246, 0.5)" : "none",
                            background: "var(--bg-card)",
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>

                        {/* Name & Handle */}
                        <div style={{ overflow: "hidden", flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{creator.name}</span>
                            {verified && <VerifiedBadge size={16} />}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                            @{creator.handle} • {creator.role}
                          </div>
                        </div>
                      </div>

                      {/* Stats & Badge State */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          padding: "8px 12px",
                          background: "var(--bg-card)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span><strong>{creator.pinsCount}</strong> Uploads</span>
                          <span><strong>{creator.likesCount}</strong> Likes</span>
                        </div>
                        <div>
                          {verified ? (
                            <span
                              style={{
                                color: "#0095f6",
                                fontWeight: 800,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>Unverified</span>
                          )}
                        </div>
                      </div>

                      {/* Action Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleUserVerification(creator.name)}
                        style={{
                          width: "100%",
                          padding: "9px 14px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "all var(--transition-fast)",
                          background: verified
                            ? "rgba(239, 68, 68, 0.1)"
                            : "linear-gradient(135deg, #0095f6 0%, #00dfd8 100%)",
                          color: verified ? "#ef4444" : "#ffffff",
                          border: verified
                            ? "1px solid rgba(239, 68, 68, 0.3)"
                            : "none",
                          boxShadow: verified ? "none" : "0 4px 14px rgba(0, 149, 246, 0.35)"
                        }}
                      >
                        {verified ? (
                          <>
                            <UserX size={15} />
                            <span>Revoke Blue Tick</span>
                          </>
                        ) : (
                          <>
                            <VerifiedBadge size={15} />
                            <span>Grant Blue Tick Badge</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
