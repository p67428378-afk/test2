from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.core.deps import get_current_user, require_roles, log_audit

router = APIRouter()


@router.get("", response_model=List[schemas.AwardRead])
def list_awards(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Award)

    if current_user.role == "RESEARCHER":
        query = query.join(models.Proposal).filter(
            models.Proposal.pi_id == current_user.id
        )

    awards = query.offset(skip).limit(limit).all()
    return awards


@router.get("/{id}", response_model=schemas.AwardRead)
def get_award(
    id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    award = db.query(models.Award).filter(models.Award.id == id).first()
    if not award:
        # Check if id is proposal_id
        award = db.query(models.Award).filter(models.Award.proposal_id == id).first()

    if not award:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Award not found"
        )

    if current_user.role == "RESEARCHER" and award.proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    return award


@router.post(
    "/approve", response_model=schemas.AwardRead, status_code=status.HTTP_201_CREATED
)
def approve_funding(
    award_in: schemas.AwardApproveRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles(["COMMITTEE_MEMBER", "GRANT_ADMIN"])
    ),
):
    proposal = (
        db.query(models.Proposal)
        .filter(models.Proposal.id == award_in.proposal_id)
        .first()
    )
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    # Check if award already exists
    existing_award = (
        db.query(models.Award).filter(models.Award.proposal_id == proposal.id).first()
    )
    if existing_award:
        award = existing_award
        award.allocated_budget = award_in.allocated_budget
        award.decision_notes = award_in.decision_notes
        award.requires_revised_budget = award_in.requires_revised_budget or False
        award.status = "ACTIVE" if award_in.status.upper() == "APPROVED" else "REJECTED"
        award.approved_by = current_user.id
    else:
        award = models.Award(
            proposal_id=proposal.id,
            allocated_budget=award_in.allocated_budget,
            approved_by=current_user.id,
            decision_notes=award_in.decision_notes,
            requires_revised_budget=award_in.requires_revised_budget or False,
            status="ACTIVE" if award_in.status.upper() == "APPROVED" else "REJECTED",
        )
        db.add(award)

    # Partial funding edge case: If allocated budget < requested budget and requires_revised_budget is True
    if (
        award_in.requires_revised_budget
        or award_in.allocated_budget < proposal.requested_budget
    ):
        proposal.status = "REVISED_REQUIRED"
        award.status = "PENDING_REVISION"
    else:
        proposal.status = (
            "APPROVED" if award_in.status.upper() == "APPROVED" else "REJECTED"
        )

    db.commit()
    db.refresh(award)

    # Trigger award notification to PI
    log_audit(
        db,
        current_user.id,
        "SEND_AWARD_NOTIFICATION",
        f"award_id:{award.id}, pi_id:{proposal.pi_id}, status:{award.status}",
    )

    log_audit(
        db,
        current_user.id,
        "APPROVE_AWARD",
        f"award_id:{award.id}, proposal_id:{proposal.id}, status:{award.status}, budget:{award.allocated_budget}",
    )
    return award
