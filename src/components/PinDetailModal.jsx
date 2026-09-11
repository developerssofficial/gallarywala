import React, { useState, useEffect } from "react";
import { usePins } from "../context/PinContext";
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
  ShieldCheck
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
    setCheckoutPin
  } = usePins();

  const [commentText, setCommentText] = useState("");
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePin(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActivePin]);

  if (!activePin) return null;

  const isLiked = likedPinIds.includes(activePin.id);
  const isPaid = Boolean(activePin.isPaid || activePin.price);
  const isUnlocked = isPinUnlocked(activePin);

  const handleDownload = () => {
    if (isPaid && !isUnlocked) {
      setCheckoutPin(activePin);
      showToast(`🔒 Commercial License required: $${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}`, "info");
      return;
    }
    downloadImage(activePin.imageUrl, activePin.title);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activePin.imageUrl);
      showToast("Link copied to clipboard! 📋", "success");
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
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setActivePin(null)}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image Display with Smart Watermark */}
        <div className="detail-image-side" style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={activePin.imageUrl}
            alt={activePin.title}
            className="detail-image"
            style={{
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

        {/* Right Side: Details & Comments */}
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
                title="Share link"
              >
                <Share2 size={20} />
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

          {/* Author Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px"
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
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {activePin.author?.name || "Creator"}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {activePin.author?.username || "@creator"} • {activePin.likes || 0} likes
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
                    fontWeight: 700,
                    boxShadow: "var(--brand-glow)"
                  }}
                  onClick={() => setCheckoutPin(activePin)}
                >
                  <Lock size={18} />
                  <span>Unlock Original 4K (${activePin.price ? Number(activePin.price).toFixed(2) : "4.99"}) via Paddle</span>
                </button>
              )}

              {/* Features List */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                  marginTop: "12px",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-light)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)"
                }}
              >
                <div>✓ No Watermark in 4K/8K</div>
                <div>✓ Lifetime Download Access</div>
                <div>✓ Commercial & Social Rights</div>
                <div>✓ 80% Creator Revenue Split</div>
              </div>
            </div>
          ) : null}

          {/* Comments Section */}
          <div className="comments-section">
            <h4 className="comments-title">
              Comments ({(Array.isArray(activePin.comments) ? activePin.comments : []).length})
            </h4>

            <div className="comments-list">
              {(activePin.comments || []).length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                activePin.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="comment-avatar"
                    />
                    <div className="comment-body">
                      <div className="comment-user">{comment.user}</div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSubmitComment} className="comment-input-row">
              <input
                type="text"
                placeholder="Add a thought or comment..."
                className="comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "10px 16px" }}
                disabled={!commentText.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
