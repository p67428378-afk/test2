"""
Module: server.main
Purpose: FastAPI application entry point, middleware configuration, and router registration.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.database import SessionLocal, init_db, seed_data, get_db
from server.routers import auth, products, claims, documents
from server.cron import evaluate_warranties


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Warranty Tracker API",
    description="API for registering products, tracking warranties, and managing claims.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware Configuration
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

# Register Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(claims.router)
app.include_router(documents.router)


# Health Check Endpoint
@app.get("/health", response_model=dict)
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Cron Trigger Endpoint
@app.post("/api/v1/cron/evaluate", response_model=dict)
def trigger_cron(db: Session = Depends(get_db)):
    """Manually trigger the daily warranty expiry evaluation and notification queuing."""
    result = evaluate_warranties(db)
    return result
