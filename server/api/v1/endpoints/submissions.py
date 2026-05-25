
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from server.schemas.submission import SubmissionCreate, SubmissionResponse, SubmissionStatusResponse
from server.services.submission_service import submission_service
from server.models.submission import FormSubmission
from server.db.session import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/submissions", response_model=SubmissionResponse)
async def create_submission(
    submission: SubmissionCreate,
    db: Session = Depends(get_db)
):
    """
    Accepts a new Form 15G/15H submission.
    """
    try:
        db_submission = await submission_service.process_submission(db, submission)
        message = "Submission received and is being processed." if db_submission.status == 'PENDING' else f"Submission {db_submission.status.lower()}: {db_submission.rejection_reason or 'Successfully processed.'}"
        return SubmissionResponse(
            submission_id=db_submission.submission_id,
            status=db_submission.status,
            message=message,
            submission_date=db_submission.submission_date
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.get("/submissions/{submission_id}", response_model=SubmissionStatusResponse)
def get_submission_status(
    submission_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Retrieves the status of a specific submission.
    """
    db_submission = db.query(FormSubmission).filter(FormSubmission.submission_id == submission_id).first()
    if not db_submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return db_submission
