import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Integer, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base


class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(255), nullable=True)
    stock_quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Order(Base):
    __tablename__ = "orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_contents = Column(JSON, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(String, nullable=False)
    payment_status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
