"""Contract Golden Tests.

Uses FastAPI TestClient with ANCHOR_STUB=0 to test live endpoints
against the frozen contract examples in contract/examples/.
"""

import json
from pathlib import Path

import pytest
from app.main import app
from fastapi.testclient import TestClient

EXAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "contract" / "examples"


@pytest.fixture
def client():
    return TestClient(app)


def assert_approx_equal(actual, expected, tol=0.05):
    """Recursively compare structures, with float tolerance of 0.05."""
    if isinstance(expected, dict):
        assert isinstance(actual, dict)
        for k, v in expected.items():
            assert k in actual, f"Key '{k}' missing from actual output"
            assert_approx_equal(actual[k], v, tol=tol)
    elif isinstance(expected, list):
        assert isinstance(actual, list)
        assert len(actual) == len(expected)
        for a, e in zip(actual, expected):
            assert_approx_equal(a, e, tol=tol)
    elif isinstance(expected, float) or isinstance(actual, float):
        assert abs(float(actual) - float(expected)) <= tol, f"Float mismatch: {actual} vs {expected}"
    else:
        assert actual == expected, f"Value mismatch: {actual!r} vs {expected!r}"


def test_golden_diagnose_a(client):
    """Diagnose Sample A matches golden response."""
    req = json.loads((EXAMPLES_DIR / "diagnose_request_a.json").read_text(encoding="utf-8"))
    expected = json.loads((EXAMPLES_DIR / "diagnose_response_a.json").read_text(encoding="utf-8"))

    res = client.post("/api/diagnose", json=req)
    assert res.status_code == 200
    assert_approx_equal(res.json(), expected)


def test_golden_simulate_a(client):
    """Simulate Sample A matches golden response."""
    req = json.loads((EXAMPLES_DIR / "simulate_request_a.json").read_text(encoding="utf-8"))
    expected = json.loads((EXAMPLES_DIR / "simulate_response_a.json").read_text(encoding="utf-8"))

    res = client.post("/api/simulate", json=req)
    assert res.status_code == 200
    assert_approx_equal(res.json(), expected)


def test_golden_transition_b(client):
    """Transition Sample B matches golden response."""
    req = json.loads((EXAMPLES_DIR / "transition_request_b.json").read_text(encoding="utf-8"))
    expected = json.loads((EXAMPLES_DIR / "transition_response_b.json").read_text(encoding="utf-8"))

    res = client.post("/api/transition", json=req)
    assert res.status_code == 200
    assert_approx_equal(res.json(), expected)


def test_golden_audit_deck(client):
    """Audit deck rules matches golden response."""
    req = json.loads((EXAMPLES_DIR / "audit_request_deck.json").read_text(encoding="utf-8"))
    expected = json.loads((EXAMPLES_DIR / "audit_response_deck.json").read_text(encoding="utf-8"))

    res = client.post("/api/audit", json=req)
    assert res.status_code == 200
    assert_approx_equal(res.json(), expected)
