import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  Heart,
  Download,
  Share2,
  ExternalLink,
  Bookmark,
  ChevronDown
} from "lucide-react";

export const PinCard = ({ pin }) => {
  const {
    likedPinIds,
    toggleLike,
    setActivePin,
    boards,
    savePinToBoard,
    downloadImage,
    showToast
  } = usePins();

  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = likedPinIds.includes(pin.id);

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadImage(pin.imageUrl, pin.title);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pin.imageUrl);
      showToast("Image link copied to clipboard! 📋", "success");
    } else {
      showToast("Shared: " + pin.title, "info");
    }
  };

  const handleQuickSave = (e) => {
    e.stopPropagation();
    if (boards.length > 0) {
      savePinToBoard(pin.id, boards[0].id);
    } else {
      showToast("Please create a board first! 📌", "info");
    }
  };

  const handleSelectBoard = (e, boardId) => {
    e.stopPropagation();
    savePinToBoard(pin.id, boardId);
    setIsBoardMenuOpen(false);
  };

  return (
    <div className="pin-card-wrapper">
      <div className="pin-card" onClick={() => setActivePin(pin)}>
        <div className="pin-image-container">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="pin-image"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{
              opacity: imageLoaded ? 1 : 0.4,
              transition: "opacity 0.3s ease-in-out"
            }}
          />

          {/* Hover Overlay */}
          <div className="pin-overlay">
            {/* Top Row: Save Button & Board Dropdown */}
            <div className="pin-overlay-top">
              <div style={{ position: "relative" }}>
                <button
                  className="save-btn"
                  onClick={handleQuickSave}
                  title={`Save to ${boards[0]?.name || "Board"}`}
                >
                  Save
                </button>
                {boards.length > 1 && (
                  <button
                    className="save-btn"
                    style={{
                      marginLeft: "4px",
                      padding: "10px 8px"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBoardMenuOpen(!isBoardMenuOpen);
                    }}
                    title="Choose Board"
                  >
                    <ChevronDown size={14} />
                  </button>
                )}

                {/* Dropdown Menu for Boards */}
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
                      minWidth: "160px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        padding: "4px 8px"
                      }}
                    >
                      Save to board:
                    </div>
                    {boards.map((b) => (
                      <button
                        key={b.id}
                        style={{
                          textAlign: "left",
                          padding: "6px 10px",
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
                        onClick={(e) => handleSelectBoard(e, b.id)}
                      >
                        <Bookmark size={14} color="var(--color-primary)" />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Link and Action Icons */}
            <div className="pin-overlay-bottom">
              {pin.link ? (
                <a
                  href={pin.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pin-link-chip"
                  onClick={(e) => e.stopPropagation()}
                  title={pin.link}
                >
                  <ExternalLink size={12} />
                  <span>{new URL(pin.link).hostname.replace("www.", "")}</span>
                </a>
              ) : (
                <div />
              )}

              <div className="pin-actions-group">
                <button
                  className={`overlay-action-btn ${isLiked ? "liked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(pin.id);
                  }}
                  title={isLiked ? "Unlike" : "Like"}
                >
                  <Heart
                    size={16}
                    fill={isLiked ? "var(--color-primary)" : "none"}
                    color={isLiked ? "var(--color-primary)" : "currentColor"}
                    className={isLiked ? "pulse-heart" : ""}
                  />
                </button>

                <button
                  className="overlay-action-btn"
                  onClick={handleDownload}
                  title="Download Image"
                >
                  <Download size={16} />
                </button>

                <button
                  className="overlay-action-btn"
                  onClick={handleShare}
                  title="Copy link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pin Metadata */}
        <div className="pin-meta">
          <div className="pin-meta-title">{pin.title}</div>
          <div className="pin-author-row">
            <div className="pin-author-info">
              {pin.author?.avatar && (
                <img
                  src={pin.author.avatar}
                  alt={pin.author.name}
                  className="pin-author-avatar"
                />
              )}
              <span>{pin.author?.name || "Anonymous"}</span>
            </div>
            <div className="pin-likes-count">
              <Heart
                size={12}
                fill={isLiked ? "var(--color-primary)" : "currentColor"}
                color={isLiked ? "var(--color-primary)" : "currentColor"}
              />
              <span>{pin.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
