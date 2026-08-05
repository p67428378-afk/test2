import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import (
    auth,
    proposals,
    evaluations,
    awards,
    milestones,
    financials,
)

# Initialize database schema
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="Research Grant Management Portal API",
    version="1.0.0",
    description="API for research grant proposals, evaluations, funding awards, milestones, and financial utilization reporting.",
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(proposals.router, prefix="/api/v1/proposals", tags=["proposals"])
app.include_router(
    evaluations.router, prefix="/api/v1/evaluations", tags=["evaluations"]
)
app.include_router(awards.router, prefix="/api/v1/awards", tags=["awards"])
app.include_router(milestones.router, prefix="/api/v1/milestones", tags=["milestones"])
app.include_router(
    financials.router, prefix="/api/v1/financial-reports", tags=["financials"]
)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Research Grant Management Portal API",
        "docs_url": "/docs",
    }
