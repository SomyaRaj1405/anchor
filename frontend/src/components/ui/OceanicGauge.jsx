import React from "react";

export default function OceanicGauge({
  percentage = 0,
  label = "",
  sublabel = "",
  delta = null,
  color = "var(--ocean-cyan)",
  gradientId = "oceanGaugeGrad",
  size = 110,
  strokeWidth = 9,
  badge = null,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;

  return (
    <div className="oceanic-gauge-card">
      <div className="oceanic-gauge-visual" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="gauge-svg">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
            <linearGradient id="gaugeGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gaugeAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gaugeRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id={`gaugeGlow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0, 180, 216, 0.12)"
            strokeWidth={strokeWidth}
          />

          {/* Animated Meter Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
            filter={`url(#gaugeGlow-${gradientId})`}
          />
        </svg>

        {/* Center Percentage Value Display */}
        <div className="gauge-center-content">
          <span className="gauge-pct-value">{percentage}%</span>
          {delta && <span className="gauge-delta-pill">{delta}</span>}
        </div>
      </div>

      <div className="oceanic-gauge-info">
        {badge && <span className="gauge-badge">{badge}</span>}
        <h4 className="gauge-label">{label}</h4>
        {sublabel && <p className="gauge-sublabel">{sublabel}</p>}
      </div>
    </div>
  );
}
