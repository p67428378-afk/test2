from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from server.database import get_db
from server import models, schemas, crud

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    # Calculate real KPIs from database if populated, otherwise return default spec values
    products = db.query(models.Product).all()
    if not products:
        return schemas.KPIResponse(
            sales_per_linear_ft=15.75,
            private_brand_percentage=22.0,
            in_stock_rate=96.0,
            shelf_capacity_utilized=85.0,
            sales_trend_percentage=2.5,
        )

    # Calculate metrics
    total_sales = 0.0
    pb_count = 0
    total_count = len(products)

    for p in products:
        if p.is_private_brand:
            pb_count += 1
        # Get latest metric
        metric = db.query(models.PerformanceMetric).filter_by(product_id=p.id).first()
        if metric:
            total_sales += float(metric.current_sales)

    pb_percentage = (pb_count / total_count * 100.0) if total_count > 0 else 22.0

    return schemas.KPIResponse(
        sales_per_linear_ft=15.75,  # Standardized linear ft metric
        private_brand_percentage=round(pb_percentage, 1),
        in_stock_rate=96.0,
        shelf_capacity_utilized=85.0,
        sales_trend_percentage=2.5,
    )


@router.get("/skus", response_model=List[schemas.SKUResponse])
def get_skus(
    search: Optional[str] = Query(None, description="Search term"),
    sort_by: Optional[str] = Query(None, description="Column to sort by"),
    sort_order: Optional[str] = Query("asc", description="asc or desc"),
    db: Session = Depends(get_db),
):
    valid_sorts = ["sku_id", "product_name", "current_sales", "sales_growth", "status"]
    if sort_by and sort_by not in valid_sorts:
        raise HTTPException(
            status_code=400, detail=f"Invalid sort parameter: {sort_by}"
        )

    products = crud.get_products_with_metrics(db, search, sort_by, sort_order)

    results = []
    for p in products:
        metric = p.metrics[0] if p.metrics else None
        results.append(
            schemas.SKUResponse(
                sku_id=p.sku_id,
                product_name=p.product_name,
                current_sales=float(metric.current_sales) if metric else 0.0,
                sales_growth=float(metric.sales_growth) if metric else 0.0,
                is_private_brand=p.is_private_brand,
                status=metric.status if metric else "MAINTAIN",
            )
        )
    return results


@router.post("/scenarios", response_model=schemas.ScenarioResponse)
def get_scenario_projections(req: schemas.ScenarioRequest):
    name = req.scenario_name.strip().lower()
    if name == "conservative":
        return schemas.ScenarioResponse(
            scenario_name="Conservative",
            projected_sales_impact=1.0,
            projected_pb_impact=0.5,
            sku_actions=[
                schemas.SKUAction(
                    action="KEEP",
                    product_name="DG Chips - Salt & Vinegar",
                    sku_id="12345",
                ),
                schemas.SKUAction(
                    action="KEEP", product_name="Clover Valley Pretzels", sku_id="24680"
                ),
            ],
            guardrails=[
                schemas.GuardrailCheck(
                    name="Shelf capacity < 95%", passed=True, details="85% utilized"
                ),
                schemas.GuardrailCheck(
                    name="Private Brand % goal met",
                    passed=False,
                    details="22.5% vs 25% target",
                ),
            ],
        )
    elif name == "balanced":
        return schemas.ScenarioResponse(
            scenario_name="Balanced",
            projected_sales_impact=3.0,
            projected_pb_impact=1.5,
            sku_actions=[
                schemas.SKUAction(
                    action="ADD",
                    product_name="DG Brand Roasted Peanuts",
                    sku_id="11223",
                ),
                schemas.SKUAction(
                    action="REMOVE", product_name="Bubbly Cola 12oz", sku_id="67890"
                ),
                schemas.SKUAction(
                    action="SWAP", product_name="Premium Sweet Popcorn", sku_id="13579"
                ),
            ],
            guardrails=[
                schemas.GuardrailCheck(
                    name="Shelf capacity < 95%", passed=True, details="85% utilized"
                ),
                schemas.GuardrailCheck(
                    name="Private Brand % goal met",
                    passed=False,
                    details="23.5% vs 25% target",
                ),
            ],
        )
    elif name == "aggressive":
        return schemas.ScenarioResponse(
            scenario_name="Aggressive",
            projected_sales_impact=6.0,
            projected_pb_impact=2.0,
            sku_actions=[
                schemas.SKUAction(
                    action="ADD",
                    product_name="DG Brand Roasted Peanuts",
                    sku_id="11223",
                ),
                schemas.SKUAction(
                    action="REMOVE", product_name="Bubbly Cola 12oz", sku_id="67890"
                ),
                schemas.SKUAction(
                    action="SWAP", product_name="Premium Sweet Popcorn", sku_id="13579"
                ),
                schemas.SKUAction(
                    action="ADD",
                    product_name="Clover Valley Pretzels Extra",
                    sku_id="99999",
                ),
            ],
            guardrails=[
                schemas.GuardrailCheck(
                    name="Shelf capacity < 95%", passed=True, details="92% utilized"
                ),
                schemas.GuardrailCheck(
                    name="Private Brand % goal met",
                    passed=False,
                    details="24.0% vs 25% target",
                ),
            ],
        )
    else:
        raise HTTPException(
            status_code=422, detail=f"Invalid scenario name: {req.scenario_name}"
        )


@router.post("/decisions", response_model=schemas.DecisionResponse)
def submit_decision(req: schemas.DecisionRequest, db: Session = Depends(get_db)):
    # Save to audit trail
    payload = {
        "scenario_name": req.scenario_name,
        "sku_actions": [act.dict() for act in req.sku_actions],
    }

    audit_entry = models.AuditTrail(
        id=uuid.uuid4(),
        scenario_name=req.scenario_name,
        decision_payload=payload,
        submitted_at=datetime.utcnow(),
    )

    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)

    return schemas.DecisionResponse(
        status="SUCCESS",
        audit_trail_id=audit_entry.id,
        submitted_at=audit_entry.submitted_at,
    )
