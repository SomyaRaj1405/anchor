"""Anchor Data Loader Module.

Responsible for loading and caching reference JSON datasets:
- ontology.json -> Ontology
- evidence_registry.json -> EvidenceRegistry
- simulation_params.json -> SimulationParams
- audit_rules.json -> AuditRuleLibrary
- samples.json -> Samples
"""

from pathlib import Path

from app.schemas import (
    AuditRuleLibrary,
    EvidenceRegistry,
    Ontology,
    Samples,
    SimulationParams,
)

DATA_DIR = Path(__file__).resolve().parent / "data"

# Cached instances
_ontology: Ontology | None = None
_registry: EvidenceRegistry | None = None
_params: SimulationParams | None = None
_audit_library: AuditRuleLibrary | None = None
_samples: Samples | None = None


def get_ontology() -> Ontology:
    """Return cached ontology dataset (skills and roles)."""
    global _ontology
    if _ontology is None:
        file_path = DATA_DIR / "ontology.json"
        _ontology = Ontology.model_validate_json(file_path.read_text(encoding="utf-8"))
    return _ontology


def get_registry() -> EvidenceRegistry:
    """Return cached evidence registry dataset."""
    global _registry
    if _registry is None:
        file_path = DATA_DIR / "evidence_registry.json"
        _registry = EvidenceRegistry.model_validate_json(file_path.read_text(encoding="utf-8"))
    return _registry


def get_params() -> SimulationParams:
    """Return cached simulation parameters dataset."""
    global _params
    if _params is None:
        file_path = DATA_DIR / "simulation_params.json"
        _params = SimulationParams.model_validate_json(file_path.read_text(encoding="utf-8"))
    return _params


def get_audit_library() -> AuditRuleLibrary:
    """Return cached audit rule library dataset."""
    global _audit_library
    if _audit_library is None:
        file_path = DATA_DIR / "audit_rules.json"
        _audit_library = AuditRuleLibrary.model_validate_json(file_path.read_text(encoding="utf-8"))
    return _audit_library


def get_samples() -> Samples:
    """Return cached sample candidate profiles and rule sets."""
    global _samples
    if _samples is None:
        file_path = DATA_DIR / "samples.json"
        _samples = Samples.model_validate_json(file_path.read_text(encoding="utf-8"))
    return _samples


def reset_cache() -> None:
    """Reset cached datasets for testing purposes."""
    global _ontology, _registry, _params, _audit_library, _samples
    _ontology = None
    _registry = None
    _params = None
    _audit_library = None
    _samples = None
