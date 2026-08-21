import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class Deck(Base):
    __tablename__ = "decks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    # Relationships
    cards = relationship("Card", back_populates="deck", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="deck", cascade="all, delete-orphan")


class Card(Base):
    __tablename__ = "cards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    deck_id = Column(
        String(36), ForeignKey("decks.id", ondelete="CASCADE"), nullable=False
    )
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    # Relationships
    deck = relationship("Deck", back_populates="cards")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    deck_id = Column(
        String(36), ForeignKey("decks.id", ondelete="CASCADE"), nullable=False
    )
    score = Column(Integer, nullable=False)
    total_cards = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    # Relationships
    deck = relationship("Deck", back_populates="quizzes")
