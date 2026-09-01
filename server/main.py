import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import SessionLocal, init_db, seed_data
from server.routers import (
    appointments,
    auth,
    entry_exit_logs,
    gate,
    inmates,
    verifications,
    visitors,
    watchlist,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database Tables and Seed Data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="Prison Visitor Management System API",
    description="Automated Gate Control, Express QR Passes, Dynamic Quotas, and Real-Time Watchlist Screening",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(visitors.router)
app.include_router(inmates.router)
app.include_router(appointments.router)
app.include_router(gate.router)
app.include_router(watchlist.router)
app.include_router(verifications.router)
app.include_router(entry_exit_logs.router)


@app.get("/")
def root():
    return {
        "system": "Prison Visitor Management System",
        "version": "2.0.0",
        "status": "OPERATIONAL",
        "endpoints": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "version": "2.0.0"}
