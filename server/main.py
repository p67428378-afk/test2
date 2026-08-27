import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text

from server.database import init_db, seed_data, SessionLocal
from server.api.v1.weather import router as weather_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize tables and seed data idempotently
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="SkyPulse Local Weather Dashboard API",
    description="RESTful API for real-time weather forecasts, interactive temperature trends, and location search.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(weather_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint to verify database connectivity and service status."""
    db_status = "unknown"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"

    return {
        "status": "ok",
        "service": "weather-api",
        "version": "1.0.0",
        "database": db_status,
    }
