from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    try:
        return crud.get_kpis(db)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection fails or calculation error occurs: {str(e)}",
        )


@router.get("/sku-performance", response_model=schemas.SKUPerformanceResponse)
def get_sku_performance(
    limit: int = Query(10, ge=1, le=100),
    page: int = Query(1, ge=1),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        return crud.get_sku_performance(
            db, limit=limit, page=page, search=search, status=status
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection fails: {str(e)}"
        )


@router.post("/scenario-projections", response_model=schemas.ScenarioProjectionResponse)
def get_scenario_projections(
    payload: schemas.ScenarioProjectionRequest, db: Session = Depends(get_db)
):
    try:
        projection = crud.get_scenario_projection(db, payload.scenario_type)
        if not projection:
            raise HTTPException(status_code=400, detail="Invalid scenario type")
        return projection
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection fails: {str(e)}"
        )


@router.post("/assortment-decisions", response_model=schemas.AssortmentDecisionResponse)
def create_assortment_decision(
    payload: schemas.AssortmentDecisionRequest, db: Session = Depends(get_db)
):
    try:
        # Simple validation: check if scenario_applied is valid
        scenario_type = payload.scenario_applied.lower()
        if scenario_type not in ["conservative", "balanced", "aggressive"]:
            raise HTTPException(status_code=400, detail="Invalid scenario type applied")

        return crud.create_assortment_decision(db, payload)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write fails: {str(e)}")
