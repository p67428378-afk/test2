from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.fraud import FraudCheckRequest, FraudCheckResponse
from server.services.fraud_service import FraudService

router = APIRouter()


@router.post("/fraud-checks", response_model=FraudCheckResponse)
def run_fraud_check(request: FraudCheckRequest, db: Session = Depends(get_db)):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    # Run fraud check (mocked)
    score = FraudService.analyze_fraud(
        payment_id="N/A",  # Standalone check
        amount=request.amount,
        beneficiary_name=request.beneficiary_name,
        currency=request.currency,
        destination_country=request.destination_country,
        db=db,
    )

    return FraudCheckResponse(
        score_id=score.score_id,
        score=float(score.score),
        status=score.status,
        details=score.details,
    )
