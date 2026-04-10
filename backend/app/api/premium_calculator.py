from fastapi import APIRouter, HTTPException
from app.schemas.policy import PremiumCalculationRequest, PremiumCalculationResponse
from app.services import premium_calculator_service

router = APIRouter()

@router.post("/calculate-premium", response_model=PremiumCalculationResponse)
def calculate_premium_endpoint(request: PremiumCalculationRequest):
    try:
        premium = premium_calculator_service.calculate_premium(request)
        return PremiumCalculationResponse(premium=premium)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
