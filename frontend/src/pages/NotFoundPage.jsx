import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="anchor-page-wrapper" style={{ textAlign: "center", paddingTop: "80px" }}>
      <div className="pg-header">
        <div className="pg-header-eyebrow">ERROR 404</div>
        <h1 style={{ fontSize: "60px", marginBottom: "16px" }}>Page Not Found</h1>
        <p className="pg-header-subtitle" style={{ margin: "0 auto 32px" }}>
          The requested path does not exist in the Anchor intelligence platform.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
