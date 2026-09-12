import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data/mockPins";
import { usePins } from "../context/PinContext";

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory, activeView } = usePins();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Drag-to-scroll state for desktop & smooth touch
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

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
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -240 : 240;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
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
    <div className="category-bar-outer">
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
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? "active" : ""}`}
              onClick={(e) => handleCategoryClick(cat, e)}
            >
              {cat === "All" && <Sparkles size={13} style={{ marginRight: 6 }} />}
              {cat}
            </button>
          );
        })}
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
