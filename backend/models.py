from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    account_number = Column(String, unique=True, index=True, nullable=False)
    opening_balance = Column(Float, default=0.0)
    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String, ForeignKey("accounts.id"))
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # "debit" or "credit"
    timestamp = Column(DateTime, default=datetime.utcnow)

    account = relationship("Account", back_populates="transactions")
