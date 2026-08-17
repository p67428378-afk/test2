import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, CHAR, TypeDecorator
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36).
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID

            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            else:
                return value


class Item(Base):
    __tablename__ = "items"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    report_date = Column(DateTime, nullable=False)
    contact_info = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)  # 'lost' or 'found'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    images = relationship(
        "ItemImage", back_populates="item", cascade="all, delete-orphan"
    )
    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")


class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    item_id = Column(GUID(), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(512), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    item = relationship("Item", back_populates="images")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    item_id = Column(GUID(), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    claimant_details = Column(Text, nullable=False)
    claim_date = Column(DateTime, nullable=False)
    status = Column(
        String(50), default="pending", nullable=False
    )  # 'pending', 'approved', 'rejected'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    item = relationship("Item", back_populates="claims")
