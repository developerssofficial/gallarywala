import React from "react";

/**
 * Official Scalloped Blue Tick Verified Badge
 * Matches the official verified badge style (12-lobed seal with crisp checkmark)
 */
export const VerifiedBadge = ({ size = 15, className = "", title = "Verified Creator" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`verified-badge-icon ${className}`}
      title={title}
      aria-label={title}
      style={{
        display: "inline-block",
        flexShrink: 0,
        verticalAlign: "middle",
        marginLeft: 4,
        transform: "translateY(-1px)",
        filter: "drop-shadow(0 1px 3px rgba(0, 149, 246, 0.4))"
      }}
    >
      {/* Official 12-point scalloped seal */}
      <path
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
        fill="#0095f6"
      />
      {/* Clean White Checkmark */}
      <path
        d="M10.2 16.2l-3.6-3.6 1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7z"
        fill="#ffffff"
      />
    </svg>
  );
};
