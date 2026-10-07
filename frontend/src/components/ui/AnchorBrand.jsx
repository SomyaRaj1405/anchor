import React from "react";

export function AnchorLogo({ size = 16, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ color: "var(--color-accent)", display: "block" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5v5.3" />
      <path d="M9 7.2h6" />
      <path d="M12 7.8v8.3" />
      <path d="M7 13.3c0 3.1 2.3 5.2 5 5.2s5-2.1 5-5.2" />
      <path d="M8.4 13.8 6.5 16.5" />
      <path d="M15.6 13.8 17.5 16.5" />
      <circle cx="12" cy="2.9" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function AnchorBrand({ size = 18 }) {
  return (
    <div className="anchor-brand-header">
      <AnchorLogo size={size} />
      <span className="anchor-brand-title">Anchor</span>
    </div>
  );
}
