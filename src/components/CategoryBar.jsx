import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  X,
  Compass,
  Flame,
  Filter
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";
import { usePins } from "../context/PinContext";

const CATEGORY_ICONS = {
  "All": "✨",
  "Anime & Manga": "🌸",
  "Cyberpunk & Sci-Fi": "🌌",
  "Neon Aesthetic": "⚡",
  "4K Wallpapers & AMOLED": "🖤",
  "3D Renders & Abstract": "💎",
  "Architecture & Interiors": "🏛️",
  "Nature & Landscapes": "🌿",
  "Gaming & Esports": "🎮",
  "Minimalist & Dark Mode": "🌙",
  "Fantasy & Mythical": "🐉",
  "Supercars & Automotive": "🏎️",
  "Space & Astronomy": "🪐",
  "AI Art & Concepts": "🤖",
  "Street & Urban Photography": "📷",
  "Retro & Synthwave": "📼",
  "Animals & Wildlife": "🦁",
  "Digital Illustrations": "🎨",
  "Studio Ghibli Aesthetic": "🍃",
  "Lo-Fi & Chill Vibes": "☕",
  "Pixel Art & Retro Gaming": "🕹️",
  "Vector & UI Graphics": "📐",
  "Cinematic & Movie Renders": "🎬",
  "Tokyo & Neon Nights": "🏮",
  "Macro Photography": "🔍",
  "Ocean & Underwater": "🌊",
  "Abstract Fluid Art": "🔮",
  "Luxury & Modern Living": "👑",
  "Quotes & Typography": "✍️",
  "Vintage & Nostalgia": "📻",
  "Fashion & Streetwear": "👟",
  "Food & Culinary Art": "🍜"
};

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory, activeView } = usePins();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Drag-to-scroll state for desktop & smooth touch
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((cat) => cat.toLowerCase().includes(q));
  }, [categorySearch]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredCategories]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -260 : 260;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDown.current = false;
  };

  const handleCategoryClick = (cat, e) => {
    if (hasDragged.current) return;
    setSelectedCategory(cat);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  if (activeView !== "gallery") return null;

  return (
    <div className="category-bar-outer" style={{ position: "relative" }}>
      {/* Search Category Quick Filter Pill (Left) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 10, paddingLeft: "8px" }}>
        {isSearchOpen ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--color-primary)",
              borderRadius: "var(--radius-full)",
              padding: "4px 10px",
              gap: "6px",
              boxShadow: "0 0 12px rgba(121, 40, 202, 0.25)",
              animation: "scaleIn 0.15s ease-out"
            }}
          >
            <Search size={14} color="var(--color-primary)" />
            <input
              type="text"
              placeholder="Search 32+ categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              autoFocus
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                width: "140px",
                fontWeight: 600
              }}
            />
            <button
              type="button"
              onClick={() => {
                setCategorySearch("");
                setIsSearchOpen(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
                display: "flex"
              }}
              title="Close category search"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="category-pill"
            onClick={() => setIsSearchOpen(true)}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              color: "var(--text-muted)",
              whiteSpace: "nowrap"
            }}
            title="Search categories"
          >
            <Search size={13} color="var(--color-primary)" />
            <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>Search Topics</span>
          </button>
        )}
      </div>

      {/* Left Arrow Nav */}
      <button
        type="button"
        className={`category-nav-btn category-nav-left ${showLeftArrow ? "visible" : ""}`}
        onClick={() => handleScroll("left")}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Categories Scroll Track */}
      <div
        ref={scrollRef}
        className="category-bar-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {filteredCategories.length === 0 ? (
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>No category matching "{categorySearch}"</span>
            <button
              onClick={() => setCategorySearch("")}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                color: "var(--color-primary)",
                padding: "2px 6px",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            const icon = CATEGORY_ICONS[cat] || "🏷️";
            return (
              <button
                key={cat}
                type="button"
                className={`category-pill ${isActive ? "active" : ""}`}
                onClick={(e) => handleCategoryClick(cat, e)}
              >
                <span style={{ marginRight: 5, fontSize: "0.85rem" }}>{icon}</span>
                <span>{cat}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Right Arrow Nav */}
      <button
        type="button"
        className={`category-nav-btn category-nav-right ${showRightArrow ? "visible" : ""}`}
        onClick={() => handleScroll("right")}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

