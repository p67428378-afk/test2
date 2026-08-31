import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="student", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    progress_records = relationship(
        "StudentProgress", back_populates="user", cascade="all, delete-orphan"
    )


class Module(Base):
    __tablename__ = "modules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    subject = Column(
        String(100), index=True, nullable=False
    )  # 'anatomy', 'physiology', 'biochemistry'
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    animation_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    image_layers = relationship(
        "ImageLayer",
        back_populates="module",
        cascade="all, delete-orphan",
        order_by="ImageLayer.layer_order",
    )
    checkpoints = relationship(
        "AnimationCheckpoint",
        back_populates="module",
        cascade="all, delete-orphan",
        order_by="AnimationCheckpoint.timestamp_seconds",
    )
    progress_records = relationship(
        "StudentProgress", back_populates="module", cascade="all, delete-orphan"
    )


class ImageLayer(Base):
    __tablename__ = "image_layers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    module_id = Column(
        String(36),
        ForeignKey("modules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    layer_name = Column(String(100), nullable=False)
    layer_order = Column(Integer, default=0, nullable=False)
    image_url = Column(String(500), nullable=False)

    module = relationship("Module", back_populates="image_layers")
    hotspots = relationship(
        "Hotspot", back_populates="layer", cascade="all, delete-orphan"
    )


class Hotspot(Base):
    __tablename__ = "hotspots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    layer_id = Column(
        String(36),
        ForeignKey("image_layers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    x_percent = Column(Float, nullable=False)
    y_percent = Column(Float, nullable=False)
    title = Column(String(255), nullable=False)
    clinical_notes = Column(Text, nullable=True)
    clinical_significance = Column(Text, nullable=True)

    layer = relationship("ImageLayer", back_populates="hotspots")


class AnimationCheckpoint(Base):
    __tablename__ = "animation_checkpoints"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    module_id = Column(
        String(36),
        ForeignKey("modules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp_seconds = Column(Float, nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(
        JSON, nullable=False
    )  # List of strings: ["Option A", "Option B", ...]
    correct_option = Column(Integer, nullable=False)  # Index of the correct option

    module = relationship("Module", back_populates="checkpoints")


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    module_id = Column(
        String(36),
        ForeignKey("modules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    score = Column(Integer, default=0, nullable=False)
    completed_checkpoints = Column(
        JSON, default=list, nullable=True
    )  # List of checkpoint IDs
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    user = relationship("User", back_populates="progress_records")
    module = relationship("Module", back_populates="progress_records")
