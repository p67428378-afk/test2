from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud
from server.database import get_db

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis():
    """
    Retrieve high-level cluster health metrics (Business per Branch, CASA Ratio, Availability, Capacity).
    """
    return schemas.KPIResponse(
        business_per_branch=150.0,
        capacity_utilization=85.0,
        casa_ratio=42.0,
        product_availability=99.8,
    )


@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """
    Retrieve retail products and their performance metrics (AUM, NPA%, status badge).
    """
    products = crud.get_products(db)
    return products


@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    """
    Retrieve available strategic scenarios (Conservative, Balanced, Aggressive) and their projections.
    """
    scenarios = crud.get_scenarios(db)
    return scenarios


@router.post(
    "/approval-requests",
    response_model=schemas.ApprovalRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_approval_request(
    request: schemas.ApprovalRequestCreate, db: Session = Depends(get_db)
):
    """
    Submit a scenario for approval, performing guardrail checks and logging to audit trail.
    """
    scenario = crud.get_scenario(db, request.scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found"
        )
    try:
        approval_request = crud.create_approval_request(db, request, scenario)
        return approval_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
