from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from server.database import init_db, SessionLocal, seed_data
from server.routers import (
    schedules,
    expeditions,
    equipment,
    fuel,
    weather,
    crew,
    samples,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Ocean Research Vessel Management Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
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

# Include Routers
app.include_router(schedules.router, prefix="/api/v1")
app.include_router(expeditions.router, prefix="/api/v1")
app.include_router(equipment.router, prefix="/api/v1")
app.include_router(fuel.router, prefix="/api/v1")
app.include_router(weather.router, prefix="/api/v1")
app.include_router(crew.router, prefix="/api/v1")
app.include_router(samples.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Ocean Research Vessel Management Platform API"}
