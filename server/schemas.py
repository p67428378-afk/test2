from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


# Deck Schemas
class DeckBase(BaseModel):
    title: str = Field(..., description="Title of the study deck")
    description: Optional[str] = Field(
        None, description="Optional description of the study deck"
    )


class DeckCreate(DeckBase):
    pass


class DeckUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Updated title of the study deck")
    description: Optional[str] = Field(
        None, description="Updated description of the study deck"
    )


class DeckResponse(DeckBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Card Schemas
class CardBase(BaseModel):
    front: str = Field(..., description="Front side of the card (question/prompt)")
    back: str = Field(..., description="Back side of the card (answer/explanation)")


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    front: Optional[str] = Field(None, description="Updated front side of the card")
    back: Optional[str] = Field(None, description="Updated back side of the card")


class CardResponse(CardBase):
    id: str
    deck_id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Quiz Schemas
class QuizStartRequest(BaseModel):
    deck_id: str


class CardQuizResponse(BaseModel):
    id: str
    front: str
    model_config = ConfigDict(from_attributes=True)


class QuizStartResponse(BaseModel):
    quiz_id: str
    deck_id: str
    total_cards: int
    cards: List[CardQuizResponse]


class QuizSubmitRequest(BaseModel):
    score: int = Field(..., description="Number of correct answers")
    total_cards: int = Field(
        ..., description="Total number of cards in the quiz session"
    )


class QuizSubmitResponse(BaseModel):
    id: str
    deck_id: str
    score: int
    total_cards: int
    completed_at: datetime
    model_config = ConfigDict(from_attributes=True)
