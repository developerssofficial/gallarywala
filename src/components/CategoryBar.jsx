import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Search,
  X,
  ChevronDown,
  LayoutGrid,
  Check
} from "lucide-react";
import { CATEGORIES } from "../data/mockPins";
import { usePins } from "../context/PinContext";

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory, activeView } = usePins();
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Primary categories shown in the horizontal quick bar
  const PRIMARY_CATEGORIES = CATEGORIES.slice(0, 14);

  // Filtered categories for Show More modal/dropdown
  const modalCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((cat) => cat.toLowerCase().includes(q));
  }, [searchTerm]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  const handleCategorySelect = (cat, e) => {
    setSelectedCategory(cat);
    setIsMenuOpen(false);
    setSearchTerm("");
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
    <div className="category-bar-outer" ref={dropdownRef}>
      {/* Horizontal Scroll Track */}
      <div ref={scrollRef} className="category-bar-wrapper">
        {PRIMARY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? "active" : ""}`}
              onClick={(e) => handleCategorySelect(cat, e)}
            >
              {cat === "All" && <Sparkles size={13} style={{ marginRight: 6 }} />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Dedicated Always-Visible Pinned "Show More" Trigger */}
      <div className="category-show-more-wrapper">
        <button
          type="button"
          className={`category-pill category-show-more-btn ${
            isMenuOpen || (!PRIMARY_CATEGORIES.includes(selectedCategory) && selectedCategory !== "All")
              ? "active"
              : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="Explore all 32+ categories and search"
        >
          <LayoutGrid size={14} />
          <span>
            {!PRIMARY_CATEGORIES.includes(selectedCategory) && selectedCategory !== "All"
              ? selectedCategory
              : "Show More"}
          </span>
          <ChevronDown
            size={14}
            style={{
              transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}
          />
        </button>
      </div>

      {/* ================= SHOW MORE DROPDOWN MODAL / GRID ================= */}
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "95%",
            maxWidth: "720px",
            maxHeight: "440px",
            overflowY: "auto",
            background: "var(--bg-modal)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
            padding: "20px",
            zIndex: 100,
            animation: "scaleIn 0.18s ease-out"
          }}
        >
          {/* Header & Search Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-light)"
            }}
          >
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>
                All Categories & Topics
              </h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                Explore 32+ curated visual themes & wallpaper niches
              </p>
            </div>

            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-full)",
                padding: "6px 12px",
                gap: "8px",
                width: "220px"
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Filter categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-main)",
                  fontSize: "0.82rem",
                  width: "100%",
                  fontWeight: 500
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex"
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {modalCategories.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "var(--text-muted)",
                fontSize: "0.85rem"
              }}
            >
              No categories found matching "{searchTerm}".
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "8px"
              }}
            >
              {modalCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={(e) => handleCategorySelect(cat, e)}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.84rem",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#fff" : "var(--text-main)",
                      background: isSelected ? "var(--brand-gradient)" : "var(--bg-surface)",
                      border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--border-light)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "var(--bg-surface-elevated)";
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "var(--bg-surface)";
                        e.currentTarget.style.borderColor = "var(--border-light)";
                      }
                    }}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


