import React, { useState, useEffect } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Store,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  Globe,
  Tag,
  Crown
} from "lucide-react";

export const EditStoreModal = () => {
  const {
    isEditStoreOpen,
    setIsEditStoreOpen,
    userStore,
    updateCreatorStore,
    upgradeStoreTier,
    showToast
  } = usePins();

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [category, setCategory] = useState("Streetwear Apparel");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (userStore) {
      setName(userStore.name || "");
      setHandle(userStore.handle ? userStore.handle.replace(/^@/, "") : "");
      setTagline(userStore.tagline || "");
      setBio(userStore.bio || "");
      setAnnouncement(userStore.announcement || "⚡ Worldwide Tracked Shipping • 100% Guaranteed Authenticity");
      setCategory(userStore.category || "Streetwear Apparel");
      setBannerUrl(userStore.bannerUrl || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=85");
      setLogoUrl(userStore.logoUrl || "");
      setInstagram(userStore.socialLinks?.instagram || "");
      setTwitter(userStore.socialLinks?.twitter || "");
      setYoutube(userStore.socialLinks?.youtube || "");
      setWebsite(userStore.socialLinks?.website || "");
    }
  }, [userStore, isEditStoreOpen]);

  if (!isEditStoreOpen || !userStore) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter a Store Name.", "warning");
      return;
    }

    updateCreatorStore({
      name: name.trim(),
      handle: handle.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      announcement: announcement.trim(),
      category,
      bannerUrl: bannerUrl.trim(),
      logoUrl: logoUrl.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(handle)}`,
      socialLinks: {
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        youtube: youtube.trim(),
        website: website.trim()
      }
    });

    setIsEditStoreOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsEditStoreOpen(false)} style={{ zIndex: 10030 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "680px",
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
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Shopify Visual Customizer
            </span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, margin: "2px 0 0 0", color: "#0f172a" }}>
              Customize Storefront & Branding
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditStoreOpen(false)}
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

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Store Name & Handle */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Store Handle / URL
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700 }}>
                    @
                  </span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 26px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.9rem",
                      background: "#f8fafc"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Announcement Bar text */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                Top Announcement Bar Notice
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="⚡ Free Worldwide Shipping on Orders Over $50"
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

            {/* Category & Tagline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                  Primary Category
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
                  Short Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Heavyweight Streetwear & Archival Prints"
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

            {/* Banner URL & Preview */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                Cover Banner Image URL
              </label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.88rem",
                    background: "#f8fafc"
                  }}
                />
                {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt="Banner Preview"
                    style={{ width: "60px", height: "36px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                  />
                )}
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                Store Logo / Avatar URL
              </label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://api.dicebear.com/..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.88rem",
                    background: "#f8fafc"
                  }}
                />
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                  />
                )}
              </div>
            </div>

            {/* Bio / Brand Story */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
                Store Bio & Brand Story
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your customers about your studio, materials, and creative vision..."
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

            {/* Social Links */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
                Social Channels & Links
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram profile URL"
                  style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}
                />
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="X / Twitter profile URL"
                  style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}
                />
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="YouTube channel URL"
                  style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}
                />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Personal website URL"
                  style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setIsEditStoreOpen(false)}
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
                Save Storefront
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
