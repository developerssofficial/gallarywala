import React, { useState, useMemo } from "react";
import { usePins } from "../context/PinContext";
import { INITIAL_STORE_PRODUCTS } from "../data/mockStoreProducts";
import { StoreProductCard } from "./StoreProductCard";
import { StoreProductModal } from "./StoreProductModal";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  ShoppingBag,
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers
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
  const { setActivePin, setIsProfileOpen, isUserVerified, setActiveView } = usePins();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return INITIAL_STORE_PRODUCTS.filter((prod) => {
      const matchCat =
        selectedCategory === "All Products" || prod.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchQuery =
        !searchQuery.trim() ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenProduct = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const topCreators = [
    {
      name: "GallaryWala Official",
      username: "@gallarywala",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gallarywala",
      tagline: "Exclusive 4K/8K Master Studio Drops",
      sales: "1.2k+ Sales",
      rating: "5.0 ★",
      isVerified: true
    },
    {
      name: "NeoArtist Studio",
      username: "@neoartist",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=neoartist",
      tagline: "Futuristic Cyberpunk & Sci-Fi 8K Worlds",
      sales: "640+ Sales",
      rating: "4.9 ★",
      isVerified: true
    },
    {
      name: "Veylorae Studio",
      username: "@veylorae",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=veylorae",
      tagline: "Moody Cinematic Lightroom Presets",
      sales: "480+ Sales",
      rating: "4.9 ★",
      isVerified: true
    }
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px 60px" }}>
      {/* Hero Store Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0c0e14 0%, #1a1e2e 50%, #251e3e 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "40px 32px",
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
              marginBottom: "16px",
              color: "#00dfd8"
            }}
          >
            <Sparkles size={14} />
            <span>GALLARYWALA CREATOR MARKETPLACE</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: "12px",
              color: "#ffffff"
            }}
          >
            Premium 4K Bundles & Creator Creative Assets
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: "1rem", lineHeight: 1.5, marginBottom: "24px" }}>
            Directly support digital artists and unlock full uncompressed 4K/8K wallpaper bundles, Lightroom presets, and commercial rights with instant download.
          </p>

          {/* Search bar inside Hero */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "var(--radius-full)",
              padding: "6px 8px 6px 18px",
              maxWidth: "520px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}
          >
            <Search size={18} color="#64748b" style={{ flexShrink: 0, marginRight: "10px" }} />
            <input
              type="text"
              placeholder="Search bundles by anime, creator, cyberpunk, presets..."
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

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0, 223, 216, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00dfd8" }}>
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Lossless 4K & 8K</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Zero compression master files</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Commercial Rights</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Official tax invoices included</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(250, 204, 21, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#facc15" }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Instant Download</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Direct high-speed ZIP delivery</div>
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
            <span>Featured Bundles & Digital Drops ({filteredProducts.length})</span>
          </h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Showing curated creator listings
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
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 8px 0", color: "var(--text-main)" }}>
              Store Drops & Creator Merch Coming Soon 🛍️
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 24px auto", lineHeight: 1.5 }}>
              Official merchandise drops, creator apparel, canvas art, and master suites will be listed here soon. Stay tuned!
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveView("gallery")}
              style={{ padding: "10px 22px", fontSize: "0.9rem" }}
            >
              Explore 4K Gallery Wallpapers
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

      {/* Top Creators & Storefront Spotlight */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-xl)",
          padding: "28px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={20} color="var(--color-primary)" />
              <span>Top Verified Creator Stores</span>
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
              Visit individual artist storefronts to explore their complete portfolio & custom wallpaper packs.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {topCreators.map((cr, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={cr.avatar}
                  alt={cr.name}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>{cr.name}</span>
                    <VerifiedBadge size={14} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{cr.username}</div>
                </div>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {cr.tagline}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-light)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)"
                }}
              >
                <span>{cr.sales} • {cr.rating}</span>
                <button
                  type="button"
                  className="nav-tab"
                  onClick={() => setIsProfileOpen(true)}
                  style={{ fontSize: "0.75rem", padding: "4px 10px", border: "1px solid var(--border-light)" }}
                >
                  Visit Store
                </button>
              </div>
            </div>
          ))}
        </div>
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
