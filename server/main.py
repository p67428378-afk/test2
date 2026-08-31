import os
from contextlib import asynccontextmanager
from typing import Dict
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import attendance, bookings, guides, schedules, tours


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to initialize database and seed initial data."""
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Museum Tour Management System API",
    description="API for managing museum tour routes, schedules, guide assignments, visitor bookings, capacity controls, and attendance check-in.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware Configuration
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
app.include_router(tours.router)
app.include_router(guides.router)
app.include_router(schedules.router)
app.include_router(bookings.router)
app.include_router(attendance.router)


@app.get("/health", response_model=Dict[str, str], tags=["Health"])
def health_check():
    """Health check endpoint for container environments and uptime monitors."""
    return {"status": "healthy", "service": "museum-tour-management"}


@app.get("/", response_model=Dict[str, str], tags=["Root"])
def root():
    """Root endpoint with service summary and documentation links."""
    return {
        "message": "Museum Tour Management System API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }
