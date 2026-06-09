"""
Module: server/main.py
Purpose: FastAPI entrypoint with password reset and assortment advisor routers.
Author: Backend Developer Agent
Created: 2026-06-09
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, assortment
from server.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    description="Decision-support tool for Dollar General category managers.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
