from fastapi import FastAPI
from backend.app.api.api_router import api_router
from backend.app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KYC Onboarding API",
    description="API for KYC onboarding process.",
    version="1.0.0",
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the KYC Onboarding API"}
