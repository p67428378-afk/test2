from datetime import date, datetime
from typing import Optional, List, Literal
from pydantic import (
    BaseModel,
    ConfigDict,
    field_validator,
    model_validator,
    ValidationInfo,
)


class LeaveRequestBase(BaseModel):
    user_id: str
    leave_type: Literal["VACATION", "SICK", "PERSONAL", "UNPAID"]
    start_date: date
    end_date: date
    reason: str


class LeaveRequestCreate(LeaveRequestBase):
    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: date, info: ValidationInfo) -> date:
        start_date = info.data.get("start_date")
        if start_date and v < start_date:
            raise ValueError("end_date must be on or after start_date")
        return v

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("reason cannot be empty")
        return v.strip()


class LeaveStatusUpdate(BaseModel):
    status: Literal["APPROVED", "REJECTED"]
    manager_comment: Optional[str] = None

    @model_validator(mode="after")
    def validate_rejection_comment(self) -> "LeaveStatusUpdate":
        if self.status == "REJECTED" and (
            not self.manager_comment or not self.manager_comment.strip()
        ):
            raise ValueError(
                "manager_comment is required when rejecting a leave request"
            )
        if self.manager_comment:
            self.manager_comment = self.manager_comment.strip()
        return self


class LeaveRequestResponse(BaseModel):
    id: str
    user_id: str
    leave_type: str
    start_date: date
    end_date: date
    total_days: int
    reason: str
    status: str
    manager_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeaveRequestListResponse(BaseModel):
    items: List[LeaveRequestResponse]
    total: int
    skip: int
    limit: int
