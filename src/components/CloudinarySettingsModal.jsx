import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Cloud,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Trash2
} from "lucide-react";

export const CloudinarySettingsModal = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    cloudinaryConfig,
    setCloudinaryConfig,
    showToast
  } = usePins();

  const [cloudName, setCloudName] = useState(cloudinaryConfig.cloudName || "");
  const [uploadPreset, setUploadPreset] = useState(cloudinaryConfig.uploadPreset || "");

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCloudinaryConfig({
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim()
    });
    showToast("Cloudinary configuration saved successfully! 🚀", "success");
    setIsSettingsOpen(false);
  };

  const handleClear = () => {
    setCloudName("");
    setUploadPreset("");
    setCloudinaryConfig({ cloudName: "", uploadPreset: "" });
    showToast("Cloudinary settings reset.", "info");
  };

  const isConnected = Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="modal-container"
        style={{ width: "100%", maxWidth: "560px", padding: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsSettingsOpen(false)}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px"
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "rgba(0, 229, 255, 0.15)",
              color: "#00e5ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Cloud size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>
              Cloudinary Storage Setup
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Connect your Cloudinary media backend for direct image uploads
            </p>
          </div>
        </div>

        {/* Current status pill */}
        <div
          style={{
            background: isConnected
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(230, 0, 35, 0.1)",
            border: `1px solid ${
              isConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(230, 0, 35, 0.3)"
            }`,
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            fontSize: "0.9rem"
          }}
        >
          {isConnected ? (
            <CheckCircle size={20} color="#10b981" />
          ) : (
            <HelpCircle size={20} color="var(--color-primary)" />
          )}
          <div>
            <strong>Status: </strong>
            {isConnected ? (
              <span style={{ color: "#10b981", fontWeight: 700 }}>
                Connected to Cloudinary ({cloudinaryConfig.cloudName})
              </span>
            ) : (
              <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                Not configured (Using local preview fallback)
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            lineHeight: 1.5
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Zap size={15} color="#eab308" /> How to get Cloudinary Keys (Free):
          </div>
          <ol style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>
              Log in to your free account at{" "}
              <a
                href="https://cloudinary.com/users/register_free"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-accent-cyan)", textDecoration: "underline" }}
              >
                cloudinary.com <ExternalLink size={12} style={{ display: "inline" }} />
              </a>
            </li>
            <li>Copy your <strong>Cloud Name</strong> from the dashboard header.</li>
            <li>
              Go to <strong>Settings ⚙️ &gt; Upload &gt; Add upload preset</strong>.
            </li>
            <li>Set <em>Signing Mode</em> to <strong>Unsigned</strong> and click Save.</li>
            <li>Copy the <strong>Upload Preset Name</strong> and paste below!</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Cloudinary Cloud Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. dxyz123abc"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unsigned Upload Preset Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. pincloud_preset"
              value={uploadPreset}
              onChange={(e) => setUploadPreset(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px"
            }}
          >
            {isConnected ? (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Trash2 size={16} />
                <span>Disconnect</span>
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="nav-tab"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "10px 24px" }}
              >
                <ShieldCheck size={18} />
                <span>Save Credentials</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
