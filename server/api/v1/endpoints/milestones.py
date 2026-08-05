from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.core.deps import get_current_user, require_roles, log_audit

router = APIRouter()


@router.get("/{award_id}", response_model=List[schemas.MilestoneRead])
def list_milestones(
    award_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    award = db.query(models.Award).filter(models.Award.id == award_id).first()
    if not award:
        # Check if award_id is proposal_id
        award = (
            db.query(models.Award).filter(models.Award.proposal_id == award_id).first()
        )

    if not award:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Award not found"
        )

    milestones = (
        db.query(models.Milestone).filter(models.Milestone.award_id == award.id).all()
    )

    # Automatically check for overdue milestones and trigger escalation alerts
    now = datetime.utcnow()
    result: List[dict] = []
    for m in milestones:
        m_dict = {
            "id": m.id,
            "award_id": m.award_id,
            "title": m.title,
            "due_date": m.due_date,
            "status": m.status,
            "deliverable_url": m.deliverable_url,
            "progress_report": m.progress_report,
            "created_at": m.created_at,
            "updated_at": m.updated_at,
            "escalation_triggered": False,
        }
        if m.status in ["PENDING", "OVERDUE"] and m.due_date < now:
            m.status = "OVERDUE"
            m_dict["status"] = "OVERDUE"
            m_dict["escalation_triggered"] = True
            log_audit(
                db,
                current_user.id,
                "MILESTONE_OVERDUE_ESCALATION",
                f"milestone_id:{m.id}, pi:{award.proposal.pi_id}",
            )

        result.append(m_dict)

    db.commit()
    return result


@router.post(
    "", response_model=schemas.MilestoneRead, status_code=status.HTTP_201_CREATED
)
def create_milestone(
    milestone_in: schemas.MilestoneCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    award = (
        db.query(models.Award).filter(models.Award.id == milestone_in.award_id).first()
    )
    if not award:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Award not found"
        )

    if current_user.role == "RESEARCHER" and award.proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    milestone = models.Milestone(
        award_id=award.id,
        title=milestone_in.title,
        due_date=milestone_in.due_date,
        status="PENDING",
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)

    log_audit(db, current_user.id, "CREATE_MILESTONE", f"milestone_id:{milestone.id}")
    return milestone


@router.post("/{id}/submit", response_model=schemas.MilestoneRead)
def submit_milestone(
    id: str,
    submit_req: schemas.MilestoneSubmitRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles(["RESEARCHER", "GRANT_ADMIN"])),
):
    milestone = db.query(models.Milestone).filter(models.Milestone.id == id).first()
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found"
        )

    award = milestone.award
    if current_user.role == "RESEARCHER" and award.proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    milestone.progress_report = submit_req.progress_report
    milestone.deliverable_url = (
        submit_req.deliverable_url
        or f"/uploads/deliverables/{milestone.id}/deliverable.pdf"
    )
    milestone.status = "SUBMITTED"

    db.commit()
    db.refresh(milestone)

    log_audit(db, current_user.id, "SUBMIT_MILESTONE", f"milestone_id:{milestone.id}")
    return milestone
