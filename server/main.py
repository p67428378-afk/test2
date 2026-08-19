import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import maintenance_events


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed sample data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="WiFi Maintenance Tracker API",
    description="REST API for recording WiFi maintenance activities and analyzing costs",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
)
allowed_origins = [
    origin.strip() for origin in raw_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(maintenance_events.router)


@app.get("/")
def root():
    return {
        "app": "WiFi Maintenance Tracker API",
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
