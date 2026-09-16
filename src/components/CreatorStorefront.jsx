import React, { useState, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { StoreProductCard } from "./StoreProductCard";
import { StoreProductModal } from "./StoreProductModal";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  ShoppingBag,
  ArrowLeft,
  Settings,
  Plus,
  Crown,
  Star,
  Package,
  Globe,
  Truck,
  RotateCcw,
  Lock,
  HeartHandshake,
  Search,
  ExternalLink,
  Share2
} from "lucide-react";

export const CreatorStorefront = ({ storeHandle, onBack }) => {
  const {
    allStores = [],
    userStore,
    marketplaceProducts = [],
    setIsEditStoreOpen,
    setIsAddProductOpen,
    upgradeStoreTier,
    showToast
  } = usePins();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find the target store
  const store = useMemo(() => {
    const handleClean = (storeHandle || "").trim().toLowerCase().replace(/^@/, "");
    // 1. Check userStore
    if (userStore && userStore.handle?.toLowerCase().replace(/^@/, "") === handleClean) {
      return userStore;
    }
    // 2. Check allStores
    const match = allStores.find(
      (s) => s.handle?.toLowerCase().replace(/^@/, "") === handleClean || s.id === storeHandle
    );
    return match || userStore || allStores[0];
  }, [allStores, userStore, storeHandle]);

  const isOwner = Boolean(
    userStore &&
    store &&
    (userStore.id === store.id ||
      userStore.handle?.toLowerCase() === store.handle?.toLowerCase())
  );

  // Get products strictly belonging to this store
  const storeProducts = useMemo(() => {
    if (!store) return [];
    const handleClean = store.handle?.toLowerCase().replace(/^@/, "");
    return marketplaceProducts.filter((p) => {
      const pAuthorHandle = p.author?.username?.toLowerCase().replace(/^@/, "");
      return (
        p.storeId === store.id ||
        (handleClean && pAuthorHandle === handleClean) ||
        (store.name && p.author?.name?.toLowerCase() === store.name.toLowerCase())
      );
    });
  }, [marketplaceProducts, store]);

  // Categories available in this creator's store
  const storeCategories = useMemo(() => {
    const cats = new Set(storeProducts.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [storeProducts]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let prods = storeProducts.filter((p) => {
      const matchCat =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
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
  }, [storeProducts, selectedCategory, searchQuery, sortBy]);

  const handleShare = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      showToast(`🔗 Storefront link copied: ${store?.handle || "store"}`, "success");
    } catch {}
  };

  if (!store) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <h3>Store not found</h3>
        <button type="button" onClick={onBack} className="btn-primary" style={{ marginTop: "16px" }}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  const {
    name = "Creator Store",
    handle = "@creator",
    tagline,
    bio,
    announcement = "⚡ Worldwide Tracked Shipping • 100% Guaranteed Authenticity",
    category = "Streetwear Apparel",
    tier = "free",
    bannerUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=85",
    logoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    rating = 5.0,
    ordersCount = 0,
    isVerified = true,
    socialLinks = {}
  } = store;

  return (
    <div style={{ background: "#ffffff", color: "#0f172a", minHeight: "100vh" }}>
      {/* 1. Storefront Announcement Bar */}
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "8px 16px",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          textAlign: "center"
        }}
      >
        <span>{announcement}</span>
      </div>

      {/* 2. Top Navigation Bar (Back to Marketplace + Merchant Tools if Owner) */}
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          padding: "12px 24px"
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "#0f172a",
              fontSize: "0.88rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              padding: "6px 0"
            }}
          >
            <ArrowLeft size={16} />
            <span>All Stores & Drops</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleShare}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#334155",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer"
              }}
            >
              <Share2 size={13} />
              <span>Share Store</span>
            </button>

            {/* Merchant Management Buttons (Owner Only) */}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditStoreOpen(true)}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                >
                  <Settings size={14} />
                  <span>Customize Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    padding: "7px 16px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer"
                  }}
                >
                  <Plus size={14} />
                  <span>+ Add Product</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 24px 80px" }}>
        {/* 3. Shopify Storefront Header (Cover Banner + Profile Logo + Story) */}
        <div style={{ margin: "24px 0 36px 0" }}>
          {/* Cover Banner */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "260px",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0f172a"
            }}
          >
            <img
              src={bannerUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)"
              }}
            />
          </div>

          {/* Profile Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "20px",
              padding: "0 16px",
              marginTop: "-50px",
              position: "relative",
              zIndex: 3
            }}
          >
            {/* Left: Avatar & Info */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "18px" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "4px solid #ffffff",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  background: "#ffffff",
                  flexShrink: 0
                }}
              >
                <img
                  src={logoUrl}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ paddingBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                    {name}
                  </h1>
                  {isVerified && <VerifiedBadge size={18} style={{ display: "inline-block" }} />}
                  {tier === "pro" ? (
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", fontWeight: 800, padding: "2px 8px", borderRadius: "4px" }}>
                      👑 PRO STORE
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.68rem", background: "#f1f5f9", color: "#475569", fontWeight: 800, padding: "2px 8px", borderRadius: "4px" }}>
                      VERIFIED MERCHANT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px", fontWeight: 600 }}>
                  {handle} • {category}
                </div>
              </div>
            </div>

            {/* Right: Store Metrics */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "10px 18px"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a" }}>
                  {storeProducts.length}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>DROPS</div>
              </div>
              <div style={{ width: "1px", background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", display: "flex", alignItems: "center", gap: "2px" }}>
                  <Star size={14} fill="#0f172a" />
                  <span>{rating}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>RATING</div>
              </div>
              <div style={{ width: "1px", background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a" }}>
                  {ordersCount > 0 ? `${ordersCount}+` : "New"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>ORDERS</div>
              </div>
            </div>
          </div>

          {/* Store Bio & Socials */}
          <div style={{ marginTop: "18px", padding: "0 16px", maxWidth: "800px" }}>
            {tagline && (
              <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                {tagline}
              </div>
            )}
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", lineHeight: 1.55 }}>
              {bio}
            </p>

            {/* Social Links */}
            {socialLinks && Object.values(socialLinks).some(Boolean) && (
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "#475569", textDecoration: "none", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}
                  >
                    Instagram ↗
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "#475569", textDecoration: "none", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}
                  >
                    X / Twitter ↗
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "#475569", textDecoration: "none", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}
                  >
                    YouTube ↗
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "#475569", textDecoration: "none", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}
                  >
                    Official Site ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. Creator Store Product Catalog Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            padding: "16px 0",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: "28px"
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
            {storeCategories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: isActive ? "#0f172a" : "#f8fafc",
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

          {/* Search & Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "6px 10px",
                minWidth: "180px"
              }}
            >
              <Search size={14} color="#94a3b8" style={{ marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.82rem",
                  width: "100%",
                  color: "#0f172a"
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#0f172a",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 5. Store Products Grid */}
        <div style={{ marginBottom: "60px" }}>
          {filteredProducts.length === 0 ? (
            <div
              style={{
                padding: "70px 24px",
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: "14px",
                border: "1px dashed #cbd5e1"
              }}
            >
              <Package size={32} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 6px 0", color: "#0f172a" }}>
                {storeProducts.length === 0 ? "No drops published yet" : "No matching drops found"}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                {isOwner
                  ? "You haven't added any products to your store yet. Click below to add your first product drop!"
                  : "Check back soon for new limited merchandise releases from this creator."}
              </p>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  + Add Your First Product
                </button>
              )}
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
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    setIsModalOpen(true);
                  }}
                  onInstantBuy={(p) => {
                    setSelectedProduct(p);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 6. Shopify Store Trust Strip */}
        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <Truck size={18} color="#0f172a" style={{ marginTop: "2px" }} />
            <div>
              <h5 style={{ margin: "0 0 2px 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                Tracked Express Shipping
              </h5>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                Dispatched directly with global courier tracking number.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <RotateCcw size={18} color="#0f172a" style={{ marginTop: "2px" }} />
            <div>
              <h5 style={{ margin: "0 0 2px 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                14-Day Replacement
              </h5>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                Hassle-free size exchange and defect coverage.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <Lock size={18} color="#0f172a" style={{ marginTop: "2px" }} />
            <div>
              <h5 style={{ margin: "0 0 2px 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                Encrypted Checkout
              </h5>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                256-bit SSL encrypted secure payment processing.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <HeartHandshake size={18} color="#0f172a" style={{ marginTop: "2px" }} />
            <div>
              <h5 style={{ margin: "0 0 2px 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                Direct Artist Support
              </h5>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                100% authentic drop officially created by {name}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Product Modal */}
      <StoreProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
