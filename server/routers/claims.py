"""
Module: server.routers.claims
Purpose: Claims router for submitting and updating warranty claims.
"""

from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Claim, Product, User, Warranty
from server.schemas import ClaimCreate, ClaimUpdate, ClaimResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    claim_in: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a service or warranty claim."""
    # Verify product exists and belongs to current user
    product = (
        db.query(Product)
        .filter(Product.id == claim_in.product_id, Product.user_id == current_user.id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    # Check if warranty is expired to log/warn (still allow submission)
    warranty = db.query(Warranty).filter(Warranty.product_id == product.id).first()
    is_expired = False
    if warranty and not warranty.is_lifetime and warranty.expiry_date:
        if warranty.expiry_date < date.today():
            is_expired = True

    # Create Claim
    new_claim = Claim(
        product_id=claim_in.product_id,
        claim_date=claim_in.claim_date,
        issue_description=claim_in.issue_description,
        status="Pending",
        service_cost=claim_in.service_cost,
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    return new_claim


@router.put("/{claim_id}", response_model=ClaimResponse)
def update_claim(
    claim_id: str,
    claim_update: ClaimUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update claim status, resolution notes, and service cost with transition validation."""
    claim = (
        db.query(Claim)
        .join(Product)
        .filter(Claim.id == claim_id, Product.user_id == current_user.id)
        .first()
    )

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )

    # Validate status transition: Pending -> Approved / Rejected -> Completed
    current_status = claim.status
    new_status = claim_update.status

    if current_status != new_status:
        if current_status == "Pending":
            if new_status not in ["Approved", "Rejected"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status transition from {current_status} to {new_status}. Must be Approved or Rejected.",
                )
        elif current_status in ["Approved", "Rejected"]:
            if new_status != "Completed":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status transition from {current_status} to {new_status}. Must be Completed.",
                )
        elif current_status == "Completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Completed claims cannot be updated to a different status.",
            )

    # Update fields
    claim.status = new_status
    if claim_update.resolution_notes is not None:
        claim.resolution_notes = claim_update.resolution_notes
    if claim_update.service_cost is not None:
        claim.service_cost = claim_update.service_cost

    db.commit()
    db.refresh(claim)
    return claim
