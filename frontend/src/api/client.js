/**
 * API client — data access for Anchor frontend.
 *
 * Serves mock data when the backend is unavailable or VITE_API_BASE is unset.
 * Each function mirrors a backend endpoint and returns structured data.
 */

import evidenceMock from "../mocks/evidence.json";
import ontologyMock from "../mocks/ontology.json";
import samplesMock from "../mocks/samples.json";
import diagnoseResponseMock from "../mocks/diagnose_response_a.json";
import simulateResponseMock from "../mocks/simulate_response_a.json";
import transitionResponseMock from "../mocks/transition_response_b.json";
import auditResponseMock from "../mocks/audit_response_deck.json";

const API_BASE = import.meta.env.VITE_API_BASE || "";

async function tryFetch(path) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function getEvidence() {
  const data = await tryFetch("/api/evidence");
  return data || evidenceMock;
}

export async function getOntology() {
  const data = await tryFetch("/api/ontology");
  return data || ontologyMock;
}

export async function getSamples() {
  const data = await tryFetch("/api/samples");
  return data || samplesMock;
}

export async function getDiagnosis() {
  const data = await tryFetch("/api/diagnose");
  return data || diagnoseResponseMock;
}

export async function getSimulation() {
  const data = await tryFetch("/api/simulate");
  return data || simulateResponseMock;
}

export async function getTransition() {
  const data = await tryFetch("/api/transition");
  return data || transitionResponseMock;
}

export async function getAudit() {
  const data = await tryFetch("/api/audit");
  return data || auditResponseMock;
}
