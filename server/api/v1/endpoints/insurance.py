from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
import uuid

router = APIRouter()

BASE_PREMIUM = 500.0

@router.post("/insurance/premium/calculate", response_model=schemas.PremiumCalculationResponse)
def calculate_premium(request: schemas.PremiumCalculationRequest, db: Session = Depends(get_db)):
    ncb_percentage = crud.get_ncb_percentage(request.ncb_years)
    ncb_discount = BASE_PREMIUM * ncb_percentage
    premium_after_ncb = BASE_PREMIUM - ncb_discount
    final_premium = premium_after_ncb * request.vehicle_type_multiplier

    response = schemas.PremiumCalculationResponse(
        policy_id=uuid.uuid4(),
        base_premium=BASE_PREMIUM,
        ncb_discount=ncb_discount,
        premium_after_ncb=premium_after_ncb,
        final_premium=final_premium
    )

    crud.create_policy(db, response, request)

    return response
