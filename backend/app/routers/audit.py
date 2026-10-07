"""Anchor Employer Screening Audit Router."""

from fastapi import APIRouter

from app.engines.audit import run_audit
from app.loader import get_audit_library
from app.schemas import AuditRequest, AuditResult
from app.stub import get_stub_response, is_stub_mode

router = APIRouter(prefix="/api", tags=["audit"])


@router.post("/audit", response_model=AuditResult)
async def audit_rules_endpoint(request: AuditRequest) -> AuditResult:
    """Audit screening rules against the Anchor rule library."""
    if is_stub_mode():
        return AuditResult.model_validate_json(get_stub_response("audit_response_deck.json"))

    library = get_audit_library()
    return run_audit(request.rules, library)
