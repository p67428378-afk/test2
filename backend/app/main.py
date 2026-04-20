from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import policies

app = FastAPI(
    title="Policy Management API",
    description="API for managing health insurance policies.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(policies.router, prefix="/api/v1/policies", tags=["policies"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Policy Management API"}
