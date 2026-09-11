import React, { useRef, useEffect, useState } from "react";
import { usePins } from "../context/PinContext";
import {
  Search,
  Plus,
  Moon,
  Sun,
  X,
  ShieldCheck,
  Bookmark,
  Sparkles,
  User,
  LogIn
} from "lucide-react";

export const Navbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    setIsProfileOpen,
    activeView,
    setActiveView,
    boards,
    setSelectedCategory,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
    currentUser,
    setIsAuthModalOpen
  } = usePins();

  const searchInputRef = useRef(null);
  const [logoClicks, setLogoClicks] = useState(0);

  // Secret Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }

      // Secret Shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setActiveView(activeView === "admin" ? "gallery" : "admin");
        } else {
          setIsAdminAuthModalOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminAuthenticated, activeView, setActiveView, setIsAdminAuthModalOpen]);

  // Handle Logo Multi-Click Secret Entrance (4 clicks)
  const handleLogoClick = () => {
    const clicks = logoClicks + 1;
    setLogoClicks(clicks);
    if (clicks >= 4) {
      setLogoClicks(0);
      if (isAdminAuthenticated) {
        setActiveView("admin");
      } else {
        setIsAdminAuthModalOpen(true);
      }
    } else {
      setActiveView("gallery");
      setSelectedCategory("All");
      setSearchQuery("");
      setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  // Check if search contains /admin
  const handleSearchChange = (val) => {
    if (val.trim() === "/admin") {
      setSearchQuery("");
      if (isAdminAuthenticated) {
        setActiveView("admin");
      } else {
        setIsAdminAuthModalOpen(true);
      }
      return;
    }
    setSearchQuery(val);
    if (activeView !== "gallery") {
      setActiveView("gallery");
    }
  };

  const totalSavedPins = boards.reduce((acc, b) => acc + (b.pinIds?.length || 0), 0);

  return (
    <header className="navbar-sticky">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={handleLogoClick}
          title="GallaryWala (Home)"
        >
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <span className="brand-text-gradient">GallaryWala</span>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search images by name (e.g. Neon Tokyo, Alpine Lake, Cyberpunk)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery ? (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <span className="search-shortcut" title="Press '/' key to search">/</span>
            )}
          </div>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          {/* Secret Admin Studio indicator (only when admin is logged in) */}
          {isAdminAuthenticated && (
            <button
              className={`icon-btn ${activeView === "admin" ? "active" : ""}`}
              onClick={() => setActiveView(activeView === "admin" ? "gallery" : "admin")}
              title={activeView === "admin" ? "Switch to Public Gallery" : "Open Admin Studio"}
              style={{
                borderColor: "var(--color-primary)",
                background: "rgba(121, 40, 202, 0.15)",
                color: "#ff0080"
              }}
            >
              <ShieldCheck size={20} />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Saved Collections */}
          <button
            className="icon-btn"
            onClick={() => setIsProfileOpen(true)}
            title="View Collections & Liked"
          >
            <Bookmark size={20} />
            {totalSavedPins > 0 && (
              <span className="badge-counter">{totalSavedPins}</span>
            )}
          </button>

          {/* Supabase User Login / Profile Button */}
          {currentUser ? (
            <button
              className="avatar-btn"
              onClick={() => setIsAuthModalOpen(true)}
              title={`Logged in as ${currentUser.user_metadata?.full_name || currentUser.email}`}
            >
              <img
                src={currentUser.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Account"
                className="avatar-img"
              />
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.88rem", gap: "6px" }}
              onClick={() => setIsAuthModalOpen(true)}
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
