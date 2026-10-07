"""Anchor Backend Application Main Entrypoint.

FastAPI application configuration:
- Host / Port: 0.0.0.0:8000
- CORS: Configured for frontend on port 5173 (http://localhost:5173, http://127.0.0.1:5173)
- Standard error handlers conforming to Appendix A.1:
    - 422 VALIDATION_ERROR
    - 404 NOT_FOUND
    - 500 INTERNAL_ERROR
- Stub mode toggle via ANCHOR_STUB environment variable
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Ensure backend directory is in sys.path
_BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.check_data import run_checks
from app.routers import (
    audit_router,
    diagnostic_router,
    evidence_router,
    ontology_router,
    samples_router,
    simulation_router,
    transition_router,
)
from app.schemas import (
    ErrorBody,
    ErrorCode,
    ErrorDetail,
    ErrorResponse,
    HealthResponse,
)
from app.validation import ProfileValidationException

logger = logging.getLogger("anchor.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run data integrity check on startup."""
    if not run_checks():
        logger.error("Data integrity check failed during startup.")
    yield


app = FastAPI(
    title="Anchor API",
    description="Evidence-Driven Workforce Intervention Intelligence API",
    version="1.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Error Handlers (conforming to Appendix A.1 format)
# ---------------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details: list[ErrorDetail] = []
    for error in exc.errors():
        field_path = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        details.append(
            ErrorDetail(
                field=field_path,
                message=error["msg"],
            )
        )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error=ErrorBody(
                code=ErrorCode.VALIDATION_ERROR,
                message="Invalid request",
                details=details,
            )
        ).model_dump(),
    )


@app.exception_handler(ProfileValidationException)
async def profile_validation_exception_handler(request: Request, exc: ProfileValidationException):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error=ErrorBody(
                code=ErrorCode.VALIDATION_ERROR,
                message=exc.message,
                details=exc.details,
            )
        ).model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        code = ErrorCode.NOT_FOUND
    elif exc.status_code == 422:
        code = ErrorCode.VALIDATION_ERROR
    else:
        code = ErrorCode.INTERNAL_ERROR

    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ErrorBody(
                code=code,
                message=str(exc.detail),
                details=[],
            )
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error=ErrorBody(
                code=ErrorCode.INTERNAL_ERROR,
                message="Internal server error",
                details=[],
            )
        ).model_dump(),
    )


# ---------------------------------------------------------------------------
# Health Route (Appendix A.4)
# ---------------------------------------------------------------------------
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    stub_mode = os.getenv("ANCHOR_STUB", "0") in ("1", "true", "True")
    return HealthResponse(
        status="ok",
        version="1.0",
        stub_mode=stub_mode,
    )


# ---------------------------------------------------------------------------
# Routers (Appendix A.4)
# ---------------------------------------------------------------------------
app.include_router(ontology_router)
app.include_router(samples_router)
app.include_router(evidence_router)
app.include_router(diagnostic_router)
app.include_router(simulation_router)
app.include_router(transition_router)
app.include_router(audit_router)
