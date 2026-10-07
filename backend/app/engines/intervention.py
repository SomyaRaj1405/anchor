"""Anchor Intervention Engine.

Classifies recommended intervention and performs capability check.
Conforms to Appendix A.5 and Section 5.3 of Aditya Work Specification.
"""

from app.schemas import (
    CandidateProfile,
    CapabilityCheck,
    Flag,
    Intervention,
    Level,
    Ontology,
    Outlook,
    Recommendation,
)


def classify_intervention(
    flags: list[Flag],
    profile: CandidateProfile,
    ontology: Ontology,
) -> tuple[Recommendation, CapabilityCheck]:
    """Classify recommended intervention and evaluate whether qualification is limiting."""
    current_role = next((r for r in ontology.roles if r.id == profile.current_or_last_role_id), None)
    freshness_flag = next(f for f in flags if f.id == "skill_freshness")

    # Evaluate in order and stop at first match
    if profile.current_or_last_role_id != profile.target_role_id or (
        current_role and current_role.outlook == Outlook.DECLINING
    ):
        intervention = Intervention.TRANSITION
        title = "Transition — Target Role Realignment"
        rationale = "The target role differs from the prior role, or the prior role's outlook is declining."
        prescribed_action = (
            "Map transferable capabilities to the target role (see the Transition module) and reframe the profile around them."
        )
        also_apply = ["REFRAME"]
        evidence_ids = []
    elif freshness_flag.level == Level.LOW:
        intervention = Intervention.RESKILL
        title = "Reskill — Targeted Capability Refresh"
        rationale = "Presentation barriers exist and core skills for the target role are stale or missing."
        prescribed_action = "Validate only the missing or stale tools, then apply experience-duration framing."
        also_apply = ["REFRAME"]
        evidence_ids = ["EV-001", "EV-002"]
    else:
        intervention = Intervention.REFRAME
        title = "Reframe — Presentation & Signaling"
        rationale = "Experience and competencies are intact; the limiting barrier is how the profile is presented."
        prescribed_action = "Replace employment dates with experience-duration framing and surface key achievements."
        also_apply = []
        evidence_ids = ["EV-002", "EV-001"]

    qualification_limiting = freshness_flag.level == Level.LOW
    capability_explanation = (
        "Capability gaps are real; targeted reskilling is justified, but only for the missing or stale skills."
        if qualification_limiting
        else "Qualification does not appear to be the limiting barrier; presentation changes should come before any coursework."
    )

    rec = Recommendation(
        intervention=intervention,
        title=title,
        rationale=rationale,
        prescribed_action=prescribed_action,
        also_apply=also_apply,
        evidence_ids=evidence_ids,
    )
    cap = CapabilityCheck(
        qualification_limiting=qualification_limiting,
        explanation=capability_explanation,
    )
    return rec, cap
