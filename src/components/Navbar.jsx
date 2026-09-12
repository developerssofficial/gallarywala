import React, { useRef, useEffect, useState } from "react";
import { usePins } from "../context/PinContext";
import { VerifiedBadge } from "./VerifiedBadge";
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
  LogIn,
  LogOut,
  ChevronDown,
  Settings,
  Heart
} from "lucide-react";

export const Navbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    setIsProfileOpen,
    setIsUploadOpen,
    activeView,
    setActiveView,
    boards,
    setSelectedCategory,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
    currentUser,
    isSettingsOpen,
    setIsSettingsOpen,
    setSettingsTab,
    handleSignOut,
    isUserVerified
  } = usePins();

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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

  const userDisplayName = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Creator";
  const userHandle = currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "creator";
  const userAvatar = currentUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser?.email || "user")}`;

  return (
    <header className="navbar-sticky">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={handleLogoClick}
          title="GallaryWala (Home)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            lineHeight: 1
          }}
        >
          <img
            src="/logo.png"
            alt="GallaryWala"
            style={{
              height: "36px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 2px 10px rgba(255, 0, 128, 0.45))",
              transition: "transform var(--transition-spring)"
            }}
          />
          <span className="brand-text-gradient" style={{ lineHeight: 1 }}>GallaryWala</span>
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
          {/* Create Button (Desktop) */}
          <button
            className="btn-primary desktop-create-btn hide-on-mobile"
            onClick={() => setIsUploadOpen(true)}
            style={{ padding: "8px 18px", fontSize: "0.88rem" }}
          >
            <Plus size={16} />
            <span>Create</span>
          </button>

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

          {/* User Saved Collections (Desktop) */}
          <button
            className="icon-btn hide-on-mobile"
            onClick={() => setIsProfileOpen(true)}
            title="View Collections & Liked"
          >
            <Bookmark size={20} />
            {totalSavedPins > 0 && (
              <span className="badge-counter">{totalSavedPins}</span>
            )}
          </button>

          {/* Website Settings Button (Desktop) */}
          <button
            className="icon-btn hide-on-mobile"
            onClick={() => {
              setSettingsTab("general");
              setIsSettingsOpen(true);
            }}
            title="Settings & Preferences"
          >
            <Settings size={20} />
          </button>

          {/* Supabase User Login / Profile Dropdown */}
          {currentUser ? (
            <div style={{ position: "relative" }} ref={userMenuRef}>
              <button
                className="avatar-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title={`Logged in as ${userDisplayName}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px 3px 3px",
                  borderRadius: "var(--radius-full)",
                  background: isUserMenuOpen ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="avatar-img"
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
                <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "260px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-xl)",
                    padding: "12px",
                    zIndex: 1000,
                    animation: "scaleIn 0.15s ease-out"
                  }}
                >
                  {/* User Profile Header */}
                  <div
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid var(--border-light)",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <img
                      src={userAvatar}
                      alt={userDisplayName}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: "2px solid var(--color-primary)"
                      }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <span>{userDisplayName}</span>
                        {isUserVerified(userDisplayName) && (
                          <VerifiedBadge size={14} title={`Verified Creator: ${userDisplayName}`} />
                        )}
                      </div>
                      <div
                        style={{
                          color: "var(--color-primary)",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                      >
                        @{userHandle}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    className="dropdown-item"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                  >
                    <Bookmark size={16} style={{ color: "var(--color-primary)" }} />
                    <span>My Boards & Saved</span>
                  </button>

                  <button
                    className="dropdown-item"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setSettingsTab("general");
                      setIsSettingsOpen(true);
                    }}
                  >
                    <Settings size={16} style={{ color: "var(--text-muted)" }} />
                    <span>Settings & Profile</span>
                  </button>

                  <div style={{ height: "1px", background: "var(--border-light)", margin: "6px 0" }} />

                  {/* Direct Log Out Button */}
                  <button
                    className="dropdown-item"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await handleSignOut();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.88rem", gap: "6px" }}
              onClick={() => {
                setSettingsTab("account");
                setIsSettingsOpen(true);
              }}
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

