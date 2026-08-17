import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    items = relationship("Item", back_populates="user")
    claims = relationship(
        "Claim", foreign_keys="Claim.claimant_id", back_populates="claimant"
    )
    verified_claims = relationship(
        "Claim", foreign_keys="Claim.verifier_id", back_populates="verifier"
    )
    messages = relationship("Message", back_populates="sender")


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    item_type = Column(String(50), nullable=False)  # 'lost' or 'found'
    category = Column(String(100), nullable=False)
    color = Column(String(50), nullable=True)
    brand = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    item_date = Column(Date, nullable=False)
    status = Column(
        String(50), nullable=False, default="open"
    )  # 'open', 'claimed', 'returned'
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="items")
    images = relationship(
        "ItemImage", back_populates="item", cascade="all, delete-orphan"
    )
    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")


class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    item = relationship("Item", back_populates="images")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    claimant_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    verifier_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(
        String(50), nullable=False, default="pending"
    )  # 'pending', 'approved', 'rejected'
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    item = relationship("Item", back_populates="claims")
    claimant = relationship("User", foreign_keys=[claimant_id], back_populates="claims")
    verifier = relationship(
        "User", foreign_keys=[verifier_id], back_populates="verified_claims"
    )
    messages = relationship(
        "Message", back_populates="claim", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    sender_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    claim = relationship("Claim", back_populates="messages")
    sender = relationship("User", back_populates="messages")
