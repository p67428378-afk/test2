from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from server import crud, schemas
from server.database import get_db

router = APIRouter()

VALID_SCENARIOS = {"conservative", "balanced", "aggressive"}

def validate_scenario(scenario: Optional[str]) -> Optional[str]:
    if scenario is not None:
        if scenario.lower() not in VALID_SCENARIOS:
            raise HTTPException(status_code=400, detail="Invalid scenario name provided")
        return scenario
    return "Balanced"

@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis(scenario: Optional[str] = Query(None, description="Scenario name (Conservative, Balanced, Aggressive)")):
    scen = validate_scenario(scenario)
    scen_lower = scen.lower() if scen else "balanced"
    
    if scen_lower == "conservative":
        return schemas.KPIResponse(
            sales_per_linear_ft=40.0,
            private_brand_percentage=14.0,
            in_stock_rate=96.5,
            shelf_capacity=80
        )
    elif scen_lower == "aggressive":
        return schemas.KPIResponse(
            sales_per_linear_ft=55.0,
            private_brand_percentage=18.5,
            in_stock_rate=92.0,
            shelf_capacity=90
        )
    else: # balanced
        return schemas.KPIResponse(
            sales_per_linear_ft=45.5,
            private_brand_percentage=15.2,
            in_stock_rate=94.8,
            shelf_capacity=85
        )

@router.get("/skus", response_model=List[schemas.SKUResponse])
def get_skus(
    scenario: Optional[str] = Query(None, description="Scenario name (Conservative, Balanced, Aggressive)"),
    db: Session = Depends(get_db)
):
    scen = validate_scenario(scenario)
    skus = crud.get_skus(db, scenario=scen)
    return skus

@router.post("/decisions", response_model=schemas.DecisionResponse)
def create_decision(
    decision_in: schemas.DecisionCreateRequest,
    db: Session = Depends(get_db)
):
    if not decision_in.scenario_name or not decision_in.submitted_by:
        raise HTTPException(status_code=400, detail="Invalid request body or missing required fields")
    
    if decision_in.scenario_name.lower() not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")
        
    # Ensure database is initialized and seeded
    crud.seed_skus_if_empty(db)
    
    # Verify that all sku_ids exist
    for item in decision_in.items:
        sku = db.query(crud.models.SKU).filter(crud.models.SKU.id == item.sku_id).first()
        if not sku:
            raise HTTPException(status_code=400, detail=f"SKU with ID {item.sku_id} not found")
            
    db_decision = crud.create_assortment_decision(db, decision_in)
    
    return schemas.DecisionResponse(
        id=db_decision.id,  # type: ignore
        scenario_name=db_decision.scenario_name,  # type: ignore
        submitted_by=db_decision.submitted_by,  # type: ignore
        submitted_at=db_decision.submitted_at,  # type: ignore
        status="APPROVED",
        audit_id=db_decision.audit_id  # type: ignore
    )
