import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.api.v1.endpoints.parking_spots import router as parking_router
from server.api.v1.endpoints.realtime import router as realtime_router
from server.database import SessionLocal, init_db, seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe DB schema initialization and seeding via importable functions
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="ParkFind Locator API",
    description="Real-time Parking Spot Locator and Dynamic Hourly Rates API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(parking_router, prefix="/api/v1")
app.include_router(realtime_router)


@app.get("/health", response_model=dict)
def health_check():
    return {"status": "healthy", "service": "parking-locator-api"}


@app.get("/", response_model=dict)
def root():
    return {"message": "Welcome to ParkFind Locator API", "docs": "/docs"}
