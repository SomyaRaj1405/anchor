"""Anchor Diagnostic Engine.

Calculates the 5 barrier flags, flag summary, recommendation, and capability check.
Conforms to Appendix A.5 and Section 5.2 of Aditya Work Specification.
"""

from app.engines.intervention import classify_intervention
from app.schemas import (
    CandidateProfile,
    DiagnosticResult,
    Flag,
    FlagStatus,
    FlagSummary,
    Level,
    Ontology,
    Provenance,
    ResumeFormat,
    RoleRef,
    Volatility,
)


def fmt(x: float) -> str:
    """Format float cleanly without trailing zero (e.g., 3.0 -> '3', 7.2 -> '7.2')."""
    return f"{x:g}"


def run_diagnostic(
    profile: CandidateProfile,
    ontology: Ontology,
) -> DiagnosticResult:
    """Execute diagnostic barrier flag evaluation."""
    target_role = next((r for r in ontology.roles if r.id == profile.target_role_id), None)
    if not target_role:
        raise ValueError(f"Unknown target role id '{profile.target_role_id}'")

    gap_years = profile.gap_years
    experience_years = profile.experience_years
    gap_str = fmt(gap_years)
    exp_str = fmt(experience_years)

    # 1. Flag: gap_visibility
    points_gv = 2 if gap_years >= 2 else (1 if gap_years >= 1 else 0)
    if profile.resume_format == ResumeFormat.DURATION:
        points_gv = max(0, points_gv - 1)

    if points_gv == 2:
        level_gv = Level.HIGH
        status_gv = FlagStatus.BARRIER
        explanation_gv = (
            f"Chronological date stamps make the {gap_str}-year break visible and can trigger automated ATS disqualification."
        )
    elif points_gv == 1:
        level_gv = Level.MEDIUM
        status_gv = FlagStatus.WATCH
        explanation_gv = (
            "The break is partly visible; a shorter gap or duration-based framing reduces how much screeners notice it."
        )
    else:
        level_gv = Level.LOW
        status_gv = FlagStatus.STRENGTH
        explanation_gv = (
            "The break is short or hidden by duration-based framing, so it is unlikely to trigger date-based screening rules."
        )

    flag_gv = Flag(
        id="gap_visibility",
        label="Career-Gap Visibility",
        level=level_gv,
        status=status_gv,
        explanation=explanation_gv,
        provenance=Provenance.MODELLED,
    )

    # 2. Flag: experience_salience
    if profile.resume_format == ResumeFormat.DURATION:
        if experience_years >= 3:
            level_es = Level.HIGH
            status_es = FlagStatus.STRENGTH
            explanation_es = f"Cumulative experience ({exp_str} years) is stated up front, so recruiters see it first."
        else:
            level_es = Level.MEDIUM
            status_es = FlagStatus.WATCH
            explanation_es = "Experience is visible but not foregrounded."
    else:
        # CHRONOLOGICAL
        ratio = gap_years / max(experience_years, 0.1)
        if ratio >= 0.25:
            level_es = Level.LOW
            status_es = FlagStatus.BARRIER
            explanation_es = f"{exp_str} years of experience are buried beneath the {gap_str}-year break in a date-based resume."
        else:
            level_es = Level.MEDIUM
            status_es = FlagStatus.WATCH
            explanation_es = "Experience is visible but not foregrounded."

    flag_es = Flag(
        id="experience_salience",
        label="Experience Salience",
        level=level_es,
        status=status_es,
        explanation=explanation_es,
        provenance=Provenance.MODELLED,
    )

    # 3. Flag: recent_role_evidence
    if gap_years < 1:
        level_re = Level.HIGH
        status_re = FlagStatus.STRENGTH
        explanation_re = "Strong evidence of recent, relevant activity."
    else:
        non_blank_activities = [a for a in profile.recent_activities if a.strip() != ""]
        n_act = len(non_blank_activities)
        points_re = (1 if experience_years >= 3 else 0) + min(n_act, 2)
        if points_re >= 3:
            level_re = Level.HIGH
            status_re = FlagStatus.STRENGTH
            explanation_re = "Strong evidence of recent, relevant activity."
        elif points_re in (1, 2):
            level_re = Level.MEDIUM
            status_re = FlagStatus.WATCH
            explanation_re = (
                "Relevant domain responsibilities from prior tenure are preserved; adding recent activity would strengthen this."
            )
        else:
            level_re = Level.LOW
            status_re = FlagStatus.BARRIER
            explanation_re = "No recent activity or prior-tenure evidence to show current relevance."

    flag_re = Flag(
        id="recent_role_evidence",
        label="Recent-Role Evidence",
        level=level_re,
        status=status_re,
        explanation=explanation_re,
        provenance=Provenance.MODELLED,
    )

    # 4. Flag: skill_freshness
    skill_map = {s.id: s for s in ontology.skills}
    core_skills = target_role.core_skills
    current_skills = [
        s_id
        for s_id in core_skills
        if s_id in profile.skills
        and not (skill_map[s_id].volatility == Volatility.HIGH and gap_years >= 2)
    ]
    k_curr = len(current_skills)
    n_core = len(core_skills)
    score_sf = k_curr / n_core if n_core > 0 else 0.0

    if score_sf >= 0.75:
        level_sf = Level.HIGH
        status_sf = FlagStatus.STRENGTH
        explanation_sf = (
            f"Core competencies for {target_role.name} remain directly relevant ({k_curr}/{n_core} core skills current)."
        )
    elif score_sf >= 0.5:
        level_sf = Level.MEDIUM
        status_sf = FlagStatus.WATCH
        explanation_sf = (
            f"Most core skills are current ({k_curr}/{n_core}), but some are missing or toolchain-stale."
        )
    else:
        level_sf = Level.LOW
        status_sf = FlagStatus.BARRIER
        explanation_sf = (
            f"Only {k_curr}/{n_core} core skills for {target_role.name} are current; genuine capability refresh is needed."
        )

    flag_sf = Flag(
        id="skill_freshness",
        label="Skill Freshness",
        level=level_sf,
        status=status_sf,
        explanation=explanation_sf,
        provenance=Provenance.MODELLED,
    )

    # 5. Flag: availability_signal
    if profile.availability_stated:
        level_av = Level.HIGH
        status_av = FlagStatus.STRENGTH
        explanation_av = "Availability to return is stated explicitly."
    else:
        level_av = Level.LOW
        status_av = FlagStatus.BARRIER
        explanation_av = "Return-to-work readiness is not prominently signalled."

    flag_av = Flag(
        id="availability_signal",
        label="Availability Signal",
        level=level_av,
        status=status_av,
        explanation=explanation_av,
        provenance=Provenance.MODELLED,
    )

    flags = [flag_gv, flag_es, flag_re, flag_sf, flag_av]

    summary = FlagSummary(
        barrier_count=sum(1 for f in flags if f.status == FlagStatus.BARRIER),
        watch_count=sum(1 for f in flags if f.status == FlagStatus.WATCH),
        strength_count=sum(1 for f in flags if f.status == FlagStatus.STRENGTH),
    )

    recommendation, capability_check = classify_intervention(flags, profile, ontology)

    return DiagnosticResult(
        target_role=RoleRef(id=target_role.id, name=target_role.name),
        flags=flags,
        summary=summary,
        recommendation=recommendation,
        capability_check=capability_check,
    )
