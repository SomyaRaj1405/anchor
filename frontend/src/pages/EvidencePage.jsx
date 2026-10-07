import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getEvidence } from "../api/client";

const disclaimer =
  "Anchor shows population-level evidence and modelled scenarios. It does not predict any individual's outcome.";

export default function EvidencePage() {
  const [searchParams] = useSearchParams();
  const targetIdParam = searchParams.get("id");

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvenance, setSelectedProvenance] = useState("ALL");
  const [selectedGeography, setSelectedGeography] = useState("ALL");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    let active = true;
    getEvidence()
      .then((data) => {
        if (active) {
          const list = data?.entries || [];
          setEntries(list);
          // If a specific ID is provided via query param or hash, auto-expand it
          if (targetIdParam) {
            setExpandedCards({ [targetIdParam]: true });
          } else if (window.location.hash) {
            const hashId = window.location.hash.replace("#", "");
            setExpandedCards({ [hashId]: true });
          } else {
            // By default expand the first card
            if (list.length > 0) {
              setExpandedCards({ [list[0].id]: true });
            }
          }
        }
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetIdParam]);

  // Scroll to target card if specified
  useEffect(() => {
    if (!loading && (targetIdParam || window.location.hash)) {
      const id = targetIdParam || window.location.hash.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [loading, targetIdParam]);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered evidence records
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search matching across ID, short_title, citation, geography, study_type, findings
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = entry.id.toLowerCase().includes(q);
        const matchesTitle = entry.short_title.toLowerCase().includes(q);
        const matchesCitation = entry.citation.toLowerCase().includes(q);
        const matchesGeo = entry.geography.toLowerCase().includes(q);
        const matchesStudy = entry.study_type.toLowerCase().includes(q);
        const matchesFindings = (entry.findings || []).some((f) =>
          f.toLowerCase().includes(q)
        );
        if (
          !matchesId &&
          !matchesTitle &&
          !matchesCitation &&
          !matchesGeo &&
          !matchesStudy &&
          !matchesFindings
        ) {
          return false;
        }
      }

      // Provenance filter
      if (selectedProvenance !== "ALL" && entry.provenance !== selectedProvenance) {
        return false;
      }

      // Geography filter
      if (selectedGeography !== "ALL") {
        if (!entry.geography.toLowerCase().includes(selectedGeography.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [entries, searchQuery, selectedProvenance, selectedGeography]);

  return (
    <div className="anchor-page-wrapper">
      {/* Page Header */}
      <div className="pg-header">
        <div className="pg-header-eyebrow">EMPIRICAL REGISTRY</div>
        <h1>Evidence Workspace</h1>
        <p className="pg-header-subtitle">
          Every published empirical statistic in Anchor is cataloged with its
          sample size, experimental methodology, and geographic boundary conditions.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: 24, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 280px" }}>
            <label className="form-label" htmlFor="evidence-search">Search Evidence Registry</label>
            <input
              id="evidence-search"
              type="text"
              className="form-input"
              placeholder="Search by ID, keyword, study author, or finding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <label className="form-label">Provenance Type</label>
            <select
              className="form-select"
              value={selectedProvenance}
              onChange={(e) => setSelectedProvenance(e.target.value)}
            >
              <option value="ALL">All Provenances</option>
              <option value="EMPIRICAL">Empirical (Field Audit)</option>
              <option value="MODELLED">Modelled</option>
              <option value="SIMULATED">Simulated</option>
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <label className="form-label">Geography</label>
            <select
              className="form-select"
              value={selectedGeography}
              onChange={(e) => setSelectedGeography(e.target.value)}
            >
              <option value="ALL">All Geographies</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>

          {(searchQuery || selectedProvenance !== "ALL" || selectedGeography !== "ALL") && (
            <div style={{ alignSelf: "flex-end" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvenance("ALL");
                  setSelectedGeography("ALL");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Filter count status */}
        <div style={{ marginTop: 12, fontSize: "12px", color: "var(--anchor-text-muted)" }}>
          Showing <strong>{filteredEntries.length}</strong> of {entries.length} evidence records
          {targetIdParam && ` · Focused on ${targetIdParam}`}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading evidence registry data...</div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="error-state">
          <strong>Could not retrieve live evidence registry.</strong>
          <p>{error?.message || "Using cached Anchor empirical dataset."}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEntries.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <strong>No matching evidence records found</strong>
          <p>Try adjusting your search terms or clearing the provenance and geography filters.</p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 14 }}
            onClick={() => {
              setSearchQuery("");
              setSelectedProvenance("ALL");
              setSelectedGeography("ALL");
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Evidence Cards List */}
      {!loading && !error && filteredEntries.map((entry) => {
        const isExpanded = Boolean(expandedCards[entry.id]);
        const isTarget = targetIdParam === entry.id;

        return (
          <article
            key={entry.id}
            id={entry.id}
            className="evidence-card"
            style={{
              borderColor: isTarget ? "var(--anchor-accent)" : undefined,
              boxShadow: isTarget ? "0 0 0 2px var(--anchor-accent-light)" : undefined,
              marginBottom: 20,
            }}
          >
            <header>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-info">{entry.id}</span>
                  <span className={`badge badge-${entry.provenance.toLowerCase()}`}>
                    {entry.provenance}
                  </span>
                  <span className="badge badge-muted">{entry.geography}</span>
                </div>
                <h2>{entry.short_title}</h2>
              </div>

              <button
                className="expand-toggle-btn"
                onClick={() => toggleExpand(entry.id)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Hide details ▲" : "View details ▼"}
              </button>
            </header>

            {/* Headline Callout */}
            <div className="headline">
              <strong>{entry.headline.value}</strong>
              <span>{entry.headline.label}</span>
            </div>

            {/* Core Experimental Facts */}
            <dl className="facts">
              <div>
                <dt>Study Type</dt>
                <dd>{entry.study_type}</dd>
              </div>
              <div>
                <dt>Geography</dt>
                <dd>{entry.geography}</dd>
              </div>
              <div>
                <dt>Audit Sample Size</dt>
                <dd>{entry.sample}</dd>
              </div>
              <div>
                <dt>Publication Venue & Year</dt>
                <dd>{entry.venue} ({entry.year})</dd>
              </div>
            </dl>

            <p className="citation">{entry.citation}</p>
            <div style={{ marginBottom: 12 }}>
              <a href={entry.url} target="_blank" rel="noreferrer" style={{ fontSize: "12px", fontWeight: 700 }}>
                Read original source paper ↗
              </a>
            </div>

            {/* Expanded Detailed Section */}
            {isExpanded && (
              <div>
                <section>
                  <h3>Key Empirical Findings</h3>
                  <ul>
                    {entry.findings.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="limits" style={{ borderRadius: 6, margin: "16px 0", padding: "14px 18px" }}>
                  <h3 style={{ color: "var(--anchor-warning)", fontSize: "12px", textTransform: "uppercase" }}>
                    Methodological Constraints & Limits
                  </h3>
                  <ul>
                    {entry.limits.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </section>

                <aside className="transferability">
                  <strong>Transferability Guideline</strong>
                  <p>{entry.transferability_note}</p>
                </aside>

                {/* Cross-Workflow Action Links */}
                <div className="quick-action-bar">
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--anchor-text-muted)", textTransform: "uppercase" }}>
                    Test with this evidence:
                  </span>
                  <Link
                    to={`/transition?evidence=${entry.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Analyze in Transition Intelligence ⇄
                  </Link>
                  <Link
                    to={`/simulate?evidence=${entry.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Simulate Scenario Impact ◎
                  </Link>
                  <Link
                    to={`/audit?evidence=${entry.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Trace in Screening Audit ☰
                  </Link>
                </div>
              </div>
            )}
          </article>
        );
      })}

      <footer style={{ marginTop: 40, textAlign: "center", fontSize: "11px", color: "var(--anchor-text-muted)" }}>
        {disclaimer}
      </footer>
    </div>
  );
}
