"""Anchor Intervention Lab Simulation Router."""

from fastapi import APIRouter

from app.engines.simulation import run_simulation
from app.loader import get_ontology, get_params
from app.schemas import SimulateRequest, SimulationResult
from app.stub import get_stub_response, is_stub_mode
from app.validation import validate_profile_refs

router = APIRouter(prefix="/api", tags=["simulation"])


@router.post("/simulate", response_model=SimulationResult)
async def simulate_candidate_endpoint(request: SimulateRequest) -> SimulationResult:
    """Run counterfactual simulation for candidate resume reframing."""
    ontology = get_ontology()
    validate_profile_refs(request.profile, ontology)
    params = get_params()

    if is_stub_mode():
        return SimulationResult.model_validate_json(get_stub_response("simulate_response_a.json"))

    return run_simulation(request.profile, ontology, params)
