import React from "react";
import { VerifiedBadge } from "./VerifiedBadge";
import { Star, ShoppingBag, Eye, Package, Tag, ArrowUpRight, Check } from "lucide-react";

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

  // Calculate discount percentage if originalPrice exists
  const discountPercent = numOrigPrice && numOrigPrice > numPrice
    ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
    : null;

  return (
    <div
      className="shopify-product-card"
      onClick={() => onSelect && onSelect(product)}
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
        border: "1px solid #e2e8f0"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* 1. Shopify Photography Container */}
      <div style={{ position: "relative", width: "100%", paddingTop: "85%", overflow: "hidden", background: "#f1f5f9" }}>
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

        {/* Shopify Badges (Top Left) */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "5px", zIndex: 2 }}>
          {discountPercent && (
            <span
              style={{
                background: "#dc2626",
                color: "#ffffff",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.5px"
              }}
            >
              SAVE {discountPercent}%
            </span>
          )}
          {badge && !discountPercent && (
            <span
              style={{
                background: "#0f172a",
                color: "#ffffff",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: 800
              }}
            >
              {badge.toUpperCase()}
            </span>
          )}
          {isProBoosted && (
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "2px 7px",
                borderRadius: "4px",
                fontSize: "0.65rem",
                fontWeight: 800
              }}
            >
              FEATURED DROP
            </span>
          )}
        </div>

        {/* Quick View Button on Card Bottom Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(6px)",
            color: "#0f172a",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.72rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            zIndex: 2
          }}
        >
          <Eye size={12} />
          <span>Quick View</span>
        </div>
      </div>

      {/* 2. Shopify Product Details Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Creator & Category Label */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {category}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "0.74rem", color: "#334155", fontWeight: 600 }}>
                {author?.name || "Creator"}
              </span>
              {author?.isVerified && <VerifiedBadge size={12} style={{ display: "inline-block" }} />}
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: "0.96rem",
              fontWeight: 700,
              lineHeight: "1.4",
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

          {/* Available Sizes Swatches */}
          {sizes.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
              {sizes.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 7px",
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
                  +{sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Real-time Stock Indicator & Star Ratings */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.74rem", color: "#64748b", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span style={{ fontWeight: 600, color: "#059669" }}>
                {stock ? `${stock} in stock` : "Available"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2px", fontWeight: 700, color: "#0f172a" }}>
              <Star size={12} fill="#0f172a" color="#0f172a" />
              <span>{rating}</span>
              <span style={{ color: "#94a3b8", fontWeight: 400 }}>({reviewsCount || 42})</span>
            </div>
          </div>
        </div>

        {/* 3. Shopify Price & Primary CTA */}
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
            <span style={{ fontSize: "1.22rem", fontWeight: 900, color: "#0f172a" }}>
              ${numPrice.toFixed(2)}
            </span>
            {numOrigPrice && (
              <span style={{ fontSize: "0.82rem", color: "#94a3b8", textDecoration: "line-through" }}>
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
              fontSize: "0.82rem",
              padding: "7px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "6px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s ease"
            }}
          >
            <ShoppingBag size={13} />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
