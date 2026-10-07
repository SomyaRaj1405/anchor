"""Anchor Ontology Router."""

from fastapi import APIRouter

from app.loader import get_ontology
from app.schemas import Ontology

router = APIRouter(prefix="/api", tags=["ontology"])


@router.get("/ontology", response_model=Ontology)
async def get_ontology_endpoint() -> Ontology:
    """Return complete skills and roles ontology."""
    return get_ontology()
