
from fastapi import APIRouter
from server.app.schemas.policy import PremiumInput, PremiumOutput
from server.app.services.premium_calculator import PremiumCalculator

router = APIRouter()

@router.post("/premium", response_model=PremiumOutput)
def calculate_premium(premium_input: PremiumInput):
    calculator = PremiumCalculator()
    final_premium = calculator.calculate(premium_input.base_rate, premium_input.ncb_percentage, premium_input.vehicle_multiplier)
    return PremiumOutput(final_premium=final_premium)
