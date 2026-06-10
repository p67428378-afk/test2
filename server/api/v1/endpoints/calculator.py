from fastapi import APIRouter, HTTPException, status
from server.schemas import CalculateRequest, CalculateResponse

router = APIRouter()

@router.post("/calculate", response_model=CalculateResponse)
def calculate_bill(payload: CalculateRequest):
    try:
        tip_amount = payload.bill_amount * (payload.tip_percentage / 100.0)
        total_bill = payload.bill_amount + tip_amount
        amount_per_person = total_bill / payload.number_of_people
        
        return CalculateResponse(
            tip_amount=round(tip_amount, 2),
            total_bill=round(total_bill, 2),
            amount_per_person=round(amount_per_person, 2)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
