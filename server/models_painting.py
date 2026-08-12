import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class Painting(Base):
    __tablename__ = "paintings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    artist_name = Column(String(255), nullable=True)
    medium = Column(String(100), nullable=True)  # Oil, Acrylic, Watercolor, Mixed Media
    style = Column(String(100), nullable=True)  # Abstract, Landscape, Portrait, Modern
    base_price = Column(Numeric(15, 4), nullable=False)
    is_configurable = Column(Boolean, default=False, nullable=False)
    is_original_one_of_one = Column(Boolean, default=False, nullable=False)
    stock_quantity = Column(Integer, default=1, nullable=False)
    image_url = Column(Text, nullable=True)
    status = Column(
        String(50), default="ACTIVE", nullable=False
    )  # ACTIVE, ARCHIVED, SOLD_OUT

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    cart_items = relationship("CartItem", back_populates="painting")


class FrameOption(Base):
    __tablename__ = "frame_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(
        String(100), nullable=False
    )  # Natural Wood, Matte Black, Metallic Floater, Frameless
    material = Column(String(100), nullable=True)
    price_multiplier = Column(Numeric(10, 4), default=1.0000, nullable=False)
    flat_fee = Column(Numeric(15, 4), default=0.0000, nullable=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    cart_items = relationship("CartItem", back_populates="frame_option")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(String(255), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    painting_id = Column(UUID(as_uuid=True), ForeignKey("paintings.id"), nullable=False)
    frame_option_id = Column(
        UUID(as_uuid=True), ForeignKey("frame_options.id"), nullable=True
    )
    custom_width_inches = Column(Numeric(8, 2), nullable=True)
    custom_height_inches = Column(Numeric(8, 2), nullable=True)
    unit_price = Column(Numeric(15, 4), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    painting = relationship("Painting", back_populates="cart_items")
    frame_option = relationship("FrameOption", back_populates="cart_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    customer_email = Column(String(255), nullable=False)
    shipping_address = Column(
        JSON, nullable=False
    )  # JSON object storing address details
    subtotal = Column(Numeric(15, 4), nullable=False)
    shipping_fee = Column(Numeric(15, 4), nullable=False)
    tax_amount = Column(Numeric(15, 4), nullable=False)
    total_amount = Column(Numeric(15, 4), nullable=False)
    status = Column(String(50), default="Order Placed", nullable=False)
    # Statuses: 'Order Placed', 'In Production', 'Shipped', 'Delivered', 'Cancelled', 'Payment Pending'
    idempotency_key = Column(String(255), unique=True, nullable=True)
    tracking_number = Column(String(100), nullable=True)
    items_json = Column(JSON, nullable=True)  # Detailed line items JSON

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )
