"""Anchor Data Integrity Verification CLI.

Runnable via:
    python -m app.check_data

Verifies the 8 core integrity constraints before application startup:
1. All five data files exist and parse into their Pydantic models.
2. Skill IDs are unique; role IDs are unique.
3. Every ID in every role's core_skills exists in skills.
4. Every evidence_ids entry in audit_rules.json and non-null evidence_id in simulation_params.json exists in registry. EV-001 and EV-002 exist.
5. Every regular expression in audit_rules.json compiles.
6. simulation_params.json contains all 8 required keys.
7. Every sample profile validates as a CandidateProfile and its skill/role IDs exist in ontology.
8. Baseline dataset counts match: 16 skills, 5 roles, 2 evidence entries, 3 sample profiles, 2 audit rule sets.
"""

import re
import sys
from pathlib import Path

from app.loader import (
    get_audit_library,
    get_ontology,
    get_params,
    get_registry,
    get_samples,
    reset_cache,
)
from app.schemas import CandidateProfile

REQUIRED_PARAM_KEYS = {
    "reference_pass_likelihood_pct",
    "gap_penalty_pct_at_full",
    "gap_years_at_full_penalty",
    "reframing_relative_lift_pct",
    "competency_cluster_lift_pct",
    "availability_indicator_lift_pct",
    "certificate_lift_pct",
    "max_pass_likelihood_pct",
}


def run_checks() -> bool:
    """Execute all 8 data integrity checks.

    Returns True if all checks pass, False otherwise.
    """
    reset_cache()
    try:
        # Check 1: All five data files exist and parse into their Pydantic models
        ontology = get_ontology()
        registry = get_registry()
        params = get_params()
        audit_library = get_audit_library()
        samples = get_samples()
    except (ValueError, KeyError, TypeError, OSError) as exc:
        print(f"Check 1 Failed: Error loading or parsing data files: {exc}", file=sys.stderr)
        return False

    # Check 2: Skill IDs are unique; role IDs are unique
    skill_ids = [s.id for s in ontology.skills]
    if len(skill_ids) != len(set(skill_ids)):
        print("Check 2 Failed: Duplicate skill IDs detected.", file=sys.stderr)
        return False

    role_ids = [r.id for r in ontology.roles]
    if len(role_ids) != len(set(role_ids)):
        print("Check 2 Failed: Duplicate role IDs detected.", file=sys.stderr)
        return False

    skill_set = set(skill_ids)
    role_set = set(role_ids)

    # Check 3: Every ID in every role's core_skills exists in skills
    for role in ontology.roles:
        for skill_id in role.core_skills:
            if skill_id not in skill_set:
                print(f"Check 3 Failed: Role '{role.id}' references unknown skill '{skill_id}'.", file=sys.stderr)
                return False

    # Check 4: Every evidence_ids entry in audit_rules and non-null in params exists in registry; EV-001 and EV-002 exist
    registry_ids = {entry.id for entry in registry.entries}
    if not {"EV-001", "EV-002"}.issubset(registry_ids):
        print("Check 4 Failed: Registry is missing EV-001 or EV-002.", file=sys.stderr)
        return False

    for rule in audit_library.rules:
        for ev_id in rule.evidence_ids:
            if ev_id not in registry_ids:
                print(f"Check 4 Failed: Audit rule '{rule.id}' references unknown evidence '{ev_id}'.", file=sys.stderr)
                return False

    for key, item in params.model_dump().items():
        if isinstance(item, dict) and item.get("evidence_id"):
            ev_id = item["evidence_id"]
            if ev_id not in registry_ids:
                print(f"Check 4 Failed: Simulation param '{key}' references unknown evidence '{ev_id}'.", file=sys.stderr)
                return False

    # Check 5: Every regular expression in audit_rules.json compiles
    for rule in audit_library.rules:
        for pattern in rule.patterns:
            try:
                re.compile(pattern)
            except re.error as err:
                print(f"Check 5 Failed: Regex '{pattern}' in rule '{rule.id}' failed to compile: {err}", file=sys.stderr)
                return False

    # Check 6: simulation_params.json contains all 8 required keys
    param_keys = set(type(params).model_fields.keys())
    if not REQUIRED_PARAM_KEYS.issubset(param_keys):
        missing = REQUIRED_PARAM_KEYS - param_keys
        print(f"Check 6 Failed: Missing simulation param keys: {missing}", file=sys.stderr)
        return False

    # Check 7: Every sample profile validates as a CandidateProfile and its skill/role IDs exist in ontology
    for sample in samples.profiles:
        profile = sample.profile
        if not isinstance(profile, CandidateProfile):
            print(f"Check 7 Failed: Sample '{sample.id}' is not a valid CandidateProfile.", file=sys.stderr)
            return False
        if profile.current_or_last_role_id not in role_set:
            print(f"Check 7 Failed: Sample '{sample.id}' current role '{profile.current_or_last_role_id}' not in ontology.", file=sys.stderr)
            return False
        if profile.target_role_id not in role_set:
            print(f"Check 7 Failed: Sample '{sample.id}' target role '{profile.target_role_id}' not in ontology.", file=sys.stderr)
            return False
        for s_id in profile.skills:
            if s_id not in skill_set:
                print(f"Check 7 Failed: Sample '{sample.id}' skill '{s_id}' not in ontology.", file=sys.stderr)
                return False

    # Check 8: Baseline dataset counts match: 16 skills, 5 roles, 2 evidence entries, 3 sample profiles, 2 audit rule sets
    if len(ontology.skills) != 16 or len(ontology.roles) != 5:
        print(f"Check 8 Failed: Expected 16 skills and 5 roles, got {len(ontology.skills)} and {len(ontology.roles)}.", file=sys.stderr)
        return False
    if len(registry.entries) != 2:
        print(f"Check 8 Failed: Expected 2 evidence entries, got {len(registry.entries)}.", file=sys.stderr)
        return False
    if len(samples.profiles) != 3 or len(samples.audit_rule_sets) != 2:
        print(f"Check 8 Failed: Expected 3 profiles and 2 rule sets, got {len(samples.profiles)} and {len(samples.audit_rule_sets)}.", file=sys.stderr)
        return False

    return True


if __name__ == "__main__":
    # Ensure backend is in sys.path when run directly
    backend_dir = Path(__file__).resolve().parent.parent
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))

    success = run_checks()
    if not success:
        sys.exit(1)
    print("OK")
    sys.exit(0)
