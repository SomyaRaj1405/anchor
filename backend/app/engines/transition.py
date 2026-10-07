"""Anchor Transition Engine.

Analyzes transferable, stale, and missing skills when moving to a target role.
Conforms to Appendix A.5 and Section 5.4 of the Anchor Specification.
"""

from app.schemas import (
    CandidateProfile,
    Ontology,
    Provenance,
    RoleRef,
    SkillRef,
    StaleSkillRef,
    TransitionCounts,
    TransitionResult,
    Volatility,
)


def run_transition(
    profile: CandidateProfile,
    target_role_id: str,
    ontology: Ontology,
) -> TransitionResult:
    """Analyze skill decomposition for target role."""
    role = next((r for r in ontology.roles if r.id == target_role_id), None)
    if not role:
        raise ValueError(f"Unknown target role id '{target_role_id}'")

    gap = profile.gap_years
    transferable: list[SkillRef] = []
    stale: list[StaleSkillRef] = []
    missing: list[SkillRef] = []
    skill_map = {s.id: s for s in ontology.skills}

    for skill_id in role.core_skills:
        skill = skill_map[skill_id]
        if skill_id not in profile.skills:
            missing.append(SkillRef(id=skill.id, name=skill.name, cluster=skill.cluster))
        elif skill.volatility == Volatility.HIGH and gap >= 2:
            stale.append(
                StaleSkillRef(
                    id=skill.id,
                    name=skill.name,
                    cluster=skill.cluster,
                    reason=f"Toolchain volatility is HIGH and the break is {gap:g} years.",
                )
            )
        else:
            transferable.append(SkillRef(id=skill.id, name=skill.name, cluster=skill.cluster))

    counts = TransitionCounts(
        transferable=len(transferable),
        stale=len(stale),
        missing=len(missing),
        total=len(role.core_skills),
    )
    coverage_pct = round(100 * len(transferable) / len(role.core_skills) + 1e-9, 1)

    return TransitionResult(
        target_role=RoleRef(id=role.id, name=role.name),
        transferable=transferable,
        stale=stale,
        missing=missing,
        counts=counts,
        coverage_pct=coverage_pct,
        provenance=Provenance.MODELLED,
    )
