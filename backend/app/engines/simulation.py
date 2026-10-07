"""Anchor Simulation Engine.

Calculates counterfactual screening simulation versions (A, B, C),
resume previews, explanatory drivers, control scenario, and benchmark index.
Conforms to Appendix A.5 and Section 5.4 of Aditya Work Specification.
"""

from collections import defaultdict

from app.schemas import (
    Assumption,
    BenchmarkItem,
    CandidateProfile,
    ControlCertificate,
    Driver,
    DriverEffect,
    Ontology,
    Provenance,
    SimulationParams,
    SimulationResult,
    Version,
    VersionId,
    VersionRepresentation,
)


def fmt(x: float) -> str:
    """Format float cleanly without trailing zero (e.g., 3.0 -> '3', 7.2 -> '7.2')."""
    return f"{x:g}"


def round1(x: float) -> float:
    """Round to 1 decimal place with small epsilon to break float ties cleanly."""
    return round(x + 1e-9, 1)


def run_simulation(
    profile: CandidateProfile,
    ontology: Ontology,
    params: SimulationParams,
) -> SimulationResult:
    """Execute counterfactual simulation engine."""
    ref = params.reference_pass_likelihood_pct.value
    pen_full = params.gap_penalty_pct_at_full.value
    pen_years = params.gap_years_at_full_penalty.value
    lift_reframe = params.reframing_relative_lift_pct.value
    lift_cluster = params.competency_cluster_lift_pct.value
    lift_avail = params.availability_indicator_lift_pct.value
    lift_cert = params.certificate_lift_pct.value
    cap = params.max_pass_likelihood_pct.value

    gap_years = profile.gap_years
    experience_years = profile.experience_years

    # 1. Penalty
    penalty_pct = pen_full * min(gap_years / pen_years, 1.0)

    # 2. Version A
    a_raw = ref * (1.0 - penalty_pct / 100.0)

    # 3. Version B
    if gap_years > 0:
        b_raw = a_raw * (1.0 + lift_reframe / 100.0)
    else:
        b_raw = a_raw

    # 4. Version C
    c_raw = b_raw
    lever_cluster = len(profile.skills) >= 3
    if lever_cluster:
        c_raw = c_raw * (1.0 + lift_cluster / 100.0)

    lever_avail = not profile.availability_stated
    if lever_avail:
        c_raw = c_raw * (1.0 + lift_avail / 100.0)

    # 5. Cap & 6. Round
    a_pass = round1(min(a_raw, cap))
    b_pass = round1(min(b_raw, cap))
    c_pass = round1(min(c_raw, cap))

    # Control certificate
    control_raw = min(a_raw * (1.0 + lift_cert / 100.0), cap)
    control_pass = round1(control_raw)

    # Resume previews
    current_role = next(
        (r for r in ontology.roles if r.id == profile.current_or_last_role_id),
        None,
    )
    role_name = current_role.name if current_role else profile.current_or_last_role_id
    ind = profile.industry
    years_str = f"{fmt(experience_years)} years"

    # Preview A
    preview_a: list[str] = []
    if profile.experience_start_year is not None and profile.experience_end_year is not None:
        preview_a.append(
            f"{role_name} — {ind} · {profile.experience_start_year} – {profile.experience_end_year}"
        )
        if gap_years > 0:
            if profile.reentry_year is not None:
                preview_a.append(
                    f"Career break · {profile.experience_end_year} – {profile.reentry_year}"
                )
            else:
                preview_a.append(f"Career break · {fmt(gap_years)} years")
    else:
        preview_a.append(f"{role_name} — {ind}")
        if gap_years > 0:
            preview_a.append(f"Career break · {fmt(gap_years)} years")

    # Preview B
    preview_b = [f"{role_name} — {ind} · {years_str} of experience"]

    # Preview C
    preview_c = [f"{role_name} — {ind} · {years_str} of experience"]
    skill_map = {s.id: s for s in ontology.skills}
    clusters_map: dict[str, list[str]] = defaultdict(list)
    for s_id in profile.skills:
        if s_id in skill_map:
            skill = skill_map[s_id]
            clusters_map[skill.cluster].append(skill.name)

    for cluster in sorted(clusters_map.keys()):
        skill_names = sorted(clusters_map[cluster])
        preview_c.append(f"{cluster}: {', '.join(skill_names)}")
    preview_c.append("Availability: ready to start immediately")

    # Drivers
    driver_base = Driver(
        label="Reference pass likelihood of a continuously employed candidate",
        effect=DriverEffect.BASE,
        value_pct=ref,
        provenance=Provenance.SIMULATED,
        evidence_id=None,
    )
    drivers_a = [driver_base]
    if gap_years > 0:
        drivers_a.append(
            Driver(
                label=f"Career-break penalty scaled to a {fmt(gap_years)}-year gap",
                effect=DriverEffect.RELATIVE_CHANGE,
                value_pct=-round1(penalty_pct),
                provenance=Provenance.EMPIRICAL,
                evidence_id="EV-001",
            )
        )

    drivers_b = list(drivers_a)
    if gap_years > 0:
        drivers_b.append(
            Driver(
                label="Experience-duration reframing (relative lift)",
                effect=DriverEffect.RELATIVE_CHANGE,
                value_pct=lift_reframe,
                provenance=Provenance.EMPIRICAL,
                evidence_id="EV-002",
            )
        )

    drivers_c = list(drivers_b)
    if lever_cluster:
        drivers_c.append(
            Driver(
                label="Structured competency clusters",
                effect=DriverEffect.RELATIVE_CHANGE,
                value_pct=lift_cluster,
                provenance=Provenance.SIMULATED,
                evidence_id=None,
            )
        )
    if lever_avail:
        drivers_c.append(
            Driver(
                label="Explicit availability indicator",
                effect=DriverEffect.RELATIVE_CHANGE,
                value_pct=lift_avail,
                provenance=Provenance.SIMULATED,
                evidence_id=None,
            )
        )

    versions = [
        Version(
            id=VersionId.A,
            label="Chronological Baseline",
            representation=VersionRepresentation.CHRONOLOGICAL,
            pass_likelihood_pct=a_pass,
            resume_preview=preview_a,
            drivers=drivers_a,
            provenance=Provenance.SIMULATED,
        ),
        Version(
            id=VersionId.B,
            label="Experience Duration Framing",
            representation=VersionRepresentation.DURATION,
            pass_likelihood_pct=b_pass,
            resume_preview=preview_b,
            drivers=drivers_b,
            provenance=Provenance.SIMULATED,
        ),
        Version(
            id=VersionId.C,
            label="Candidate-Optimized Framing",
            representation=VersionRepresentation.OPTIMIZED,
            pass_likelihood_pct=c_pass,
            resume_preview=preview_c,
            drivers=drivers_c,
            provenance=Provenance.SIMULATED,
        ),
    ]

    control_certificate = ControlCertificate(
        label="Chronological + upskilling certificate",
        pass_likelihood_pct=control_pass,
        note="No statistically significant change in callbacks was found for upskilling certificates (EV-001).",
        provenance=Provenance.EMPIRICAL,
        evidence_id="EV-001",
    )

    # Benchmark index
    if gap_years == 0:
        benchmark_index = [
            BenchmarkItem(label="Continuous employment", value=100.0, provenance=Provenance.SIMULATED),
            BenchmarkItem(label="Career gap, chronological", value=100.0, provenance=Provenance.EMPIRICAL),
            BenchmarkItem(label="Gap + upskilling certificate", value=100.0, provenance=Provenance.EMPIRICAL),
            BenchmarkItem(label="Gap + duration reframing", value=100.0, provenance=Provenance.EMPIRICAL),
        ]
    else:
        gap_idx = 100.0 * (1.0 - penalty_pct / 100.0)
        benchmark_index = [
            BenchmarkItem(label="Continuous employment", value=100.0, provenance=Provenance.SIMULATED),
            BenchmarkItem(label="Career gap, chronological", value=round1(gap_idx), provenance=Provenance.EMPIRICAL),
            BenchmarkItem(
                label="Gap + upskilling certificate",
                value=round1(gap_idx * (1.0 + lift_cert / 100.0)),
                provenance=Provenance.EMPIRICAL,
            ),
            BenchmarkItem(
                label="Gap + duration reframing",
                value=round1(gap_idx * (1.0 + lift_reframe / 100.0)),
                provenance=Provenance.EMPIRICAL,
            ),
        ]

    assumptions = [
        Assumption(
            key="reference_pass_likelihood_pct",
            value=params.reference_pass_likelihood_pct.value,
            provenance=params.reference_pass_likelihood_pct.provenance,
            note=params.reference_pass_likelihood_pct.note,
        ),
        Assumption(
            key="gap_penalty_pct_at_full",
            value=params.gap_penalty_pct_at_full.value,
            provenance=params.gap_penalty_pct_at_full.provenance,
            note=params.gap_penalty_pct_at_full.note,
        ),
        Assumption(
            key="gap_years_at_full_penalty",
            value=params.gap_years_at_full_penalty.value,
            provenance=params.gap_years_at_full_penalty.provenance,
            note=params.gap_years_at_full_penalty.note,
        ),
        Assumption(
            key="reframing_relative_lift_pct",
            value=params.reframing_relative_lift_pct.value,
            provenance=params.reframing_relative_lift_pct.provenance,
            note=params.reframing_relative_lift_pct.note,
        ),
        Assumption(
            key="competency_cluster_lift_pct",
            value=params.competency_cluster_lift_pct.value,
            provenance=params.competency_cluster_lift_pct.provenance,
            note=params.competency_cluster_lift_pct.note,
        ),
        Assumption(
            key="availability_indicator_lift_pct",
            value=params.availability_indicator_lift_pct.value,
            provenance=params.availability_indicator_lift_pct.provenance,
            note=params.availability_indicator_lift_pct.note,
        ),
        Assumption(
            key="certificate_lift_pct",
            value=params.certificate_lift_pct.value,
            provenance=params.certificate_lift_pct.provenance,
            note=params.certificate_lift_pct.note,
        ),
        Assumption(
            key="max_pass_likelihood_pct",
            value=params.max_pass_likelihood_pct.value,
            provenance=params.max_pass_likelihood_pct.provenance,
            note=params.max_pass_likelihood_pct.note,
        ),
    ]

    limitations = [
        "Published statistics describe populations, not individuals; Anchor never predicts an individual's outcome.",
        "EV-001 was run in India and EV-002 in the United Kingdom; transferability between labour markets is not established.",
        "Pass likelihoods are scenario projections (SIMULATED) built from the listed assumptions; they are not measured callback rates.",
    ]

    return SimulationResult(
        versions=versions,
        control_certificate=control_certificate,
        benchmark_index=benchmark_index,
        assumptions=assumptions,
        limitations=limitations,
    )
