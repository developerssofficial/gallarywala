import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  Lock,
  DollarSign,
  FileText,
  BadgeCheck,
  ArrowRight,
  ExternalLink,
  Printer,
  BadgePercent
} from "lucide-react";
import confetti from "canvas-confetti";
import { calculateRevenueSplit } from "../services/paddle";

export const PurchaseCheckoutModal = () => {
  const {
    checkoutPin,
    setCheckoutPin,
    currentUser,
    handleCompletePurchase,
    downloadImage,
    setActiveInvoice,
    showToast
  } = usePins();

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [licenseType, setLicenseType] = useState("commercial"); // 'personal' | 'commercial'
  const [emailInput, setEmailInput] = useState(currentUser?.email || "");

  if (!checkoutPin) return null;

  const basePrice = Number(checkoutPin.price || 4.99);
  const finalPrice = licenseType === "commercial" ? basePrice : Math.max(1.99, Number((basePrice * 0.6).toFixed(2)));
  const split = calculateRevenueSplit(finalPrice);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast("Please enter an email address for receipt delivery.", "warning");
      return;
    }

    setLoading(true);

    // Simulate Paddle secure transaction
    setTimeout(() => {
      const invoiceNumber = `INV-GW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId: "GW-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        invoiceNumber,
        pinId: checkoutPin.id,
        pinTitle: checkoutPin.title || "Commercial Asset",
        amount: finalPrice,
        grossAmount: split.gross,
        paddleFee: split.paddleFee,
        netAvailable: split.netAvailable,
        platformCut: split.platformCut,
        creatorCut: split.creatorCut,
        currency: "USD",
        license: licenseType === "commercial" ? "Commercial & Extended Use" : "Personal Use Only",
        buyerName: currentUser?.user_metadata?.full_name || emailInput.split("@")[0],
        buyerEmail: emailInput.trim(),
        creator: checkoutPin.author?.name || "Creator",
        creatorHandle: checkoutPin.author?.username || "@creator",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        downloadUrl: checkoutPin.imageUrl,
        timestamp: new Date().toISOString()
      };

      const completed = handleCompletePurchase(checkoutPin.id, orderData);
      setSuccessOrder(completed || orderData);
      setLoading(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  const handleClose = () => {
    setCheckoutPin(null);
    setSuccessOrder(null);
  };

  const handleOpenInvoice = () => {
    if (successOrder) {
      setActiveInvoice(successOrder);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container"
        style={{
          width: "100%",
          maxWidth: "580px",
          padding: "32px",
          position: "relative",
          animation: "scaleIn 0.2s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {!successOrder ? (
          /* ================= STEP 1: CHECKOUT VIEW ================= */
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--brand-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "var(--brand-glow)"
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                  Unlock Original 4K Asset
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
                  Powered by Paddle Payment Gateway & Auto-Invoicing
                </p>
              </div>
            </div>

            {/* Asset Preview Card */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                background: "var(--bg-surface)",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                marginBottom: "20px"
              }}
            >
              <img
                src={checkoutPin.imageUrl}
                alt={checkoutPin.title}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "var(--radius-sm)",
                  objectFit: "cover"
                }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {checkoutPin.title || "Untitled Artwork"}
                </h4>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "6px" }}>
                  By <strong style={{ color: "var(--color-primary)" }}>{checkoutPin.author?.name || "Creator"}</strong> ({checkoutPin.author?.username || "@creator"})
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      background: "rgba(255, 0, 128, 0.12)",
                      color: "#ff0080",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}
                  >
                    Original Ultra-HD
                  </span>
                  <span
                    style={{
                      background: "rgba(121, 40, 202, 0.12)",
                      color: "var(--color-primary)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}
                  >
                    No Watermark
                  </span>
                </div>
              </div>
            </div>

            {/* License Selection */}
            <div className="form-group" style={{ marginBottom: "18px" }}>
              <label className="form-label">Select License Type</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div
                  onClick={() => setLicenseType("commercial")}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: licenseType === "commercial" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                    background: licenseType === "commercial" ? "rgba(121, 40, 202, 0.08)" : "var(--bg-surface)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Commercial</span>
                    <span style={{ fontWeight: 800, color: "var(--color-primary)" }}>${basePrice.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Web, marketing, merchandise & client projects
                  </div>
                </div>

                <div
                  onClick={() => setLicenseType("personal")}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: licenseType === "personal" ? "2px solid var(--color-primary)" : "1px solid var(--border-light)",
                    background: licenseType === "personal" ? "rgba(121, 40, 202, 0.08)" : "var(--bg-surface)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Personal</span>
                    <span style={{ fontWeight: 800, color: "var(--text-muted)" }}>
                      ${Math.max(1.99, Number((basePrice * 0.6).toFixed(2))).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Non-commercial personal wallpapers & displays
                  </div>
                </div>
              </div>
            </div>

            {/* Email / Delivery Receipt */}
            <form onSubmit={handlePay}>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">Email for Instant Receipt & Auto-Invoice</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              {/* Price & Fee Summary */}
              <div
                style={{
                  background: "var(--bg-surface)",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  marginBottom: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Item Gross Price:</span>
                  <span>${finalPrice.toFixed(2)} USD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <span>Paddle Processing Fee:</span>
                  <span>-${split.paddleFee.toFixed(2)} USD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Creator Royalty (80% net):</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>+${split.creatorCut.toFixed(2)} USD</span>
                </div>
                <div style={{ height: "1px", background: "var(--border-light)", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800 }}>
                  <span>Total Due:</span>
                  <span style={{ color: "var(--color-primary)" }}>${finalPrice.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "14px",
                  fontSize: "1rem",
                  gap: "10px"
                }}
                disabled={loading}
              >
                <CreditCard size={18} />
                <span>{loading ? "Processing Secure Checkout..." : `Pay $${finalPrice.toFixed(2)} with Paddle`}</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "12px",
                  color: "var(--text-muted)",
                  fontSize: "0.78rem"
                }}
              >
                <ShieldCheck size={14} style={{ color: "#10b981" }} />
                <span>256-bit encrypted checkout • Paddle Merchant of Record • Auto-Tax Invoice</span>
              </div>
            </form>
          </div>
        ) : (
          /* ================= STEP 2: PURCHASE SUCCESS & INSTANT DOWNLOAD ================= */
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)"
              }}
            >
              <BadgeCheck size={36} />
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "6px" }}>
              Payment Successful! 🎉
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "20px" }}>
              Your commercial asset has been unlocked and verified.
            </p>

            {/* Official License Certificate Card */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "18px",
                textAlign: "left",
                marginBottom: "24px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Invoice / Receipt #:</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, fontFamily: "monospace", color: "var(--color-primary)" }}>{successOrder.invoiceNumber || successOrder.orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>License Granted:</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>{successOrder.license}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Author / Creator:</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{successOrder.creator} ({successOrder.creatorHandle})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Receipt Delivered To:</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{successOrder.buyerEmail}</span>
              </div>
            </div>

            {/* Action Buttons: Download + View Official Invoice */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "14px",
                  fontSize: "1rem",
                  gap: "10px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderColor: "#10b981",
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.35)"
                }}
                onClick={() => {
                  downloadImage(checkoutPin.imageUrl, `${checkoutPin.title || "artwork"}-unwatermarked-4k.png`);
                }}
              >
                <Download size={20} />
                <span>Download Original Unwatermarked 4K</span>
              </button>

              <button
                type="button"
                className="nav-tab"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "12px",
                  fontSize: "0.95rem",
                  gap: "8px",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontWeight: 700
                }}
                onClick={handleOpenInvoice}
              >
                <Printer size={18} />
                <span>View & Print Official Auto-Invoice</span>
              </button>
            </div>

            <button
              className="nav-tab"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleClose}
            >
              Close & Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

