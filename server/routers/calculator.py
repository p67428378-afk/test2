from datetime import datetime, timezone
from fastapi import APIRouter
from server.schemas import CalculationRequest, CalculationResponse, ErrorResponse
from server.services.calculator import calculator_service

router = APIRouter(prefix="/calculate", tags=["calculator"])


@router.post(
    "",
    response_model=CalculationResponse,
    responses={
        400: {
            "model": ErrorResponse,
            "description": "Bad Request (e.g., Division by Zero)",
        },
        422: {
            "model": ErrorResponse,
            "description": "Unprocessable Entity (Invalid Syntax)",
        },
    },
)
def calculate(request: CalculationRequest) -> CalculationResponse:
    result = calculator_service.evaluate(request.expression)
    now_iso = datetime.now(timezone.utc).isoformat()
    return CalculationResponse(
        result=result,
        expression=request.expression,
        status="success",
        timestamp=now_iso,
    )
