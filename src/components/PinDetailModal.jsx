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
  Sparkles
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
    showToast
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

  const handleDownload = () => {
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

        {/* Left Side: Image Display */}
        <div className="detail-image-side">
          <img
            src={activePin.imageUrl}
            alt={activePin.title}
            className="detail-image"
          />
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
                title="Download full image"
              >
                <Download size={20} />
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
                  href={activePin.link}
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
          {activePin.tags && activePin.tags.length > 0 && (
            <div className="detail-tags">
              {activePin.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h4 className="comments-title">
              Comments ({(activePin.comments || []).length})
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
