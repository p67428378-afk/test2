from fastapi import FastAPI
from app.api.v1 import policies

app = FastAPI()

app.include_router(policies.router, prefix="/api/v1/policies", tags=["policies"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Health Insurance Management Portal API"}
