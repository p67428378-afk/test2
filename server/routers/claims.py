from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    ClaimCreate,
    ClaimStatusUpdate,
    ClaimResponse,
    ClaimAuditLogResponse,
)
from server import crud

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def submit_claim(claim_in: ClaimCreate, db: Session = Depends(get_db)):
    """Submit a new service or warranty claim for a product."""
    product = crud.get_product(db, claim_in.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {claim_in.product_id} not found",
        )
    return crud.create_claim(db, claim_in)


@router.get("", response_model=List[ClaimResponse])
def list_claims(
    product_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List service claims with optional filtering by product ID and status."""
    return crud.get_claims(
        db,
        product_id=product_id,
        status=status,
        skip=skip,
        limit=limit,
    )


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim_details(claim_id: str, db: Session = Depends(get_db)):
    """Get single service claim details by ID."""
    claim = crud.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim with ID {claim_id} not found",
        )
    return claim


@router.patch("/{claim_id}/status", response_model=ClaimResponse)
def update_claim_status(
    claim_id: str,
    update_in: ClaimStatusUpdate,
    db: Session = Depends(get_db),
):
    """Update claim status, resolution notes, and repair cost."""
    updated = crud.update_claim_status(db, claim_id, update_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim with ID {claim_id} not found",
        )
    return updated


@router.get("/{claim_id}/audit_logs", response_model=List[ClaimAuditLogResponse])
def get_claim_audit_history(claim_id: str, db: Session = Depends(get_db)):
    """Get complete chronological audit trail for a claim."""
    claim = crud.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim with ID {claim_id} not found",
        )
    return crud.get_claim_audit_logs(db, claim_id)
