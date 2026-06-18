from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.risk import RiskValidationRequest, RiskValidationResponse
from server.services.risk_service import RiskService

router = APIRouter()


@router.post("/risk-validations", response_model=RiskValidationResponse)
def run_risk_validation(request: RiskValidationRequest, db: Session = Depends(get_db)):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    valid, reason = RiskService.validate_limits(
        amount=request.amount, currency=request.currency, country=request.country, db=db
    )

    return RiskValidationResponse(reason=reason, valid=valid)
