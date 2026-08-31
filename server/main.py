"""Museum Tour Management System FastAPI Application."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import attendance, bookings, guides, schedules, tours


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
    title="Museum Tour Management System API",
    description="API for museum guided tour scheduling, visitor booking, capacity enforcement, guide assignment, and attendance recording.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(tours.router)
app.include_router(guides.router)
app.include_router(schedules.router)
app.include_router(bookings.router)
app.include_router(attendance.router)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "museum-tour-management-api"}
