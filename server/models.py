import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Integer, Numeric, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from server.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'broker' or 'buyer'
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    broker_license = Column(String(100), nullable=True)
    broker_agency = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    properties = relationship(
        "Property", back_populates="broker", cascade="all, delete-orphan"
    )
    sent_messages = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan",
    )
    received_messages = relationship(
        "Message",
        foreign_keys="Message.receiver_id",
        back_populates="receiver",
        cascade="all, delete-orphan",
    )


class Property(Base):
    __tablename__ = "properties"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    address = Column(String(255), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    property_type = Column(String(100), nullable=False)
    status = Column(
        String(50), nullable=False, default="ACTIVE"
    )  # 'ACTIVE', 'PENDING', 'SOLD'
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    broker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    broker = relationship("User", back_populates="properties")
    images = relationship(
        "PropertyImage", back_populates="property", cascade="all, delete-orphan"
    )
    messages = relationship(
        "Message", back_populates="property", cascade="all, delete-orphan"
    )


class PropertyImage(Base):
    __tablename__ = "property_images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False
    )
    image_url = Column(String(1024), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    property = relationship("Property", back_populates="images")


class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    property_id = Column(
        UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False
    )
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sender = relationship(
        "User", foreign_keys=[sender_id], back_populates="sent_messages"
    )
    receiver = relationship(
        "User", foreign_keys=[receiver_id], back_populates="received_messages"
    )
    property = relationship("Property", back_populates="messages")
