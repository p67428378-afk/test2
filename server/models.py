import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    members = relationship(
        "GroupMember",
        back_populates="group",
        cascade="all, delete-orphan",
        order_by="GroupMember.created_at",
    )
    expenses = relationship(
        "Expense",
        back_populates="group",
        cascade="all, delete-orphan",
        order_by="Expense.created_at",
    )


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = Column(
        String(36),
        ForeignKey("groups.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    group = relationship("Group", back_populates="members")
    expenses_paid = relationship(
        "Expense",
        back_populates="payer",
        foreign_keys="Expense.payer_id",
    )
    splits = relationship(
        "ExpenseSplit",
        back_populates="member",
        cascade="all, delete-orphan",
    )


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = Column(
        String(36),
        ForeignKey("groups.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    payer_id = Column(
        String(36),
        ForeignKey("group_members.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category = Column(String(100), nullable=False, default="General")
    split_type = Column(
        String(50), nullable=False, default="EQUAL"
    )  # EQUAL, PERCENTAGE, FIXED
    expense_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    group = relationship("Group", back_populates="expenses")
    payer = relationship(
        "GroupMember", back_populates="expenses_paid", foreign_keys=[payer_id]
    )
    splits = relationship(
        "ExpenseSplit",
        back_populates="expense",
        cascade="all, delete-orphan",
        order_by="ExpenseSplit.created_at",
    )


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    expense_id = Column(
        String(36),
        ForeignKey("expenses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    member_id = Column(
        String(36),
        ForeignKey("group_members.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    split_value = Column(Numeric(10, 2), nullable=False)
    computed_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    expense = relationship("Expense", back_populates="splits")
    member = relationship("GroupMember", back_populates="splits")
