from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from . import auth, crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a dummy user for testing
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    user = crud.get_user_by_username(db, "testuser")
    if not user:
        hashed_password = auth.get_password_hash("testpassword")
        user = models.BankRepresentative(username="testuser", name="Test User", role="representative", hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
    db.close()


@app.post("/api/v1/auth/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/v1/loan-applications", response_model=list[schemas.LoanApplication])
def read_loan_applications(sort: str = None, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    loan_applications = crud.get_loan_applications(db)
    if sort == "ease_of_approval_desc":
        loan_applications.sort(key=lambda x: x.ease_of_approval_score, reverse=True)
    return loan_applications


@app.get("/api/v1/loan-applications/{application_id}", response_model=schemas.LoanApplicationDetails)
def read_loan_application(application_id: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_loan_application = crud.get_loan_application(db, application_id=application_id)
    if db_loan_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_loan_application


@app.post("/api/v1/loan-applications/{application_id}/approve", response_model=schemas.Status)
def approve_loan_application(application_id: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_loan_application = crud.update_loan_application_status(db, application_id=application_id, status="Approved")
    if db_loan_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "Approved"}


@app.post("/api/v1/loan-applications/{application_id}/reject", response_model=schemas.Status)
def reject_loan_application(application_id: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_loan_application = crud.update_loan_application_status(db, application_id=application_id, status="Rejected")
    if db_loan_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "Rejected"}
