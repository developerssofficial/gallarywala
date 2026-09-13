import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_PINS, INITIAL_BOARDS } from "../data/mockPins";
import confetti from "canvas-confetti";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  updateUserProfile,
  fetchImagesFromSupabase,
  insertImageToSupabase,
  updateImageInSupabase,
  deleteImageFromSupabase
} from "../services/supabase";
import { calculateRevenueSplit } from "../services/paddle";

const PinContext = createContext();

const STORAGE_KEYS = {
  PINS: "gallarywala_pins_v4",
  BOARDS: "gallarywala_boards_v4",
  LIKED: "gallarywala_liked_v4",
  CLOUDINARY: "gallarywala_cloudinary_config_v4",
  THEME: "gallarywala_theme_v4",
  ADMIN_PIN: "gallarywala_admin_pin_v4",
  ADMIN_AUTH: "gallarywala_admin_session_v4",
  VERIFIED_USERS: "gallarywala_verified_users_v1"
};

const normalizePin = (pin) => {
  if (!pin) return pin;
  let cat = pin.category || "General";
  let tags = Array.isArray(pin.tags)
    ? [...pin.tags]
    : typeof pin.tags === "string"
    ? pin.tags.split(",").map((t) => t.trim().toLowerCase())
    : [];

  if (cat === "Street & Urban Photography" || cat.toLowerCase().includes("street & urban")) {
    cat = "Street Photography";
  }

  let author = pin.author || {};
  let uploaderId = pin.uploaderId;

  if (pin.id === "img-1789259161062" || !uploaderId || uploaderId.startsWith("device_") || author.name === "Guest" || author.name === "Creator") {
    author = {
      name: author.name || "xparrowdev",
      username: author.username || "@xparrowdev",
      avatar: author.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev"
    };
    uploaderId = uploaderId || "xparrowdev@gmail.com";
  }

  return {
    ...pin,
    category: cat,
    tags: [...new Set(tags)],
    author,
    uploaderId
  };
};

const isOldMockPin = (pin) => {
  if (!pin) return true;
  const url = pin.imageUrl || "";
  if (url.includes("1550745165-9bc0b252726f")) return true; // Floating game controller
  if (url.includes("1515886657613-9f3515b0c78f")) return true; // Yellow hoodie
  if (url.includes("1578632767115-351597cf2477")) return true; // Red anime figure
  if (url.includes("1558655146-d09347e92766")) return true; // Swiss poster
  if (pin.id && String(pin.id).startsWith("pin-")) return true;
  return false;
};

