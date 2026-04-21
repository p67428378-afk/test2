
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/check-eligibility/", response_model=schemas.LoanApplicant)
def check_eligibility(applicant: schemas.LoanApplicantCreate, db: Session = Depends(get_db)):
    # For now, we'll use a simplified eligibility logic
    # In the future, this will be moved to a separate service
    credit_score = applicant.credit_score
    annual_income = applicant.annual_income
    monthly_debts = applicant.monthly_debts

    ineligibility_reasons = []
    if credit_score < 600:
        ineligibility_reasons.append("Credit score is too low.")

    if annual_income <= 0:
        ineligibility_reasons.append("Annual income must be positive.")
    else:
        if annual_income < 30000:
            ineligibility_reasons.append("Annual income is too low.")
        if monthly_debts / (annual_income / 12) > 0.4:
            ineligibility_reasons.append("Debt-to-income ratio is too high.")

    if ineligibility_reasons:
        db_applicant = models.LoanApplicant(
            **applicant.model_dump(),
            eligibility_status="Ineligible",
            ineligibility_reasons=ineligibility_reasons
        )
    else:
        interest_rate = 10.0
        if credit_score >= 750:
            interest_rate = 5.0
        elif credit_score >= 650:
            interest_rate = 7.5

        db_applicant = models.LoanApplicant(
            **applicant.model_dump(),
            eligibility_status="Eligible",
            interest_rate=interest_rate
        )

    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant
