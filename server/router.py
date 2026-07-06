from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from .database import get_db
from . import schemas, crud

router = APIRouter(prefix="/api/v1")


@router.get("/kpis", response_model=schemas.KPISchema)
def get_kpis(db: Session = Depends(get_db)):
    # Return static or calculated high-level KPI metrics for STV Cluster Snacks
    return {
        "sales_per_linear_ft": {"value": 425.5, "trend_yoy": 4.2},
        "private_brand_pct": {"value": 28.4, "target": 30.0},
        "in_stock_rate": {"value": 96.2, "status": "Healthy"},
        "shelf_capacity_pct": {"value": 92.1, "remaining_ft": 9.2},
    }


@router.get("/skus", response_model=List[schemas.SKUResponse])
def get_skus(db: Session = Depends(get_db)):
    skus = crud.get_products_with_metrics(db)
    if not skus:
        # Fallback to default mock data if DB is empty
        return [
            {
                "sku_id": "SKU-1042",
                "name": "Lay's Classic Potato Chips 13oz",
                "current_sales": 14250.0,
                "sales_trend_yoy": 8.5,
                "profit_margin": 32.0,
                "in_stock_rate": 98.1,
                "recommendation": "GROW",
            },
            {
                "sku_id": "SKU-3091",
                "name": "Clover Valley Tortilla Chips 16oz",
                "current_sales": 11800.0,
                "sales_trend_yoy": 12.1,
                "profit_margin": 45.0,
                "in_stock_rate": 95.4,
                "recommendation": "GROW",
            },
            {
                "sku_id": "SKU-1124",
                "name": "Cheetos Crunchy 8.5oz",
                "current_sales": 9400.0,
                "sales_trend_yoy": -2.4,
                "profit_margin": 28.0,
                "in_stock_rate": 97.2,
                "recommendation": "MAINTAIN",
            },
            {
                "sku_id": "SKU-3044",
                "name": "Clover Valley Pretzels 16oz",
                "current_sales": 6100.0,
                "sales_trend_yoy": 1.2,
                "profit_margin": 42.0,
                "in_stock_rate": 94.0,
                "recommendation": "MAINTAIN",
            },
            {
                "sku_id": "SKU-1088",
                "name": "Doritos Nacho Cheese 9.75oz",
                "current_sales": 5200.0,
                "sales_trend_yoy": -14.5,
                "profit_margin": 29.0,
                "in_stock_rate": 91.2,
                "recommendation": "SWAP",
            },
            {
                "sku_id": "SKU-3012",
                "name": "CV Cheese Crackers 12oz",
                "current_sales": 2100.0,
                "sales_trend_yoy": -22.0,
                "profit_margin": 38.0,
                "in_stock_rate": 89.5,
                "recommendation": "REDUCE",
            },
        ]
    return skus


