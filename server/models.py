import uuid
from sqlalchemy import Column, String, Numeric, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Numeric(3, 1), nullable=False)
    description = Column(Text, nullable=True)
    # Store image URLs as a comma-separated string or JSON-like string for SQLite compatibility,
    # but we can parse it in schemas.
    image_urls_raw = Column(Text, nullable=False, default="")

    contacts = relationship(
        "Contact", back_populates="property", cascade="all, delete-orphan"
    )

    @property
    def image_urls(self):
        if not self.image_urls_raw:
            return []
        return [url.strip() for url in self.image_urls_raw.split(",") if url.strip()]

    @image_urls.setter
    def image_urls(self, value):
        if isinstance(value, list):
            self.image_urls_raw = ",".join(value)
        elif isinstance(value, str):
            self.image_urls_raw = value
        else:
            self.image_urls_raw = ""


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False
    )
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    property = relationship("Property", back_populates="contacts")
