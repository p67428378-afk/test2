import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import parking_spots, realtime


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema & seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="ParkFind Locator & Hourly Rates API",
    description="Real-time parking spot locator, hourly rate calculator, and availability streaming platform.",
    version="1.0.0",
    lifespan=lifespan,
)

# Mandatory CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(
    parking_spots.router,
    prefix="/api/v1/parking-spots",
    tags=["parking-spots"],
)

app.include_router(
    realtime.router,
    prefix="/api/v1/parking-spots",
    tags=["realtime"],
)


@app.get("/api/v1/health", tags=["system"])
def health_check():
    return {
        "status": "healthy",
        "service": "parking-locator-api",
        "version": "1.0.0",
    }


@app.get("/", tags=["system"])
def root():
    return {
        "message": "Welcome to the ParkFind Locator API",
        "docs_url": "/docs",
        "health_url": "/api/v1/health",
    }
