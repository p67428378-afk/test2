from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User, Claim
from server.schemas import ClaimCreate, ClaimResponse
from server.security import get_current_active_user
from server.crud import create_claim, get_item, create_history_entry

router = APIRouter(prefix="/api/v1/claims", tags=["claims"])


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def submit_claim(
    claim: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_item = get_item(db, claim.item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found."
        )

    if db_item.type != "found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Claims can only be submitted for found items.",
        )

    if db_item.status == "reunited":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This item has already been reunited with its owner.",
        )

    # Check if user already has a pending claim for this item
    existing_claim = (
        db.query(Claim)
        .filter(
            Claim.item_id == claim.item_id,
            Claim.claimant_id == current_user.id,
            Claim.status == "pending",
        )
        .first()
    )

    if existing_claim:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending claim for this item.",
        )

    try:
        db_claim = create_claim(db, claim, current_user.id)
        db.flush()  # Get the claim ID

        # Update item status to 'claimed'
        db_item.status = "claimed"

        # Create history entry
        create_history_entry(
            db,
            item_id=db_item.id,
            claim_id=db_claim.id,
            actor_id=current_user.id,
            action="Claim Initiated by User",
            details=f"Claim submitted by {current_user.full_name} with proof: '{claim.proof_of_ownership}'.",
        )

        db.commit()
        db.refresh(db_claim)
        return db_claim
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit claim: {str(e)}",
        )
