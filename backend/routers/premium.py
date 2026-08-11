from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from .. import schemas, models
from ..database import get_db
from ..services.premium_calculator import calculate_premium_logic

router = APIRouter()

@router.post("/premium/calculate", response_model=schemas.PremiumCalculationResponse, status_code=status.HTTP_200_OK)
def calculate_premium(
    request: schemas.PremiumCalculationRequest,
    db: Session = Depends(get_db)
):
    try:
        calculation_result = calculate_premium_logic(
            base_rate=request.baseRate,
            ncb_tier=request.ncbTier,
            vehicle_multiplier=request.vehicleMultiplier
        )
        final_premium = calculation_result["premium"]
        ncb_discount_percentage = calculation_result["ncbDiscountPercentage"]

        # Create a new Policy object
        db_policy = models.Policy(
            baseRate=request.baseRate,
            ncbTier=request.ncbTier,
            ncbDiscountPercentage=ncb_discount_percentage,
            vehicleMultiplier=request.vehicleMultiplier,
            finalPremium=final_premium,
            vehicleDetails=request.vehicleDetails.model_dump() if request.vehicleDetails else None,
            customerDetails=request.customerDetails.model_dump() if request.customerDetails else None,
        )
        db.add(db_policy)
        db.commit()
        db.refresh(db_policy)

        return {"premium": final_premium, "policyId": db_policy.policyId}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
