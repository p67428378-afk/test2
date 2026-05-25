
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.db.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(DateTime, default=datetime.utcnow)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    total_amount = Column(Float, nullable=False)
    profit = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    customer = relationship("Customer", back_populates="sales")
    items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sale_id = Column(UUID(as_uuid=True), ForeignKey("sales.id"))
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    sale = relationship("Sale", back_populates="items")
    item = relationship("Item")
