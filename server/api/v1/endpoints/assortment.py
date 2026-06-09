from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/assortment-advisor/snacks", response_model=schemas.AssortmentDashboardResponse)
def get_assortment_dashboard(db: Session = Depends(get_db)):
    # Seed initial data if empty
    crud.seed_initial_data(db)

    # Fetch SKUs
    db_skus = crud.get_skus(db)
    
    # Map to response schema
    sku_performance_response = []
    for sku in db_skus:
        perf = sku.performance
        sku_performance_response.append(
            schemas.SKUPerformanceSchema(
                sku_id=str(sku.id),
                sku_number=sku.sku_number,
                name=sku.name,
                private_brand=sku.private_brand,
                sales_per_week=float(perf.sales_per_week) if perf else 0.0,
                in_stock_rate=float(perf.in_stock_rate) if perf else 0.0,
                shelf_capacity_used=float(perf.shelf_capacity_used) if perf else 0.0,
                status_badge=perf.status_badge if perf else "MAINTAIN"
            )
        )

    # Default KPIs
    kpis = schemas.KPISchema(
        sales_per_linear_ft=425.50,
        private_brand_pct=24.5,
        in_stock_rate=96.8,
        shelf_capacity=92.0
    )

    # Generate scenario actions using actual SKU IDs
    conservative_actions = []
    balanced_actions = []
    aggressive_actions = []

    for sku in db_skus:
        sku_id_str = str(sku.id)
        # Conservative actions
        conservative_actions.append(
            schemas.SKUActionSchema(sku_id=sku_id_str, action="KEEP")
        )
        # Balanced actions
        if sku.name == "Clover Valley Pretzels 16oz":
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="SWAP"))
        elif sku.name == "Generic Cheese Balls 12oz":
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="REMOVE"))
        else:
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="KEEP"))
        
        # Aggressive actions
        if sku.name == "Clover Valley Pretzels 16oz" or sku.name == "Cheetos Crunchy 8.5oz":
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="SWAP"))
        elif sku.name == "Generic Cheese Balls 12oz":
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="REMOVE"))
        else:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="GROW"))

    scenarios = {
        "conservative": schemas.ScenarioDetailSchema(
            name="Conservative",
            projected_sales_lift=1.2,
            projected_private_brand_pct=22.5,
            actions_summary="Keep: 45 SKUs, Swap: 1 SKU, Remove: 1 SKU",
            sku_actions=conservative_actions,
            guardrails=[
                schemas.GuardrailItemSchema(name="Shelf Capacity Compliance", status="Passing"),
                schemas.GuardrailItemSchema(name="Private Brand Minimum (20%)", status="Passing"),
                schemas.GuardrailItemSchema(name="Vendor In-Stock SLA", status="Passing")
            ]
        ),
        "balanced": schemas.ScenarioDetailSchema(
            name="Balanced",
            projected_sales_lift=3.8,
            projected_private_brand_pct=24.8,
            actions_summary="New: 4 SKUs, Keep: 42 SKUs, Swap: 3 SKUs, Remove: 2 SKUs",
            sku_actions=balanced_actions,
            guardrails=[
                schemas.GuardrailItemSchema(name="Shelf Capacity Compliance", status="Passing"),
                schemas.GuardrailItemSchema(name="Private Brand Minimum (20%)", status="Passing"),
                schemas.GuardrailItemSchema(name="Vendor In-Stock SLA", status="Passing")
            ]
        ),
        "aggressive": schemas.ScenarioDetailSchema(
            name="Aggressive",
            projected_sales_lift=6.5,
            projected_private_brand_pct=28.2,
            actions_summary="New: 8 SKUs, Keep: 38 SKUs, Swap: 5 SKUs, Remove: 4 SKUs",
            sku_actions=aggressive_actions,
            guardrails=[
                schemas.GuardrailItemSchema(name="Shelf Capacity Compliance", status="Passing"),
                schemas.GuardrailItemSchema(name="Private Brand Minimum (20%)", status="Passing"),
                schemas.GuardrailItemSchema(name="Vendor In-Stock SLA", status="Passing")
            ]
        )
    }

    return schemas.AssortmentDashboardResponse(
        kpis=kpis,
        sku_performance=sku_performance_response,
        scenarios=scenarios
    )

@router.post("/assortment-advisor/review", response_model=schemas.AssortmentReviewResponse)
def submit_assortment_review(review: schemas.AssortmentReviewRequest, db: Session = Depends(get_db)):
    if review.scenario not in ["conservative", "balanced", "aggressive", "Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name. Must be conservative, balanced, or aggressive.")
    
    if not review.actions:
        raise HTTPException(status_code=400, detail="Actions list cannot be empty.")

    try:
        # Generate audit ID
        audit_id = f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
        
        # Generate actions summary
        actions_summary = f"Scenario: {review.scenario}, Actions Count: {len(review.actions)}"
        
        # Save to database
        db_review = crud.create_assortment_review(
            db,
            review,
            audit_id=audit_id,
            actions_summary=actions_summary
        )
        
        return schemas.AssortmentReviewResponse(
            status="SUCCESS",
            audit_id=audit_id,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")
