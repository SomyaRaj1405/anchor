"""Anchor End-to-End Live Smoke Test CLI.

Runs comprehensive checks against the running backend server (default http://localhost:8000).
Conforms to Section 5.5 of Hamza Work Specification.
"""

import sys

import httpx


def run_smoke_test(base_url: str = "http://localhost:8000") -> bool:
    """Run smoke test suite against running server."""
    client = httpx.Client(base_url=base_url, timeout=10.0)
    failed = False

    def check(name: str, passed: bool, msg: str = ""):
        nonlocal failed
        status_label = "PASS" if passed else "FAIL"
        if not passed:
            failed = True
            print(f"[{status_label}] {name}: {msg}")
        else:
            print(f"[{status_label}] {name}")

    try:
        # 1. Health
        r = client.get("/api/health")
        check("Health check", r.status_code == 200 and r.json().get("status") == "ok", r.text)

        # 2. Ontology
        r = client.get("/api/ontology")
        ont = r.json()
        check(
            "Ontology (16 skills, 5 roles)",
            r.status_code == 200 and len(ont.get("skills", [])) == 16 and len(ont.get("roles", [])) == 5,
            r.text,
        )

        # 3. Samples
        r = client.get("/api/samples")
        smp = r.json()
        check(
            "Samples (3 profiles, 2 rule sets)",
            r.status_code == 200
            and len(smp.get("profiles", [])) == 3
            and len(smp.get("audit_rule_sets", [])) == 2,
            r.text,
        )

        # 4. Evidence
        r = client.get("/api/evidence")
        ev_list = r.json()
        check(
            "Evidence (2 entries)",
            r.status_code == 200 and len(ev_list.get("entries", [])) == 2,
            r.text,
        )

        # 5. Evidence 404
        r = client.get("/api/evidence/EV-999")
        check(
            "Evidence EV-999 returns 404",
            r.status_code == 404 and r.json().get("error", {}).get("code") == "NOT_FOUND",
            r.text,
        )

        profiles = {p["id"]: p["profile"] for p in smp.get("profiles", [])}

        # 6. Diagnose Sample A
        r = client.post("/api/diagnose", json={"profile": profiles["sample-a"]})
        diag_a = r.json()
        check(
            "Diagnose Sample A -> REFRAME, qual limiting false",
            r.status_code == 200
            and diag_a.get("recommendation", {}).get("intervention") == "REFRAME"
            and not diag_a.get("capability_check", {}).get("qualification_limiting"),
            r.text,
        )

        # 7. Diagnose Sample B
        r = client.post("/api/diagnose", json={"profile": profiles["sample-b"]})
        diag_b = r.json()
        check(
            "Diagnose Sample B -> TRANSITION",
            r.status_code == 200 and diag_b.get("recommendation", {}).get("intervention") == "TRANSITION",
            r.text,
        )

        # 8. Diagnose Sample C
        r = client.post("/api/diagnose", json={"profile": profiles["sample-c"]})
        diag_c = r.json()
        check(
            "Diagnose Sample C -> RESKILL, qual limiting true",
            r.status_code == 200
            and diag_c.get("recommendation", {}).get("intervention") == "RESKILL"
            and diag_c.get("capability_check", {}).get("qualification_limiting"),
            r.text,
        )

        # 9. Simulate Sample A
        r = client.post("/api/simulate", json={"profile": profiles["sample-a"]})
        sim_a = r.json()
        pass_a = [v["pass_likelihood_pct"] for v in sim_a.get("versions", [])]
        check(
            "Simulate Sample A -> [34.2, 39.3, 43.3]",
            r.status_code == 200 and pass_a == [34.2, 39.3, 43.3],
            r.text,
        )

        # 10. Simulate Sample C
        r = client.post("/api/simulate", json={"profile": profiles["sample-c"]})
        sim_c = r.json()
        pass_c = [v["pass_likelihood_pct"] for v in sim_c.get("versions", [])]
        check(
            "Simulate Sample C -> [34.2, 39.3, 39.3]",
            r.status_code == 200 and pass_c == [34.2, 39.3, 39.3],
            r.text,
        )

        # 11. Transition Sample B
        r = client.post("/api/transition", json={"profile": profiles["sample-b"], "target_role_id": "data_analyst"})
        trans_b = r.json()
        counts_b = trans_b.get("counts", {})
        check(
            "Transition Sample B -> 5 / 1 / 2 / 8, 62.5%",
            r.status_code == 200
            and counts_b.get("transferable") == 5
            and counts_b.get("stale") == 1
            and counts_b.get("missing") == 2
            and counts_b.get("total") == 8
            and trans_b.get("coverage_pct") == 62.5,
            r.text,
        )

        # 12. Audit Deck Rules
        deck_rules = smp.get("audit_rule_sets", [])[0].get("rules", [])
        r = client.post("/api/audit", json={"rules": deck_rules})
        audit_res = r.json()
        sum_audit = audit_res.get("summary", {})
        check(
            "Audit Deck Rules -> 2 HIGH, 1 MEDIUM",
            r.status_code == 200 and sum_audit.get("high") == 2 and sum_audit.get("medium") == 1,
            r.text,
        )

        # 13. Invalid input returns 422 standard format
        bad_profile = dict(profiles["sample-a"])
        bad_profile["gap_years"] = -1
        r = client.post("/api/diagnose", json={"profile": bad_profile})
        err = r.json().get("error", {})
        check(
            "Invalid input -> 422 VALIDATION_ERROR standard body",
            r.status_code == 422 and err.get("code") == "VALIDATION_ERROR",
            r.text,
        )

    except (httpx.HTTPError, ValueError, KeyError) as exc:
        print(f"[FAIL] Unexpected error connecting to {base_url}: {exc}")
        return False

    return not failed


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    success = run_smoke_test(url)
    sys.exit(0 if success else 1)
