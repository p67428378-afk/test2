import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from server.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="staff")  # admin, manager, staff
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    adjustments = relationship(
        "StockAdjustment", back_populates="user", cascade="all, delete-orphan"
    )


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    category = Column(String(100), nullable=True)
    unit_price = Column(
        Float, nullable=False, default=0.0
    )  # Float is fine for simple app, but let's use Float/Numeric
    reorder_threshold = Column(Integer, nullable=False, default=0)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    inventory_records = relationship(
        "Inventory", back_populates="item", cascade="all, delete-orphan"
    )
    adjustments = relationship(
        "StockAdjustment", back_populates="item", cascade="all, delete-orphan"
    )


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), unique=True, nullable=False)
    location = Column(String(255), nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    inventory_records = relationship(
        "Inventory", back_populates="warehouse", cascade="all, delete-orphan"
    )
    adjustments = relationship(
        "StockAdjustment", back_populates="warehouse", cascade="all, delete-orphan"
    )


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(
        String(36), ForeignKey("items.id", ondelete="CASCADE"), nullable=False
    )
    warehouse_id = Column(
        String(36), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False
    )
    current_stock = Column(Integer, nullable=False, default=0)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    item = relationship("Item", back_populates="inventory_records")
    warehouse = relationship("Warehouse", back_populates="inventory_records")


class StockAdjustment(Base):
    __tablename__ = "stock_adjustments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    item_id = Column(
        String(36), ForeignKey("items.id", ondelete="CASCADE"), nullable=False
    )
    warehouse_id = Column(
        String(36), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    adjustment_type = Column(
        String(50), nullable=False
    )  # addition, reduction, transfer
    quantity = Column(Integer, nullable=False)
    reason_code = Column(
        String(100), nullable=False
    )  # DAMAGED_GOODS, NEW_STOCK, RECONCILIATION, etc.
    notes = Column(String(1000), nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    item = relationship("Item", back_populates="adjustments")
    warehouse = relationship("Warehouse", back_populates="adjustments")
    user = relationship("User", back_populates="adjustments")
