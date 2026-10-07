import React from "react";
import { AnchorLogo } from "./AnchorBrand";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export default function EvidenceFrameworkCard() {
  return (
    <div className="tide-graphic-card">
      <div className="tide-card-glow" />

      <div className="tide-graphic-header">
        <div className="tide-header-left">
          <span className="tide-eyebrow">EMPIRICAL AUDIT FRAMEWORK</span>
          <h3 className="tide-title">Three Core Findings from Correspondence Field Trials</h3>
        </div>
        <div className="tide-status-pill">
          <ShieldCheck size={14} className="tide-compass-icon" />
          <span>EVIDENCE-GROUNDED INTELLIGENCE</span>
        </div>
      </div>

      <p className="tide-description">
        Anchor separates genuine competency deficits from automated calendar screening penalties.
        Instead of generic upskilling assumptions, recommendations are grounded in <strong>24,894 verified resume correspondence audits</strong>.
      </p>

      {/* Three Pillars: Chronological Penalty, Certificate Null Effect, Duration Reframing */}
      <div className="tide-pillars-grid">
        {/* Pillar 1: Chronological Date Penalty */}
        <div className="tide-pillar-card hazard">
          <div className="pillar-waterline low-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">01. CALENDAR DATE BIAS</span>
            <AlertTriangle size={16} className="pillar-icon hazard" />
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat hazard">-49%</span>
            <span className="pillar-stat-label">CALLBACK PENALTY</span>
          </div>
          <h4 className="pillar-heading">Chronological Date Scrutiny</h4>
          <p className="pillar-text">
            When recruiters scan chronological resume dates, career gaps trigger automated friction 
            and ungrounded bias (EV-001 empirical audit across 15,872 private sector applications).
          </p>
        </div>

        {/* Pillar 2: Certificate Null Effect */}
        <div className="tide-pillar-card trap">
          <div className="pillar-waterline trap-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">02. CERTIFICATE CONTROL</span>
            <FileText size={16} className="pillar-icon trap" />
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat trap">0%</span>
            <span className="pillar-stat-label">STATISTICAL LIFT</span>
          </div>
          <h4 className="pillar-heading">Generic Certificate Reality</h4>
          <p className="pillar-text">
            Field audits proved adding generic online upskilling certificates during a career break yields 
            zero statistically significant increase in employer callbacks.
          </p>
        </div>

        {/* Pillar 3: Duration-Worked Reframing */}
        <div className="tide-pillar-card secure">
          <div className="pillar-waterline secure-water" />
          <div className="pillar-header">
            <span className="pillar-step-badge">03. DURATION FRAMING</span>
            <div className="pillar-anchor-emblem">
              <AnchorLogo size={20} />
            </div>
          </div>
          <div className="pillar-metric-box">
            <span className="pillar-stat secure">+15%</span>
            <span className="pillar-stat-label">MEASURED CALLBACK GAIN</span>
          </div>
          <h4 className="pillar-heading">Duration-Worked Reframing</h4>
          <p className="pillar-text">
            Reframing resumes to show cumulative tenure duration instead of calendar months directly overcomes 
            break penalties, yielding +15% more callbacks in controlled field trials (EV-002 audit).
          </p>
        </div>
      </div>

      {/* Ocean Strip Decorative Waterline */}
      <div className="tide-ocean-strip">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="tide-wave-svg">
          <path
            d="M0 20 C 150 35 300 5 450 20 C 600 35 750 5 900 20 C 1050 35 1125 10 1200 20 L 1200 40 L 0 40 Z"
            fill="rgba(0, 180, 216, 0.08)"
          />
          <path
            d="M0 26 C 180 12 360 36 540 26 C 720 12 900 36 1080 26 L 1200 40 L 0 40 Z"
            fill="rgba(0, 242, 254, 0.05)"
          />
        </svg>
      </div>
    </div>
  );
}
