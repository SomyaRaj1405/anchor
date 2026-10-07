import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="anchor-page-wrapper">
      <div className="pg-header">
        <div className="pg-header-eyebrow">METHODOLOGY & SCIENTIFIC PRINCIPLES</div>
        <h1>About Anchor</h1>
        <p className="pg-header-subtitle">
          Anchor is an evidence-driven intelligence platform focused on understanding
          and mitigating the career-break penalty during the transition back into the workforce.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "18px", marginBottom: 12 }}>Our Core Thesis</h2>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--anchor-text)" }}>
          When candidates return to work after caregiving or health hiatuses, conventional advice
          often pushes immediate, costly upskilling courses. However, empirical field experiments
          demonstrate that generic certificates fail to improve callback rates in the private sector.
        </p>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--anchor-text)" }}>
          The limiting barrier is frequently <strong>presentation salience and automated screening disqualification</strong>.
          By reframing resumes to salient duration metrics and auditing recruiter screening bias, Anchor
          helps candidates return on steady ground.
        </p>
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-label">PRIMARY EMPIRICAL CITATIONS</div>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-info">EV-001</span>
                <span className="badge badge-empirical">INDIA (2024)</span>
              </div>
              <p style={{ fontSize: "13px", marginTop: 6, fontStyle: "italic", color: "var(--anchor-text-secondary)" }}>
                Mahajan, K. & Nandhini S. (2024). Restart: Women, career breaks and employer response.
                Ashoka University Discussion Paper No. 125.
              </p>
              <div style={{ fontSize: "12px", color: "var(--anchor-text-muted)" }}>
                N = 15,872 applications across 3,968 job postings. 49% lower callback rate for women with a break.
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-info">EV-002</span>
                <span className="badge badge-empirical">UK (2022)</span>
              </div>
              <p style={{ fontSize: "13px", marginTop: 6, fontStyle: "italic", color: "var(--anchor-text-secondary)" }}>
                Kristal, A. S. et al. (2022). Reducing discrimination against job seekers with and without employment gaps.
                Nature Human Behaviour, 7(2), 211-218.
              </p>
              <div style={{ fontSize: "12px", color: "var(--anchor-text-muted)" }}>
                N = 9,022 field experiment. +15% more callbacks with duration reframing.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-label">PROVENANCE TAXONOMY</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span className="badge badge-empirical" style={{ marginBottom: 4 }}>EMPIRICAL</span>
              <p style={{ fontSize: "12px", color: "var(--anchor-text-secondary)", margin: 0 }}>
                A statistic published in a cited, peer-reviewed or preregistered field experiment.
              </p>
            </div>
            <div>
              <span className="badge badge-modelled" style={{ marginBottom: 4 }}>MODELLED</span>
              <p style={{ fontSize: "12px", color: "var(--anchor-text-secondary)", margin: 0 }}>
                A rule-based vector pattern computed deterministically from candidate profile data.
              </p>
            </div>
            <div>
              <span className="badge badge-simulated" style={{ marginBottom: 4 }}>SIMULATED</span>
              <p style={{ fontSize: "12px", color: "var(--anchor-text-secondary)", margin: 0 }}>
                A projected scenario calculation based on explicit mathematical assumptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-label">NAVIGATE WORKFLOWS</div>
        <div className="quick-action-bar" style={{ borderTop: "none", paddingTop: 0 }}>
          <Link to="/evidence" className="btn btn-primary btn-sm">Explore Evidence Registry →</Link>
          <Link to="/transition" className="btn btn-secondary btn-sm">Transition Intelligence →</Link>
          <Link to="/diagnose" className="btn btn-secondary btn-sm">Candidate Diagnostic →</Link>
          <Link to="/simulate" className="btn btn-secondary btn-sm">Scenario Simulator →</Link>
          <Link to="/audit" className="btn btn-secondary btn-sm">Screening Audit →</Link>
          <Link to="/ontology" className="btn btn-secondary btn-sm">Knowledge Ontology →</Link>
        </div>
      </div>
    </div>
  );
}
