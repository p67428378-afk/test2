import uuid
from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from server.app.database import Base

class Product(Base):
    __tablename__ = "products"

    sku = Column(String, primary_key=True, unique=True, nullable=False)
    name = Column(String, nullable=False)
    sales_volume = Column(Numeric, nullable=False, default=0.0)
    sales_trend = Column(Numeric, nullable=False, default=0.0)
    is_private_brand = Column(Boolean, nullable=False, default=False)
    status = Column(String, nullable=False)

    actions = relationship("AssortmentPlanAction", back_populates="product")


class AssortmentPlan(Base):
    __tablename__ = "assortment_plans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), nullable=False)
    scenario_name = Column(String, nullable=False)
    submitted_by = Column(String, nullable=False)
    submitted_at = Column(DateTime(timezone=True), nullable=False)
    guardrails_passed = Column(Boolean, nullable=False)
    projected_sales = Column(Numeric, nullable=False)
    projected_private_brand_pct = Column(Numeric, nullable=False)
    audit_trail_id = Column(String, default=lambda: str(uuid.uuid4()), nullable=False)
    summary = Column(String, nullable=False)

    actions = relationship("AssortmentPlanAction", back_populates="plan", cascade="all, delete-orphan")


class AssortmentPlanAction(Base):
    __tablename__ = "assortment_plan_actions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), nullable=False)
    plan_id = Column(String, ForeignKey("assortment_plans.id"), nullable=False)
    sku = Column(String, ForeignKey("products.sku"), nullable=False)
    action = Column(String, nullable=False)

    plan = relationship("AssortmentPlan", back_populates="actions")
    product = relationship("Product", back_populates="actions")
