import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  X,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle2,
  Package,
  ShieldCheck,
  Star,
  Printer,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  Heart,
  Download
} from "lucide-react";
import confetti from "canvas-confetti";
import { calculateRevenueSplit } from "../services/paddle";

export const StoreProductModal = ({ product, isOpen, onClose }) => {
  const {
    currentUser,
    downloadImage,
    setActiveInvoice,
    setSalesHistory,
    setCreatorEarnings,
    showToast
  } = usePins();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [buyerFullName, setBuyerFullName] = useState(currentUser?.user_metadata?.full_name || "");
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const {
    id,
    title,
    description,
    price,
    originalPrice,
    badge,
    category,
    productType,
    itemCount,
    specs = {},
    sizes = [],
    rating,
    reviewsCount,
    salesCount,
    coverImage,
    coverUrl,
    previewImages,
    features = [],
    author
  } = product;

  const displayCover = coverUrl || coverImage || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85";
  const allPreviews = previewImages && previewImages.length > 0 ? previewImages : [displayCover];

  const currentSize = selectedSize || sizes[0] || "Standard Edition";
  const split = calculateRevenueSplit(price);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!buyerEmail.trim()) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }
    if (productType === "physical" && !shippingAddress.trim()) {
      showToast("Please enter your shipping delivery address.", "warning");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const invoiceNumber = `INV-STORE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId: "GW-ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        invoiceNumber,
        pinId: id,
        pinTitle: `${title} (${currentSize})`,
        buyerName: buyerFullName.trim() || "Customer",
        buyerEmail: buyerEmail.trim(),
        shippingAddress: shippingAddress.trim() || "Instant Cloud Delivery",
        amount: price,
        grossAmount: split.gross,
        paddleFee: split.paddleFee,
        netAvailable: split.netAvailable,
        platformCut: split.platformCut,
        creatorCut: split.creatorCut,
        license: productType === "physical" ? "Physical Official Merchandise" : "Digital Master Suite License",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        timestamp: new Date().toISOString()
      };

      // Add to sales history
      setSalesHistory((prev) => [orderData, ...prev]);

      // Add to creator balance
      setCreatorEarnings((prev) => ({
        balance: Number((prev.balance + split.creatorCut).toFixed(2)),
        totalSales: prev.totalSales + 1,
        pendingPayout: Number((prev.pendingPayout + split.creatorCut).toFixed(2)),
        totalPlatformProfit: Number(((prev.totalPlatformProfit || 0) + split.platformCut).toFixed(2))
      }));

      // Trigger Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setPurchaseSuccess(orderData);
      setLoading(false);
      showToast(`🎉 Order Placed Successfully! Invoice: ${invoiceNumber}`, "success");
    }, 1200);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!loading) onClose();
      }}
      style={{ zIndex: 10005 }}
    >
      <div
        className="modal-container store-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "920px",
          width: "95%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          border: "1px solid var(--border-light)",
          padding: 0
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: "16px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border-light)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase" }}>
              {category}
            </span>
            {badge && (
              <span style={{ fontSize: "0.72rem", background: "var(--bg-surface)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                {badge}
              </span>
            )}
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Main Content */}
        {purchaseSuccess ? (
          /* Order Confirmation Screen */
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "8px", color: "var(--text-main)" }}>
              Order Confirmed & Payment Successful! 🎉
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "480px", margin: "0 auto 24px" }}>
              Thank you for ordering <strong>{title}</strong> from <strong>{author?.name}</strong>. A confirmation and tracking receipt has been prepared for you.
            </p>

            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                maxWidth: "500px",
                margin: "0 auto 24px",
                textAlign: "left",
                fontSize: "0.85rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Item Ordered:</span>
                <span style={{ fontWeight: 800 }}>{title} ({currentSize})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Official Invoice:</span>
                <span style={{ fontWeight: 800, fontFamily: "monospace", color: "var(--color-primary)" }}>
                  {purchaseSuccess.invoiceNumber}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Delivery / Shipping:</span>
                <span style={{ fontWeight: 700 }}>{purchaseSuccess.shippingAddress}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Charged:</span>
                <span style={{ fontWeight: 900, color: "#10b981", fontSize: "1.1rem" }}>${price.toFixed(2)} USD</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {productType === "digital" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => downloadImage(coverImage, `${title.replace(/\s+/g, "_")}_Package.png`)}
                  style={{ padding: "12px 24px", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Download size={18} />
                  <span>Download Digital Asset Suite</span>
                </button>
              )}

              <button
                type="button"
                className="nav-tab"
                onClick={() => {
                  onClose();
                  setActiveInvoice(purchaseSuccess);
                }}
                style={{ padding: "12px 22px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", border: "1px solid var(--border-light)", background: "var(--bg-card)" }}
              >
                <Printer size={16} />
                <span>View & Print Official Invoice</span>
              </button>
            </div>
          </div>
        ) : (
          /* Product Details & Ordering Form */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px", padding: "24px" }}>
            {/* Left Column: Media & Creator */}
            <div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "75%",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  background: "var(--bg-surface)",
                  marginBottom: "12px",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <img
                  src={allPreviews[activeImageIndex] || displayCover}
                  alt={title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              {/* Thumbnails list */}
              {allPreviews.length > 1 && (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px", marginBottom: "16px" }}>
                  {allPreviews.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      style={{
                        width: "68px",
                        height: "50px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: activeImageIndex === i ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                        padding: 0,
                        cursor: "pointer",
                        flexShrink: 0
                      }}
                    >
                      <img src={img} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Creator Card */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={author?.avatar}
                    alt={author?.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>{author?.name}</span>
                      {author?.isVerified && <VerifiedBadge size={14} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Official Store Creator</span>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#10b981", background: "rgba(16, 185, 129, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
                  Verified Seller
                </span>
              </div>
            </div>

            {/* Right Column: Info, Variants & Buy Box */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: "1.45rem", fontWeight: 900, lineHeight: 1.25, marginBottom: "8px", color: "var(--text-main)" }}>
                  {title}
                </h1>

                {/* Rating & Reviews */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#eab308", fontWeight: 800 }}>
                    <Star size={14} fill="#eab308" color="#eab308" />
                    <span>{rating}</span>
                  </div>
                  <span>•</span>
                  <span>{reviewsCount} Verified Customer Reviews</span>
                  <span>•</span>
                  <span>{salesCount} Sold</span>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "18px" }}>
                  {description}
                </p>

                {/* Size / Variant Selector */}
                {sizes.length > 0 && (
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                      Select Option / Size:
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {sizes.map((s) => {
                        const isSel = selectedSize === s || (!selectedSize && s === sizes[0]);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={isSel ? "btn-primary" : "nav-tab"}
                            style={{
                              padding: "6px 14px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              borderRadius: "var(--radius-sm)",
                              border: isSel ? "none" : "1px solid var(--border-light)"
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Product Specifications */}
                {Object.keys(specs).length > 0 && (
                  <div
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px",
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      fontSize: "0.78rem",
                      marginBottom: "18px"
                    }}
                  >
                    {Object.entries(specs).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: "var(--text-muted)", textTransform: "capitalize", display: "block" }}>{k}:</span>
                        <strong style={{ color: "var(--text-main)" }}>{v}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features Checklist */}
                {features.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {features.map((feat, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.82rem" }}>
                          <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order & Checkout Form */}
              <div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Special Store Price</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-primary)" }}>
                        ${price.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span style={{ fontSize: "1rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontWeight: 800, padding: "4px 10px", borderRadius: "6px" }}>
                    IN STOCK • SHIPS FAST
                  </span>
                </div>

                <form onSubmit={handleOrderSubmit}>
                  <div className="form-group" style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="form-input"
                      value={buyerFullName}
                      onChange={(e) => setBuyerFullName(e.target.value)}
                      style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "10px" }}>
                    <input
                      type="email"
                      required
                      placeholder="Your Email for Order Tracking & Receipt"
                      className="form-input"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                    />
                  </div>

                  {productType === "physical" && (
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <input
                        type="text"
                        required
                        placeholder="Shipping Address (Street, City, Postal Code, Country)"
                        className="form-input"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "13px",
                      fontSize: "1rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    {loading ? (
                      <span>Placing Order & Generating Receipt...</span>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>Order Now • ${price.toFixed(2)} USD</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "12px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <ShieldCheck size={13} color="#10b981" /> 256-Bit Encrypted
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Truck size={13} color="var(--color-primary)" /> Insured Delivery
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
