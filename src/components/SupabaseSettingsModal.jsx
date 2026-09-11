import React, { useState } from "react";
import { usePins } from "../context/PinContext";
import {
  X,
  Database,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code
} from "lucide-react";
import { SUPABASE_SQL_SCHEMA } from "../services/supabase";

export const SupabaseSettingsModal = () => {
  const {
    isSupabaseSettingsOpen,
    setIsSupabaseSettingsOpen,
    supabaseConfig,
    updateSupabaseCredentials,
    showToast,
    isSupabaseConfigured
  } = usePins();

  const [url, setUrl] = useState(supabaseConfig.url || "");
  const [anonKey, setAnonKey] = useState(supabaseConfig.key || "");
  const [copied, setCopied] = useState(false);

  if (!isSupabaseSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateSupabaseCredentials(url.trim(), anonKey.trim());
    setIsSupabaseSettingsOpen(false);
  };

  const handleCopySQL = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopied(true);
      showToast("SQL Schema copied to clipboard! 📋", "success");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsSupabaseSettingsOpen(false)}
    >
      <div
        className="modal-container"
        style={{ width: "100%", maxWidth: "600px", padding: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsSupabaseSettingsOpen(false)}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Database size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>
              Supabase Database & Auth Setup
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Connect your Supabase project for persistent user accounts and images table
            </p>
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            background: isSupabaseConfigured
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(245, 158, 11, 0.1)",
            border: `1px solid ${
              isSupabaseConfigured ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"
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
          {isSupabaseConfigured ? (
            <CheckCircle size={20} color="#10b981" />
          ) : (
            <Zap size={20} color="#f59e0b" />
          )}
          <div>
            <strong>Status: </strong>
            {isSupabaseConfigured ? (
              <span style={{ color: "#10b981", fontWeight: 700 }}>
                Supabase Connected
              </span>
            ) : (
              <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                Not Configured (Using Local Storage)
              </span>
            )}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Supabase Project URL *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://your-project-ref.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supabase Anon Public API Key *</label>
            <input
              type="text"
              className="form-input"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              required
            />
          </div>

          {/* SQL Table schema copy button */}
          <div
            style={{
              background: "var(--bg-surface)",
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                Supabase SQL Table Schema
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Run this in Supabase &gt; SQL Editor to create the <code>images</code> table
              </div>
            </div>
            <button
              type="button"
              className="icon-btn"
              style={{ width: "auto", padding: "6px 14px", borderRadius: "var(--radius-sm)", gap: "6px" }}
              onClick={handleCopySQL}
            >
              <Copy size={14} />
              <span>{copied ? "Copied!" : "Copy SQL"}</span>
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="nav-tab"
              onClick={() => setIsSupabaseSettingsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "10px 24px" }}
            >
              <ShieldCheck size={18} />
              <span>Save & Connect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
