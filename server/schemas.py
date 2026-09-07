from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


# --- Game Session Schemas ---
class GameSessionCreate(BaseModel):
    game_name: str = Field(
        ..., min_length=1, max_length=255, description="Name of the board game"
    )

    @field_validator("game_name")
    @classmethod
    def validate_game_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("game_name must not be empty or whitespace only")
        return trimmed


class GameSessionUpdate(BaseModel):
    game_name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[str] = Field(None, max_length=50)

    @field_validator("game_name", "status")
    @classmethod
    def validate_non_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Field must not be empty or whitespace only")
            return trimmed
        return v


class GameSessionResponse(BaseModel):
    id: str
    game_name: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Player Schemas ---
class PlayerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Player name")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Player name must not be empty or whitespace only")
        return trimmed


class PlayerResponse(BaseModel):
    id: str
    session_id: str
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Score Entry Schemas ---
class ScoreEntryCreate(BaseModel):
    player_id: str = Field(..., description="UUID of the player")
    points: float = Field(..., description="Numerical score or point tally to add")
    round_or_category: Optional[str] = Field(
        default="Round 1", max_length=100, description="Round name or score category"
    )

    @field_validator("player_id")
    @classmethod
    def validate_player_id(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("player_id must not be empty")
        return trimmed


class ScoreEntryResponse(BaseModel):
    id: str
    session_id: str
    player_id: str
    points: float
    round_or_category: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Leaderboard Schemas ---
class RankedPlayer(BaseModel):
    player_id: str
    name: str
    total_score: float
    rank: int
    is_winner: bool

    model_config = ConfigDict(from_attributes=True)


class Winner(BaseModel):
    player_id: str
    name: str
    total_score: float

    model_config = ConfigDict(from_attributes=True)


class LeaderboardResponse(BaseModel):
    session_id: str
    game_name: str
    status: str
    ranked_players: List[RankedPlayer]
    winners: List[Winner]

    model_config = ConfigDict(from_attributes=True)
