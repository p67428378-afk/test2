from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, models, schemas
from server.database import get_db

router = APIRouter()

@router.get("/kpis", response_model=schemas.KPIDataResponse)
def get_kpis():
    return {
        "in_stock_rate": 96.8,
        "in_stock_target": 95.0,
        "private_brand_percentage": 24.5,
        "private_brand_target": 30.0,
        "sales_per_linear_ft": 1245.5,
        "sales_per_linear_ft_change": 8.2,
        "shelf_capacity_percentage": 88.0,
        "shelf_capacity_total": 100.0,
        "shelf_capacity_used": 88.0
    }

@router.get("/skus/performance", response_model=List[schemas.SKUPerformanceResponse])
def get_skus_performance(skip: int = 0, limit: int = 20):
    skus = [
        {
            "sku_id": "SKU-40129",
            "product_name": "Clover Valley Potato Chips 10oz",
            "brand": "Clover Valley [Private Brand]",
            "weekly_sales": 1450.0,
            "linear_ft": 2.0,
            "sales_per_linear_ft": 725.0,
            "status": "GROW"
        },
        {
            "sku_id": "SKU-40130",
            "product_name": "Lay's Classic 13oz",
            "brand": "Lay's",
            "weekly_sales": 2100.0,
            "linear_ft": 3.5,
            "sales_per_linear_ft": 600.0,
            "status": "MAINTAIN"
        },
        {
            "sku_id": "SKU-40131",
            "product_name": "Clover Valley Pretzels 16oz",
            "brand": "Clover Valley [Private Brand]",
            "weekly_sales": 320.0,
            "linear_ft": 1.5,
            "sales_per_linear_ft": 213.33,
            "status": "SWAP"
        },
        {
            "sku_id": "SKU-40132",
            "product_name": "Doritos Nacho Cheese 9.75oz",
            "brand": "Doritos",
            "weekly_sales": 1850.0,
            "linear_ft": 2.5,
            "sales_per_linear_ft": 740.0,
            "status": "MAINTAIN"
        },
        {
            "sku_id": "SKU-40133",
            "product_name": "Clover Valley Tortilla Chips 12oz",
            "brand": "Clover Valley [Private Brand]",
            "weekly_sales": 150.0,
            "linear_ft": 1.0,
            "sales_per_linear_ft": 150.0,
            "status": "REDUCE"
        }
    ]
    return skus[skip : skip + limit]

@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def list_scenarios(db: Session = Depends(get_db)):
    return crud.get_scenarios(db)

@router.post("/scenarios", response_model=schemas.ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(scenario_in: schemas.ScenarioCreateRequest, db: Session = Depends(get_db)):
    strategy = scenario_in.strategy_type.capitalize()
    if strategy not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid strategy type. Must be Conservative, Balanced, or Aggressive."
        )
    return crud.create_scenario(db, scenario_in)

@router.get("/scenarios/projections", response_model=List[schemas.StrategyProjectionResponse])
def get_scenarios_projections():
    return [
        {
            "name": "Conservative Strategy",
            "description": "Focuses on low-risk, high-in-stock items.",
            "type": "Conservative",
            "projected_sales_lift": 2.5,
            "private_brand_percentage": 22.0,
            "in_stock_rate": 98.5,
            "shelf_space_utilized": 80.0
        },
        {
            "name": "Balanced Strategy",
            "description": "Balances sales lift with private brand goals.",
            "type": "Balanced",
            "projected_sales_lift": 5.8,
            "private_brand_percentage": 26.5,
            "in_stock_rate": 96.0,
            "shelf_space_utilized": 88.0
        },
        {
            "name": "Aggressive Strategy",
            "description": "Maximizes sales lift with higher risk.",
            "type": "Aggressive",
            "projected_sales_lift": 10.2,
            "private_brand_percentage": 31.0,
            "in_stock_rate": 92.5,
            "shelf_space_utilized": 95.0
        }
    ]

@router.get("/scenarios/{scenario_id}", response_model=schemas.ScenarioDetailResponse)
def get_scenario_details(scenario_id: str, db: Session = Depends(get_db)):
    scenario = crud.get_scenario(db, scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    
    # Calculate guardrails
    in_stock_ok = float(scenario.in_stock_rate) >= 95.0
    private_brand_ok = float(scenario.private_brand_percentage) >= 24.0
    shelf_capacity_ok = float(scenario.shelf_space_utilized) <= 100.0

    guardrails = {
        "in_stock_ok": in_stock_ok,
        "private_brand_ok": private_brand_ok,
        "shelf_capacity_ok": shelf_capacity_ok
    }

    return {
        "id": scenario.id,
        "name": scenario.name,
        "description": scenario.description,
        "strategy_type": scenario.strategy_type,
        "projected_sales_lift": float(scenario.projected_sales_lift),
        "private_brand_percentage": float(scenario.private_brand_percentage),
        "in_stock_rate": float(scenario.in_stock_rate),
        "shelf_space_utilized": float(scenario.shelf_space_utilized),
        "is_submitted": scenario.is_submitted,
        "created_at": scenario.created_at,
        "updated_at": scenario.updated_at,
        "guardrails": guardrails,
        "sku_actions": [
            {
                "sku_id": sku.sku_id,
                "product_name": sku.product_name,
                "brand": sku.brand,
                "action": sku.action,
                "sales_impact": float(sku.sales_impact)
            }
            for sku in scenario.sku_actions
        ]
    }

@router.post("/scenarios/{scenario_id}/submit", response_model=schemas.ScenarioSubmitResponse)
def submit_scenario(scenario_id: str, db: Session = Depends(get_db)):
    scenario = crud.get_scenario(db, scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    if scenario.is_submitted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scenario already submitted"
        )
    
    audit = crud.submit_scenario(db, scenario)
    return {
        "success": True,
        "audit_id": audit.id,
        "submitted_at": audit.submitted_at,
        "submitted_by": audit.submitted_by
    }

@router.get("/audits", response_model=List[schemas.AuditLogResponse])
def list_audits(db: Session = Depends(get_db)):
    audits = crud.get_audits(db)
    response = []
    for audit in audits:
        response.append({
            "id": audit.id,
            "scenario_id": audit.scenario_id,
            "scenario_name": audit.scenario.name if audit.scenario else "Unknown Scenario",
            "submitted_at": audit.submitted_at,
            "submitted_by": audit.submitted_by,
            "action": audit.action,
            "status": audit.status
        })
    return response
