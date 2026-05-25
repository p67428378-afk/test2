from fastapi import FastAPI
from app.api.api import api_router
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Credit Card Approval System",
    description="An API for submitting and processing credit card applications.",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
