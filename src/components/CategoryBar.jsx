import React from "react";
import { CATEGORIES } from "../data/mockPins";
import { usePins } from "../context/PinContext";

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory, activeView } = usePins();

  if (activeView !== "gallery") return null;

  return (
    <div className="category-bar-wrapper">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
