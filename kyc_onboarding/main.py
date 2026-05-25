
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from kyc_onboarding.db.database import SessionLocal, engine, Base, get_db
from kyc_onboarding.models.customer_kyc import CustomerKYC
from kyc_onboarding.schemas.kyc_schemas import KYCRequest, KYCStatusResponse, CustomerKYCResponse
from kyc_onboarding.core.kyc_service import create_kyc_record, get_kyc_record

app = FastAPI(title="KYC Onboarding Microservice")

# Create database tables
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.post("/kyc/onboard", response_model=KYCStatusResponse, status_code=status.HTTP_202_ACCEPTED)
def onboard_customer_kyc(request: KYCRequest, db: Session = Depends(get_db)):
    # In a real scenario, this would trigger asynchronous validation and screening
    # For now, we'll simulate the initial record creation
    kyc_record = create_kyc_record(db, request)
    return KYCStatusResponse(
        kyc_id=kyc_record.kyc_id,
        customer_id=kyc_record.customer_id,
        final_kyc_status=kyc_record.final_kyc_status,
        message="KYC processing initiated. Check status later."
    )

@app.get("/kyc/{kyc_id}", response_model=CustomerKYCResponse)
def get_customer_kyc_status(kyc_id: str, db: Session = Depends(get_db)):
    kyc_record = get_kyc_record(db, kyc_id)
    if not kyc_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KYC record not found")
    return kyc_record
