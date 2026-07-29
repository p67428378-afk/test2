from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Claim, Item, User
from server.schemas import ClaimCreate, ClaimResponse
from server.auth import get_current_user

router = APIRouter()


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    claim_in: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if item exists
    item = db.query(Item).filter(Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if item.status != "reported_found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only found items can be claimed",
        )

    # Create claim
    new_claim = Claim(
        item_id=claim_in.item_id,
        user_id=current_user.id,
        claimant_description=claim_in.claimant_description,
        status="pending_verification",
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    return new_claim
