from sqlalchemy.orm import Session
from server import models, schemas
from typing import Optional


def get_kpis(db: Session):
    return db.query(models.KPIData).first()


def get_skus(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    brand: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
):
    query = db.query(models.Product)
    if search:
        query = query.filter(
            (models.Product.sku.ilike(f"%{search}%"))
            | (models.Product.name.ilike(f"%{search}%"))
        )
    if brand:
        query = query.filter(models.Product.brand.ilike(f"%{brand}%"))
    if status:
        query = query.filter(models.Product.recommendation.ilike(f"%{status}%"))

    if sort_by:
        col = getattr(models.Product, sort_by, None)
        if col is not None:
            if sort_order == "desc":
                query = query.order_by(col.desc())
            else:
                query = query.order_by(col.asc())
    else:
        query = query.order_by(models.Product.sku.asc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def create_assortment_plan(
    db: Session, plan_in: schemas.SubmitPlanRequest, manager_name: str
):
    import random

    audit_id = f"AP-541-{random.randint(100000, 999999)}"

    db_plan = models.AssortmentPlan(
        selected_scenario=plan_in.selected_scenario,
        audit_id=audit_id,
        manager_name=manager_name,
    )
    db.add(db_plan)
    db.flush()  # Get db_plan.id

    for action_item in plan_in.sku_actions:
        product = (
            db.query(models.Product)
            .filter(models.Product.sku == action_item.sku)
            .first()
        )
        if product:
            db_action = models.PlanSKUAction(
                plan_id=db_plan.id, product_id=product.id, action=action_item.action
            )
            db.add(db_action)

    db.commit()
    db.refresh(db_plan)
    return db_plan
