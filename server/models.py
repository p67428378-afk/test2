import uuid
from sqlalchemy import Column, String, Numeric, TIMESTAMP, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from .database import Base

# Helper to support UUIDs on both SQLite and PostgreSQL
from sqlalchemy.types import TypeDecorator, CHAR, TEXT
import json


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise CHAR(36), storing as string.
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(UUID())
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
            return value


class SQLiteJSONB(TypeDecorator):
    """Platform-independent JSONB type.
    Uses PostgreSQL's JSONB type, otherwise TEXT, storing as string.
    """

    impl = TEXT
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(JSONB())
        else:
            return dialect.type_descriptor(TEXT())

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return value
        else:
            return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return value
        else:
            return json.loads(value)


class Product(Base):
    __tablename__ = "products"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    sku_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, default="Snacks")
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    performance_metrics = relationship(
        "PerformanceMetric", back_populates="product", uselist=False
    )


class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    product_id = Column(GUID, ForeignKey("products.id"), unique=True, nullable=False)
    current_sales = Column(Numeric(12, 2), nullable=False, default=0.00)
    sales_trend_yoy = Column(Numeric(5, 2), nullable=False, default=0.00)
    profit_margin = Column(Numeric(5, 2), nullable=False, default=0.00)
    in_stock_rate = Column(Numeric(5, 2), nullable=False, default=0.00)
    recommendation = Column(String(20), nullable=False, default="MAINTAIN")
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    product = relationship("Product", back_populates="performance_metrics")


class AssortmentScenario(Base):
    __tablename__ = "assortment_scenarios"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    scenario_type = Column(String(50), unique=True, nullable=False)
    projected_sales_lift = Column(Numeric(5, 2), nullable=False, default=0.00)
    projected_private_brand_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    projected_shelf_capacity_pct = Column(Numeric(5, 2), nullable=False, default=0.00)
    sku_actions = Column(SQLiteJSONB, nullable=False, default=list)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )


class AuditTrail(Base):
    __tablename__ = "audit_trail"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    audit_trail_id = Column(String(50), unique=True, nullable=False)
    scenario_type = Column(String(50), nullable=False)
    submitted_by = Column(String(100), nullable=False)
    sku_changes_summary = Column(String(255), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
