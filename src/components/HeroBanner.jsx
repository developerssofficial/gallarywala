import React from "react";
import { usePins } from "../context/PinContext";
import { Sparkles, Compass } from "lucide-react";

export const HeroBanner = () => {
  const { searchQuery, selectedCategory, filteredPins, activeView } = usePins();

  if (activeView !== "gallery") return null;

  return (
    <div className="hero-banner">
      <div>
        <h1 className="hero-title">
          {searchQuery ? (
            <>
              Results for <span className="brand-text-gradient">"{searchQuery}"</span>
            </>
          ) : selectedCategory !== "All" ? (
            <>
              Explore <span className="brand-text-gradient">{selectedCategory}</span>
            </>
          ) : (
            <>
              Curated <span className="brand-text-gradient">Visual Inspiration</span>
            </>
          )}
        </h1>
        <p className="hero-sub">
          {filteredPins.length} high-resolution photographs & digital creations discovered
        </p>
      </div>
    </div>
  );
};
