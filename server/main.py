import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import visitors, deliveries, alerts


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for database initialization and seeding."""
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Visitor Management System API",
    description="RESTful API for residential visitor pre-approval, QR entry validation, delivery tracking, and security alerts.",
    version="1.0.0",
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

# Register API Routers
app.include_router(visitors.router)
app.include_router(deliveries.router)
app.include_router(alerts.router)


@app.get("/")
def root():
    return {
        "message": "Visitor Management System API is running",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
