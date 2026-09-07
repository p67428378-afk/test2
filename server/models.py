import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    game_name = Column(String(255), nullable=False)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    # Relationships
    players = relationship(
        "Player",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="Player.created_at",
        lazy="selectin",
    )
    score_entries = relationship(
        "ScoreEntry",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ScoreEntry.created_at",
        lazy="selectin",
    )


class Player(Base):
    __tablename__ = "players"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    session_id = Column(
        String(36),
        ForeignKey("game_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    # Relationships
    session = relationship("GameSession", back_populates="players")
    score_entries = relationship(
        "ScoreEntry",
        back_populates="player",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ScoreEntry(Base):
    __tablename__ = "score_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    session_id = Column(
        String(36),
        ForeignKey("game_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    player_id = Column(
        String(36),
        ForeignKey("players.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    round_or_category = Column(String(100), nullable=True, default="Round 1")
    points = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    # Relationships
    session = relationship("GameSession", back_populates="score_entries")
    player = relationship("Player", back_populates="score_entries")
