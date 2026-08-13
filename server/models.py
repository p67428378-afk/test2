import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Float,
    UniqueConstraint,
    TypeDecorator,
    CHAR,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36).
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID

            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            else:
                return value


class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        String(50), default="member", nullable=False
    )  # 'admin', 'organizer', 'member'
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    status = Column(
        String(50), default="DRAFT", nullable=False
    )  # 'DRAFT', 'ACTIVE', 'COMPLETED'
    total_rounds = Column(Integer, default=5, nullable=False)
    current_round = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    registrations = relationship(
        "Registration", back_populates="tournament", cascade="all, delete-orphan"
    )
    rounds = relationship(
        "Round", back_populates="tournament", cascade="all, delete-orphan"
    )
    standings = relationship(
        "Standing", back_populates="tournament", cascade="all, delete-orphan"
    )
    certificates = relationship(
        "Certificate", back_populates="tournament", cascade="all, delete-orphan"
    )


class Player(Base):
    __tablename__ = "players"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    rating = Column(Integer, default=1200, nullable=False)
    fide_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    registrations = relationship(
        "Registration", back_populates="player", cascade="all, delete-orphan"
    )
    standings = relationship(
        "Standing", back_populates="player", cascade="all, delete-orphan"
    )
    certificates = relationship(
        "Certificate", back_populates="player", cascade="all, delete-orphan"
    )


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        UniqueConstraint("tournament_id", "player_id", name="uq_tournament_player"),
    )

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(
        GUID(), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id = Column(
        GUID(), ForeignKey("players.id", ondelete="CASCADE"), nullable=False
    )
    status = Column(
        String(50), default="ACTIVE", nullable=False
    )  # 'ACTIVE', 'WITHDRAWN'
    created_at = Column(DateTime, default=func.now(), nullable=False)

    tournament = relationship("Tournament", back_populates="registrations")
    player = relationship("Player", back_populates="registrations")


class Round(Base):
    __tablename__ = "rounds"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(
        GUID(), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False
    )
    round_number = Column(Integer, nullable=False)
    is_closed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    tournament = relationship("Tournament", back_populates="rounds")
    matches = relationship(
        "Match", back_populates="round", cascade="all, delete-orphan"
    )


class Match(Base):
    __tablename__ = "matches"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    round_id = Column(
        GUID(), ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False
    )
    board_number = Column(Integer, nullable=True)
    white_player_id = Column(
        GUID(), ForeignKey("players.id", ondelete="SET NULL"), nullable=True
    )
    black_player_id = Column(
        GUID(), ForeignKey("players.id", ondelete="SET NULL"), nullable=True
    )
    result = Column(
        String(50), default="PENDING", nullable=False
    )  # 'PENDING', '1-0', '0-1', '0.5-0.5', 'BYE'
    is_bye = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    round = relationship("Round", back_populates="matches")
    white_player = relationship("Player", foreign_keys=[white_player_id])
    black_player = relationship("Player", foreign_keys=[black_player_id])


class Standing(Base):
    __tablename__ = "standings"
    __table_args__ = (
        UniqueConstraint(
            "tournament_id", "player_id", name="uq_tournament_player_standing"
        ),
    )

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(
        GUID(), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id = Column(
        GUID(), ForeignKey("players.id", ondelete="CASCADE"), nullable=False
    )
    total_points = Column(Float, default=0.0, nullable=False)
    buchholz = Column(Float, default=0.0, nullable=False)
    sonneborn_berger = Column(Float, default=0.0, nullable=False)
    rank = Column(Integer, nullable=True)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    tournament = relationship("Tournament", back_populates="standings")
    player = relationship("Player", back_populates="standings")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    verification_uuid = Column(
        GUID(), default=uuid.uuid4, unique=True, index=True, nullable=False
    )
    tournament_id = Column(
        GUID(), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id = Column(
        GUID(), ForeignKey("players.id", ondelete="CASCADE"), nullable=False
    )
    rank = Column(Integer, nullable=False)
    total_points = Column(Float, default=0.0, nullable=False)
    issued_at = Column(DateTime, default=func.now(), nullable=False)
    qr_code_url = Column(String(512), nullable=True)

    tournament = relationship("Tournament", back_populates="certificates")
    player = relationship("Player", back_populates="certificates")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    admin_id = Column(String(255), nullable=True)
    match_id = Column(
        GUID(), ForeignKey("matches.id", ondelete="SET NULL"), nullable=True
    )
    original_score = Column(String(50), nullable=True)
    new_score = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
