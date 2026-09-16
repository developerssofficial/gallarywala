import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import confetti from "canvas-confetti";
import {
  X,
  Store,
  Sparkles,
  Rocket,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Zap,
  Tag,
  ArrowRight,
  Package,
  Truck,
  Layers,
  DollarSign,
  Box,
  Clock,
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react";

export const CreateStoreModal = () => {
  const {
    isCreateStoreOpen,
    setIsCreateStoreOpen,
    currentUser,
    userStore,
    createCreatorStore,
    upgradeStoreTier,
    addStoreProduct,
    showToast,
    setActiveView
  } = usePins();

  // Multi-step Wizard: 1 = Big Welcome Pop-up, 2 = Store Identity, 3 = First Product & Logistics
  const [step, setStep] = useState(1);

  // Step 2: Store Details
  const [storeName, setStoreName] = useState(
    currentUser?.user_metadata?.full_name ? `${currentUser.user_metadata.full_name}'s Store` : "My Creator Store"
  );
  const [storeHandle, setStoreHandle] = useState(
    currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "creator"
  );
  const [storeBio, setStoreBio] = useState("Official high-quality creator merchandise, apparel & creative assets.");
  const [storeCategory, setStoreCategory] = useState("Streetwear Apparel");
  const [selectedTier, setSelectedTier] = useState("free"); // 'free' | 'pro'

  // Step 3: First Product Details & Logistics
  const [productTitle, setProductTitle] = useState("Cyberpunk Oversized Vintage Heavyweight Tee");
  const [productPrice, setProductPrice] = useState("29.99");
  const [productOriginalPrice, setProductOriginalPrice] = useState("45.00");
  const [productStock, setProductStock] = useState("50");
  const [productDeliveryTime, setProductDeliveryTime] = useState("2-4 Business Days Express Dispatch");
  const [productReturnPolicy, setProductReturnPolicy] = useState("7-Day Hassle-Free Replacement Guarantee");
  const [productType, setProductType] = useState("physical"); // 'physical' | 'digital'
  const [productImage, setProductImage] = useState("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85");
  const [productMaterial, setProductMaterial] = useState("240 GSM 100% Combed Cotton, Screen-Printed");
  const [productSizes, setProductSizes] = useState("S, M, L, XL, 2XL");
  const [productDescription, setProductDescription] = useState("Premium limited-run streetwear drop designed for creators, gamers, and visual art enthusiasts. Features durable reinforced stitching and heavyweight breathability.");

  if (!isCreateStoreOpen) return null;

  const handleSkip = () => {
    try {
      sessionStorage.setItem("gw_store_onboarding_skipped", "true");
    } catch {}
    setIsCreateStoreOpen(false);
    setStep(1);
    setActiveView("store");
  };

  const handleFinalLaunch = (e) => {
    e.preventDefault();

    if (!storeName.trim()) {
      showToast("Please enter a Store Name.", "warning");
      setStep(2);
      return;
    }

    if (!productTitle.trim()) {
      showToast("Please enter a Product Title for your first listing.", "warning");
      return;
    }

    // 1. Create the store
    const createdStore = createCreatorStore({
      name: storeName.trim(),
      handle: storeHandle.trim(),
      bio: storeBio.trim(),
      category: storeCategory
    });

    // 2. Upgrade to pro if chosen
    if (selectedTier === "pro") {
      upgradeStoreTier("pro");
    }

    // 3. Publish the first product automatically with stock, delivery & logistics!
    const sizesArray = productSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addStoreProduct({
      title: productTitle.trim(),
      price: parseFloat(productPrice) || 19.99,
      originalPrice: productOriginalPrice ? parseFloat(productOriginalPrice) : undefined,
      category: storeCategory,
      type: productType,
      coverUrl: productImage.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85",
      description: productDescription.trim(),
      stock: parseInt(productStock, 10) || 50,
      deliveryTime: productDeliveryTime.trim(),
      returnPolicy: productReturnPolicy.trim(),
      sizes: sizesArray.length > 0 ? sizesArray : ["Standard"],
      specs: {
        material: productMaterial.trim(),
        shipping: productDeliveryTime.trim(),
        stockQuantity: `${productStock} Units in Stock`,
        guarantee: productReturnPolicy.trim()
      }
    });

    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch {}

    setIsCreateStoreOpen(false);
    setStep(1);
    setActiveView("store");
    showToast(`🎉 Store "@${storeHandle}" & "${productTitle}" are now LIVE on GallaryWala!`, "success");
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsCreateStoreOpen(false)}
      style={{
        zIndex: 10010,
        backdropFilter: "blur(8px)",
        background: "rgba(10, 10, 15, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: step === 1 ? "620px" : "740px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
          border: "1px solid rgba(0,0,0,0.08)",
          padding: 0,
          position: "relative",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: step === 1 ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.05)",
            border: "none",
            color: "var(--text-main)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.15s ease"
          }}
          title="Close / Skip"
        >
          <X size={18} />
        </button>

        {/* ----------------- STEP 1: BIG FIRST-TIME WELCOME POPUP ----------------- */}
        {step === 1 && (
          <div style={{ padding: "40px 32px 36px", textAlign: "center" }}>
            {/* Glowing Icon Badge */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #7928ca 0%, #ff0080 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                margin: "0 auto 20px auto",
                boxShadow: "0 12px 30px rgba(255, 0, 128, 0.35)",
                transform: "rotate(-3deg)"
              }}
            >
              <Store size={40} />
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.12)", color: "#059669", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 800, marginBottom: "12px" }}>
              <Sparkles size={14} />
              <span>READY IN 30 SECONDS • 100% FREE SETUP</span>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#111827", lineHeight: 1.25, margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
              Ready to Launch Your Online Store in 30 Seconds? 🛍️
            </h2>

            <p style={{ color: "#6b7280", fontSize: "0.96rem", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 26px auto" }}>
              Turn your creativity into sales! Set up your official store, list up to <strong>5 products free</strong>, specify stock & fast delivery, and get your products pushed to thousands of GallaryWala shoppers.
            </p>

            {/* Feature Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
                textAlign: "left",
                marginBottom: "30px"
              }}
            >
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  gap: "12px"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px 0", fontSize: "0.92rem", fontWeight: 800, color: "#111827" }}>
                    Free 5 Products Listing
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                    Start selling immediately with zero upfront fees or hidden charges.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  gap: "12px"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Truck size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px 0", fontSize: "0.92rem", fontWeight: 800, color: "#111827" }}>
                    Stock & Fast Delivery Proof
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                    Show available pieces and guaranteed dispatch times for buyer trust.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  gap: "12px"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Rocket size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px 0", fontSize: "0.92rem", fontWeight: 800, color: "#111827" }}>
                    Auto-Push to Buyers
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                    Your products are pushed across the GallaryWala store network automatically.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  gap: "12px"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fae8ff", color: "#c026d3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Crown size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 3px 0", fontSize: "0.92rem", fontWeight: 800, color: "#111827" }}>
                    Pro SEO Boost Option
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                    Upgrade anytime for Google SEO ranking & unlimited product slots.
                  </p>
                </div>
              </div>
            </div>

            {/* 2 Big Primary Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(2)}
                style={{
                  padding: "15px 28px",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(255, 0, 128, 0.35)",
                  cursor: "pointer"
                }}
              >
                <Rocket size={20} />
                <span>Let's Build Store in 30s 🚀</span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6b7280",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  padding: "8px 16px",
                  cursor: "pointer",
                  transition: "color 0.15s ease"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#111827")}
                onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
              >
                Skip & Explore Marketplace ➔
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STEP 2: STORE IDENTITY & PLAN SELECTION ----------------- */}
        {step === 2 && (
          <div>
            {/* Top Bar with Step Indicator */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                padding: "24px 28px",
                color: "#ffffff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#38bdf8" }}>
                  Step 1 of 2 • Store Setup
                </span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Next: Product & Stock</span>
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>
                Name Your Creator Store 🏪
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.86rem", color: "rgba(255,255,255,0.7)" }}>
                Give your store an identity and select your primary category.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Store Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Neon Wave Apparel or Studio X"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.95rem",
                      background: "#f9fafb",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Store Handle & Category in 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Store Handle / URL
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>
                        @
                      </span>
                      <input
                        type="text"
                        value={storeHandle}
                        onChange={(e) => setStoreHandle(e.target.value.replace(/^@/, ""))}
                        placeholder="my_brand"
                        style={{
                          width: "100%",
                          padding: "12px 14px 12px 30px",
                          borderRadius: "12px",
                          border: "1.5px solid #e5e7eb",
                          fontSize: "0.95rem",
                          background: "#f9fafb"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Primary Category
                    </label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.95rem",
                        background: "#f9fafb"
                      }}
                    >
                      <option value="Streetwear Apparel">Streetwear Apparel</option>
                      <option value="Posters & Canvas Art">Posters & Canvas Art</option>
                      <option value="Gaming & Desk Accessories">Gaming & Desk Accessories</option>
                      <option value="Digital Tools & Presets">Digital Tools & Presets</option>
                      <option value="Collectibles & Figures">Collectibles & Figures</option>
                    </select>
                  </div>
                </div>

                {/* Store Bio */}
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                    Store Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    value={storeBio}
                    onChange={(e) => setStoreBio(e.target.value)}
                    placeholder="Short description of your merchandise and creative products..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.92rem",
                      background: "#f9fafb",
                      resize: "none"
                    }}
                  />
                </div>

                {/* Plan Selection Box */}
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "10px", color: "#1f2937" }}>
                    Select Launch Tier
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {/* Free Tier Card */}
                    <div
                      onClick={() => setSelectedTier("free")}
                      style={{
                        border: selectedTier === "free" ? "2px solid #10b981" : "1.5px solid #e5e7eb",
                        background: selectedTier === "free" ? "rgba(16, 185, 129, 0.05)" : "#ffffff",
                        borderRadius: "14px",
                        padding: "16px",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>Free Creator</span>
                        <span style={{ fontSize: "0.75rem", background: "#10b981", color: "#fff", fontWeight: 800, padding: "2px 8px", borderRadius: "100px" }}>
                          $0 / FREE
                        </span>
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.78rem", color: "#6b7280" }}>
                        List up to <strong>5 products</strong> with automatic organic buyer push.
                      </p>
                      <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
                        ✓ 0% Platform Upfront Fee
                      </div>
                    </div>

                    {/* Pro Tier Card */}
                    <div
                      onClick={() => setSelectedTier("pro")}
                      style={{
                        border: selectedTier === "pro" ? "2px solid #7928ca" : "1.5px solid #e5e7eb",
                        background: selectedTier === "pro" ? "rgba(121, 40, 202, 0.05)" : "#ffffff",
                        borderRadius: "14px",
                        padding: "16px",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Crown size={15} color="#eab308" /> Pro SEO Store
                        </span>
                        <span style={{ fontSize: "0.75rem", background: "var(--brand-gradient)", color: "#fff", fontWeight: 800, padding: "2px 8px", borderRadius: "100px" }}>
                          PRO
                        </span>
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.78rem", color: "#6b7280" }}>
                        <strong>Unlimited products</strong> + Google SEO schema & top banner boost.
                      </p>
                      <div style={{ fontSize: "0.75rem", color: "#7928ca", fontWeight: 700 }}>
                        ✓ Priority Algorithm Push
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #e5e7eb",
                      padding: "11px 18px",
                      borderRadius: "12px",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "#4b5563",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <span>Next: Add 1st Product & Stock</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ----------------- STEP 3: FIRST PRODUCT & LOGISTICS (STOCK + DELIVERY PROOF) ----------------- */}
        {step === 3 && (
          <div>
            {/* Top Bar with Step Indicator */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                padding: "24px 28px",
                color: "#ffffff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#38bdf8" }}>
                  Step 2 of 2 • First Product Drop
                </span>
                <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700 }}>● Almost Live!</span>
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>
                List Your First Product & Stock 📦
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.86rem", color: "rgba(255,255,255,0.7)" }}>
                Specify product pricing, available stock units, and guaranteed delivery timeframe.
              </p>
            </div>

            <form onSubmit={handleFinalLaunch} style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Product Title */}
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Cyberpunk Oversized Vintage Heavyweight Tee"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.95rem",
                      background: "#f9fafb"
                    }}
                  />
                </div>

                {/* Price, Original Price, Stock Pieces in 3 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Selling Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="29.99"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.95rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Regular Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productOriginalPrice}
                      onChange={(e) => setProductOriginalPrice(e.target.value)}
                      placeholder="45.00"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.95rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productStock}
                      onChange={(e) => setProductStock(e.target.value)}
                      placeholder="50"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.95rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>
                </div>

                {/* Delivery Time & Return Policy (The Company Logistics Guarantee) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Estimated Delivery Speed *
                    </label>
                    <input
                      type="text"
                      required
                      value={productDeliveryTime}
                      onChange={(e) => setProductDeliveryTime(e.target.value)}
                      placeholder="e.g. 2-4 Business Days Express"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.9rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Buyer Guarantee / Return Policy
                    </label>
                    <input
                      type="text"
                      value={productReturnPolicy}
                      onChange={(e) => setProductReturnPolicy(e.target.value)}
                      placeholder="e.g. 7-Day Hassle-Free Replacement"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.9rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>
                </div>

                {/* Product Cover Image URL */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                    Product Image URL
                  </label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="url"
                      required
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={{
                        flex: 1,
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.9rem",
                        background: "#f9fafb"
                      }}
                    />
                    {productImage && (
                      <img
                        src={productImage}
                        alt="Preview"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #e5e7eb"
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Material Specs & Sizes */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Material & Quality Proof
                    </label>
                    <input
                      type="text"
                      value={productMaterial}
                      onChange={(e) => setProductMaterial(e.target.value)}
                      placeholder="e.g. 240 GSM 100% Combed Cotton"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.9rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#1f2937" }}>
                      Sizes / Available Variants
                    </label>
                    <input
                      type="text"
                      value={productSizes}
                      onChange={(e) => setProductSizes(e.target.value)}
                      placeholder="S, M, L, XL, 2XL"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "0.9rem",
                        background: "#f9fafb"
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #e5e7eb",
                      padding: "12px 18px",
                      borderRadius: "12px",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "#4b5563",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: "14px 28px",
                      borderRadius: "14px",
                      fontSize: "1rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 8px 24px rgba(255, 0, 128, 0.35)",
                      cursor: "pointer"
                    }}
                  >
                    <Rocket size={18} />
                    <span>🚀 Launch Store & Publish Product</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
