import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON
from server.app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True, default="member")
    created_at = Column(DateTime, nullable=False, default=utc_now)


class SKU(Base):
    __tablename__ = "skus"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku_code = Column(String(50), unique=True, nullable=False, index=True)
    product_name = Column(String(255), nullable=False)
    sub_category = Column(String(100), nullable=False, index=True)
    sales_volume_weekly = Column(Float, nullable=False, default=0.0)
    margin_pct = Column(Float, nullable=False)
    linear_space_ft = Column(Float, nullable=False)
    is_private_brand = Column(Boolean, nullable=False, default=False)
    status_badge = Column(String(20), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=utc_now)
    updated_at = Column(DateTime, nullable=False, default=utc_now, onupdate=utc_now)


class ScenarioModel(Base):
    __tablename__ = "scenario_models"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_name = Column(String(50), unique=True, nullable=False, index=True)
    projected_sales_lift_pct = Column(Float, nullable=False)
    projected_private_brand_pct = Column(Float, nullable=False)
    shelf_capacity_impact_pct = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False, default=utc_now)


class GuardrailRule(Base):
    __tablename__ = "guardrail_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rule_name = Column(String(100), unique=True, nullable=False)
    metric_key = Column(String(50), nullable=False)
    operator = Column(String(10), nullable=False)
    threshold_value = Column(Float, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    audit_ref_id = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String(100), nullable=False)
    scenario_name = Column(String(50), nullable=False)
    cluster_id = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    payload_snapshot = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False, default=utc_now)
