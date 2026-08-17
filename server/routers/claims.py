from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, database
from .auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/v1/claims", tags=["claims"])


@router.post(
    "", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED
)
def create_claim(
    claim: schemas.ClaimCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    # Check if item exists
    db_item = crud.get_item(db=db, item_id=claim.item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    if db_item.item_type != "found":
        raise HTTPException(status_code=400, detail="Can only claim found items")
    return crud.create_claim(db=db, claim=claim, claimant_id=current_user.id)


@router.get("", response_model=List[schemas.ClaimResponse])
def read_claims(
    current_user=Depends(get_current_admin_user), db: Session = Depends(database.get_db)
):
    return crud.get_claims(db=db)


@router.get("/{claim_id}", response_model=schemas.ClaimResponse)
def read_claim(
    claim_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    db_claim = crud.get_claim(db=db, claim_id=claim_id)
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    # Only claimant or admin can view details
    if db_claim.claimant_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to view this claim")
    return db_claim


@router.put("/{claim_id}/verify", response_model=schemas.ClaimResponse)
def verify_claim(
    claim_id: str,
    verify: schemas.ClaimVerify,
    current_user=Depends(get_current_admin_user),
    db: Session = Depends(database.get_db),
):
    db_claim = crud.get_claim(db=db, claim_id=claim_id)
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return crud.verify_claim(
        db=db, claim_id=claim_id, status=verify.status, verifier_id=current_user.id
    )


@router.get("/{claim_id}/messages", response_model=List[schemas.MessageResponse])
def read_claim_messages(
    claim_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    db_claim = crud.get_claim(db=db, claim_id=claim_id)
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if db_claim.claimant_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to view messages for this claim"
        )
    return crud.get_messages_by_claim(db=db, claim_id=claim_id)


@router.post(
    "/{claim_id}/messages",
    response_model=schemas.MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_claim_message(
    claim_id: str,
    message: schemas.MessageCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    db_claim = crud.get_claim(db=db, claim_id=claim_id)
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if db_claim.claimant_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to send messages for this claim"
        )
    return crud.create_message(
        db=db, claim_id=claim_id, sender_id=current_user.id, text=message.text
    )
