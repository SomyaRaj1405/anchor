"""Anchor Data Loader Module.

Responsible for loading and caching reference JSON datasets:
- ontology.json -> Ontology
- evidence_registry.json -> EvidenceRegistry
- simulation_params.json -> SimulationParams
- audit_rules.json -> AuditRuleLibrary
- samples.json -> Samples

Full loading and validation logic will be implemented in deliverable HA-03.
"""

from pathlib import Path
from typing import Optional

from app.schemas import (
    AuditRuleLibrary,
    EvidenceRegistry,
    Ontology,
    Samples,
    SimulationParams,
)

DATA_DIR = Path(__file__).resolve().parent / "data"

# Cached instances
_ontology: Optional[Ontology] = None
_registry: Optional[EvidenceRegistry] = None
_params: Optional[SimulationParams] = None
_audit_library: Optional[AuditRuleLibrary] = None
_samples: Optional[Samples] = None


def get_ontology() -> Ontology:
    """Return cached ontology dataset (skills and roles)."""
    global _ontology
    if _ontology is None:
        raise NotImplementedError("Data loader logic will be implemented in deliverable HA-03")
    return _ontology


def get_registry() -> EvidenceRegistry:
    """Return cached evidence registry dataset."""
    global _registry
    if _registry is None:
        raise NotImplementedError("Data loader logic will be implemented in deliverable HA-03")
    return _registry


def get_params() -> SimulationParams:
    """Return cached simulation parameters dataset."""
    global _params
    if _params is None:
        raise NotImplementedError("Data loader logic will be implemented in deliverable HA-03")
    return _params


def get_audit_library() -> AuditRuleLibrary:
    """Return cached audit rule library dataset."""
    global _audit_library
    if _audit_library is None:
        raise NotImplementedError("Data loader logic will be implemented in deliverable HA-03")
    return _audit_library


def get_samples() -> Samples:
    """Return cached sample candidate profiles and rule sets."""
    global _samples
    if _samples is None:
        raise NotImplementedError("Data loader logic will be implemented in deliverable HA-03")
    return _samples
