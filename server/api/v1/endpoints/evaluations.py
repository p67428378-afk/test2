from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.core.deps import get_current_user, require_roles, log_audit

router = APIRouter()


@router.get("", response_model=List[schemas.EvaluationRead])
def list_evaluations(
    proposal_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Evaluation)

    if proposal_id:
        query = query.filter(models.Evaluation.proposal_id == proposal_id)

    if current_user.role == "REVIEWER":
        # Reviewers see evaluations assigned to them
        query = query.filter(models.Evaluation.reviewer_id == current_user.id)
    elif current_user.role == "RESEARCHER":
        # Researchers see evaluations for their own proposals if status is complete
        query = query.join(models.Proposal).filter(
            models.Proposal.pi_id == current_user.id
        )

    evaluations = query.all()
    return evaluations


@router.get(
    "/summary/{proposal_id}", response_model=schemas.ProposalEvaluationSummaryRead
)
def get_proposal_evaluation_summary(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    proposal = (
        db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    )
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    evaluations = (
        db.query(models.Evaluation)
        .filter(models.Evaluation.proposal_id == proposal_id)
        .all()
    )

    completed_scores = [
        e.score for e in evaluations if e.score is not None and e.status == "COMPLETED"
    ]
    avg_score = (
        round(sum(completed_scores) / len(completed_scores), 2)
        if completed_scores
        else 0.0
    )

    return {
        "proposal_id": proposal_id,
        "average_score": avg_score,
        "evaluation_count": len(evaluations),
        "evaluations": evaluations,
    }


@router.post(
    "", response_model=schemas.EvaluationRead, status_code=status.HTTP_201_CREATED
)
def create_evaluation_assignment(
    eval_in: schemas.EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles(["GRANT_ADMIN", "COMMITTEE_MEMBER"])
    ),
):
    proposal = (
        db.query(models.Proposal)
        .filter(models.Proposal.id == eval_in.proposal_id)
        .first()
    )
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    reviewer = (
        db.query(models.User).filter(models.User.id == eval_in.reviewer_id).first()
    )
    if not reviewer or reviewer.role != "REVIEWER":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reviewer specified"
        )

    # Check Conflict of Interest (COI)
    is_coi = False
    if (
        reviewer.department
        and proposal.department
        and reviewer.department.lower() == proposal.department.lower()
    ):
        is_coi = True
    if (
        proposal.co_investigators
        and reviewer.full_name
        and reviewer.full_name.lower() in proposal.co_investigators.lower()
    ):
        is_coi = True

    evaluation = models.Evaluation(
        proposal_id=eval_in.proposal_id,
        reviewer_id=eval_in.reviewer_id,
        is_coi_flagged=is_coi,
        status="PENDING",
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    log_audit(
        db,
        current_user.id,
        "ASSIGN_REVIEWER",
        f"evaluation_id:{evaluation.id}, proposal_id:{proposal.id}, coi:{is_coi}",
    )
    return evaluation


@router.post("/{id}/score", response_model=schemas.EvaluationRead)
def submit_evaluation_score(
    id: str,
    score_in: schemas.EvaluationScoreRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles(["REVIEWER", "GRANT_ADMIN"])),
):
    evaluation = db.query(models.Evaluation).filter(models.Evaluation.id == id).first()
    if not evaluation:
        # Check if id is a proposal_id and current_user is assigned
        evaluation = (
            db.query(models.Evaluation)
            .filter(
                models.Evaluation.proposal_id == id,
                models.Evaluation.reviewer_id == current_user.id,
            )
            .first()
        )

    if not evaluation:
        # Auto-create evaluation for current reviewer if not assigned yet
        proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
        if not proposal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Evaluation or Proposal not found",
            )

        # Check COI
        if (
            current_user.department
            and proposal.department
            and current_user.department.lower() == proposal.department.lower()
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Conflict of Interest detected: Reviewer belongs to same department as proposal PI",
            )

        evaluation = models.Evaluation(
            proposal_id=proposal.id,
            reviewer_id=current_user.id,
            status="PENDING",
        )
        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)

    # Check COI on existing evaluation
    proposal = evaluation.proposal
    if evaluation.is_coi_flagged or (
        current_user.department
        and proposal.department
        and current_user.department.lower() == proposal.department.lower()
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conflict of Interest detected: Cannot evaluate proposals from your own department",
        )

    # Score must be 1-100
    if score_in.score < 1 or score_in.score > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rubric overall score must be between 1 and 100",
        )

    evaluation.score = score_in.score
    evaluation.methodology_score = score_in.methodology_score
    evaluation.impact_score = score_in.impact_score
    evaluation.feasibility_score = score_in.feasibility_score
    evaluation.comments = score_in.comments
    evaluation.status = "COMPLETED"

    # Update proposal status to UNDER_REVIEW
    if proposal and proposal.status == "SUBMITTED":
        proposal.status = "UNDER_REVIEW"

    db.commit()
    db.refresh(evaluation)

    log_audit(
        db,
        current_user.id,
        "SUBMIT_EVALUATION_SCORE",
        f"evaluation_id:{evaluation.id}, score:{evaluation.score}",
    )
    return evaluation
