import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GallaryWala Application Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem("gallarywala_pins_v4");
      localStorage.removeItem("gallarywala_boards_v4");
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0b0e",
            color: "#f3f4f6",
            padding: "24px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px" }}>
            Something went wrong
          </h2>
          <p
            style={{
              color: "#9ca3af",
              maxWidth: "460px",
              marginBottom: "24px",
              fontSize: "0.95rem",
              lineHeight: 1.5
            }}
          >
            An unexpected error was intercepted. Click below to reload the gallery smoothly.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "linear-gradient(135deg, #7928ca 0%, #ff0080 100%)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RefreshCw size={16} />
              <span>Reload Page</span>
            </button>
            <button
              onClick={this.handleReset}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#f3f4f6",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "12px 20px",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Clear Cache & Reset
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
