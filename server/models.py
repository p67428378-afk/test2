import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")  # 'user' or 'admin'
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    # Relationships
    reported_items = relationship(
        "Item", back_populates="reporter", foreign_keys="Item.reporter_id"
    )
    claims = relationship(
        "Claim", back_populates="claimant", foreign_keys="Claim.claimant_id"
    )
    reviewed_claims = relationship(
        "Claim", back_populates="reviewer", foreign_keys="Claim.reviewed_by"
    )
    history_actions = relationship(
        "ClaimHistory", back_populates="actor", foreign_keys="ClaimHistory.actor_id"
    )


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reporter_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # 'lost' or 'found'
    category = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    date_incident = Column(DateTime, nullable=False)
    status = Column(
        String(50), nullable=False, default="unclaimed"
    )  # 'unclaimed', 'claimed', 'reunited'
    contact_info = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    # Relationships
    reporter = relationship(
        "User", back_populates="reported_items", foreign_keys=[reporter_id]
    )
    images = relationship(
        "ItemImage", back_populates="item", cascade="all, delete-orphan"
    )
    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")
    history = relationship(
        "ClaimHistory", back_populates="item", cascade="all, delete-orphan"
    )


class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    image_url = Column(String(512), nullable=False)
    file_size_mb = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

    # Relationships
    item = relationship("Item", back_populates="images")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    claimant_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    proof_of_ownership = Column(Text, nullable=False)
    status = Column(
        String(50), nullable=False, default="pending"
    )  # 'pending', 'approved', 'rejected'
    rejection_reason = Column(String(255), nullable=True)
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(
        DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now
    )

    # Relationships
    item = relationship("Item", back_populates="claims")
    claimant = relationship("User", back_populates="claims", foreign_keys=[claimant_id])
    reviewer = relationship(
        "User", back_populates="reviewed_claims", foreign_keys=[reviewed_by]
    )
    history = relationship(
        "ClaimHistory", back_populates="claim", cascade="all, delete-orphan"
    )


class ClaimHistory(Base):
    __tablename__ = "claim_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(String(36), ForeignKey("items.id"), nullable=False)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=True)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

    # Relationships
    item = relationship("Item", back_populates="history")
    claim = relationship("Claim", back_populates="history")
    actor = relationship("User", back_populates="history_actions")
