from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from server.database import get_db
from server.models import Claim, Item, User, ClaimAuditLog
from server.schemas import (
    AdminClaimsResponse,
    ClaimResponse,
    AdminUpdateClaimStatus,
    AdminItemsResponse,
    AdminUsersResponse,
)
from server.auth import get_current_admin

router = APIRouter()


@router.get("/claims", response_model=AdminClaimsResponse)
def get_all_claims(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(Claim)
    total = query.count()
    claims = query.offset(skip).limit(limit).all()

    return {"claims": claims, "total": total}


@router.put("/claims/{claim_id}", response_model=ClaimResponse)
def update_claim_status(
    claim_id: UUID,
    status_in: AdminUpdateClaimStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found"
        )

    if status_in.status not in ["approved", "rejected", "more_info_requested"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved', 'rejected', or 'more_info_requested'",
        )

    old_status = claim.status
    claim.status = status_in.status

    # Create audit log entry
    audit_log = ClaimAuditLog(
        claim_id=claim.id,
        old_status=old_status,
        new_status=status_in.status,
        changed_by=current_admin.id,
    )
    db.add(audit_log)

    # If approved, update the item status to 'claimed'
    if status_in.status == "approved":
        item = db.query(Item).filter(Item.id == claim.item_id).first()
        if item:
            item.status = "claimed"

    db.commit()
    db.refresh(claim)
    return claim


@router.get("/items", response_model=AdminItemsResponse)
def get_all_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(Item)
    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {"items": items, "total": total}


@router.get("/users", response_model=AdminUsersResponse)
def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(User)
    total = query.count()
    users = query.offset(skip).limit(limit).all()

    return {"users": users, "total": total}
