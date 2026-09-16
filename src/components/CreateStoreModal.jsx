import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Store,
  Sparkles,
  Rocket,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Zap,
  Tag,
  ArrowRight
} from "lucide-react";

export const CreateStoreModal = () => {
  const {
    isCreateStoreOpen,
    setIsCreateStoreOpen,
    currentUser,
    createCreatorStore,
    upgradeStoreTier,
    setIsAddProductOpen,
    showToast
  } = usePins();

  const [storeName, setStoreName] = useState(
    currentUser?.user_metadata?.full_name ? `${currentUser.user_metadata.full_name}'s Store` : "My Creator Store"
  );
  const [storeHandle, setStoreHandle] = useState(
    currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "creator"
  );
  const [storeBio, setStoreBio] = useState("Official high-quality creator merchandise, apparel & digital creative assets.");
  const [storeCategory, setStoreCategory] = useState("Streetwear Apparel");
  const [selectedTier, setSelectedTier] = useState("free"); // 'free' | 'pro'

  if (!isCreateStoreOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim()) {
      showToast("Please enter a Store Name.", "warning");
      return;
    }

    const created = createCreatorStore({
      name: storeName.trim(),
      handle: storeHandle.trim(),
      bio: storeBio.trim(),
      category: storeCategory
    });

    if (selectedTier === "pro") {
      upgradeStoreTier("pro");
    }

    setIsCreateStoreOpen(false);
    // Optionally open Add Product modal immediately
    setIsAddProductOpen(true);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsCreateStoreOpen(false)}
      style={{ zIndex: 10010 }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "680px",
          width: "95%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          border: "1px solid var(--border-light)",
          padding: 0
        }}
      >
        {/* Header with Gradient Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0c0e14 0%, #1f1b2e 50%, #2e1a3b 100%)",
            padding: "28px 24px",
            color: "#ffffff",
            position: "relative",
            borderBottom: "1px solid var(--border-light)"
          }}
        >
          <button
            type="button"
            onClick={() => setIsCreateStoreOpen(false)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0, 223, 216, 0.15)",
              color: "#00dfd8",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.72rem",
              fontWeight: 800,
              marginBottom: "12px"
            }}
          >
            <Rocket size={13} />
            <span>INSTANT CREATOR ONBOARDING</span>
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, margin: "0 0 6px 0", color: "#ffffff" }}>
            Get Your First Free Store 🛍️
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
            Start selling physical apparel, framed prints, desk mats, and digital packs in 30 seconds.
          </p>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {/* Plan Selector (Free vs Pro) */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
              Choose Your Store Plan:
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
              {/* Free Plan Card */}
              <div
                onClick={() => setSelectedTier("free")}
                style={{
                  border: selectedTier === "free" ? "2px solid #10b981" : "1px solid var(--border-light)",
                  background: selectedTier === "free" ? "rgba(16, 185, 129, 0.05)" : "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Store size={16} />
                    <span>Free Store Plan</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#10b981" }}>$0 / Free</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  • <strong>Max 5 Product Listings</strong> included<br />
                  • Standard Marketplace visibility<br />
                  • 80% Creator Revenue Split
                </div>
              </div>

              {/* Pro Plan Card */}
              <div
                onClick={() => setSelectedTier("pro")}
                style={{
                  border: selectedTier === "pro" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                  background: selectedTier === "pro" ? "rgba(121, 40, 202, 0.08)" : "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Crown size={16} color="#eab308" />
                    <span>Pro SEO-Boosted</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(234, 179, 8, 0.15)", color: "#eab308", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                    POPULAR
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  • <strong>Unlimited Products</strong><br />
                  • <strong>🚀 SEO Priority Push & Google Rich Snippets</strong><br />
                  • Homepage Banner Spotlight
                </div>
              </div>
            </div>
          </div>

          {/* Store Details Input Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: "0.8rem" }}>Store Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Neo-Tokyo Studio, Minimal Art Merch"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Store Handle *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="yourhandle"
                    value={storeHandle.replace(/^@/, "")}
                    onChange={(e) => setStoreHandle(e.target.value)}
                    style={{ fontSize: "0.85rem", paddingLeft: "26px", fontFamily: "monospace" }}
                  />
                  <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 700 }}>
                    @
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Primary Category</label>
                <select
                  className="form-select"
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  style={{ fontSize: "0.85rem" }}
                >
                  <option value="Streetwear Apparel">Streetwear Apparel</option>
                  <option value="Posters & Canvas Art">Posters & Canvas Art</option>
                  <option value="Gaming & Desk Accessories">Gaming & Desk Accessories</option>
                  <option value="Digital Tools & Presets">Digital Tools & Presets</option>
                  <option value="Collectibles & Figures">Collectibles & Figures</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: "0.8rem" }}>Store Bio & Tagline</label>
              <input
                type="text"
                className="form-input"
                placeholder="Briefly describe what you are selling..."
                value={storeBio}
                onChange={(e) => setStoreBio(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="nav-tab"
              onClick={() => setIsCreateStoreOpen(false)}
              style={{ padding: "10px 18px", border: "1px solid var(--border-light)" }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Rocket size={16} />
              <span>{selectedTier === "free" ? "Launch Free Store (5 Slots)" : "Launch Pro SEO Store"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
