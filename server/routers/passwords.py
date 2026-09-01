from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from server.schemas.passwords import (
    HealthCheckResponse,
    PasswordGenerateRequest,
    PasswordGenerateResponse,
)
from server.services.password_service import PasswordService

router = APIRouter(prefix="/api/v1", tags=["passwords"])


@router.post(
    "/passwords/generate",
    response_model=PasswordGenerateResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Cryptographically Secure Password",
    description="Generates a cryptographically random password according to requested length and complexity criteria.",
)
def generate_password(request: PasswordGenerateRequest):
    try:
        return PasswordService.generate_password(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
    description="Returns operational status of the service.",
)
def health_check():
    return HealthCheckResponse(
        status="healthy",
        service="password-maker-service",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
