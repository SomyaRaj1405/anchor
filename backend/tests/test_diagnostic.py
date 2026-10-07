"""Tests for Anchor Diagnostic Engine.

Validates Appendix B.1 and B.3 golden diagnostic outcomes and edge cases.
"""

import pytest
from app.engines.diagnostic import run_diagnostic
from app.loader import get_ontology, get_samples
from app.schemas import FlagStatus, Intervention, Level, ResumeFormat


@pytest.fixture
def ontology():
    return get_ontology()


@pytest.fixture
def samples():
    return get_samples()


def test_diagnostic_golden_a(ontology, samples):
    """Sample A matches Appendix B.3."""
    profile_a = samples.profiles[0].profile
    res = run_diagnostic(profile_a, ontology)

    assert res.target_role.id == "marketing_manager"
    levels = [f.level for f in res.flags]
    assert levels == [Level.HIGH, Level.LOW, Level.MEDIUM, Level.HIGH, Level.LOW]
    assert res.summary.barrier_count == 3
    assert res.summary.watch_count == 1
    assert res.summary.strength_count == 1
    assert res.recommendation.intervention == Intervention.REFRAME
    assert not res.capability_check.qualification_limiting


def test_diagnostic_golden_b(ontology, samples):
    """Sample B (Sample A targeting Data Analyst): TRANSITION, summary 3 / 2 / 0."""
    profile_b = samples.profiles[1].profile
    res = run_diagnostic(profile_b, ontology)

    assert res.target_role.id == "data_analyst"
    levels = [f.level for f in res.flags]
    assert levels == [Level.HIGH, Level.LOW, Level.MEDIUM, Level.MEDIUM, Level.LOW]
    assert res.summary.barrier_count == 3
    assert res.summary.watch_count == 2
    assert res.summary.strength_count == 0
    assert res.recommendation.intervention == Intervention.TRANSITION
    assert not res.capability_check.qualification_limiting


def test_diagnostic_golden_c(ontology, samples):
    """Sample C: RESKILL, qualification_limiting true."""
    profile_c = samples.profiles[2].profile
    res = run_diagnostic(profile_c, ontology)

    assert res.target_role.id == "hr_manager"
    levels = [f.level for f in res.flags]
    assert levels == [Level.HIGH, Level.LOW, Level.MEDIUM, Level.LOW, Level.HIGH]
    assert res.summary.barrier_count == 3
    assert res.summary.watch_count == 1
    assert res.summary.strength_count == 1
    assert res.recommendation.intervention == Intervention.RESKILL
    assert res.capability_check.qualification_limiting


def test_diagnostic_duration_format(ontology, samples):
    """Duration format reduces gap visibility and increases salience."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.resume_format = ResumeFormat.DURATION
    res = run_diagnostic(profile, ontology)

    gv = next(f for f in res.flags if f.id == "gap_visibility")
    es = next(f for f in res.flags if f.id == "experience_salience")
    assert gv.level == Level.MEDIUM
    assert gv.status == FlagStatus.WATCH
    assert es.level == Level.HIGH
    assert es.status == FlagStatus.STRENGTH
    assert res.recommendation.intervention == Intervention.REFRAME


def test_diagnostic_short_gap(ontology, samples):
    """Short gap (0.5 years): gap visibility LOW, recent-role evidence HIGH."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.gap_years = 0.5
    res = run_diagnostic(profile, ontology)

    gv = next(f for f in res.flags if f.id == "gap_visibility")
    re = next(f for f in res.flags if f.id == "recent_role_evidence")
    assert gv.level == Level.LOW
    assert re.level == Level.HIGH


def test_diagnostic_declining_role(ontology, samples):
    """Declining role outlook leads to TRANSITION."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.current_or_last_role_id = "data_entry_operator"
    profile.target_role_id = "data_entry_operator"
    profile.skills = ["excel", "process_mapping"]
    res = run_diagnostic(profile, ontology)

    assert res.recommendation.intervention == Intervention.TRANSITION


def test_diagnostic_recent_activity(ontology, samples):
    """Two non-blank recent activities with >= 3 yrs exp elevates recent-role evidence to HIGH."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.recent_activities = ["Consulting project", "Open source leadership"]
    res = run_diagnostic(profile, ontology)

    re = next(f for f in res.flags if f.id == "recent_role_evidence")
    assert re.level == Level.HIGH
    assert re.status == FlagStatus.STRENGTH


def test_diagnostic_determinism(ontology, samples):
    """Running identical profile produces identical result."""
    profile_a = samples.profiles[0].profile
    res1 = run_diagnostic(profile_a, ontology)
    res2 = run_diagnostic(profile_a, ontology)
    assert res1.model_dump() == res2.model_dump()
