"""
Module: main
Purpose: FastAPI application entry point for Real-Time Bus Tracking API
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from server.app.config import settings
from server.app.database import init_db, seed_data
from server.app.routers import auth, routes, stops, buses, alerts, websocket


class HealthCheckResponse(BaseModel):
    status: str
    app: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="Real-Time Bus Tracking API",
    description="Live GPS telemetry, route schedules, ETA calculations, and bus tracking backend",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins_list = [
    origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(routes.router)
app.include_router(stops.router)
app.include_router(buses.router)
app.include_router(alerts.router)
app.include_router(websocket.router)


@app.get("/", response_model=HealthCheckResponse)
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": "Real-Time Bus Tracking API"}
