from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Claim, ClaimHistory, Item
from server.schemas import ClaimCreate, ClaimResponse, ClaimVerify, ClaimHistoryResponse
from server.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/v1/claims", tags=["claims"])


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    claim_in: ClaimCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(Item).filter(Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    # Cannot claim own reported item
    if item.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot claim own reported item",
        )

    # Cannot claim if item is already claimed
    if item.status == "CLAIMED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Item already claimed"
        )

    # Create claim
    db_claim = Claim(
        item_id=claim_in.item_id,
        claimant_id=current_user.id,
        status="pending",
        proof=claim_in.proof,
    )
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)

    # Update item status to MATCH_PENDING
    item.status = "MATCH_PENDING"
    db.commit()

    # Record history
    history_entry = ClaimHistory(
        claim_id=db_claim.id,
        event_type="CLAIM_SUBMITTED",
        notes=f"Claim submitted by user {current_user.email}",
        performed_by_id=current_user.id,
    )
    db.add(history_entry)
    db.commit()

    return db_claim


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )
    return claim


@router.patch("/{claim_id}/verify", response_model=ClaimResponse)
def verify_claim(
    claim_id: str,
    verify_in: ClaimVerify,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )

    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if verify_in.status == "approved":
        claim.status = "approved"
        claim.admin_id = current_admin.id
        item.status = "CLAIMED"
        db.commit()

        # Record history for approved claim
        history_entry = ClaimHistory(
            claim_id=claim.id,
            event_type="VERIFIED_BY_ADMIN",
            notes=verify_in.notes or "Claim approved by admin",
            performed_by_id=current_admin.id,
        )
        db.add(history_entry)

        # Automatically close concurrent claims as SUPERSEDED_CLOSED
        concurrent_claims = (
            db.query(Claim)
            .filter(
                Claim.item_id == claim.item_id,
                Claim.id != claim.id,
                Claim.status == "pending",
            )
            .all()
        )

        for cc in concurrent_claims:
            cc.status = "superseded_closed"
            db.commit()

            cc_history = ClaimHistory(
                claim_id=cc.id,
                event_type="SUPERSEDED_CLOSED",
                notes="Claim superseded by another approved claim",
                performed_by_id=current_admin.id,
            )
            db.add(cc_history)

        db.commit()

    elif verify_in.status == "rejected":
        claim.status = "rejected"
        claim.admin_id = current_admin.id
        item.status = "AVAILABLE_FOUND"
        db.commit()

        # Record history for rejected claim
        history_entry = ClaimHistory(
            claim_id=claim.id,
            event_type="REJECTED",
            notes=verify_in.notes or "Claim rejected by admin",
            performed_by_id=current_admin.id,
        )
        db.add(history_entry)
        db.commit()

    db.refresh(claim)
    return claim


@router.get("/{claim_id}/history", response_model=list[ClaimHistoryResponse])
def get_claim_history(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )

    history = (
        db.query(ClaimHistory)
        .filter(ClaimHistory.claim_id == claim_id)
        .order_by(ClaimHistory.created_at.asc())
        .all()
    )

    return history
