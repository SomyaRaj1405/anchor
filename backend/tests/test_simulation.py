"""Tests for Anchor Simulation Engine.

Validates Appendix B.1 and B.4 golden counterfactual simulation results and edge cases.
"""

import pytest
from app.engines.simulation import run_simulation
from app.loader import get_ontology, get_params, get_samples


@pytest.fixture
def ontology():
    return get_ontology()


@pytest.fixture
def params():
    return get_params()


@pytest.fixture
def samples():
    return get_samples()


def test_simulation_golden_a(ontology, params, samples):
    """Sample A matches Appendix B.4."""
    profile_a = samples.profiles[0].profile
    res = run_simulation(profile_a, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 34.2
    assert res.versions[1].pass_likelihood_pct == 39.3
    assert res.versions[2].pass_likelihood_pct == 43.3
    assert res.control_certificate.pass_likelihood_pct == 34.2

    benchmark_vals = [b.value for b in res.benchmark_index]
    assert benchmark_vals == [100.0, 51.0, 51.0, 58.7]
    assert len(res.limitations) == 3


def test_simulation_golden_c(ontology, params, samples):
    """Sample C: C equals B (34.2 / 39.3 / 39.3)."""
    profile_c = samples.profiles[2].profile
    res = run_simulation(profile_c, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 34.2
    assert res.versions[1].pass_likelihood_pct == 39.3
    assert res.versions[2].pass_likelihood_pct == 39.3


def test_simulation_availability_stated(ontology, params, samples):
    """Sample A with availability_stated = True gives C = 41.3."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.availability_stated = True
    res = run_simulation(profile, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 34.2
    assert res.versions[1].pass_likelihood_pct == 39.3
    assert res.versions[2].pass_likelihood_pct == 41.3


def test_simulation_no_gap(ontology, params, samples):
    """Zero gap: A = 67.0, B = 67.0, C = 73.9; benchmark all 100."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.gap_years = 0.0
    res = run_simulation(profile, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 67.0
    assert res.versions[1].pass_likelihood_pct == 67.0
    assert res.versions[2].pass_likelihood_pct == 73.9
    assert all(b.value == 100.0 for b in res.benchmark_index)
    assert len(res.versions[0].resume_preview) == 1


def test_simulation_half_gap(ontology, params, samples):
    """1.5-year gap: A 50.6, B 58.2, C 64.1."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.gap_years = 1.5
    res = run_simulation(profile, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 50.6
    assert res.versions[1].pass_likelihood_pct == 58.2
    assert res.versions[2].pass_likelihood_pct == 64.1


def test_simulation_long_gap_capped(ontology, params, samples):
    """6-year gap penalty capped at 3 years: 34.2 / 39.3 / 43.3."""
    profile = samples.profiles[0].profile.model_copy(deep=True)
    profile.gap_years = 6.0
    res = run_simulation(profile, ontology, params)

    assert res.versions[0].pass_likelihood_pct == 34.2
    assert res.versions[1].pass_likelihood_pct == 39.3
    assert res.versions[2].pass_likelihood_pct == 43.3


def test_simulation_custom_cap(ontology, params, samples):
    """Custom max pass cap is respected."""
    custom_params = params.model_copy(deep=True)
    custom_params.max_pass_likelihood_pct.value = 40.0
    profile = samples.profiles[0].profile
    res = run_simulation(profile, ontology, custom_params)

    for v in res.versions:
        assert v.pass_likelihood_pct <= 40.0


def test_simulation_preview_text(ontology, params, samples):
    """Resume preview lines formatting."""
    profile = samples.profiles[0].profile
    res = run_simulation(profile, ontology, params)

    assert "2013 – 2020" in res.versions[0].resume_preview[0]
    assert "Career break · 2020 – 2023" in res.versions[0].resume_preview[1]
    assert res.versions[2].resume_preview[-1] == "Availability: ready to start immediately"
