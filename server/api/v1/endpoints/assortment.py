from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from uuid import UUID
import uuid
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/dashboard/kpis", response_model=schemas.KPICardsResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    try:
        kpis = crud.get_kpis(db)
        return kpis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error occurs while calculating KPIs: {str(e)}"
        )

@router.get("/dashboard/sku-performance", response_model=schemas.SKUPerformanceResponse)
def get_sku_performance(
    filter: Optional[str] = Query(None, description="Filter by name, brand, or status"),
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
    sort_by: Optional[str] = Query(None, description="Sort by field name, prefix with '-' for desc"),
    db: Session = Depends(get_db)
):
    items, total = crud.get_skus(db, skip=skip, limit=limit, filter_query=filter, sort_by=sort_by)
    page = (skip // limit) + 1
    return {
        "items": items,
        "limit": limit,
        "page": page,
        "total": total
    }

@router.get("/scenarios/default", response_model=schemas.ScenariosDefaultResponse)
def get_default_scenarios(db: Session = Depends(get_db)):
    try:
        scenarios = crud.get_default_scenarios(db)
        return {"scenarios": scenarios}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load default scenarios: {str(e)}"
        )

def _calculate_metrics(base_scenario: models.Scenario, adjustments: list) -> tuple:
    projected_sales = float(base_scenario.projected_sales)
    shelf_utilization = float(base_scenario.shelf_utilization_pct)
    private_brand_change = float(base_scenario.change_in_private_brand_pct)

    for adj in adjustments:
        if adj.action == "ADD":
            projected_sales += 5000.0
            shelf_utilization += 3.5
            private_brand_change += 0.8
        elif adj.action == "REMOVE":
            projected_sales -= 4000.0
            shelf_utilization -= 3.0
            private_brand_change -= 0.6
        elif adj.action == "SWAP":
            projected_sales += 1500.0
            shelf_utilization += 0.5
            private_brand_change += 0.2

    # Cap shelf utilization between 0 and 100
    shelf_utilization = max(0.0, min(100.0, shelf_utilization))
    return projected_sales, shelf_utilization, private_brand_change

@router.post("/scenarios/recalculate", response_model=schemas.RecalculateResponse)
def recalculate_scenario(payload: schemas.RecalculateRequest, db: Session = Depends(get_db)):
    scenario = crud.get_scenario(db, payload.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    projected_sales, shelf_utilization, private_brand_change = _calculate_metrics(scenario, payload.adjustments)

    return {
        "scenario_id": payload.scenario_id,
        "name": payload.name,
        "projected_sales": round(projected_sales, 2),
        "change_in_private_brand_pct": round(private_brand_change, 2),
        "shelf_utilization_pct": round(shelf_utilization, 2)
    }

@router.post("/approval/submit", response_model=schemas.SubmitApprovalResponse)
def submit_approval(payload: schemas.SubmitApprovalRequest, db: Session = Depends(get_db)):
    scenario = crud.get_scenario(db, payload.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    projected_sales, shelf_utilization, private_brand_change = _calculate_metrics(scenario, payload.applied_changes)

    # Guardrail checks
    if shelf_utilization > 95.0:  # Let's say 95% is the guardrail limit for capacity
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guardrail violation: Shelf utilization ({round(shelf_utilization, 1)}%) exceeds 95% capacity limit."
        )
    
    # Calculate private brand % (base 24.5% + change)
    final_private_brand_pct = 24.5 + private_brand_change
    if final_private_brand_pct < 15.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guardrail violation: Private brand percentage ({round(final_private_brand_pct, 1)}%) falls below 15% minimum."
        )

    # Count actions
    added = sum(1 for c in payload.applied_changes if c.action == "ADD")
    removed = sum(1 for c in payload.applied_changes if c.action == "REMOVE")
    swapped = sum(1 for c in payload.applied_changes if c.action == "SWAP")

    summary = {
        "projected_sales_impact": round(projected_sales - float(scenario.projected_sales), 2),
        "scenario_name": scenario.name,
        "total_skus_added": added,
        "total_skus_removed": removed,
        "total_skus_swapped": swapped
    }

    # Save changes and create audit trail
    crud.save_assortment_changes(db, payload.scenario_id, payload.applied_changes)
    audit = crud.create_audit_trail(db, payload.scenario_id, user_id="John Doe", summary=summary)

    return {
        "audit_id": audit.audit_id,
        "message": "Assortment changes submitted successfully",
        "status": "SUCCESS",
        "timestamp": audit.timestamp
    }

@router.get("/confirmation/{audit_id}", response_model=schemas.ConfirmationResponse)
def get_confirmation(audit_id: UUID, db: Session = Depends(get_db)):
    audit = crud.get_audit_trail(db, audit_id)
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit ID not found"
        )
    
    return {
        "audit_id": audit.audit_id,
        "submitted_by": audit.user_id,
        "summary": {
            "projected_sales_impact": audit.summary.get("projected_sales_impact", 0.0),
            "scenario_name": audit.summary.get("scenario_name", "Unknown"),
            "total_skus_added": audit.summary.get("total_skus_added", 0),
            "total_skus_removed": audit.summary.get("total_skus_removed", 0),
            "total_skus_swapped": audit.summary.get("total_skus_swapped", 0)
        },
        "timestamp": audit.timestamp
    }
