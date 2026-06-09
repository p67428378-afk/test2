from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime

from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/assortment-advisor/snacks", response_model=schemas.SnacksDashboardResponse)
def get_snacks_dashboard(db: Session = Depends(get_db)):
    skus_db = crud.get_skus_with_performance(db)
    
    # Format SKUs for response
    skus_response = []
    for s in skus_db:
        perf = s.performance
        skus_response.append(
            schemas.SKUResponseSchema(
                sku_id=str(s.sku_id),
                name=s.name,
                category=s.category,
                private_brand=s.private_brand,
                sales_per_linear_ft=float(perf.sales_per_linear_ft) if perf else 0.0,
                in_stock_rate=float(perf.in_stock_rate) if perf else 0.0,
                status=perf.status if perf else "MAINTAIN"
            )
        )
    
    # Static KPIs matching Stitch design
    kpis = schemas.KPISchema(
        sales_per_linear_ft=425.50,
        private_brand_pct=24.5,
        in_stock_rate=96.8,
        shelf_capacity=92.0
    )
    
    # Generate scenario actions dynamically based on SKU IDs
    conservative_actions = []
    balanced_actions = []
    aggressive_actions = []
    
    for s in skus_db:
        sku_id_str = str(s.sku_id)
        # Conservative actions
        if s.private_brand:
            conservative_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="GROW"))
        elif "Generic" in s.name:
            conservative_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="REMOVE"))
        else:
            conservative_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="KEEP"))
            
        # Balanced actions
        if s.private_brand:
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="GROW"))
        elif "Pretzels" in s.name:
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="SWAP"))
        elif "Generic" in s.name:
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="REMOVE"))
        else:
            balanced_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="KEEP"))
            
        # Aggressive actions
        if s.private_brand:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="GROW"))
        elif "Classic" in s.name or "Nacho" in s.name:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="GROW"))
        elif "Pretzels" in s.name:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="SWAP"))
        elif "Generic" in s.name:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="REMOVE"))
        else:
            aggressive_actions.append(schemas.SKUActionSchema(sku_id=sku_id_str, action="KEEP"))

    scenarios = {
        "Conservative": schemas.ScenarioDetailSchema(
            projected_sales_lift=1.2,
            projected_private_brand_pct=24.0,
            actions_summary="Add: 1 SKU, Keep: 48 SKUs, Swap: 1 SKU, Remove: 1 SKU",
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
            actions_summary="Add: 4 SKUs, Keep: 42 SKUs, Swap: 3 SKUs, Remove: 2 SKUs",
            sku_actions=balanced_actions,
            guardrails=schemas.GuardrailsSchema(
                shelf_space_limit="Passing",
                private_brand_target="Passing",
                sales_growth="Passing"
            )
        ),
        "Aggressive": schemas.ScenarioDetailSchema(
            projected_sales_lift=6.5,
            projected_private_brand_pct=26.2,
            actions_summary="Add: 8 SKUs, Keep: 35 SKUs, Swap: 5 SKUs, Remove: 4 SKUs",
            sku_actions=aggressive_actions,
            guardrails=schemas.GuardrailsSchema(
                shelf_space_limit="Passing",
                private_brand_target="Passing",
                sales_growth="Passing"
            )
        )
    }
    
    return schemas.SnacksDashboardResponse(
        kpis=kpis,
        skus=skus_response,
        scenarios=scenarios
    )

@router.post("/assortment-advisor/review", response_model=schemas.AssortmentReviewResponse)
def submit_assortment_review(payload: schemas.AssortmentReviewRequest, db: Session = Depends(get_db)):
    if payload.scenario_name not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name")
        
    # Convert actions to list of dicts for JSON storage
    actions_list = [{"sku_id": a.sku_id, "action": a.action} for a in payload.actions]
    
    try:
        review = crud.create_assortment_review(
            db=db,
            scenario_name=payload.scenario_name,
            actions=actions_list
        )
        return schemas.AssortmentReviewResponse(
            status="success",
            message="Assortment plan submitted successfully",
            audit_id=str(review.review_id),
            timestamp=review.created_at.isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")
