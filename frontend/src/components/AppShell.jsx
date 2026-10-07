import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: "◉" },
  { to: "/evidence", label: "Evidence", icon: "◈" },
  { to: "/transition", label: "Transition Intelligence", icon: "⇄" },
  { to: "/diagnose", label: "Diagnose", icon: "⊕" },
  { to: "/simulate", label: "Simulate", icon: "◎" },
  { to: "/audit", label: "Audit", icon: "☰" },
  { to: "/ontology", label: "Ontology", icon: "⬡" },
];

const PAGE_TITLES = {
  "/": "OVERVIEW",
  "/evidence": "EVIDENCE INTELLIGENCE",
  "/transition": "TRANSITION INTELLIGENCE",
  "/diagnose": "DIAGNOSTIC INTELLIGENCE",
  "/simulate": "SCENARIO SIMULATION",
  "/audit": "AUDIT TRAIL",
  "/ontology": "KNOWLEDGE ONTOLOGY",
  "/about": "ABOUT ANCHOR",
};

export default function AppShell({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = PAGE_TITLES[location.pathname] || "ANCHOR";

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">ANCHOR</div>
          <div className="sidebar-brand-tagline">Evidence Intelligence</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Intelligence</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <div className="sidebar-section-label" style={{ marginTop: 12 }}>
            Reference
          </div>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-link-icon">ⓘ</span>
            About Anchor
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          Structured evidence workspace
          <br />
          Demo data active
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <span className="topbar-title">{pageTitle}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-status">
              <span className="topbar-dot" />
              DATA READY
            </div>
          </div>
        </header>

        <main>
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
