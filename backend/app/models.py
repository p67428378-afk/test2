from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from backend.app.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    borrower_id = Column(String, index=True)
    loan_amount = Column(Float)
    interest_rate = Column(Float)
    term = Column(String)
    start_date = Column(DateTime(timezone=True), default=func.now())
    end_date = Column(DateTime(timezone=True))
    current_status = Column(String, default="ON_TIME") # ON_TIME, DELAYED, DEFAULT

    repayment_schedules = relationship("RepaymentSchedule", back_populates="loan")
    transactions = relationship("Transaction", back_populates="loan")
    penalties = relationship("Penalty", back_populates="loan")
    audit_logs = relationship("AuditLog", back_populates="loan")

class RepaymentSchedule(Base):
    __tablename__ = "repayment_schedules"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    loan_id = Column(String, ForeignKey("loans.id"))
    due_date = Column(DateTime(timezone=True))
    scheduled_amount = Column(Float)
    status = Column(String, default="SCHEDULED") # SCHEDULED, PAID, MISSED

    loan = relationship("Loan", back_populates="repayment_schedules")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    loan_id = Column(String, ForeignKey("loans.id"))
    payment_date = Column(DateTime(timezone=True), default=func.now())
    amount_paid = Column(Float)
    payment_method = Column(String)

    loan = relationship("Loan", back_populates="transactions")

class Penalty(Base):
    __tablename__ = "penalties"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    loan_id = Column(String, ForeignKey("loans.id"))
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    penalty_type = Column(String) # DELAYED_FEE, DEFAULT_RATE
    amount = Column(Float)
    date_applied = Column(DateTime(timezone=True), default=func.now())
    reason = Column(String)

    loan = relationship("Loan", back_populates="penalties")
    transaction = relationship("Transaction")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    loan_id = Column(String, ForeignKey("loans.id"))
    event_type = Column(String)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    entity_id = Column(String, nullable=True)
    old_state = Column(String, nullable=True)
    new_state = Column(String, nullable=True)
    actor = Column(String, nullable=True)
    context = Column(String, nullable=True)
    hash_signature = Column(String)

    loan = relationship("Loan", back_populates="audit_logs")
