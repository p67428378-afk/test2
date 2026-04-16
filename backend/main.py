from fastapi import FastAPI
from backend.api import policies, policy_holders

app = FastAPI(
    title="Health Insurance Management Portal",
    description="A portal for policyholders to manage their health insurance policies.",
    version="1.0.0",
)

app.include_router(policy_holders.router)
app.include_router(policies.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Health Insurance Management Portal"}
