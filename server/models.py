import uuid
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

class Product(Base):
    __tablename__ = "Products"

    product_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    sales = Column(Float, default=0.0, nullable=False)
    margin = Column(Float, default=0.0, nullable=False)
    shelf_space = Column(Float, default=0.0, nullable=False)
    in_stock = Column(Boolean, default=True, nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    scenario_items = relationship("ScenarioItem", back_populates="product")


class Scenario(Base):
    __tablename__ = "Scenarios"

    scenario_id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    projected_sales_lift = Column(Float, default=0.0, nullable=False)
    new_private_brand_pct = Column(Float, default=0.0, nullable=False)
    shelf_space_impact_ft = Column(Float, default=0.0, nullable=False)
    is_selected = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    items = relationship("ScenarioItem", back_populates="scenario", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="scenario")


class ScenarioItem(Base):
    __tablename__ = "Scenario_Items"

    item_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(100), ForeignKey("Scenarios.scenario_id"), nullable=False)
    product_id = Column(String(36), ForeignKey("Products.product_id"), nullable=True)
    sku = Column(String(100), nullable=True)
    name = Column(String(255), nullable=True)
    action = Column(String(50), nullable=False)  # 'ADD' or 'REMOVE'
    is_private_brand = Column(Boolean, default=False, nullable=False)
    shelf_space = Column(Float, default=0.0, nullable=False)

    scenario = relationship("Scenario", back_populates="items")
    product = relationship("Product", back_populates="scenario_items")


class Approval(Base):
    __tablename__ = "Approvals"

    approval_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(100), ForeignKey("Scenarios.scenario_id"), nullable=False)
    approver_name = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    guardrail_status = Column(JSON, default=dict, nullable=False)

    scenario = relationship("Scenario", back_populates="approvals")
