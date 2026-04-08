from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, services
from ..database import get_db

router = APIRouter(
    prefix="/applications",
    tags=["applications"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_applicant = services.get_applicant_by_applicant_id(db, application.applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return services.create_application(db=db, application=application)

@router.get("/{application_id}", response_model=schemas.Application)
def read_application(application_id: str, db: Session = Depends(get_db)):
    db_application = services.get_application(db, application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.post("/{application_id}/financial-info", response_model=schemas.FinancialInfo)
def create_financial_info(
    application_id: str,
    financial_info: schemas.FinancialInfoCreate,
    db: Session = Depends(get_db)
):
    db_application = services.get_application(db, application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return services.create_financial_info(db=db, financial_info=financial_info, application_id=application_id)

@router.post("/{application_id}/employment-info", response_model=schemas.EmploymentInfo)
def create_employment_info(
    application_id: str,
    employment_info: schemas.EmploymentInfoCreate,
    db: Session = Depends(get_db)
):
    db_application = services.get_application(db, application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return services.create_employment_info(db=db, employment_info=employment_info, application_id=application_id)
