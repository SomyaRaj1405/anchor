/**
 * API client — data access and analytical intelligence engine for Anchor.
 *
 * Tries backend endpoints if VITE_API_BASE is set, and transparently falls back
 * to the Anchor Mock Dataset and analytical engine so the application works
 * seamlessly offline for hackathon demonstrations.
 */

import evidenceMock from "../mocks/evidence.json";
import ontologyMock from "../mocks/ontology.json";
import samplesMock from "../mocks/samples.json";
import diagnoseResponseA from "../mocks/diagnose_response_a.json";
import simulateResponseA from "../mocks/simulate_response_a.json";
import transitionResponseB from "../mocks/transition_response_b.json";
import auditResponseDeck from "../mocks/audit_response_deck.json";

const API_BASE = import.meta.env.VITE_API_BASE || "";

async function tryFetch(path, options) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Returns evidence registry entries.
 */
export async function getEvidence() {
  const data = await tryFetch("/api/evidence");
  return data || evidenceMock;
}

/**
 * Returns knowledge ontology (skills, roles, clusters).
 */
export async function getOntology() {
  const data = await tryFetch("/api/ontology");
  return data || ontologyMock;
}

/**
 * Returns candidate sample profiles and audit rule sets.
 */
export async function getSamples() {
  const data = await tryFetch("/api/samples");
  return data || samplesMock;
}

/**
 * Returns diagnostic evaluation for candidate.
 */
export async function getDiagnosis(candidateId = "sample-a") {
  const remote = await tryFetch(`/api/diagnose?candidate=${candidateId}`);
  if (remote) return remote;

  if (candidateId === "sample-b") {
    return {
      target_role: { id: "data_analyst", name: "Data Analyst" },
      flags: [
        {
          id: "gap_visibility",
          label: "Career-Gap Visibility",
          level: "HIGH",
          status: "BARRIER",
          explanation: "Chronological dates expose 3-year caregiving gap to automated screening filters.",
          provenance: "MODELLED"
        },
        {
          id: "role_adjacency",
          label: "Role Vector Adjacency",
          level: "MEDIUM",
          status: "WATCH",
          explanation: "Candidate has 5 overlapping analytical skills, but role title mismatch triggers title-matching ATS rules.",
          provenance: "MODELLED"
        },
        {
          id: "skill_freshness",
          label: "Skill Freshness & Tooling",
          level: "MEDIUM",
          status: "WATCH",
          explanation: "Missing SQL and Python core competencies for target Data Analyst profile.",
          provenance: "MODELLED"
        },
        {
          id: "experience_salience",
          label: "Experience Salience",
          level: "LOW",
          status: "BARRIER",
          explanation: "7.2 years of FMCG quantitative leadership is buried under date-based format.",
          provenance: "MODELLED"
        }
      ],
      summary: { barrier_count: 2, watch_count: 2, strength_count: 1 },
      recommendation: {
        intervention: "TRANSITION",
        title: "Transition — Skill Adjacency & Reframe",
        rationale: "Strong quantitative foundations exist; candidate needs targeted bridge to Data Analyst role rather than restarting from zero.",
        prescribed_action: "Adopt duration framing (EV-002) and build practical GitHub proofs for SQL/Python before applying.",
        evidence_ids: ["EV-001", "EV-002"]
      },
      capability_check: {
        qualification_limiting: false,
        explanation: "Foundational aptitude is validated; targeted tooling bridge required, not generic certification."
      }
    };
  }

  if (candidateId === "sample-c") {
    return {
      target_role: { id: "hr_manager", name: "HR Manager" },
      flags: [
        {
          id: "gap_visibility",
          label: "Career-Gap Visibility",
          level: "HIGH",
          status: "BARRIER",
          explanation: "4-year health hiatus visible on chronological resume.",
          provenance: "MODELLED"
        },
        {
          id: "skill_freshness",
          label: "Core Skill Coverage",
          level: "HIGH",
          status: "BARRIER",
          explanation: "Missing 3 of 5 core competencies (HR Analytics, HRIS Tools, Talent Acquisition) for current benchmark role.",
          provenance: "MODELLED"
        },
        {
          id: "availability_signal",
          label: "Availability Signal",
          level: "LOW",
          status: "STRENGTH",
          explanation: "Candidate explicitly signals immediate availability and NGO advisory work.",
          provenance: "MODELLED"
        }
      ],
      summary: { barrier_count: 2, watch_count: 0, strength_count: 1 },
      recommendation: {
        intervention: "RESKILL",
        title: "Reskill — Core Competency Refresh",
        rationale: "4-year break created genuine gaps in contemporary HRIS tooling and modern analytics practices.",
        prescribed_action: "Targeted practical hands-on project in HRIS tools and modern employee analytics workflows.",
        evidence_ids: ["EV-001"]
      },
      capability_check: {
        qualification_limiting: true,
        explanation: "In this specific profile, modern toolchain familiarity is a genuine limiting barrier alongside break stigma."
      }
    };
  }

  // Default: sample-a
  return diagnoseResponseA;
}

