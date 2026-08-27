from fastapi import APIRouter, status
from server.schemas.calculator import TipCalculationRequest, TipCalculationResponse
from server.services.calculator_service import calculate_tip

router = APIRouter()


@router.post(
    "/calculate-tip",
    response_model=TipCalculationResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate tip and bill split breakdown",
    description="Calculates total tip, total bill, tip per person, and total per person based on bill_amount, tip_percentage, and num_people.",
)
def calculate_tip_endpoint(payload: TipCalculationRequest) -> TipCalculationResponse:
    return calculate_tip(payload)
