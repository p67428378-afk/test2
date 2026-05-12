from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, schemas, models, auth
from .database import get_db
from datetime import timedelta

router = APIRouter()

@router.post("/api/v1/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.BankRepLogin, db: Session = Depends(get_db)):
    user = crud.get_bank_rep_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/api/v1/loan-applications", response_model=list[schemas.LoanApplication])
def read_loan_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    loan_apps = crud.get_loan_applications(db, skip=skip, limit=limit)
    return loan_apps

@router.get("/api/v1/loan-applications/{application_id}", response_model=schemas.LoanApplicationDetails)
def read_loan_application(application_id: str, db: Session = Depends(get_db)):
    db_app = crud.get_loan_application(db, application_id=application_id)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app

@router.post("/api/v1/loan-applications/{application_id}/approve", response_model=schemas.LoanApplicationStatus)
def approve_loan_application(application_id: str, db: Session = Depends(get_db)):
    db_app = crud.approve_loan_application(db, application_id=application_id)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "approved"}

@router.post("/api/v1/loan-applications/{application_id}/reject", response_model=schemas.LoanApplicationStatus)
def reject_loan_application(application_id: str, db: Session = Depends(get_db)):
    db_app = crud.reject_loan_application(db, application_id=application_id)
    if db_app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "rejected"}
