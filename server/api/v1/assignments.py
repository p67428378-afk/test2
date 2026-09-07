import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.models.course import Course
from server.models.assignment import Assignment
from server.models.submission import Submission
from server.schemas.assignment import AssignmentCreate, AssignmentResponse
from server.schemas.submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionReceiptResponse,
)
from server.security import get_current_user, require_role

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.get("", response_model=List[AssignmentResponse])
@router.get("/", response_model=List[AssignmentResponse], include_in_schema=False)
def list_assignments(
    course_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Assignment)
    if course_id:
        query = query.filter(Assignment.course_id == course_id)
    assignments = query.offset(skip).limit(limit).all()
    results = []
    for a in assignments:
        res = AssignmentResponse.model_validate(a)
        res.submission_count = (
            db.query(Submission).filter(Submission.assignment_id == a.id).count()
        )
        results.append(res)
    return results


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_assignment(
    assignment_in: AssignmentCreate,
    current_user: User = Depends(require_role("faculty")),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == assignment_in.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    # Normalize due_date to UTC timezone-aware or naive based on input
    due_date = assignment_in.due_date
    if due_date.tzinfo is not None:
        due_date = due_date.astimezone(timezone.utc).replace(tzinfo=None)

    assignment = Assignment(
        id=str(uuid.uuid4()),
        course_id=assignment_in.course_id,
        title=assignment_in.title,
        description=assignment_in.description,
        due_date=due_date,
        max_points=assignment_in.max_points,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    res = AssignmentResponse.model_validate(assignment)
    res.submission_count = 0
    return res


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )
    res = AssignmentResponse.model_validate(assignment)
    res.submission_count = (
        db.query(Submission).filter(Submission.assignment_id == assignment.id).count()
    )
    return res


@router.post(
    "/{assignment_id}/submit",
    response_model=SubmissionReceiptResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_assignment(
    assignment_id: str,
    submission_in: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )

    now_utc = datetime.now(timezone.utc)
    # Compare with due_date
    assignment_due = assignment.due_date
    if assignment_due.tzinfo is None:
        assignment_due = assignment_due.replace(tzinfo=timezone.utc)

    is_late = now_utc > assignment_due
    file_path = submission_in.file_path or "submission.pdf"

    # Check if student already submitted - update or create new
    existing_sub = (
        db.query(Submission)
        .filter(
            Submission.assignment_id == assignment.id,
            Submission.student_id == current_user.id,
        )
        .first()
    )

    if existing_sub:
        existing_sub.file_path = file_path
        existing_sub.submitted_at = now_utc
        existing_sub.is_late = is_late
        existing_sub.updated_at = now_utc
        db.commit()
        db.refresh(existing_sub)
        submission = existing_sub
    else:
        submission = Submission(
            id=str(uuid.uuid4()),
            assignment_id=assignment.id,
            student_id=current_user.id,
            file_path=file_path,
            submitted_at=now_utc,
            is_late=is_late,
            created_at=now_utc,
            updated_at=now_utc,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

    status_badge = "Late Submission" if is_late else "On-Time Submission"
    message = f"Assignment successfully submitted on {now_utc.strftime('%b %d, %Y at %H:%M UTC')} ({status_badge})."

    return SubmissionReceiptResponse(
        receipt_id=f"RCP-{uuid.uuid4().hex[:8].upper()}",
        submission_id=submission.id,
        assignment_id=assignment.id,
        assignment_title=assignment.title,
        file_name=file_path.split("/")[-1],
        submitted_at=submission.submitted_at,
        is_late=is_late,
        status_badge=status_badge,
        message=message,
    )


@router.get("/{assignment_id}/submissions", response_model=List[SubmissionResponse])
def list_assignment_submissions(
    assignment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )

    if current_user.role == "faculty":
        submissions = (
            db.query(Submission).filter(Submission.assignment_id == assignment_id).all()
        )
    else:
        submissions = (
            db.query(Submission)
            .filter(
                Submission.assignment_id == assignment_id,
                Submission.student_id == current_user.id,
            )
            .all()
        )
    return submissions
