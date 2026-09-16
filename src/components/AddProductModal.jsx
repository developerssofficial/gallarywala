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
  AlertCircle
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
  const [price, setPrice] = useState("19.99");
  const [originalPrice, setOriginalPrice] = useState("29.99");
  const [category, setCategory] = useState("Streetwear Apparel");
  const [productType, setProductType] = useState("physical"); // 'physical' | 'digital'
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85");
  const [description, setDescription] = useState("");
  const [sizesInput, setSizesInput] = useState("S, M, L, XL, 2XL");
  const [materialSpec, setMaterialSpec] = useState("240 GSM Combed Cotton");
  const [shippingSpec, setShippingSpec] = useState("Worldwide Insured Delivery (3-7 Days)");

  if (!isAddProductOpen) return null;

  // If user hasn't created a store yet, redirect to CreateStoreModal
  if (!userStore) {
    return (
      <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
        <div
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "480px", textAlign: "center", padding: "32px 24px" }}
        >
          <Package size={48} color="var(--color-primary)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>
            You Need a Store First!
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "20px", lineHeight: 1.5 }}>
            Launch your free creator store in 30 seconds to start listing up to 5 products for free.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setIsAddProductOpen(false);
              setIsCreateStoreOpen(true);
            }}
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
          >
            Get Your Free Store Now 🚀
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
      itemCount: productType === "physical" ? "Physical Merch" : "Digital Asset Suite",
      coverImage: coverImage.trim(),
      previewImages: [coverImage.trim()],
      description: description.trim() || "High quality official creator product.",
      sizes: sizesArr,
      specs: {
        material: materialSpec.trim() || "Premium Grade",
        shipping: shippingSpec.trim() || "Instant Delivery"
      },
      features: [
        "100% Quality Guaranteed",
        "Official GallaryWala Authenticity Tag",
        productType === "physical" ? "Insured Delivery & Tracking" : "Instant Cloud ZIP Download"
      ]
    });

    if (res.success) {
      setIsAddProductOpen(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsAddProductOpen(false)}
      style={{ zIndex: 10010 }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "700px",
          width: "95%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          border: "1px solid var(--border-light)",
          padding: "28px"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                List New Store Product
              </h2>
              {userStore.tier === "pro" ? (
                <span style={{ fontSize: "0.72rem", background: "rgba(234, 179, 8, 0.15)", color: "#eab308", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                  👑 PRO STORE (UNLIMITED)
                </span>
              ) : (
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                  FREE STORE ({myProdsCount}/5 USED)
                </span>
              )}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
              Add a new physical merch item, apparel, or digital creative suite to your store.
            </p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsAddProductOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Plan Limit Alert if 5/5 reached */}
        {isFreeLimitReached ? (
          <div
            style={{
              padding: "28px 20px",
              textAlign: "center",
              background: "rgba(121, 40, 202, 0.08)",
              border: "1px solid var(--color-primary)",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px"
            }}
          >
            <Crown size={36} color="#eab308" style={{ margin: "0 auto 12px auto" }} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "6px", color: "var(--text-main)" }}>
              Free Store Limit Reached (5 of 5 Products)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "420px", margin: "0 auto 18px auto", lineHeight: 1.4 }}>
              You have used all 5 free product slots. Upgrade to <strong>Pro Store</strong> to unlock unlimited listings, <strong>SEO Google Boost</strong>, and priority banner placement!
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => upgradeStoreTier("pro")}
              style={{ padding: "10px 24px", fontSize: "0.9rem" }}
            >
              🚀 Upgrade to Pro for Unlimited Products & SEO Push
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Title & Product Type */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gojo Satoru Vintage Heavyweight Tee"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="physical">Physical Merch</option>
                  <option value="digital">Digital Tool / Suite</option>
                </select>
              </div>
            </div>

            {/* Price & Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: "12px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="19.99"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Original Price (Discount)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  className="form-input"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Streetwear Apparel">Streetwear Apparel</option>
                  <option value="Posters & Canvas Art">Posters & Canvas Art</option>
                  <option value="Gaming & Desk Accessories">Gaming & Desk Accessories</option>
                  <option value="Digital Tools & Presets">Digital Tools & Presets</option>
                  <option value="Collectibles & Figures">Collectibles & Figures</option>
                </select>
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Product Image / Mockup URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            {/* Sizes & Variants */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sizes / Options (Comma separated)</label>
              <input
                type="text"
                placeholder="S, M, L, XL, 2XL (or 18x24 inch, 24x36 inch)"
                className="form-input"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
              />
            </div>

            {/* Specs (Material & Shipping) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Material / Format Spec</label>
                <input
                  type="text"
                  placeholder="e.g. 240 GSM Combed Cotton"
                  className="form-input"
                  value={materialSpec}
                  onChange={(e) => setMaterialSpec(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Shipping / Delivery Spec</label>
                <input
                  type="text"
                  placeholder="e.g. Worldwide Insured (3-7 Days)"
                  className="form-input"
                  value={shippingSpec}
                  onChange={(e) => setShippingSpec(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Product Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Describe fit, material, artwork details, and what makes this product special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                className="nav-tab"
                onClick={() => setIsAddProductOpen(false)}
                style={{ padding: "10px 18px", border: "1px solid var(--border-light)" }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "10px 24px", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} />
                <span>Publish Product to Store</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
