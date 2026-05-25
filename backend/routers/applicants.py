from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, services
from ..database import get_db

router = APIRouter(
    prefix="/applicants",
    tags=["applicants"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Applicant)
def create_applicant(applicant: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    db_applicant = services.get_applicant_by_user_id(db, applicant.user_id)
    if db_applicant:
        raise HTTPException(status_code=400, detail="Applicant with this user ID already registered")
    return services.create_applicant(db=db, applicant=applicant)

@router.get("/{applicant_id}", response_model=schemas.Applicant)
def read_applicant(applicant_id: str, db: Session = Depends(get_db)):
    db_applicant = services.get_applicant_by_applicant_id(db, applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return db_applicant
