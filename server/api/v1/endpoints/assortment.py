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
    skus_response = []
    for sku in db_skus:
        perf = sku.performance
        skus_response.append(
            schemas.SKUResponseSchema(
                sku_id=str(sku.sku_id),
                name=sku.name,
                category=sku.category,
                private_brand=sku.private_brand,
                sales_per_linear_ft=float(perf.sales_per_linear_ft) if perf else 0.0,
                in_stock_rate=float(perf.in_stock_rate) if perf else 0.0,
                status=perf.status if perf else "MAINTAIN"
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
        sku_id_str = str(sku.sku_id)
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
        "Conservative": schemas.ScenarioDetailSchema(
            projected_sales_lift=1.2,
            projected_private_brand_pct=22.5,
            actions_summary="Keep: 45 SKUs, Swap: 1 SKU, Remove: 1 SKU",
            sku_actions=conservative_actions,
            guardrails=schemas.GuardrailsSchema(
                shelf_space_limit="Passing",
                private_brand_target="Passing",
                sales_growth="Passing"
            )
        ),
        "Balanced": schemas.ScenarioDetailSchema(
            projected_sales_lift=3.8,
            projected_private_brand_pct=24.8,
            actions_summary="New: 4 SKUs, Keep: 42 SKUs, Swap: 3 SKUs, Remove: 2 SKUs",
            sku_actions=balanced_actions,
            guardrails=schemas.GuardrailsSchema(
                shelf_space_limit="Passing",
                private_brand_target="Passing",
                sales_growth="Passing"
            )
        ),
        "Aggressive": schemas.ScenarioDetailSchema(
            projected_sales_lift=6.5,
            projected_private_brand_pct=28.2,
            actions_summary="New: 8 SKUs, Keep: 38 SKUs, Swap: 5 SKUs, Remove: 4 SKUs",
            sku_actions=aggressive_actions,
            guardrails=schemas.GuardrailsSchema(
                shelf_space_limit="Passing",
                private_brand_target="Passing",
                sales_growth="Passing"
            )
        )
    }

    return schemas.AssortmentDashboardResponse(
        kpis=kpis,
        skus=skus_response,
        scenarios=scenarios
    )

@router.post("/assortment-advisor/review", response_model=schemas.AssortmentReviewResponse)
def submit_assortment_review(review: schemas.AssortmentReviewRequest, db: Session = Depends(get_db)):
    if review.scenario_name not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name. Must be Conservative, Balanced, or Aggressive.")
    
    if not review.actions:
        raise HTTPException(status_code=400, detail="Actions list cannot be empty.")

    try:
        # Save to database
        db_review = crud.create_assortment_review(db, review, user_id="John Doe")
        
        return schemas.AssortmentReviewResponse(
            status="SUCCESS",
            message="Assortment plan submitted successfully.",
            audit_id=str(db_review.review_id),
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")
