import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  X,
  Plus,
  Bookmark,
  Heart,
  Folder,
  Layers,
  Sparkles,
  ArrowLeft,
  LogOut,
  ShoppingBag,
  BadgeCheck,
  Download,
  CreditCard
} from "lucide-react";
import { PinCard } from "./PinCard";

export const UserProfileModal = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    pins,
    boards,
    likedPinIds,
    purchasedPinIds,
    createBoard,
    showToast,
    setActivePin,
    setActiveView,
    setSelectedBoardId,
    currentUser,
    setIsSettingsOpen,
    setSettingsTab,
    handleSignOut,
    downloadImage,
    isUserVerified
  } = usePins();

  const [activeTab, setActiveTab] = useState("boards"); // 'boards' | 'created' | 'liked' | 'purchased'
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  if (!isProfileOpen) return null;

  const userHandle = currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "guest";
  const userFullName = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Creator Studio";
  const userAvatar = currentUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser?.email || "guest")}`;

  const myCreatedPins = pins.filter(
    (p) =>
      p.author?.username === `@${userHandle}` ||
      (currentUser && p.author?.name === userFullName)
  );
  const myLikedPins = pins.filter((p) => likedPinIds.includes(p.id));
  const myPurchasedPins = pins.filter((p) => purchasedPinIds.includes(p.id));

  const handleCreateBoardSubmit = (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    createBoard(newBoardName.trim());
    setNewBoardName("");
    setIsCreatingBoard(false);
  };

  const handleOpenBoard = (boardId) => {
    setSelectedBoardId(boardId);
    setActiveView("board");
    setIsProfileOpen(false);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsProfileOpen(false)}
    >
      <div
        className="modal-container"
        style={{
          width: "100%",
          maxWidth: "880px",
          padding: "36px",
          minHeight: "600px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsProfileOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--color-primary)",
              marginBottom: "14px",
              boxShadow: "var(--brand-glow)"
            }}
          >
            <img
              src={userAvatar}
              alt="Your Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <span>{userFullName}</span>
            {isUserVerified({ name: userFullName, username: userHandle, email: currentUser?.email }) && (
              <VerifiedBadge size={20} title={`Verified Creator: ${userFullName}`} />
            )}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "12px" }}>
            @{userHandle} • {currentUser ? "Member Account" : "Guest Mode"}
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="nav-tab"
              style={{ fontSize: "0.85rem", padding: "8px 16px", border: "1px solid var(--border-light)" }}
              onClick={() => {
                setIsProfileOpen(false);
                setSettingsTab(currentUser ? "general" : "account");
                setIsSettingsOpen(true);
              }}
            >
              {currentUser ? "Settings & Profile" : "Sign In to claim your @username"}
            </button>

            {currentUser && (
              <button
                className="btn-primary"
                style={{
                  fontSize: "0.85rem",
                  padding: "8px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)"
                }}
                onClick={async () => {
                  await handleSignOut();
                  setIsProfileOpen(false);
                }}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            )}
          </div>

          {/* Tab Controls */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              background: "var(--bg-surface)",
              padding: "6px",
              borderRadius: "var(--radius-full)"
            }}
          >
            <button
              className={`category-pill ${activeTab === "boards" ? "active" : ""}`}
              onClick={() => setActiveTab("boards")}
            >
              <Bookmark size={15} style={{ display: "inline", marginRight: "6px" }} />
              Boards ({boards.length})
            </button>
            <button
              className={`category-pill ${activeTab === "created" ? "active" : ""}`}
              onClick={() => setActiveTab("created")}
            >
              <Sparkles size={15} style={{ display: "inline", marginRight: "6px" }} />
              Created ({myCreatedPins.length})
            </button>
            <button
              className={`category-pill ${activeTab === "liked" ? "active" : ""}`}
              onClick={() => setActiveTab("liked")}
            >
              <Heart size={15} style={{ display: "inline", marginRight: "6px" }} />
              Liked ({myLikedPins.length})
            </button>
            <button
              className={`category-pill ${activeTab === "purchased" ? "active" : ""}`}
              onClick={() => setActiveTab("purchased")}
            >
              <ShoppingBag size={15} style={{ display: "inline", marginRight: "6px" }} />
              Purchased ({myPurchasedPins.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Boards List */}
        {activeTab === "boards" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                Saved Collections
              </h3>
              <button
                className="btn-primary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                onClick={() => setIsCreatingBoard(!isCreatingBoard)}
              >
                <Plus size={16} />
                <span>New Board</span>
              </button>
            </div>

            {/* Create Board Inline Form */}
            {isCreatingBoard && (
              <form
                onSubmit={handleCreateBoardSubmit}
                style={{
                  background: "var(--bg-surface)",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  display: "flex",
                  gap: "10px"
                }}
              >
                <input
                  type="text"
                  placeholder="e.g. Travel Bucketlist, Minimal Posters"
                  className="form-input"
                  style={{ flex: 1 }}
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </form>
            )}

            {/* Boards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px"
              }}
            >
              {boards.map((board) => (
                <div
                  key={board.id}
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    border: "1px solid var(--border-light)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => handleOpenBoard(board.id)}
                >
                  <div
                    style={{
                      height: "140px",
                      background: "#1e222b",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src={board.coverUrl}
                      alt={board.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                  <div style={{ padding: "14px" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        marginBottom: "4px"
                      }}
                    >
                      {board.name}
                    </div>
                    <div
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem"
                      }}
                    >
                      {board.pinIds?.length || 0} pins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Created Pins */}
        {activeTab === "created" && (
          <div>
            {myCreatedPins.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--text-muted)"
                }}
              >
                <Sparkles size={32} style={{ marginBottom: "10px" }} />
                <p>You haven't uploaded any pins yet.</p>
              </div>
            ) : (
              <div className="masonry-columns" style={{ columnCount: 3 }}>
                {myCreatedPins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Liked Pins */}
        {activeTab === "liked" && (
          <div>
            {myLikedPins.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--text-muted)"
                }}
              >
                <Heart size={32} style={{ marginBottom: "10px" }} />
                <p>You haven't liked any pins yet.</p>
              </div>
            ) : (
              <div className="masonry-columns" style={{ columnCount: 3 }}>
                {myLikedPins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Purchased & Unlocked Assets */}
        {activeTab === "purchased" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                Purchased Commercial Library
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
                All high-resolution 4K/8K unwatermarked assets you have unlocked with lifetime download access
              </p>
            </div>

            {myPurchasedPins.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px dashed var(--border-light)",
                  color: "var(--text-muted)"
                }}
              >
                <ShoppingBag size={40} color="var(--color-primary)" style={{ marginBottom: "12px", opacity: 0.8 }} />
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                  No purchased assets yet
                </h4>
                <p style={{ fontSize: "0.85rem", maxWidth: "360px", margin: "0 auto 16px auto" }}>
                  Browse premium creator artworks in the gallery and unlock commercial licenses via Paddle to see them here.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Explore Premium Gallery
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "18px"
                }}
              >
                {myPurchasedPins.map((pin) => (
                  <div
                    key={pin.id}
                    style={{
                      background: "var(--bg-surface)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    <div style={{ height: "160px", overflow: "hidden", position: "relative", cursor: "pointer" }} onClick={() => { setActivePin(pin); setIsProfileOpen(false); }}>
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#10b981",
                          color: "#fff",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                      >
                        <BadgeCheck size={12} />
                        <span>LICENSED</span>
                      </div>
                    </div>

                    <div style={{ padding: "14px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pin.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                        By {pin.author?.name || "Creator"} • Full 4K Resolution
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          padding: "8px 12px",
                          fontSize: "0.8rem",
                          background: "#10b981",
                          color: "#fff"
                        }}
                        onClick={() => downloadImage(pin.imageUrl, pin.title)}
                      >
                        <Download size={14} />
                        <span>Download 4K Asset</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
