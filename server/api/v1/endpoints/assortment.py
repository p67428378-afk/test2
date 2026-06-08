from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from server.database import get_db
from server import crud, schemas, models

router = APIRouter()

@router.get("/dashboard/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_data(db)
    
    # Calculate or return default KPIs
    # Default KPIs from WorkSpec:
    # sales_per_linear_ft: 145.5, private_brand_pct: 18.5, in_stock_rate: 94.2, shelf_capacity_utilized: 88
    return schemas.KPIResponse(
        sales_per_linear_ft=145.5,
        private_brand_pct=18.5,
        in_stock_rate=94.2,
        shelf_capacity_utilized=88.0
    )

@router.get("/dashboard/skus", response_model=List[schemas.SKUResponse])
def get_skus(db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_data(db)
    
    products = crud.get_products_with_metrics(db)
    skus = []
    for p in products:
        metric = p.metrics[0] if p.metrics else None
        skus.append(schemas.SKUResponse(
            id=p.id,
            sku_number=p.sku_number,
            name=p.name,
            brand=p.brand,
            current_sales=float(metric.current_sales) if metric else 0.0,
            sales_per_linear_ft=float(metric.sales_per_linear_ft) if metric else 0.0,
            in_stock_rate=float(metric.in_stock_rate) if metric else 0.0,
            status=metric.recommendation_status if metric else "MAINTAIN"
        ))
    return skus

@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_data(db)
    
    scenarios = crud.get_scenarios(db)
    return [
        schemas.ScenarioResponse(
            id=s.id,
            name=s.name,
            description=s.description,
            projected_sales_growth=float(s.projected_sales_growth),
            projected_private_brand_pct=float(s.projected_private_brand_pct),
            projected_shelf_capacity=float(s.projected_shelf_capacity)
        )
        for s in scenarios
    ]

@router.post("/scenarios/select", response_model=schemas.ScenarioSelectResponse)
def select_scenario(payload: schemas.ScenarioSelectRequest, db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_data(db)
    
    scenario_name = payload.scenario_name
    scenario = crud.get_scenario_by_name(db, scenario_name)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name: {scenario_name}"
        )
    
    # Define scenario-specific metrics and changes
    if scenario_name == "Conservative":
        projected_kpis = schemas.KPIResponse(
            sales_per_linear_ft=146.5,
            private_brand_pct=18.0,
            in_stock_rate=96.0,
            shelf_capacity_utilized=85.0
        )
        proposed_changes = schemas.ProposedChanges(add=1, keep=45, remove=1, swap=1)
    elif scenario_name == "Balanced":
        projected_kpis = schemas.KPIResponse(
            sales_per_linear_ft=153.94,
            private_brand_pct=21.5,
            in_stock_rate=95.0,
            shelf_capacity_utilized=90.0
        )
        proposed_changes = schemas.ProposedChanges(add=3, keep=15, remove=2, swap=1)
    elif scenario_name == "Aggressive":
        projected_kpis = schemas.KPIResponse(
            sales_per_linear_ft=165.2,
            private_brand_pct=16.2,
            in_stock_rate=93.5,
            shelf_capacity_utilized=92.1
        )
        proposed_changes = schemas.ProposedChanges(add=5, keep=40, remove=3, swap=2)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name: {scenario_name}"
        )
        
    # Guardrail checks
    # Private Brand % >= 15.0%
    # Shelf Capacity <= 95.0%
    private_brand_check = projected_kpis.private_brand_pct >= 15.0
    shelf_capacity_check = projected_kpis.shelf_capacity_utilized <= 95.0
    
    guardrails = schemas.Guardrails(
        private_brand_check=private_brand_check,
        shelf_capacity_check=shelf_capacity_check
    )
    
    # Fetch SKUs
    products = crud.get_products_with_metrics(db)
    skus = []
    for p in products:
        metric = p.metrics[0] if p.metrics else None
        skus.append(schemas.SKUResponse(
            id=p.id,
            sku_number=p.sku_number,
            name=p.name,
            brand=p.brand,
            current_sales=float(metric.current_sales) if metric else 0.0,
            sales_per_linear_ft=float(metric.sales_per_linear_ft) if metric else 0.0,
            in_stock_rate=float(metric.in_stock_rate) if metric else 0.0,
            status=metric.recommendation_status if metric else "MAINTAIN"
        ))
        
    return schemas.ScenarioSelectResponse(
        guardrails=guardrails,
        projected_kpis=projected_kpis,
        proposed_changes=proposed_changes,
        skus=skus
    )

@router.post("/approval/submit", response_model=schemas.ApprovalSubmitResponse)
def submit_approval(payload: schemas.ApprovalSubmitRequest, db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_data(db)
    
    scenario_name = payload.scenario_name
    scenario = crud.get_scenario_by_name(db, scenario_name)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name: {scenario_name}"
        )
        
    # Define scenario-specific changes
    if scenario_name == "Conservative":
        added = 1
        removed = 1
        swapped = 1
        total = 48
    elif scenario_name == "Balanced":
        added = 3
        removed = 2
        swapped = 1
        total = 19
    elif scenario_name == "Aggressive":
        added = 5
        removed = 3
        swapped = 2
        total = 50
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name: {scenario_name}"
        )
        
    # Create transaction ID
    txn_id = f"TXN-{uuid.uuid4().hex[:9].upper()}"
    
    summary_data = {
        "added_skus": added,
        "removed_skus": removed,
        "scenario": scenario_name,
        "swapped_skus": swapped,
        "total_skus": total
    }
    
    # Save decision to database
    decision = models.AssortmentDecision(
        scenario_id=scenario.id,
        approved_by=payload.approved_by,
        transaction_id=txn_id,
        summary=summary_data
    )
    crud.create_assortment_decision(db, decision)
    
    return schemas.ApprovalSubmitResponse(
        approved_by=payload.approved_by,
        success=True,
        summary=schemas.ApprovalSummary(**summary_data),
        timestamp=datetime.utcnow(),
        transaction_id=txn_id
    )
