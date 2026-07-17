import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now())

    wishlist_items = relationship(
        "WishlistItem", back_populates="product", cascade="all, delete-orphan"
    )


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="wishlist")
    items = relationship(
        "WishlistItem", back_populates="wishlist", cascade="all, delete-orphan"
    )


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wishlist_id = Column(UUID(as_uuid=True), ForeignKey("wishlists.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    wishlist = relationship("Wishlist", back_populates="items")
    product = relationship("Product", back_populates="wishlist_items")
