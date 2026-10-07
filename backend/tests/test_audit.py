"""Tests for Anchor Audit Engine.

Validates screening rule matching against the Anchor audit rule library.
"""

import pytest
from app.engines.audit import run_audit
from app.loader import get_audit_library, get_samples
from app.schemas import RiskLevel


@pytest.fixture
def library():
    return get_audit_library()


@pytest.fixture
def samples():
    return get_samples()


def test_audit_deck_rules(library, samples):
    """Deck sample rules match expected 2 HIGH, 1 MEDIUM."""
    deck_rules = samples.audit_rule_sets[0].rules
    res = run_audit(deck_rules, library)

    assert res.summary.total_rules == 3
    assert res.summary.flagged == 3
    assert res.summary.high == 2
    assert res.summary.medium == 1
    assert res.summary.low == 0
    assert res.summary.none == 0


def test_audit_bullet_stripping(library):
    """Leading bullets or number markers are stripped cleanly."""
    rules = [
        "- Continuous employment required",
        "1. Most recent title must match",
        "• Mandatory certification within 12 months",
        "2.5 years of marketing experience",
    ]
    res = run_audit(rules, library)

    assert res.results[0].rule_text == "Continuous employment required"
    assert res.results[1].rule_text == "Most recent title must match"
    assert res.results[2].rule_text == "Mandatory certification within 12 months"
    # "2.5 years" marker does not have space after marker, so it is preserved
    assert res.results[3].rule_text == "2.5 years of marketing experience"


def test_audit_unmatched_rule(library):
    """Unmatched rule receives risk_level NONE and null provenance."""
    rules = ["Must be a team player with great energy"]
    res = run_audit(rules, library)

    assert res.summary.total_rules == 1
    assert res.summary.flagged == 0
    assert res.summary.none == 1
    assert res.results[0].risk_level == RiskLevel.NONE
    assert res.results[0].matched_rule_id is None
    assert res.results[0].provenance is None
