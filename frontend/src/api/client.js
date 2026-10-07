/**
 * API client – thin wrapper around fetch.
 *
 * While the backend API is under development this module falls back to
 * the local mock data so that the Evidence page can render immediately.
 */

import evidenceMock from "../mocks/evidence.json";

const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Fetch the evidence registry.
 * Tries the backend first; falls back to bundled mock data.
 */
export async function getEvidence() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/evidence`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      /* fall through to mock */
    }
  }
  return evidenceMock;
}
