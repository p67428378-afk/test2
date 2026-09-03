"""Main FastAPI application entry point for Aura Photography Studio Management System."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import (
    auth,
    dashboard,
    features,
    packages,
    payments,
    photographers,
    photoshoots,
    sessions,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB Schema and Seed initial studio records
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Aura Photography Studio Management API",
    description="Studio booking, photographer scheduling, package management, payment tracking, and v2 feature expansions.",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(photographers.router)
app.include_router(packages.router)
app.include_router(sessions.router)
app.include_router(payments.router)
app.include_router(photoshoots.router)
app.include_router(features.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "service": "Aura Photography Studio API",
        "version": "2.0.0",
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "aura-photography-studio"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main.py:app", host="0.0.0.0", port=8000, reload=True)
