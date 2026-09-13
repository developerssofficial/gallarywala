import React from "react";
import { usePins } from "../context/PinContext";
import {
  Compass,
  Plus,
  Bookmark,
  Settings,
  Sparkles
} from "lucide-react";

export const MobileBottomNav = () => {
  const {
    activeView,
    setActiveView,
    setIsUploadOpen,
    setIsProfileOpen,
    setIsSettingsOpen,
    setSettingsTab,
    boards,
    setSelectedCategory,
    currentUser,
    setIsAuthModalOpen,
    showToast
  } = usePins();

  const totalSavedPins = boards.reduce((acc, b) => acc + (b.pinIds?.length || 0), 0);

  return (
    <nav className="mobile-bottom-nav">
      {/* 1. Explore / Home */}
      <button
        type="button"
        className={`mobile-nav-btn ${activeView === "gallery" ? "active" : ""}`}
        onClick={() => {
          setActiveView("gallery");
          setSelectedCategory("All");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Compass size={22} />
        <span>Explore</span>
      </button>

      {/* 2. Collections / Saved */}
      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => setIsProfileOpen(true)}
      >
        <div style={{ position: "relative" }}>
          <Bookmark size={22} />
          {totalSavedPins > 0 && (
            <span className="mobile-badge-counter">{totalSavedPins}</span>
          )}
        </div>
        <span>Saved</span>
      </button>

      {/* 3. Center Glowing Create / Upload Button */}
      <div className="mobile-create-btn-wrapper">
        <button
          type="button"
          className="mobile-create-btn"
          onClick={() => {
            if (!currentUser) {
              showToast("Please sign in with Google to upload images! 🚀", "info");
              setIsAuthModalOpen(true);
            } else {
              setIsUploadOpen(true);
            }
          }}
          title="Upload & Sell 4K Artwork"
        >
          <Plus size={26} strokeWidth={2.8} />
        </button>
      </div>

      {/* 4. Creator Studio / Monetization */}
      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => {
          setSettingsTab("monetization");
          setIsSettingsOpen(true);
        }}
      >
        <Sparkles size={22} />
        <span>Earnings</span>
      </button>

      {/* 5. Settings & Profile */}
      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => {
          setSettingsTab("general");
          setIsSettingsOpen(true);
        }}
      >
        <Settings size={22} />
        <span>Settings</span>
      </button>
    </nav>
  );
};
