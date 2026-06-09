from sqlalchemy.orm import Session
from server.app import models, schemas
import datetime

def get_products(db: Session):
    return db.query(models.Product).all()

def seed_products(db: Session):
    # Check if products already exist
    if db.query(models.Product).count() > 0:
        return

    initial_products = [
        models.Product(sku="SKU-1001", name="Lay's Classic Chips 10oz", sales_volume=5420.0, sales_trend=5.1, is_private_brand=False, status="MAINTAIN"),
        models.Product(sku="SKU-1002", name="Clover Valley Potato Chips 10oz", sales_volume=6120.0, sales_trend=15.4, is_private_brand=True, status="GROW"),
        models.Product(sku="SKU-1003", name="Doritos Nacho Cheese 9.75oz", sales_volume=4890.0, sales_trend=-2.3, is_private_brand=False, status="MAINTAIN"),
        models.Product(sku="SKU-1004", name="Brand-Name Pretzels 16oz", sales_volume=1200.0, sales_trend=-12.5, is_private_brand=False, status="SWAP"),
        models.Product(sku="SKU-1005", name="Clover Valley Pretzels 12oz", sales_volume=3450.0, sales_trend=8.2, is_private_brand=True, status="GROW"),
        models.Product(sku="SKU-1006", name="Brand-Name Cheese Balls 8oz", sales_volume=850.0, sales_trend=-18.0, is_private_brand=False, status="REDUCE"),
    ]
    db.add_all(initial_products)
    db.commit()

def create_assortment_plan(db: Session, plan_in: schemas.AssortmentPlanCreate):
    # Calculate summary
    adds = sum(1 for item in plan_in.sku_action_list if item.action == "ADD")
    removes = sum(1 for item in plan_in.sku_action_list if item.action == "REMOVE")
    keeps = sum(1 for item in plan_in.sku_action_list if item.action == "KEEP")
    swaps = sum(1 for item in plan_in.sku_action_list if item.action == "SWAP")
    
    summary_parts = []
    if adds > 0:
        summary_parts.append(f"{adds} SKUs added")
    if removes > 0:
        summary_parts.append(f"{removes} removed")
    if keeps > 0:
        summary_parts.append(f"{keeps} maintained")
    if swaps > 0:
        summary_parts.append(f"{swaps} swapped")
        
    summary = ", ".join(summary_parts) if summary_parts else "No changes"

    # Simple guardrail check
    # Private brand % should be between 20% and 35%
    guardrails_passed = 20.0 <= plan_in.projected_private_brand_pct <= 35.0

    db_plan = models.AssortmentPlan(
        scenario_name=plan_in.scenario_name,
        submitted_by=plan_in.submitted_by,
        submitted_at=datetime.datetime.now(datetime.timezone.utc),
        guardrails_passed=guardrails_passed,
        projected_sales=plan_in.projected_sales,
        projected_private_brand_pct=plan_in.projected_private_brand_pct,
        summary=summary
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    # Create actions
    for item in plan_in.sku_action_list:
        db_action = models.AssortmentPlanAction(
            plan_id=db_plan.id,
            sku=item.sku,
            action=item.action
        )
        db.add(db_action)
    db.commit()

    return db_plan
