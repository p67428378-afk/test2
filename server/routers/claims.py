from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import server.models as models
import server.schemas as schemas
from server.database import get_db
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])

VALID_STATUSES = {"PENDING", "APPROVED", "REJECTED", "COMPLETED"}


@router.get("", response_model=List[schemas.ClaimResponse])
def list_claims(
    product_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List claims with optional filtering by product_id and status."""
    query = db.query(models.Claim)

    if product_id:
        query = query.filter(models.Claim.product_id == product_id)

    if status and status.upper() != "ALL":
        query = query.filter(models.Claim.status == status.upper())

    claims = (
        query.order_by(models.Claim.created_at.desc()).offset(skip).limit(limit).all()
    )
    return claims


@router.post(
    "", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED
)
def submit_claim(
    claim_in: schemas.ClaimCreate,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a service or warranty claim against a registered product."""
    product = (
        db.query(models.Product)
        .filter(models.Product.id == claim_in.product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    claim = models.Claim(
        product_id=claim_in.product_id,
        claim_date=claim_in.claim_date,
        issue_description=claim_in.issue_description,
        service_provider=claim_in.service_provider,
        status="PENDING",
        repair_cost=0.0,
    )
    db.add(claim)
    db.flush()

    performed_by = current_user.email if current_user else "User"

    # Create audit log
    audit_log = models.ClaimAuditLog(
        claim_id=claim.id,
        action="CLAIM_SUBMITTED",
        from_status=None,
        to_status="PENDING",
        performed_by=performed_by,
        notes="Service claim initiated.",
    )
    db.add(audit_log)
    db.commit()
    db.refresh(claim)

    return claim


@router.get("/{claim_id}", response_model=schemas.ClaimResponse)
def get_claim_details(claim_id: str, db: Session = Depends(get_db)):
    """Get details for a specific claim."""
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.patch("/{claim_id}/status", response_model=schemas.ClaimResponse)
def update_claim_status(
    claim_id: str,
    status_in: schemas.ClaimStatusUpdate,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update status, resolution notes, and repair cost for a claim."""
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    new_status = status_in.status.upper()
    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{new_status}'. Allowed: {', '.join(sorted(VALID_STATUSES))}",
        )

    old_status = claim.status
    claim.status = new_status

    if status_in.repair_cost is not None:
        claim.repair_cost = status_in.repair_cost
    if status_in.resolution_notes is not None:
        claim.resolution_notes = status_in.resolution_notes

    performed_by = current_user.email if current_user else "System"

    # Create audit log
    audit_log = models.ClaimAuditLog(
        claim_id=claim.id,
        action=f"STATUS_UPDATED_TO_{new_status}",
        from_status=old_status,
        to_status=new_status,
        performed_by=performed_by,
        notes=status_in.resolution_notes
        or f"Status changed from {old_status} to {new_status}.",
    )
    db.add(audit_log)
    db.commit()
    db.refresh(claim)

    return claim


@router.get(
    "/{claim_id}/audit_logs", response_model=List[schemas.ClaimAuditLogResponse]
)
def get_claim_audit_logs(claim_id: str, db: Session = Depends(get_db)):
    """Get audit logs history for a specific claim."""
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    logs = (
        db.query(models.ClaimAuditLog)
        .filter(models.ClaimAuditLog.claim_id == claim_id)
        .order_by(models.ClaimAuditLog.created_at.asc())
        .all()
    )

    return logs
