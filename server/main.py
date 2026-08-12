import os
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import (
    trains,
    stations,
    delays,
    telemetry,
    websocket,
    health,
)

# Initialize database tables for SCRUM-39
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="Real-Time Train Tracking Application API",
    description="Backend service providing REST and WebSocket APIs for live train tracking, station schedules, and delay alerts.",
    version="1.0.0",
)


# Custom OpenAPI schema generator to include WebSocket endpoint
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    if "/api/v1/ws/trains/live" not in openapi_schema["paths"]:
        openapi_schema["paths"]["/api/v1/ws/trains/live"] = {}

    ws_schema = {
        "tags": ["websockets"],
        "summary": "Streaming WebSocket endpoint broadcasting live coordinate payloads",
        "description": "Streaming WebSocket endpoint broadcasting live coordinate payloads",
        "responses": {
            "101": {"description": "Switching Protocols to WebSocket live stream"}
        },
    }
    openapi_schema["paths"]["/api/v1/ws/trains/live"]["get"] = ws_schema
    openapi_schema["paths"]["/api/v1/ws/trains/live"]["ws"] = ws_schema

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

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
app.include_router(trains.router, prefix="/api/v1", tags=["trains"])
app.include_router(stations.router, prefix="/api/v1", tags=["stations"])
app.include_router(delays.router, prefix="/api/v1", tags=["delays"])
app.include_router(telemetry.router, prefix="/api/v1", tags=["telemetry"])
app.include_router(websocket.router, prefix="/api/v1", tags=["websockets"])
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(
    health.router, tags=["health"]
)  # Also exposes GET /health at root level


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Real-Time Train Tracking Application API",
        "docs": "/docs",
        "health": "/health",
    }
