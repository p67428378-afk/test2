import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas, models

router = APIRouter()


@router.post(
    "/claims", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED
)
def submit_claim(claim_in: schemas.ClaimCreate, db: Session = Depends(get_db)):
    # Check if item exists
    item = crud.get_item(db, claim_in.item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    # Check if item is already claimed (has an approved claim)
    existing_approved_claim = (
        db.query(models.Claim)
        .filter(
            models.Claim.item_id == claim_in.item_id, models.Claim.status == "approved"
        )
        .first()
    )
    if existing_approved_claim:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Item is already claimed"
        )

    claim = crud.create_claim(db, claim_in)
    return claim


@router.get("/claims", response_model=List[schemas.ClaimListResponse])
def list_claims(
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    if status and status not in ("pending", "approved", "rejected"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'pending', 'approved', or 'rejected'",
        )
    return crud.list_claims(db, status=status, skip=skip, limit=limit)


@router.get("/claims/{claim_id}", response_model=schemas.ClaimDetailResponse)
def get_claim(claim_id: uuid.UUID, db: Session = Depends(get_db)):
    claim = crud.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )
    return claim


@router.put("/claims/{claim_id}/verify", response_model=schemas.ClaimResponse)
def verify_claim(
    claim_id: uuid.UUID,
    verify_in: schemas.ClaimVerifyRequest,
    db: Session = Depends(get_db),
):
    claim = crud.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )

    # Check for invalid status transition
    if claim.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot verify claim with status '{claim.status}'",
        )

    # If approving, check if another claim is already approved for this item
    if verify_in.status == "approved":
        existing_approved_claim = (
            db.query(models.Claim)
            .filter(
                models.Claim.item_id == claim.item_id, models.Claim.status == "approved"
            )
            .first()
        )
        if existing_approved_claim:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another claim for this item has already been approved",
            )

    updated_claim = crud.update_claim_status(db, claim, verify_in.status)
    return updated_claim
