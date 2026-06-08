import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from server.database import Base


class Snack(Base):
    __tablename__ = "snacks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snack_id = Column(UUID(as_uuid=True), ForeignKey("snacks.id"))
    quantity = Column(Integer, nullable=False)
    location = Column(String)
    expiry_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    snack = relationship("Snack")


class ConsumptionRecord(Base):
    __tablename__ = "consumption_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_item_id = Column(UUID(as_uuid=True), ForeignKey("inventory_items.id"))
    quantity_consumed = Column(Integer, nullable=False)
    consumed_at = Column(DateTime, default=func.now())
    inventory_item = relationship("InventoryItem")


class SnackRequest(Base):
    __tablename__ = "snack_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snack_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    requested_at = Column(DateTime, default=func.now())
