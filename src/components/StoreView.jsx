import React, { useState, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { StoreProductCard } from "./StoreProductCard";
import { StoreProductModal } from "./StoreProductModal";
import { CreatorStorefront } from "./CreatorStorefront";
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
  CheckCircle2,
  SlidersHorizontal,
  Truck,
  RotateCcw,
  Lock,
  HeartHandshake,
  Layers,
  Star,
  ChevronDown,
  Store,
  ExternalLink
} from "lucide-react";

export const StoreView = () => {
  const {
    marketplaceProducts = [],
    allStores = [],
    userStore,
    activeStorefront,
    setActiveStorefront,
    setIsCreateStoreOpen,
    setIsAddProductOpen,
    upgradeStoreTier,
    setActiveView
  } = usePins();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamically compute unique categories from live products
  const availableCategories = useMemo(() => {
    const raw = marketplaceProducts
      .map((p) => p.category?.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(raw));
    return ["All Products", ...unique];
  }, [marketplaceProducts]);

  // Auto-prompt onboarding modal on first visit if user has no store yet
  React.useEffect(() => {
    if (!userStore) {
      const hasSkipped = sessionStorage.getItem("gw_store_onboarding_skipped");
      if (!hasSkipped) {
        setIsCreateStoreOpen(true);
      }
    }
  }, [userStore, setIsCreateStoreOpen]);

  // If a dedicated creator storefront is active, render it!
  if (activeStorefront) {
    return (
      <CreatorStorefront
        storeHandle={activeStorefront}
        onBack={() => setActiveStorefront(null)}
      />
    );
  }

  // Filter & Sort Products (Shopify-style catalog engine)
  const filteredProducts = useMemo(() => {
    let prods = marketplaceProducts.filter((prod) => {
      const matchCat =
        selectedCategory === "All Products" ||
        prod.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchQuery =
        !searchQuery.trim() ||
        prod.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });

    if (sortBy === "price-low") {
      prods = [...prods].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      prods = [...prods].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "rating") {
      prods = [...prods].sort((a, b) => (Number(b.rating) || 5) - (Number(a.rating) || 5));
    } else if (sortBy === "best-selling") {
      prods = [...prods].sort((a, b) => (Number(b.salesCount) || 0) - (Number(a.salesCount) || 0));
    }

    return prods;
  }, [marketplaceProducts, searchQuery, selectedCategory, sortBy]);

  const myProdsCount = marketplaceProducts.filter(
    (p) => p.author?.username === userStore?.handle || p.storeId === userStore?.id
  ).length;

  const handleOpenProduct = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  return (
    <div style={{ background: "#ffffff", color: "#111827", minHeight: "100vh" }}>
      {/* 1. Shopify Top Announcement Bar */}
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "9px 16px",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          textAlign: "center"
        }}
      >
        <span>⚡ FREE WORLDWIDE TRACKED SHIPPING ON ORDERS OVER $50</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>100% DIRECT CREATOR SUPPORT</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>14-DAY HASSLE-FREE RETURNS</span>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 24px 80px" }}>
        {/* 2. Shopify Creator Store Admin Hub / Launch Banner */}
        {!userStore ? (
          <div
            style={{
              background: "linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>
                  Want to open your own creator storefront on GallaryWala?
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Launch your dedicated Shopify-style brand page with up to 5 free product drops.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateStoreOpen(true)}
              style={{
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <span>Launch Creator Store</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Active Creator Shopify-style Admin Bar */
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: userStore.tier === "pro" ? "#0f172a" : "#f1f5f9",
                  color: userStore.tier === "pro" ? "#facc15" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {userStore.tier === "pro" ? <Crown size={20} /> : <ShoppingBag size={20} />}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>
                    {userStore.name}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    ({userStore.handle})
                  </span>
                  {userStore.tier === "pro" ? (
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", fontWeight: 800, padding: "2px 8px", borderRadius: "4px" }}>
                      👑 PRO SEO STORE
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.68rem", background: "#f1f5f9", color: "#334155", fontWeight: 800, padding: "2px 8px", borderRadius: "4px" }}>
                      FREE PLAN ({myProdsCount}/5 PRODUCTS)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                  {userStore.tier === "free"
                    ? `${Math.max(0, 5 - myProdsCount)} free slot(s) remaining. Upgrade to Pro for unlimited drops.`
                    : "Active Storefront • Priority Search Indexing & Google Rich Snippets"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setActiveStorefront(userStore.handle)}
                style={{
                  fontSize: "0.82rem",
                  padding: "8px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#0f172a",
                  background: "#f8fafc",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer"
                }}
              >
                <Store size={14} />
                <span>View My Storefront</span>
              </button>

              {userStore.tier === "free" && (
                <button
                  type="button"
                  onClick={() => upgradeStoreTier("pro")}
                  style={{
                    fontSize: "0.82rem",
                    padding: "8px 14px",
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
                  fontSize: "0.85rem",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Plus size={15} />
                <span>+ Add Product Drop</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Shopify Prestige-Style Hero Banner */}
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "36px",
            background: "#0f172a",
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}
        >
          {/* Background Lifestyle Photo with Gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&q=85')`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
              opacity: 0.4
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: "linear-gradient(90deg, #0f172a 0%, rgba(15,23,42,0.85) 55%, rgba(15,23,42,0.2) 100%)"
            }}
          />

          {/* Hero Content */}
          <div style={{ position: "relative", zIndex: 2, padding: "48px 44px", maxWidth: "680px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#38bdf8",
                marginBottom: "12px"
              }}
            >
              LIMITED EDITION SEASON DROPS
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.15,
                margin: "0 0 16px 0",
                letterSpacing: "-0.03em"
              }}
            >
              Creator Merchandise & Apparel Drops
            </h1>

            <p style={{ color: "#cbd5e1", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 28px 0" }}>
              Explore dedicated storefronts from independent artists. Heavyweight vintage apparel, archival canvas art, desk pads, and digital suites.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("shopify-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  border: "none",
                  padding: "13px 26px",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>Shop All Drops</span>
                <ArrowRight size={16} />
              </button>

              {!userStore && (
                <button
                  type="button"
                  onClick={() => setIsCreateStoreOpen(true)}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "13px 22px",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Open Your Store (Free)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. FEATURED CREATOR SHOPIFY STOREFRONTS CAROUSEL */}
        {allStores.length > 0 && (
          <div style={{ marginBottom: "42px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Verified Creator Shops
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0f172a", margin: "2px 0 0 0" }}>
                  Featured Creator Storefronts
                </h3>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                {allStores.length} Active Creator Brands
              </span>
            </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}
          >
            {allStores.map((st) => (
              <div
                key={st.id || st.handle}
                onClick={() => setActiveStorefront(st.handle)}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Store Banner */}
                <div style={{ position: "relative", height: "100px", width: "100%", background: "#0f172a" }}>
                  <img
                    src={st.bannerUrl}
                    alt={st.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                  />
                  {st.tier === "pro" && (
                    <span style={{ position: "absolute", top: "8px", right: "8px", background: "#fef3c7", color: "#92400e", fontSize: "0.65rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                      👑 PRO
                    </span>
                  )}
                </div>

                {/* Store Body */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "-30px", marginBottom: "8px" }}>
                      <img
                        src={st.logoUrl}
                        alt={st.name}
                        style={{ width: "44px", height: "44px", borderRadius: "10px", border: "3px solid #ffffff", objectFit: "cover", background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                      />
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>{st.name}</span>
                          {st.isVerified && <VerifiedBadge size={13} />}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{st.handle}</span>
                      </div>
                    </div>

                    <p style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: "#475569", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {st.tagline || st.bio}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669" }}>
                      {st.category}
                    </span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>Visit Shop</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Dynamic Category Selector */}
        {availableCategories.length > 1 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>
                Filter by Category
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "8px"
              }}
            >
              {availableCategories.map((catName) => {
                const isAll = catName === "All Products";
                const isActive = selectedCategory.toLowerCase() === catName.toLowerCase();
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setSelectedCategory(catName)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "100px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      background: isActive ? "#0f172a" : "#f8fafc",
                      color: isActive ? "#ffffff" : "#334155",
                      border: isActive ? "1px solid #0f172a" : "1px solid #e2e8f0",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "0 4px 12px rgba(15, 23, 42, 0.15)" : "none"
                    }}
                  >
                    <span>{isAll ? "✨ All Drops" : `📦 ${catName}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Shopify Filter & Sort Toolbar */}
        <div
          id="shopify-catalog"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            padding: "14px 0",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: "28px"
          }}
        >
          {/* Left: Product count & active category indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>
              {selectedCategory}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              ({filteredProducts.length} {filteredProducts.length === 1 ? "drop" : "drops"})
            </span>
          </div>

          {/* Right: Search & Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "7px 12px",
                minWidth: "220px"
              }}
            >
              <Search size={15} color="#94a3b8" style={{ marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search all drops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  width: "100%",
                  color: "#0f172a"
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7. Shopify Product Grid */}
        <div style={{ marginBottom: "60px" }}>
          {filteredProducts.length === 0 ? (
            <div
              style={{
                padding: "80px 24px",
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: "16px",
                border: "1px dashed #cbd5e1"
              }}
            >
              <Package size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 6px 0", color: "#0f172a" }}>
                No products match your criteria
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto 20px" }}>
                Try resetting your filters or search keywords to explore all available merchandise drops.
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
                  padding: "9px 20px",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "28px"
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

        {/* 8. Shopify Trust & Guarantee Strip */}
        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px"
          }}
        >
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0 }}>
              <Truck size={20} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                Tracked Global Delivery
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
                Insured courier shipping with real-time tracking number provided on every drop.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0 }}>
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                14-Day Free Exchange
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
                Hassle-free size replacement and returns if items are damaged or defective.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0 }}>
              <Lock size={20} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                Secure 256-bit Checkout
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
                Encrypted payment processing via Stripe, Apple Pay, Google Pay, and PayPal.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0 }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                Direct Creator Support
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
                Over 80% of net proceeds go directly into the pockets of independent creators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Product Details & Checkout Modal */}
      <StoreProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
