from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class MemberBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    role: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = None


class MemberCreate(MemberBase):
    pass


class MemberResponse(MemberBase):
    id: str
    team_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    unit_code: str = Field(..., min_length=1, max_length=50)
    site_id: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):
    id: str
    members: List[MemberResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
