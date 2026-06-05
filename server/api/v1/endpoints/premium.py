
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
import uuid

router = APIRouter()

BASE_RATE = 500.0

VEHICLE_MULTIPLIERS = {
    schemas.VehicleType.Hatchback: 0.8,
    schemas.VehicleType.Sedan: 1.0,
    schemas.VehicleType.SUV: 1.6,
}

def get_ncb_percentage(ncb_years: int) -> float:
    if ncb_years >= 5:
        return 50.0
    elif ncb_years == 4:
        return 45.0
    elif ncb_years == 3:
        return 35.0
    elif ncb_years == 2:
        return 30.0
    elif ncb_years == 1:
        return 25.0
    else:
        return 20.0

@router.post("/premium/calculate", response_model=schemas.PremiumCalculationResponse)
def calculate_premium(request: schemas.PremiumCalculationRequest, db: Session = Depends(get_db)):
    
    vehicle_multiplier = VEHICLE_MULTIPLIERS.get(request.vehicle_type)
    if vehicle_multiplier is None:
        raise HTTPException(status_code=422, detail=f"Invalid vehicle type: {request.vehicle_type}")

    ncb_percentage = get_ncb_percentage(request.ncb_years)

    # Premium calculation logic
    # calculated_premium = (request.vehicle_value * 0.01) + (BASE_RATE * vehicle_multiplier) * (1 - ncb_percentage / 100)
    # A more standard calculation
    calculated_premium = (BASE_RATE * vehicle_multiplier) + (request.vehicle_value * 0.01) * (1 - ncb_percentage / 100)


    policy_data = {
        "policy_holder_id": uuid.uuid4(),
        "vehicle_type": request.vehicle_type.value,
        "vehicle_value": request.vehicle_value,
        "ncb_percentage": ncb_percentage,
        "vehicle_multiplier": vehicle_multiplier,
        "base_rate": BASE_RATE,
        "calculated_premium": calculated_premium
    }
    crud.create_policy(db, policy_data)

    return schemas.PremiumCalculationResponse(calculated_premium=calculated_premium)

