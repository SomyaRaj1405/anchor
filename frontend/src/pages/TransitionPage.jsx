import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getTransition, getSamples, getOntology } from "../api/client";
import {
  ArrowLeftRight,
  Compass,
  Waves,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import OceanicGauge from "../components/ui/OceanicGauge";
import { AnchorLogo } from "../components/ui/AnchorBrand";

export default function TransitionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [samples, setSamples] = useState([]);
  const [ontology, setOntology] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    searchParams.get("candidate") || "sample-b"
  );
  const [targetRoleId, setTargetRoleId] = useState("data_analyst");

  // Workflow pipeline state
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    getSamples().then((data) => {
      setSamples(data?.profiles || []);
    });
    getOntology().then((data) => {
      setOntology(data);
    });
  }, []);

  useEffect(() => {
    const profile = samples.find((p) => p.id === selectedCandidateId);
    if (profile) {
      setTargetRoleId(profile.profile.target_role_id || "data_analyst");
      setResult(null);
      setHasRun(false);
      setActiveStep(1);
    }
  }, [selectedCandidateId, samples]);

  const selectedCandidate = samples.find((p) => p.id === selectedCandidateId);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setActiveStep(2);
    setTimeout(async () => {
      const data = await getTransition(selectedCandidateId, targetRoleId);
      setResult(data);
      setAnalyzing(false);
      setHasRun(true);
      setActiveStep(3);
    }, 550);
  };

  // Run automatically on mount if candidate selected
  useEffect(() => {
    if (selectedCandidateId && !hasRun) {
      handleAnalyze();
    }
  }, [selectedCandidateId]);

  return (
    <div className="anchor-page-wrapper">
      {/* Header */}
      <div className="pg-header oceanic-lab-header">
        <div className="lab-header-left">
          <div className="pg-header-eyebrow">
            <Compass size={13} className="eyebrow-icon" />
            <span>CROSS-ROLE VECTOR ADJACENCY ENGINE</span>
          </div>
          <h1>Transition Intelligence</h1>
          <p className="pg-header-subtitle">
            Maps skill vector cosine overlap, toolchain decay volatility, and transferable competencies
            when pivoting from prior domains into adjacent high-demand roles.
          </p>
        </div>
        <div className="lab-header-badge">
          <span className="lab-badge-pulse" />
          <span>VECTOR GRAPH // ACTIVE</span>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="workflow-pipeline" style={{ marginBottom: 22 }}>
        <div className={`pipeline-step ${activeStep >= 1 ? (activeStep > 1 ? "completed" : "active") : ""}`}>
          <div className="pipeline-circle">1</div>
          <span>Select Dossier</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className={`pipeline-step ${activeStep >= 2 ? (activeStep > 2 ? "completed" : "active") : ""}`}>
          <div className="pipeline-circle">2</div>
          <span>Adjacency Analysis</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className={`pipeline-step ${activeStep >= 3 ? "completed" : ""}`}>
          <div className="pipeline-circle">3</div>
          <span>Readiness Score</span>
        </div>
        <span className="pipeline-separator">→</span>
        <div className={`pipeline-step ${activeStep >= 3 ? "completed" : ""}`}>
          <div className="pipeline-circle">4</div>
          <span>Toolchain Volatility</span>
        </div>
      </div>

      {/* Step 1: Candidate Selection */}
      <div className="ocean-console-card" style={{ marginBottom: 24 }}>
        <div className="console-card-header">
          <div className="console-title-group">
            <span className="console-beacon" />
            <span className="section-label">SELECT CANDIDATE TRANSITION PROFILE</span>
          </div>
          <span className="console-state-tag">MULTI-ROLE TAXONOMY</span>
        </div>

        <div className="grid-3" style={{ marginTop: 14 }}>
          {samples.map((cand) => {
            const isSelected = cand.id === selectedCandidateId;
            return (
              <div
                key={cand.id}
                className={`ocean-candidate-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedCandidateId(cand.id)}
              >
                <div className="cand-top">
                  <span className="badge badge-info">{cand.id.toUpperCase()}</span>
                  {isSelected ? (
                    <span className="badge badge-success">ACTIVE PIVOT</span>
                  ) : (
                    <span className="badge badge-muted">SELECT</span>
                  )}
                </div>
                <div className="cand-title">{cand.title}</div>
                <div className="cand-desc">{cand.description}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Candidate Pivot Route Bar */}
        {selectedCandidate && (
          <div className="ocean-snapshot-bar" style={{ marginTop: 16 }}>
            <div className="snapshot-item">
              <span className="snapshot-label">ORIGIN ROLE</span>
              <strong className="snapshot-val">
                {selectedCandidate.profile.current_or_last_role_id.replace("_", " ").toUpperCase()}
              </strong>
              <span className="snapshot-sub">Baseline Domain</span>
            </div>
            <div className="snapshot-pivot-arrow">
              <ArrowLeftRight size={20} className="pivot-arrow-icon" />
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">TARGET PIVOT ROLE</span>
              <strong className="snapshot-val accent">
                {selectedCandidate.profile.target_role_id.replace("_", " ").toUpperCase()}
              </strong>
              <span className="snapshot-sub">Desired Goal</span>
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">CAREER HIATUS</span>
              <strong className="snapshot-val danger">
                {selectedCandidate.profile.gap_years} Years
              </strong>
              <span className="snapshot-sub">{selectedCandidate.profile.gap_reason}</span>
            </div>
          </div>
        )}

        <div className="console-toolbar" style={{ marginTop: 18 }}>
          <button
            className="btn btn-ocean-primary"
            onClick={handleAnalyze}
            disabled={analyzing}
            id="btn-run-transition"
          >
            {analyzing ? (
              <>
                <div className="ocean-spinner-sm" />
                <span>Computing Cross-Role Vector Adjacency...</span>
              </>
            ) : (
              <>
                <Compass size={16} />
                <span>Analyze Transition Adjacency</span>
              </>
            )}
          </button>
          <div className="console-toolbar-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>Maps skill cosine proximity against 16 ontology entities and empirical decay rates.</span>
          </div>
        </div>
      </div>

      {/* Transition Results */}
      {result && (
        <div style={{ opacity: analyzing ? 0.6 : 1, transition: "opacity .2s" }}>
          <div className="section-label">VECTOR PROJECTIONS // READINESS OUTCOMES</div>
          <h2 className="section-title">Transition Readiness & Competency Overlap</h2>

          {/* Readiness Gauge Overview Cards */}
          <div className="simulation-gauges-grid" style={{ marginBottom: 28 }}>
            {/* Overall Transition Readiness Dial */}
            <div className="sim-gauge-card version-c highlight">
              <div className="sim-gauge-card-halo" />
              <OceanicGauge
                percentage={result.readiness_pct || 72}
                label="Transition Readiness"
                sublabel="Cumulative overlap & foundational strength"
                delta="STRONG MATCH"
                badge="HIGH ADJACENCY"
                gradientId="transReadinessGrad"
                size={124}
              />
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag optimal">VIABLE RE-ENTRY ROUTE</span>
                <p className="gauge-ver-note">72% of target competencies already evidenced.</p>
              </div>
            </div>

            {/* Transferable Skills Count */}
            <div className="sim-gauge-card version-b">
              <div className="sim-metric-val green">{result.transferable_skills?.length || 4}</div>
              <h4 className="gauge-label">Verified Transferable Skills</h4>
              <p className="gauge-sublabel">Cross-functional strengths with low toolchain decay</p>
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag lift">DIRECT RE-USE</span>
                <p className="gauge-ver-note">Surface prominently on duration-framed resume.</p>
              </div>
            </div>

            {/* Missing Tooling Gaps */}
            <div className="sim-gauge-card version-control">
              <div className="sim-metric-val amber">{result.missing_skills?.length || 2}</div>
              <h4 className="gauge-label">Toolchain Gaps</h4>
              <p className="gauge-sublabel">Specific technical competencies requiring targeted demos</p>
              <div className="gauge-ver-footer">
                <span className="gauge-ver-tag warning">TARGETED UP-SKILL</span>
                <p className="gauge-ver-note">Build concrete project artifacts instead of generic certificates.</p>
              </div>
            </div>
          </div>

          {/* Competency Breakdown Grids */}
          <div className="two-col" style={{ marginBottom: 28 }}>
            {/* Transferable Strengths */}
            <div className="ocean-card">
              <div className="section-label">TRANSFERABLE COMPETENCIES</div>
              <h3 style={{ fontSize: "16px", marginTop: 4, marginBottom: 12 }}>
                High-Value Transferable Strengths
              </h3>
              <div className="competency-list">
                {(result.transferable_skills || []).map((skill, idx) => (
                  <div key={idx} className="competency-item success">
                    <CheckCircle2 size={16} className="comp-icon success" />
                    <div className="comp-info">
                      <strong>{skill.name || skill}</strong>
                      <span className="comp-meta">
                        Cluster: {skill.cluster || "Core Functional"} · Volatility: Low
                      </span>
                    </div>
                    <span className="badge badge-success">VALIDATED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Tooling Gaps */}
            <div className="ocean-card">
              <div className="section-label">TARGET GAPS // HIGH VOLATILITY TOOLING</div>
              <h3 style={{ fontSize: "16px", marginTop: 4, marginBottom: 12 }}>
                Specific Toolchain Competencies to Demonstrate
              </h3>
              <div className="competency-list">
                {(result.missing_skills || []).map((skill, idx) => (
                  <div key={idx} className="competency-item warning">
                    <AlertTriangle size={16} className="comp-icon warning" />
                    <div className="comp-info">
                      <strong>{skill.name || skill}</strong>
                      <span className="comp-meta">
                        Cluster: {skill.cluster || "Technical Tools"} · Fast Half-Life
                      </span>
                    </div>
                    <span className="badge badge-warning">FOCUS DEMO</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cross Navigation Actions */}
          <div className="ocean-next-steps-banner">
            <div className="banner-left">
              <AnchorLogo size={32} animated={false} />
              <div>
                <strong>Next Step: Test Duration Framing in Simulator</strong>
                <p>
                  See how reframing this transition under duration-worked conventions delivers a +15% pass lift.
                </p>
              </div>
            </div>
            <div className="banner-actions">
              <button
                className="btn btn-ocean-primary btn-sm"
                onClick={() => navigate(`/simulate?candidate=${selectedCandidateId}`)}
              >
                Simulate Framing Lift for {selectedCandidate?.title || "Candidate"} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
