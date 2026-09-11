import React from "react";
import { usePins } from "../context/PinContext";
import { PinCard } from "./PinCard";
import { ImageOff, Sparkles, Plus } from "lucide-react";

export const MasonryGrid = () => {
  const { filteredPins, searchQuery, selectedCategory, setIsUploadOpen, setSelectedCategory, setSearchQuery } = usePins();

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
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-main)",
            marginBottom: "8px"
          }}
        >
          No pins found
        </h3>
        <p style={{ maxWidth: "400px", marginBottom: "20px", fontSize: "0.9rem" }}>
          {searchQuery
            ? `We couldn't find any pins matching "${searchQuery}". Try searching for another topic or create a new pin!`
            : `No pins in "${selectedCategory}" category yet. Be the first to upload one!`}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              className="nav-tab"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              style={{ border: "1px solid var(--border-light)" }}
            >
              Reset Filters
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus size={16} />
            <span>Create First Pin</span>
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
