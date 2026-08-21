from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserSkillCreate(BaseModel):
    skill_name: str = Field(..., min_length=1, description="Name of the skill")
    type: str = Field(..., description="TEACH or LEARN")
    proficiency: str = Field(..., description="BEGINNER, INTERMEDIATE, or EXPERT")
    category: Optional[str] = None
    description: Optional[str] = None


class UserSkillResponse(BaseModel):
    id: str
    user_id: str
    skill_id: str
    skill_name: str
    type: str
    proficiency: str
    category: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    teach_skills: List[UserSkillResponse] = []
    learn_skills: List[UserSkillResponse] = []

    class Config:
        from_attributes = True


class MatchedSkillDetail(BaseModel):
    user_skill_id: str
    skill_name: str
    proficiency: str


class MatchResponse(BaseModel):
    partner_id: str
    partner_name: str
    partner_email: Optional[str] = None
    teaches_skill: MatchedSkillDetail
    learns_skill: Optional[MatchedSkillDetail] = None
    is_reciprocal: bool

    class Config:
        from_attributes = True


class ExchangeRequestCreate(BaseModel):
    recipient_id: str
    offered_skill_id: str
    requested_skill_id: str
    message: Optional[str] = None


class ExchangeStatusUpdate(BaseModel):
    action: str = Field(..., description="ACCEPT, REJECT, or CANCEL")


class ExchangeRequestResponse(BaseModel):
    id: str
    requester_id: str
    requester_name: str
    recipient_id: str
    recipient_name: str
    offered_skill_id: str
    offered_skill_name: str
    requested_skill_id: str
    requested_skill_name: str
    status: str
    message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
