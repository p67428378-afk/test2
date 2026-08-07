import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    ForeignKey,
    DateTime,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from server.database import Base


class Seller(Base):
    __tablename__ = "sellers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    store_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    products = relationship(
        "Product", back_populates="seller", cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = Column(
        String(36),
        ForeignKey("sellers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(255), nullable=False, index=True)
    processor = Column(String(150), nullable=False)
    ram = Column(String(50), nullable=False, index=True)
    storage = Column(String(100), nullable=False, index=True)
    gpu = Column(String(150), nullable=False)
    screen_size = Column(String(50), nullable=False)
    condition = Column(String(30), nullable=False, index=True)  # New, Refurbished, Used
    price = Column(Numeric(10, 2), nullable=False, index=True)
    stock_quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    seller = relationship("Seller", back_populates="products")

    __table_args__ = (
        CheckConstraint("price >= 0", name="check_price_non_negative"),
        CheckConstraint("stock_quantity >= 0", name="check_stock_non_negative"),
    )

    @property
    def is_low_stock(self) -> bool:
        return self.stock_quantity < 3
