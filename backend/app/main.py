from fastapi import FastAPI
from app.api import kyc
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KYC Onboarding Microservice",
    description="A microservice to handle KYC onboarding for a retail bank.",
    version="1.0.0",
)

app.include_router(kyc.router, prefix="/api/v1", tags=["kyc"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
