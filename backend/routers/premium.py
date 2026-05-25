
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import schemas, services
from backend.database import get_db

router = APIRouter()

@router.post("/premium/calculate", response_model=schemas.PremiumCalculationResponse)
def calculate_premium_endpoint(request: schemas.PremiumCalculationRequest, db: Session = Depends(get_db)):
    if request.ncb_years < 0:
        raise HTTPException(status_code=400, detail="NCB years cannot be negative")
    if not (0.8 <= request.vehicle_risk_factor <= 1.6):
        raise HTTPException(status_code=400, detail="Vehicle risk factor must be between 0.8 and 1.6")

    calculated_premium = services.calculate_premium(request)
    return schemas.PremiumCalculationResponse(calculated_premium=calculated_premium)
