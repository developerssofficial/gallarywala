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
  Check,
  Star,
  ShoppingBag
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

  // Multi-step Wizard: 1 = Bespoke Onboarding Showcase, 2 = Store Identity, 3 = First Product & Logistics
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
  const [productTitle, setProductTitle] = useState("Cyberpunk Heavyweight Vintage Tee");
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

    // 3. Publish the first product automatically with stock, delivery & logistics
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
        backdropFilter: "blur(12px)",
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: step === 1 ? "860px" : "740px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 30px 100px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
          padding: 0,
          position: "relative",
          animation: "scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#f1f5f9",
            border: "none",
            color: "#475569",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 20,
            transition: "all 0.15s ease"
          }}
          title="Close / Skip"
        >
          <X size={18} />
        </button>

        {/* ----------------- STEP 1: BESPOKE CREATOR STOREFRONT SHOWCASE ----------------- */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", minHeight: "520px" }}>
            {/* Left Column: Authentic Pitch & Key Value */}
            <div style={{ padding: "44px 38px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* Minimal pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f1f5f9",
                    color: "#0f172a",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "16px"
                  }}
                >
                  <Store size={13} color="#7928ca" />
                  <span>GallaryWala Creator Store</span>
                </div>

                <h2
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: "1.22",
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.03em"
                  }}
                >
                  Launch your official merchandise store.
                </h2>

                <p style={{ color: "#475569", fontSize: "0.94rem", lineHeight: 1.55, margin: "0 0 24px 0" }}>
                  Sell streetwear drops, physical art canvas, and digital presets directly to your community with verified stock tracking and guaranteed fast delivery times.
                </p>

                {/* Sleek Benefits List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "30px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: "0.88rem", color: "#1e293b", fontWeight: 600 }}>
                      <strong>100% Free Plan:</strong> List up to 5 products with 0% listing fee
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: "0.88rem", color: "#1e293b", fontWeight: 600 }}>
                      <strong>Stock & Delivery Proof:</strong> Show available pieces & express dispatch
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: "0.88rem", color: "#1e293b", fontWeight: 600 }}>
                      <strong>Buyer Push:</strong> Automatic feed placement to active shoppers
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fae8ff", color: "#c026d3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Crown size={12} />
                    </div>
                    <span style={{ fontSize: "0.88rem", color: "#1e293b", fontWeight: 600 }}>
                      <strong>Pro SEO Upgrade:</strong> Rank on Google with rich schema & top banners
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    padding: "14px 24px",
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#1e293b")}
                  onMouseLeave={(e) => (e.target.style.background = "#0f172a")}
                >
                  <span>Set Up My Store (Free)</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    padding: "6px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  Explore marketplace first
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Live Store Product Card Mockup */}
            <div
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderLeft: "1px solid #e2e8f0",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative"
              }}
            >
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
                  Live Storefront Preview
                </div>

                {/* Product Card Mockup */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: "180px", background: "#0f172a" }}>
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80"
                      alt="Merch Drop"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: "8px", left: "8px", background: "#10b981", color: "#fff", padding: "2px 8px", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 800 }}>
                      📦 50 in Stock
                    </div>
                    <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(15,23,42,0.85)", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 700 }}>
                      🚚 2-4 Days
                    </div>
                  </div>

                  <div style={{ padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#7928ca", textTransform: "uppercase" }}>
                        Streetwear Drop
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                        @{storeHandle || "your_brand"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                      Cyberpunk Heavyweight Tee
                    </div>

                    <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                      {["S", "M", "L", "XL"].map((sz) => (
                        <span key={sz} style={{ fontSize: "0.65rem", padding: "2px 6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#475569", fontWeight: 700 }}>
                          {sz}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a" }}>$29.99</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", textDecoration: "line-through" }}>$45.00</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", background: "#0f172a", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
                        Instant Buy
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "12px", textAlign: "center", fontSize: "0.75rem", color: "#64748b" }}>
                  ✨ Real-time delivery & verified purchase invoice included.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- STEP 2: STORE IDENTITY & PLAN SELECTION ----------------- */}
        {step === 2 && (
          <div>
            {/* Top Bar with Step Indicator */}
            <div
              style={{
                background: "#0f172a",
                padding: "24px 28px",
                color: "#ffffff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#38bdf8" }}>
                  Step 1 of 2 • Store Profile
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>Next: Product & Stock</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0 }}>
                Store Identity & Category 🏪
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                Set up your official shop handle and merchandising category.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Store Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.92rem",
                      background: "#f8fafc",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Store Handle & Category in 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                      Store Handle / URL
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700 }}>
                        @
                      </span>
                      <input
                        type="text"
                        value={storeHandle}
                        onChange={(e) => setStoreHandle(e.target.value.replace(/^@/, ""))}
                        placeholder="my_brand"
                        style={{
                          width: "100%",
                          padding: "11px 14px 11px 28px",
                          borderRadius: "10px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.92rem",
                          background: "#f8fafc"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                      Primary Category
                    </label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.92rem",
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
                </div>

                {/* Store Bio */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Store Bio / Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={storeBio}
                    onChange={(e) => setStoreBio(e.target.value)}
                    placeholder="Short description of your merchandise and creative products..."
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.9rem",
                      background: "#f8fafc",
                      resize: "none"
                    }}
                  />
                </div>

                {/* Plan Selection Box */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "10px", color: "#0f172a" }}>
                    Select Launch Plan
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {/* Free Tier Card */}
                    <div
                      onClick={() => setSelectedTier("free")}
                      style={{
                        border: selectedTier === "free" ? "2px solid #0f172a" : "1.5px solid #e2e8f0",
                        background: selectedTier === "free" ? "#f8fafc" : "#ffffff",
                        borderRadius: "12px",
                        padding: "14px",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>Free Creator</span>
                        <span style={{ fontSize: "0.72rem", background: "#059669", color: "#fff", fontWeight: 800, padding: "2px 7px", borderRadius: "4px" }}>
                          $0 / FREE
                        </span>
                      </div>
                      <p style={{ margin: "0 0 6px 0", fontSize: "0.78rem", color: "#64748b" }}>
                        List up to <strong>5 products</strong> with organic buyer push.
                      </p>
                      <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
                        ✓ 0% Platform Upfront Fee
                      </div>
                    </div>

                    {/* Pro Tier Card */}
                    <div
                      onClick={() => setSelectedTier("pro")}
                      style={{
                        border: selectedTier === "pro" ? "2px solid #7928ca" : "1.5px solid #e2e8f0",
                        background: selectedTier === "pro" ? "rgba(121, 40, 202, 0.04)" : "#ffffff",
                        borderRadius: "12px",
                        padding: "14px",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Crown size={14} color="#eab308" /> Pro SEO Store
                        </span>
                        <span style={{ fontSize: "0.72rem", background: "#7928ca", color: "#fff", fontWeight: 800, padding: "2px 7px", borderRadius: "4px" }}>
                          PRO
                        </span>
                      </div>
                      <p style={{ margin: "0 0 6px 0", fontSize: "0.78rem", color: "#64748b" }}>
                        <strong>Unlimited products</strong> + Google SEO & top banner boost.
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
                      border: "1.5px solid #e2e8f0",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      padding: "11px 22px",
                      borderRadius: "10px",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <span>Next: Add 1st Product & Stock</span>
                    <ArrowRight size={15} />
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
                background: "#0f172a",
                padding: "24px 28px",
                color: "#ffffff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#38bdf8" }}>
                  Step 2 of 2 • First Product Drop
                </span>
                <span style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>● Almost Live!</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0 }}>
                List Your First Product & Stock 📦
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                Specify pricing, available stock units, and guaranteed delivery speed.
              </p>
            </div>

            <form onSubmit={handleFinalLaunch} style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Product Title */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Cyberpunk Heavyweight Vintage Tee"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.92rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>

                {/* Price, Original Price, Stock Pieces in 3 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.92rem",
                        background: "#f8fafc"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.92rem",
                        background: "#f8fafc"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.92rem",
                        background: "#f8fafc"
                      }}
                    />
                  </div>
                </div>

                {/* Delivery Time & Return Policy */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.88rem",
                        background: "#f8fafc"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                      Buyer Guarantee / Return Policy
                    </label>
                    <input
                      type="text"
                      value={productReturnPolicy}
                      onChange={(e) => setProductReturnPolicy(e.target.value)}
                      placeholder="e.g. 7-Day Hassle-Free Replacement"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.88rem",
                        background: "#f8fafc"
                      }}
                    />
                  </div>
                </div>

                {/* Product Cover Image URL */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
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
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.88rem",
                        background: "#f8fafc"
                      }}
                    />
                    {productImage && (
                      <img
                        src={productImage}
                        alt="Preview"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Material Specs & Sizes */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                      Material & Quality Proof
                    </label>
                    <input
                      type="text"
                      value={productMaterial}
                      onChange={(e) => setProductMaterial(e.target.value)}
                      placeholder="e.g. 240 GSM 100% Combed Cotton"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
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
                      value={productSizes}
                      onChange={(e) => setProductSizes(e.target.value)}
                      placeholder="S, M, L, XL, 2XL"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "0.88rem",
                        background: "#f8fafc"
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
                      border: "1.5px solid #e2e8f0",
                      padding: "11px 18px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      padding: "13px 26px",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
                      cursor: "pointer"
                    }}
                  >
                    <Rocket size={17} />
                    <span>Launch Store & Publish Product</span>
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
