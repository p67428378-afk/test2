import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db
from server.routers import (
    apiaries,
    hives,
    telemetry,
    harvests,
    diseases,
    inspections,
    analytics,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables & seed data on startup
    init_db()
    yield


app = FastAPI(
    title="Smart Beehive Monitoring System & Analytics Dashboard API",
    version="1.0.0",
    description="Backend API for tracking telemetry, honey production, bee population, disease reports, inspection schedules, and seasonal analytics.",
    lifespan=lifespan,
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(apiaries.router)
app.include_router(hives.router)
app.include_router(telemetry.router)
app.include_router(harvests.router)
app.include_router(diseases.router)
app.include_router(inspections.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Beehive Monitoring System API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "beehive-monitoring-backend"}
