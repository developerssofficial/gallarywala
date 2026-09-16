import React from "react";
import { VerifiedBadge } from "./VerifiedBadge";
import { Star, ShoppingBag, Eye, Package, Tag, ArrowUpRight } from "lucide-react";

export const StoreProductCard = ({ product, onSelect, onInstantBuy }) => {
  if (!product) return null;

  const {
    title,
    price,
    originalPrice,
    badge,
    category,
    productType,
    itemCount,
    rating = 5.0,
    reviewsCount = 0,
    salesCount = 0,
    coverImage,
    coverUrl,
    stock,
    deliveryTime,
    isProBoosted,
    sizes = [],
    author
  } = product;

  const displayImage = coverUrl || coverImage || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85";
  const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
  const numOrigPrice = originalPrice ? (typeof originalPrice === "number" ? originalPrice : parseFloat(originalPrice)) : null;

  return (
    <div
      className="store-card"
      onClick={() => onSelect && onSelect(product)}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Cover Image Container */}
      <div style={{ position: "relative", width: "100%", paddingTop: "76%", overflow: "hidden", background: "#0f172a" }}>
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease"
          }}
          className="store-card-img"
        />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px", flexWrap: "wrap", zIndex: 2 }}>
          {isProBoosted && (
            <div
              style={{
                background: "#0f172a",
                color: "#facc15",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.5px"
              }}
            >
              PRO DROP
            </div>
          )}
          {badge && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(6px)",
                color: "#0f172a",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.68rem",
                fontWeight: 800
              }}
            >
              {badge}
            </div>
          )}
          {stock && (
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(6px)",
                color: "#ffffff",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.68rem",
                fontWeight: 700
              }}
            >
              {stock} in stock
            </div>
          )}
        </div>

        {/* Delivery Speed Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(6px)",
            color: "#0f172a",
            padding: "3px 8px",
            borderRadius: "5px",
            fontSize: "0.7rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 2
          }}
        >
          <span>{deliveryTime || itemCount || "Fast Dispatch"}</span>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Category & Creator Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {category}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={author?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                alt={author?.name}
                style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#334155", fontWeight: 600 }}>
                {author?.name}
              </span>
              {author?.isVerified && <VerifiedBadge size={13} style={{ display: "inline-block" }} />}
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 800,
              lineHeight: "1.35",
              margin: "0 0 8px 0",
              color: "#0f172a",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {title}
          </h3>

          {/* Sizes / Options Preview */}
          {sizes.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
              {sizes.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: 700
                  }}
                >
                  {s}
                </span>
              ))}
              {sizes.length > 4 && (
                <span style={{ fontSize: "0.68rem", color: "#94a3b8", alignSelf: "center" }}>
                  +{sizes.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Rating & Sales */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#64748b", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#0f172a", fontWeight: 700 }}>
              <Star size={12} fill="#0f172a" color="#0f172a" />
              <span>{rating}</span>
            </div>
            <span>•</span>
            <span>{salesCount > 0 ? `${salesCount} orders` : `${reviewsCount} reviews`}</span>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid #f1f5f9"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>
              ${numPrice.toFixed(2)}
            </span>
            {numOrigPrice && (
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", textDecoration: "line-through" }}>
                ${numOrigPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect ? onSelect(product) : onInstantBuy(product);
            }}
            style={{
              fontSize: "0.8rem",
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "8px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s ease"
            }}
          >
            <span>View</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
