import React from "react";
import { usePins } from "../context/PinContext";
import { PinCard } from "./PinCard";
import { ImageOff, Sparkles, Plus, RotateCcw } from "lucide-react";

export const MasonryGrid = () => {
  const {
    filteredPins,
    searchQuery,
    selectedCategory,
    setIsUploadOpen,
    setSelectedCategory,
    setSearchQuery,
    isLoading
  } = usePins();

  // 1. Shimmer Skeleton Loader on Initial Page Load (prevents empty screen flickering)
  if (isLoading && filteredPins.length === 0) {
    return (
      <div className="masonry-grid" style={{ minHeight: "60vh" }}>
        {[320, 260, 380, 290, 340, 270, 360, 300].map((height, idx) => (
          <div
            key={idx}
            className="pin-card-wrapper"
            style={{
              height: `${height}px`,
              background: "linear-gradient(110deg, var(--bg-surface) 8%, var(--bg-surface-elevated) 18%, var(--bg-surface) 33%)",
              backgroundSize: "200% 100%",
              borderRadius: "var(--radius-lg)",
              animation: "shimmer 1.5s infinite linear",
              marginBottom: "16px",
              border: "1px solid var(--border-light)"
            }}
          />
        ))}
      </div>
    );
  }

  // 2. Empty State when confirmed 0 images
  if (filteredPins.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
          textAlign: "center",
          color: "var(--text-secondary)"
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--bg-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "var(--text-muted)"
          }}
        >
          <ImageOff size={32} />
        </div>
        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "8px"
          }}
        >
          {searchQuery ? "No matching visuals found" : "No images uploaded yet"}
        </h3>
        <p style={{ maxWidth: "440px", marginBottom: "24px", fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {searchQuery
            ? `We couldn't find any pins matching "${searchQuery}". Try searching for another topic or create a new pin!`
            : selectedCategory !== "All"
            ? `No visuals found in "${selectedCategory}". Be the first creator to upload one!`
            : "The gallery is currently clean and fresh. Click the button below to upload your first 4K visual or wallpaper!"}
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                border: "1px solid var(--border-light)",
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-surface-hover)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-surface-elevated)";
                e.currentTarget.style.borderColor = "var(--border-light)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <RotateCcw size={15} color="var(--color-primary)" />
              <span>Reset & View All</span>
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => setIsUploadOpen(true)}
            style={{
              padding: "10px 22px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 700,
              fontSize: "0.88rem"
            }}
          >
            <Plus size={16} />
            <span>Upload to this Category</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-columns">
      {filteredPins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </div>
  );
};
