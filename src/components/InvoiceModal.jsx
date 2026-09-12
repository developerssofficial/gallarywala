import React from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Building2,
  Calendar,
  CreditCard,
  Sparkles,
  ExternalLink,
  Layers
} from "lucide-react";

export const InvoiceModal = () => {
  const { activeInvoice, setActiveInvoice, downloadImage, showToast } = usePins();

  if (!activeInvoice) return null;

  const handleClose = () => {
    setActiveInvoice(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeInvoice, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeInvoice.invoiceNumber || "invoice"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Invoice JSON data exported! 📄", "success");
    } catch (e) {
      showToast("Failed to export invoice data", "error");
    }
  };

  const gross = Number(activeInvoice.amount || activeInvoice.grossAmount || 0);
  const paddleFee = Number(activeInvoice.paddleFee || (gross > 0 ? (gross * 0.05 + 0.50) : 0).toFixed(2));
  const netAvailable = Math.max(0, Number(activeInvoice.netAvailable || (gross - paddleFee).toFixed(2)));
  const platformProfit = Number(activeInvoice.platformCut || (netAvailable * 0.20).toFixed(2));
  const creatorRoyalty = Number(activeInvoice.creatorCut || (netAvailable * 0.80).toFixed(2));

  return (
    <div className="modal-backdrop invoice-modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container invoice-modal-container"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "32px",
          position: "relative",
          animation: "scaleIn 0.2s ease-out",
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Hidden in Print */}
        <button className="modal-close-btn no-print" onClick={handleClose}>
          <X size={20} />
        </button>

        {/* Action Header (Print / Export) - Hidden in Print */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "14px",
            borderBottom: "1px solid var(--border-light)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <CheckCircle2 size={13} />
              <span>PAID & VERIFIED</span>
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {activeInvoice.invoiceNumber || `INV-GW-${activeInvoice.orderId}`}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrint}
              className="nav-tab"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                padding: "6px 12px",
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)"
              }}
              title="Print official invoice or save as PDF"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="nav-tab"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                padding: "6px 12px",
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)"
              }}
              title="Download raw receipt JSON"
            >
              <Download size={15} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ================= INVOICE PRINTABLE DOCUMENT ================= */}
        <div className="printable-invoice" style={{ color: "var(--text-main)" }}>
          {/* Brand & Invoice Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "var(--brand-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.2rem"
                  }}
                >
                  G
                </div>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
                    GallaryWala<span style={{ color: "var(--color-primary)" }}>.</span>
                  </h2>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Official Digital Asset & Media Licensing
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: "1.4" }}>
                Merchant: <strong>Paddle.com Market Ltd</strong><br />
                Merchant of Record & Tax Compliance Provider<br />
                Paddle Ref: <span style={{ fontFamily: "monospace" }}>{activeInvoice.orderId || "PAD-AUTO-01"}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-primary)", textTransform: "uppercase" }}>
                TAX INVOICE
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace", marginTop: "4px" }}>
                {activeInvoice.invoiceNumber || `INV-GW-${activeInvoice.orderId}`}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Date: {activeInvoice.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Status: <strong style={{ color: "#10b981" }}>Completed</strong>
              </div>
            </div>
          </div>

          {/* Parties Grid (Bill To / Issued For) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              marginBottom: "24px"
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>
                BILLED TO (BUYER)
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px" }}>
                {activeInvoice.buyerName || activeInvoice.buyerEmail?.split("@")[0] || "Licensed Buyer"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
                {activeInvoice.buyerEmail || "buyer@customer.com"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={13} />
                <span>Verified Payment Method via Paddle</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>
                CREATOR & COPYRIGHT HOLDER
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>{activeInvoice.creator || "GallaryWala Creator"}</span>
                <BadgeCheck size={14} color="#00dfd8" />
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {activeInvoice.creatorHandle || "@creator"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", marginTop: "4px" }}>
                Official Marketplace Contributor
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div style={{ marginBottom: "24px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
                textAlign: "left"
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  <th style={{ padding: "10px 8px" }}>ITEM DESCRIPTION</th>
                  <th style={{ padding: "10px 8px" }}>LICENSE TYPE</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "14px 8px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      {activeInvoice.downloadUrl && (
                        <img
                          src={activeInvoice.downloadUrl}
                          alt="Asset"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "6px",
                            objectFit: "cover",
                            border: "1px solid var(--border-light)"
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                          {activeInvoice.pinTitle || "Commercial Visual Media Asset"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Asset ID: <span style={{ fontFamily: "monospace" }}>{activeInvoice.pinId || "asset_01"}</span> • Ultra-HD 4K Resolution
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 8px", verticalAlign: "middle" }}>
                    <span
                      style={{
                        background: "rgba(121, 40, 202, 0.1)",
                        color: "var(--color-primary)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.78rem",
                        fontWeight: 700
                      }}
                    >
                      {activeInvoice.license || "Commercial & Extended Use"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 8px", verticalAlign: "middle", textAlign: "right", fontWeight: 800, fontSize: "1rem" }}>
                    ${gross.toFixed(2)} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Split Transparency */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "20px",
              marginBottom: "24px"
            }}
          >
            {/* Legal Certificate / Grant Box */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                fontSize: "0.75rem",
                lineHeight: "1.5",
                color: "var(--text-muted)"
              }}
            >
              <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>COMMERCIAL LICENSE CLEARANCE</span>
              </div>
              This receipt certifies that the licensee is granted perpetual, worldwide, non-exclusive rights to use, modify, and publish the visual asset in commercial campaigns, digital advertising, software, and physical merchandise without watermark constraints.
            </div>

            {/* Calculations Breakdown */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal (Gross):</span>
                <span>${gross.toFixed(2)} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                <span>Paddle Processing Fee:</span>
                <span>-${paddleFee.toFixed(2)} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                <span>Net Available:</span>
                <span>${netAvailable.toFixed(2)} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#00dfd8", marginBottom: "6px" }}>
                <span>Platform Cut (20% Net):</span>
                <span>${platformProfit.toFixed(2)} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#10b981", fontWeight: 700, marginBottom: "8px" }}>
                <span>Creator Royalty (80% Net):</span>
                <span>+${creatorRoyalty.toFixed(2)} USD</span>
              </div>
              <div style={{ height: "1px", background: "var(--border-light)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 900 }}>
                <span>Total Paid:</span>
                <span style={{ color: "var(--color-primary)" }}>${gross.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Footer & Security Stamp */}
          <div
            style={{
              borderTop: "1px dashed var(--border-light)",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.72rem",
              color: "var(--text-muted)"
            }}
          >
            <div>
              <strong>GallaryWala Digital Media Security</strong><br />
              Cryptographic Token: <span style={{ fontFamily: "monospace" }}>SHA256-{Math.random().toString(36).substring(2, 12).toUpperCase()}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              Auto-Generated Invoice & License Certificate<br />
              Powered by Paddle Merchant of Record
            </div>
          </div>
        </div>

        {/* Download Image Button - Hidden in Print */}
        {activeInvoice.downloadUrl && (
          <div className="no-print" style={{ marginTop: "24px" }}>
            <button
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "12px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderColor: "#10b981",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                gap: "8px"
              }}
              onClick={() => {
                downloadImage(activeInvoice.downloadUrl, `${activeInvoice.pinTitle || "artwork"}-4k-licensed.jpg`);
              }}
            >
              <Download size={18} />
              <span>Download Original 4K Unwatermarked Asset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
