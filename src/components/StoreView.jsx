import React, { useState, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { StoreProductCard } from "./StoreProductCard";
import { StoreProductModal } from "./StoreProductModal";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  ShoppingBag,
  Sparkles,
  Search,
  Package,
  Plus,
  Rocket,
  Crown,
  TrendingUp,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
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

  // Auto-prompt onboarding modal on first visit if user has no store yet
  React.useEffect(() => {
    if (!userStore) {
      const hasSkipped = sessionStorage.getItem("gw_store_onboarding_skipped");
      if (!hasSkipped) {
        setIsCreateStoreOpen(true);
      }
    }
  }, [userStore, setIsCreateStoreOpen]);

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
    <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "20px 24px 80px" }}>
      {/* 1. Top Creator Utility Bar */}
      {!userStore ? (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "12px 20px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.72rem", background: "#0f172a", color: "#ffffff", padding: "3px 8px", borderRadius: "5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Creators
            </span>
            <span style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600 }}>
              Launch your official merchandise storefront with up to 5 free product listings.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateStoreOpen(true)}
            style={{
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "0.84rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "background 0.15s ease"
            }}
          >
            <span>Open Free Store</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* Creator Active Merchant Dashboard */
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "14px 22px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: userStore.tier === "pro" ? "#0f172a" : "#f1f5f9",
                color: userStore.tier === "pro" ? "#eab308" : "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900
              }}
            >
              {userStore.tier === "pro" ? <Crown size={18} /> : <ShoppingBag size={18} />}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>{userStore.name}</span>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>({userStore.handle})</span>
                {userStore.tier === "pro" ? (
                  <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", fontWeight: 800, padding: "2px 7px", borderRadius: "4px" }}>
                    PRO SEO STORE
                  </span>
                ) : (
                  <span style={{ fontSize: "0.68rem", background: "#f1f5f9", color: "#334155", fontWeight: 800, padding: "2px 7px", borderRadius: "4px" }}>
                    FREE PLAN ({myProdsCount}/5 PRODUCTS)
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                {userStore.tier === "free"
                  ? `${Math.max(0, 5 - myProdsCount)} free slot(s) remaining. Upgrade to Pro for unlimited drops & SEO indexing.`
                  : "All drops are active with priority search ranking and Google schema."}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {userStore.tier === "free" && (
              <button
                type="button"
                onClick={() => upgradeStoreTier("pro")}
                style={{
                  fontSize: "0.82rem",
                  padding: "7px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#7928ca",
                  background: "#ffffff",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer"
                }}
              >
                <Crown size={14} color="#eab308" />
                <span>Upgrade to Pro</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              style={{
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                fontSize: "0.84rem",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Plus size={15} />
              <span>Add Product Drop</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Editorial Marketplace Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
              GallaryWala Drops & Merch
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.03em" }}>
              Creator Merchandise & Apparel Drops
            </h1>
            <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>
              Physical streetwear drops, archival canvas prints, desk pads, and creator toolkits.
            </p>
          </div>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              padding: "8px 14px",
              width: "100%",
              maxWidth: "360px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            <Search size={16} color="#94a3b8" style={{ flexShrink: 0, marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Search products, apparel, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.88rem",
                color: "#0f172a",
                background: "transparent"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px 4px", fontSize: "0.8rem" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Category Filter Strip */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "28px" }}>
        {STORE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                borderRadius: "8px",
                fontSize: "0.84rem",
                fontWeight: 700,
                padding: "8px 16px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                background: isActive ? "#0f172a" : "#ffffff",
                color: isActive ? "#ffffff" : "#475569",
                border: isActive ? "1px solid #0f172a" : "1px solid #e2e8f0",
                transition: "all 0.15s ease"
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. Products Grid */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Available
          </span>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
            Verified independent creator drops
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              background: "#f8fafc",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
              margin: "20px 0"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#e2e8f0",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px auto"
              }}
            >
              <Package size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 6px 0", color: "#0f172a" }}>
              No products found in this collection
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 20px auto", lineHeight: 1.5 }}>
              Try searching with another keyword or explore other creator categories.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All Products");
                setSearchQuery("");
              }}
              style={{
                background: "#0f172a",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              View All Products
            </button>
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

      {/* 5. Product Details & Checkout Modal */}
      <StoreProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
