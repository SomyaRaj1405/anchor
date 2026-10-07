"""Anchor Integration Schemas.

Single source of truth for all API contracts, request/response models,
and data models as defined in Appendix A of the Anchor Project Specification.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


# ---------------------------------------------------------------------------
# A.2 Enumerations
# ---------------------------------------------------------------------------

class ResumeFormat(str, Enum):
    CHRONOLOGICAL = "CHRONOLOGICAL"
    DURATION = "DURATION"


class GapReason(str, Enum):
    CAREGIVING = "CAREGIVING"
    HEALTH = "HEALTH"
    RELOCATION = "RELOCATION"
    OTHER = "OTHER"


class Level(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class FlagStatus(str, Enum):
    BARRIER = "BARRIER"
    WATCH = "WATCH"
    STRENGTH = "STRENGTH"


class Intervention(str, Enum):
    REFRAME = "REFRAME"
    RESKILL = "RESKILL"
    TRANSITION = "TRANSITION"


class Provenance(str, Enum):
    EMPIRICAL = "EMPIRICAL"
    MODELLED = "MODELLED"
    SIMULATED = "SIMULATED"


class RiskLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    NONE = "NONE"


class Volatility(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Outlook(str, Enum):
    GROWING = "GROWING"
    STABLE = "STABLE"
    DECLINING = "DECLINING"


class VersionId(str, Enum):
    A = "A"
    B = "B"
    C = "C"


class VersionRepresentation(str, Enum):
    CHRONOLOGICAL = "CHRONOLOGICAL"
    DURATION = "DURATION"
    OPTIMIZED = "OPTIMIZED"


class DriverEffect(str, Enum):
    BASE = "BASE"
    RELATIVE_CHANGE = "RELATIVE_CHANGE"


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"
    NOT_FOUND = "NOT_FOUND"
    INTERNAL_ERROR = "INTERNAL_ERROR"


# ---------------------------------------------------------------------------
# Error Response Models (Appendix A.1)
# ---------------------------------------------------------------------------

class ErrorDetail(BaseModel):
    field: str
    message: str


class ErrorBody(BaseModel):
    code: ErrorCode
    message: str
    details: list[ErrorDetail] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    error: ErrorBody


# ---------------------------------------------------------------------------
# Health Response Model (Appendix A.4)
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0"
    stub_mode: bool = False


# ---------------------------------------------------------------------------
# A.3 Candidate Profile & Request Models
# ---------------------------------------------------------------------------

class CandidateProfile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Optional[str] = Field(default=None, max_length=60)
    current_or_last_role_id: str
    target_role_id: str
    industry: str = Field(..., min_length=1, max_length=60)
    location: Optional[str] = Field(default=None, max_length=60)
    experience_years: float = Field(..., ge=0.0, le=50.0)
    experience_start_year: Optional[int] = Field(default=None, ge=1970, le=2035)
    experience_end_year: Optional[int] = Field(default=None, ge=1970, le=2035)
    gap_years: float = Field(..., ge=0.0, le=15.0)
    reentry_year: Optional[int] = Field(default=None, ge=1970, le=2035)
    gap_reason: GapReason = Field(default=GapReason.OTHER)
    resume_format: ResumeFormat
    skills: list[str] = Field(..., min_length=1, max_length=30)
    recent_activities: list[str] = Field(default_factory=list, max_length=10)
    availability_stated: bool

    @field_validator("skills")
    @classmethod
    def validate_skills_unique(cls, v: list[str]) -> list[str]:
        if len(v) != len(set(v)):
            raise ValueError("Duplicate skill IDs are not allowed in skills list")
        return v

    @field_validator("recent_activities")
    @classmethod
    def filter_blank_activities(cls, v: list[str]) -> list[str]:
        # Up to 10 non-empty strings; blank strings are ignored
        return [item.strip() for item in v if item and item.strip()]


class DiagnoseRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    profile: CandidateProfile


class SimulateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    profile: CandidateProfile


class TransitionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    profile: CandidateProfile
    target_role_id: str = Field(..., min_length=1)


class AuditRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    rules: list[str] = Field(..., min_length=1, max_length=50)

    @field_validator("rules")
    @classmethod
    def validate_rule_lengths(cls, v: list[str]) -> list[str]:
        for r in v:
            if len(r) > 300:
                raise ValueError("Each rule string must be at most 300 characters")
        return v


# ---------------------------------------------------------------------------
# A.5 Diagnostic Models
# ---------------------------------------------------------------------------

class RoleRef(BaseModel):
    id: str
    name: str


class Flag(BaseModel):
    id: str
    label: str
    level: Level
    status: FlagStatus
    explanation: str
    provenance: Provenance = Provenance.MODELLED


class FlagSummary(BaseModel):
    barrier_count: int
    watch_count: int
    strength_count: int


class Recommendation(BaseModel):
    intervention: Intervention
    title: str
    rationale: str
    prescribed_action: str
    also_apply: list[Intervention] = Field(default_factory=list)
    evidence_ids: list[str] = Field(default_factory=list)


class CapabilityCheck(BaseModel):
    qualification_limiting: bool
    explanation: str


class DiagnosticResult(BaseModel):
    target_role: RoleRef
    flags: list[Flag]
    summary: FlagSummary
    recommendation: Recommendation
    capability_check: CapabilityCheck


# ---------------------------------------------------------------------------
# A.5 Simulation Models
# ---------------------------------------------------------------------------

class Driver(BaseModel):
    label: str
    effect: DriverEffect
    value_pct: float
    provenance: Provenance
    evidence_id: Optional[str] = None


class Version(BaseModel):
    id: VersionId
    label: str
    representation: VersionRepresentation
    pass_likelihood_pct: float
    resume_preview: list[str]
    drivers: list[Driver]
    provenance: Provenance = Provenance.SIMULATED


class ControlCertificate(BaseModel):
    label: str
    pass_likelihood_pct: float
    note: str
    provenance: Provenance = Provenance.EMPIRICAL
    evidence_id: Optional[str] = "EV-001"


class BenchmarkItem(BaseModel):
    label: str
    value: float
    provenance: Provenance


class Assumption(BaseModel):
    key: str
    value: float
    provenance: Provenance
    note: str


class SimulationResult(BaseModel):
    versions: list[Version]
    control_certificate: ControlCertificate
    benchmark_index: list[BenchmarkItem]
    assumptions: list[Assumption]
    limitations: list[str]


# ---------------------------------------------------------------------------
# A.5 Transition Models
# ---------------------------------------------------------------------------

class SkillRef(BaseModel):
    id: str
    name: str
    cluster: str


class StaleSkillRef(BaseModel):
    id: str
    name: str
    cluster: str
    reason: str


class TransitionCounts(BaseModel):
    transferable: int
    stale: int
    missing: int
    total: int


class TransitionResult(BaseModel):
    target_role: RoleRef
    transferable: list[SkillRef]
    stale: list[StaleSkillRef]
    missing: list[SkillRef]
    counts: TransitionCounts
    coverage_pct: float
    provenance: Provenance = Provenance.MODELLED


# ---------------------------------------------------------------------------
# A.5 Audit Models
# ---------------------------------------------------------------------------

class AuditResultItem(BaseModel):
    line_number: int
    rule_text: str
    matched_rule_id: Optional[str] = None
    matched_rule_name: Optional[str] = None
    risk_level: RiskLevel
    impact: str
    recommended_intervention: Optional[str] = None
    evidence_ids: list[str] = Field(default_factory=list)
    provenance: Optional[Provenance] = None


class AuditSummary(BaseModel):
    total_rules: int
    flagged: int
    high: int
    medium: int
    low: int
    none: int


class AuditResult(BaseModel):
    results: list[AuditResultItem]
    summary: AuditSummary


# ---------------------------------------------------------------------------
# A.6 Data File Shapes
# ---------------------------------------------------------------------------

class Skill(BaseModel):
    id: str
    name: str
    cluster: str
    volatility: Volatility


class Role(BaseModel):
    id: str
    name: str
    function: str
    outlook: Outlook
    core_skills: list[str]


class Ontology(BaseModel):
    skills: list[Skill]
    roles: list[Role]


class Headline(BaseModel):
    value: str
    label: str


class EvidenceEntry(BaseModel):
    id: str
    short_title: str
    citation: str
    authors: str
    year: int
    venue: str
    study_type: str
    geography: str
    sample: str
    headline: Headline
    findings: list[str]
    limits: list[str]
    transferability_note: str
    provenance: Provenance
    url: str


class EvidenceRegistry(BaseModel):
    entries: list[EvidenceEntry]


class EvidenceListResponse(BaseModel):
    entries: list[EvidenceEntry]


class ParamItem(BaseModel):
    value: float
    provenance: Provenance
    evidence_id: Optional[str] = None
    note: str


class SimulationParams(BaseModel):
    reference_pass_likelihood_pct: ParamItem
    gap_penalty_pct_at_full: ParamItem
    gap_years_at_full_penalty: ParamItem
    reframing_relative_lift_pct: ParamItem
    competency_cluster_lift_pct: ParamItem
    availability_indicator_lift_pct: ParamItem
    certificate_lift_pct: ParamItem
    max_pass_likelihood_pct: ParamItem


class AuditRule(BaseModel):
    id: str
    name: str
    patterns: list[str]
    risk_level: RiskLevel
    impact: str
    recommended_intervention: Optional[str] = None
    evidence_ids: list[str] = Field(default_factory=list)
    provenance: Provenance = Provenance.MODELLED


class AuditRuleLibrary(BaseModel):
    rules: list[AuditRule]


class SampleProfile(BaseModel):
    id: str
    title: str
    description: str
    profile: CandidateProfile


class AuditRuleSet(BaseModel):
    id: str
    title: str
    rules: list[str]


class Samples(BaseModel):
    profiles: list[SampleProfile]
    audit_rule_sets: list[AuditRuleSet]
