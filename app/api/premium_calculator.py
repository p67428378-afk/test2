from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.policy import PremiumCalculationRequest, PremiumCalculationResponse, PolicySchema, VehicleType
from app.services.premium_service import PremiumService
from app.database import get_db
from app.models.policy import Policy
import uuid

router = APIRouter()

@router.post("/premium/calculate", response_model=PremiumCalculationResponse)
def calculate_premium(
    request: PremiumCalculationRequest,
    db: Session = Depends(get_db)
):
    premium_service = PremiumService()
    
    # Vehicle type validation is now handled by Pydantic Enum in PremiumCalculationRequest

    calculation_result = premium_service.calculate_premium(
        base_rate=request.base_rate,
        no_claims_years=request.no_claims_years,
        vehicle_type=request.vehicle_type.value # Pass the string value of the enum
    )

    # Create a new policy record
    db_policy = Policy(
        policy_id=str(uuid.uuid4()), # Convert UUID to string
        customer_id="test_customer", # Placeholder, ideally from auth or request
        vehicle_type=request.vehicle_type.value,
        no_claims_years=request.no_claims_years,
        base_rate=request.base_rate,
        ncb_discount_percentage=calculation_result["ncb_discount_percentage"],
        vehicle_multiplier=calculation_result["vehicle_multiplier"],
        calculated_premium=calculation_result["calculated_premium"],
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)

    return PremiumCalculationResponse(**calculation_result)
