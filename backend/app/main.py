from fastapi import FastAPI
from app.api.v1.endpoints import kyc
from app.db.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KYC Onboarding Microservice",
    description="A service to handle KYC onboarding with Aadhaar and PAN.",
    version="1.0.0"
)

app.include_router(kyc.router, prefix="/api/v1", tags=["kyc"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the KYC Onboarding Microservice"}
