from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from server.schemas.auth import UserResponse


class SubmissionCreate(BaseModel):
    file_path: Optional[str] = "submission.pdf"


class SubmissionGrade(BaseModel):
    grade: float
    feedback: Optional[str] = None


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assignment_id: str
    student_id: str
    file_path: str
    submitted_at: datetime
    is_late: bool
    grade: Optional[float] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    student: Optional[UserResponse] = None


class SubmissionReceiptResponse(BaseModel):
    receipt_id: str
    submission_id: str
    assignment_id: str
    assignment_title: Optional[str] = None
    file_name: str
    submitted_at: datetime
    is_late: bool
    status_badge: str  # "On-Time Submission" or "Late Submission"
    message: str
