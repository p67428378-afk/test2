from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.schemas.policy import PremiumCalculationRequest, PremiumCalculationResponse
from backend.app.services.premium_calculator import PremiumCalculator
from backend.app.database import get_db

router = APIRouter()

@router.post("/calculate-premium", response_model=PremiumCalculationResponse)
def calculate_premium(
    request: PremiumCalculationRequest,
    db: Session = Depends(get_db),
    calculator: PremiumCalculator = Depends(PremiumCalculator)
):
    # In a real application, you would fetch the vehicle multiplier from the database
    # based on the vehicle details. For this example, we'll use a dummy multiplier.
    # This logic will be improved in the future based on the HLD.
    vehicle_multiplier = 1.2  # Dummy multiplier

    premium = calculator.calculate(
        vehicle_multiplier=vehicle_multiplier,
        ncb_level=request.ncb_level
    )
    return PremiumCalculationResponse(premium_amount=premium)
