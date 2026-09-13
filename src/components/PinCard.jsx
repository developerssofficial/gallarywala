import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  Heart,
  Download,
  Share2,
  ExternalLink,
  Bookmark,
  ChevronDown,
  Sparkles,
  Lock,
  Unlock,
  DollarSign,
  Flag
} from "lucide-react";

const getSafeHostname = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string") return "link";
  try {
    const formatted = urlStr.startsWith("http://") || urlStr.startsWith("https://")
      ? urlStr
      : `https://${urlStr}`;
    return new URL(formatted).hostname.replace(/^www\./, "");
  } catch {
    return urlStr.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "link";
  }
};

export const PinCard = ({ pin }) => {
  if (!pin) return null;
  const {
    likedPinIds,
    toggleLike,
    setActivePin,
    boards,
    savePinToBoard,
    downloadImage,
    showToast,
    isPinUnlocked,
    setCheckoutPin,
    isUserVerified,
    setReportingPin
  } = usePins();

  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = likedPinIds.includes(pin.id);
  const isPaid = Boolean(pin.isPaid || pin.price);
  const unlocked = isPinUnlocked(pin);

  const handleDownload = (e) => {
    e.stopPropagation();
    if (isPaid && !unlocked) {
      setCheckoutPin(pin);
      showToast(`🔒 Commercial Asset: Unlock for $${pin.price || '4.99'}`, "info");
      return;
    }
    downloadImage(pin.imageUrl, pin.title);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?pin=${pin.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title || "GallaryWala Image",
          text: `Check out "${pin.title}" on GallaryWala!`,
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

          {/* Image & Price Badges */}
          {isPaid && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 10,
                background: unlocked ? "rgba(16, 185, 129, 0.9)" : "rgba(15, 15, 20, 0.85)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: unlocked ? "0 2px 10px rgba(16,185,129,0.4)" : "0 2px 10px rgba(0,0,0,0.4)",
                border: unlocked ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.2)"
              }}
            >
              {unlocked ? (
                <>
                  <Unlock size={12} color="#fff" />
                  <span>UNLOCKED</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} color="#00dfd8" />
                  <span>${pin.price ? Number(pin.price).toFixed(2) : "4.99"}</span>
                </>
              )}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="pin-overlay">
            {/* Top Row: Save Button & Board Dropdown */}
            <div className="pin-overlay-top">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {isPaid && !unlocked && (
                  <button
                    className="btn-primary"
                    style={{
                      padding: "7px 12px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: "var(--radius-full)"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCheckoutPin(pin);
                    }}
                    title="Unlock with Paddle"
                  >
                    <Lock size={12} />
                    <span>Buy ${pin.price ? Number(pin.price).toFixed(2) : "4.99"}</span>
                  </button>
                )}

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
            </div>

            {/* Bottom Row: Link and Action Icons */}
            <div className="pin-overlay-bottom">
              {pin.link ? (
                <a
                  href={pin.link.startsWith("http") ? pin.link : `https://${pin.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pin-link-chip"
                  onClick={(e) => e.stopPropagation()}
                  title={pin.link}
                >
                  <ExternalLink size={12} />
                  <span>{getSafeHostname(pin.link)}</span>
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
                  title={isPaid && !unlocked ? "Unlock Commercial License" : "Download Image"}
                  style={{
                    color: isPaid && !unlocked ? "#00dfd8" : "inherit"
                  }}
                >
                  {isPaid && !unlocked ? <Lock size={16} /> : <Download size={16} />}
                </button>

                <button
                  className="overlay-action-btn"
                  onClick={handleShare}
                  title="Copy link"
                >
                  <Share2 size={16} />
                </button>

                <button
                  className="overlay-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportingPin(pin);
                  }}
                  title="Report / Copyright Claim"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  <Flag size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
