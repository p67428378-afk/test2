from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.loan_applicant import LoanEligibilityRequest, LoanApplicantResponse
from app.services import loan_service
from app.db.database import get_db
import json

router = APIRouter()

@router.post("/loan/check-eligibility", response_model=LoanApplicantResponse)
def check_eligibility(request: LoanEligibilityRequest, db: Session = Depends(get_db)):
    db_loan_applicant = loan_service.check_eligibility_and_get_rate(db, request)
    ineligibility_reasons = json.loads(db_loan_applicant.ineligibility_reasons) if db_loan_applicant.ineligibility_reasons else None
    return LoanApplicantResponse(
        applicant_id=db_loan_applicant.applicant_id,
        eligibility_status=db_loan_applicant.eligibility_status,
        interest_rate=db_loan_applicant.interest_rate,
        ineligibility_reasons=ineligibility_reasons
    )
