from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.name_generator import (
    NameGenerateRequest,
    NameGenerateResponse,
    ErrorResponse,
)
from server.services.name_service import NameService

router = APIRouter()


@router.post(
    "/generate",
    response_model=NameGenerateResponse,
    responses={400: {"model": ErrorResponse}},
)
def generate_names(
    request: NameGenerateRequest = NameGenerateRequest(),
    db: Session = Depends(get_db),
) -> NameGenerateResponse:
    """Generate unique character names based on genre, quantity, and optional sub_tags."""
    return NameService.generate_names(db=db, request=request)
