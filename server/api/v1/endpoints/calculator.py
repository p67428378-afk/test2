from fastapi import APIRouter
from server.schemas.calculator import TipCalculationRequest, TipCalculationResponse
from server.services.calculator_service import calculate_tip

router = APIRouter(tags=["Tip Calculator"])


@router.post(
    "/calculate-tip",
    response_model=TipCalculationResponse,
    status_code=200,
    summary="Calculate Tip and Split Totals",
    description="Calculates total tip, total bill, tip per person, and total per person based on bill amount, tip percentage, and number of people splitting.",
)
def compute_tip_endpoint(payload: TipCalculationRequest) -> TipCalculationResponse:
    """Handle tip calculation requests."""
    return calculate_tip(payload)
