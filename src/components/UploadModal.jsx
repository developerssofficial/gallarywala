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
  Loader2
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";

export const UploadModal = () => {
  const {
    isUploadOpen,
    setIsUploadOpen,
    cloudinaryConfig,
    setIsSettingsOpen,
    boards,
    addPin,
    showToast
  } = usePins();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState(CATEGORIES[1] || "Cyberpunk & Sci-Fi");
  const [tagsInput, setTagsInput] = useState("");
  const [targetBoardId, setTargetBoardId] = useState(boards[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isUploadOpen) return null;

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
    if (!title.trim()) {
      showToast("Please enter a title for your image.", "error");
      return;
    }

    // 2. Profanity / Bad words validation on Title, Description, and Keywords/Tags
    const titleCheck = validateSafeText(title);
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

      addPin({
        title: title.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase()],
        link: link.trim() || undefined,
        targetBoardId: targetBoardId || undefined
      });

      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setLink("");
      setTagsInput("");
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

        {/* AI & Cloudinary Status Notice */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(121, 40, 202, 0.12)",
            border: "1px solid rgba(121, 40, 202, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "10px 16px",
            marginBottom: "20px",
            fontSize: "0.85rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={18} color="#00dfd8" />
            <span>
              <strong>AI Safety Active:</strong> NSFW & explicit content is automatically filtered
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsUploadOpen(false);
              setIsSettingsOpen(true);
            }}
            style={{
              color: "var(--text-main)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Cloudinary Settings
          </button>
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
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Neon Tokyo Rain, Vintage Car"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
              <label className="form-label">Keywords / Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 4k, wallpaper, dark, city"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
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
