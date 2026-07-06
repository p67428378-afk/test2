from sqlalchemy.orm import Session
from . import models
import uuid


def get_products_with_metrics(db: Session):
    # Query products and join with performance metrics
    results = db.query(models.Product).join(models.PerformanceMetric).all()
    skus = []
    for p in results:
        metrics = p.performance_metrics
        skus.append(
            {
                "sku_id": p.sku_id,
                "name": p.name,
                "current_sales": float(metrics.current_sales) if metrics else 0.0,
                "sales_trend_yoy": float(metrics.sales_trend_yoy) if metrics else 0.0,
                "profit_margin": float(metrics.profit_margin) if metrics else 0.0,
                "in_stock_rate": float(metrics.in_stock_rate) if metrics else 0.0,
                "recommendation": metrics.recommendation if metrics else "MAINTAIN",
            }
        )
    return skus


def get_scenario_by_type(db: Session, scenario_type: str):
    return (
        db.query(models.AssortmentScenario)
        .filter(models.AssortmentScenario.scenario_type == scenario_type)
        .first()
    )


def create_audit_trail(
    db: Session,
    audit_trail_id: str,
    scenario_type: str,
    submitted_by: str,
    sku_changes_summary: str,
):
    db_audit = models.AuditTrail(
        id=uuid.uuid4(),
        audit_trail_id=audit_trail_id,
        scenario_type=scenario_type,
        submitted_by=submitted_by,
        sku_changes_summary=sku_changes_summary,
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit
