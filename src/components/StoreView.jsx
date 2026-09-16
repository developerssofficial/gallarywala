import React, { useState, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { StoreProductCard } from "./StoreProductCard";
import { StoreProductModal } from "./StoreProductModal";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  ShoppingBag,
  Sparkles,
  Search,
  Flame,
  Award,
  Zap,
  ShieldCheck,
  Package,
  Plus,
  Rocket,
  Crown,
  TrendingUp,
  Globe,
  ArrowRight
} from "lucide-react";

const STORE_CATEGORIES = [
  "All Products",
  "Streetwear Apparel",
  "Posters & Canvas Art",
  "Gaming & Desk Accessories",
  "Digital Tools & Presets",
  "Collectibles & Figures"
];

export const StoreView = () => {
  const {
    marketplaceProducts = [],
    userStore,
    setIsCreateStoreOpen,
    setIsAddProductOpen,
    upgradeStoreTier,
    setActiveView
  } = usePins();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter((prod) => {
      const matchCat =
        selectedCategory === "All Products" || prod.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchQuery =
        !searchQuery.trim() ||
        prod.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [marketplaceProducts, searchQuery, selectedCategory]);

  const myProdsCount = marketplaceProducts.filter(
    (p) => p.author?.username === userStore?.handle || p.storeId === userStore?.id
  ).length;

  const handleOpenProduct = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 60px" }}>
      {/* Creator Store Action / Onboarding Bar */}
      {!userStore ? (
        /* No Store Yet: Get First Free Store Banner */
        <div
          style={{
            background: "linear-gradient(135deg, rgba(121, 40, 202, 0.12) 0%, rgba(255, 0, 128, 0.12) 100%)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-xl)",
            padding: "20px 28px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--brand-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 6px 16px rgba(255, 0, 128, 0.3)"
              }}
            >
              <Rocket size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 900, margin: 0 }}>
                  Get Your First Free Store Today! 🛍️
                </h3>
                <span style={{ fontSize: "0.72rem", background: "#10b981", color: "#fff", fontWeight: 800, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                  100% FREE
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.84rem", margin: "3px 0 0 0" }}>
                List up to <strong>5 products free</strong> with automatic organic push to all GallaryWala buyers.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateStoreOpen(true)}
            style={{ padding: "10px 22px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Sparkles size={16} />
            <span>Launch Free Store in 30s</span>
          </button>
        </div>
      ) : (
        /* Has Store: Creator Dashboard Bar */
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-xl)",
            padding: "16px 24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: userStore.tier === "pro" ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "var(--color-primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "1.1rem"
              }}
            >
              {userStore.tier === "pro" ? <Crown size={20} /> : <ShoppingBag size={20} />}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem" }}>{userStore.name}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>({userStore.handle})</span>
                {userStore.tier === "pro" ? (
                  <span style={{ fontSize: "0.7rem", background: "rgba(234, 179, 8, 0.15)", color: "#eab308", fontWeight: 800, padding: "2px 8px", borderRadius: "6px" }}>
                    👑 PRO SEO-BOOSTED
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontWeight: 800, padding: "2px 8px", borderRadius: "6px" }}>
                    FREE TIER ({myProdsCount}/5 PRODUCTS)
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {userStore.tier === "free"
                  ? `${Math.max(0, 5 - myProdsCount)} free product slot(s) remaining. Upgrade to Pro for unlimited listings & Google SEO push.`
                  : "Unlimited product listings & top priority Google SEO search indexing active."}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {userStore.tier === "free" && (
              <button
                type="button"
                className="nav-tab"
                onClick={() => upgradeStoreTier("pro")}
                style={{
                  fontSize: "0.8rem",
                  padding: "8px 14px",
                  border: "1px solid rgba(234, 179, 8, 0.4)",
                  color: "#d97706",
                  background: "rgba(234, 179, 8, 0.08)",
                  fontWeight: 700
                }}
              >
                <Crown size={14} style={{ display: "inline", marginRight: "4px" }} />
                Upgrade to Pro (SEO Boost)
              </button>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsAddProductOpen(true)}
              style={{ fontSize: "0.85rem", padding: "8px 18px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} />
              <span>+ List New Product</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Store Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0c0e14 0%, #1a1e2e 50%, #251e3e 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 32px",
          color: "#ffffff",
          marginBottom: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.5px",
              marginBottom: "14px",
              color: "#00dfd8"
            }}
          >
            <Sparkles size={14} />
            <span>GALLARYWALA PRODUCT MARKETPLACE</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: "10px",
              color: "#ffffff"
            }}
          >
            Creator Merchandise & Physical Apparel Drops
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "22px" }}>
            Explore verified creator merch, heavyweight vintage tees, framed canvas prints, desk pads, and digital preset kits.
          </p>

          {/* Search bar inside Hero */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "var(--radius-full)",
              padding: "6px 8px 6px 18px",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}
          >
            <Search size={18} color="#64748b" style={{ flexShrink: 0, marginRight: "10px" }} />
            <input
              type="text"
              placeholder="Search products by title, creator, apparel, canvas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                color: "#0c0e14",
                background: "transparent"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px 8px" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2-Tier Highlight Benefits */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
              <Package size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Free 5 Products Store</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Start selling with zero upfront fee</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(234, 179, 8, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#facc15" }}>
              <Globe size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Pro SEO Priority Push</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ranked on Google & featured banners</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0, 223, 216, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00dfd8" }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>80%+ Creator Payout</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Instant payouts via PayPal & Bank</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "24px" }}>
        {STORE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={isActive ? "btn-primary" : "nav-tab"}
              style={{
                borderRadius: "var(--radius-full)",
                fontSize: "0.82rem",
                fontWeight: 700,
                padding: "8px 16px",
                whiteSpace: "nowrap",
                border: isActive ? "none" : "1px solid var(--border-light)"
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Flame size={20} color="#ff416c" />
            <span>Active Store Products ({filteredProducts.length})</span>
          </h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Showing live creator listings
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "70px 24px",
              textAlign: "center",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px dashed var(--border-light)",
              margin: "20px 0"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(121, 40, 202, 0.1)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto"
              }}
            >
              <Package size={32} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 8px 0", color: "var(--text-main)" }}>
              No Products Listed in this Category Yet 🛍️
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 24px auto", lineHeight: 1.5 }}>
              Be the first creator to list physical apparel, canvas prints, or creator suites! Free stores can list up to 5 products.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (!userStore) {
                    setIsCreateStoreOpen(true);
                  } else {
                    setIsAddProductOpen(true);
                  }
                }}
                style={{ padding: "10px 24px", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} />
                <span>{userStore ? "+ List Your First Product" : "Launch Your Free Store Now"}</span>
              </button>

              <button
                type="button"
                className="nav-tab"
                onClick={() => setActiveView("gallery")}
                style={{ padding: "10px 20px", fontSize: "0.9rem", border: "1px solid var(--border-light)" }}
              >
                Browse 4K Gallery Wallpapers
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px"
            }}
          >
            {filteredProducts.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                onSelect={handleOpenProduct}
                onInstantBuy={handleOpenProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Checkout Modal */}
      <StoreProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
