from fastapi import APIRouter, HTTPException
from .schemas import PremiumRequest, PremiumResponse
from .services import calculate_premium

premium_router = APIRouter()

@premium_router.post("/premium", response_model=PremiumResponse)
def get_premium(request: PremiumRequest):
    """
    Calculates the vehicle insurance premium.
    """
    try:
        premium = calculate_premium(request)
        return PremiumResponse(calculated_premium=premium)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
