import React from "react";
import { VerifiedBadge } from "./VerifiedBadge";
import { Star, ShoppingBag, Eye, Package, Tag, Sparkles } from "lucide-react";

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
    rating,
    reviewsCount,
    salesCount,
    coverImage,
    sizes = [],
    author
  } = product;

  return (
    <div
      className="store-card"
      onClick={() => onSelect && onSelect(product)}
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-light)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "var(--shadow-sm)",
        position: "relative"
      }}
    >
      {/* Cover Image & Badges */}
      <div style={{ position: "relative", width: "100%", paddingTop: "72%", overflow: "hidden", background: "var(--bg-surface)" }}>
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
          className="store-card-img"
        />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {badge && (
            <div
              style={{
                background: "rgba(12, 14, 20, 0.85)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Product Type Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(6px)",
            color: "#0c0e14",
            padding: "4px 9px",
            borderRadius: "6px",
            fontSize: "0.72rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          <Package size={12} color="var(--color-primary)" />
          <span>{itemCount}</span>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Category & Creator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {category}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={author?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                alt={author?.name}
                style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {author?.name}
              </span>
              {author?.isVerified && <VerifiedBadge size={13} style={{ display: "inline-block" }} />}
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "0.98rem",
              fontWeight: 800,
              lineHeight: "1.35",
              margin: "0 0 8px 0",
              color: "var(--text-main)",
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
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-muted)",
                    fontWeight: 700
                  }}
                >
                  {s}
                </span>
              ))}
              {sizes.length > 4 && (
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", alignSelf: "center" }}>
                  +{sizes.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Rating & Sales */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#eab308", fontWeight: 700 }}>
              <Star size={13} fill="#eab308" color="#eab308" />
              <span>{rating}</span>
            </div>
            <span>•</span>
            <span>({reviewsCount} reviews)</span>
            <span>•</span>
            <span>{salesCount} orders</span>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-light)"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--color-primary)" }}>
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect ? onSelect(product) : onInstantBuy(product);
              }}
              style={{
                fontSize: "0.8rem",
                padding: "7px 14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "var(--radius-full)"
              }}
            >
              <ShoppingBag size={14} />
              <span>View Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
