import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


# Tournament Schemas
class TournamentBase(BaseModel):
    name: str
    total_rounds: int = Field(default=5, ge=1)


class TournamentCreate(TournamentBase):
    pass


class TournamentResponse(TournamentBase):
    id: uuid.UUID
    status: str
    current_round: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Player Schemas
class PlayerBase(BaseModel):
    full_name: str
    email: EmailStr
    rating: int = Field(default=1200)
    fide_id: Optional[str] = None


class PlayerCreate(PlayerBase):
    tournament_id: Optional[uuid.UUID] = None


class PlayerResponse(PlayerBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class RosterPlayerResponse(PlayerResponse):
    status: str = "ACTIVE"


# Match & Round Schemas
class MatchResponse(BaseModel):
    id: uuid.UUID
    round_id: uuid.UUID
    board_number: Optional[int] = None
    white_player_id: Optional[uuid.UUID] = None
    black_player_id: Optional[uuid.UUID] = None
    white_player_name: Optional[str] = None
    black_player_name: Optional[str] = None
    result: str
    is_bye: bool

    class Config:
        from_attributes = True


class MatchResultSubmit(BaseModel):
    match_id: uuid.UUID
    result: str = Field(description="Match outcome: 1-0, 0-1, 0.5-0.5, or BYE")


class RoundResponse(BaseModel):
    id: uuid.UUID
    tournament_id: uuid.UUID
    round_number: int
    is_closed: bool
    matches: List[MatchResponse] = []

    class Config:
        from_attributes = True


# Standing Schemas
class StandingResponse(BaseModel):
    rank: Optional[int] = None
    player_id: uuid.UUID
    full_name: str
    total_points: float
    buchholz: float
    sonneborn_berger: float
    rating: Optional[int] = None

    class Config:
        from_attributes = True


# Certificate Schemas
class CertificateVerificationResponse(BaseModel):
    verification_uuid: uuid.UUID
    valid: bool = True
    player_name: str
    tournament_name: str
    rank: int
    total_points: float
    issued_at: datetime
    qr_code_url: Optional[str] = None

    class Config:
        from_attributes = True
