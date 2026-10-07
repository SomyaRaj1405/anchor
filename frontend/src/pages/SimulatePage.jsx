import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  ExternalLink,
  Waves,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { getSimulation, getSamples } from "../api/client";
import OceanicGauge from "../components/ui/OceanicGauge";
import { AnchorLogo } from "../components/ui/AnchorBrand";

export default function SimulatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [samples, setSamples] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    searchParams.get("candidate") || "sample-a"
  );

  // Interactive Simulation Parameters
  const [gapYears, setGapYears] = useState(3);
  const [includeCertificate, setIncludeCertificate] = useState(false);
  const [includeAvailability, setIncludeAvailability] = useState(true);

  // Execution state
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    getSamples().then((data) => {
      setSamples(data?.profiles || []);
    });
  }, []);

  // Debounced simulation effect
  useEffect(() => {
    setSimulating(true);
    const timer = setTimeout(async () => {
      const data = await getSimulation({
        candidateId: selectedCandidateId,
        gapYears,
        includeCertificate,
        includeAvailability,
      });
      setResult(data);
      setSimulating(false);
      setHasRun(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [selectedCandidateId, gapYears, includeCertificate, includeAvailability, runKey]);

  const selectedCandidate = samples.find((s) => s.id === selectedCandidateId);

  return (
    <div className="anchor-page-wrapper">
      {/* Simulation Lab Header */}
      <div className="pg-header oceanic-lab-header">
        <div className="lab-header-left">
          <div className="pg-header-eyebrow">
            <Compass size={13} className="eyebrow-icon" />
            <span>MODELLED SCENARIO PROJECTION LAB</span>
          </div>
          <h1>Scenario Simulation Chamber</h1>
          <p className="pg-header-subtitle">
            Simulates candidate screening pass likelihood under alternative resume framing conventions,
            incorporating empirical audit penalties (EV-001 India, N=15,872) and duration reframing lifts (EV-002 UK, N=9,022).
          </p>
        </div>
        <div className="lab-header-badge">
          <span className="lab-badge-pulse" />
          <span>COEFFICIENT ENGINE // ONLINE</span>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="workflow-pipeline" style={{ marginBottom: 22 }}>
        <div className="pipeline-step completed">
          <div className="pipeline-circle">1</div>
          <span>Input Parameters</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className="pipeline-step completed">
          <div className="pipeline-circle">2</div>
          <span>Evidence Engine</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className="pipeline-step active">
          <div className="pipeline-circle">3</div>
          <span>Gauged Outcomes</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className="pipeline-step completed">
          <div className="pipeline-circle">4</div>
          <span>Evidence Trace</span>
        </div>
      </div>

      {/* Scenario Parameter Builder: High-End Console */}
      <div className="ocean-console-card" style={{ marginBottom: 24 }}>
        <div className="console-card-header">
          <div className="console-title-group">
            <span className="console-beacon" />
            <span className="section-label">TELEMETRY PARAMETER INSTRUMENTATION</span>
          </div>
          <span className="console-state-tag">ADAPTIVE RE-CALCULATION</span>
        </div>

        <div className="console-grid">
          {/* Candidate Dossier Selector */}
          <div className="console-field">
            <label className="console-field-label">Target Candidate Dossier</label>
            <select
              className="ocean-select"
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
            >
              {samples.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.id.toUpperCase()})
                </option>
              ))}
            </select>
            {selectedCandidate && (
              <div className="console-dossier-preview">
                <strong>{selectedCandidate.profile.industry}</strong> · {selectedCandidate.profile.location} · {selectedCandidate.profile.experience_years} yrs prior exp
              </div>
            )}
          </div>

          {/* Hiatus Duration Slider */}
          <div className="console-field">
            <div className="console-slider-header">
              <label className="console-field-label">
                Career Hiatus Duration
              </label>
              <span className="console-slider-val-tag">{gapYears} Years</span>
            </div>
            <div className="ocean-range-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={gapYears}
                onChange={(e) => setGapYears(Number(e.target.value))}
                className="ocean-slider"
              />
              <div className="ocean-slider-marks">
                <span>1 yr</span>
                <span className="mark-highlight">3 yrs (EV-001 cap)</span>
                <span>5 yrs</span>
              </div>
            </div>
          </div>

          {/* Upskilling Certificate Reality Toggle */}
          <div className="console-field">
            <label className="console-field-label">Upskilling Certificate (EV-001)</label>
            <label className="ocean-switch-label">
              <input
                type="checkbox"
                checked={includeCertificate}
                onChange={(e) => setIncludeCertificate(e.target.checked)}
                className="ocean-switch-input"
              />
              <span className="ocean-switch-slider" />
              <span className="ocean-switch-text">
                {includeCertificate ? "Certificate Appended" : "No Certificate"}
              </span>
            </label>
            <div className="console-field-hint warning">
              EV-001 audit found 0% statistically significant lift from generic certificates.
            </div>
          </div>

          {/* Availability Signaling Toggle */}
          <div className="console-field">
            <label className="console-field-label">Immediate Availability Signal</label>
            <label className="ocean-switch-label">
              <input
                type="checkbox"
                checked={includeAvailability}
                onChange={(e) => setIncludeAvailability(e.target.checked)}
                className="ocean-switch-input"
              />
              <span className="ocean-switch-slider" />
              <span className="ocean-switch-text">
                {includeAvailability ? "Active Signaling" : "Unstated"}
              </span>
            </label>
            <div className="console-field-hint success">
              Signals immediate deployability without delay.
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="console-toolbar">
          <button
            className="btn btn-ocean-primary"
            onClick={() => setRunKey((k) => k + 1)}
            disabled={simulating}
            id="btn-run-simulation"
          >
            {simulating ? (
              <>
                <div className="ocean-spinner-sm" />
                <span>Recalculating Modelled Projections...</span>
              </>
            ) : (
              <>
                <RotateCcw size={15} />
                <span>Re-simulate Projections</span>
              </>
            )}
          </button>
          <div className="console-toolbar-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>Harmonizes reference baseline rates with empirical EV-001 and EV-002 coefficients.</span>
          </div>
        </div>
      </div>

      {/* Simulation Results: Breathtaking Radial Percent Gauges */}
      {result && (
        <div style={{ opacity: simulating ? 0.6 : 1, transition: "opacity .2s" }}>
          <div className="section-label">PROJECTED SCREENING OUTCOMES // RADIAL GAUGES</div>
          <h2 className="section-title">Comparative Pass Likelihood Under Alternative Framing</h2>

          {/* 4 Radial Oceanic Percentage Gauges */}
          <div className="simulation-gauges-grid" style={{ marginBottom: 28 }}>
            {/* Version A: Baseline Chronological Dates */}
            <div className="sim-gauge-card version-a">
              <OceanicGauge
                percentage={result.versions.find((v) => v.id === "A")?.pass_likelihood_pct || 0}
                label="Version A: Chronological"
                sublabel={`Standard dates showing ${gapYears}-year hiatus`}
                badge="STANDARD RESUME"
                gradientId="gaugeVerAGrad"
                size={124}
              />
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag penalty">EV-001 BREAK PENALTY</span>
                <p className="gauge-ver-note">Exposes calendar break dates to automated filters.</p>
              </div>
            </div>

            {/* Version B: Duration Worked (+15% Lift) */}
            <div className="sim-gauge-card version-b">
              <OceanicGauge
                percentage={result.versions.find((v) => v.id === "B")?.pass_likelihood_pct || 0}
                label="Version B: Duration Framing"
                sublabel="Cumulative tenure duration (EV-002)"
                delta="+15% LIFT"
                badge="EV-002 PROVEN"
                gradientId="gaugeVerBGrad"
                size={124}
              />
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag lift">+15% MEASURED GAIN</span>
                <p className="gauge-ver-note">Replaces date scanning with verified tenure totals.</p>
              </div>
            </div>

            {/* Version C: Candidate-Optimized (Full Lift) */}
            <div className="sim-gauge-card version-c highlight">
              <div className="sim-gauge-card-halo" />
              <OceanicGauge
                percentage={result.versions.find((v) => v.id === "C")?.pass_likelihood_pct || 0}
                label="Version C: Candidate-Optimized"
                sublabel="Duration + cluster realignment + readiness"
                delta="OPTIMAL"
                badge="RECOMMENDED STRATEGY"
                gradientId="gaugeVerCGrad"
                size={124}
              />
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag optimal">HIGHEST PROJECTED PASS</span>
                <p className="gauge-ver-note">Combines duration framing with functional competency mapping.</p>
              </div>
            </div>

            {/* Empirical Control: Generic Certificate */}
            <div className="sim-gauge-card version-control">
              <OceanicGauge
                percentage={result.control_certificate.pass_likelihood_pct || 0}
                label="Control: + Generic Cert"
                sublabel="EV-001 empirical control arm"
                delta="0% LIFT"
                badge="EMPIRICAL CONTROL"
                gradientId="gaugeVerControlGrad"
                size={124}
              />
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag warning">NULL COEFFICIENT</span>
                <p className="gauge-ver-note">{result.control_certificate.note}</p>
              </div>
            </div>
          </div>

          {/* Deep Dive: Waterfall Driver Decomposition and Resume Text Transformation */}
          <div className="two-col" style={{ marginBottom: 28 }}>
            {/* Waterfall Drivers */}
            <div className="ocean-card">
              <div className="section-label">WATERFALL DRIVER DECOMPOSITION</div>
              <h3 style={{ fontSize: "16px", marginTop: 4, marginBottom: 14 }}>
                Decomposition of Version C Pass Likelihood
              </h3>
              <div className="waterfall-container">
                {(result.versions.find((v) => v.id === "C")?.drivers || []).map((driver, idx) => {
                  const val = driver.value_pct ?? driver.impact_pct ?? 0;
                  return (
                    <div key={idx} className="waterfall-driver-row">
                      <div className="waterfall-driver-left">
                        <span className="driver-bullet" />
                        <span className="driver-name">{driver.label}</span>
                      </div>
                      <div className="waterfall-driver-right">
                        <span
                          className={`driver-pct-badge ${
                            val > 0 ? "positive" : val < 0 ? "negative" : "neutral"
                          }`}
                        >
                          {val > 0 ? `+${val}%` : `${val}%`}
                        </span>
                        <div className="driver-track">
                          <div
                            className="driver-fill"
                            style={{
                              width: `${Math.min(Math.abs(val) * 1.5, 100)}%`,
                              background:
                                val > 0
                                  ? "linear-gradient(90deg, #00b4d8, #00f2fe)"
                                  : val < 0
                                  ? "linear-gradient(90deg, #ef4444, #f87171)"
                                  : "#6b7280",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resume Framing Transformation Preview */}
            <div className="ocean-card">
              <div className="section-label">RESUME TEXT TRANSFORMATION</div>
              <h3 style={{ fontSize: "16px", marginTop: 4, marginBottom: 14 }}>
                Chronological vs Duration Framing Excerpts
              </h3>
              <div className="resume-diff-box">
                <div className="diff-header chronological">
                  <span className="diff-tag danger">BEFORE: CHRONOLOGICAL (VERSION A)</span>
                  <span className="diff-note">Exposes 3-year hiatus to algorithmic filters</span>
                </div>
                <div className="diff-content chronological-text">
                  <div className="diff-line">
                    <span className="diff-dates">2017 – 2021:</span> Senior Marketing Manager, Acme Corp
                  </div>
                  <div className="diff-line gap-highlight">
                    <span className="diff-dates alert">2021 – 2024:</span> [CAREER HIATUS / UNEXPLAINED GAP]
                  </div>
                </div>

                <div className="diff-divider">
                  <Waves size={14} />
                  <span>TRANSFORMED BY ANCHOR DURATION FRAMING</span>
                </div>

                <div className="diff-header duration">
                  <span className="diff-tag success">AFTER: DURATION-WORKED (VERSION B / C)</span>
                  <span className="diff-note">Reframes on verified competency tenure (EV-002)</span>
                </div>
                <div className="diff-content duration-text">
                  <div className="diff-line success-highlight">
                    <span className="diff-tenure">4.2 Years Total Tenure:</span> Senior Marketing Manager, Acme Corp
                  </div>
                  <div className="diff-line sub-detail">
                    • Managed ₹42M budget across 14 multi-channel brand campaigns.
                  </div>
                  <div className="diff-line sub-detail">
                    • Functional cluster: Growth Strategy · Team Leadership · Performance Analytics.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cross Navigation Actions */}
          <div className="ocean-next-steps-banner">
            <div className="banner-left">
              <AnchorLogo size={32} animated={false} />
              <div>
                <strong>Next Step: Run Deep Candidate Diagnostic</strong>
                <p>
                  Verify whether limiting barriers for this candidate are presentation-only or include role adjacency deficits.
                </p>
              </div>
            </div>
            <div className="banner-actions">
              <button
                className="btn btn-ocean-primary btn-sm"
                onClick={() => navigate(`/diagnose?case=${selectedCandidateId}`)}
              >
                Run Diagnostic for {selectedCandidate?.title || "Candidate"} →
              </button>
              <button
                className="btn btn-ocean-secondary btn-sm"
                onClick={() => navigate(`/transition?candidate=${selectedCandidateId}`)}
              >
                Analyze Role Adjacency →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
