import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.verification import VerificationCreate, VerificationOut
from server.services import verification_service

router = APIRouter(prefix="/verifications", tags=["Verifications"])


@router.post("", response_model=VerificationOut, status_code=status.HTTP_201_CREATED)
def create_verification(
    verification_in: VerificationCreate,
    db: Session = Depends(get_db),
):
    return verification_service.verify_visitor(db, verification_in)


@router.get("", response_model=List[VerificationOut])
def list_verifications(
    visitor_id: Optional[uuid.UUID] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return verification_service.list_verifications(
        db, visitor_id=visitor_id, skip=skip, limit=limit
    )
