import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Numeric,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)
    role = Column(
        String(50), nullable=False, default="RESEARCHER"
    )  # RESEARCHER, REVIEWER, COMMITTEE_MEMBER, GRANT_ADMIN
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=False)
    pi_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    department = Column(String(255), nullable=False)
    requested_budget = Column(Numeric(12, 2), nullable=False)
    co_investigators = Column(String(500), nullable=True)
    timeline = Column(String(255), nullable=True)
    status = Column(
        String(50), default="DRAFT", nullable=False
    )  # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, REVISED_REQUIRED
    document_url = Column(String(500), nullable=True)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    pi = relationship("User", foreign_keys=[pi_id])
    evaluations = relationship(
        "Evaluation", back_populates="proposal", cascade="all, delete-orphan"
    )
    award = relationship("Award", back_populates="proposal", uselist=False)


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    proposal_id = Column(
        String(36), ForeignKey("proposals.id"), nullable=False, index=True
    )
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    methodology_score = Column(Integer, nullable=True)
    impact_score = Column(Integer, nullable=True)
    feasibility_score = Column(Integer, nullable=True)
    score = Column(Integer, nullable=True)  # Overall rubric score 1-100
    comments = Column(Text, nullable=True)
    is_coi_flagged = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)  # PENDING, COMPLETED

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    proposal = relationship("Proposal", back_populates="evaluations")
    reviewer = relationship("User", foreign_keys=[reviewer_id])


class Award(Base):
    __tablename__ = "awards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    proposal_id = Column(
        String(36), ForeignKey("proposals.id"), nullable=False, unique=True
    )
    allocated_budget = Column(Numeric(12, 2), nullable=False)
    approved_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    decision_notes = Column(Text, nullable=True)
    requires_revised_budget = Column(Boolean, default=False, nullable=False)
    status = Column(
        String(50), default="ACTIVE", nullable=False
    )  # ACTIVE, COMPLETED, PENDING_REVISION, REJECTED

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    proposal = relationship("Proposal", back_populates="award")
    approver = relationship("User", foreign_keys=[approved_by])
    milestones = relationship(
        "Milestone", back_populates="award", cascade="all, delete-orphan"
    )
    expense_logs = relationship(
        "ExpenseLog", back_populates="award", cascade="all, delete-orphan"
    )


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    award_id = Column(String(36), ForeignKey("awards.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="PENDING", nullable=False
    )  # PENDING, SUBMITTED, APPROVED, OVERDUE
    deliverable_url = Column(String(500), nullable=True)
    progress_report = Column(Text, nullable=True)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    award = relationship("Award", back_populates="milestones")


class ExpenseLog(Base):
    __tablename__ = "expense_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    award_id = Column(String(36), ForeignKey("awards.id"), nullable=False, index=True)
    category = Column(
        String(50), nullable=False
    )  # PERSONNEL, EQUIPMENT, TRAVEL, INDIRECT
    amount = Column(Numeric(12, 2), nullable=False)
    description = Column(String(255), nullable=False)
    logged_by = Column(String(36), ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)

    award = relationship("Award", back_populates="expense_logs")
    user = relationship("User", foreign_keys=[logged_by])


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    resource = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
