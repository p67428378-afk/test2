from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from server import schemas, crud, models
from server.database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/kpis", response_model=schemas.KPIResponse)
def read_kpis(db: Session = Depends(get_db)):
    return crud.get_kpis(db)


@router.get("/sku-performance", response_model=schemas.SKUPerformanceResponse)
def read_sku_performance(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    items, total = crud.get_sku_performance(db, skip=skip, limit=limit)
    return {"items": items, "total": total, "page": (skip // limit) + 1, "limit": limit}


@router.post(
    "/scenario-projections", response_model=schemas.ScenarioProjectionsResponse
)
def get_scenario_projections(payload: schemas.ScenarioProjectionsRequest):
    scenario_type = payload.scenario_type
    if scenario_type not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario type")

    if scenario_type == "Conservative":
        return {
            "scenario_type": "Conservative",
            "projected_sales_lift": 0.5,
            "projected_private_brand_pct": 23.0,
            "guardrails": {"private_brand_mix_ok": True, "shelf_capacity_ok": True},
            "sku_actions": {"add": 1, "keep": 98, "remove": 1},
        }
    elif scenario_type == "Balanced":
        return {
            "scenario_type": "Balanced",
            "projected_sales_lift": 2.0,
            "projected_private_brand_pct": 25.0,
            "guardrails": {"private_brand_mix_ok": True, "shelf_capacity_ok": True},
            "sku_actions": {"add": 5, "keep": 92, "remove": 3},
        }
    else:  # Aggressive
        return {
            "scenario_type": "Aggressive",
            "projected_sales_lift": 4.5,
            "projected_private_brand_pct": 28.0,
            "holiday_lift_pct": 12.5,  # Holiday Lift % added for Aggressive scenario
            "guardrails": {"private_brand_mix_ok": True, "shelf_capacity_ok": True},
            "sku_actions": {"add": 12, "keep": 80, "remove": 8},
        }


@router.post("/assortment-decisions", response_model=schemas.AssortmentDecisionResponse)
def submit_assortment_decision(
    payload: schemas.AssortmentDecisionRequest, db: Session = Depends(get_db)
):
    scenario_type = payload.scenario_type
    if scenario_type not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario type")

    # Find or create scenario in DB
    scenario = (
        db.query(models.AssortmentScenario)
        .filter(models.AssortmentScenario.name == scenario_type)
        .first()
    )
    if not scenario:
        sales_lift = (
            0.5
            if scenario_type == "Conservative"
            else (2.0 if scenario_type == "Balanced" else 4.5)
        )
        pb_pct = (
            23.0
            if scenario_type == "Conservative"
            else (25.0 if scenario_type == "Balanced" else 28.0)
        )
        scenario = models.AssortmentScenario(
            name=scenario_type,
            projected_sales_lift=sales_lift,
            projected_private_brand_pct=pb_pct,
        )
        db.add(scenario)
        db.commit()
        db.refresh(scenario)

    audit_id = f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
    summary = f"{scenario_type} Scenario: +{scenario.projected_private_brand_pct}% Private Brand, +{scenario.projected_sales_lift}% Sales"

    audit = models.AuditTrail(
        scenario_id=scenario.id,
        audit_id=audit_id,
        summary=summary,
        submitted_at=datetime.utcnow(),
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)

    return {
        "success": True,
        "audit_id": audit_id,
        "submitted_at": audit.submitted_at.isoformat() + "Z",
        "summary": summary,
    }
