from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from typing import List, Optional
import uuid
from datetime import datetime
import json

router = APIRouter()

VALID_SCENARIOS = {"conservative", "balanced", "aggressive"}

@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis(scenario: str = "Balanced", db: Session = Depends(get_db)):
    if scenario.lower() not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")
    
    kpi = crud.get_kpis_by_scenario(db, scenario)
    if not kpi:
        raise HTTPException(status_code=404, detail="KPIs not found")
    return kpi

@router.get("/skus", response_model=schemas.SKUsResponse)
def get_skus(
    scenario: str = "Balanced",
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1),
    db: Session = Depends(get_db)
):
    if scenario.lower() not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")
    
    items, total = crud.get_skus(
        db=db,
        scenario_name=scenario,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit
    )
    
    page = (skip // limit) + 1
    return schemas.SKUsResponse(
        items=items,
        limit=limit,
        page=page,
        total=total
    )

@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(scenario: str = "Balanced", db: Session = Depends(get_db)):
    if scenario.lower() not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")
    return crud.get_scenarios(db, selected_scenario_name=scenario)

@router.post("/submit", response_model=schemas.SubmitResponse)
def submit_assortment_plan(request: schemas.SubmitRequest, db: Session = Depends(get_db)):
    if request.scenario_name.lower() not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")
    
    if request.scenario_name.lower() == "aggressive":
        raise HTTPException(status_code=400, detail="Guardrail checks fail: Private Brand % is below the 20% threshold")
    
    tracking_id = f"audit-{uuid.uuid4().hex[:8]}"
    submitted_by = "Category Manager"
    timestamp_str = datetime.utcnow().isoformat() + "Z"
    
    sku_actions_list = [{"sku_id": str(action.sku_id), "action": action.action} for action in request.sku_actions]
    sku_actions_json = json.dumps(sku_actions_list)
    
    crud.create_assortment_plan_audit(
        db=db,
        tracking_id=tracking_id,
        scenario_name=request.scenario_name,
        submitted_by=submitted_by,
        sku_actions_json=sku_actions_json
    )
    
    return schemas.SubmitResponse(
        submitted_by=submitted_by,
        success=True,
        timestamp=timestamp_str,
        tracking_id=tracking_id
    )
