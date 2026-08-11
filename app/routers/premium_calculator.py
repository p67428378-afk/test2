from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db
from app.services import premium_service
from decimal import Decimal

router = APIRouter()

@router.post(
    "/calculate-premium",
    response_model=schemas.PremiumCalculationResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate Vehicle Insurance Premium",
    description="Calculates vehicle insurance premium based on base rate, NCB, and vehicle multiplier, and stores policy details."
)
async def calculate_premium(
    request: schemas.PremiumCalculationRequest,
    db: Session = Depends(get_db)
):
    # Ensure NCB is capped at 50% as per business logic, even if schema allows higher for validation
    ncb_to_apply = min(request.ncb_percentage, Decimal('0.50'))

    calculated_premium = premium_service.calculate_premium_logic(
        base_rate=request.base_rate,
        ncb_percentage=ncb_to_apply,
        vehicle_multiplier=request.vehicle_multiplier
    )

    # Get or create customer
    customer = premium_service.get_or_create_customer(db, request.customer_details)

    # Get or create vehicle
    vehicle = premium_service.get_or_create_vehicle(db, request.vehicle_details)

    # Create policy
    policy_create = schemas.PolicyCreate(
        customer_id=customer.customer_id,
        vehicle_id=vehicle.vehicle_id,
        base_rate=request.base_rate,
        ncb_percentage=ncb_to_apply,
        vehicle_multiplier=request.vehicle_multiplier
    )
    policy = premium_service.create_policy(db, policy_create, calculated_premium)

    return schemas.PremiumCalculationResponse(
        calculated_premium=calculated_premium,
        currency="USD",
        policy_id=policy.policy_id
    )
