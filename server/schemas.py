from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str

class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str

class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str

class OTPVerifyResponse(BaseModel):
    security_question_session_id: str

class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str

class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str

class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str

class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str

# Code Review System Schemas
class ReviewListItem(BaseModel):
    review_id: UUID
    pr_id: str
    repo_name: str
    status: str
    issues_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class IssueItem(BaseModel):
    issue_id: UUID
    file_path: str
    line_number: int
    message: str
    severity: str

    class Config:
        from_attributes = True

class ReviewDetail(BaseModel):
    review_id: UUID
    pr_id: str
    repo_name: str
    status: str
    title: Optional[str] = None
    branch_name: Optional[str] = None
    scan_duration_seconds: Optional[int] = None
    created_at: datetime
    issues: List[IssueItem]

    class Config:
        from_attributes = True

class CodeReviewConfigSchema(BaseModel):
    pep8_enabled: bool
    max_line_length: int
    owasp_top_10: bool

    class Config:
        from_attributes = True

class WebhookRequest(BaseModel):
    action: str
    pull_request: dict
    repository: dict

class WebhookResponse(BaseModel):
    status: str
    message: str
