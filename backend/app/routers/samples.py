"""Anchor Samples Router."""

from fastapi import APIRouter

from app.loader import get_samples
from app.schemas import Samples

router = APIRouter(prefix="/api", tags=["samples"])


@router.get("/samples", response_model=Samples)
async def get_samples_endpoint() -> Samples:
    """Return sample profiles and screening rule sets."""
    return get_samples()
