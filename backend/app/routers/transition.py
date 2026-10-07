"""Anchor Transition Intelligence Router."""

from fastapi import APIRouter

from app.engines.transition import run_transition
from app.loader import get_ontology
from app.schemas import ErrorDetail, TransitionRequest, TransitionResult
from app.stub import get_stub_response, is_stub_mode
from app.validation import ProfileValidationException, validate_profile_refs

router = APIRouter(prefix="/api", tags=["transition"])


@router.post("/transition", response_model=TransitionResult)
async def transition_candidate_endpoint(request: TransitionRequest) -> TransitionResult:
    """Analyze skill transition decomposition towards a target role."""
    ontology = get_ontology()
    validate_profile_refs(request.profile, ontology)

    role_ids = {r.id for r in ontology.roles}
    if request.target_role_id not in role_ids:
        raise ProfileValidationException(
            details=[
                ErrorDetail(
                    field="target_role_id",
                    message=f"Unknown target role id '{request.target_role_id}'",
                )
            ]
        )

    if is_stub_mode():
        return TransitionResult.model_validate_json(get_stub_response("transition_response_b.json"))

    return run_transition(request.profile, request.target_role_id, ontology)