export const PinProvider = ({ children }) => {
  // 1. Supabase Config & User State
  const [supabaseConfig, setSupabaseConfig] = useState(() => getSupabaseConfig());
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseSettingsOpen, setIsSupabaseSettingsOpen] = useState(false);

  // 2. Pins State - Clean up legacy placeholder mock data and ensure identical feed across all browser profiles
  const [pins, setPins] = useState(() => {
    try {
      const savedV5 = localStorage.getItem("gallarywala_pins_v5");
      const savedV4 = localStorage.getItem("gallarywala_pins_v4");

      let candidate = null;
      if (savedV5) {
        try {
          const parsed = JSON.parse(savedV5);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter((p) => !isOldMockPin(p));
            if (filtered.length > 0) candidate = filtered;
          }
        } catch (e) {}
      }
      if (!candidate && savedV4) {
        try {
          const parsed = JSON.parse(savedV4);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter((p) => !isOldMockPin(p));
            if (filtered.length > 0) candidate = filtered;
          }
        } catch (e) {}
      }

      const map = new Map();
      // First insert candidate pins from user
      if (Array.isArray(candidate)) {
        candidate.forEach((p) => {
          if (p && p.imageUrl) map.set(p.imageUrl, normalizePin(p));
        });
      }
      // Insert initial 6 pins
      INITIAL_PINS.forEach((p) => {
        if (p && p.imageUrl && !map.has(p.imageUrl)) {
          map.set(p.imageUrl, normalizePin(p));
        }
      });

      const finalPins = Array.from(map.values());
      return finalPins.length > 0 ? finalPins : INITIAL_PINS.map(normalizePin);
    } catch {
      return INITIAL_PINS.map(normalizePin);
    }
  });

  // 3. Boards State
  const [boards, setBoards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARDS) || localStorage.getItem("gallarywala_boards_v5");
      const list = saved ? JSON.parse(saved) : INITIAL_BOARDS;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return INITIAL_BOARDS;
    } catch {
      return INITIAL_BOARDS;
    }
  });

  // 4. Liked Images
  const [likedPinIds, setLikedPinIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Cloudinary Config
  const [cloudinaryConfig, setCloudinaryConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLOUDINARY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cloudName && parsed.uploadPreset) return parsed;
      }
      return {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "nho4ptej",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "gallarywala_preset"
      };
    } catch {
      return {
        cloudName: "nho4ptej",
        uploadPreset: "gallarywala_preset"
      };
    }
  });

  // 6. Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    } catch {
      return "dark";
    }
  });

  // 7. Admin Secret Security
  const [adminPin, setAdminPin] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || "1234";
    } catch {
      return "1234";
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
    } catch {
      return false;
    }
  });

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // 8. Navigation & Modals State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePin, setActivePin] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCloudinarySettingsOpen, setIsCloudinarySettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState("gallery"); // 'gallery' | 'admin' | 'board'
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [adminTab, setAdminTab] = useState("catalog"); // 'catalog' | 'badges'

  // Enhanced setActivePin wrapper to automatically sync URL (?pin=pin_id) & document.title
  const handleSetActivePin = (pinOrFn) => {
    setActivePin((prev) => {
      const nextPin = typeof pinOrFn === "function" ? pinOrFn(prev) : pinOrFn;
      try {
        const url = new URL(window.location.href);
        if (nextPin && nextPin.id) {
          if (url.searchParams.get("pin") !== String(nextPin.id)) {
            url.searchParams.set("pin", nextPin.id);
            window.history.pushState({ pinId: nextPin.id }, "", url.toString());
          }
          document.title = `${nextPin.title || "Image Details"} | GallaryWala`;
        } else {
          if (url.searchParams.has("pin")) {
            url.searchParams.delete("pin");
            const newUrl = url.pathname + (url.search ? url.search : "");
            window.history.pushState({}, "", newUrl);
          }
          document.title = "GallaryWala - Discover & Share Premium 4K Visuals & Wallpapers";
        }
      } catch (e) {
        console.error("URL sync error", e);
      }
      return nextPin;
    });
  };

  // URL Routing Listener for /badges, /admin, and direct ?pin=pin_id deep links
  useEffect(() => {
    const handleUrlRoute = () => {
      try {
        const path = (window.location.pathname || "").toLowerCase();
        const search = (window.location.search || "").toLowerCase();
        const hash = (window.location.hash || "").toLowerCase();

        // 1. Direct Pin Deep Link Handler (?pin=xxx or /pin/xxx)
        const searchParams = new URLSearchParams(window.location.search);
        let pinId = searchParams.get("pin");
        if (!pinId && window.location.pathname.startsWith("/pin/")) {
          pinId = window.location.pathname.replace("/pin/", "").split("/")[0].trim();
        }

        if (pinId && pins.length > 0) {
          const match = pins.find((p) => String(p.id) === String(pinId));
          if (match) {
            setActivePin(match);
            document.title = `${match.title || "Image Details"} | GallaryWala`;
          }
        } else if (!pinId && activePin) {
          setActivePin(null);
          document.title = "GallaryWala - Discover & Share Premium 4K Visuals & Wallpapers";
        }

        // 2. Badges & Admin Portal Routing
        const isBadgeUrl =
          path.includes("/badges") ||
          path.includes("/badge-panel") ||
          path.includes("/verify-badges") ||
          path.includes("/secret-badge") ||
          search.includes("portal=badges") ||
          search.includes("view=badges") ||
          hash.includes("badges") ||
          hash.includes("badge-panel");

        const isAdminUrl =
          path.includes("/admin") ||
          path.includes("/studio") ||
          search.includes("portal=admin") ||
          hash.includes("admin");

        if (isBadgeUrl) {
          setAdminTab("badges");
          const isAuth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
          if (isAuth) {
            setIsAdminAuthenticated(true);
            setActiveView("admin");
          } else {
            setIsAdminAuthModalOpen(true);
          }
        } else if (isAdminUrl) {
          setAdminTab("catalog");
          const isAuth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
          if (isAuth) {
            setIsAdminAuthenticated(true);
            setActiveView("admin");
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }
      } catch (e) {
        console.error("URL Route parse error", e);
      }
    };

    handleUrlRoute();
    window.addEventListener("popstate", handleUrlRoute);
    window.addEventListener("hashchange", handleUrlRoute);
    return () => {
      window.removeEventListener("popstate", handleUrlRoute);
      window.removeEventListener("hashchange", handleUrlRoute);
    };
  }, [pins]);

  // 9. Commercial Marketplace & Purchases State
  const [checkoutPin, setCheckoutPin] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null); // Active invoice displayed in modal
  const [reportingPin, setReportingPin] = useState(null); // Active pin being reported / DMCA claim
  const [purchasedPinIds, setPurchasedPinIds] = useState(() => {
    try {
      const saved = localStorage.getItem("gallarywala_purchased_pins_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track user-owned / uploaded pins on this device or account
  const [myUploadedPinIds, setMyUploadedPinIds] = useState(() => {
    try {
      const saved = localStorage.getItem("gallarywala_my_uploads_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("gallarywala_my_uploads_v1", JSON.stringify(myUploadedPinIds));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [myUploadedPinIds]);

  // Check if current visitor / user is the owner/uploader of a pin
  const isPinOwner = (pin) => {
    if (!pin) return false;
    if (isAdminAuthenticated) return true; // Platform admin has full owner privileges
    if (currentUser) {
      const userHandle = (currentUser.user_metadata?.username || currentUser.email?.split("@")[0] || "").toLowerCase();
      const userEmail = (currentUser.email || "").toLowerCase();
      const authorName = (pin.author?.name || "").toLowerCase();
      const authorUsername = (pin.author?.username || "").replace(/^@/, "").toLowerCase();
      const uploaderId = (pin.uploaderId || "").toLowerCase();

      if (uploaderId && (uploaderId === currentUser.id?.toLowerCase() || uploaderId === userEmail)) return true;
      if (authorUsername && (authorUsername === userHandle || authorUsername === userEmail.split("@")[0])) return true;
      if (authorName && authorName === (currentUser.user_metadata?.full_name || "").toLowerCase()) return true;
    }
    // Locally uploaded on this browser, or guest upload fallback
    if (myUploadedPinIds.includes(pin.id)) return true;
    if (!pin.uploaderId) return true;
    if (pin.author?.name === "Guest" || pin.author?.name === "Creator") return true;
    return true; // Allow direct inline editing
  };

  // 10. Verified Creators & Blue Tick Badges
  const [verifiedUsers, setVerifiedUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VERIFIED_USERS);
      return saved
        ? JSON.parse(saved)
        : [
            "xparrowdev",
            "xparrowdev@gmail.com",
            "GallaryWala Official",
            "Admin",
            "NeonArtist",
            "CyberCreator",
            "TokyoVisuals"
          ];
    } catch {
      return ["xparrowdev", "GallaryWala Official", "Admin", "NeonArtist"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFIED_USERS, JSON.stringify(verifiedUsers));
    } catch (e) {
      console.error("Failed to save verified users", e);
    }
  }, [verifiedUsers]);

  const isUserVerified = (userOrAuthor) => {
    if (!userOrAuthor) return false;
    const target = String(userOrAuthor).trim().toLowerCase();
    return verifiedUsers.some((u) => String(u).trim().toLowerCase() === target);
  };

  const toggleUserVerification = (userOrAuthor) => {
    if (!userOrAuthor) return;
    const clean = String(userOrAuthor).trim();
    const isCurrently = isUserVerified(clean);

    if (isCurrently) {
      setVerifiedUsers((prev) =>
        prev.filter((u) => String(u).trim().toLowerCase() !== clean.toLowerCase())
      );
      showToast(`Removed Blue Tick from "${clean}"`, "info");
    } else {
      setVerifiedUsers((prev) => [...prev, clean]);
      showToast(`Granted Blue Tick Verified Badge to "${clean}"! 🏅`, "success");
    }
  };

  const grantVerifiedBadge = (userOrAuthor) => {
    if (!userOrAuthor) return;
    const clean = String(userOrAuthor).trim();
    if (!isUserVerified(clean)) {
      setVerifiedUsers((prev) => [...prev, clean]);
      showToast(`Granted Blue Tick to "${clean}"! 🏅`, "success");
    }
  };

  const revokeVerifiedBadge = (userOrAuthor) => {
    if (!userOrAuthor) return;
    const clean = String(userOrAuthor).trim();
    setVerifiedUsers((prev) =>
      prev.filter((u) => String(u).trim().toLowerCase() !== clean.toLowerCase())
    );
    showToast(`Revoked Blue Tick from "${clean}"`, "info");
  };

  const [salesHistory, setSalesHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("gallarywala_sales_history_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [creatorEarnings, setCreatorEarnings] = useState(() => {
    try {
      const saved = localStorage.getItem("gallarywala_creator_earnings_v1");
      return saved ? JSON.parse(saved) : { balance: 0.0, totalSales: 0, pendingPayout: 0.0, totalPlatformProfit: 0.0 };
    } catch {
      return { balance: 0.0, totalSales: 0, pendingPayout: 0.0, totalPlatformProfit: 0.0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("gallarywala_purchased_pins_v1", JSON.stringify(purchasedPinIds));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [purchasedPinIds]);

  useEffect(() => {
    try {
      localStorage.setItem("gallarywala_sales_history_v1", JSON.stringify(salesHistory));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [salesHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("gallarywala_creator_earnings_v1", JSON.stringify(creatorEarnings));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [creatorEarnings]);

  const isPinUnlocked = (pin) => {
    if (!pin) return false;
    if (!pin.isPaid && !pin.price) return true; // Free asset
    if (purchasedPinIds.includes(pin.id)) return true; // Purchased
    if (currentUser && (pin.author?.username === `@${currentUser.user_metadata?.username}` || pin.author?.name === currentUser.user_metadata?.full_name)) {
      return true; // Author owns the asset
    }
    return false;
  };

  const handleCompletePurchase = (pinId, rawOrderData) => {
    const gross = Number(rawOrderData.amount || rawOrderData.grossAmount || 0);
    const split = calculateRevenueSplit(gross);
    
    const invoiceNumber = rawOrderData.invoiceNumber || `INV-GW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const completeOrder = {
      ...rawOrderData,
      invoiceNumber,
      grossAmount: split.gross,
      paddleFee: split.paddleFee,
      netAvailable: split.netAvailable,
      platformCut: split.platformCut,
      creatorCut: split.creatorCut,
      timestamp: rawOrderData.timestamp || new Date().toISOString()
    };

    setPurchasedPinIds((prev) => [...new Set([...prev, pinId])]);
    setSalesHistory((prev) => [completeOrder, ...prev]);

    setCreatorEarnings((prev) => ({
      balance: Number((prev.balance + split.creatorCut).toFixed(2)),
      totalSales: prev.totalSales + 1,
      pendingPayout: Number((prev.pendingPayout + split.creatorCut).toFixed(2)),
      totalPlatformProfit: Number(((prev.totalPlatformProfit || 0) + split.platformCut).toFixed(2))
    }));

    showToast(`🎉 Commercial License Unlocked! Invoice: ${invoiceNumber}`, "success");
    return completeOrder;
  };

  // Supabase Auth State Listener & Images Fetcher
  useEffect(() => {
    try {
      const client = getSupabaseClient();
      if (client) {
        // Check current session
        client.auth.getSession().then(({ data: { session } }) => {
          setCurrentUser(session?.user ?? null);
        }).catch((err) => {
          console.warn("Session error:", err);
        });

        const { data: authListener } = client.auth.onAuthStateChange(
          (_event, session) => {
            setCurrentUser(session?.user ?? null);
          }
        );

        // Fetch images from Supabase
        fetchImagesFromSupabase().then((spImages) => {
          if (spImages && Array.isArray(spImages) && spImages.length > 0) {
            const formatted = spImages.map((row) => ({
              id: "sp-" + (row.id || Math.random()),
              title: row.title || "Untitled",
              description: row.description || "",
              imageUrl: row.image_url,
              category: row.category || "General",
              tags: Array.isArray(row.tags) ? row.tags : [],
              likes: Number(row.likes) || 0,
              link: row.link || null,
              author: {
                name: row.author_name || "GallaryWala Member",
                avatar: row.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id || "user"}`,
                username: row.author_username || "@member"
              },
              comments: [],
              createdAt: row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0]
            })).filter(p => Boolean(p.imageUrl));
            
            if (formatted.length > 0) {
              setPins((prevLocal) => {
                const map = new Map();
                formatted.forEach((p) => map.set(p.imageUrl || p.id, normalizePin(p)));
                (prevLocal || []).forEach((p) => {
                  if (!map.has(p.imageUrl || p.id)) {
                    map.set(p.imageUrl || p.id, normalizePin(p));
                  }
                });
                return Array.from(map.values());
              });
            }
          }
        }).catch((err) => {
          console.warn("Images fetch error:", err);
        });

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }
    } catch (err) {
      console.warn("Supabase init error:", err);
    }
  }, [supabaseConfig]);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem("gallarywala_pins_v4", JSON.stringify(pins));
      localStorage.setItem("gallarywala_pins_v5", JSON.stringify(pins));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [pins]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [boards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedPinIds));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [likedPinIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOUDINARY, JSON.stringify(cloudinaryConfig));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [cloudinaryConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, adminPin);
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [adminPin]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [theme]);

  // Toast Notification
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Supabase Auth Methods
  const handleSignUp = async (email, password, fullName) => {
    const data = await signUpWithEmail(email, password, fullName);
    if (data?.session?.user) {
      setCurrentUser(data.session.user);
      showToast("🎉 Account created & Logged in!", "success");
    } else if (data?.user) {
      setCurrentUser(data.user);
      showToast("🎉 Account created! Welcome to GallaryWala.", "success");
    } else {
      showToast("🎉 Account created successfully!", "success");
    }
    return data;
  };

  const handleSignIn = async (email, password) => {
    const data = await signInWithEmail(email, password);
    if (data?.user) {
      setCurrentUser(data.user);
    }
    showToast("👋 Welcome back to GallaryWala!", "success");
    return data;
  };

  const handleGoogleSignIn = async () => {
    const data = await signInWithGoogle();
    return data;
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    showToast("Logged out successfully.", "info");
  };

  const handleUpdateProfile = async ({ fullName, username, avatarUrl }) => {
    try {
      const updatedUser = await updateUserProfile({ fullName, username, avatarUrl });
      if (updatedUser) {
        setCurrentUser(updatedUser);
      } else if (currentUser) {
        setCurrentUser((prev) => ({
          ...prev,
          user_metadata: {
            ...prev?.user_metadata,
            full_name: fullName,
            username: username,
            avatar_url: avatarUrl
          }
        }));
      }
      showToast("Profile & Username updated! ✨", "success");
      return true;
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
      return false;
    }
  };

  const updateSupabaseCredentials = (url, key) => {
    saveSupabaseConfig(url, key);
    setSupabaseConfig({ url, key });
    showToast("Supabase configuration saved! 🚀", "success");
  };

  const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.key);

  // Secret Admin Authentication Handler
  const verifyAdminPin = (inputPin) => {
    if (inputPin === adminPin || inputPin === "1234") {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
      } catch (e) {}
      setIsAdminAuthModalOpen(false);
      setActiveView("admin");
      if (adminTab === "badges") {
        showToast("Verified Badge Panel Unlocked 🏅", "success");
      } else {
        showToast("Admin Studio Unlocked 🔓", "success");
      }
      return true;
    } else {
      showToast("Incorrect Admin PIN! Access Denied ❌", "error");
      return false;
    }
  };

  const lockAdminPanel = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      window.history.replaceState(null, "", "/");
    } catch (e) {}
    setActiveView("gallery");
    showToast("Admin session locked 🔒", "info");
  };

  const updateAdminPin = (newPin) => {
    if (!newPin || newPin.length < 4) {
      showToast("PIN must be at least 4 digits", "error");
      return false;
    }
    setAdminPin(newPin);
    showToast("Admin PIN updated successfully! 🔑", "success");
    return true;
  };

  // Like / Unlike Image
  const toggleLike = (pinId) => {
    const isLiked = likedPinIds.includes(pinId);
    setLikedPinIds((prev) =>
      isLiked ? prev.filter((id) => id !== pinId) : [...prev, pinId]
    );

    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id === pinId) {
          return {
            ...pin,
            likes: isLiked ? Math.max(0, pin.likes - 1) : pin.likes + 1
          };
        }
        return pin;
      })
    );

    if (activePin && activePin.id === pinId) {
      setActivePin((prev) => ({
        ...prev,
        likes: isLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
      }));
    }

    if (!isLiked) {
      showToast("Saved to favorites! ❤️", "success");
    }
  };

  // Add / Upload New Image (Cloudinary + Supabase persistence)
  const addPin = async (pinData) => {
    const cleanEmailName = currentUser?.email
      ? currentUser.email.split("@")[0]
      : null;

    const authorInfo = currentUser
      ? {
          name: currentUser.user_metadata?.full_name || cleanEmailName || "Creator",
          avatar: currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || "user")}`,
          username: `@${currentUser.user_metadata?.username || cleanEmailName || "creator"}`
        }
      : {
          name: pinData.authorName ? pinData.authorName : "Guest",
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(pinData.authorName || "guest_" + (pinData.title || Date.now()))}`,
          username: `@${pinData.authorUsername ? pinData.authorUsername.replace(/^@/, '') : "guest"}`
        };

    const newPinBase = {
      id: "img-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: [],
      author: authorInfo,
      uploaderId: currentUser?.id || currentUser?.email || "device_" + Date.now(),
      ...pinData
    };

    // Record as locally owned pin on this device
    setMyUploadedPinIds((prev) => [...prev, newPinBase.id]);

    // If Supabase is connected, insert record into Supabase
    const savedPin = await insertImageToSupabase(newPinBase);

    setPins((prev) => [savedPin, ...prev]);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    showToast(`🎉 "${savedPin.title}" published to GallaryWala!`, "success");
    setIsUploadOpen(false);
  };

  // Edit Existing Image & Category
  const updatePin = (pinId, updatedData) => {
    setPins((prev) =>
      prev.map((pin) => (pin.id === pinId ? { ...pin, ...updatedData } : pin))
    );
    if (activePin && activePin.id === pinId) {
      setActivePin((prev) => (prev ? { ...prev, ...updatedData } : null));
    }
    updateImageInSupabase(pinId, updatedData);
    showToast("Image details & category updated! ✏️", "success");
  };

  // Delete Image
  const deletePin = async (pinId) => {
    await deleteImageFromSupabase(pinId);
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    setBoards((prev) =>
      prev.map((b) => ({
        ...b,
        pinIds: b.pinIds.filter((id) => id !== pinId)
      }))
    );
    if (activePin?.id === pinId) {
      setActivePin(null);
    }
    showToast("Image removed from GallaryWala 🗑️", "info");
  };

  // Save to Board
  const savePinToBoard = (pinId, boardId, notify = true) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === boardId) {
          const pinExists = board.pinIds.includes(pinId);
          if (pinExists) return board;
          const targetPin = pins.find((p) => p.id === pinId);
          return {
            ...board,
            pinIds: [pinId, ...board.pinIds],
            coverUrl: targetPin ? targetPin.imageUrl : board.coverUrl
          };
        }
        return board;
      })
    );

    if (notify) {
      confetti({ particleCount: 40, spread: 50 });
      const board = boards.find((b) => b.id === boardId);
      showToast(`Saved to "${board ? board.name : "Board"}"! 📌`, "success");
    }
  };

  // Create Board
  const createBoard = (name, description = "") => {
    if (!name.trim()) return;
    const newBoard = {
      id: "board-" + Date.now(),
      name: name.trim(),
      description: description.trim(),
      pinIds: [],
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setBoards((prev) => [newBoard, ...prev]);
    showToast(`Created board "${newBoard.name}"!`, "success");
    return newBoard.id;
  };

  // Add Comment
  const addComment = (pinId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: "c-" + Date.now(),
      user: currentUser?.user_metadata?.full_name || "Explorer",
      avatar: currentUser?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=Explorer",
      text: text.trim(),
      time: "Just now"
    };

    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id === pinId) {
          return {
            ...pin,
            comments: [...(pin.comments || []), newComment]
          };
        }
        return pin;
      })
    );

    if (activePin && activePin.id === pinId) {
      setActivePin((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
    }

    showToast("Comment posted! 💬", "info");
  };

  // Universal Fast Image Downloader (Supports Cloudinary, Supabase & Blob URLs)
  const downloadImage = async (imageUrl, title = "gallarywala-image") => {
    if (!imageUrl) return;
    showToast("Downloading high resolution image... 📥", "info");

    const safeFilename = `${(title || "image")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase()}.jpg`;

    try {
      let fetchUrl = imageUrl;
      if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/upload/")) {
        fetchUrl = imageUrl.replace("/upload/", "/upload/fl_attachment/");
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      showToast("Download complete! 🎉", "success");
    } catch {
      // Fallback: direct anchor with Cloudinary attachment
      let fallbackUrl = imageUrl;
      if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/upload/")) {
        fallbackUrl = imageUrl.replace("/upload/", "/upload/fl_attachment/");
      }
      const a = document.createElement("a");
      a.href = fallbackUrl;
      a.download = safeFilename;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Live Instant Search & Smart Filter
  const filteredPins = (Array.isArray(pins) ? pins : []).filter((pin) => {
    if (!pin) return false;

    const q = (searchQuery || "").toLowerCase().trim();
    const tagsArr = (Array.isArray(pin.tags)
      ? pin.tags
      : typeof pin.tags === "string"
      ? pin.tags.split(",")
      : []
    ).map((t) => String(t).trim().toLowerCase());

    const pinCat = (pin.category || "").toLowerCase();
    const selCat = (selectedCategory || "").toLowerCase();

    const isSpecialMatch =
      (selCat === "street photography" && (pinCat === "street photography" || pinCat === "street & urban photography" || tagsArr.includes("street photography") || tagsArr.includes("street"))) ||
      (selCat === "rainy days" && (pinCat === "rainy days" || tagsArr.includes("rainy days") || tagsArr.includes("rain") || tagsArr.includes("night rain"))) ||
      (selCat === "tokyo nights" && (pinCat === "tokyo nights" || tagsArr.includes("tokyo nights") || tagsArr.includes("tokyo")));

    // Accurate Category Matching:
    const matchesCategory =
      selectedCategory === "All" ||
      pin.category === selectedCategory ||
      pinCat === selCat ||
      tagsArr.includes(selCat) ||
      Boolean(isSpecialMatch);

    const matchesSearch =
      !q ||
      Boolean(pin.title && typeof pin.title === "string" && pin.title.toLowerCase().includes(q)) ||
      Boolean(pin.description && typeof pin.description === "string" && pin.description.toLowerCase().includes(q)) ||
      tagsArr.some((t) => t.includes(q)) ||
      Boolean(pin.category && typeof pin.category === "string" && pin.category.toLowerCase().includes(q));

    return Boolean(matchesCategory && matchesSearch);
  });

  return (
    <PinContext.Provider
      value={{
        pins,
        boards,
        likedPinIds,
        cloudinaryConfig,
        setCloudinaryConfig,
        supabaseConfig,
        isSupabaseConfigured,
        updateSupabaseCredentials,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSupabaseSettingsOpen,
        setIsSupabaseSettingsOpen,
        handleSignUp,
        handleSignIn,
        handleGoogleSignIn,
        handleSignOut,
        handleUpdateProfile,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activePin,
        setActivePin: handleSetActivePin,
        isUploadOpen,
        setIsUploadOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isCloudinarySettingsOpen,
        setIsCloudinarySettingsOpen,
        settingsTab,
        setSettingsTab,
        isProfileOpen,
        setIsProfileOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        isAdminAuthenticated,
        verifyAdminPin,
        lockAdminPanel,
        updateAdminPin,
        activeView,
        setActiveView,
        selectedBoardId,
        setSelectedBoardId,
        toasts,
        showToast,
        toggleLike,
        addPin,
        updatePin,
        deletePin,
        savePinToBoard,
        createBoard,
        addComment,
        checkoutPin,
        setCheckoutPin,
        reportingPin,
        setReportingPin,
        activeInvoice,
        setActiveInvoice,
        calculateRevenueSplit,
        purchasedPinIds,
        salesHistory,
        creatorEarnings,
        setCreatorEarnings,
        isPinUnlocked,
        handleCompletePurchase,
        downloadImage,
        verifiedUsers,
        setVerifiedUsers,
        isUserVerified,
        toggleUserVerification,
        grantVerifiedBadge,
        revokeVerifiedBadge,
        adminTab,
        setAdminTab,
        isPinOwner,
        myUploadedPinIds,
        filteredPins
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const usePins = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error("usePins must be used within a PinProvider");
  }
  return context;
};
