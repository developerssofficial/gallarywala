import React, { useState, useEffect } from "react";
import { usePins } from "../context/PinContext";
import { VerifiedBadge } from "./VerifiedBadge";
import { CATEGORIES } from "../data/mockPins";
import {
  X,
  Heart,
  Download,
  Share2,
  ExternalLink,
  Send,
  Bookmark,
  ChevronDown,
  Sparkles,
  Lock,
  Unlock,
  BadgeCheck,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Flag,
  Edit3,
  Trash2,
  Check,
  RotateCcw,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";

export const PinDetailModal = () => {
  const {
    activePin,
    setActivePin,
    likedPinIds,
    toggleLike,
    boards,
    savePinToBoard,
    addComment,
    downloadImage,
    showToast,
    isPinUnlocked,
    setCheckoutPin,
    isUserVerified,
    setReportingPin,
    isPinOwner,
    updatePin,
    deletePin
  } = usePins();

  const [commentText, setCommentText] = useState("");
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Edit State Fields
  const [editCategory, setEditCategory] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editIsPaid, setEditIsPaid] = useState(false);
  const [editPrice, setEditPrice] = useState("4.99");

  const isOwner = isPinOwner(activePin);

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    setIsEditing(false);
    setIsFullViewOpen(false);
    handleResetZoom();
  }, [activePin?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isFullViewOpen) {
          setIsFullViewOpen(false);
          handleResetZoom();
        } else if (isEditing) {
          setIsEditing(false);
        } else {
          setActivePin(null);
        }
      } else if (isFullViewOpen && zoomLevel > 1) {
        // Arrow keys to pan
        if (e.key === "ArrowLeft") {
          setPanPosition((p) => ({ ...p, x: p.x + 40 }));
        } else if (e.key === "ArrowRight") {
          setPanPosition((p) => ({ ...p, x: p.x - 40 }));
        } else if (e.key === "ArrowUp") {
          setPanPosition((p) => ({ ...p, y: p.y + 40 }));
        } else if (e.key === "ArrowDown") {
          setPanPosition((p) => ({ ...p, y: p.y - 40 }));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActivePin, isEditing, isFullViewOpen, zoomLevel]);

  // Touch Gestures State & Refs (1-Finger Pan + 2-Finger Pinch to Zoom)
  const pinchRef = React.useRef({
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 },
    lastTapTime: 0
  });

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag & Pinch-to-Zoom Handlers (Mobile Multi-Touch)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // 2 Fingers Touch -> Start Pinch to Zoom & Pan
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };
      pinchRef.current = {
        initialDistance: dist,
        initialZoom: zoomLevel,
        initialPan: { ...panPosition },
        initialCenter: center,
        lastTapTime: 0
      };
      setIsDragging(true);
    } else if (e.touches.length === 1) {
      // 1 Finger Touch -> Drag when zoomed + Double Tap detection
      const now = Date.now();
      const lastTap = pinchRef.current.lastTapTime || 0;
      if (now - lastTap < 300) {
        // Double tap detected! Toggle Zoom
        if (zoomLevel > 1) {
          handleResetZoom();
        } else {
          setZoomLevel(2.2);
        }
        pinchRef.current.lastTapTime = 0;
        return;
      }
      pinchRef.current.lastTapTime = now;

      if (zoomLevel > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - panPosition.x,
          y: e.touches[0].clientY - panPosition.y
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // 2-Finger Pinch-to-Zoom & Pan Live
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };

      const { initialDistance, initialZoom, initialPan, initialCenter } = pinchRef.current;
      if (initialDistance > 0) {
        const scaleFactor = dist / initialDistance;
        const newZoom = Math.min(5.0, Math.max(0.6, Number((initialZoom * scaleFactor).toFixed(2))));
        setZoomLevel(newZoom);

        // Move pan position with finger center shift
        const deltaX = center.x - initialCenter.x;
        const deltaY = center.y - initialCenter.y;
        setPanPosition({
          x: initialPan.x + deltaX,
          y: initialPan.y + deltaY
        });
      }
    } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      // 1-Finger Pan
      e.preventDefault();
      setPanPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      pinchRef.current.initialDistance = 0;
      // If zoomed out too small, snap back to 100%
      if (zoomLevel < 1.0) {
        handleResetZoom();
      }
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      // Seamlessly transition from 2 fingers to 1 finger dragging
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y
      });
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoomLevel((prev) => {
      const next = Math.min(4.0, Math.max(0.5, Number((prev + delta).toFixed(2))));
      if (next <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  if (!activePin) return null;

  const isLiked = likedPinIds.includes(activePin.id);
  const isPaid = Boolean(activePin.isPaid || activePin.price);
  const isUnlocked = isPinUnlocked(activePin);

  const handleStartEdit = () => {
    setEditCategory(activePin.category || "Anime");
    setEditTitle(activePin.title || "");
    setEditDescription(activePin.description || "");
    setEditTags(Array.isArray(activePin.tags) ? activePin.tags.join(", ") : activePin.tags || "");
    setEditIsPaid(Boolean(activePin.isPaid || activePin.price));
    setEditPrice(activePin.price ? String(activePin.price) : "4.99");
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault?.();
    const tagsArr = editTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    updatePin(activePin.id, {
      category: editCategory,
      title: editTitle.trim() || editCategory || "General",
      description: editDescription.trim(),
      tags: tagsArr.length > 0 ? tagsArr : [editCategory.toLowerCase()],
      isPaid: Boolean(editIsPaid),
      price: editIsPaid ? Number(editPrice) : 0
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${activePin.title}"?`)) {
      deletePin(activePin.id);
      setActivePin(null);
    }
  };

  const handleDownload = () => {
    if (isPaid && !isUnlocked) {
      setCheckoutPin(activePin);
      showToast(`🔒 Commercial License required: $${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}`, "info");
      return;
    }
    downloadImage(activePin.imageUrl, activePin.title);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?pin=${activePin.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: activePin.title || "GallaryWala Image",
          text: `Check out "${activePin.title}" on GallaryWala!`,
          url: shareUrl
        });
        showToast("Shared successfully! 🚀", "success");
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Share fallback", err);
        }
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast("Direct pin link copied to clipboard! 📋", "success");
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(activePin.id, commentText);
    setCommentText("");
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setActivePin(null)}
    >
      <div
        className="modal-container pin-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls: Back Button & Close Button */}
        <button
          className="modal-back-btn"
          onClick={() => setActivePin(null)}
          title="Back to Gallery (Esc)"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          className="modal-close-btn"
          onClick={() => setActivePin(null)}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image Display with Smart Watermark */}
        <div className="detail-image-side" style={{ position: "relative" }}>
          {/* Quick Full View Button */}
          <button
            className="full-view-badge-btn"
            onClick={() => {
              setZoomLevel(1);
              setIsFullViewOpen(true);
            }}
            title="Expand to Fullscreen / Full View"
          >
            <Maximize2 size={14} />
            <span>Full View</span>
          </button>

          <img
            src={activePin.imageUrl}
            alt={`${activePin.title || activePin.category || "Wallpaper"} — Free 4K Wallpaper & HD Digital Art on GallaryWala`}
            className="detail-image"
            decoding="async"
            onClick={() => {
              setZoomLevel(1);
              setIsFullViewOpen(true);
            }}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              cursor: "zoom-in",
              userSelect: isPaid && !isUnlocked ? "none" : "auto",
              pointerEvents: isPaid && !isUnlocked ? "none" : "auto"
            }}
            onContextMenu={(e) => {
              if (isPaid && !isUnlocked) e.preventDefault();
            }}
          />

          {/* Dynamic Watermark Grid Overlay for Protected Paid Pins */}
          {isPaid && !isUnlocked && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(4, 1fr)",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 5,
                background: "rgba(0, 0, 0, 0.08)"
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-25deg)",
                    opacity: 0.35,
                    color: "#ffffff",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textAlign: "center",
                    padding: "10px"
                  }}
                >
                  GALLARYWALA PROTECTED PREVIEW
                </div>
              ))}
            </div>
          )}

          {/* Protected Preview Pill Tag */}
          {isPaid && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                zIndex: 10,
                background: isUnlocked ? "rgba(16, 185, 129, 0.95)" : "rgba(15, 15, 25, 0.9)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                border: isUnlocked ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.2)"
              }}
            >
              {isUnlocked ? (
                <>
                  <BadgeCheck size={15} color="#fff" />
                  <span>COMMERCIAL LICENSE UNLOCKED</span>
                </>
              ) : (
                <>
                  <Lock size={14} color="#00dfd8" />
                  <span>PROTECTED PREVIEW • ${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Details & Comments or Owner Edit Form */}
        <div className="detail-content-side">
          {/* Header Action Row */}
          <div className="detail-header-actions">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                className={`icon-btn ${isLiked ? "active" : ""}`}
                onClick={() => toggleLike(activePin.id)}
                title={isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  size={20}
                  fill={isLiked ? "var(--color-primary)" : "none"}
                  color={isLiked ? "var(--color-primary)" : "currentColor"}
                />
              </button>
              <button
                className="icon-btn"
                onClick={handleDownload}
                title={isPaid && !isUnlocked ? "Unlock to Download" : "Download full image"}
                style={{
                  color: isPaid && !isUnlocked ? "#00dfd8" : "inherit"
                }}
              >
                {isPaid && !isUnlocked ? <Lock size={20} /> : <Download size={20} />}
              </button>
              <button
                className="icon-btn"
                onClick={handleShare}
                title="Share direct link"
              >
                <Share2 size={20} />
              </button>

              {/* Creator Edit Button - Only shown to the person who uploaded this image */}
              {isOwner && (
                <button
                  className={`icon-btn ${isEditing ? "active" : ""}`}
                  onClick={() => (isEditing ? setIsEditing(false) : handleStartEdit())}
                  title="Edit Details & Category (Uploader Only)"
                  style={{
                    background: isEditing ? "var(--brand-gradient)" : "var(--bg-surface)",
                    color: isEditing ? "#fff" : "var(--color-primary)",
                    border: "1px solid var(--color-primary)"
                  }}
                >
                  <Edit3 size={18} />
                </button>
              )}

              <button
                className="icon-btn"
                onClick={() => setReportingPin(activePin)}
                title="Report / Copyright Claim (DMCA)"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Flag size={18} />
              </button>
              {activePin.link && (
                <a
                  href={activePin.link.startsWith("http") ? activePin.link : `https://${activePin.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  title="Visit website"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>

            {/* Save to Board Group */}
            <div style={{ position: "relative", display: "flex", gap: "4px" }}>
              <button
                className="save-btn"
                onClick={() => {
                  if (boards.length > 0) {
                    savePinToBoard(activePin.id, boards[0].id);
                  }
                }}
              >
                Save
              </button>
              {boards.length > 1 && (
                <button
                  className="save-btn"
                  style={{ padding: "10px 8px" }}
                  onClick={() => setIsBoardMenuOpen(!isBoardMenuOpen)}
                >
                  <ChevronDown size={14} />
                </button>
              )}

              {isBoardMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    zIndex: 30,
                    background: "var(--bg-modal)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    padding: "8px",
                    minWidth: "180px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  {boards.map((b) => (
                    <button
                      key={b.id}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-main)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--bg-surface)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => {
                        savePinToBoard(activePin.id, b.id);
                        setIsBoardMenuOpen(false);
                      }}
                    >
                      <Bookmark size={14} color="var(--color-primary)" />
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= INLINE OWNER EDITING FORM ================= */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
              <div
                style={{
                  background: "rgba(121, 40, 202, 0.12)",
                  border: "1px solid rgba(121, 40, 202, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.85rem"
                }}
              >
                <Edit3 size={16} color="var(--color-primary)" />
                <span>
                  <strong>Edit Mode:</strong> You can change the category, title, tags or pricing.
                </span>
              </div>

              {/* Category Dropdown */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Category *
                </label>
                <select
                  className="form-select"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{ fontWeight: 600 }}
                  required
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Neon Tokyo 4K"
                />
              </div>

              {/* Description Field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Write a brief backstory or description..."
                  style={{ minHeight: "65px" }}
                />
              </div>

              {/* Keywords / Tags */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Keywords / Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. 4k, neon, anime, wallpaper"
                />
              </div>

              {/* Price / Commercial License */}
              <div
                style={{
                  background: "var(--bg-surface)",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <DollarSign size={16} color="var(--color-primary)" />
                    <span>Commercial Asset ($)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={editIsPaid}
                    onChange={(e) => setEditIsPaid(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  />
                </div>
                {editIsPaid && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Price ($ USD):</span>
                    <input
                      type="number"
                      min="0.99"
                      step="0.50"
                      className="form-input"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      style={{ width: "110px", padding: "6px 10px" }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "10px" }}
                >
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: "10px 16px", width: "auto", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="icon-btn"
                  title="Delete this image"
                  style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)", padding: "10px 14px", width: "auto" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </form>
          ) : (
            /* ================= NORMAL VIEW MODE ================= */
            <>
              {/* Author Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  marginTop: "10px"
                }}
              >
                {activePin.author?.avatar && (
                  <img
                    src={activePin.author.avatar}
                    alt={activePin.author.name}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{activePin.author?.name || "Creator"}</span>
                    {isUserVerified(activePin.author) && (
                      <VerifiedBadge size={16} title={`Verified Creator: ${activePin.author?.name || "Creator"}`} />
                    )}
                    {isOwner && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          background: "var(--brand-gradient)",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)"
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {activePin.author?.username || "@creator"} • Category: <strong style={{ color: "var(--color-primary)" }}>{activePin.category || "General"}</strong>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="detail-title">{activePin.title}</h2>
              {activePin.description && (
                <p className="detail-desc">{activePin.description}</p>
              )}

              {/* Tags */}
              {Array.isArray(activePin.tags) && activePin.tags.length > 0 && (
                <div className="detail-tags">
                  {activePin.tags.map((tag, idx) => (
                    <span key={idx} className="tag-badge">
                      #{String(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Commercial Monetization & License Box */}
              {isPaid ? (
                <div
                  style={{
                    margin: "18px 0",
                    background: isUnlocked
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)"
                      : "linear-gradient(135deg, rgba(121, 40, 202, 0.18) 0%, rgba(0, 223, 216, 0.12) 100%)",
                    border: isUnlocked
                      ? "1px solid rgba(16, 185, 129, 0.4)"
                      : "1px solid rgba(121, 40, 202, 0.4)",
                    borderRadius: "var(--radius-lg)",
                    padding: "18px",
                    position: "relative",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <ShieldCheck size={18} color={isUnlocked ? "#10b981" : "#00dfd8"} />
                        <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                          {isUnlocked ? "Commercial License Unlocked" : (activePin.license || "Commercial License Available")}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
                        {isUnlocked
                          ? "You own full rights to use this unwatermarked 4K asset for client and commercial projects."
                          : "Direct creator purchase with instant unwatermarked 4K high-resolution download."}
                      </p>
                    </div>

                    {!isUnlocked && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-primary)" }}>
                          ${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>One-time payment</div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {isUnlocked ? (
                    <button
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "12px",
                        background: "#10b981",
                        color: "#fff",
                        fontWeight: 700
                      }}
                      onClick={handleDownload}
                    >
                      <Download size={18} />
                      <span>Download Original 4K (Unwatermarked)</span>
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "12px",
                        fontWeight: 700
                      }}
                      onClick={() => setCheckoutPin(activePin)}
                    >
                      <DollarSign size={18} />
                      <span>Unlock Commercial License — ${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}</span>
                    </button>
                  )}
                </div>
              ) : null}

              {/* Comments Section */}
              <div className="comments-section">
                <div className="comments-title">
                  Comments ({activePin.comments ? activePin.comments.length : 0})
                </div>

                <div className="comments-list">
                  {activePin.comments && activePin.comments.length > 0 ? (
                    activePin.comments.map((comment, index) => (
                      <div key={index} className="comment-item">
                        <img
                          src={comment.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={comment.user}
                          className="comment-avatar"
                        />
                        <div className="comment-body">
                          <div className="comment-user">{comment.user}</div>
                          <div className="comment-text">{comment.text}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="comment-input-row">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="icon-btn"
                    disabled={!commentText.trim()}
                    style={{ opacity: commentText.trim() ? 1 : 0.5 }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Immersive Fullscreen Lightbox / Full View Theatre Mode */}
      {isFullViewOpen && (
        <div
          className="fullview-backdrop"
          onClick={() => {
            setIsFullViewOpen(false);
            setZoomLevel(1);
          }}
        >
          {/* Top Control Bar */}
          <div
            className="fullview-header"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                className="fullview-back-btn"
                onClick={() => {
                  setIsFullViewOpen(false);
                  setZoomLevel(1);
                }}
                title="Back to Details (Esc)"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <div className="fullview-title-box">
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "260px" }}>
                  {activePin.title || activePin.category}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700 }}>
                  {activePin.category} • 4K Ultra HD
                </span>
              </div>
            </div>

            {/* Action & Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                className="fullview-icon-btn"
                onClick={() => {
                  setZoomLevel((z) => {
                    const next = Math.max(0.5, Number((z - 0.25).toFixed(2)));
                    if (next <= 1) setPanPosition({ x: 0, y: 0 });
                    return next;
                  });
                }}
                title="Zoom Out (-)"
              >
                <ZoomOut size={18} />
              </button>
              <button
                className="fullview-zoom-pill"
                onClick={handleResetZoom}
                title="Reset Zoom (100%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                className="fullview-icon-btn"
                onClick={() => setZoomLevel((z) => Math.min(4.0, Number((z + 0.25).toFixed(2))))}
                title="Zoom In (+)"
              >
                <ZoomIn size={18} />
              </button>
              <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />
              <button
                className="fullview-download-btn"
                onClick={handleDownload}
                title={isPaid && !isUnlocked ? "Unlock Commercial License" : "Download 4K Image"}
              >
                <Download size={16} />
                <span className="fullview-dl-text">Download</span>
              </button>
              <button
                className="fullview-icon-btn fullview-close-btn"
                onClick={() => {
                  setIsFullViewOpen(false);
                  handleResetZoom();
                }}
                title="Close Full View (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Centered Image Stage with 2D Pan & Drag */}
          <div
            className={`fullview-stage ${isDragging ? "is-dragging" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onDoubleClick={() => {
              if (zoomLevel > 1) {
                handleResetZoom();
              } else {
                setZoomLevel(1.75);
              }
            }}
          >
            <img
              src={activePin.imageUrl}
              alt={activePin.title}
              className="fullview-image-el"
              draggable={false}
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            />

            {/* Floating Navigation Hint when Zoomed In */}
            {zoomLevel > 1 && (
              <div className="fullview-pan-indicator">
                <span>🤏 Pinch & drag with fingers to explore</span>
                <button
                  className="fullview-reset-pan-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetZoom();
                  }}
                  title="Reset Position & Zoom"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
