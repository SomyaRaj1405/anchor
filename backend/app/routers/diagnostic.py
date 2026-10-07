"""Anchor Candidate Diagnostic Router."""

from fastapi import APIRouter

from app.engines.diagnostic import run_diagnostic
from app.loader import get_ontology
from app.schemas import DiagnoseRequest, DiagnosticResult
from app.stub import get_stub_response, is_stub_mode
from app.validation import validate_profile_refs

router = APIRouter(prefix="/api", tags=["diagnostic"])


@router.post("/diagnose", response_model=DiagnosticResult)
async def diagnose_candidate_endpoint(request: DiagnoseRequest) -> DiagnosticResult:
    """Diagnose candidate profile barrier flags and recommend intervention."""
    ontology = get_ontology()
    validate_profile_refs(request.profile, ontology)

    if is_stub_mode():
        return DiagnosticResult.model_validate_json(get_stub_response("diagnose_response_a.json"))

    return run_diagnostic(request.profile, ontology)