@router.post("/scenarios/calculate", response_model=schemas.ScenarioCalculateResponse)
def calculate_scenario(
    payload: schemas.ScenarioCalculateRequest, db: Session = Depends(get_db)
):
    scenario_type = payload.scenario_type
    db_scenario = crud.get_scenario_by_type(db, scenario_type)

    if not db_scenario:
        # Fallback to default calculations if not in DB
        if scenario_type == "Conservative":
            return {
                "scenario_type": "Conservative",
                "projected_sales_lift": 1.5,
                "projected_private_brand_pct": 29.1,
                "projected_shelf_capacity_pct": 91.5,
                "sku_actions": [
                    "Maintain current CV items",
                    "Reduce Doritos space slightly",
                ],
                "guardrails": {
                    "capacity_check": {
                        "message": "Capacity ≤ 100% (Proj: 91.5%)",
                        "passed": True,
                    },
                    "private_brand_check": {
                        "message": "Private Brand ≥ 30% (Proj: 29.1%)",
                        "passed": False,
                    },
                    "swap_limit_check": {
                        "message": "Swap Limit ≤ 3 (Actual: 0)",
                        "passed": True,
                    },
                },
            }
        elif scenario_type == "Balanced":
            return {
                "scenario_type": "Balanced",
                "projected_sales_lift": 4.2,
                "projected_private_brand_pct": 31.5,
                "projected_shelf_capacity_pct": 96.0,
                "sku_actions": [
                    "Add CV Extreme Cheddar",
                    "Swap Doritos with CV Ranch",
                    "Reduce CV Cheese Crackers space",
                ],
                "guardrails": {
                    "capacity_check": {
                        "message": "Capacity ≤ 100% (Proj: 96.0%)",
                        "passed": True,
                    },
                    "private_brand_check": {
                        "message": "Private Brand ≥ 30% (Proj: 31.5%)",
                        "passed": True,
                    },
                    "swap_limit_check": {
                        "message": "Swap Limit ≤ 3 (Actual: 1)",
                        "passed": True,
                    },
                },
            }
        elif scenario_type == "Aggressive":
            return {
                "scenario_type": "Aggressive",
                "projected_sales_lift": 6.8,
                "projected_private_brand_pct": 34.2,
                "projected_shelf_capacity_pct": 102.5,
                "sku_actions": [
                    "Add CV Extreme Cheddar",
                    "Add CV Potato Chips",
                    "Swap Doritos with CV Ranch",
                    "Swap Cheetos with CV Cheese Puffs",
                ],
                "guardrails": {
                    "capacity_check": {
                        "message": "Capacity ≤ 100% (Proj: 102.5%)",
                        "passed": False,
                    },
                    "private_brand_check": {
                        "message": "Private Brand ≥ 30% (Proj: 34.2%)",
                        "passed": True,
                    },
                    "swap_limit_check": {
                        "message": "Swap Limit ≤ 3 (Actual: 2)",
                        "passed": True,
                    },
                },
            }
        else:
            raise HTTPException(
                status_code=400, detail="Invalid scenario type provided"
            )

    # If found in DB, map and return
    # Determine guardrails dynamically based on DB values
    proj_pb = float(db_scenario.projected_private_brand_pct)
    proj_cap = float(db_scenario.projected_shelf_capacity_pct)
    actions = (
        db_scenario.sku_actions if isinstance(db_scenario.sku_actions, list) else []
    )
    swaps = sum(1 for a in actions if "Swap" in a)

    return {
        "scenario_type": db_scenario.scenario_type,
        "projected_sales_lift": float(db_scenario.projected_sales_lift),
        "projected_private_brand_pct": proj_pb,
        "projected_shelf_capacity_pct": proj_cap,
        "sku_actions": actions,
        "guardrails": {
            "capacity_check": {
                "message": f"Capacity ≤ 100% (Proj: {proj_cap:.1f}%)",
                "passed": proj_cap <= 100.0,
            },
            "private_brand_check": {
                "message": f"Private Brand ≥ 30% (Proj: {proj_pb:.1f}%)",
                "passed": proj_pb >= 30.0,
            },
            "swap_limit_check": {
                "message": f"Swap Limit ≤ 3 (Actual: {swaps})",
                "passed": swaps <= 3,
            },
        },
    }


@router.post("/approvals", response_model=schemas.ApprovalResponse)
def submit_approval(payload: schemas.ApprovalRequest, db: Session = Depends(get_db)):
    scenario_type = payload.scenario_type

    # Perform calculation to verify guardrails
    calc = calculate_scenario(
        schemas.ScenarioCalculateRequest(scenario_type=scenario_type), db
    )

    # If any guardrail fails, reject submission
    if not (
        calc["guardrails"]["capacity_check"]["passed"]
        and calc["guardrails"]["private_brand_check"]["passed"]
        and calc["guardrails"]["swap_limit_check"]["passed"]
    ):
        raise HTTPException(
            status_code=400, detail="Guardrail checks fail for the submitted scenario"
        )

    # Generate audit trail
    audit_id = f"TXN-{uuid.uuid4().hex[:5].upper()}-STV"

    # Map scenario to summary
    summary_map = {
        "Conservative": "0 Added, 0 Swapped, 1 Reduced.",
        "Balanced": "1 Added, 1 Swapped, 1 Reduced.",
        "Aggressive": "2 Added, 2 Swapped, 0 Reduced.",
    }
    summary = summary_map.get(scenario_type, "Assortment plan updated.")

    crud.create_audit_trail(
        db=db,
        audit_trail_id=audit_id,
        scenario_type=scenario_type,
        submitted_by="Category Manager",
        sku_changes_summary=summary,
    )

    return {
        "success": True,
        "audit_trail_id": audit_id,
        "submitted_by": "Category Manager",
        "sku_changes_summary": summary,
        "timestamp": datetime.utcnow(),
    }
