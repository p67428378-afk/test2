from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .... import crud, schemas
from ....database import get_db

router = APIRouter()

BASE_RATE = 500.0
VEHICLE_MULTIPLIERS = {
    "HATCHBACK": 1.0,
    "SEDAN": 1.1,
    "SUV": 1.2,
    "SPORTS_CAR": 1.5,
}
NCB_DISCOUNTS = {
    0: 0.0,
    1: 0.2,
    2: 0.3,
    3: 0.4,
    4: 0.5,
    5: 0.6,
}


@router.post("/premiums/calculate", response_model=schemas.PremiumCalculationResponse)
def calculate_premium(request: schemas.PremiumCalculationRequest):
    no_claim_years = max(0, request.no_claim_years)
    vehicle_multiplier = VEHICLE_MULTIPLIERS.get(request.vehicle_type.upper(), 1.0)
    ncb_discount_percentage = NCB_DISCOUNTS.get(
        no_claim_years, 0.6
    )  # Default to max discount if years > 5

    premium = BASE_RATE * vehicle_multiplier * (1 - ncb_discount_percentage)

    return {
        "premium": premium,
        "calculation_details": {
            "base_rate": BASE_RATE,
            "vehicle_multiplier": vehicle_multiplier,
            "ncb_discount_percentage": ncb_discount_percentage,
        },
    }


@router.get("/policies", response_model=schemas.PolicyList)
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = crud.get_policies(db, skip=skip, limit=limit)
    return {"policies": policies}
