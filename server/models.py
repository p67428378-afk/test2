import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    items = relationship("Item", back_populates="user")
    claims = relationship(
        "Claim", foreign_keys="[Claim.claimant_id]", back_populates="claimant"
    )


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # "lost" or "found"
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=True)
    item_timestamp = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), nullable=False, default="REPORTED_LOST")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    user = relationship("User", back_populates="items")
    images = relationship(
        "ItemImage", back_populates="item", cascade="all, delete-orphan"
    )
    claims = relationship(
        "Claim",
        foreign_keys="[Claim.item_id]",
        back_populates="item",
        cascade="all, delete-orphan",
    )


class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    image_url = Column(String(1024), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    item = relationship("Item", back_populates="images")


class MatchSuggestion(Base):
    __tablename__ = "match_suggestions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    lost_item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    found_item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    confidence_score = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default="suggested")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    lost_item = relationship("Item", foreign_keys=[lost_item_id])
    found_item = relationship("Item", foreign_keys=[found_item_id])


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    claimant_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(
        String(50), nullable=False, default="pending"
    )  # "pending", "approved", "rejected", "superseded_closed"
    proof = Column(Text, nullable=True)
    admin_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    item = relationship("Item", foreign_keys=[item_id], back_populates="claims")
    claimant = relationship("User", foreign_keys=[claimant_id], back_populates="claims")
    admin = relationship("User", foreign_keys=[admin_id])
    history = relationship(
        "ClaimHistory", back_populates="claim", cascade="all, delete-orphan"
    )


class ClaimHistory(Base):
    __tablename__ = "claim_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    performed_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    claim = relationship("Claim", back_populates="history")
    performed_by = relationship("User")