/**
 * Returns Transition Intelligence analysis.
 */
export async function getTransition(candidateId = "sample-b", targetRoleId = "data_analyst") {
  const remote = await tryFetch(`/api/transition?candidate=${candidateId}&target=${targetRoleId}`);
  if (remote) return remote;

  if (candidateId === "sample-a" || targetRoleId === "marketing_manager") {
    return {
      target_role: { id: "marketing_manager", name: "Marketing Manager" },
      transferable: [
        { id: "brand_strategy", name: "Brand Strategy", cluster: "Marketing Strategy" },
        { id: "pnl_leadership", name: "P&L Leadership", cluster: "Business Leadership" },
        { id: "analytics", name: "Analytics", cluster: "Data & Analytics" },
        { id: "stakeholder_management", name: "Stakeholder Management", cluster: "Business Leadership" },
        { id: "campaign_tracking", name: "Campaign Tracking", cluster: "Marketing Execution" }
      ],
      stale: [
        {
          id: "reporting_dashboards",
          name: "Reporting Dashboards",
          cluster: "Data & Analytics",
          reason: "Toolchain volatility is HIGH; 3-year gap means dashboard tools may need quick refresh."
        }
      ],
      missing: [],
      counts: { transferable: 5, stale: 1, missing: 0, total: 6 },
      coverage_pct: 83.3,
      readiness_level: "High",
      provenance: "MODELLED",
      evidence_ids: ["EV-001", "EV-002"]
    };
  }

  if (candidateId === "sample-c") {
    return {
      target_role: { id: "hr_manager", name: "HR Manager" },
      transferable: [
        { id: "employee_engagement", name: "Employee Engagement", cluster: "People Operations" },
        { id: "stakeholder_management", name: "Stakeholder Management", cluster: "Business Leadership" }
      ],
      stale: [],
      missing: [
        { id: "talent_acquisition", name: "Talent Acquisition", cluster: "People Operations" },
        { id: "hr_analytics", name: "HR Analytics", cluster: "People Operations" },
        { id: "hris_tools", name: "HRIS Tools", cluster: "People Operations" }
      ],
      counts: { transferable: 2, stale: 0, missing: 3, total: 5 },
      coverage_pct: 40.0,
      readiness_level: "Emerging",
      provenance: "MODELLED",
      evidence_ids: ["EV-001"]
    };
  }

  // Default: sample-b -> data_analyst
  return {
    ...transitionResponseB,
    readiness_level: "Moderate",
    evidence_ids: ["EV-001", "EV-002"]
  };
}

/**
 * Runs Scenario Simulation with parameterized inputs.
 */
