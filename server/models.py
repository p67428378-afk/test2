
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from server.database import Base

class Snack(Base):
    __tablename__ = "snacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    inventory_items = relationship("InventoryItem", back_populates="snack")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snack_id = Column(UUID(as_uuid=True), ForeignKey("snacks.id"))
    quantity = Column(Integer, nullable=False)
    location = Column(String)
    expiry_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    snack = relationship("Snack", back_populates="inventory_items")
    consumption_records = relationship("ConsumptionRecord", back_populates="inventory_item")

class ConsumptionRecord(Base):
    __tablename__ = "consumption_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_item_id = Column(UUID(as_uuid=True), ForeignKey("inventory_items.id"))
    quantity_consumed = Column(Integer, nullable=False)
    consumed_at = Column(DateTime, default=func.now())

    inventory_item = relationship("InventoryItem", back_populates="consumption_records")

class SnackRequest(Base):
    __tablename__ = "snack_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    requested_at = Column(DateTime, default=func.now())
