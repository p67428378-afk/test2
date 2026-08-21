import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from server.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    user_skills = relationship(
        "UserSkill", back_populates="user", cascade="all, delete-orphan"
    )
    outgoing_requests = relationship(
        "ExchangeRequest",
        foreign_keys="ExchangeRequest.requester_id",
        back_populates="requester",
        cascade="all, delete-orphan",
    )
    incoming_requests = relationship(
        "ExchangeRequest",
        foreign_keys="ExchangeRequest.recipient_id",
        back_populates="recipient",
        cascade="all, delete-orphan",
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    user_skills = relationship(
        "UserSkill", back_populates="skill", cascade="all, delete-orphan"
    )


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    skill_id = Column(
        String(36),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type = Column(String(10), nullable=False)  # TEACH or LEARN
    proficiency = Column(String(20), nullable=False)  # BEGINNER, INTERMEDIATE, EXPERT
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")

    offered_in_requests = relationship(
        "ExchangeRequest",
        foreign_keys="ExchangeRequest.offered_skill_id",
        back_populates="offered_skill",
    )
    requested_in_requests = relationship(
        "ExchangeRequest",
        foreign_keys="ExchangeRequest.requested_skill_id",
        back_populates="requested_skill",
    )

    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", "type", name="uq_user_skill_type"),
    )


class ExchangeRequest(Base):
    __tablename__ = "exchange_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    requester_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recipient_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    offered_skill_id = Column(
        String(36),
        ForeignKey("user_skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    requested_skill_id = Column(
        String(36),
        ForeignKey("user_skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status = Column(
        String(20), default="PENDING", nullable=False, index=True
    )  # PENDING, ACCEPTED, REJECTED, CANCELLED
    message = Column(String(1000), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    requester = relationship(
        "User", foreign_keys=[requester_id], back_populates="outgoing_requests"
    )
    recipient = relationship(
        "User", foreign_keys=[recipient_id], back_populates="incoming_requests"
    )
    offered_skill = relationship(
        "UserSkill",
        foreign_keys=[offered_skill_id],
        back_populates="offered_in_requests",
    )
    requested_skill = relationship(
        "UserSkill",
        foreign_keys=[requested_skill_id],
        back_populates="requested_in_requests",
    )
