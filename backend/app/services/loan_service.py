from sqlalchemy.orm import Session
from app.schemas.loan_applicant import LoanEligibilityRequest, LoanApplicantCreate
from app.models.loan_applicant import LoanApplicant
import json

MIN_CREDIT_SCORE = 600
MAX_DTI_RATIO = 0.4

def check_eligibility_and_get_rate(db: Session, request: LoanEligibilityRequest):
    ineligibility_reasons = []

    if request.credit_score < MIN_CREDIT_SCORE:
        ineligibility_reasons.append("Credit score below the minimum threshold of 600.")

    if request.annual_income > 0:
        dti_ratio = (request.monthly_debts * 12) / request.annual_income
    elif request.monthly_debts > 0:
        dti_ratio = float('inf')
    else:
        dti_ratio = 0

    if dti_ratio > MAX_DTI_RATIO:
        ineligibility_reasons.append("Debt-to-income ratio exceeds the maximum threshold of 40%.")

    eligibility_status = not ineligibility_reasons
    interest_rate = None

    if eligibility_status:
        if 750 <= request.credit_score <= 850:
            interest_rate = 4.25
        elif 680 <= request.credit_score < 750:
            interest_rate = 5.0
        elif 600 <= request.credit_score < 680:
            interest_rate = 6.0

    loan_applicant_data = LoanApplicantCreate(**request.model_dump())
    db_loan_applicant = LoanApplicant(
        **loan_applicant_data.model_dump(),
        eligibility_status=eligibility_status,
        interest_rate=interest_rate,
        ineligibility_reasons=json.dumps(ineligibility_reasons) if ineligibility_reasons else None
    )
    db.add(db_loan_applicant)
    db.commit()
    db.refresh(db_loan_applicant)

    return db_loan_applicant