export async function getSimulation(params = {}) {
  const remote = await tryFetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (remote) return remote;

  const gapYears = Number(params.gapYears ?? 3);
  const includeCert = Boolean(params.includeCertificate);
  const includeAvailability = Boolean(params.includeAvailability);

  // Scaled calculations based on EV-001 and EV-002 empirical foundations
  const baseRate = 67; // continuously employed reference pass likelihood %
  // EV-001: 49% penalty at 3+ years
  const gapPenaltyFactor = Math.min(gapYears / 3, 1.0) * 0.49;
  const versionAPass = Math.round(baseRate * (1 - gapPenaltyFactor) * 10) / 10;

  // EV-002: +15% relative lift from duration reframing
  const versionBPass = Math.round(versionAPass * 1.15 * 10) / 10;

  // Version C: includes +5% competency clusters + optional availability
  const clusterLift = 1.05;
  const availLift = includeAvailability ? 1.05 : 1.02;
  const versionCPass = Math.round(versionBPass * clusterLift * availLift * 10) / 10;

  // Control: Upskilling cert adds 0% statistically significant lift (EV-001)
  const certPass = includeCert ? versionAPass : versionAPass;

  return {
    versions: [
      {
        id: "A",
        label: "Chronological Baseline",
        representation: "CHRONOLOGICAL",
        pass_likelihood_pct: versionAPass,
        resume_preview: [
          "Marketing Manager — Consumer Goods (FMCG) · 2013 – 2020",
          `Career break · 2020 – ${2020 + gapYears}`
        ],
        drivers: [
          {
            label: "Reference pass likelihood of continuously employed candidate",
            effect: "BASE",
            value_pct: baseRate,
            provenance: "SIMULATED",
            evidence_id: null
          },
          {
            label: `Career-break penalty scaled to ${gapYears}-year gap`,
            effect: "RELATIVE_CHANGE",
            value_pct: -Math.round(gapPenaltyFactor * 100),
            provenance: "EMPIRICAL",
            evidence_id: "EV-001"
          }
        ],
        provenance: "SIMULATED"
      },
      {
        id: "B",
        label: "Experience Duration Framing",
        representation: "DURATION",
        pass_likelihood_pct: versionBPass,
        resume_preview: [
          "Marketing Manager — Consumer Goods (FMCG) · 7.2 years of experience"
        ],
        drivers: [
          {
            label: "Reference pass likelihood of continuously employed candidate",
            effect: "BASE",
            value_pct: baseRate,
            provenance: "SIMULATED",
            evidence_id: null
          },
          {
            label: `Career-break penalty scaled to ${gapYears}-year gap`,
            effect: "RELATIVE_CHANGE",
            value_pct: -Math.round(gapPenaltyFactor * 100),
            provenance: "EMPIRICAL",
            evidence_id: "EV-001"
          },
          {
            label: "Experience-duration reframing (relative lift)",
            effect: "RELATIVE_CHANGE",
            value_pct: 15,
            provenance: "EMPIRICAL",
            evidence_id: "EV-002"
          }
        ],
        provenance: "SIMULATED"
      },
      {
        id: "C",
        label: "Candidate-Optimized Framing",
        representation: "OPTIMIZED",
        pass_likelihood_pct: versionCPass,
        resume_preview: [
          "Marketing Manager — Consumer Goods (FMCG) · 7.2 years of experience",
          "Business Leadership: P&L Leadership, Stakeholder Management",
          "Data & Analytics: Analytics, Business Intelligence, Excel, Reporting Dashboards",
          "Marketing Execution: Campaign Tracking",
          "Marketing Strategy: Brand Strategy",
          includeAvailability
            ? "Availability: ready to start immediately"
            : "Availability: full-time re-entry"
        ],
        drivers: [
          {
            label: "Reference pass likelihood of continuously employed candidate",
            effect: "BASE",
            value_pct: baseRate,
            provenance: "SIMULATED",
            evidence_id: null
          },
          {
            label: `Career-break penalty scaled to ${gapYears}-year gap`,
            effect: "RELATIVE_CHANGE",
            value_pct: -Math.round(gapPenaltyFactor * 100),
            provenance: "EMPIRICAL",
            evidence_id: "EV-001"
          },
          {
            label: "Experience-duration reframing (relative lift)",
            effect: "RELATIVE_CHANGE",
            value_pct: 15,
            provenance: "EMPIRICAL",
            evidence_id: "EV-002"
          },
          {
            label: "Structured competency clusters",
            effect: "RELATIVE_CHANGE",
            value_pct: 5,
            provenance: "SIMULATED",
            evidence_id: null
          },
          {
            label: "Explicit availability indicator",
            effect: "RELATIVE_CHANGE",
            value_pct: includeAvailability ? 5 : 2,
            provenance: "SIMULATED",
            evidence_id: null
          }
        ],
        provenance: "SIMULATED"
      }
    ],
    control_certificate: {
      label: "Chronological + upskilling certificate",
      pass_likelihood_pct: certPass,
      note: "No statistically significant change in callbacks was found for upskilling certificates (EV-001).",
      provenance: "EMPIRICAL",
      evidence_id: "EV-001"
    },
    benchmark_index: [
      { label: "Continuous employment", value: 100, provenance: "SIMULATED" },
      { label: "Career gap, chronological", value: Math.round(100 * (1 - gapPenaltyFactor)), provenance: "EMPIRICAL" },
      { label: "Gap + upskilling certificate", value: Math.round(100 * (1 - gapPenaltyFactor)), provenance: "EMPIRICAL" },
      { label: "Gap + duration reframing", value: Math.round(100 * (1 - gapPenaltyFactor) * 1.15), provenance: "EMPIRICAL" }
    ],
    assumptions: simulateResponseA.assumptions,
    limitations: simulateResponseA.limitations
  };
}

