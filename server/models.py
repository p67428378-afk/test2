import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    favorites = relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    author = Column(String(255), nullable=False)
    category = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    favorites = relationship(
        "Favorite", back_populates="quote", cascade="all, delete-orphan"
    )


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    quote_id = Column(
        String(36), ForeignKey("quotes.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="favorites")
    quote = relationship("Quote", back_populates="favorites")

    __table_args__ = (UniqueConstraint("user_id", "quote_id", name="uq_user_quote"),)
