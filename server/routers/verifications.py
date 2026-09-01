from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas

router = APIRouter(prefix="/api/v1/verifications", tags=["Identity Verifications"])


@router.post(
    "", response_model=schemas.VerificationResponse, status_code=status.HTTP_201_CREATED
)
def create_verification(
    verif_in: schemas.VerificationCreate, db: Session = Depends(get_db)
):
    visitor = (
        db.query(models.Visitor)
        .filter(models.Visitor.id == verif_in.visitor_id)
        .first()
    )
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor not found"
        )

    status_str = verif_in.verification_status.upper()
    verification = models.Verification(
        visitor_id=verif_in.visitor_id,
        officer_id=verif_in.officer_id,
        verification_status=status_str,
        notes=verif_in.notes,
    )
    db.add(verification)

    # Update visitor verification status
    visitor.verification_status = status_str
    db.commit()
    db.refresh(verification)
    return verification


@router.get("", response_model=List[schemas.VerificationResponse])
def list_verifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    visitor_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Verification)
    if visitor_id:
        query = query.filter(models.Verification.visitor_id == visitor_id)
    return (
        query.order_by(models.Verification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
