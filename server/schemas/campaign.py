from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, model_validator


class CampaignBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    target_amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    start_date: datetime
    end_date: datetime
    status: Optional[str] = "Active"


class CampaignCreate(CampaignBase):
    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError("End date must be after start date.")
        return self


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date is not None and self.end_date is not None:
            if self.end_date <= self.start_date:
                raise ValueError("End date must be after start date.")
        return self


class CampaignResponse(BaseModel):
    id: str
    title: str
    description: str
    target_amount: float
    current_amount: float
    category: str
    status: str
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
    supporter_count: Optional[int] = 0

    class Config:
        from_attributes = True


class CampaignListResponse(BaseModel):
    items: List[CampaignResponse]
    total: int
    skip: int
    limit: int
