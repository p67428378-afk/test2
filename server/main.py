import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from server.database import init_db, seed_data, get_db, SessionLocal
from server.routers import (
    auth,
    photographers,
    packages,
    sessions,
    payments,
    photoshoots,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed default accounts
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Photography Studio Management System API",
    version="1.0.0",
    description="Backend API for customer booking, photographer availability, packages, payments, and photoshoot tracking.",
    lifespan=lifespan,
)

# Configure CORS Middleware
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

# Register API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(photographers.router, prefix="/api/v1")
app.include_router(packages.router, prefix="/api/v1")
app.include_router(sessions.router, prefix="/api/v1")
app.include_router(payments.router, prefix="/api/v1")
app.include_router(photoshoots.router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Photography Studio Management System API",
        "docs": "/docs",
        "health": "/health",
    }
