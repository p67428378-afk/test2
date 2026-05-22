from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.topup_application import TopUpApplicationCreate, TopUpApplicationResponse
from server.services import lms_service
from server.models.topup_application import TopUpApplication

router = APIRouter()

@router.post("/topup-applications", response_model=TopUpApplicationResponse)
def create_topup_application(
    application: TopUpApplicationCreate,
    db: Session = Depends(get_db)
):
    eligibility = lms_service.check_eligibility(application.loan_account_number)

    if not eligibility["eligible"]:
        if eligibility["reason"] == "Loan account not found":
            raise HTTPException(status_code=404, detail=eligibility["reason"])
        
        db_application = TopUpApplication(
            loan_account_number=application.loan_account_number,
            status="INELIGIBLE",
            reason=eligibility["reason"]
        )
        db.add(db_application)
        db.commit()
        db.refresh(db_application)
        return TopUpApplicationResponse(
            application_id=db_application.id,
            status=db_application.status,
            reason=db_application.reason,
            eligible_amount=None
        )

    db_application = TopUpApplication(
        loan_account_number=application.loan_account_number,
        status="PRE-APPROVED",
        eligible_amount=eligibility["eligible_amount"]
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return TopUpApplicationResponse(
        application_id=db_application.id,
        status=db_application.status,
        eligible_amount=db_application.eligible_amount,
        reason=None
    )
