from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db
from app.services.decision_engine import get_decision

router = APIRouter()

@router.post("/", response_model=schemas.applicant.ApplicationStatus)
def create_application(applicant: schemas.applicant.ApplicantCreate, db: Session = Depends(get_db)):
    # Basic validation
    if not applicant.full_name or not applicant.ssn or not applicant.date_of_birth or not applicant.address or not applicant.annual_income or not applicant.employment_status or not applicant.credit_score:
        raise HTTPException(status_code=422, detail="Missing mandatory fields")

    if len(applicant.ssn.split('-')) != 3:
        raise HTTPException(status_code=422, detail="Invalid SSN format")

    decision, credit_limit, message = get_decision(applicant)

    db_applicant = models.applicant.Applicant(
        full_name=applicant.full_name,
        ssn=applicant.ssn, # In a real app, this would be encrypted
        date_of_birth=applicant.date_of_birth,
        address=applicant.address,
        annual_income=applicant.annual_income,
        employment_status=applicant.employment_status,
        credit_score=applicant.credit_score,
        status=decision,
        credit_limit=credit_limit
    )
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)

    return schemas.applicant.ApplicationStatus(
        applicant_id=db_applicant.applicant_id,
        status=decision,
        credit_limit=credit_limit,
        decision_message=message
    )
