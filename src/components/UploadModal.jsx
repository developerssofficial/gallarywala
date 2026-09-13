import React, { useState, useRef } from "react";
import { usePins } from "../context/PinContext";
import { uploadToCloudinary, readFileAsDataURL } from "../services/cloudinary";
import { validateSafeText, scanImageForAdultContent } from "../services/moderation";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Link2,
  Tag,
  FolderPlus,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  DollarSign,
  BadgePercent,
  Check,
  Search,
  ChevronDown,
  Layers
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";
import { calculateRevenueSplit } from "../services/paddle";

export const UploadModal = () => {
  const {
    isUploadOpen,
    setIsUploadOpen,
    cloudinaryConfig,
    setIsSettingsOpen,
    boards,
    addPin,
    showToast,
    currentUser,
    setIsAuthModalOpen
  } = usePins();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guestAuthorName, setGuestAuthorName] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("4K Wallpapers");
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [targetBoardId, setTargetBoardId] = useState(boards[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Commercial Marketplace States
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("4.99");
  const [licenseModel, setLicenseModel] = useState("Standard Commercial License");

  if (!isUploadOpen) return null;

  // 🔒 Require Google / Email authentication to upload images
  if (!currentUser) {
    return (
      <div className="modal-backdrop" onClick={() => setIsUploadOpen(false)}>
        <div
          className="modal-container"
          style={{ maxWidth: "460px", textAlign: "center", padding: "36px 28px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setIsUploadOpen(false)}
            title="Close"
          >
            <X size={20} />
          </button>

          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(121, 40, 202, 0.15)",
              border: "1px solid rgba(121, 40, 202, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto"
            }}
          >
            <UploadCloud size={34} color="var(--color-primary)" />
          </div>

          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "10px" }}>
            Creator Sign-In Required
          </h3>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.5", marginBottom: "26px" }}>
            Guests can download and explore unlimited 4K visuals for free! To upload your own artwork, track your portfolio, and earn revenue, please sign in with Google.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
              onClick={() => {
                setIsUploadOpen(false);
                setIsAuthModalOpen(true);
              }}
            >
              <Sparkles size={18} />
              <span>Continue with Google / Email</span>
            </button>
            <button
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center", padding: "10px" }}
              onClick={() => setIsUploadOpen(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCloudinaryConfigured = Boolean(
    cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset
  );

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }

    setScanning(true);
    showToast("🔍 AI Scanning image for safety and quality...", "info");

    try {
      // 1. AI 18+ / NSFW Image Content Scan
      const moderationResult = await scanImageForAdultContent(file);
      if (!moderationResult.isSafe) {
        showToast("Adult or NSFW content is strictly prohibited.", "error");
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      const localUrl = await readFileAsDataURL(file);
      setPreviewUrl(localUrl);

      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      console.warn("Scan check error:", err);
    } finally {
      setScanning(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setScanning(true);
    showToast("🔍 AI Scanning image for safety...", "info");

    try {
      const moderationResult = await scanImageForAdultContent(file);
      if (!moderationResult.isSafe) {
        showToast("Adult or NSFW content is strictly prohibited.", "error");
        setSelectedFile(null);
        setPreviewUrl("");
        return;
      }

      setSelectedFile(file);
      const localUrl = await readFileAsDataURL(file);
      setPreviewUrl(localUrl);

      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) {
      showToast("Please select an image to upload.", "error");
      return;
    }

    // 1. Resolve final title (Auto-fallback to filename or Category name if blank)
    let fallbackTitle = "";
    if (selectedFile?.name) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      if (cleanName && cleanName.length > 2) {
        fallbackTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }
    const resolvedTitle = title.trim() || fallbackTitle || `${category} Visual`;

    // 2. Profanity / Bad words validation on Title, Description, and Keywords/Tags
    const titleCheck = validateSafeText(resolvedTitle);
    const descCheck = validateSafeText(description);
    const tagsCheck = validateSafeText(tagsInput);

    if (!titleCheck.isValid || !descCheck.isValid || !tagsCheck.isValid) {
      showToast("Inappropriate language detected. Please revise your text.", "error");
      return;
    }

    // 3. Re-verify Image NSFW Safety before uploading to Cloudinary
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

      // Upload to Cloudinary if configured
      if (isCloudinaryConfigured && selectedFile) {
        showToast("Uploading to Cloudinary...", "info");
        const uploadResult = await uploadToCloudinary(selectedFile, {
          cloudName: cloudinaryConfig.cloudName,
          uploadPreset: cloudinaryConfig.uploadPreset,
          onProgress: (p) => setProgress(p)
        });
        finalImageUrl = uploadResult.url;
      } else {
        setProgress(100);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const authorNameClean = guestAuthorName.trim() || undefined;
      const authorUserClean = authorNameClean ? authorNameClean.toLowerCase().replace(/\s+/g, "_") : undefined;

      addPin({
        title: resolvedTitle,
        description: description.trim(),
        imageUrl: finalImageUrl,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase()],
        link: link.trim() || undefined,
        targetBoardId: targetBoardId || undefined,
        authorName: authorNameClean,
        authorUsername: authorUserClean,
        isPaid: Boolean(isPaid),
        price: isPaid ? Number(price) : 0,
        license: isPaid ? licenseModel : "Free License"
      });

      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setGuestAuthorName("");
      setLink("");
      setTagsInput("");
      setIsPaid(false);
      setPrice("4.99");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload image.", "error");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => !uploading && !scanning && setIsUploadOpen(false)}
    >
      <div
        className="modal-container upload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => !uploading && !scanning && setIsUploadOpen(false)}
          disabled={uploading || scanning}
        >
          <X size={20} />
        </button>

        <div className="upload-modal-title">
          <UploadCloud size={28} color="var(--color-primary)" />
          <span>Upload & Publish Image</span>
        </div>

        {/* AI Safety Status Notice */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(121, 40, 202, 0.12)",
            border: "1px solid rgba(121, 40, 202, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "10px 16px",
            marginBottom: "20px",
            fontSize: "0.85rem"
          }}
        >
          <ShieldCheck size={18} color="#00dfd8" />
          <span>
            <strong>AI Safety Active:</strong> NSFW & explicit content is automatically filtered
          </span>
        </div>

        <form onSubmit={handleSubmit} className="upload-grid">
          {/* Dropzone */}
          <div>
            <div
              className="dropzone-container"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
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
                    AI Safety Scanning...
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Screening image safety & resolution
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
                    Click to change photo
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "var(--bg-input)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                      color: "var(--color-primary)"
                    }}
                  >
                    <ImageIcon size={28} />
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: "6px"
                    }}
                  >
                    Choose a file or drag & drop
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      maxWidth: "220px"
                    }}
                  >
                    High quality JPG, PNG, WEBP, or GIF supported
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
                    marginBottom: "4px",
                    fontWeight: 700
                  }}
                >
                  <span>Uploading to Cloud...</span>
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

          {/* Form Fields */}
          <div>
            <div className="form-group">
              <label className="form-label">Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Neon Tokyo (Leave blank to use Category name)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Write a brief description or backstory..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Searchable Category Selector */}
            <div className="form-group" style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <label className="form-label" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Layers size={14} color="var(--color-primary)" />
                  <span>Category *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  style={{
                    background: "rgba(121, 40, 202, 0.12)",
                    color: "var(--color-primary)",
                    border: "1px solid rgba(121, 40, 202, 0.3)",
                    borderRadius: "var(--radius-full)",
                    padding: "3px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(121, 40, 202, 0.22)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(121, 40, 202, 0.12)")}
                >
                  <Search size={12} />
                  <span>{isCategoryDropdownOpen ? "Close Search" : "Search Category"}</span>
                </button>
              </div>

              {/* Selected Category Trigger Button */}
              <div
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-input)",
                  border: isCategoryDropdownOpen ? "1px solid var(--color-primary)" : "1px solid var(--border-light)",
                  color: "var(--text-main)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--brand-gradient)",
                      display: "inline-block"
                    }}
                  />
                  <span>{category || "Select a category"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isCategoryDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform var(--transition-fast)"
                    }}
                  />
                </div>
              </div>

              {/* Dropdown Menu with Instant Search Filter */}
              {isCategoryDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "6px",
                    zIndex: 50,
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.5)",
                    padding: "10px",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  {/* Category Search Input */}
                  <div
                    style={{
                      position: "relative",
                      marginBottom: "10px"
                    }}
                  >
                    <Search
                      size={15}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)"
                      }}
                    />
                    <input
                      type="text"
                      autoFocus
                      className="form-input"
                      placeholder="Type to search 70+ categories (e.g. anime, car, tokyo, 4k)..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      style={{
                        paddingLeft: "34px",
                        paddingRight: categorySearch ? "32px" : "12px",
                        height: "38px",
                        fontSize: "0.86rem"
                      }}
                    />
                    {categorySearch && (
                      <button
                        type="button"
                        onClick={() => setCategorySearch("")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "2px"
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filtered Category Items Scroll List */}
                  <div
                    style={{
                      maxHeight: "210px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px"
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== "All")
                      .filter((c) =>
                        c.toLowerCase().includes(categorySearch.toLowerCase().trim())
                      )
                      .map((c) => {
                        const isSelected = c === category;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCategory(c);
                              setIsCategoryDropdownOpen(false);
                              setCategorySearch("");
                            }}
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              borderRadius: "var(--radius-md)",
                              fontSize: "0.86rem",
                              fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? "rgba(121, 40, 202, 0.15)" : "transparent",
                              color: isSelected ? "var(--color-primary)" : "var(--text-main)",
                              border: isSelected ? "1px solid rgba(121, 40, 202, 0.3)" : "1px solid transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              transition: "all var(--transition-fast)"
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "var(--bg-surface-hover)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span>{c}</span>
                            {isSelected && <Check size={14} color="var(--color-primary)" />}
                          </button>
                        );
                      })}
                    {CATEGORIES.filter((c) => c !== "All").filter((c) =>
                      c.toLowerCase().includes(categorySearch.toLowerCase().trim())
                    ).length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "16px 10px",
                          color: "var(--text-muted)",
                          fontSize: "0.85rem"
                        }}
                      >
                        No category matching "{categorySearch}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Popular Category Chips */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginTop: "8px"
                }}
              >
                {[
                  "4K Wallpapers",
                  "Anime",
                  "Street Photography",
                  "Supercars",
                  "Aesthetic",
                  "Cyberpunk",
                  "Coffee",
                  "Nature",
                  "Galaxy"
                ].map((quickCat) => {
                  const isCur = category === quickCat;
                  return (
                    <button
                      key={quickCat}
                      type="button"
                      onClick={() => setCategory(quickCat)}
                      style={{
                        background: isCur ? "var(--brand-gradient)" : "var(--bg-surface)",
                        color: isCur ? "#fff" : "var(--text-secondary)",
                        border: isCur ? "none" : "1px solid var(--border-light)",
                        borderRadius: "var(--radius-full)",
                        padding: "4px 10px",
                        fontSize: "0.74rem",
                        fontWeight: isCur ? 700 : 500,
                        cursor: "pointer",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      {quickCat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Keywords / Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 4k, wallpaper, dark, city"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Creator / Author Attribution Row */}
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                marginBottom: "16px",
                border: "1px solid var(--border-light)"
              }}
            >
              {currentUser ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || "user")}`}
                      alt="Creator"
                      style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                        {currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0]}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600 }}>
                        @{currentUser.user_metadata?.username || currentUser.email?.split("@")[0]}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => {
                      setIsUploadOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Edit Handle
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="form-label" style={{ marginBottom: 0, fontSize: "0.8rem" }}>Creator / Artist Name</label>
                    <button
                      type="button"
                      style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700, cursor: "pointer" }}
                      onClick={() => {
                        setIsUploadOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Log in to sync account
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Your Name (defaults to Guest)"
                    value={guestAuthorName}
                    onChange={(e) => setGuestAuthorName(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                </div>
              )}
            </div>

            {/* Commercial Monetization Section */}
            <div
              style={{
                background: isPaid ? "linear-gradient(135deg, rgba(121, 40, 202, 0.15) 0%, rgba(0, 223, 216, 0.1) 100%)" : "var(--bg-surface)",
                border: isPaid ? "1px solid rgba(0, 223, 216, 0.4)" : "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                marginBottom: "18px",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isPaid ? "14px" : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: isPaid ? "var(--brand-gradient)" : "var(--bg-input)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isPaid ? "#fff" : "var(--text-muted)"
                    }}
                  >
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Sell as Commercial Asset
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Watermark protected preview + Instant Paddle payout
                    </div>
                  </div>
                </div>

                {/* Toggle switch */}
                <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: isPaid ? "var(--color-primary)" : "var(--border-light)",
                      transition: ".3s",
                      borderRadius: "24px"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: "",
                        height: "18px",
                        width: "18px",
                        left: isPaid ? "23px" : "3px",
                        bottom: "3px",
                        backgroundColor: "#fff",
                        transition: ".3s",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    />
                  </span>
                </label>
              </div>

              {isPaid && (
                <div style={{ paddingTop: "10px", borderTop: "1px solid var(--border-light)" }}>
                  {/* Price Row */}
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label className="form-label" style={{ marginBottom: 0, fontSize: "0.8rem" }}>Set Price ($ USD)</label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {["2.99", "4.99", "9.99", "19.99", "49.99"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            style={{
                              fontSize: "0.75rem",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: price === preset ? "var(--color-primary)" : "var(--bg-input)",
                              color: price === preset ? "#fff" : "var(--text-main)",
                              border: "1px solid var(--border-light)",
                              cursor: "pointer",
                              fontWeight: 600
                            }}
                            onClick={() => setPrice(preset)}
                          >
                            ${preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 700 }}>
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.99"
                        max="9999.00"
                        className="form-input"
                        placeholder="Enter your custom price (e.g. 5.00)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ paddingLeft: "28px" }}
                        required={isPaid}
                      />
                    </div>
                  </div>

                  {/* License Dropdown */}
                  <div className="form-group" style={{ marginBottom: "12px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Commercial License Type</label>
                    <select
                      className="form-select"
                      value={licenseModel}
                      onChange={(e) => setLicenseModel(e.target.value)}
                      style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                    >
                      <option value="Standard Commercial License">Standard Commercial (Web, Social, Digital Ads)</option>
                      <option value="Extended Commercial License">Extended Unlimited (Physical Products, Resale, Merch)</option>
                      <option value="Editorial Only License">Editorial / Non-Commercial</option>
                    </select>
                  </div>

                  {/* Real-time Transparent Revenue Split Breakdown */}
                  {(() => {
                    const split = calculateRevenueSplit(price);
                    return (
                      <div
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-light)",
                          borderRadius: "var(--radius-sm)",
                          padding: "12px",
                          fontSize: "0.8rem"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "var(--text-muted)" }}>
                          <span>Customer Pays (Gross):</span>
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>${split.gross.toFixed(2)} USD</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "var(--text-muted)" }}>
                          <span>Paddle Processing Fee:</span>
                          <span style={{ color: "#ef4444" }}>-${split.paddleFee.toFixed(2)} USD</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "var(--text-muted)" }}>
                          <span>GallaryWala Platform (20% Net):</span>
                          <span style={{ color: "#00dfd8" }}>-${split.platformCut.toFixed(2)} USD</span>
                        </div>
                        <div style={{ height: "1px", background: "var(--border-light)", margin: "6px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Your Net Profit (80%):</span>
                          <span style={{ fontWeight: 900, color: "#10b981", fontSize: "0.95rem" }}>
                            +${split.creatorCut.toFixed(2)} USD / sale
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "12px",
                padding: "14px"
              }}
              disabled={uploading || scanning}
            >
              <Sparkles size={18} />
              <span>{uploading ? "Publishing..." : "Publish Image"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
