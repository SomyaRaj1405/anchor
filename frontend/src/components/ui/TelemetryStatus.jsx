import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Waves, CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";

export default function TelemetryStatus() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="telemetry-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`telemetry-pill-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        title="View Calibrated Evidence Telemetry"
      >
        <span className="sonar-ping-container">
          <span className="sonar-ping-wave" />
          <span className="sonar-ping-dot" />
        </span>
        <span className="telemetry-label">CORPUS CALIBRATED</span>
        <span className="telemetry-count">24,894 AUDITS</span>
        <ChevronDown size={13} className={`telemetry-arrow ${open ? "rotated" : ""}`} />
      </button>

      {open && (
        <div className="telemetry-popover">
          <div className="telemetry-popover-header">
            <div className="telemetry-popover-title">
              <ShieldCheck size={15} className="telemetry-icon" />
              <span>VERIFIED EVIDENCE CORPUS</span>
            </div>
            <span className="telemetry-status-badge">ACTIVE</span>
          </div>

          <div className="telemetry-body">
            <p className="telemetry-desc">
              Anchor is hard-calibrated against verified correspondence resume field experiments. 
              No hallucinations, no unproven generic cert lift assumptions.
            </p>

            <div className="telemetry-records">
              <div className="telemetry-record-item">
                <div className="telemetry-rec-header">
                  <span className="badge badge-danger">EV-001</span>
                  <strong>India Private Sector Audit</strong>
                </div>
                <div className="telemetry-rec-metric">
                  <span className="val">-49%</span>
                  <span className="desc">Break penalty for women across 15,872 resume audits. Control cert had 0% lift.</span>
                </div>
              </div>

              <div className="telemetry-record-item">
                <div className="telemetry-rec-header">
                  <span className="badge badge-success">EV-002</span>
                  <strong>UK Behavioral Insights Audit</strong>
                </div>
                <div className="telemetry-rec-metric">
                  <span className="val">+15%</span>
                  <span className="desc">Callback gain from duration-worked framing across 9,022 audit pairs.</span>
                </div>
              </div>
            </div>

            <div className="telemetry-footer-stats">
              <div>
                <span className="telemetry-stat-label">ONTOLOGY DEPTH</span>
                <strong className="telemetry-stat-val">16 Skills · 5 Roles</strong>
              </div>
              <div>
                <span className="telemetry-stat-label">RE-ENTRY SIMULATION</span>
                <strong className="telemetry-stat-val">Active Engine</strong>
              </div>
            </div>

            <Link
              to="/evidence"
              className="telemetry-action-link"
              onClick={() => setOpen(false)}
            >
              <span>Inspect Full Evidence Registry</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
