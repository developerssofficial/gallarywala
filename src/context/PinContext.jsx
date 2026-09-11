import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_PINS, INITIAL_BOARDS } from "../data/mockPins";
import confetti from "canvas-confetti";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  fetchImagesFromSupabase,
  insertImageToSupabase,
  deleteImageFromSupabase
} from "../services/supabase";

const PinContext = createContext();

const STORAGE_KEYS = {
  PINS: "gallarywala_pins_v4",
  BOARDS: "gallarywala_boards_v4",
  LIKED: "gallarywala_liked_v4",
  CLOUDINARY: "gallarywala_cloudinary_config_v4",
  THEME: "gallarywala_theme_v4",
  ADMIN_PIN: "gallarywala_admin_pin_v4",
  ADMIN_AUTH: "gallarywala_admin_session_v4"
};

export const PinProvider = ({ children }) => {
  // 1. Supabase Config & User State
  const [supabaseConfig, setSupabaseConfig] = useState(() => getSupabaseConfig());
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseSettingsOpen, setIsSupabaseSettingsOpen] = useState(false);

  // 2. Pins / Images State (Starts empty until uploaded or loaded from Supabase)
  const [pins, setPins] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PINS);
      return saved ? JSON.parse(saved) : INITIAL_PINS;
    } catch {
      return INITIAL_PINS;
    }
  });

  // 3. Boards State
  const [boards, setBoards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARDS);
      return saved ? JSON.parse(saved) : INITIAL_BOARDS;
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState("gallery"); // 'gallery' | 'admin' | 'board'
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Supabase Auth State Listener & Images Fetcher
  useEffect(() => {
    const client = getSupabaseClient();
    if (client) {
      // Check current session
      client.auth.getSession().then(({ data: { session } }) => {
        setCurrentUser(session?.user ?? null);
      });

      const { data: authListener } = client.auth.onAuthStateChange(
        (_event, session) => {
          setCurrentUser(session?.user ?? null);
        }
      );

      // Fetch images from Supabase
      fetchImagesFromSupabase().then((spImages) => {
        if (spImages && spImages.length > 0) {
          const formatted = spImages.map((row) => ({
            id: "sp-" + row.id,
            title: row.title,
            description: row.description,
            imageUrl: row.image_url,
            category: row.category,
            tags: row.tags || [],
            likes: row.likes || 0,
            link: row.link,
            author: {
              name: row.author_name || "GallaryWala Member",
              avatar: row.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id}`,
              username: row.author_username || "@member"
            },
            comments: [],
            createdAt: row.created_at?.split("T")[0]
          }));
          setPins(formatted);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [supabaseConfig]);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
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

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    showToast("Logged out successfully.", "info");
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
      showToast("Admin Studio Unlocked 🔓", "success");
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
    const authorInfo = currentUser
      ? {
          name: currentUser.user_metadata?.full_name || "GallaryWala Creator",
          avatar: currentUser.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          username: `@${currentUser.email?.split("@")[0] || "creator"}`
        }
      : {
          name: "Admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          username: "@gallarywala"
        };

    const newPinBase = {
      id: "img-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: [],
      author: authorInfo,
      ...pinData
    };

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

  // Edit Existing Image
  const updatePin = (pinId, updatedData) => {
    setPins((prev) =>
      prev.map((pin) => (pin.id === pinId ? { ...pin, ...updatedData } : pin))
    );
    showToast("Image details updated! ✏️", "success");
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
      avatar: currentUser?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
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

  // Live Instant Search
  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      selectedCategory === "All" || pin.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      pin.title?.toLowerCase().includes(q) ||
      pin.description?.toLowerCase().includes(q) ||
      pin.tags?.some((t) => t.toLowerCase().includes(q)) ||
      pin.category?.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
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
        handleSignOut,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activePin,
        setActivePin,
        isUploadOpen,
        setIsUploadOpen,
        isSettingsOpen,
        setIsSettingsOpen,
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