/**
 * Runs Employer Screening Audit against candidate rules.
 */
export async function getAudit(ruleSetId = "deck-rules", customRules = null) {
  const remote = await tryFetch(`/api/audit?ruleset=${ruleSetId}`);
  if (remote) return remote;

  if (ruleSetId === "mixed-rules") {
    return {
      results: [
        {
          line_number: 1,
          rule_text: "Resume must list exact employment dates for every role",
          matched_rule_id: "AR-004",
          matched_rule_name: "Mandatory date-based chronology",
          risk_level: "HIGH",
          impact: "Precludes duration reframing (EV-002) and exposes returnees to 49% callback drop (EV-001).",
          recommended_intervention: "Permit cumulative tenure duration presentation in application intake.",
          evidence_ids: ["EV-001", "EV-002"],
          provenance: "MODELLED"
        },
        {
          line_number: 2,
          rule_text: "Graduated within the last 5 years",
          matched_rule_id: "AR-005",
          matched_rule_name: "Recent graduation requirement",
          risk_level: "HIGH",
          impact: "Functions as disguised age and career-stage discrimination.",
          recommended_intervention: "Replace graduation recency with relevant competency demonstration.",
          evidence_ids: [],
          provenance: "MODELLED"
        },
        {
          line_number: 3,
          rule_text: "Hands-on experience with Python in the last 12 months",
          matched_rule_id: "AR-006",
          matched_rule_name: "12-month recency constraint",
          risk_level: "MEDIUM",
          impact: "Screens out capable developers returning from family care.",
          recommended_intervention: "Allow coding challenge or recent portfolio repo verification.",
          evidence_ids: ["EV-001"],
          provenance: "MODELLED"
        },
        {
          line_number: 4,
          rule_text: "Must be a team player",
          matched_rule_id: "AR-007",
          matched_rule_name: "Generic behavioral descriptor",
          risk_level: "LOW",
          impact: "Safe non-discriminatory behavioral guideline.",
          recommended_intervention: "Maintain as secondary interview criterion.",
          evidence_ids: [],
          provenance: "MODELLED"
        },
        {
          line_number: 5,
          rule_text: "3+ years experience in sales",
          matched_rule_id: "AR-008",
          matched_rule_name: "Cumulative experience threshold",
          risk_level: "LOW",
          impact: "Valid merit-based cumulative requirement that does not penalize career breaks.",
          recommended_intervention: "Keep in place; ensure cumulative rather than continuous tenure.",
          evidence_ids: [],
          provenance: "MODELLED"
        },
        {
          line_number: 6,
          rule_text: "Candidates with no career breaks preferred",
          matched_rule_id: "AR-009",
          matched_rule_name: "Explicit break penalty bias",
          risk_level: "HIGH",
          impact: "Directly institutionalizes the 49% break penalty discovered in EV-001.",
          recommended_intervention: "Immediately eliminate preference; audit recruiter decision notes.",
          evidence_ids: ["EV-001"],
          provenance: "MODELLED"
        }
      ],
      summary: { total_rules: 6, flagged: 4, high: 3, medium: 1, low: 2, none: 0 }
    };
  }

  // Default: deck-rules
  return auditResponseDeck;
}
