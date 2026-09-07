from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.models.submission import Submission
from server.schemas.submission import SubmissionResponse, SubmissionGrade
from server.security import get_current_user, require_role

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.get("/my", response_model=List[SubmissionResponse])
def get_my_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submissions = (
        db.query(Submission).filter(Submission.student_id == current_user.id).all()
    )
    return submissions


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    # If student, verify ownership
    if current_user.role != "faculty" and submission.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: cannot view another student's submission",
        )

    return submission


@router.post("/{submission_id}/grade", response_model=SubmissionResponse)
@router.put("/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission(
    submission_id: str,
    grade_in: SubmissionGrade,
    current_user: User = Depends(require_role("faculty")),
    db: Session = Depends(get_db),
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    submission.grade = grade_in.grade
    if grade_in.feedback is not None:
        submission.feedback = grade_in.feedback
    submission.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(submission)
    return submission
