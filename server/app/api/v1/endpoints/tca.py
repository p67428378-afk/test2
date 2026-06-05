
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TCAEstimateRequest(BaseModel):
    instrument_id: str
    order_type: str
    quantity: int

class TCAEstimateResponse(BaseModel):
    estimated_cost: float

@router.post("/estimate", response_model=TCAEstimateResponse)
def estimate_tca(request: TCAEstimateRequest):
    # In a real application, this would involve a complex calculation.
    # For this example, we'll return a simple mock estimate.
    estimated_cost = request.quantity * 0.01 # A flat 1 cent per share
    return TCAEstimateResponse(estimated_cost=estimated_cost)
