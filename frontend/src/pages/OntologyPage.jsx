import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getOntology } from "../api/client";

export default function OntologyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [ontology, setOntology] = useState({ skills: [], roles: [] });
  const [loading, setLoading] = useState(true);

  // Filter & selection state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL"); // ALL, SKILLS, ROLES
  const [selectedEntityId, setSelectedEntityId] = useState(
    searchParams.get("select") || "data_analyst"
  );

  useEffect(() => {
    getOntology().then((data) => {
      setOntology(data || { skills: [], roles: [] });
      setLoading(false);
    });
  }, []);

  // Update selection if searchParams change
  useEffect(() => {
    const sel = searchParams.get("select");
    if (sel) {
      setSelectedEntityId(sel);
    }
  }, [searchParams]);

  // Find currently selected entity (can be skill or role)
  const selectedRole = ontology.roles.find((r) => r.id === selectedEntityId);
  const selectedSkill = ontology.skills.find((s) => s.id === selectedEntityId);
  const selectedEntity = selectedRole
    ? { ...selectedRole, entityType: "ROLE" }
    : selectedSkill
    ? { ...selectedSkill, entityType: "SKILL" }
    : null;

  // Filter skills and roles by query
  const filteredSkills = useMemo(() => {
    if (selectedType === "ROLES") return [];
    return ontology.skills.filter((skill) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        skill.name.toLowerCase().includes(q) ||
        skill.cluster.toLowerCase().includes(q) ||
        skill.volatility.toLowerCase().includes(q)
      );
    });
  }, [ontology.skills, searchQuery, selectedType]);

  const filteredRoles = useMemo(() => {
    if (selectedType === "SKILLS") return [];
    return ontology.roles.filter((role) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        role.name.toLowerCase().includes(q) ||
        role.function.toLowerCase().includes(q) ||
        role.outlook.toLowerCase().includes(q)
      );
    });
  }, [ontology.roles, searchQuery, selectedType]);

  // Which roles require a given skill?
  const getRolesForSkill = (skillId) => {
    return ontology.roles.filter((r) => (r.core_skills || []).includes(skillId));
  };

  // Which skill objects belong to a given role?
  const getSkillsForRole = (role) => {
    if (!role?.core_skills) return [];
    return role.core_skills
      .map((skillId) => ontology.skills.find((s) => s.id === skillId))
      .filter(Boolean);
  };

  return (
    <div className="anchor-page-wrapper">
      {/* Header */}
      <div className="pg-header">
        <div className="pg-header-eyebrow">TAXONOMY & ENTITY RELATIONSHIPS</div>
        <h1>Knowledge Ontology</h1>
        <p className="pg-header-subtitle">
          Interactive graph connecting roles, required competencies, toolchain volatility ratings,
          and empirical evidence grounding.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 300px" }}>
            <label className="form-label" htmlFor="concept-search">Search Concepts...</label>
            <input
              id="concept-search"
              type="text"
              className="form-input"
              placeholder="Search concepts, skills, roles, or clusters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 6, alignSelf: "flex-end" }}>
            <button
              className={`filter-chip ${selectedType === "ALL" ? "active" : ""}`}
              onClick={() => setSelectedType("ALL")}
            >
              All Entities ({ontology.skills.length + ontology.roles.length})
            </button>
            <button
              className={`filter-chip ${selectedType === "ROLES" ? "active" : ""}`}
              onClick={() => setSelectedType("ROLES")}
            >
              Roles ({ontology.roles.length})
            </button>
            <button
              className={`filter-chip ${selectedType === "SKILLS" ? "active" : ""}`}
              onClick={() => setSelectedType("SKILLS")}
            >
              Skills ({ontology.skills.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Explorer */}
      <div className="two-col" style={{ alignItems: "start", gap: 20 }}>
        {/* Left Pane: Entity List */}
        <div className="card" style={{ maxHeight: 680, overflowY: "auto", padding: 16 }}>
          {/* Roles Group */}
          {filteredRoles.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="ontology-cluster-name" style={{ color: "var(--anchor-accent)" }}>
                BENCHMARK ROLES ({filteredRoles.length})
              </div>
              {filteredRoles.map((role) => {
                const isSelected = selectedEntityId === role.id;
                return (
                  <div
                    key={role.id}
                    className="ontology-entity"
                    style={{
                      cursor: "pointer",
                      background: isSelected ? "var(--anchor-accent-light)" : undefined,
                      borderRadius: 6,
                    }}
                    onClick={() => setSelectedEntityId(role.id)}
                  >
                    <div>
                      <strong style={{ fontSize: "13px" }}>{role.name}</strong>
                      <div style={{ fontSize: "11px", color: "var(--anchor-text-muted)" }}>
                        {role.function} · {role.core_skills.length} core skills
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        role.outlook === "GROWING"
                          ? "badge-success"
                          : role.outlook === "STABLE"
                          ? "badge-info"
                          : "badge-danger"
                      }`}
                    >
                      {role.outlook}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Skills Group */}
          {filteredSkills.length > 0 && (
            <div>
              <div className="ontology-cluster-name" style={{ color: "var(--anchor-navy)" }}>
                COMPETENCY VECTORS ({filteredSkills.length})
              </div>
              {filteredSkills.map((skill) => {
                const isSelected = selectedEntityId === skill.id;
                return (
                  <div
                    key={skill.id}
                    className="ontology-entity"
                    style={{
                      cursor: "pointer",
                      background: isSelected ? "var(--anchor-accent-light)" : undefined,
                      borderRadius: 6,
                    }}
                    onClick={() => setSelectedEntityId(skill.id)}
                  >
                    <div>
                      <strong style={{ fontSize: "13px" }}>{skill.name}</strong>
                      <div className="skill-cluster-tag">{skill.cluster}</div>
                    </div>
                    <span
                      className={`badge ${
                        skill.volatility === "HIGH"
                          ? "badge-danger"
                          : skill.volatility === "MEDIUM"
                          ? "badge-warning"
                          : "badge-low"
                      }`}
                      title={`Volatility: ${skill.volatility}`}
                    >
                      {skill.volatility} VOL
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {filteredRoles.length === 0 && filteredSkills.length === 0 && (
            <div className="empty-state" style={{ padding: 24 }}>
              No entities match "{searchQuery}"
            </div>
          )}
        </div>

        {/* Right Pane: Interactive Entity Inspector */}
        <div className="card" style={{ position: "sticky", top: 80 }}>
          {selectedEntity ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="badge badge-info">{selectedEntity.entityType}</span>
                <span className="badge badge-modelled">MODELLED ONTOLOGY</span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, marginTop: 8 }}>
                {selectedEntity.name}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--anchor-text-muted)", marginTop: 2 }}>
                Identifier: <code>{selectedEntity.id}</code>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--anchor-border-light)", margin: "16px 0" }} />

              {/* ROLE SPECIFIC DETAILS */}
              {selectedEntity.entityType === "ROLE" && (
                <div>
                  <div className="detail-row">
                    <span className="detail-label">FUNCTIONAL DOMAIN</span>
                    <span className="detail-value">{selectedEntity.function}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">MARKET OUTLOOK</span>
                    <span className="detail-value">
                      <span
                        className={`badge ${
                          selectedEntity.outlook === "GROWING"
                            ? "badge-success"
                            : selectedEntity.outlook === "STABLE"
                            ? "badge-info"
                            : "badge-danger"
                        }`}
                      >
                        {selectedEntity.outlook}
                      </span>
                    </span>
                  </div>

                  {/* Required Core Skills list */}
                  <div style={{ marginTop: 18 }}>
                    <div className="section-label">
                      REQUIRED CORE SKILLS ({selectedEntity.core_skills.length})
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--anchor-text-muted)", marginTop: 2 }}>
                      Click any skill node to inspect its volatility and cross-role relationships:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {getSkillsForRole(selectedEntity).map((skill) => (
                        <button
                          key={skill.id}
                          className="btn btn-secondary btn-sm"
                          style={{
                            background: "var(--anchor-bg)",
                            border: "1px solid var(--anchor-border)",
                            fontSize: "12px",
                          }}
                          onClick={() => setSelectedEntityId(skill.id)}
                        >
                          {skill.name} ({skill.volatility[0]}V) →
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div style={{ marginTop: 20 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/transition?target=${selectedEntity.id}`)}
                    >
                      Test in Transition Intelligence ⇄
                    </button>
                  </div>
                </div>
              )}

              {/* SKILL SPECIFIC DETAILS */}
              {selectedEntity.entityType === "SKILL" && (
                <div>
                  <div className="detail-row">
                    <span className="detail-label">CLUSTER</span>
                    <span className="detail-value">{selectedEntity.cluster}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">TOOLCHAIN VOLATILITY</span>
                    <span className="detail-value">
                      <span
                        className={`badge ${
                          selectedEntity.volatility === "HIGH"
                            ? "badge-danger"
                            : selectedEntity.volatility === "MEDIUM"
                            ? "badge-warning"
                            : "badge-low"
                        }`}
                      >
                        {selectedEntity.volatility} VOLATILITY
                      </span>
                    </span>
                  </div>

                  {selectedEntity.volatility === "HIGH" && (
                    <div style={{ marginTop: 12, padding: 10, background: "var(--anchor-warning-bg)", borderRadius: 6, fontSize: "12px", color: "var(--anchor-warning)" }}>
                      ⚠ <strong>High toolchain churn:</strong> During a 3+ year hiatus, tooling in this competency decays rapidly in market relevance.
                    </div>
                  )}

                  {/* Which roles require this skill? */}
                  <div style={{ marginTop: 18 }}>
                    <div className="section-label">
                      REQUIRED BY BENCHMARK ROLES ({getRolesForSkill(selectedEntity.id).length})
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--anchor-text-muted)", marginTop: 2 }}>
                      Click any role to inspect its full requirement profile:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {getRolesForSkill(selectedEntity.id).map((role) => (
                        <button
                          key={role.id}
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedEntityId(role.id)}
                        >
                          {role.name} →
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Relationship Explorer Chain */}
              <div style={{ marginTop: 24, padding: 14, background: "var(--anchor-bg)", borderRadius: 8 }}>
                <div className="section-label">INTERACTIVE RELATIONSHIP EXPLORER</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap", fontSize: "12px" }}>
                  <span className="badge badge-info">{selectedEntity.name}</span>
                  <span>→</span>
                  <span className="badge badge-warning">
                    {selectedEntity.entityType === "ROLE" ? "Skill Adjacency" : "Competency Refresh"}
                  </span>
                  <span>→</span>
                  <Link to="/evidence?id=EV-001" className="evidence-link-chip">
                    EV-001 ↗
                  </Link>
                  <Link to="/evidence?id=EV-002" className="evidence-link-chip">
                    EV-002 ↗
                  </Link>
                  <span>→</span>
                  <span className="badge badge-success">Pass Odds Lift</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              Select any skill or role from the left pane to inspect its relationship graph.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
