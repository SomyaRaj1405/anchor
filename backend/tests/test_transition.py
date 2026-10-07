"""Tests for Anchor Transition Engine.

Validates Appendix B.1 and B.5 golden transition results and edge cases.
"""

import pytest
from app.engines.transition import run_transition
from app.loader import get_ontology, get_samples


@pytest.fixture
def ontology():
    return get_ontology()


@pytest.fixture
def samples():
    return get_samples()


def test_transition_sample_b(ontology, samples):
    """Sample B targeting Data Analyst matches Appendix B.5: 5 / 1 / 2 / 8, 62.5%."""
    profile_b = samples.profiles[1].profile
    res = run_transition(profile_b, "data_analyst", ontology)

    assert res.target_role.id == "data_analyst"
    assert res.counts.transferable == 5
    assert res.counts.stale == 1
    assert res.counts.missing == 2
    assert res.counts.total == 8
    assert res.coverage_pct == 62.5


def test_transition_sample_a(ontology, samples):
    """Sample A targeting Marketing Manager: 5 / 1 / 0 / 6, 83.3%."""
    profile_a = samples.profiles[0].profile
    res = run_transition(profile_a, "marketing_manager", ontology)

    assert res.target_role.id == "marketing_manager"
    assert res.counts.transferable == 5
    assert res.counts.stale == 1
    assert res.counts.missing == 0
    assert res.counts.total == 6
    assert res.coverage_pct == 83.3


def test_transition_sample_c(ontology, samples):
    """Sample C targeting HR Manager: 2 / 0 / 3 / 5, 40.0%."""
    profile_c = samples.profiles[2].profile
    res = run_transition(profile_c, "hr_manager", ontology)

    assert res.target_role.id == "hr_manager"
    assert res.counts.transferable == 2
    assert res.counts.stale == 0
    assert res.counts.missing == 3
    assert res.counts.total == 5
    assert res.coverage_pct == 40.0


def test_transition_short_gap_no_stale(ontology, samples):
    """A candidate with a 1-year break and all skills has 0 stale skills."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.gap_years = 1.0
    res = run_transition(profile, "marketing_manager", ontology)
    assert res.counts.stale == 0


def test_transition_unknown_role(ontology, samples):
    """Unknown role id raises ValueError."""
    profile = samples.profiles[0].profile
    with pytest.raises(ValueError, match="Unknown target role id"):
        run_transition(profile, "nonexistent_role", ontology)
