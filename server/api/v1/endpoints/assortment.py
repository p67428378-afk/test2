from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from server import schemas, crud, models
from server.database import get_db

router = APIRouter()

def seed_skus_if_empty(db: Session):
    skus = db.query(models.SKU).all()
    if not skus:
        default_skus = [
            {
                "sku_name": "Lay's Classic Potato Chips 13oz",
                "current_sales": 12450.0,
                "sales_per_linear_ft": 145.20,
                "private_brand": False,
                "in_stock_rate": 99.1,
                "shelf_capacity": 85
            },
            {
                "sku_name": "Clover Valley Tortilla Chips 10oz",
                "current_sales": 8900.0,
                "sales_per_linear_ft": 112.50,
                "private_brand": True,
                "in_stock_rate": 98.2,
                "shelf_capacity": 85
            },
            {
                "sku_name": "Doritos Nacho Cheese 9.75oz",
                "current_sales": 11200.0,
                "sales_per_linear_ft": 135.80,
                "private_brand": False,
                "in_stock_rate": 97.5,
                "shelf_capacity": 85
            },
            {
                "sku_name": "Clover Valley Pretzels 16oz",
                "current_sales": 4500.0,
                "sales_per_linear_ft": 75.40,
                "private_brand": True,
                "in_stock_rate": 99.5,
                "shelf_capacity": 85
            },
            {
                "sku_name": "Cheetos Crunchy 8.5oz",
                "current_sales": 9800.0,
                "sales_per_linear_ft": 120.10,
                "private_brand": False,
                "in_stock_rate": 98.9,
                "shelf_capacity": 85
            },
            {
                "sku_name": "Clover Valley Potato Chips 8oz",
                "current_sales": 3200.0,
                "sales_per_linear_ft": 65.20,
                "private_brand": True,
                "in_stock_rate": 99.0,
                "shelf_capacity": 85
            }
        ]
        for sku in default_skus:
            crud.create_sku(db, **sku)

@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    seed_skus_if_empty(db)
    # Default KPIs as specified in the HLD and Stitch HTML
    return schemas.KPIResponse(
        sales_per_linear_ft=125.50,
        private_brand_percentage=22.5,
        in_stock_rate=98.7,
        shelf_capacity=85.0
    )

@router.get("/scenarios/{scenario_name}", response_model=schemas.ScenarioResponse)
def get_scenario(scenario_name: str, db: Session = Depends(get_db)):
    seed_skus_if_empty(db)
    name_lower = scenario_name.lower()
    if name_lower not in ["conservative", "balanced", "aggressive"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid scenario name. Must be one of: conservative, balanced, aggressive"
        )

    skus = db.query(models.SKU).all()
    sku_map = {sku.sku_name: sku for sku in skus}

    # Define actions and impacts based on scenario
    if name_lower == "conservative":
        projected_impact = schemas.ProjectedImpact(
            sales_per_linear_ft=118.00,
            private_brand_percentage=21.0
        )
        actions = {
            "Lay's Classic Potato Chips 13oz": "MAINTAIN",
            "Clover Valley Tortilla Chips 10oz": "MAINTAIN",
            "Doritos Nacho Cheese 9.75oz": "MAINTAIN",
            "Clover Valley Pretzels 16oz": "REDUCE",
            "Cheetos Crunchy 8.5oz": "MAINTAIN",
            "Clover Valley Potato Chips 8oz": "REDUCE"
        }
    elif name_lower == "balanced":
        projected_impact = schemas.ProjectedImpact(
            sales_per_linear_ft=125.50,
            private_brand_percentage=22.5
        )
        actions = {
            "Lay's Classic Potato Chips 13oz": "MAINTAIN",
            "Clover Valley Tortilla Chips 10oz": "GROW",
            "Doritos Nacho Cheese 9.75oz": "MAINTAIN",
            "Clover Valley Pretzels 16oz": "SWAP",
            "Cheetos Crunchy 8.5oz": "MAINTAIN",
            "Clover Valley Potato Chips 8oz": "REDUCE"
        }
    else:  # aggressive
        projected_impact = schemas.ProjectedImpact(
            sales_per_linear_ft=135.00,
            private_brand_percentage=25.0
        )
        actions = {
            "Lay's Classic Potato Chips 13oz": "GROW",
            "Clover Valley Tortilla Chips 10oz": "GROW",
            "Doritos Nacho Cheese 9.75oz": "GROW",
            "Clover Valley Pretzels 16oz": "SWAP",
            "Cheetos Crunchy 8.5oz": "GROW",
            "Clover Valley Potato Chips 8oz": "SWAP"
        }

    sku_actions = []
    for sku_name, action in actions.items():
        sku = sku_map.get(sku_name)
        if sku:
            sku_actions.append(
                schemas.SKUAction(
                    sku_name=sku.sku_name,
                    action=action,
                    current_sales=float(sku.current_sales),
                    in_stock_rate=float(sku.in_stock_rate),
                    private_brand=sku.private_brand,
                    sales_per_linear_ft=float(sku.sales_per_linear_ft),
                    shelf_capacity=sku.shelf_capacity
                )
            )

    # Guardrail check: Private Brand % > 20%
    private_brand_ok = projected_impact.private_brand_percentage > 20.0

    return schemas.ScenarioResponse(
        scenario=scenario_name,
        projected_impact=projected_impact,
        sku_actions=sku_actions,
        guardrail_status=schemas.GuardrailStatus(private_brand_ok=private_brand_ok)
    )

@router.post("/assortment-decisions", response_model=schemas.DecisionSubmitResponse, status_code=status.HTTP_201_CREATED)
def submit_decision(request: schemas.DecisionSubmitRequest, db: Session = Depends(get_db)):
    seed_skus_if_empty(db)
    
    # Validate scenario name
    if request.scenario.lower() not in ["conservative", "balanced", "aggressive"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid scenario name"
        )

    # Save decision to database
    payload = {
        "actions": [action.dict() for action in request.actions]
    }
    
    db_decision = crud.create_decision(
        db=db,
        scenario_name=request.scenario,
        decisions_payload=payload,
        submitted_by="John Doe"  # Default user
    )

    return schemas.DecisionSubmitResponse(
        message="Assortment decision submitted successfully.",
        audit_trail_id=str(db_decision.id)
    )
