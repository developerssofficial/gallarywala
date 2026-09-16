import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Package,
  Plus,
  Crown,
  Sparkles,
  Tag,
  DollarSign,
  Layers,
  Upload,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
  Box
} from "lucide-react";

export const AddProductModal = () => {
  const {
    isAddProductOpen,
    setIsAddProductOpen,
    userStore,
    setIsCreateStoreOpen,
    upgradeStoreTier,
    marketplaceProducts,
    addStoreProduct,
    showToast
  } = usePins();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("29.99");
  const [originalPrice, setOriginalPrice] = useState("45.00");
  const [category, setCategory] = useState("Streetwear Apparel");
  const [productType, setProductType] = useState("physical"); // 'physical' | 'digital'
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("50");
  const [deliveryTime, setDeliveryTime] = useState("2-4 Business Days Express Dispatch");
  const [returnPolicy, setReturnPolicy] = useState("14-Day Free Exchange Guarantee");
  const [sizesInput, setSizesInput] = useState("S, M, L, XL, 2XL");
  const [materialSpec, setMaterialSpec] = useState("240 GSM Combed Heavyweight Cotton");

  if (!isAddProductOpen) return null;

  // If user hasn't created a store yet, redirect to CreateStoreModal
  if (!userStore) {
    return (
      <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
        <div
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "460px", textAlign: "center", padding: "36px 28px", background: "#ffffff", borderRadius: "16px" }}
        >
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f1f5f9", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Package size={24} />
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px", color: "#0f172a" }}>
            You Need a Store First
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: "22px", lineHeight: 1.5 }}>
            Set up your official creator store in 30 seconds to start publishing up to 5 product drops for free.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsAddProductOpen(false);
              setIsCreateStoreOpen(true);
            }}
            style={{
              width: "100%",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Launch Free Store in 30s
          </button>
        </div>
      </div>
    );
  }

  const myProdsCount = marketplaceProducts.filter(
    (p) => p.author?.username === userStore.handle || p.storeId === userStore.id
  ).length;

  const isFreeLimitReached = userStore.tier === "free" && myProdsCount >= 5;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Please enter a Product Title.", "warning");
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast("Please enter a valid price.", "warning");
      return;
    }

    const sizesArr = sizesInput
      ? sizesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Standard Edition"];

    const res = addStoreProduct({
      title: title.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      productType,
      coverUrl: coverImage.trim(),
      description: description.trim() || `${title.trim()} — Official verified creator merchandise drop.`,
      stock: parseInt(stock, 10) || 50,
      deliveryTime: deliveryTime.trim(),
      returnPolicy: returnPolicy.trim(),
      sizes: sizesArr,
      specs: {
        material: materialSpec.trim() || "Premium Heavyweight Fabric",
        shipping: deliveryTime.trim(),
        stockQuantity: `${stock} Units Available`,
        guarantee: returnPolicy.trim()
      }
    });

    if (res && res.limitReached) {
      return;
    }

    setIsAddProductOpen(false);
    setTitle("");
    setDescription("");
    showToast(`🎉 Product "${title.trim()}" published to your store!`, "success");
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)} style={{ zIndex: 10020 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "640px",
          width: "95%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: 0,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Shopify Product Editor
            </span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, margin: "2px 0 0 0", color: "#0f172a" }}>
              Add New Product Drop
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(false)}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#475569"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Plan Limit Notice */}
        {isFreeLimitReached ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Crown size={22} />
            </div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 8px 0", color: "#0f172a" }}>
              Free Store Limit Reached (5/5 Products)
            </h4>
            <p style={{ color: "#64748b", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 20px", lineHeight: 1.5 }}>
              You have used all 5 free product slots. Upgrade to Pro for unlimited drops and priority Google SEO rich indexing.
            </p>
            <button
              type="button"
              onClick={() => {
                upgradeStoreTier("pro");
                showToast("👑 Upgraded to PRO Store! Unlimited products unlocked.", "success");
              }}
              style={{
                background: "#0f172a",
                color: "#fff",
                border: "none",
                padding: "11px 24px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Upgrade to PRO (Unlimited Drops)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavyweight Tokyo Vintage Acid-Wash Tee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.9rem",
                    background: "#f8fafc"
                  }}
                />
              </div>

              {/* Pricing, Compare Price & Stock in 3 columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.9rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Compare-at ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.9rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.9rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>
              </div>

              {/* Category & Product Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.88rem",
                      background: "#f8fafc"
                    }}
                  >
                    <option value="Streetwear Apparel">Streetwear Apparel</option>
                    <option value="Posters & Canvas Art">Posters & Canvas Art</option>
                    <option value="Gaming & Desk Accessories">Gaming & Desk Accessories</option>
                    <option value="Digital Tools & Presets">Digital Tools & Presets</option>
                    <option value="Collectibles & Figures">Collectibles & Figures</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Fulfillment Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.88rem",
                      background: "#f8fafc"
                    }}
                  >
                    <option value="physical">Physical Drop (Shipped Courier)</option>
                    <option value="digital">Digital Asset (Instant Download)</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                  Product Image URL
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.88rem",
                      background: "#f8fafc"
                    }}
                  />
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Preview"
                      style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                    />
                  )}
                </div>
              </div>

              {/* Delivery Speed & Return Policy */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Dispatch & Shipping Speed
                  </label>
                  <input
                    type="text"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="e.g. 2-4 Business Days Express"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.88rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Sizes / Available Variants
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="S, M, L, XL, 2XL"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.88rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                  Product Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed material specs, sizing guidance, and craftsmanship..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.88rem",
                    background: "#f8fafc",
                    resize: "none"
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: "#475569"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 22px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Publish Product Drop
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
