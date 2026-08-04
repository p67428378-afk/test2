import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cluster_code = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    sku_metrics = relationship("SKUClusterMetrics", back_populates="cluster")


class SKU(Base):
    __tablename__ = "skus"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku_code = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(256), nullable=False)
    category = Column(String(64), nullable=False)
    is_private_brand = Column(Boolean, default=False, nullable=False)
    unit_margin_pct = Column(Float, nullable=False)
    linear_ft_space = Column(Float, nullable=False)

    cluster_metrics = relationship("SKUClusterMetrics", back_populates="sku")


class SKUClusterMetrics(Base):
    __tablename__ = "sku_cluster_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku_id = Column(String(36), ForeignKey("skus.id"), nullable=False)
    cluster_id = Column(String(36), ForeignKey("clusters.id"), nullable=False)
    velocity_units_per_wk = Column(Float, nullable=False)
    status_badge = Column(String(32), nullable=False)

    sku = relationship("SKU", back_populates="cluster_metrics")
    cluster = relationship("Cluster", back_populates="sku_metrics")


class RecommendationAudit(Base):
    __tablename__ = "recommendation_audits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    audit_reference_id = Column(String(64), unique=True, nullable=False, index=True)
    cluster_id = Column(String(36), ForeignKey("clusters.id"), nullable=False)
    scenario_id = Column(String(32), nullable=False)
    submitted_by = Column(String(128), nullable=False)
    guardrails_passed = Column(Boolean, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    cluster = relationship("Cluster")
