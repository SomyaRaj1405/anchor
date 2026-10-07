"""Anchor Cross-Reference Validation Helpers.

Validates that profile role and skill references exist in the current ontology.
"""

from app.schemas import CandidateProfile, ErrorDetail, Ontology


class ProfileValidationException(Exception):
    """Exception raised when cross-referenced profile entities do not exist in ontology."""

    def __init__(self, details: list[ErrorDetail], message: str = "Invalid request"):
        super().__init__(message)
        self.details = details
        self.message = message


def validate_profile_refs(profile: CandidateProfile, ontology: Ontology) -> None:
    """Validate that candidate profile role and skill IDs exist in ontology."""
    role_ids = {r.id for r in ontology.roles}
    skill_ids = {s.id for s in ontology.skills}
    details: list[ErrorDetail] = []

    if profile.current_or_last_role_id not in role_ids:
        details.append(
            ErrorDetail(
                field="profile.current_or_last_role_id",
                message=f"Unknown role id '{profile.current_or_last_role_id}'",
            )
        )

    if profile.target_role_id not in role_ids:
        details.append(
            ErrorDetail(
                field="profile.target_role_id",
                message=f"Unknown role id '{profile.target_role_id}'",
            )
        )

    for idx, skill_id in enumerate(profile.skills):
        if skill_id not in skill_ids:
            details.append(
                ErrorDetail(
                    field=f"profile.skills[{idx}]",
                    message=f"Unknown skill id '{skill_id}'",
                )
            )

    if details:
        raise ProfileValidationException(details=details)
