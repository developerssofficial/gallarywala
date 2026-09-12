import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  ShieldAlert,
  Mail,
  Copy,
  Check,
  Send,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Info
} from "lucide-react";

export const ReportModal = () => {
  const { reportingPin, setReportingPin, currentUser, showToast } = usePins();

  const [reportType, setReportType] = useState("copyright_owner");
  const [claimantName, setClaimantName] = useState(currentUser?.user_metadata?.full_name || "");
  const [claimantEmail, setClaimantEmail] = useState(currentUser?.email || "");
  const [originalWorkUrl, setOriginalWorkUrl] = useState("");
  const [evidenceDetails, setEvidenceDetails] = useState("");
  const [isPerjuryDeclared, setIsPerjuryDeclared] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!reportingPin) return null;

  const targetEmail = "xparrowdev@gmail.com";
  const pinTitle = reportingPin.title || "Untitled Artwork";
  const pinId = reportingPin.id || "unknown";
  const pinUrl = window.location.origin + "/?pin=" + pinId;
  const pinImageUrl = reportingPin.imageUrl || "";
  const authorName = reportingPin.author?.name || "Unknown";
  const authorHandle = reportingPin.author?.username || "@creator";

  // Build Formatted Legal DMCA / Copyright Report Text
  const emailSubject = `[GallaryWala DMCA Claim] Asset #${pinId} - "${pinTitle}"`;
  const emailBody = `OFFICIAL COPYRIGHT OWNERSHIP INFRINGEMENT REPORT & TAKEDOWN NOTICE
----------------------------------------------------------------------
To: GallaryWala Legal & Trust Safety Team (xparrowdev@gmail.com)

1. DISPUTED CONTENT ON GALLARYWALA:
- Asset Title: ${pinTitle}
- Asset ID: ${pinId}
- Current Author/Uploader: ${authorName} (${authorHandle})
- GallaryWala URL: ${pinUrl}
- Image Direct Link: ${pinImageUrl}

2. CLAIMANT & COPYRIGHT OWNER INFORMATION:
- Legal Full Name: ${claimantName || "Not provided"}
- Contact Email: ${claimantEmail || "Not provided"}
- Report Category: ${reportType}

3. PROOF OF ORIGINAL WORK / OWNERSHIP:
- Original Source/Portfolio URL: ${originalWorkUrl || "Not provided"}
- Evidence / Creation Details:
${evidenceDetails || "Please inspect the original source link provided above."}

4. LEGAL DECLARATION:
I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law. I declare under penalty of perjury that the information in this notice is accurate, and that I am the copyright owner or authorized to act on behalf of the owner.

Date Submitted: ${new Date().toUTCString()}
----------------------------------------------------------------------`;

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!claimantEmail.trim() || !claimantName.trim()) {
      showToast("Please provide your name and contact email.", "warning");
      return;
    }
    if (!evidenceDetails.trim() && !originalWorkUrl.trim()) {
      showToast("Please provide proof details or original work URL.", "warning");
      return;
    }
    if (!isPerjuryDeclared) {
      showToast("Please confirm the legal declaration checkbox.", "warning");
      return;
    }

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;

    showToast("Opening email client to send DMCA report to xparrowdev@gmail.com 📧", "success");
    setTimeout(() => {
      setReportingPin(null);
    }, 1500);
  };

  const handleCopyPacket = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailBody);
      setCopied(true);
      showToast("DMCA report packet copied to clipboard! 📋", "success");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setReportingPin(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container"
        style={{
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          position: "relative",
          animation: "scaleIn 0.2s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-md)",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(239, 68, 68, 0.25)"
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
              Report Copyright & Ownership Claim
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
              Submit legal ownership proof to <strong style={{ color: "var(--color-primary)" }}>{targetEmail}</strong>
            </p>
          </div>
        </div>

        {/* Target Asset Card */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            background: "var(--bg-surface)",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            marginBottom: "18px"
          }}
        >
          {reportingPin.imageUrl && (
            <img
              src={reportingPin.imageUrl}
              alt={pinTitle}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "6px",
                objectFit: "cover",
                border: "1px solid var(--border-light)"
              }}
            />
          )}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {pinTitle}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Reported Uploader: <strong style={{ color: "var(--text-main)" }}>{authorName}</strong> ({authorHandle})
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px", fontFamily: "monospace" }}>
              ID: {pinId}
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSendEmail}>
          {/* Reason Selection */}
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>Nature of Complaint</label>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ fontSize: "0.85rem", padding: "8px 12px" }}
            >
              <option value="copyright_owner">I am the original copyright owner / artist (DMCA Claim)</option>
              <option value="commercial_unauthorized">Unauthorized commercial sale / pricing of my artwork</option>
              <option value="trademark_plagiarism">Trademark infringement / Art plagiarism</option>
              <option value="inappropriate_content">Inappropriate / Harmful / Prohibited content</option>
            </select>
          </div>

          {/* Name & Email Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div>
              <label className="form-label" style={{ fontSize: "0.8rem" }}>Your Full Legal Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: "0.8rem" }}>Your Contact Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Link to Original Proof */}
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>
              Link to Original Work / Portfolio Proof (URL)
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://artstation.com/your-art or portfolio link"
              value={originalWorkUrl}
              onChange={(e) => setOriginalWorkUrl(e.target.value)}
            />
          </div>

          {/* Evidence Description */}
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>
              Proof & Detailed Description of Ownership
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Explain how and when you created this artwork, original creation dates, RAW/PSD availability, or registration details..."
              value={evidenceDetails}
              onChange={(e) => setEvidenceDetails(e.target.value)}
              required
            />
          </div>

          {/* Legal Perjury Declaration Checkbox */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
              marginBottom: "18px",
              fontSize: "0.78rem",
              lineHeight: "1.4"
            }}
          >
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isPerjuryDeclared}
                onChange={(e) => setIsPerjuryDeclared(e.target.checked)}
                style={{ marginTop: "2px", accentColor: "#ef4444" }}
                required
              />
              <span>
                I declare under penalty of perjury that I am the true copyright owner or authorized representative, and the information provided in this takedown request is accurate and complete.
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "12px",
                fontSize: "0.92rem",
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                borderColor: "#ef4444",
                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.35)",
                gap: "8px"
              }}
            >
              <Send size={16} />
              <span>Send Official Report Email</span>
            </button>

            <button
              type="button"
              className="nav-tab"
              onClick={handleCopyPacket}
              style={{
                padding: "12px 16px",
                fontSize: "0.85rem",
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              title="Copy formatted DMCA notice"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? "Copied" : "Copy Report"}</span>
            </button>
          </div>

          {/* Safety Notice */}
          <div
            style={{
              marginTop: "12px",
              textAlign: "center",
              fontSize: "0.74rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
          >
            <ShieldCheck size={13} color="#10b981" />
            <span>Reports sent to <strong>{targetEmail}</strong> are reviewed within 24 hours.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
