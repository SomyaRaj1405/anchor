import React from "react";
import { Link } from "react-router-dom";

const findings = [
  {
    title: "Calendar date bias",
    value: "-49%",
    text: "Lower employer callbacks for women presenting a career hiatus in India's private sector across 15,872 resumes.",
    to: "/evidence?id=EV-001",
  },
  {
    title: "Certificate control",
    value: "0% lift",
    text: "Adding generic online upskilling certificates produced zero statistically significant lift in callback rates.",
    to: "/simulate",
  },
  {
    title: "Duration framing",
    value: "+15%",
    text: "Higher callbacks when resumes display cumulative duration worked rather than calendar start-and-end dates.",
    to: "/evidence?id=EV-002",
  },
];

const steps = [
  "We look at your work history, role, and the gap on the page.",
  "We compare that profile to the audit evidence from India and the UK.",
  "You see whether the issue is a screening rule, a presentation issue, or a real skills gap.",
];

export default function HomePage() {
  return (
    <div className="overview-page">
      <section className="overview-hero">
        <p className="overview-kicker">Anchor</p>
        <h1>Was your career break ever the real barrier?</h1>
        <p className="overview-subtitle">
          Anchor checks your profile against 24,894 resume audits from India and the UK,
          so you know whether to upskill or to push back on screening.
        </p>

        <div className="overview-actions">
          <Link to="/diagnose" className="primary-button">
            Check a profile
          </Link>
          <Link to="/evidence" className="text-link">
            See the evidence
          </Link>
        </div>
      </section>

      <section className="overview-section">
        <h2>What the audits found</h2>

        <div className="findings-grid">
          {findings.map((item) => (
            <article key={item.title} className="audit-finding-card">
              <h3>{item.title}</h3>
              <div className="finding-value">{item.value}</div>
              <p>{item.text}</p>
              <Link to={item.to} className="text-link small-link">
                See the evidence
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="overview-section">
        <h2>How it works</h2>

        <ol className="steps-list">
          {steps.map((step, index) => (
            <li key={step} className="step-item">
              <span className="step-number">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
