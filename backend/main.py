
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, services, repositories
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/v1/auth/login")
def login(form_data: services.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_service = services.AuthService(repositories.BankRepresentativeRepository(db))
    token = auth_service.authenticate(form_data.username, form_data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return token

@app.get("/api/v1/loan-applications")
def get_loan_applications(sort: str = None, db: Session = Depends(get_db)):
    loan_app_service = services.LoanApplicationService(repositories.LoanApplicationRepository(db))
    return loan_app_service.get_pending_applications(sort)

@app.get("/api/v1/loan-applications/{application_id}")
def get_loan_application_details(application_id: str, db: Session = Depends(get_db)):
    loan_app_service = services.LoanApplicationService(repositories.LoanApplicationRepository(db))
    app = loan_app_service.get_application_details(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@app.post("/api/v1/loan-applications/{application_id}/approve")
def approve_loan_application(application_id: str, db: Session = Depends(get_db)):
    loan_app_service = services.LoanApplicationService(repositories.LoanApplicationRepository(db))
    app = loan_app_service.approve_application(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "approved"}

@app.post("/api/v1/loan-applications/{application_id}/reject")
def reject_loan_application(application_id: str, db: Session = Depends(get_db)):
    loan_app_service = services.LoanApplicationService(repositories.LoanApplicationRepository(db))
    app = loan_app_service.reject_application(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "rejected"}
