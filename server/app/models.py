import uuid
from sqlalchemy import Column, String, DateTime, Date, Text, Numeric, ForeignKey
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.app.database import Base

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36), storing as string.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
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


class Body(Base):
    __tablename__ = "bodies"

    body_id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    date_of_death = Column(Date, nullable=True)
    intake_date = Column(DateTime, nullable=False, default=func.now())
    release_date = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False, default="intake")
    location = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    funerals = relationship("Funeral", back_populates="body", cascade="all, delete-orphan")


class Funeral(Base):
    __tablename__ = "funerals"

    funeral_id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    body_id = Column(GUID, ForeignKey("bodies.body_id"), nullable=False)
    service_type = Column(String(50), nullable=False)
    service_date = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    assigned_resources = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="scheduled")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    body = relationship("Body", back_populates="funerals")
    invoice = relationship("Invoice", back_populates="funeral", uselist=False, cascade="all, delete-orphan")


class Invoice(Base):
    __tablename__ = "invoices"

    invoice_id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    funeral_id = Column(GUID, ForeignKey("funerals.funeral_id"), unique=True, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    paid_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(String(50), nullable=False, default="unpaid")
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    funeral = relationship("Funeral", back_populates="invoice")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    item_id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    invoice_id = Column(GUID, ForeignKey("invoices.invoice_id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    invoice = relationship("Invoice", back_populates="items")
