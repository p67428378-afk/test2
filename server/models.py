import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    reviews = relationship(
        "Review", back_populates="user", cascade="all, delete-orphan"
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    boxes = relationship("Box", back_populates="category", cascade="all, delete-orphan")


class Box(Base):
    __tablename__ = "boxes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category_id = Column(
        String(36), ForeignKey("categories.id"), index=True, nullable=False
    )
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, index=True, nullable=False)
    billing_frequency = Column(String(50), nullable=False, default="Monthly")
    image_url = Column(String(512), nullable=True)
    average_rating = Column(Float, index=True, default=0.0, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    category = relationship("Category", back_populates="boxes")
    curations = relationship(
        "Curation", back_populates="box", cascade="all, delete-orphan"
    )
    reviews = relationship("Review", back_populates="box", cascade="all, delete-orphan")


class Curation(Base):
    __tablename__ = "curations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(String(36), ForeignKey("boxes.id"), index=True, nullable=False)
    month_year = Column(String(50), nullable=False)
    theme_title = Column(String(255), nullable=False)
    highlights = Column(Text, nullable=False)
    item_list = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    box = relationship("Box", back_populates="curations")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    box_id = Column(String(36), ForeignKey("boxes.id"), index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    __table_args__ = (UniqueConstraint("user_id", "box_id", name="uq_user_box_review"),)

    box = relationship("Box", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
