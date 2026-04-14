from fastapi import FastAPI
from app.api import policy

app = FastAPI(
    title="Health Insurance Policy Management Portal",
    description="A portal for policyholders to manage their health insurance policies.",
    version="1.0.0",
)

app.include_router(policy.router, prefix="/api/v1", tags=["policies"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Health Insurance Policy Management Portal"}
