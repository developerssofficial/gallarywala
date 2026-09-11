import React, { useState, useRef } from "react";
import { usePins } from "../context/PinContext";
import { uploadToCloudinary, readFileAsDataURL } from "../services/cloudinary";
import { validateSafeText, scanImageForAdultContent } from "../services/moderation";
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
  Loader2
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";

export const AdminPanel = () => {
  const {
    pins,
    addPin,
    updatePin,
    deletePin,
    cloudinaryConfig,
    setIsSettingsOpen,
    setIsSupabaseSettingsOpen,
    isSupabaseConfigured,
    showToast,
    setActivePin,
    setActiveView,
    lockAdminPanel,
    updateAdminPin
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

  const isCloudinaryActive = Boolean(
    cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset
  );

  const totalLikes = pins.reduce((acc, p) => acc + (p.likes || 0), 0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন", "error");
      return;
    }

    setScanning(true);
    showToast("🔍 AI স্ক্যানিং হচ্ছে... ১৮+ ও নিরাপত্তা চেক", "info");

    try {
      // 1. AI 18+ Image Scan Check
      const moderationResult = await scanImageForAdultContent(file);
      if (!moderationResult.isSafe) {
        showToast("১৮+ ছবি আপলোড করা সম্পূর্ণ নিষিদ্ধ!", "error");
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
      showToast("দয়া করে একটি ছবি নির্বাচন করুন", "error");
      return;
    }
    if (!title.trim()) {
      showToast("ছবির একটি নাম (Title) দিন", "error");
      return;
    }

    // 2. Bad Words & Profanity Filter on Title, Keywords/Tags & Description
    const titleCheck = validateSafeText(title);
    const descCheck = validateSafeText(description);
    const tagsCheck = validateSafeText(tagsInput);

    if (!titleCheck.isValid || !descCheck.isValid || !tagsCheck.isValid) {
      showToast("দুঃখিত, আপত্তিকর শব্দ ব্যবহার করা যাবে না। দয়া করে লেখাটি পরিবর্তন করুন।", "error");
      return;
    }

    // 3. Re-verify NSFW Safety
    if (selectedFile) {
      const reScan = await scanImageForAdultContent(selectedFile);
      if (!reScan.isSafe) {
        showToast("১৮+ ছবি আপলোড করা সম্পূর্ণ নিষিদ্ধ!", "error");
        return;
      }
    }

    setUploading(true);
    setProgress(15);

    try {
      let finalImageUrl = previewUrl;

      if (isCloudinaryActive && selectedFile) {
        showToast("Cloudinary-তে আপলোড হচ্ছে...", "info");
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

    // Bad words check on edit
    const check = validateSafeText(editTitleValue);
    if (!check.isValid) {
      showToast("দুঃখিত, আপত্তিকর শব্দ ব্যবহার করা যাবে না। দয়া করে লেখাটি পরিবর্তন করুন।", "error");
      return;
    }

    updatePin(pinId, { title: editTitleValue.trim() });
    setEditingPinId(null);
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    if (updateAdminPin(newPinInput.trim())) {
      setNewPinInput("");
      setIsChangingPin(false);
    }
  };

  const filteredAdminPins = pins.filter((pin) => {
    const q = adminSearch.toLowerCase().trim();
    return (
      !q ||
      pin.title?.toLowerCase().includes(q) ||
      pin.category?.toLowerCase().includes(q) ||
      pin.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px 28px 60px 28px" }}>
      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px"
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
            AI Moderation, Cloudinary Sync, Supabase Database & Full Catalog Management
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Cloudinary Setup */}
          <button
            className="icon-btn"
            style={{ width: "auto", padding: "10px 18px", borderRadius: "var(--radius-full)", gap: "8px" }}
            onClick={() => setIsSettingsOpen(true)}
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
            onClick={() => setActiveView("gallery")}
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
                    setScanning(true);
                    showToast("🔍 AI স্ক্যানিং হচ্ছে... ১৮+ ও নিরাপত্তা চেক", "info");
                    const mod = await scanImageForAdultContent(file);
                    setScanning(false);
                    if (!mod.isSafe) {
                      showToast("১৮+ ছবি আপলোড করা সম্পূর্ণ নিষিদ্ধ!", "error");
                      return;
                    }
                    setSelectedFile(file);
                    const url = await readFileAsDataURL(file);
                    setPreviewUrl(url);
                    if (!title) {
                      const cleanName = file.name
                        .replace(/\.[^/.]+$/, "")
                        .replace(/[-_]/g, " ");
                      setTitle(
                        cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
                      );
                    }
                  }
                }}
                onClick={() => !scanning && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {scanning ? (
                  <div style={{ padding: "20px" }}>
                    <Loader2 size={36} className="pulse-heart" color="var(--color-primary)" style={{ margin: "0 auto 12px auto" }} />
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      AI নিরাপত্তা স্ক্যানিং চলছে...
                    </div>
                  </div>
                ) : previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="dropzone-preview-img"
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        background: "rgba(0, 0, 0, 0.75)",
                        color: "#fff",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}
                    >
                      Click to choose another photo
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "12px",
                        color: "var(--color-primary)"
                      }}
                    >
                      <ImageIcon size={30} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>
                      Select or Drag Photo Here
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      AI 18+ auto-screened before upload
                    </div>
                  </>
                )}
              </div>

              {uploading && (
                <div style={{ marginTop: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      marginBottom: "4px"
                    }}
                  >
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "var(--bg-input)",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "var(--brand-gradient)",
                        transition: "width 0.2s ease"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Form Fields */}
            <div>
              <div className="form-group">
                <label className="form-label">
                  Photo Name (Searchable Title) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Neon Tokyo Rain, Minimal Scandinavian Pavilion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Details and story..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: "60px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keywords / Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 4k, dark, wallpaper, tokyo"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "14px",
                  marginTop: "8px"
                }}
                disabled={uploading || scanning}
              >
                <Sparkles size={18} />
                <span>{uploading ? "Publishing..." : "Publish to GallaryWala"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Images Table */}
        <div
          style={{
            background: "var(--bg-card)",
            padding: "28px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-light)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Manage Published Photos ({filteredAdminPins.length})
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Rename titles, inspect details, or remove photos
              </p>
            </div>

            <div style={{ minWidth: "260px" }}>
              <div className="search-input-container" style={{ padding: "8px 14px" }}>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter by photo name..."
                  className="search-input"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                />
                {adminSearch && (
                  <button
                    onClick={() => setAdminSearch("")}
                    className="search-clear-btn"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "0.9rem"
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  <th style={{ padding: "12px 8px" }}>Photo</th>
                  <th style={{ padding: "12px 8px" }}>Photo Name (Search Title)</th>
                  <th style={{ padding: "12px 8px" }}>Category</th>
                  <th style={{ padding: "12px 8px" }}>Likes</th>
                  <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminPins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "40px 0",
                        textAlign: "center",
                        color: "var(--text-muted)"
                      }}
                    >
                      No matching photos found.
                    </td>
                  </tr>
                ) : (
                  filteredAdminPins.map((pin) => (
                    <tr
                      key={pin.id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)"
                      }}
                    >
                      <td style={{ padding: "10px 8px" }}>
                        <img
                          src={pin.imageUrl}
                          alt={pin.title}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-sm)",
                            objectFit: "cover",
                            cursor: "pointer"
                          }}
                          onClick={() => setActivePin(pin)}
                          title="Click to view full photo"
                        />
                      </td>

                      <td style={{ padding: "10px 8px", fontWeight: 700 }}>
                        {editingPinId === pin.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input
                              type="text"
                              className="form-input"
                              value={editTitleValue}
                              onChange={(e) => setEditTitleValue(e.target.value)}
                              style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(pin.id)}
                              style={{ color: "#10b981", cursor: "pointer", padding: "4px" }}
                              title="Save name"
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
                              style={{
                                color: "var(--text-muted)",
                                cursor: "pointer",
                                opacity: 0.7
                              }}
                              title="Rename photo"
                            >
                              <Edit2 size={13} />
                            </button>
                          </div>
                        )}
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "8px"
                          }}
                        >
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
    </div>
  );
};
