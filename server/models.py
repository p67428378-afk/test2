from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    products = relationship(
        "Product", back_populates="user", cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    product_name = Column(String(255), nullable=False)
    serial_number = Column(String(255), nullable=False, index=True)
    brand = Column(String(255), nullable=True, index=True)
    category = Column(String(255), nullable=True, index=True)
    purchase_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="products")
    warranty = relationship(
        "Warranty",
        back_populates="product",
        uselist=False,
        cascade="all, delete-orphan",
    )
    claims = relationship(
        "Claim", back_populates="product", cascade="all, delete-orphan"
    )
    receipts = relationship(
        "Receipt", back_populates="product", cascade="all, delete-orphan"
    )


class Warranty(Base):
    __tablename__ = "warranties"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(
        String(36), ForeignKey("products.id"), unique=True, nullable=False
    )
    duration_months = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False, index=True)
    status = Column(
        String(50), nullable=False, default="ACTIVE", index=True
    )  # ACTIVE, EXPIRING_SOON, EXPIRED
    vendor_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    product = relationship("Product", back_populates="warranty")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(
        String(36), ForeignKey("products.id"), nullable=False, index=True
    )
    claim_date = Column(Date, nullable=False)
    issue_description = Column(Text, nullable=False)
    status = Column(
        String(50), nullable=False, default="PENDING", index=True
    )  # PENDING, APPROVED, REJECTED, COMPLETED
    service_provider = Column(String(255), nullable=True)
    repair_cost = Column(Float, default=0.0)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    product = relationship("Product", back_populates="claims")
    audit_logs = relationship(
        "ClaimAuditLog", back_populates="claim", cascade="all, delete-orphan"
    )


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="receipts")


class ClaimAuditLog(Base):
    __tablename__ = "claim_audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    action = Column(String(255), nullable=False)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=False)
    performed_by = Column(String(255), nullable=True, default="System")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    claim = relationship("Claim", back_populates="audit_logs")
