
from fastapi import APIRouter
from server.app.schemas.premium import PremiumInput, PremiumOutput
from server.app.services.premium_calculator import PremiumCalculator

router = APIRouter()

@router.post("/calculate", response_model=PremiumOutput)
def calculate_premium(premium_input: PremiumInput):
    """
    Calculates vehicle insurance premium.
    """
    calculated_premium = PremiumCalculator.calculate(premium_input.ncb_percentage, premium_input.vehicle_multiplier)
    return PremiumOutput(calculated_premium=calculated_premium)
