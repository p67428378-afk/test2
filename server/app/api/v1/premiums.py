from fastapi import APIRouter
from server.app import schemas

router = APIRouter()

@router.post("/premiums/calculate", response_model=schemas.Premium)
def calculate_premium(premium_input: schemas.PremiumCalculate):
    base_premium = premium_input.base_premium
    premium_after_ncb = base_premium * (1 - premium_input.ncb_percentage / 100)
    calculated_premium = premium_after_ncb * premium_input.vehicle_multiplier
    return {"calculated_premium": calculated_premium}
