
from fastapi import FastAPI
from .database import engine
from .models import policy
from .api import policy as policy_api

policy.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Health Insurance Management Portal",
    description="API for managing health insurance policies.",
    version="1.0.0"
)

app.include_router(policy_api.router, prefix="/api/v1", tags=["policies"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
