from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.services import eligibility

router = APIRouter()

@router.post("/", response_model=schemas.Application)
def create_application(
    *, 
    db: Session = Depends(deps.get_db), 
    application_in: schemas.ApplicationCreate
) -> models.Application:
    """
    Create new application.
    """
    application = crud.application.create(db=db, obj_in=application_in)
    return application

@router.get("/{application_id}/status", response_model=schemas.EligibilityResult)
async def get_application_status(
    *, 
    db: Session = Depends(deps.get_db), 
    application_id: str
) -> schemas.EligibilityResult:
    """
    Get application status.
    """
    application = crud.application.get(db=db, id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    credit_score = await eligibility.get_credit_score(application_id)
    application.credit_score = credit_score

    is_eligible, reason = eligibility.is_eligible(
        credit_score=credit_score, annual_income=application.annual_income
    )

    application.eligibility_status = "Eligible" if is_eligible else "Ineligible"
    application.ineligibility_reason = reason
    db.commit()

    eligible_products = []
    if is_eligible:
        eligible_products = crud.credit_card.get_eligible(
            db=db, min_credit_score=credit_score, min_income=application.annual_income
        )

    return schemas.EligibilityResult(
        eligibility_status=application.eligibility_status,
        ineligibility_reason=application.ineligibility_reason,
        eligible_products=eligible_products,
    )
