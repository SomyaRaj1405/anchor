import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function LegalPage() {
  const location = useLocation();
  const isTerms = location.pathname.includes("terms");
  const title = isTerms ? "Terms of Service" : "Privacy Policy";

  return (
    <div className="anchor-page-wrapper">
      <div className="pg-header">
        <div className="pg-header-eyebrow">LEGAL INFORMATION</div>
        <h1>{title}</h1>
        <p className="pg-header-subtitle">
          Anchor is a demonstration environment for population-level evidence. 
          This is a placeholder page for the {title.toLowerCase()}.
        </p>
        
        <div className="card" style={{ marginTop: 32 }}>
          <p>
            The Anchor platform simulates intelligence workflows based on peer-reviewed research. 
            It is not intended as individual legal, medical, or hiring advice. Data provided is illustrative.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 24, display: "inline-flex" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
