import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import visitors, deliveries, alerts, recurring, overstay

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schema...")
    init_db()
    db = SessionLocal()
    try:
        logger.info("Seeding initial data...")
        seed_data(db)
    finally:
        db.close()
    yield
    logger.info("Shutting down application...")


app = FastAPI(
    title="Visitor Management System API",
    version="1.0.0",
    description="API for residential community visitor pre-approvals, gate QR scans, courier packages, alerts, and overstay monitoring.",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS_ENV = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(visitors.router)
app.include_router(deliveries.router)
app.include_router(alerts.router)
app.include_router(recurring.router)
app.include_router(overstay.router)


@app.get("/")
def root():
    return {
        "message": "Visitor Management System API is running",
        "docs_url": "/docs",
        "status": "healthy",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
