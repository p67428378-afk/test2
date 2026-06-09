"""
Module: server/api/v1/endpoints/assortment.py
Purpose: API endpoints for the DG Cluster Assortment Advisor.
Author: Backend Developer Agent
Created: 2026-06-09
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Fetch KPI data for the main dashboard."""
    try:
        return crud.get_latest_kpis(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection fails: {str(e)}")

@router.get("/sku-performance", response_model=List[schemas.SKUPerformanceResponse])
def get_sku_performance(db: Session = Depends(get_db)):
    """Fetch the performance data for SKUs."""
    try:
        return crud.get_sku_performance(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection fails: {str(e)}")

@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    """Fetch the different assortment scenarios."""
    try:
        return crud.get_scenarios(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection fails: {str(e)}")

@router.post("/submit", response_model=schemas.SubmitResponse)
def submit_assortment(request: schemas.SubmitRequest, db: Session = Depends(get_db)):
    """Submits the selected assortment plan for approval."""
    try:
        submission = crud.create_submission(db, request.scenario_id, request.user_id)
        if not submission:
            raise HTTPException(status_code=400, detail="Scenario ID is invalid or guardrails are violated")
        
        return schemas.SubmitResponse(
            submission_id=submission.id,
            selected_scenario=submission.scenario.name,
            submitted_by=submission.user_id,
            status=submission.status,
            timestamp=submission.submission_time
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection fails: {str(e)}")

@router.post("/seed", response_model=schemas.SeedResponse)
def seed_database(db: Session = Depends(get_db)):
    """Seeds the database with initial mock data for products, KPIs, and scenarios."""
    try:
        result = crud.seed_database(db)
        return schemas.SeedResponse(
            status=result["status"],
            message=result["message"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection fails: {str(e)}")
