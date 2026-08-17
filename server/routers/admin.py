from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from server.database import get_db
from server.models import User
from server.schemas import ClaimResponse, ClaimVerifyRequest, ClaimHistoryResponse
from server.security import get_current_admin
from server.crud import (
    get_claim,
    get_claims,
    get_item,
    create_history_entry,
    get_item_history,
)

# We will define two routers to support both /api/v1/admin and /admin prefixes
router_api = APIRouter(prefix="/api/v1/admin", tags=["admin"])
router_direct = APIRouter(prefix="/admin", tags=["admin"])


def list_pending_claims(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return get_claims(db, skip=skip, limit=limit, status_filter="pending")


def verify_claim(
    claim_id: str,
    req: ClaimVerifyRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    db_claim = get_claim(db, claim_id)
    if not db_claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    if db_claim.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Claim has already been {db_claim.status}.",
        )

    db_item = get_item(db, db_claim.item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Associated item not found."
        )

    try:
        db_claim.status = req.status
        db_claim.rejection_reason = req.rejection_reason
        db_claim.admin_notes = req.admin_notes
        db_claim.reviewed_by = current_admin.id
        db_claim.reviewed_at = datetime.now(timezone.utc)

        if req.status == "approved":
            db_item.status = "reunited"
            action_name = "Approved by Admin"
            details_text = f"Claim approved by admin {current_admin.full_name}. Item status set to reunited."
        else:
            db_item.status = "unclaimed"
            action_name = "Rejected by Admin"
            details_text = f"Claim rejected by admin {current_admin.full_name}. Reason: '{req.rejection_reason}'."

        # Create history entry
        create_history_entry(
            db,
            item_id=db_item.id,
            claim_id=db_claim.id,
            actor_id=current_admin.id,
            action=action_name,
            details=details_text,
        )

        db.commit()
        db.refresh(db_claim)
        return db_claim
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify claim: {str(e)}",
        )


def get_audit_trail(
    item_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found."
        )
    return get_item_history(db, item_id)


# Register routes on /api/v1/admin
router_api.get("/claims", response_model=List[ClaimResponse])(list_pending_claims)
router_api.post("/claims/{claim_id}/verify", response_model=ClaimResponse)(verify_claim)
router_api.get("/items/{item_id}/history", response_model=List[ClaimHistoryResponse])(
    get_audit_trail
)

# Register routes on /admin
router_direct.get("/claims", response_model=List[ClaimResponse])(list_pending_claims)
router_direct.post("/claims/{claim_id}/verify", response_model=ClaimResponse)(
    verify_claim
)
router_direct.get(
    "/items/{item_id}/history", response_model=List[ClaimHistoryResponse]
)(get_audit_trail)
