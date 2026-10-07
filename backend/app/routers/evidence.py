"""Anchor Evidence Registry Router."""

from fastapi import APIRouter, HTTPException, status

from app.loader import get_registry
from app.schemas import EvidenceEntry, EvidenceListResponse

router = APIRouter(prefix="/api", tags=["evidence"])


@router.get("/evidence", response_model=EvidenceListResponse)
async def list_evidence_endpoint() -> EvidenceListResponse:
    """Return all entries from the evidence registry."""
    registry = get_registry()
    return EvidenceListResponse(entries=registry.entries)


@router.get("/evidence/{evidence_id}", response_model=EvidenceEntry)
async def get_evidence_by_id_endpoint(evidence_id: str) -> EvidenceEntry:
    """Return a single evidence entry or 404 NOT_FOUND."""
    registry = get_registry()
    entry = next((e for e in registry.entries if e.id == evidence_id), None)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence entry '{evidence_id}' not found",
        )
    return entry
