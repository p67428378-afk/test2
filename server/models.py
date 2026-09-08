import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    reviews = relationship(
        "Review", back_populates="user", cascade="all, delete-orphan"
    )
    gift_subscriptions = relationship("GiftSubscription", back_populates="sender")
    box_customizations = relationship("BoxCustomization", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    boxes = relationship("Box", back_populates="category", cascade="all, delete-orphan")


class Box(Base):
    __tablename__ = "boxes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category_id = Column(
        String(36),
        ForeignKey("categories.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    billing_frequency = Column(String(50), default="Monthly", nullable=False)
    image_url = Column(String(500), nullable=True)
    average_rating = Column(Float, default=0.0, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    category = relationship("Category", back_populates="boxes")
    curations = relationship(
        "Curation", back_populates="box", cascade="all, delete-orphan"
    )
    reviews = relationship("Review", back_populates="box", cascade="all, delete-orphan")
    gift_subscriptions = relationship(
        "GiftSubscription", back_populates="box", cascade="all, delete-orphan"
    )
    box_customizations = relationship(
        "BoxCustomization", back_populates="box", cascade="all, delete-orphan"
    )


class Curation(Base):
    __tablename__ = "curations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(
        String(36),
        ForeignKey("boxes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    month_year = Column(String(50), nullable=False)
    theme_title = Column(String(255), nullable=False)
    highlights = Column(Text, nullable=True)
    item_list = Column(JSON, nullable=False, default=list)
    available_replacements = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    box = relationship("Box", back_populates="curations")
    box_customizations = relationship(
        "BoxCustomization", back_populates="curation", cascade="all, delete-orphan"
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(
        String(36),
        ForeignKey("boxes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    box = relationship("Box", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    __table_args__ = (UniqueConstraint("user_id", "box_id", name="uq_user_box_review"),)


class GiftSubscription(Base):
    __tablename__ = "gift_subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(
        String(36),
        ForeignKey("boxes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    sender_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    recipient_email = Column(String(255), index=True, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )

    box = relationship("Box", back_populates="gift_subscriptions")
    sender = relationship("User", back_populates="gift_subscriptions")


class BoxCustomization(Base):
    __tablename__ = "box_customizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(
        String(36),
        ForeignKey("boxes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    curation_id = Column(
        String(36),
        ForeignKey("curations.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    original_item_id = Column(String(100), nullable=False)
    replacement_item_id = Column(String(100), nullable=False)
    status = Column(String(50), default="confirmed", nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    box = relationship("Box", back_populates="box_customizations")
    curation = relationship("Curation", back_populates="box_customizations")
    user = relationship("User", back_populates="box_customizations")
