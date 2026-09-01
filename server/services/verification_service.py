import uuid
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models.verification import Verification
from server.models.visitor import Visitor
from server.schemas.verification import VerificationCreate


def verify_visitor(db: Session, verification_in: VerificationCreate) -> Verification:
    visitor = db.query(Visitor).filter(Visitor.id == verification_in.visitor_id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found.",
        )

    verif_status = verification_in.verification_status.upper()
    if verif_status not in ["VERIFIED", "REJECTED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification status. Must be VERIFIED or REJECTED.",
        )

    # Update visitor status
    visitor.verification_status = verif_status

    verification = Verification(
        id=uuid.uuid4(),
        visitor_id=verification_in.visitor_id,
        officer_id=verification_in.officer_id,
        verification_status=verif_status,
        notes=verification_in.notes,
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification


def list_verifications(
    db: Session,
    visitor_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Verification]:
    query = db.query(Verification)
    if visitor_id:
        query = query.filter(Verification.visitor_id == visitor_id)
    return (
        query.order_by(Verification.created_at.desc()).offset(skip).limit(limit).all()
    )
