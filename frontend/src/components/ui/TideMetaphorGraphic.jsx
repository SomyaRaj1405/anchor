import React from "react";
import { AnchorLogo } from "./AnchorBrand";
import { Waves, Shield, AlertTriangle, TrendingUp, Compass, ArrowDown } from "lucide-react";

export default function TideMetaphorGraphic() {
  return (
    <div className="tide-graphic-card">
      <div className="tide-card-glow" />

      <div className="tide-graphic-header">
        <div className="tide-header-left">
          <span className="tide-eyebrow">MARITIME DOCTRINE</span>
          <h3 className="tide-title">The Tide, The Reef & The Anchor</h3>
        </div>
        <div className="tide-status-pill">
          <Compass size={14} className="tide-compass-icon" />
          <span>EVIDENCE-GROUNDED FRAMEWORK</span>
        </div>
      </div>

      <p className="tide-description">
        In booming hiring markets, candidate career gaps pass unnoticed. When the economic tide recedes, 
        algorithmic filters penalize breaks by 49%. <strong>Anchor</strong> establishes firm seabed footing 
        with peer-reviewed correspondence audit methods.
      </p>

      {/* Three Pillars: Low Tide, Shallow Waters, Deep Anchor */}
      <div className="tide-pillars-grid">
        {/* Pillar 1: Low Tide Hazard */}
        <div className="tide-pillar-card hazard">
          <div className="pillar-waterline low-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">01. THE LOW TIDE</span>
            <AlertTriangle size={16} className="pillar-icon hazard" />
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat hazard">-49%</span>
            <span className="pillar-stat-label">CALLBACK PENALTY</span>
          </div>
          <h4 className="pillar-heading">Chronological Date Scrutiny</h4>
          <p className="pillar-text">
            When recruiters scan chronological resume dates, career gaps immediately trigger automated friction 
            and ungrounded bias (EV-001 empirical audit in India).
          </p>
        </div>

        {/* Pillar 2: Shallow Water Illusion */}
        <div className="tide-pillar-card trap">
          <div className="pillar-waterline trap-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">02. SHALLOW WATERS</span>
            <Waves size={16} className="pillar-icon trap" />
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat trap">0%</span>
            <span className="pillar-stat-label">STATISTICAL LIFT</span>
          </div>
          <h4 className="pillar-heading">The Certificate Illusion</h4>
          <p className="pillar-text">
            Field audits proved adding generic online certificates during a career break yields 
            zero statistically significant increase in employer callbacks.
          </p>
        </div>

        {/* Pillar 3: The Ocean Anchor */}
        <div className="tide-pillar-card secure">
          <div className="pillar-waterline secure-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">03. THE ANCHOR</span>
            <div className="pillar-anchor-emblem">
              <AnchorLogo size={24} animated={false} />
            </div>
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat secure">+15%</span>
            <span className="pillar-stat-label">MEASURED CALLBACK GAIN</span>
          </div>
          <h4 className="pillar-heading">Duration-Worked Grounding</h4>
          <p className="pillar-text">
            Reframing resumes to show cumulative tenure duration instead of calendar months holds fast against 
            bias, yielding +15% more callbacks in controlled field trials (EV-002 UK audit).
          </p>
        </div>
      </div>

      {/* Marine Wave Footnote */}
      <div className="tide-ocean-strip">
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="tide-wave-svg">
          <path
            d="M0 24 C 150 42 300 6 450 24 C 600 42 750 6 900 24 C 1050 42 1125 12 1200 24 L 1200 48 L 0 48 Z"
            fill="rgba(0, 180, 216, 0.08)"
          />
          <path
            d="M0 32 C 180 16 360 44 540 32 C 720 16 900 44 1080 32 L 1200 48 L 0 48 Z"
            fill="rgba(0, 242, 254, 0.05)"
          />
        </svg>
      </div>
    </div>
  );
}
