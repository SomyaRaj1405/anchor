import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getAudit, getSamples } from "../api/client";

export default function AuditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [ruleSets, setRuleSets] = useState([]);
  const [selectedRuleSetId, setSelectedRuleSetId] = useState(
    searchParams.get("ruleset") || "deck-rules"
  );
  const [auditing, setAuditing] = useState(false);
  const [result, setResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [activePipelineStage, setActivePipelineStage] = useState(5); // 1 to 6

  useEffect(() => {
    getSamples().then((data) => {
      setRuleSets(data?.audit_rule_sets || []);
    });
  }, []);

  const handleRunAudit = () => {
    setAuditing(true);
    setTimeout(async () => {
      const data = await getAudit(selectedRuleSetId);
      setResult(data);
      setAuditing(false);
      setHasRun(true);
      setActivePipelineStage(6);
    }, 600);
  };

  useEffect(() => {
    handleRunAudit();
  }, [selectedRuleSetId]);

  const selectedRuleSet = ruleSets.find((r) => r.id === selectedRuleSetId);

  return (
    <div className="anchor-page-wrapper">
      {/* Header */}
      <div className="pg-header">
        <div className="pg-header-eyebrow">SYSTEM TRACEABILITY & REASONING</div>
        <h1>Screening Rule Audit</h1>
        <p className="pg-header-subtitle">
          Audits employer ATS filtering rules to verify whether arbitrary recency
          criteria inadvertently exclude qualified return-to-work candidates without measuring capability.
        </p>
      </div>

      {/* Interactive 6-Stage Traceability Pipeline */}
      <div className="workflow-pipeline" style={{ marginBottom: 24 }}>
        {[
          { num: 1, label: "Request" },
          { num: 2, label: "Inputs" },
          { num: 3, label: "Evidence Grounding" },
          { num: 4, label: "Risk Analysis" },
          { num: 5, label: "Finding" },
          { num: 6, label: "Remediation" },
        ].map((stage, i) => (
          <React.Fragment key={stage.num}>
            <div
              className={`pipeline-step ${
                activePipelineStage >= stage.num ? (activePipelineStage > stage.num ? "completed" : "active") : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActivePipelineStage(stage.num)}
            >
              <div className="pipeline-circle">{stage.num}</div>
              <span>{stage.label}</span>
            </div>
            {i < 5 && <span className="pipeline-separator">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Select Rule Set Input Panel */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-label">SELECT SCREENING RULE POLICY</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
          {ruleSets.map((rs) => {
            const isSelected = rs.id === selectedRuleSetId;
            return (
              <div
                key={rs.id}
                className={`candidate-card-select ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedRuleSetId(rs.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="badge badge-info">{rs.id.toUpperCase()}</span>
                  {isSelected && <span className="badge badge-success">ACTIVE POLICY</span>}
                </div>
                <div style={{ fontWeight: 750, fontSize: "14px", marginTop: 8 }}>{rs.title}</div>
                <div style={{ fontSize: "12px", color: "var(--anchor-text-muted)", marginTop: 4 }}>
                  {rs.rules.length} ATS filtering criteria included
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Policy Rules Display */}
        {selectedRuleSet && (
          <div style={{ marginTop: 16, padding: 14, background: "var(--anchor-bg)", borderRadius: 8 }}>
            <span className="form-label">Rules Ingested for Verification ({selectedRuleSet.rules.length})</span>
            <ol style={{ paddingLeft: 18, marginTop: 6, fontSize: "13px", lineHeight: 1.6 }}>
              {selectedRuleSet.rules.map((rule, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  <code>"{rule}"</code>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Action Trigger */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="btn btn-primary"
            onClick={handleRunAudit}
            disabled={auditing}
            id="btn-run-audit"
          >
            {auditing ? "Executing trace pipeline..." : "Run Screening Audit ☰"}
          </button>
          {auditing && <div className="loading-spinner" style={{ marginBottom: 0, width: 20, height: 20 }} />}
          <span style={{ fontSize: "12px", color: "var(--anchor-text-muted)" }}>
            Matches criteria against empirical bias definitions AR-001 through AR-009.
          </span>
        </div>
      </div>

      {/* Audit Results Panel */}
      {result && !auditing && (
        <div>
          {/* Summary Metric Cards */}
          <div className="section-label">AUDIT RISK SUMMARY</div>
          <div className="metric-grid" style={{ marginBottom: 24 }}>
            <div className="metric-card">
              <div className="metric-card-label">TOTAL RULES TESTED</div>
              <div className="metric-card-value">{result.summary.total_rules}</div>
              <div className="metric-card-note">Screening criteria evaluated</div>
            </div>
            <div className="metric-card">
              <div className="metric-card-label">FLAGGED HIGH RISK</div>
              <div className="metric-card-value" style={{ color: "var(--anchor-danger)" }}>
                {result.summary.high}
              </div>
              <div className="metric-card-note">Inadvertently penalizes breaks</div>
            </div>
            <div className="metric-card">
              <div className="metric-card-label">FLAGGED MEDIUM RISK</div>
              <div className="metric-card-value" style={{ color: "var(--anchor-warning)" }}>
                {result.summary.medium}
              </div>
              <div className="metric-card-note">Title rigidity & tool recency</div>
            </div>
            <div className="metric-card">
              <div className="metric-card-label">MERIT-BASED / SAFE</div>
              <div className="metric-card-value" style={{ color: "var(--anchor-success)" }}>
                {result.summary.low || 0}
              </div>
              <div className="metric-card-note">No career gap penalty</div>
            </div>
          </div>

          {/* Rule-by-Rule Audit Details */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="section-label">RULE-BY-RULE TRACEABILITY INSPECTOR</div>
            <h3 style={{ fontSize: "16px", marginTop: 4, marginBottom: 14 }}>
              Detailed Policy Verification & Bias Detection
            </h3>

            <div>
              {result.results.map((rule) => {
                const isHigh = rule.risk_level === "HIGH";
                const isMedium = rule.risk_level === "MEDIUM";

                return (
                  <div
                    key={rule.line_number}
                    className="audit-rule"
                    style={{
                      borderLeft: `4px solid ${
                        isHigh ? "var(--anchor-danger)" : isMedium ? "var(--anchor-warning)" : "var(--anchor-success)"
                      }`,
                    }}
                  >
                    <div className="audit-rule-header">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span className="badge badge-muted">LINE {rule.line_number}</span>
                          <span
                            className={`badge ${
                              isHigh ? "badge-danger" : isMedium ? "badge-warning" : "badge-success"
                            }`}
                          >
                            {rule.risk_level} RISK
                          </span>
                          <span className="badge badge-info">{rule.matched_rule_id}</span>
                          <span className="badge badge-modelled">{rule.provenance}</span>
                        </div>
                        <div className="audit-rule-text">"{rule.rule_text}"</div>
                      </div>

                      {/* Supporting Evidence Links */}
                      <div>
                        {(rule.evidence_ids || []).map((evId) => (
                          <Link
                            key={evId}
                            to={`/evidence?id=${evId}`}
                            className="evidence-link-chip"
                            title={`Inspect ${evId} empirical foundation`}
                          >
                            {evId} ↗
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="audit-rule-impact">
                      <strong>Exclusion Impact:</strong> {rule.impact}
                    </div>

                    <div className="audit-rule-intervention">
                      <strong>Recommended Policy Remediation:</strong>
                      {rule.recommended_intervention}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trace Pipeline Technical Inspection */}
          <div className="two-col" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="section-label">AUDIT PIPELINE METADATA</div>
              <div className="detail-row">
                <span className="detail-label">AUDIT RUN ID</span>
                <span className="detail-value">AUDIT-2024-DECK-01</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">EVALUATOR</span>
                <span className="detail-value">Anchor Rule-Engine v1.2</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">CORPUS BASIS</span>
                <span className="detail-value">Ashoka Univ & Nature Hum Behav</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">VERIFICATION TYPE</span>
                <span className="detail-value">Deterministic Syntax Matcher</span>
              </div>
            </div>

            <div className="card">
              <div className="section-label">CONNECTED SUPPORTING EVIDENCE</div>
              <p style={{ fontSize: "13px", color: "var(--anchor-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
                Rules flagged as HIGH RISK directly enforce the mechanisms proven discriminatory in <strong>EV-001</strong> (49% penalty for break visibility) and contradict <strong>EV-002</strong> (duration reframing removes penalty).
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Link to="/evidence?id=EV-001" className="btn btn-secondary btn-sm">
                  Examine EV-001 Research →
                </Link>
                <Link to="/evidence?id=EV-002" className="btn btn-secondary btn-sm">
                  Examine EV-002 Research →
                </Link>
              </div>
            </div>
          </div>

          {/* Next Workflow Links */}
          <div className="card">
            <div className="section-label">EXPLORE OTHER WORKFLOWS</div>
            <div className="quick-action-bar" style={{ marginTop: 10, borderTop: "none", paddingTop: 0 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/simulate")}
              >
                Simulate Candidate Impact under this Policy →
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/transition")}
              >
                Inspect Transition Readiness Engine →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
