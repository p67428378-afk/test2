import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Group(Base):
    __tablename__ = "groups"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="group", cascade="all, delete-orphan")
    settlements = relationship("SettlementTransaction", back_populates="group", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    group = relationship("Group", back_populates="members")
    paid_expenses = relationship("Expense", back_populates="payer", foreign_keys="Expense.payer_id")
    expense_splits = relationship("ExpenseSplit", back_populates="member", foreign_keys="ExpenseSplit.member_id")
    settlements_as_payer = relationship(
        "SettlementTransaction",
        back_populates="payer",
        foreign_keys="SettlementTransaction.payer_id",
    )
    settlements_as_payee = relationship(
        "SettlementTransaction",
        back_populates="payee",
        foreign_keys="SettlementTransaction.payee_id",
    )


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    total_amount = Column(Float, nullable=False)
    payer_id = Column(String(36), ForeignKey("group_members.id"), nullable=False, index=True)
    split_type = Column(String(20), nullable=False)  # 'EQUAL', 'EXACT', 'PERCENTAGE'
    date = Column(Date, nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    group = relationship("Group", back_populates="expenses")
    payer = relationship("GroupMember", back_populates="paid_expenses", foreign_keys=[payer_id])
    splits = relationship("ExpenseSplit", back_populates="expense", cascade="all, delete-orphan")


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    expense_id = Column(String(36), ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False, index=True)
    member_id = Column(String(36), ForeignKey("group_members.id"), nullable=False, index=True)
    share_amount = Column(Float, nullable=False)
    percentage = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    expense = relationship("Expense", back_populates="splits")
    member = relationship("GroupMember", back_populates="expense_splits", foreign_keys=[member_id])


class SettlementTransaction(Base):
    __tablename__ = "settlement_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True)
    payer_id = Column(String(36), ForeignKey("group_members.id"), nullable=False, index=True)
    payee_id = Column(String(36), ForeignKey("group_members.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    group = relationship("Group", back_populates="settlements")
    payer = relationship(
        "GroupMember",
        back_populates="settlements_as_payer",
        foreign_keys=[payer_id],
    )
    payee = relationship(
        "GroupMember",
        back_populates="settlements_as_payee",
        foreign_keys=[payee_id],
    )
