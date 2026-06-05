from fastapi import APIRouter, Depends
from server.app.schemas.premium_calculation import PremiumCalculationRequest, PremiumCalculationResponse
from server.app.services.premium_calculator import PremiumCalculatorService

router = APIRouter()

@router.post("/insurance/premium/calculate", response_model=PremiumCalculationResponse)
def calculate_premium(
    request: PremiumCalculationRequest,
    calculator_service: PremiumCalculatorService = Depends(),
):
    """
    Calculates the vehicle insurance premium based on policy details.
    """
    calculated_premium = calculator_service.calculate_premium(
        vehicle_value=request.vehicle_value,
        ncb_percentage=request.ncb_percentage,
        vehicle_multiplier=request.vehicle_multiplier,
    )
    return PremiumCalculationResponse(calculated_premium=calculated_premium)
