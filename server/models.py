import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from server.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    expenses = relationship("Expense", back_populates="category", cascade="all, delete-orphan")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False, default=date.today)
    category_id = Column(String(36), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    payment_method = Column(String(50), nullable=False, default="Credit Card")
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    category = relationship("Category", back_populates="expenses")
