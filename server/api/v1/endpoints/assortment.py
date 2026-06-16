from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.get("/assortment/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    return crud.get_kpis(db)

@router.get("/assortment/skus", response_model=List[schemas.SKUResponse])
def get_skus(
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_skus(db, sort_by=sort_by, sort_order=sort_order, status=status)

@router.get("/assortment/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    return crud.get_scenarios(db)

@router.post("/assortment/submit", response_model=schemas.SubmitScenarioResponse)
def submit_scenario(request: schemas.SubmitScenarioRequest, db: Session = Depends(get_db)):
    try:
        submission = crud.submit_scenario(db, request)
    except ValueError as e:
        if "violations" in str(e):
            raise HTTPException(status_code=422, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

    if not submission:
        raise HTTPException(status_code=400, detail="Scenario ID is invalid or missing")

    return schemas.SubmitScenarioResponse(
        id=str(submission.id),
        scenario_id=str(submission.scenario_id),
        scenario_name=submission.scenario.name,
        submitted_by=submission.submitted_by,
        submitted_at=submission.submitted_at.isoformat(),
        audit_id=submission.audit_id,
        status=submission.status,
        message="Scenario submitted successfully"
    )
